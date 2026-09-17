import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { submissionId, score, comment } = body;

    const db = readDb();
    const subIndex = db.submissions.findIndex((s) => s.id === submissionId);

    if (subIndex === -1) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy bài nộp' }, { status: 404 });
    }

    db.submissions[subIndex].status = 'GRADED';
    db.submissions[subIndex].feedback = {
      score: Number(score),
      maxScore: 10,
      comment: comment || 'Bài làm rất tốt!',
      gradedBy: 'Thầy Nguyễn Văn A (GVCN K06)',
      gradedAt: new Date().toISOString(),
    };

    writeDb(db);

    return NextResponse.json({ success: true, submission: db.submissions[subIndex] });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Lỗi server khi chấm điểm' }, { status: 500 });
  }
}
