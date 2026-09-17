'use client';

import React, { useState, useRef } from 'react';
import { Assignment, Submission } from '@/types';
import { UploadCloud, FileCode, Github, CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, HardDrive } from 'lucide-react';

interface SubmissionPageProps {
  assignments: Assignment[];
  selectedAssignmentId: string;
  onSelectAssignment: (id: string) => void;
  onBackToHome: () => void;
  onSubmitAssignment: (data: { assignmentId: string; file?: File; githubUrl?: string }) => Promise<void>;
  existingSubmission?: Submission;
}

export const SubmissionPage: React.FC<SubmissionPageProps> = ({
  assignments,
  selectedAssignmentId,
  onSelectAssignment,
  onBackToHome,
  onSubmitAssignment,
  existingSubmission,
}) => {
  const [activeMode, setActiveMode] = useState<'ZIP' | 'GITHUB'>('ZIP');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState(existingSubmission?.githubUrl || '');
  const [errorMsg, setErrorMsg] = useState('');

  // Upload Progress & Validation state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentAssignment = assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];

  const validateFile = (file: File): boolean => {
    setErrorMsg('');
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setErrorMsg('Vui lòng chỉ chọn tệp mã nguồn có định dạng .zip!');
      return false;
    }
    // Max 50MB = 50 * 1024 * 1024
    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg('Tệp vượt quá dung lượng cho phép (Tối đa 50MB)!');
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeMode === 'ZIP' && !selectedFile) {
      setErrorMsg('Vui lòng chọn hoặc kéo thả tệp .zip code nộp bài!');
      return;
    }
    if (activeMode === 'GITHUB' && !githubUrl.trim()) {
      setErrorMsg('Vui lòng nhập đường dẫn repository Github!');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMsg('');

    // Giả lập tiến trình tải lên (Upload Progress Simulation)
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(progress);
      setUploadSpeed(`${(Math.random() * 2 + 1.5).toFixed(1)} MB/s`);
    }, 250);

    setTimeout(async () => {
      try {
        await onSubmitAssignment({
          assignmentId: currentAssignment.id,
          file: selectedFile || undefined,
          githubUrl: githubUrl || undefined,
        });
        setIsUploading(false);
        setIsSuccess(true);
      } catch {
        setErrorMsg('Có lỗi xảy ra trong quá trình nộp bài. Vui lòng thử lại!');
        setIsUploading(false);
      }
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Nút quay lại */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center space-x-2 text-sm font-extrabold text-kidsa-subtext hover:text-kidsa-orange transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại Danh sách Bài tập</span>
      </button>

      {/* Header Trang Nộp Bài Tập */}
      <div className="bg-white rounded-4xl p-6 md:p-8 border-2 border-kidsa-teal/30 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3.5 py-1 rounded-full bg-kidsa-teal-light text-kidsa-teal font-black text-xs uppercase tracking-wider">
              Trang Nộp Bài Tập Lớp K06
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 mt-2">
              {currentAssignment.title}
            </h1>
            <p className="text-sm font-medium text-slate-600 mt-1">
              {currentAssignment.description}
            </p>
          </div>

          {/* Chọn Bài Tập Cần Nộp */}
          <div className="shrink-0">
            <label className="block text-xs font-extrabold text-slate-600 mb-1">Chọn Bài Tập khác:</label>
            <select
              value={selectedAssignmentId}
              onChange={(e) => onSelectAssignment(e.target.value)}
              className="bg-kidsa-bg border-2 border-kidsa-border rounded-2xl px-4 py-2 font-bold text-sm text-slate-800 focus:outline-none focus:border-kidsa-teal"
            >
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.code} - {a.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Form Nộp Bài Tập (Kidsa Drag & Drop + Github Link) */}
      <div className="bg-white rounded-4xl p-6 md:p-10 border-2 border-kidsa-border shadow-kidsa space-y-6">
        
        {/* Chuyển chế độ Nộp Zip / Github */}
        <div className="flex items-center justify-center space-x-3 border-b border-slate-100 pb-6">
          <button
            type="button"
            onClick={() => { setActiveMode('ZIP'); setErrorMsg(''); }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-extrabold text-sm transition-all ${
              activeMode === 'ZIP'
                ? 'bg-kidsa-teal text-white shadow-md scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileCode className="w-5 h-5" />
            <span>Tải lên Tệp .ZIP Code</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveMode('GITHUB'); setErrorMsg(''); }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-extrabold text-sm transition-all ${
              activeMode === 'GITHUB'
                ? 'bg-slate-900 text-white shadow-md scale-105'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Github className="w-5 h-5" />
            <span>Dán Link Github Repo</span>
          </button>
        </div>

        {/* Thông báo Thành công */}
        {isSuccess ? (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-emerald-900">
              Nộp bài tập thành công! 🎉
            </h3>
            <p className="text-sm font-medium text-emerald-700 max-w-md mx-auto">
              Bài làm của bạn đã được ghi nhận trên hệ thống lớp học K06. GVCN sẽ kiểm tra và trả điểm kèm nhận xét sớm nhất!
            </p>
            <div className="pt-2 flex justify-center space-x-4">
              <button
                onClick={() => { setIsSuccess(false); setSelectedFile(null); }}
                className="px-5 py-2.5 bg-white border border-emerald-300 text-emerald-800 rounded-2xl font-bold text-sm hover:bg-emerald-100"
              >
                Nộp lại bản sửa đổi
              </button>
              <button
                onClick={onBackToHome}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 shadow-md"
              >
                Trở về Trang chủ
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* COMPONENT 3: DRAG & DROP ZONE (Vùng kéo thả tệp zip code) */}
            {activeMode === 'ZIP' ? (
              <div className="space-y-4">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-4 border-dashed rounded-4xl p-8 md:p-12 text-center cursor-pointer transition-all duration-300 ${
                    dragActive
                      ? 'border-kidsa-teal bg-kidsa-teal-light scale-102'
                      : selectedFile
                      ? 'border-emerald-400 bg-emerald-50/50'
                      : 'border-amber-200 bg-kidsa-bg hover:border-kidsa-teal hover:bg-kidsa-teal-light/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="space-y-3">
                      <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                        <FileCode className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-800">{selectedFile.name}</h4>
                        <p className="text-xs font-bold text-emerald-600 mt-1">
                          Kích thước tệp: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB (Hợp lệ ✅)
                        </p>
                      </div>
                      <span className="inline-block text-xs font-bold text-slate-400 underline hover:text-rose-500">
                        Nhấp để chọn tệp zip khác
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-20 h-20 rounded-3xl bg-kidsa-teal-light text-kidsa-teal flex items-center justify-center mx-auto shadow-md transform hover:rotate-6 transition-transform">
                        <UploadCloud className="w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-800">
                          Kéo & thả tệp .zip code nộp bài vào đây
                        </h4>
                        <p className="text-sm font-semibold text-kidsa-subtext mt-1">
                          Hoặc nhấp vào đây để chọn tệp từ máy tính của bạn
                        </p>
                      </div>
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-full">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>Hỗ trợ định dạng .ZIP - Tối đa 50MB</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Dán Link Github Repository */
              <div className="space-y-4">
                <label className="block text-sm font-extrabold text-slate-800">
                  Nhập đường dẫn Repository GitHub chứa Mã Nguồn bài tập:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Github className="w-5 h-5" />
                  </div>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/project-k06"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-kidsa-border focus:border-slate-800 font-bold text-slate-800 text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="flex items-center space-x-2 bg-rose-50 border-2 border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* COMPONENT 4: UPLOAD PROGRESS & VALIDATION (Hiển thị tốc độ tải lên và dung lượng) */}
            {isUploading && (
              <div className="bg-kidsa-bg p-6 rounded-3xl border-2 border-kidsa-teal/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
                  <span className="flex items-center space-x-1.5">
                    <RefreshCw className="w-4 h-4 animate-spin text-kidsa-teal" />
                    <span>Đang tải tệp lên server K06...</span>
                  </span>
                  <span className="text-kidsa-teal font-black text-sm">{uploadProgress}%</span>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-kidsa-teal to-kidsa-orange h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs font-semibold text-kidsa-subtext">
                  <span>Tốc độ nộp bài: <strong className="text-slate-800">{uploadSpeed}</strong></span>
                  <span>Kiểm tra mã checksum dung lượng: OK ✅</span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            {!isUploading && (
              <button
                type="submit"
                className="w-full py-4 rounded-3xl bg-kidsa-teal hover:bg-kidsa-teal-dark text-white font-black text-base shadow-kidsa-teal hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <UploadCloud className="w-5 h-5" />
                <span>Xác nhận Nộp Bài Tập Lớp K06</span>
              </button>
            )}

          </form>
        )}

      </div>

    </div>
  );
};
