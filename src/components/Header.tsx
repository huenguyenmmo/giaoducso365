'use client';

import React from 'react';
import { UserRole } from '@/types';
import { Sparkles, GraduationCap, UploadCloud, Award, Users, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  role,
  setRole,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-kidsa-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Kidsa Style */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('classroom')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-kidsa-orange to-kidsa-yellow flex items-center justify-center shadow-kidsa text-white transform hover:rotate-6 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-slate-800">
                  Kidsa<span className="text-kidsa-orange">K06</span>
                </span>
                <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-kidsa-purple-light text-kidsa-purple border border-kidsa-purple/30">
                  Classroom
                </span>
              </div>
              <p className="text-xs font-medium text-kidsa-subtext">Hệ thống Quản lý Bài tập Lớp K06</p>
            </div>
          </div>

          {/* Navigation Tabs (Theo 4 Phân vùng Sơ đồ) */}
          <nav className="hidden md:flex items-center space-x-2 bg-kidsa-bg p-1.5 rounded-2xl border border-kidsa-border">
            <button
              onClick={() => setActiveTab('classroom')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'classroom'
                  ? 'bg-kidsa-orange text-white shadow-md scale-105'
                  : 'text-slate-600 hover:text-kidsa-orange hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>1. Lớp Học</span>
            </button>

            <button
              onClick={() => setActiveTab('submit')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'submit'
                  ? 'bg-kidsa-teal text-white shadow-md scale-105'
                  : 'text-slate-600 hover:text-kidsa-teal hover:bg-white/60'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>2. Nộp Bài Tập</span>
            </button>

            <button
              onClick={() => setActiveTab('gradebook')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'gradebook'
                  ? 'bg-kidsa-purple text-white shadow-md scale-105'
                  : 'text-slate-600 hover:text-kidsa-purple hover:bg-white/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>3. Bảng Điểm</span>
            </button>

            <button
              onClick={() => setActiveTab('teacher')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'teacher'
                  ? 'bg-gradient-to-r from-kidsa-orange to-kidsa-pink text-white shadow-md scale-105'
                  : 'text-slate-600 hover:text-kidsa-orange hover:bg-white/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>4. Dashboard GVCN</span>
            </button>
          </nav>

          {/* Quick Role Switcher (Đổi góc nhìn Học sinh <-> Giáo viên) */}
          <div className="flex items-center space-x-3">
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200">
              <button
                onClick={() => setRole('STUDENT')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  role === 'STUDENT'
                    ? 'bg-white text-kidsa-teal shadow-sm border border-kidsa-teal/20'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Học sinh</span>
              </button>
              <button
                onClick={() => setRole('TEACHER')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  role === 'TEACHER'
                    ? 'bg-white text-kidsa-purple shadow-sm border border-kidsa-purple/20'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>GVCN K06</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
