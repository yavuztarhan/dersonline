import { NextRequest, NextResponse } from 'next/server';
import { getServerUserStore, syncServerUsers } from '@/lib/server-user-store';

export async function GET() {
  try {
    const store = getServerUserStore();
    return NextResponse.json({
      success: true,
      admins: store.admins,
      teachers: store.teachers,
      students: store.students,
      updatedAt: store.updatedAt
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = syncServerUsers(body || {});
    return NextResponse.json({
      success: true,
      adminsCount: updated.admins.length,
      teachersCount: updated.teachers.length,
      studentsCount: updated.students.length,
      updatedAt: updated.updatedAt
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
