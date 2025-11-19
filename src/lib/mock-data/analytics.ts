import {
  SchoolStudentAnalytics,
  StudentAnalyticsRow,
  SchoolTeacherAnalytics,
  TeacherPerformanceRow,
  TeacherDetailedAnalysis,
  SchoolInterventionStats,
  InterventionRow,
} from '@/types/analytics';

export const mockSchoolStudentAnalytics: SchoolStudentAnalytics = {
  overview: {
    totalStudents: 450,
    activeStudents: 442,
    atRiskCount: 38,
    averagePerformance: 72,
    averageAttendance: 88,
  },
  performanceDistribution: [
    { grade: 'A', count: 68, percentage: 15 },
    { grade: 'B', count: 135, percentage: 30 },
    { grade: 'C', count: 158, percentage: 35 },
    { grade: 'D', count: 67, percentage: 15 },
    { grade: 'F', count: 22, percentage: 5 },
  ],
  riskDistribution: [
    { level: 'none', count: 320, percentage: 71 },
    { level: 'low', count: 54, percentage: 12 },
    { level: 'medium', count: 52, percentage: 12 },
    { level: 'high', count: 24, percentage: 5 },
  ],
  trendData: [
    { month: 'Aug', averageGrade: 70, attendanceRate: 92 },
    { month: 'Sep', averageGrade: 71, attendanceRate: 90 },
    { month: 'Oct', averageGrade: 72, attendanceRate: 88 },
    { month: 'Nov', averageGrade: 72, attendanceRate: 88 },
  ],
  byGradeLevel: [
    { grade: 'Form 1', studentCount: 120, averagePerformance: 74, attendanceRate: 90, atRiskCount: 8 },
    { grade: 'Form 2', studentCount: 115, averagePerformance: 72, attendanceRate: 88, atRiskCount: 10 },
    { grade: 'Form 3', studentCount: 110, averagePerformance: 71, attendanceRate: 87, atRiskCount: 12 },
    { grade: 'Form 4', studentCount: 105, averagePerformance: 73, attendanceRate: 86, atRiskCount: 8 },
  ],
};

export const mockStudentAnalyticsRows: StudentAnalyticsRow[] = [
  {
    id: 'student-1',
    firstName: 'Themba',
    lastName: 'Dlamini',
    admissionNumber: 'STU2025001',
    className: 'Form 3A',
    gradeLevel: 'Form 3',
    currentAverage: 72,
    gradeLetter: 'B',
    trend: 'down',
    attendanceRate: 78,
    riskLevel: 'medium',
    hasActiveIntervention: true,
    teacherName: 'Mr. Simelane',
  },
  {
    id: 'student-2',
    firstName: 'Lindiwe',
    lastName: 'Nkosi',
    admissionNumber: 'STU2025002',
    className: 'Form 3A',
    gradeLevel: 'Form 3',
    currentAverage: 92,
    gradeLetter: 'A+',
    trend: 'stable',
    attendanceRate: 98,
    riskLevel: 'none',
    hasActiveIntervention: false,
    teacherName: 'Mr. Simelane',
  },
  {
    id: 'student-3',
    firstName: 'Bongani',
    lastName: 'Mamba',
    admissionNumber: 'STU2025003',
    className: 'Form 3A',
    gradeLevel: 'Form 3',
    currentAverage: 58,
    gradeLetter: 'D+',
    trend: 'down',
    attendanceRate: 65,
    riskLevel: 'high',
    hasActiveIntervention: false,
    teacherName: 'Mr. Simelane',
  },
  {
    id: 'student-4',
    firstName: 'Nomcebo',
    lastName: 'Zwane',
    admissionNumber: 'STU2025004',
    className: 'Form 2B',
    gradeLevel: 'Form 2',
    currentAverage: 85,
    gradeLetter: 'A',
    trend: 'up',
    attendanceRate: 95,
    riskLevel: 'none',
    hasActiveIntervention: false,
    teacherName: 'Mrs. Nkosi',
  },
  {
    id: 'student-5',
    firstName: 'Sipho',
    lastName: 'Maseko',
    admissionNumber: 'STU2025005',
    className: 'Form 1A',
    gradeLevel: 'Form 1',
    currentAverage: 68,
    gradeLetter: 'C+',
    trend: 'stable',
    attendanceRate: 82,
    riskLevel: 'low',
    hasActiveIntervention: false,
    teacherName: 'Mr. Dlamini',
  },
];

export const mockSchoolTeacherAnalytics: SchoolTeacherAnalytics = {
  overview: {
    totalTeachers: 28,
    activeTeachers: 26,
    averageClassPerformance: 72,
    averageStudentAttendance: 88,
    totalClasses: 42,
  },
  performanceDistribution: [
    { range: '80%+', count: 8 },
    { range: '70-79%', count: 12 },
    { range: '60-69%', count: 5 },
    { range: '<60%', count: 3 },
  ],
  trendData: [
    { month: 'Aug', averageStudentGrade: 70, averageAttendance: 92 },
    { month: 'Sep', averageStudentGrade: 71, averageAttendance: 90 },
    { month: 'Oct', averageStudentGrade: 72, averageAttendance: 88 },
    { month: 'Nov', averageStudentGrade: 72, averageAttendance: 88 },
  ],
};

export const mockTeacherPerformanceRows: TeacherPerformanceRow[] = [
  {
    id: 'teacher-1',
    firstName: 'Samuel',
    lastName: 'Simelane',
    email: 's.simelane@school.com',
    department: 'Mathematics',
    classCount: 3,
    studentCount: 96,
    averageStudentGrade: 76,
    gradeImprovement: 4,
    studentAttendanceRate: 85,
    atRiskStudentCount: 5,
    parentCommunicationCount: 12,
    interventionCount: 3,
  },
  {
    id: 'teacher-2',
    firstName: 'Grace',
    lastName: 'Nkosi',
    email: 'g.nkosi@school.com',
    department: 'English',
    classCount: 4,
    studentCount: 128,
    averageStudentGrade: 78,
    gradeImprovement: 6,
    studentAttendanceRate: 90,
    atRiskStudentCount: 3,
    parentCommunicationCount: 18,
    interventionCount: 2,
  },
  {
    id: 'teacher-3',
    firstName: 'James',
    lastName: 'Dlamini',
    email: 'j.dlamini@school.com',
    department: 'Science',
    classCount: 3,
    studentCount: 92,
    averageStudentGrade: 68,
    gradeImprovement: -2,
    studentAttendanceRate: 82,
    atRiskStudentCount: 8,
    parentCommunicationCount: 5,
    interventionCount: 1,
  },
  {
    id: 'teacher-4',
    firstName: 'Thandi',
    lastName: 'Mamba',
    email: 't.mamba@school.com',
    department: 'History',
    classCount: 2,
    studentCount: 64,
    averageStudentGrade: 82,
    gradeImprovement: 8,
    studentAttendanceRate: 92,
    atRiskStudentCount: 1,
    parentCommunicationCount: 20,
    interventionCount: 4,
  },
];

export const mockTeacherDetailedAnalysis: Record<string, TeacherDetailedAnalysis> = {
  'teacher-1': {
    teacher: {
      id: 'teacher-1',
      firstName: 'Samuel',
      lastName: 'Simelane',
      email: 's.simelane@school.com',
      department: 'Mathematics',
      hireDate: '2018-01-15',
    },
    metrics: {
      totalStudents: 96,
      averageStudentGrade: 76,
      gradeImprovement: 4,
      studentAttendanceRate: 85,
      atRiskStudentCount: 5,
      interventionsCreated: 3,
      interventionsSuccessful: 2,
      parentCommunications: 12,
    },
    classes: [
      { id: 'class-1', name: 'Form 3A', studentCount: 32, averageGrade: 78, attendanceRate: 86, atRiskCount: 2 },
      { id: 'class-2', name: 'Form 3B', studentCount: 30, averageGrade: 74, attendanceRate: 84, atRiskCount: 2 },
      { id: 'class-3', name: 'Form 2A', studentCount: 34, averageGrade: 76, attendanceRate: 85, atRiskCount: 1 },
    ],
    performanceTrend: [
      { month: 'Aug', averageGrade: 72, attendanceRate: 88 },
      { month: 'Sep', averageGrade: 74, attendanceRate: 86 },
      { month: 'Oct', averageGrade: 75, attendanceRate: 85 },
      { month: 'Nov', averageGrade: 76, attendanceRate: 85 },
    ],
    strengths: [
      'Consistent grade improvement across all classes',
      'Active use of interventions for at-risk students',
      'Strong parent communication',
      'Uses AI tools for personalized instruction',
    ],
    areasForGrowth: [
      'Student attendance rate below school average',
      'Form 3B performance lagging behind Form 3A',
      'More frequent parent updates recommended',
    ],
    professionalDevelopmentSuggestions: [
      'Attend workshop on student engagement strategies',
      'Peer observation with Mrs. Nkosi for attendance techniques',
      'Review differentiated instruction methods',
    ],
  },
};

export const mockSchoolInterventionStats: SchoolInterventionStats = {
  total: 42,
  active: 18,
  completed: 24,
  successful: 20,
  successRate: 83,
  byType: [
    { type: 'academic', count: 18, successRate: 78 },
    { type: 'attendance', count: 15, successRate: 87 },
    { type: 'behavioral', count: 6, successRate: 83 },
    { type: 'social-emotional', count: 3, successRate: 100 },
  ],
  byGradeLevel: [
    { grade: 'Form 1', count: 8 },
    { grade: 'Form 2', count: 10 },
    { grade: 'Form 3', count: 15 },
    { grade: 'Form 4', count: 9 },
  ],
};

export const mockInterventionRows: InterventionRow[] = [
  {
    id: 'intervention-1',
    studentId: 'student-1',
    studentName: 'Themba Dlamini',
    className: 'Form 3A',
    teacherId: 'teacher-1',
    teacherName: 'Mr. Simelane',
    type: 'attendance',
    status: 'active',
    goal: 'Improve Monday attendance to 90%',
    progress: 50,
    startDate: '2025-11-11',
    targetEndDate: '2025-12-09',
  },
  {
    id: 'intervention-2',
    studentId: 'student-5',
    studentName: 'Sipho Maseko',
    className: 'Form 1A',
    teacherId: 'teacher-3',
    teacherName: 'Mr. Dlamini',
    type: 'academic',
    status: 'active',
    goal: 'Improve Science grade to 70%',
    progress: 30,
    startDate: '2025-11-01',
    targetEndDate: '2025-12-15',
  },
];

// Helper functions
export function getStudentAnalyticsRow(studentId: string): StudentAnalyticsRow | null {
  return mockStudentAnalyticsRows.find(s => s.id === studentId) || null;
}

export function getTeacherPerformanceRow(teacherId: string): TeacherPerformanceRow | null {
  return mockTeacherPerformanceRows.find(t => t.id === teacherId) || null;
}

export function getTeacherDetailedAnalysis(teacherId: string): TeacherDetailedAnalysis | null {
  return mockTeacherDetailedAnalysis[teacherId] || null;
}

export function getAtRiskStudents(): StudentAnalyticsRow[] {
  return mockStudentAnalyticsRows.filter(s => s.riskLevel === 'medium' || s.riskLevel === 'high');
}

export function getActiveInterventions(): InterventionRow[] {
  return mockInterventionRows.filter(i => i.status === 'active');
}
