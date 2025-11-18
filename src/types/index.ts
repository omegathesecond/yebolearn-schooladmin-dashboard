// Auth Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'school_admin' | 'teacher' | 'staff';
  schoolId: string;
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// School Types
export interface School {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  currentTerm?: string;
  currentYear?: string;
}

// Student Types
export interface Student {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  admissionNumber: string;
  enrollmentDate: string;
  classId: string;
  className?: string;
  grade: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  avatar?: string;
  address?: string;
  medicalInfo?: string;
  guardians?: Guardian[];
  createdAt: string;
  updatedAt: string;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  admissionNumber: string;
  enrollmentDate: string;
  classId: string;
  grade: string;
  address?: string;
  medicalInfo?: string;
}

// Guardian Types
export interface Guardian {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  isEmergencyContact: boolean;
  address?: string;
}

// Class Types
export interface Class {
  id: string;
  schoolId: string;
  name: string;
  grade: string;
  section?: string;
  academicYear: string;
  teacherId?: string;
  teacherName?: string;
  capacity: number;
  studentCount: number;
  subjects?: Subject[];
  createdAt: string;
}

// Subject Types
export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  description?: string;
  credits?: number;
  teacherId?: string;
  teacherName?: string;
}

// Staff Types
export interface Staff {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'teacher' | 'admin' | 'accountant' | 'librarian' | 'nurse' | 'other';
  department?: string;
  employeeId: string;
  hireDate: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  status: 'active' | 'inactive' | 'on_leave';
  avatar?: string;
  qualifications?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  subjects?: Subject[];
  classes?: Class[];
  createdAt: string;
  updatedAt: string;
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'teacher' | 'admin' | 'accountant' | 'librarian' | 'nurse' | 'other';
  department?: string;
  employeeId: string;
  hireDate: string;
  qualifications?: string;
  address?: string;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  markedBy: string;
  markedAt: string;
}

export interface AttendanceStats {
  totalStudents: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}

export interface DailyAttendance {
  date: string;
  classId: string;
  className?: string;
  records: AttendanceRecord[];
  stats: AttendanceStats;
}

// Fee Types
export interface FeeStructure {
  id: string;
  schoolId: string;
  name: string;
  amount: number;
  currency: string;
  type: 'tuition' | 'registration' | 'exam' | 'transport' | 'uniform' | 'other';
  frequency: 'once' | 'monthly' | 'termly' | 'yearly';
  grades: string[];
  isActive: boolean;
  dueDate?: string;
  description?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  schoolId: string;
  studentId: string;
  studentName?: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  items: InvoiceItem[];
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  feeStructureId: string;
  description: string;
  amount: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  studentId: string;
  studentName?: string;
  amount: number;
  currency: string;
  method: 'cash' | 'bank_transfer' | 'mobile_money' | 'card' | 'other';
  reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt: string;
  receivedBy: string;
  notes?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  totalClasses: number;
  todayAttendance: AttendanceStats;
  feeCollection: {
    totalExpected: number;
    totalCollected: number;
    collectionRate: number;
    overdueAmount: number;
  };
  recentActivity: Activity[];
  alerts: Alert[];
}

export interface Activity {
  id: string;
  type: 'enrollment' | 'payment' | 'attendance' | 'grade' | 'announcement';
  description: string;
  userId: string;
  userName: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Query Types
export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StudentsQuery {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  grade?: string;
  status?: string;
}

export interface StaffQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  department?: string;
  status?: string;
}

export interface AttendanceQuery {
  classId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  studentId?: string;
}

export interface InvoiceQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaymentQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  method?: string;
  startDate?: string;
  endDate?: string;
}

// Settings Types
export interface SchoolSettings {
  general: {
    schoolName: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
    motto?: string;
    website?: string;
  };
  academic: {
    currentTerm: string;
    currentYear: string;
    termStartDate: string;
    termEndDate: string;
    gradingScale: GradingScale[];
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    attendanceAlerts: boolean;
    feeReminders: boolean;
  };
}

export interface GradingScale {
  grade: string;
  minScore: number;
  maxScore: number;
  description: string;
}
