import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { Submission } from '@/types';

export async function GET() {
  const db = readDb();
  return NextResponse.json({
    success: true,
    submissions: db.submissions,
    assignments: db.assignments,
    stats: db.stats,
    users: db.users,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { assignmentId, githubUrl, fileName } = body;

    const db = readDb();
    const asm = db.assignments.find((a) => a.id === assignmentId);

    if (!asm) {
      return NextResponse.json({ success: false, error: 'Bài tập không tồn tại' }, { status: 404 });
    }

    // Kiểm tra xem đã nộp bài này chưa, nếu có thì cập nhật, chưa thì tạo mới
    const existingIndex = db.submissions.findIndex(
      (s) => s.assignmentId === assignmentId && s.studentId === db.currentUser.id
    );

    const newSub: Submission = {
      id: existingIndex >= 0 ? db.submissions[existingIndex].id : `sub_${Date.now()}`,
      assignmentId,
      assignmentTitle: asm.title,
      studentId: db.currentUser.id,
      studentName: db.currentUser.name,
      studentAvatar: db.currentUser.avatar,
      studentEmail: db.currentUser.email,
      fileUrl: fileName ? `/uploads/${fileName}` : undefined,
      fileName: fileName || undefined,
      fileSize: fileName ? '4.5 MB' : undefined,
      githubUrl: githubUrl || undefined,
      submittedAt: new Date().toISOString(),
      status: 'SUBMITTED',
    };

    if (existingIndex >= 0) {
      db.submissions[existingIndex] = newSub;
    } else {
      db.submissions.unshift(newSub);
    }

    writeDb(db);

    return NextResponse.json({ success: true, submission: newSub });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Lỗi server khi lưu bài nộp' }, { status: 500 });
  }
}
