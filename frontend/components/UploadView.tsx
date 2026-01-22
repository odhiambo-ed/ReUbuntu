"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  CloudUpload,
  FileText,
  X,
  CheckCircle,
  ArrowRight,
  History,
  MoreVertical,
  Download,
  Trash2,
} from "lucide-react";
import { Upload } from "../types";

interface UploadViewProps {
  uploads: Upload[];
}

const UploadView: React.FC<UploadViewProps> = ({ uploads }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".csv")) {
        setSelectedFile(file);
      } else {
        alert("Please upload a CSV file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setShowSuccess(true);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const reset = () => {
    setSelectedFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setShowSuccess(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Inventory CSV Upload
        </h2>
        <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
          Manage your deadstock at scale. Upload your inventory files to sync
          products across all channels and get automated secondary market
          pricing.
        </p>
      </div>

      {!showSuccess && !isUploading && (
        <div
          className={`
            relative group p-12 border-4 border-dashed rounded-[40px] transition-all duration-500 flex flex-col items-center justify-center gap-6
            ${dragActive ? "border-teal-500 bg-teal-50 scale-[1.01]" : "border-slate-100 bg-white hover:border-slate-200"}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div
            className={`
            w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500
            ${selectedFile ? "bg-teal-500 text-white shadow-xl shadow-teal-500/30" : "bg-slate-50 text-slate-300 group-hover:bg-slate-100"}
          `}
          >
            {selectedFile ? <FileText size={40} /> : <CloudUpload size={40} />}
          </div>

          <div className="text-center">
            {selectedFile ? (
              <div className="space-y-2">
                <p className="text-xl font-black text-slate-900">
                  {selectedFile.name}
                </p>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xl font-bold text-slate-900">
                  Drag & drop your CSV file here or{" "}
                  <span
                    className="text-teal-500 cursor-pointer hover:underline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    click to browse
                  </span>
                </p>
                <p className="text-sm text-slate-400">
                  Supported formats: .csv, .xlsx. Max file size: 10MB.
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  Use our standard template for faster processing.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {selectedFile ? (
              <>
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="px-8 py-3 bg-teal-500 text-white font-black rounded-2xl hover:bg-teal-600 shadow-xl shadow-teal-500/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  Upload & Process <ArrowRight size={18} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-teal-500 text-white font-black rounded-2xl hover:bg-teal-600 shadow-xl shadow-teal-500/20 transition-all active:scale-95"
                >
                  Browse Files
                </button>
                <button className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-900/10 transition-all active:scale-95 flex items-center gap-2">
                  <Download size={18} /> Download Template
                </button>
              </>
            )}
          </div>

          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileChange}
          />
        </div>
      )}

      {isUploading && (
        <div className="bg-white border border-slate-200 p-10 rounded-[40px] shadow-sm animate-in fade-in duration-500">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                <FileText size={28} />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900">
                  {selectedFile?.name}
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  Processing rows and calculating resale values...
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-100">
              Processing
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm font-black">
              <span className="text-slate-900 uppercase tracking-widest text-xs">
                Processing Status
              </span>
              <span className="text-teal-600">{uploadProgress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 font-semibold italic">
              Analyzing merchant_id and SKU uniqueness...
            </p>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="bg-white border-2 border-teal-500/30 p-10 rounded-[40px] shadow-2xl shadow-teal-500/5 animate-in zoom-in duration-500">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
              <CheckCircle size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                Upload Complete!
              </h3>
              <p className="text-slate-500 max-w-sm">
                <span className="text-teal-600 font-black">20 of 20</span> rows
                imported successfully. Auto-pricing has been applied to all
                eligible items.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <Link
                href="/dashboard/inventory"
                className="px-8 py-3 bg-teal-500 text-white font-black rounded-2xl hover:bg-teal-600 transition-all active:scale-95 shadow-xl shadow-teal-500/20 flex items-center gap-2"
              >
                View Inventory <ArrowRight size={18} />
              </Link>
              <button
                onClick={reset}
                className="px-8 py-3 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all"
              >
                Upload Another
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
          <History size={24} className="text-teal-500" />
          Recent Uploads
        </h3>
        <div className="space-y-4">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="bg-white p-5 rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 group-hover:bg-teal-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-colors">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 tracking-tight">
                    {upload.filename}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {new Date(upload.created_at).toLocaleDateString()} •{" "}
                    {upload.total_rows} items
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Status
                  </p>
                  <span
                    className={`
                    text-xs font-black
                    ${upload.status === "completed" ? "text-teal-600" : "text-orange-500"}
                  `}
                  >
                    {upload.status === "completed"
                      ? "Successful"
                      : "Processing"}
                  </span>
                </div>
                <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadView;
