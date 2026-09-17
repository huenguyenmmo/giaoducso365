import fs from 'fs';
import path from 'path';
import { Assignment, Submission, ClassStats, User } from '@/types';

const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

export interface DatabaseData {
  stats: ClassStats;
  currentUser: User;
  users: User[];
  assignments: Assignment[];
  submissions: Submission[];
}

const initialData: DatabaseData = {
  stats: {
    classCode: 'K06',
    className: 'Lập Trình Web K06 - Chuyên Sâu',
    teacherName: 'Thầy Nguyễn Văn A (GVCN)',
    totalStudents: 24,
    totalAssignments: 8,
    completedAssignments: 6,
    openAssignments: 2,
  },
  currentUser: {
    id: 'std_01',
    name: 'Trần Văn Nam',
    email: 'nam.tran@k06.edu.vn',
    role: 'STUDENT',
    studentId: 'K06-0012',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  },
  users: [
    {
      id: 'std_01',
      name: 'Trần Văn Nam',
      email: 'nam.tran@k06.edu.vn',
      role: 'STUDENT',
      studentId: 'K06-0012',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    },
    {
      id: 'std_02',
      name: 'Nguyễn Thị Mai',
      email: 'mai.nguyen@k06.edu.vn',
      role: 'STUDENT',
      studentId: 'K06-0015',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    },
    {
      id: 'std_03',
      name: 'Lê Hoàng Long',
      email: 'long.le@k06.edu.vn',
      role: 'STUDENT',
      studentId: 'K06-0020',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
    },
    {
      id: 'std_04',
      name: 'Phạm Minh Anh',
      email: 'anh.pham@k06.edu.vn',
      role: 'STUDENT',
      studentId: 'K06-0008',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    },
    {
      id: 'teacher_01',
      name: 'Thầy Nguyễn Văn A',
      email: 'teacher.a@k06.edu.vn',
      role: 'TEACHER',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
    }
  ],
  assignments: [
    {
      id: 'asm_01',
      code: 'BT01',
      title: 'Xây dựng Giao diện Trang chủ Kidsa (HTML/CSS)',
      description: 'Yêu cầu áp dụng Flexbox, Grid CSS và đường cắt viền sóng mây chuẩn giao diện.',
      deadline: '2026-09-25T23:59:00',
      maxScore: 10,
      totalSubmissions: 24,
      status: 'OPEN',
    },
    {
      id: 'asm_02',
      code: 'BT02',
      title: 'Lập trình Form Nộp bài tập & Drag-Drop Zip',
      description: 'Xử lý sự kiện kéo thả tệp .zip code hoặc dán link GitHub repository.',
      deadline: '2026-09-28T23:59:00',
      maxScore: 10,
      totalSubmissions: 20,
      status: 'OPEN',
    },
    {
      id: 'asm_03',
      code: 'BT03',
      title: 'Thiết kế Bảng điểm & Module Xuất Excel (.xlsx)',
      description: 'Tích hợp thư viện XLSX export bảng điểm cá nhân và toàn lớp K06.',
      deadline: '2026-10-05T23:59:00',
      maxScore: 10,
      totalSubmissions: 12,
      status: 'OPEN',
    }
  ],
  submissions: [
    {
      id: 'sub_01',
      assignmentId: 'asm_01',
      assignmentTitle: 'Xây dựng Giao diện Trang chủ Kidsa (HTML/CSS)',
      studentId: 'std_01',
      studentName: 'Trần Văn Nam',
      studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      studentEmail: 'nam.tran@k06.edu.vn',
      fileUrl: '/uploads/k06_namtran_bt01.zip',
      fileName: 'k06_namtran_bt01.zip',
      fileSize: '4.2 MB',
      githubUrl: 'https://github.com/namtran-k06/kidsa-homepage',
      submittedAt: '2026-09-16T14:30:00',
      status: 'GRADED',
      feedback: {
        score: 9.5,
        maxScore: 10,
        comment: 'Bài làm xuất sắc! Giao diện chuẩn phong cách Kidsa, màu sắc tươi sáng, xử lý viền sóng mây bằng SVG rất mượt mà. Cố gắng phát huy em nhé!',
        gradedBy: 'Thầy Nguyễn Văn A (GVCN K06)',
        gradedAt: '2026-09-16T16:00:00',
      }
    },
    {
      id: 'sub_02',
      assignmentId: 'asm_01',
      assignmentTitle: 'Xây dựng Giao diện Trang chủ Kidsa (HTML/CSS)',
      studentId: 'std_02',
      studentName: 'Nguyễn Thị Mai',
      studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      studentEmail: 'mai.nguyen@k06.edu.vn',
      fileUrl: '/uploads/k06_mainguyen_bt01.zip',
      fileName: 'k06_mainguyen_bt01.zip',
      fileSize: '6.8 MB',
      githubUrl: 'https://github.com/mainguyen/kidsa-ui',
      submittedAt: '2026-09-16T15:10:00',
      status: 'GRADED',
      feedback: {
        score: 10,
        maxScore: 10,
        comment: 'Hoàn hảo! Đạt tối đa điểm thẩm mỹ UI/UX. Responsive mượt trên cả thiết bị di động.',
        gradedBy: 'Thầy Nguyễn Văn A (GVCN K06)',
        gradedAt: '2026-09-16T16:15:00',
      }
    },
    {
      id: 'sub_03',
      assignmentId: 'asm_02',
      assignmentTitle: 'Lập trình Form Nộp bài tập & Drag-Drop Zip',
      studentId: 'std_01',
      studentName: 'Trần Văn Nam',
      studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      studentEmail: 'nam.tran@k06.edu.vn',
      fileUrl: '/uploads/k06_namtran_bt02.zip',
      fileName: 'k06_namtran_bt02.zip',
      fileSize: '3.1 MB',
      githubUrl: 'https://github.com/namtran-k06/drag-drop-zip',
      submittedAt: '2026-09-17T08:20:00',
      status: 'SUBMITTED',
    },
    {
      id: 'sub_04',
      assignmentId: 'asm_01',
      assignmentTitle: 'Xây dựng Giao diện Trang chủ Kidsa (HTML/CSS)',
      studentId: 'std_03',
      studentName: 'Lê Hoàng Long',
      studentAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
      studentEmail: 'long.le@k06.edu.vn',
      githubUrl: 'https://github.com/hoanglong/bt01-kidsa',
      submittedAt: '2026-09-16T18:45:00',
      status: 'SUBMITTED',
    }
  ]
};

function ensureDbExists() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

export function readDb(): DatabaseData {
  ensureDbExists();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return initialData;
  }
}

export function writeDb(data: DatabaseData) {
  ensureDbExists();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
