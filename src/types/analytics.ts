// School Admin Analytics Types

// Student Analytics
export interface SchoolStudentAnalytics {
  overview: {
    totalStudents: number;
    activeStudents: number;
    atRiskCount: number;
    averagePerformance: number;
    averageAttendance: number;
  };
  performanceDistribution: {
    grade: string;
    count: number;
    percentage: number;
  }[];
  riskDistribution: {
    level: 'none' | 'low' | 'medium' | 'high';
    count: number;
    percentage: number;
  }[];
  trendData: {
    month: string;
    averageGrade: number;
    attendanceRate: number;
  }[];
  byGradeLevel: {
    grade: string;
    studentCount: number;
    averagePerformance: number;
    attendanceRate: number;
    atRiskCount: number;
  }[];
}

export interface StudentAnalyticsRow {
  id: string;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  className: string;
  gradeLevel: string;
  avatar?: string;
  currentAverage: number;
  gradeLetter: string;
  trend: 'up' | 'down' | 'stable';
  attendanceRate: number;
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  hasActiveIntervention: boolean;
  teacherName: string;
}

// Teacher Performance Analytics
export interface SchoolTeacherAnalytics {
  overview: {
    totalTeachers: number;
    activeTeachers: number;
    averageClassPerformance: number;
    averageStudentAttendance: number;
    totalClasses: number;
  };
  performanceDistribution: {
    range: string;
    count: number;
  }[];
  trendData: {
    month: string;
    averageStudentGrade: number;
    averageAttendance: number;
  }[];
}

export interface TeacherPerformanceRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  department?: string;
  classCount: number;
  studentCount: number;
  averageStudentGrade: number;
  gradeImprovement: number;
  studentAttendanceRate: number;
  atRiskStudentCount: number;
  parentCommunicationCount: number;
  interventionCount: number;
}

export interface TeacherDetailedAnalysis {
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    department?: string;
    hireDate: string;
  };
  metrics: {
    totalStudents: number;
    averageStudentGrade: number;
    gradeImprovement: number;
    studentAttendanceRate: number;
    atRiskStudentCount: number;
    interventionsCreated: number;
    interventionsSuccessful: number;
    parentCommunications: number;
  };
  classes: {
    id: string;
    name: string;
    studentCount: number;
    averageGrade: number;
    attendanceRate: number;
    atRiskCount: number;
  }[];
  performanceTrend: {
    month: string;
    averageGrade: number;
    attendanceRate: number;
  }[];
  strengths: string[];
  areasForGrowth: string[];
  professionalDevelopmentSuggestions: string[];
}

// Intervention Tracking (School-wide)
export interface SchoolInterventionStats {
  total: number;
  active: number;
  completed: number;
  successful: number;
  successRate: number;
  byType: {
    type: 'academic' | 'attendance' | 'behavioral' | 'social-emotional';
    count: number;
    successRate: number;
  }[];
  byGradeLevel: {
    grade: string;
    count: number;
  }[];
}

export interface InterventionRow {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  teacherId: string;
  teacherName: string;
  type: 'academic' | 'attendance' | 'behavioral' | 'social-emotional';
  status: 'draft' | 'active' | 'completed' | 'escalated';
  goal: string;
  progress: number;
  startDate: string;
  targetEndDate: string;
}

// Filters
export interface StudentAnalyticsFilters {
  search?: string;
  gradeLevel?: string;
  classId?: string;
  teacherId?: string;
  riskLevel?: 'none' | 'low' | 'medium' | 'high';
  performanceTier?: 'excellent' | 'good' | 'average' | 'below' | 'failing';
}

export interface TeacherAnalyticsFilters {
  search?: string;
  department?: string;
  performanceTier?: 'excellent' | 'good' | 'average' | 'below';
}
