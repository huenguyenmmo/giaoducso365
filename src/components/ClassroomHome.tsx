'use client';

import React from 'react';
import { Assignment, ClassStats, Submission } from '@/types';
import { BookOpen, Clock, CheckCircle2, AlertCircle, ArrowRight, Sparkles, FolderGit2 } from 'lucide-react';

interface ClassroomHomeProps {
  stats: ClassStats;
  assignments: Assignment[];
  mySubmissions: Submission[];
  onSelectAssignment: (assignmentId: string) => void;
  onNavigateToGradebook: () => void;
}

export const ClassroomHome: React.FC<ClassroomHomeProps> = ({
  stats,
  assignments,
  mySubmissions,
  onSelectAssignment,
  onNavigateToGradebook,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 🌟 HERO BANNER TRANG CHỦ LỚP HỌC K06 (Kidsa Style) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-kidsa-orange to-kidsa-pink rounded-4xl p-8 md:p-12 text-white shadow-kidsa">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>Lớp Học Chuyên Sâu K06</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Chào mừng bạn đến với <br />
            <span className="text-amber-200">{stats.className}</span>
          </h1>
          <p className="text-white/90 text-sm md:text-base font-medium max-w-xl">
            Giáo viên chủ nhiệm: <strong className="text-white font-bold">{stats.teacherName}</strong>. 
            Xem danh sách bài tập, hạn nộp và nộp bài làm bằng tệp .zip hoặc link Github dễ dàng!
          </p>
        </div>
      </div>

      {/* 📊 COMPONENT 1: DASHBOARD / OVERVIEW (Thẻ thống kê bài tập đang mở / đã hoàn thành) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Thẻ 1: Bài tập Đang Mở */}
        <div className="bg-white rounded-3xl p-6 border-2 border-kidsa-orange/20 shadow-sm hover:shadow-kidsa transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-kidsa-orange-light text-kidsa-orange flex items-center justify-center font-extrabold text-2xl">
              <Clock className="w-7 h-7" />
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-black rounded-full">
              Đang mở
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-800">{stats.openAssignments} Bài</h3>
            <p className="text-sm font-semibold text-kidsa-subtext mt-1">Bài tập cần thực hiện & nộp</p>
          </div>
        </div>

        {/* Thẻ 2: Bài tập Đã Hoàn Thành */}
        <div className="bg-white rounded-3xl p-6 border-2 border-kidsa-teal/20 shadow-sm hover:shadow-kidsa-teal transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-kidsa-teal-light text-kidsa-teal flex items-center justify-center font-extrabold text-2xl">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
              Đã nộp bài
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-800">{mySubmissions.length} Bài</h3>
            <p className="text-sm font-semibold text-kidsa-subtext mt-1">Đã hoàn thành nộp tệp zip / github</p>
          </div>
        </div>

        {/* Thẻ 3: Tổng số bài học kỳ K06 */}
        <div className="bg-white rounded-3xl p-6 border-2 border-kidsa-purple/20 shadow-sm hover:shadow-kidsa-hover transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 rounded-2xl bg-kidsa-purple-light text-kidsa-purple flex items-center justify-center font-extrabold text-2xl">
              <BookOpen className="w-7 h-7" />
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-black rounded-full">
              Khóa học K06
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-black text-slate-800">{stats.totalAssignments} Bài tập</h3>
            <p className="text-sm font-semibold text-kidsa-subtext mt-1">Tổng bài tập trong chương trình</p>
          </div>
        </div>

      </div>

      {/* 📋 COMPONENT 2: TASK LIST (Bảng danh sách bài tập, thời hạn, trạng thái) */}
      <div className="bg-white rounded-4xl p-6 md:p-8 border-2 border-kidsa-border shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center space-x-2">
              <span>📋 Danh Sách Bài Tập Lớp K06</span>
            </h2>
            <p className="text-sm font-medium text-kidsa-subtext mt-0.5">
              Theo dõi thời hạn và trạng thái bài tập của bạn
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {assignments.map((asm) => {
            const sub = mySubmissions.find((s) => s.assignmentId === asm.id);
            const isSubmitted = !!sub;
            const isGraded = sub?.status === 'GRADED';

            return (
              <div
                key={asm.id}
                className="group relative bg-kidsa-bg hover:bg-white rounded-3xl p-5 border-2 border-kidsa-border hover:border-kidsa-orange transition-all duration-300 shadow-sm hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0 ${
                    isGraded ? 'bg-kidsa-purple' : isSubmitted ? 'bg-kidsa-teal' : 'bg-kidsa-orange'
                  }`}>
                    {asm.code}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-kidsa-orange transition-colors">
                        {asm.title}
                      </h3>
                      
                      {/* Trạng thái Badge */}
                      {isGraded ? (
                        <span className="px-3 py-0.5 text-xs font-black rounded-full bg-kidsa-purple-light text-kidsa-purple border border-kidsa-purple/30">
                          🌟 Đã chấm điểm ({sub?.feedback?.score}/{asm.maxScore})
                        </span>
                      ) : isSubmitted ? (
                        <span className="px-3 py-0.5 text-xs font-black rounded-full bg-kidsa-teal-light text-kidsa-teal border border-kidsa-teal/30">
                          ⏳ Chờ GVCN chấm
                        </span>
                      ) : (
                        <span className="px-3 py-0.5 text-xs font-black rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          ⚠️ Chưa nộp
                        </span>
                      )}
                    </div>

                    <p className="text-xs md:text-sm text-slate-600 line-clamp-2">
                      {asm.description}
                    </p>

                    <div className="flex items-center space-x-4 text-xs font-semibold text-kidsa-subtext pt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-kidsa-orange" />
                        <span>Hạn nộp: {new Date(asm.deadline).toLocaleDateString('vi-VN')}</span>
                      </span>
                      <span>Thang điểm: {asm.maxScore}</span>
                    </div>
                  </div>
                </div>

                {/* Nút Hành động */}
                <div className="flex items-center space-x-3 shrink-0 self-end md:self-center">
                  {isGraded ? (
                    <button
                      onClick={onNavigateToGradebook}
                      className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-kidsa-purple-light text-kidsa-purple hover:bg-kidsa-purple hover:text-white font-extrabold text-sm transition-all"
                    >
                      <span>Xem nhận xét</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onSelectAssignment(asm.id)}
                      className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-kidsa-orange hover:bg-kidsa-orange-dark text-white font-extrabold text-sm shadow-md hover:shadow-kidsa transition-all transform hover:-translate-y-0.5"
                    >
                      <span>{isSubmitted ? 'Nộp lại bài zip' : 'Nộp bài tập'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
