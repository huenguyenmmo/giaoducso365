'use client';

import React from 'react';
import { Submission, Assignment } from '@/types';
import { Award, MessageSquare, Calendar, CheckCircle2, Clock, Sparkles, ExternalLink, FileCode, Github } from 'lucide-react';

interface GradebookPageProps {
  mySubmissions: Submission[];
  assignments: Assignment[];
  onNavigateToSubmit: (assignmentId: string) => void;
}

export const GradebookPage: React.FC<GradebookPageProps> = ({
  mySubmissions,
  assignments,
  onNavigateToSubmit,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Trang Bảng Điểm Cá Nhân */}
      <div className="bg-gradient-to-r from-kidsa-purple via-purple-600 to-indigo-600 rounded-4xl p-8 md:p-12 text-white shadow-kidsa-hover relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider">
            <Award className="w-4 h-4 text-purple-200" />
            <span>Tra Cứu Bảng Điểm K06</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Bảng Điểm & Lời Phê Cá Nhân 🎓
          </h1>
          <p className="text-white/90 text-sm md:text-base font-medium">
            Tổng hợp toàn bộ kết quả bài tập, huy hiệu điểm số và những lời nhận xét tận tình từ Giáo viên chủ nhiệm lớp K06.
          </p>
        </div>
      </div>

      {/* Danh sách Bảng điểm theo từng Bài tập */}
      <div className="space-y-6">
        {assignments.map((asm) => {
          const sub = mySubmissions.find((s) => s.assignmentId === asm.id);
          const isGraded = sub?.status === 'GRADED';
          const isSubmitted = !!sub;

          return (
            <div
              key={asm.id}
              className="bg-white rounded-4xl p-6 md:p-8 border-2 border-kidsa-purple/20 shadow-md hover:shadow-lg transition-all space-y-6 relative overflow-hidden"
            >
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-kidsa-purple-light text-kidsa-purple font-black text-xs rounded-full">
                      {asm.code}
                    </span>
                    <h3 className="text-xl font-black text-slate-800">{asm.title}</h3>
                  </div>
                  <p className="text-xs md:text-sm font-medium text-slate-500">
                    Hạn nộp: {new Date(asm.deadline).toLocaleDateString('vi-VN')}
                  </p>
                </div>

                {/* COMPONENT 5: GRADE BADGE (Huy hiệu điểm số lớn 10/10, 8.5/10, Chờ chấm) */}
                <div className="shrink-0 flex items-center justify-center">
                  {isGraded ? (
                    <div className="relative group cursor-pointer">
                      <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-400 via-kidsa-orange to-kidsa-purple p-1 shadow-kidsa transform group-hover:scale-105 transition-transform">
                        <div className="w-full h-full bg-white rounded-[1.3rem] flex flex-col items-center justify-center p-2 text-center">
                          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                          <span className="text-2xl font-black text-slate-800 tracking-tight leading-none mt-1">
                            {sub.feedback?.score}
                          </span>
                          <span className="text-[10px] font-extrabold text-kidsa-purple uppercase tracking-widest mt-0.5">
                            /{asm.maxScore} Điểm
                          </span>
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                  ) : isSubmitted ? (
                    <div className="px-5 py-3 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-800 flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-amber-500 animate-spin" />
                      <div>
                        <span className="block font-black text-xs uppercase tracking-wider">Trạng thái</span>
                        <span className="font-extrabold text-sm">⏳ Chờ GVCN Chấm</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => onNavigateToSubmit(asm.id)}
                      className="px-5 py-2.5 rounded-2xl bg-kidsa-orange hover:bg-kidsa-orange-dark text-white font-extrabold text-xs shadow-md transition-all"
                    >
                      Nộp bài tập ngay
                    </button>
                  )}
                </div>

              </div>

              {/* Tệp bài nộp & Link Github */}
              {sub && (
                <div className="flex flex-wrap items-center gap-4 bg-kidsa-bg p-4 rounded-2xl border border-kidsa-border text-xs font-semibold text-slate-700">
                  <span className="font-bold text-slate-900">Thông tin bài nộp:</span>
                  {sub.fileName && (
                    <span className="flex items-center space-x-1.5 px-3 py-1 bg-white rounded-xl border border-slate-200 text-kidsa-teal font-extrabold">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{sub.fileName} ({sub.fileSize})</span>
                    </span>
                  )}
                  {sub.githubUrl && (
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 px-3 py-1 bg-white rounded-xl border border-slate-200 text-slate-800 hover:text-kidsa-purple font-extrabold"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Github Repository</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                  <span className="text-kidsa-subtext ml-auto">
                    Ngày nộp: {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              )}

              {/* COMPONENT 6: FEEDBACK CARD (Khung hiển thị nhận xét chi tiết của GVCN K06) */}
              {isGraded && sub.feedback ? (
                <div className="bg-gradient-to-r from-purple-50 via-kidsa-purple-light to-amber-50 rounded-3xl p-6 border-2 border-kidsa-purple/30 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-kidsa-purple font-black text-sm">
                      <MessageSquare className="w-5 h-5 text-kidsa-purple" />
                      <span>Lời Nhận Xét & Lời Phê của GVCN:</span>
                    </div>
                    <span className="text-xs font-bold text-purple-700 bg-white px-3 py-1 rounded-full border border-purple-200">
                      {sub.feedback.gradedBy}
                    </span>
                  </div>

                  <p className="text-slate-800 font-bold text-sm leading-relaxed italic bg-white/70 p-4 rounded-2xl border border-purple-100">
                    &ldquo;{sub.feedback.comment}&rdquo;
                  </p>

                  <div className="text-right text-[11px] font-semibold text-kidsa-subtext">
                    Chấm lúc: {new Date(sub.feedback.gradedAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              ) : isSubmitted ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-500 text-center">
                  Giáo viên chủ nhiệm lớp K06 đang duyệt bài làm của bạn. Lời phê sẽ xuất hiện ở đây ngay sau khi chấm!
                </div>
              ) : null}

            </div>
          );
        })}
      </div>

    </div>
  );
};
