import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { store } from '../store';
import {
  googleSignIn,
  logout,
  initAuth,
  getAccessToken,
  setAccessToken,
} from '../lib/firebase';
import {
  listDriveFiles,
  createDriveFolder,
  deleteDriveFile,
  getDriveFileBlobUrl,
  uploadDriveFile,
  GoogleDriveFile,
  formatBytes,
  isImageMimeType,
  isFolderMimeType,
} from '../lib/googleDrive';
import {
  Cloud,
  Folder,
  Image as ImageIcon,
  FileText,
  Search,
  Upload,
  FolderPlus,
  Trash2,
  Download,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  Wand2,
  RefreshCw,
  LogOut,
  Plus,
  CheckCircle2,
  X,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Breadcrumb {
  id: string;
  name: string;
}

export default function GoogleDriveBrowser() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Files and navigation state
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string>('root');
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([{ id: 'root', name: 'Home' }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'folders' | 'documents'>('all');

  // Interactive dialog/modal state
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const [deleteConfirmationFile, setDeleteConfirmationFile] = useState<GoogleDriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // File Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tool integration modal (Import to PhotoToolkit)
  const [selectedImportFile, setSelectedImportFile] = useState<GoogleDriveFile | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Initialize Auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setIsAuthenticated(true);
        setIsLoadingAuth(false);
      },
      () => {
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Fetch files when folder or filters change
  useEffect(() => {
    if (isAuthenticated) {
      loadFiles();
    }
  }, [isAuthenticated, currentFolder, filterType]);

  const loadFiles = async (showLoader = true) => {
    const token = getAccessToken();
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    if (showLoader) setIsLoadingFiles(true);
    setError(null);

    try {
      const response = await listDriveFiles(token, currentFolder, searchQuery, filterType);
      setFiles(response.files);
    } catch (err: any) {
      console.error('Error fetching files:', err);
      setError(err?.message || 'Failed to retrieve Google Drive files.');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoadingAuth(true);
    setError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setError(err?.message || 'Google Sign-In failed.');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUser(null);
      setFiles([]);
      setBreadcrumbs([{ id: 'root', name: 'Home' }]);
      setCurrentFolder('root');
    } catch (err: any) {
      console.error('Logout failed:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFiles();
  };

  const handleFolderClick = (folder: GoogleDriveFile) => {
    const newBreadcrumbs = [...breadcrumbs, { id: folder.id, name: folder.name }];
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolder(folder.id);
    setSearchQuery('');
  };

  const handleBreadcrumbClick = (index: number) => {
    const clickedCrumb = breadcrumbs[index];
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolder(clickedCrumb.id);
    setSearchQuery('');
  };

  // Create folder operation
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const token = getAccessToken();
    if (!token) return;

    setIsCreatingFolder(true);
    setError(null);

    try {
      await createDriveFolder(token, newFolderName.trim(), currentFolder);
      setNewFolderName('');
      setShowCreateFolder(false);
      loadFiles(false); // reload silently
    } catch (err: any) {
      console.error('Create folder error:', err);
      setError(err?.message || 'Failed to create new folder.');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Delete file operation (requires confirmation)
  const handleDeleteFile = async () => {
    if (!deleteConfirmationFile) return;

    const token = getAccessToken();
    if (!token) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteDriveFile(token, deleteConfirmationFile.id);
      setDeleteConfirmationFile(null);
      loadFiles(false); // reload silently
    } catch (err: any) {
      console.error('Delete file error:', err);
      setError(err?.message || 'Failed to delete file from Google Drive.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Upload file operation
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    uploadSingleFile(fileList[0]);
  };

  const uploadSingleFile = async (file: File) => {
    const token = getAccessToken();
    if (!token) return;

    setUploadProgress(10);
    setError(null);

    try {
      await uploadDriveFile(token, file, currentFolder, (p) => {
        setUploadProgress(p);
      });
      setUploadedFile(file.name);
      setTimeout(() => {
        setUploadProgress(null);
        setUploadedFile(null);
      }, 3000);
      loadFiles(false); // reload silently
    } catch (err: any) {
      console.error('Upload file error:', err);
      setError(err?.message || `Failed to upload file "${file.name}".`);
      setUploadProgress(null);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const filesList = e.dataTransfer.files;
    if (filesList && filesList.length > 0) {
      uploadSingleFile(filesList[0]);
    }
  };

  // Import to editor
  const handleImportToEditor = async (targetTool: 'enhancer' | 'bg-remover' | 'obj-remover' | 'ocr' | 'passport') => {
    if (!selectedImportFile) return;

    const token = getAccessToken();
    if (!token) return;

    setIsImporting(true);
    setError(null);

    try {
      const blobUrl = await getDriveFileBlobUrl(token, selectedImportFile.id);
      
      // Save the loaded blob URL in the app store as the selected active image
      store.setSelectedImage(blobUrl);
      
      // Navigate to the target tool page
      store.setView(targetTool);
      setSelectedImportFile(null);
    } catch (err: any) {
      console.error('Import to editor error:', err);
      setError('Could not import image content. Please make sure the file is valid and accessible.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 selection:bg-indigo-100 selection:text-indigo-900" id="google-drive-browser-root">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider mb-1">
            <Cloud className="w-4 h-4" /> Google Cloud Storage
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Google Drive Integration</h1>
          <p className="text-slate-500 mt-1">Browse folders, upload creative projects, and import photos directly into your editing toolbox.</p>
        </div>
        {isAuthenticated && user && (
          <div className="flex items-center gap-3 bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm self-start md:self-auto">
            <img src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&q=80'} alt={user.displayName} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
            <div className="text-left hidden sm:block">
              <div className="text-[13px] font-bold text-slate-800 leading-tight">{user.displayName}</div>
              <div className="text-[11px] text-slate-500 leading-none">{user.email}</div>
            </div>
            <button onClick={handleSignOut} className="ml-2 text-slate-400 hover:text-rose-600 p-1.5 hover:bg-slate-50 rounded-lg transition-colors" title="Disconnect Google Account">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isLoadingAuth ? (
          <div className="min-h-[400px] flex items-center justify-center bg-white border border-slate-200 rounded-3xl" key="auth-loader">
            <div className="text-center space-y-3">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
              <p className="text-sm text-slate-500 font-medium">Checking authentication status...</p>
            </div>
          </div>
        ) : !isAuthenticated ? (
          /* Landing/OAuth Sign-in View */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white border border-slate-200 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-12 text-center max-w-2xl mx-auto mt-8"
            key="sign-in-prompt"
          >
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md shadow-indigo-100">
              <Cloud className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Connect Your Google Drive</h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto mb-8">
              Access images and projects stored in Google Drive, enhance them instantly, and back up your completed designs back to the cloud. Safe, secured, and seamless.
            </p>

            {error && (
              <div className="p-4 mb-6 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-xs font-semibold max-w-md mx-auto text-center flex items-center gap-2 justify-center">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Official Material Design Google Button */}
            <button onClick={handleSignIn} className="gsi-material-button mx-auto shadow-sm">
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: 'block' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents font-semibold">Sign in with Google</span>
              </div>
            </button>
          </motion.div>
        ) : (
          /* Authenticated File Browser View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
            key="authenticated-browser"
          >
            {/* Main Browser panel */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Filter, Search & Controls Bar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                
                {/* Filter Tabs */}
                <div className="flex bg-slate-50 p-1 border border-slate-100 rounded-xl self-start">
                  {[
                    { id: 'all', label: 'All Files' },
                    { id: 'images', label: 'Photos' },
                    { id: 'folders', label: 'Folders' },
                    { id: 'documents', label: 'Documents' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setFilterType(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        filterType === tab.id
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 md:max-w-xs relative w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/10 focus:border-[#6366F1] focus:bg-white transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        loadFiles();
                      }}
                      className="absolute right-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </form>

                {/* Folder & Refresh Actions */}
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => setShowCreateFolder(true)}
                    className="h-9 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    title="Create Folder"
                  >
                    <FolderPlus className="w-4 h-4" /> New Folder
                  </button>
                  <button
                    onClick={() => loadFiles(true)}
                    className="w-9 h-9 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center transition-colors"
                    title="Refresh List"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Breadcrumbs Navigation */}
              <div className="flex items-center gap-1 text-[13px] font-semibold text-slate-500 overflow-x-auto pb-1">
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={crumb.id}>
                    {idx > 0 && <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />}
                    <button
                      onClick={() => handleBreadcrumbClick(idx)}
                      className={`hover:text-[#6366F1] transition-colors whitespace-nowrap shrink-0 ${
                        idx === breadcrumbs.length - 1 ? 'text-[#6366F1] font-bold' : ''
                      }`}
                    >
                      {crumb.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {error && (
                <div className="p-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Grid Content */}
              {isLoadingFiles ? (
                <div className="min-h-[300px] flex items-center justify-center bg-white border border-slate-100 rounded-3xl shadow-sm">
                  <div className="text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                    <p className="text-xs text-slate-400 font-medium">Fetching directory files...</p>
                  </div>
                </div>
              ) : files.length === 0 ? (
                <div className="min-h-[300px] flex flex-col items-center justify-center bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm">
                  <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-4">
                    <Folder className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">No items found</h3>
                  <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                    This directory is empty. Try creating a folder, changing your filters, or uploading a file.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" id="drive-files-grid">
                  {files.map((file) => {
                    const isFolder = isFolderMimeType(file.mimeType);
                    const isImg = isImageMimeType(file.mimeType);

                    return (
                      <div
                        key={file.id}
                        className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 group flex flex-col justify-between transition-all"
                      >
                        {/* Thumbnail / Icon Section */}
                        <div
                          className="aspect-[4/3] bg-slate-50 border-b border-slate-100 relative flex items-center justify-center overflow-hidden cursor-pointer"
                          onClick={() => isFolder ? handleFolderClick(file) : isImg ? setSelectedImportFile(file) : null}
                        >
                          {isImg && file.thumbnailLink ? (
                            <img
                              src={file.thumbnailLink.replace(/=s220$/, '=s400')}
                              alt={file.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : isFolder ? (
                            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                              <Folder className="w-6 h-6" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center">
                              <FileText className="w-6 h-6" />
                            </div>
                          )}

                          {/* Quick Action Badges */}
                          {isImg && (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImportFile(file);
                                }}
                                className="p-1.5 bg-[#6366F1] hover:bg-indigo-600 text-white rounded-lg shadow-md transition-colors"
                                title="Import to PhotoToolkit"
                              >
                                <Wand2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* File Details Section */}
                        <div className="p-3 text-left">
                          <div
                            className="font-semibold text-xs text-slate-800 truncate mb-1 cursor-pointer hover:text-indigo-600 transition-colors"
                            onClick={() => isFolder ? handleFolderClick(file) : isImg ? setSelectedImportFile(file) : null}
                            title={file.name}
                          >
                            {file.name}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>{isFolder ? 'Folder' : formatBytes(file.size)}</span>
                            <span>{new Date(file.createdTime).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Bottom Actions Row */}
                        <div className="px-3 pb-3 pt-1 border-t border-slate-50 flex items-center justify-between gap-1">
                          {isImg ? (
                            <button
                              onClick={() => setSelectedImportFile(file)}
                              className="flex-1 h-7 bg-[#6366F1] hover:bg-indigo-600 text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all"
                            >
                              <Wand2 className="w-3.5 h-3.5" /> Edit Photo
                            </button>
                          ) : isFolder ? (
                            <button
                              onClick={() => handleFolderClick(file)}
                              className="flex-1 h-7 bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all"
                            >
                              Open Folder
                            </button>
                          ) : (
                            <a
                              href={file.webContentLink || '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 h-7 bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-all"
                            >
                              <ExternalLink className="w-3 h-3" /> View
                            </a>
                          )}

                          <button
                            onClick={() => setDeleteConfirmationFile(file)}
                            className="w-7 h-7 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 text-slate-400 hover:text-rose-600 rounded-lg flex items-center justify-center transition-all"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar Upload Queue panel */}
            <div className="space-y-6">
              
              {/* Local File Backups Widget */}
              <div
                className={`bg-white border-2 rounded-2xl p-6 text-center shadow-sm transition-all relative ${
                  isDragging ? 'border-dashed border-indigo-400 bg-indigo-50/40' : 'border-slate-200'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Upload to Drive</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Drag and drop local images or click below to back up files directly to this Google Drive folder.
                </p>

                <input
                  type="file"
                  id="drive-local-file-input"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,application/pdf"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-9 mt-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Select File
                </button>

                {/* Progress HUD Overlay */}
                <AnimatePresence>
                  {uploadProgress !== null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center p-4"
                    >
                      {uploadedFile ? (
                        <div className="text-center space-y-2">
                          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                          <p className="text-xs font-bold text-slate-800 truncate max-w-[200px]">{uploadedFile}</p>
                          <p className="text-[11px] text-emerald-600 font-semibold">Upload completed successfully!</p>
                        </div>
                      ) : (
                        <div className="w-full px-4 text-center space-y-3">
                          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                          <p className="text-xs text-slate-500 font-semibold">Uploading asset data...</p>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold">{Math.round(uploadProgress)}%</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* App Tips */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left">
                <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-amber-500" /> PhotoToolkit Workspace
                </h4>
                <ul className="text-[11px] text-slate-500 space-y-2.5 leading-relaxed font-medium">
                  <li>
                    💡 <span className="font-bold text-slate-700">Instant Import</span>: Hover on any photo card and click "Edit Photo" to open it directly inside PhotoToolkit's powerful AI engines.
                  </li>
                  <li>
                    📁 <span className="font-bold text-slate-700">Keep Organized</span>: Create folders to separate backgrounds, enhanced raw images, and multi-layered mockups.
                  </li>
                  <li>
                    🔒 <span className="font-bold text-slate-700">Secure Backups</span>: Photos edited inside our Quick Tools are securely exportable back to Google Drive as pristine PNG/JPG outputs.
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Create Folder Dialog */}
      <AnimatePresence>
        {showCreateFolder && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-indigo-600" /> New Folder
                </h3>
                <button
                  onClick={() => setShowCreateFolder(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateFolder} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Folder Name</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Edited Portraits"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateFolder(false)}
                    className="h-9 px-4 text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingFolder}
                    className="h-9 px-4 bg-[#6366F1] hover:bg-indigo-600 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    {isCreatingFolder && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Create Folder
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Destructive Delete Confirmation Dialog (MANDATORY) */}
      <AnimatePresence>
        {deleteConfirmationFile && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4 text-left"
            >
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">Confirm Deletion</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5">
                  Are you absolutely sure you want to delete <span className="font-bold text-slate-800">"{deleteConfirmationFile.name}"</span>? This will permanently remove the item from your Google Drive. This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmationFile(null)}
                  className="h-9 px-4 text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteFile}
                  disabled={isDeleting}
                  className="h-9 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Select Target Tool (Wand tool integration) */}
      <AnimatePresence>
        {selectedImportFile && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-left relative overflow-hidden"
            >
              <button
                onClick={() => setSelectedImportFile(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 pr-6">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">Import Image</h3>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                    Select which AI-powered PhotoToolkit tool you would like to open <span className="font-semibold text-slate-800">"{selectedImportFile.name}"</span> with.
                  </p>
                </div>
              </div>

              {/* Selection list */}
              <div className="space-y-2 pt-2">
                {[
                  { id: 'enhancer', label: 'Image Enhancer', desc: 'Restore clarity, fix lighting, and sharpen edge details.', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100/50 border-emerald-100' },
                  { id: 'bg-remover', label: 'Background Remover', desc: 'Isolate subjects and export transparent background PNGs.', color: 'bg-sky-50 text-sky-600 hover:bg-sky-100/50 border-sky-100' },
                  { id: 'obj-remover', label: 'Object Remover', desc: 'Erase unwanted photobombers, text, or elements.', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100/50 border-amber-100' },
                  { id: 'ocr', label: 'OCR Text Scanner', desc: 'Extract readable, copyable text layout structures from images.', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100/50 border-purple-100' },
                  { id: 'passport', label: 'Passport Photo Generator', desc: 'Crop, resize, and background-color filter custom ID sheets.', color: 'bg-rose-50 text-rose-600 hover:bg-rose-100/50 border-rose-100' },
                ].map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleImportToEditor(tool.id as any)}
                    disabled={isImporting}
                    className={`w-full flex items-center justify-between p-3.5 border rounded-2xl text-left transition-all hover:scale-[1.01] ${tool.color}`}
                  >
                    <div>
                      <div className="font-bold text-xs">{tool.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{tool.desc}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70 shrink-0" />
                  </button>
                ))}
              </div>

              {isImporting && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <p className="text-xs text-slate-600 font-bold">Importing image asset to workspace...</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
