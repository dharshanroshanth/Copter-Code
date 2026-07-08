import React, { useState, useRef } from 'react';
import { useStore, store } from '../store';
import { FileText, Upload, Copy, Loader2, ArrowLeft, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { motion, AnimatePresence } from 'motion/react';

export default function OCRScanner() {
  const { selectedImage } = useStore();
  const [image, setImage] = useState<string | null>(selectedImage || null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResultText(null);
        setCopied(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const scanText = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const worker = await createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      const { data: { text } } = await worker.recognize(image);
      setResultText(text);
      await worker.terminate();
    } catch (error) {
      console.error('Error scanning text:', error);
      alert('Failed to scan document. Please try a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (resultText) {
      navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <button onClick={() => store.setView('dashboard')} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-[18px] font-extrabold text-slate-900 tracking-tight">OCR Document Scanner</h1>
              <p className="text-[13px] font-medium text-slate-500">Extract text from images automatically</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 flex justify-center">
        <div className="max-w-4xl w-full space-y-6">
          {!image ? (
            <div className="border-2 border-dashed border-slate-300 rounded-3xl h-[400px] flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-[18px] font-bold text-slate-900 mb-2">Upload a document</h3>
              <p className="text-[14px] text-slate-500 font-medium">PNG, JPG, or PDF (first page)</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 h-[600px]">
              <div className="flex-1 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-slate-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Source Document
                  </h3>
                  <button onClick={() => fileInputRef.current?.click()} className="text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors">
                    Upload Different
                  </button>
                </div>
                <div className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden relative flex items-center justify-center">
                  <img src={image} alt="Original" className="max-w-full max-h-full object-contain" />
                  
                  {!resultText && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                      <button onClick={scanText} disabled={isProcessing} className="py-3.5 px-8 rounded-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white text-[14px] font-bold shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                        {isProcessing ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Scanning {progress}%...</>
                        ) : (
                          <><FileText className="w-4 h-4" /> Extract Text Now</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-bold text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Extracted Text
                  </h3>
                  {resultText && (
                    <button onClick={handleCopy} className={`flex items-center gap-1.5 text-[12px] font-bold transition-colors ${copied ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-900'}`}>
                      {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy all'}
                    </button>
                  )}
                </div>
                
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
                   <AnimatePresence mode="wait">
                    {resultText ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full"
                      >
                        <textarea
                          readOnly
                          value={resultText}
                          className="w-full h-full p-6 bg-transparent border-none focus:ring-0 resize-none text-[14px] leading-relaxed text-slate-700 font-mono"
                          placeholder="Extracted text will appear here..."
                        />
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <FileText className="w-12 h-12 mb-3 opacity-30" />
                        <span className="text-[14px] font-medium text-slate-500">Run scanner to extract text</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
    </div>
  );
}
