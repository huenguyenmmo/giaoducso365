export type UserRole = 'STUDENT' | 'TEACHER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  studentId?: string;
}

export type SubmissionStatus = 'NOT_SUBMITTED' | 'SUBMITTED' | 'GRADED';

export interface Assignment {
  id: string;
  title: string;
  code: string;
  description: string;
  deadline: string;
  maxScore: number;
  totalSubmissions: number;
  status: 'OPEN' | 'CLOSED';
}

export interface Feedback {
  score: number; // e.g. 10, 8.5
  maxScore: number;
  comment: string;
  gradedBy: string;
  gradedAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentEmail: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  githubUrl?: string;
  submittedAt: string;
  status: SubmissionStatus;
  feedback?: Feedback;
}

export interface ClassStats {
  classCode: string;
  className: string;
  teacherName: string;
  totalStudents: number;
  totalAssignments: number;
  completedAssignments: number;
  openAssignments: number;
}
