export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webContentLink?: string;
  iconLink?: string;
  size?: string;
  createdTime: string;
  parents?: string[];
}

export interface ListFilesResponse {
  files: GoogleDriveFile[];
  nextPageToken?: string;
}

// Helper to convert file size to human readable format
export const formatBytes = (bytesStr?: string): string => {
  if (!bytesStr) return 'Unknown size';
  const bytes = parseInt(bytesStr, 10);
  if (isNaN(bytes)) return bytesStr;
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if a mimeType is an image
export const isImageMimeType = (mimeType: string): boolean => {
  return mimeType.startsWith('image/');
};

// Check if a mimeType is a folder
export const isFolderMimeType = (mimeType: string): boolean => {
  return mimeType === 'application/vnd.google-apps.folder';
};

// List files and folders
export const listDriveFiles = async (
  accessToken: string,
  parentId: string = 'root',
  searchQuery: string = '',
  filterType: 'all' | 'images' | 'folders' | 'documents' = 'all'
): Promise<ListFilesResponse> => {
  let q = `'${parentId}' in parents and trashed = false`;

  if (searchQuery) {
    q += ` and name contains '${searchQuery.replace(/'/g, "\\'")}'`;
  }

  if (filterType === 'images') {
    q += " and mimeType stories 'image/'"; // Wait, in Drive API SQL, it's: mimeType typeof 'image/*' or mimeType contains 'image'
    // Actually: mimeType contains 'image/'
    q = q.replace(" and mimeType stories 'image/'", " and mimeType contains 'image/'");
  } else if (filterType === 'folders') {
    q += " and mimeType = 'application/vnd.google-apps.folder'";
  } else if (filterType === 'documents') {
    q += " and mimeType != 'application/vnd.google-apps.folder' and not mimeType contains 'image/'";
  }

  const url = `https://www.googleapis.com/drive/v3/files?pageSize=100&fields=nextPageToken,files(id,name,mimeType,thumbnailLink,webContentLink,iconLink,size,createdTime,parents)&q=${encodeURIComponent(
    q
  )}&orderBy=folder,name`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to fetch files from Google Drive');
  }

  return response.json();
};

// Create a new folder
export const createDriveFolder = async (
  accessToken: string,
  folderName: string,
  parentId: string = 'root'
): Promise<GoogleDriveFile> => {
  const url = 'https://www.googleapis.com/drive/v3/files';
  const body = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to create folder in Google Drive');
  }

  return response.json();
};

// Delete a file or folder (destructive)
export const deleteDriveFile = async (accessToken: string, fileId: string): Promise<boolean> => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to delete file from Google Drive');
  }

  return true;
};

// Fetch image file content as Object URL (bypasses CORS & authentication issues for standard <img src>)
export const getDriveFileBlobUrl = async (accessToken: string, fileId: string): Promise<string> => {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error('Failed to retrieve image content from Google Drive');
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

// Upload a local file to Google Drive using robust multipart/related upload
export const uploadDriveFile = async (
  accessToken: string,
  file: File,
  parentId: string = 'root',
  onProgress?: (progress: number) => void
): Promise<GoogleDriveFile> => {
  // Convert file to Base64 to construct the multipart body
  const fileToBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Strip out the data:image/...;base64, prefix
        const base64Data = base64String.substring(base64String.indexOf(',') + 1);
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const base64Data = await fileToBase64(file);
  const boundary = 'foo_bar_baz_phototoolkit';
  const delimiter = `\r\n--${boundary}\r\n`;
  const close_delim = `\r\n--${boundary}--`;

  const metadata = {
    name: file.name,
    mimeType: file.type,
    parents: [parentId],
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: ' +
    file.type +
    '\r\n' +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64Data +
    close_delim;

  const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to upload file to Google Drive');
  }

  if (onProgress) {
    onProgress(100);
  }

  return response.json();
};

// Upload a Base64 image to Google Drive (e.g. enhanced output)
export const uploadBase64ImageToDrive = async (
  accessToken: string,
  base64DataWithPrefix: string,
  filename: string,
  parentId: string = 'root'
): Promise<GoogleDriveFile> => {
  // Extract content type and raw base64 data
  const mimeMatch = base64DataWithPrefix.match(/^data:([^;]+);base64,/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
  const base64Data = base64DataWithPrefix.substring(base64DataWithPrefix.indexOf(',') + 1);

  const boundary = 'foo_bar_baz_phototoolkit_b64';
  const delimiter = `\r\n--${boundary}\r\n`;
  const close_delim = `\r\n--${boundary}--`;

  const metadata = {
    name: filename,
    mimeType: mimeType,
    parents: [parentId],
  };

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: ' +
    mimeType +
    '\r\n' +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64Data +
    close_delim;

  const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to save image to Google Drive');
  }

  return response.json();
};

// Fetch real storage quota from Google Drive API
export interface GoogleDriveStorageQuota {
  limit: string;
  usage: string;
}

export const getDriveStorageQuota = async (accessToken: string): Promise<GoogleDriveStorageQuota> => {
  const url = 'https://www.googleapis.com/drive/v3/about?fields=storageQuota';
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch storage quota from Google Drive');
  }
  const data = await response.json();
  return data.storageQuota;
};
