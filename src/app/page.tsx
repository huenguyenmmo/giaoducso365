'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { WavyDivider } from '@/components/WavyDivider';
import { ClassroomHome } from '@/components/ClassroomHome';
import { SubmissionPage } from '@/components/SubmissionPage';
import { GradebookPage } from '@/components/GradebookPage';
import { TeacherDashboard } from '@/components/TeacherDashboard';
import { UserRole, Assignment, Submission, ClassStats, User } from '@/types';
import { Sparkles, Heart, Rocket, Star, Code2, BookOpen } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('classroom');
  const [role, setRole] = useState<UserRole>('STUDENT');

  const [stats, setStats] = useState<ClassStats | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('asm_01');
  const [isLoading, setIsLoading] = useState(true);

  const fetchDbData = async () => {
    try {
      const res = await fetch('/api/submissions');
      const json = await res.json();
      if (json.success) {
        setStats(json.stats);
        setAssignments(json.assignments);
        setSubmissions(json.submissions);
        setUsers(json.users);
      }
    } catch (e) {
      console.error('Failed to fetch DB', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDbData();
  }, []);

  const handleSelectAssignmentToSubmit = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    setActiveTab('submit');
  };

  const handleSubmitAssignment = async (data: { assignmentId: string; file?: File; githubUrl?: string }) => {
    const fileName = data.file ? data.file.name : undefined;
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignmentId: data.assignmentId,
        githubUrl: data.githubUrl,
        fileName,
      }),
    });
    const json = await res.json();
    if (json.success) {
      await fetchDbData();
    } else {
      throw new Error(json.error);
    }
  };

  const handleUpdateGrade = async (submissionId: string, score: number, comment: string) => {
    const res = await fetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId, score, comment }),
    });
    const json = await res.json();
    if (json.success) {
      await fetchDbData();
    } else {
      throw new Error(json.error);
    }
  };

  const mySubmissions = submissions.filter((s) => s.studentId === 'std_01');
  const existingSubmission = submissions.find((s) => s.assignmentId === selectedAssignmentId && s.studentId === 'std_01');

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen bg-kidsa-bg flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-kidsa-orange text-white flex items-center justify-center animate-bounce shadow-kidsa">
          <Sparkles className="w-8 h-8" />
        </div>
        <p className="font-extrabold text-slate-700 text-lg">Đang tải giao diện Lớp Học K06...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-kidsa-bg selection:bg-kidsa-orange selection:text-white">
      
      {/* 1. Sticky Kidsa Navbar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        setRole={(newRole) => {
          setRole(newRole);
          if (newRole === 'TEACHER') {
            setActiveTab('teacher');
          } else if (activeTab === 'teacher') {
            setActiveTab('classroom');
          }
        }}
      />

      {/* 2. Viền Sóng Mây Decor Top */}
      <WavyDivider fillColor="#FFFFFF" flip={true} className="-mt-1 drop-shadow-sm" />

      {/* 3. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        
        {/* Dynamic Mobile Role Indicator */}
        <div className="md:hidden mb-6 p-3 bg-white rounded-2xl border border-kidsa-border flex items-center justify-between text-xs font-bold">
          <span className="text-kidsa-subtext">Đang xem dưới góc nhìn:</span>
          <span className={`px-3 py-1 rounded-full font-black ${role === 'TEACHER' ? 'bg-kidsa-purple-light text-kidsa-purple' : 'bg-kidsa-teal-light text-kidsa-teal'}`}>
            {role === 'TEACHER' ? '👩‍🏫 Giáo Viên Chủ Nhiệm K06' : '🎓 Học Sinh K06'}
          </span>
        </div>

        {/* 1. LỚP HỌC (Trang chủ & Task List) */}
        {activeTab === 'classroom' && (
          <ClassroomHome
            stats={stats}
            assignments={assignments}
            mySubmissions={mySubmissions}
            onSelectAssignment={handleSelectAssignmentToSubmit}
            onNavigateToGradebook={() => setActiveTab('gradebook')}
          />
        )}

        {/* 2. NỘP BÀI TẬP (Kéo thả .zip + Progress Bar) */}
        {activeTab === 'submit' && (
          <SubmissionPage
            assignments={assignments}
            selectedAssignmentId={selectedAssignmentId}
            onSelectAssignment={setSelectedAssignmentId}
            onBackToHome={() => setActiveTab('classroom')}
            onSubmitAssignment={handleSubmitAssignment}
            existingSubmission={existingSubmission}
          />
        )}

        {/* 3. BẢNG ĐIỂM CÁ NHÂN (Huy hiệu điểm + Lời phê GVCN) */}
        {activeTab === 'gradebook' && (
          <GradebookPage
            mySubmissions={mySubmissions}
            assignments={assignments}
            onNavigateToSubmit={handleSelectAssignmentToSubmit}
          />
        )}

        {/* 4. DASHBOARD GIÁO VIÊN (Duyệt bài, Chấm điểm & Xuất Excel) */}
        {activeTab === 'teacher' && (
          <TeacherDashboard
            assignments={assignments}
            submissions={submissions}
            students={users.filter((u) => u.role === 'STUDENT')}
            onUpdateGrade={handleUpdateGrade}
          />
        )}

      </main>

      {/* 4. Viền Sóng Mây Decor Bottom */}
      <WavyDivider fillColor="#FFFFFF" className="mt-12" />

      {/* 5. Kidsa Footer */}
      <footer className="bg-white border-t border-kidsa-border py-8 text-center text-xs font-bold text-kidsa-subtext space-y-2">
        <div className="flex items-center justify-center space-x-2 text-kidsa-orange">
          <Sparkles className="w-4 h-4" />
          <span className="text-slate-800 font-black">Kidsa Classroom K06</span>
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
        </div>
        <p>Hệ thống Quản lý Bài tập Lớp K06 &bull; Đầy đủ UI/UX, Database, Kéo thả tệp Zip & Xuất Excel (.xlsx)</p>
      </footer>

    </div>
  );
}
