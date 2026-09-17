'use client';

import React, { useState } from 'react';
import { Submission, Assignment, User } from '@/types';
import { Users, FileSpreadsheet, Edit3, CheckCircle2, Clock, Search, ExternalLink, FileCode, Github, Sparkles, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface TeacherDashboardProps {
  assignments: Assignment[];
  submissions: Submission[];
  students: User[];
  onUpdateGrade: (submissionId: string, score: number, comment: string) => Promise<void>;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  assignments,
  submissions,
  students,
  onUpdateGrade,
}) => {
  const [selectedAssignmentFilter, setSelectedAssignmentFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal Chấm Điểm
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(10);
  const [commentInput, setCommentInput] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Lọc danh sách bài làm
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesAsm = selectedAssignmentFilter === 'ALL' || sub.assignmentId === selectedAssignmentFilter;
    const matchesSearch = sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesAsm && matchesSearch;
  });

  // COMPONENT 8: EXPORT EXCEL (Nút xuất bảng điểm lớp học ra file Excel .xlsx)
  const handleExportExcel = () => {
    const exportData = submissions.map((sub, idx) => ({
      'STT': idx + 1,
      'Mã Lớp': 'K06',
      'Họ và Tên Học Sinh': sub.studentName,
      'Email': sub.studentEmail,
      'Tên Bài Tập': sub.assignmentTitle,
      'Tệp .Zip Nộp': sub.fileName || 'N/A',
      'Github Repository': sub.githubUrl || 'N/A',
      'Thời Gian Nộp': new Date(sub.submittedAt).toLocaleString('vi-VN'),
      'Trạng Thái': sub.status === 'GRADED' ? 'Đã Chấm' : 'Chờ Chấm',
      'Điểm Số (/10)': sub.feedback ? sub.feedback.score : 'Chưa Có',
      'Lời Phê Của GVCN': sub.feedback ? sub.feedback.comment : '',
      'Thời Gian Chấm': sub.feedback ? new Date(sub.feedback.gradedAt).toLocaleString('vi-VN') : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Tự động căn chỉnh độ rộng cột Excel
    const colWidths = [
      { wch: 6 },  // STT
      { wch: 10 }, // Mã Lớp
      { wch: 22 }, // Họ Tên
      { wch: 25 }, // Email
      { wch: 35 }, // Tên bài tập
      { wch: 25 }, // Tệp zip
      { wch: 35 }, // Github
      { wch: 20 }, // Ngày nộp
      { wch: 12 }, // Trạng thái
      { wch: 14 }, // Điểm số
      { wch: 45 }, // Lời phê
      { wch: 20 }, // Ngày chấm
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BangDiem_K06');

    // Xuất file .xlsx
    XLSX.writeFile(workbook, `BangDiem_Lop_K06_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleOpenGradingModal = (sub: Submission) => {
    setGradingSubmission(sub);
    setScoreInput(sub.feedback?.score || 9.0);
    setCommentInput(sub.feedback?.comment || 'Bài làm tốt, trình bày sạch đẹp chuẩn phong cách Kidsa!');
  };

  const handleSaveGrade = async () => {
    if (!gradingSubmission) return;
    setIsSaving(true);
    try {
      await onUpdateGrade(gradingSubmission.id, Number(scoreInput), commentInput);
      setGradingSubmission(null);
    } catch {
      alert('Có lỗi khi lưu điểm. Vui lòng thử lại!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Dashboard Giáo Viên */}
      <div className="bg-gradient-to-r from-slate-900 via-kidsa-purple-dark to-slate-800 rounded-4xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-kidsa-orange/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-amber-300">
              <Users className="w-4 h-4" />
              <span>Quản Lý Duyệt Bài Lớp K06</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              Dashboard Giáo Viên Chủ Nhiệm 👩‍🏫
            </h1>
            <p className="text-white/80 text-sm md:text-base font-medium">
              Theo dõi toàn bộ tiến độ nộp bài zip/github của sĩ số 24 học sinh lớp K06, trực tiếp chấm điểm và xuất file Excel chỉ với 1 click.
            </p>
          </div>

          {/* COMPONENT 8: EXPORT EXCEL BUTTON */}
          <div className="shrink-0">
            <button
              onClick={handleExportExcel}
              className="flex items-center space-x-3 px-6 py-4 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
            >
              <FileSpreadsheet className="w-6 h-6" />
              <span>Xuất Bảng Điểm Excel (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* COMPONENT 7: STUDENT PROGRESS TABLE (Bảng theo dõi tiến độ nộp bài của cả lớp K06) */}
      <div className="bg-white rounded-4xl p-6 md:p-8 border-2 border-kidsa-border shadow-md space-y-6">
        
        {/* Bộ Lọc & Tìm kiếm */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <span className="text-sm font-extrabold text-slate-700 shrink-0">Lọc bài tập:</span>
            <select
              value={selectedAssignmentFilter}
              onChange={(e) => setSelectedAssignmentFilter(e.target.value)}
              className="bg-kidsa-bg border-2 border-kidsa-border rounded-2xl px-4 py-2 font-bold text-sm text-slate-800 focus:outline-none focus:border-kidsa-purple w-full md:w-auto"
            >
              <option value="ALL">Tất cả bài tập K06</option>
              {assignments.map((asm) => (
                <option key={asm.id} value={asm.id}>
                  {asm.code} - {asm.title}
                </option>
              ))}
            </select>
          </div>

          {/* Ô Tìm kiếm Học sinh */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên học sinh..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-kidsa-border focus:border-kidsa-purple font-bold text-slate-800 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Bảng Dữ liệu Tiến Độ */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-100 text-xs font-black uppercase text-kidsa-subtext tracking-wider bg-kidsa-bg">
                <th className="py-4 px-4 rounded-l-2xl">Học Sinh</th>
                <th className="py-4 px-4">Bài Tập</th>
                <th className="py-4 px-4">Bài Làm / File Nộp</th>
                <th className="py-4 px-4">Thời Gian Nộp</th>
                <th className="py-4 px-4">Trạng Thái</th>
                <th className="py-4 px-4">Điểm Số</th>
                <th className="py-4 px-4 text-right rounded-r-2xl">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-sm text-slate-800">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                    Không tìm thấy bài làm nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const isGraded = sub.status === 'GRADED';

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Cột 1: Học sinh */}
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={sub.studentAvatar}
                            alt={sub.studentName}
                            className="w-10 h-10 rounded-2xl object-cover border-2 border-kidsa-orange/30 shadow-sm"
                          />
                          <div>
                            <span className="block font-black text-slate-800">{sub.studentName}</span>
                            <span className="text-xs text-slate-400 font-medium">{sub.studentEmail}</span>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Bài tập */}
                      <td className="py-4 px-4 max-w-xs">
                        <span className="block font-extrabold text-slate-800 line-clamp-1">
                          {sub.assignmentTitle}
                        </span>
                      </td>

                      {/* Cột 3: File zip / Github */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col space-y-1">
                          {sub.fileName && (
                            <span className="inline-flex items-center space-x-1 text-xs font-bold text-kidsa-teal bg-kidsa-teal-light px-2.5 py-1 rounded-xl border border-kidsa-teal/20 w-fit">
                              <FileCode className="w-3.5 h-3.5" />
                              <span>{sub.fileName}</span>
                            </span>
                          )}
                          {sub.githubUrl && (
                            <a
                              href={sub.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-xs font-bold text-slate-700 hover:text-kidsa-purple bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200 w-fit"
                            >
                              <Github className="w-3.5 h-3.5" />
                              <span>Repo Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Cột 4: Ngày nộp */}
                      <td className="py-4 px-4 text-xs font-semibold text-slate-500">
                        {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                      </td>

                      {/* Cột 5: Trạng thái */}
                      <td className="py-4 px-4">
                        {isGraded ? (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Đã chấm</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-full">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            <span>Chờ chấm</span>
                          </span>
                        )}
                      </td>

                      {/* Cột 6: Điểm số */}
                      <td className="py-4 px-4">
                        {isGraded && sub.feedback ? (
                          <span className="text-base font-black text-kidsa-purple bg-kidsa-purple-light px-3 py-1 rounded-xl">
                            {sub.feedback.score} / 10
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-slate-400">---</span>
                        )}
                      </td>

                      {/* Cột 7: Thao tác chấm bài */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleOpenGradingModal(sub)}
                          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-kidsa-purple hover:bg-kidsa-purple-dark text-white font-extrabold text-xs shadow-md transition-all transform hover:scale-105"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isGraded ? 'Sửa điểm' : 'Duyệt chấm điểm'}</span>
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* MODAL CHẤM ĐIỂM GIÁO VIÊN */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-4xl p-6 md:p-8 max-w-lg w-full border-4 border-kidsa-purple shadow-2xl space-y-6 relative">
            
            <button
              onClick={() => setGradingSubmission(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-kidsa-purple-light text-kidsa-purple font-black text-xs uppercase">
                Duyệt Chấm Điểm Bài Tập
              </span>
              <h3 className="text-xl font-black text-slate-800">
                Học sinh: {gradingSubmission.studentName}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Bài tập: {gradingSubmission.assignmentTitle}
              </p>
            </div>

            <div className="space-y-4">
              {/* Nhập Điểm */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Nhập Điểm Số (Thang điểm 0 - 10):
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={scoreInput}
                  onChange={(e) => setScoreInput(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-kidsa-purple font-black text-xl text-kidsa-purple focus:outline-none"
                />
              </div>

              {/* Nhập Lời Phê */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">
                  Nhập Lời Phê & Nhận Xét Của GVCN K06:
                </label>
                <textarea
                  rows={4}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Gợi ý: Bài làm xuất sắc, phong cách thiết kế chuẩn Kidsa..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-kidsa-border focus:border-kidsa-purple font-bold text-slate-800 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setGradingSubmission(null)}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveGrade}
                className="px-6 py-2.5 rounded-2xl bg-kidsa-purple hover:bg-kidsa-purple-dark text-white font-black text-sm shadow-md transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSaving ? 'Đang lưu...' : 'Lưu Điểm & Lời Phê'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
