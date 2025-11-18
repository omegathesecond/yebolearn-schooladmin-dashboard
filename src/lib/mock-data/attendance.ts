import type { AttendanceRecord, DailyAttendance, AttendanceStats } from '@/types';
import { mockStudents, mockClasses } from './students';

// Generate attendance records for today
const today = new Date().toISOString().split('T')[0];

export const mockAttendanceRecords: AttendanceRecord[] = mockStudents.map((student, index) => {
  const statuses: ('present' | 'absent' | 'late' | 'excused')[] = ['present', 'present', 'present', 'present', 'present', 'present', 'absent', 'late'];
  const status = statuses[index % statuses.length];

  return {
    id: `att-${student.id}`,
    studentId: student.id,
    studentName: `${student.firstName} ${student.lastName}`,
    classId: student.classId,
    date: today,
    status,
    notes: status === 'absent' ? 'No notification received' : status === 'late' ? 'Arrived 15 minutes late' : undefined,
    markedBy: 'teacher-1',
    markedAt: new Date().toISOString(),
  };
});

export function getAttendanceStats(records: AttendanceRecord[]): AttendanceStats {
  const present = records.filter(r => r.status === 'present').length;
  const absent = records.filter(r => r.status === 'absent').length;
  const late = records.filter(r => r.status === 'late').length;
  const excused = records.filter(r => r.status === 'excused').length;
  const total = records.length;

  return {
    totalStudents: total,
    present,
    absent,
    late,
    excused,
    attendanceRate: total > 0 ? Math.round((present / total) * 100 * 10) / 10 : 0,
  };
}

export function getDailyAttendance(classId: string, date: string): DailyAttendance {
  const classInfo = mockClasses.find(c => c.id === classId);
  const records = mockAttendanceRecords.filter(r => r.classId === classId && r.date === date);

  return {
    date,
    classId,
    className: classInfo?.name,
    records,
    stats: getAttendanceStats(records),
  };
}

export function getAttendanceByClass(classId: string): AttendanceRecord[] {
  return mockAttendanceRecords.filter(r => r.classId === classId);
}

export function getClassesWithAttendance() {
  return mockClasses.map(cls => {
    const records = mockAttendanceRecords.filter(r => r.classId === cls.id);
    const stats = getAttendanceStats(records);
    return {
      ...cls,
      attendanceStats: stats,
      isMarked: records.length > 0,
    };
  });
}

// Weekly attendance trend data
export const mockWeeklyTrend = [
  { day: 'Mon', present: 95, absent: 3, late: 2 },
  { day: 'Tue', present: 93, absent: 4, late: 3 },
  { day: 'Wed', present: 96, absent: 2, late: 2 },
  { day: 'Thu', present: 94, absent: 4, late: 2 },
  { day: 'Fri', present: 91, absent: 6, late: 3 },
];
