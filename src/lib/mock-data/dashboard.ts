import type { DashboardStats } from '@/types';

export const mockDashboardStats: DashboardStats = {
  totalStudents: 847,
  totalStaff: 52,
  totalClasses: 24,
  todayAttendance: {
    totalStudents: 847,
    present: 798,
    absent: 32,
    late: 12,
    excused: 5,
    attendanceRate: 94.2,
  },
  feeCollection: {
    totalExpected: 425000,
    totalCollected: 382500,
    collectionRate: 90,
    overdueAmount: 42500,
  },
  recentActivity: [
    {
      id: '1',
      type: 'enrollment',
      description: 'New student enrolled: Sarah Johnson (Grade 8)',
      userId: 'user-1',
      userName: 'Admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '2',
      type: 'payment',
      description: 'Payment received: $450 from Michael Smith',
      userId: 'user-2',
      userName: 'Finance',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: '3',
      type: 'attendance',
      description: 'Attendance marked for Grade 10A',
      userId: 'user-3',
      userName: 'Mr. Williams',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
    {
      id: '4',
      type: 'grade',
      description: 'Math exam grades submitted for Grade 9B',
      userId: 'user-4',
      userName: 'Ms. Thompson',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: '5',
      type: 'announcement',
      description: 'School closing early on Friday',
      userId: 'user-1',
      userName: 'Admin',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
  ],
  alerts: [
    {
      id: '1',
      type: 'warning',
      title: 'Fee Collection',
      message: '15 students have overdue fees exceeding 30 days',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: '2',
      type: 'info',
      title: 'Term End',
      message: 'Current term ends in 14 days',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: '3',
      type: 'warning',
      title: 'Attendance',
      message: '3 students have chronic absenteeism (>10 days)',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ],
};

export const mockAttendanceTrend = [
  { date: 'Mon', rate: 95.2 },
  { date: 'Tue', rate: 94.8 },
  { date: 'Wed', rate: 93.5 },
  { date: 'Thu', rate: 94.2 },
  { date: 'Fri', rate: 92.1 },
];

export const mockFeeCollectionTrend = [
  { month: 'Jan', collected: 38000, expected: 42500 },
  { month: 'Feb', collected: 40500, expected: 42500 },
  { month: 'Mar', collected: 39200, expected: 42500 },
  { month: 'Apr', collected: 41800, expected: 42500 },
  { month: 'May', collected: 38500, expected: 42500 },
];
