// Core types for School Admin Dashboard

// User & Auth types
export interface User {
  id: string;
  email: string;
  phone?: string;
  role: 'school_admin' | 'teacher' | 'student' | 'parent';
  firstName: string;
  lastName: string;
  schoolId?: string;
  avatar?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  token?: string;
  user: User;
  school?: School;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
}

// Student types
export interface Student {
  id: string;
  schoolId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  admissionNumber: string;
  dateOfBirth?: string;
  gender: 'male' | 'female' | 'other';
  classId: string;
  className: string;
  grade: string;
  gradeLevel?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardians?: Guardian[];
  medicalInfo?: string;
  address?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Guardian {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
}

export interface StudentsQuery {
  search?: string;
  classId?: string;
  grade?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Staff types
export interface Staff {
  id: string;
  schoolId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'teacher' | 'admin' | 'accountant' | 'librarian' | 'nurse' | 'other';
  department?: string;
  subjects?: string[];
  employeeId: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  address?: string;
  avatar?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  qualifications?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffQuery {
  search?: string;
  role?: string;
  department?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Class types
export interface Class {
  id: string;
  schoolId?: string;
  name: string;
  grade: string;
  gradeLevel?: string;
  section?: string;
  academicYear: string;
  teacherId?: string;
  teacherName?: string;
  studentCount: number;
  capacity: number;
  schedule?: ClassSchedule[];
  createdAt: string;
  updatedAt?: string;
}

export interface ClassSchedule {
  day: string;
  periods: {
    time: string;
    subject: string;
    teacherId: string;
    teacherName: string;
  }[];
}

// Fee types
export interface FeeStructure {
  id: string;
  schoolId: string;
  name: string;
  amount: number;
  currency: string;
  type: 'tuition' | 'registration' | 'exam' | 'transport' | 'uniform' | 'other';
  frequency: 'once' | 'monthly' | 'termly' | 'yearly';
  grades: string[];
  gradeLevel?: string;
  description?: string;
  isActive: boolean;
  isRequired?: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  schoolId: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  className?: string;
  items: InvoiceItem[];
  amount: number;
  currency: string;
  subtotal?: number;
  discount?: number;
  total?: number;
  paid?: number;
  balance?: number;
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  issuedDate?: string;
  paidAt?: string;
  paidDate?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string;
  feeStructureId: string;
  description: string;
  amount: number;
  quantity?: number;
  total?: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  studentId: string;
  studentName: string;
  amount: number;
  currency: string;
  method: 'cash' | 'bank_transfer' | 'mobile_money' | 'card' | 'cheque';
  reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  processedBy?: string;
  receivedBy?: string;
  paidAt: string;
  createdAt?: string;
}

export interface InvoiceQuery {
  search?: string;
  status?: string;
  classId?: string;
  studentId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Attendance types
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className?: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
  markedBy: string;
  markedAt?: string;
  createdAt?: string;
}

export interface DailyAttendance {
  date: string;
  classId: string;
  className?: string;
  totalStudents?: number;
  present?: number;
  absent?: number;
  late?: number;
  excused?: number;
  attendanceRate?: number;
  records: AttendanceRecord[];
  stats?: AttendanceStats;
}

export interface AttendanceStats {
  totalStudents: number;
  totalDays?: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}

// Dashboard types
export interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  totalClasses: number;
  attendanceRate?: number;
  todayAttendance: {
    totalStudents: number;
    present: number;
    absent: number;
    late: number;
    excused: number;
    attendanceRate: number;
  };
  feeCollection: {
    totalExpected: number;
    totalCollected: number;
    collectionRate: number;
    overdueAmount: number;
  };
  pendingFees?: number;
  recentAlerts?: DashboardAlert[];
  recentActivities?: DashboardActivity[];
  alerts: DashboardAlertNew[];
  recentActivity: DashboardActivityNew[];
}

export interface DashboardAlert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  message: string;
  date: string;
}

export interface DashboardAlertNew {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardActivity {
  id: string;
  type: string;
  description: string;
  user: string;
  date: string;
}

export interface DashboardActivityNew {
  id: string;
  type: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
