import type { Student, Class, PaginatedResponse, StudentsQuery } from '@/types';

export const mockClasses: Class[] = [
  {
    id: 'class-1',
    schoolId: 'school-1',
    name: 'Grade 8A',
    grade: '8',
    section: 'A',
    academicYear: '2024',
    teacherId: 'teacher-1',
    teacherName: 'Mr. Williams',
    capacity: 35,
    studentCount: 32,
    createdAt: '2024-01-01',
  },
  {
    id: 'class-2',
    schoolId: 'school-1',
    name: 'Grade 8B',
    grade: '8',
    section: 'B',
    academicYear: '2024',
    teacherId: 'teacher-2',
    teacherName: 'Ms. Thompson',
    capacity: 35,
    studentCount: 30,
    createdAt: '2024-01-01',
  },
  {
    id: 'class-3',
    schoolId: 'school-1',
    name: 'Grade 9A',
    grade: '9',
    section: 'A',
    academicYear: '2024',
    teacherId: 'teacher-3',
    teacherName: 'Mrs. Davis',
    capacity: 35,
    studentCount: 34,
    createdAt: '2024-01-01',
  },
  {
    id: 'class-4',
    schoolId: 'school-1',
    name: 'Grade 9B',
    grade: '9',
    section: 'B',
    academicYear: '2024',
    teacherId: 'teacher-4',
    teacherName: 'Mr. Anderson',
    capacity: 35,
    studentCount: 28,
    createdAt: '2024-01-01',
  },
  {
    id: 'class-5',
    schoolId: 'school-1',
    name: 'Grade 10A',
    grade: '10',
    section: 'A',
    academicYear: '2024',
    teacherId: 'teacher-5',
    teacherName: 'Ms. Roberts',
    capacity: 35,
    studentCount: 31,
    createdAt: '2024-01-01',
  },
];

export const mockStudents: Student[] = [
  {
    id: 'student-1',
    schoolId: 'school-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '2010-05-15',
    gender: 'female',
    admissionNumber: 'STU001',
    enrollmentDate: '2024-01-10',
    classId: 'class-1',
    className: 'Grade 8A',
    grade: '8',
    status: 'active',
    address: '123 Main St',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: 'student-2',
    schoolId: 'school-1',
    firstName: 'Michael',
    lastName: 'Smith',
    dateOfBirth: '2010-08-22',
    gender: 'male',
    admissionNumber: 'STU002',
    enrollmentDate: '2024-01-10',
    classId: 'class-1',
    className: 'Grade 8A',
    grade: '8',
    status: 'active',
    address: '456 Oak Ave',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: 'student-3',
    schoolId: 'school-1',
    firstName: 'Emily',
    lastName: 'Brown',
    dateOfBirth: '2009-12-03',
    gender: 'female',
    admissionNumber: 'STU003',
    enrollmentDate: '2024-01-11',
    classId: 'class-3',
    className: 'Grade 9A',
    grade: '9',
    status: 'active',
    address: '789 Pine Rd',
    createdAt: '2024-01-11',
    updatedAt: '2024-01-11',
  },
  {
    id: 'student-4',
    schoolId: 'school-1',
    firstName: 'James',
    lastName: 'Wilson',
    dateOfBirth: '2009-03-18',
    gender: 'male',
    admissionNumber: 'STU004',
    enrollmentDate: '2024-01-11',
    classId: 'class-3',
    className: 'Grade 9A',
    grade: '9',
    status: 'active',
    createdAt: '2024-01-11',
    updatedAt: '2024-01-11',
  },
  {
    id: 'student-5',
    schoolId: 'school-1',
    firstName: 'Emma',
    lastName: 'Taylor',
    dateOfBirth: '2008-07-25',
    gender: 'female',
    admissionNumber: 'STU005',
    enrollmentDate: '2024-01-12',
    classId: 'class-5',
    className: 'Grade 10A',
    grade: '10',
    status: 'active',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
  },
  {
    id: 'student-6',
    schoolId: 'school-1',
    firstName: 'William',
    lastName: 'Martinez',
    dateOfBirth: '2010-11-08',
    gender: 'male',
    admissionNumber: 'STU006',
    enrollmentDate: '2024-01-12',
    classId: 'class-2',
    className: 'Grade 8B',
    grade: '8',
    status: 'active',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
  },
  {
    id: 'student-7',
    schoolId: 'school-1',
    firstName: 'Olivia',
    lastName: 'Garcia',
    dateOfBirth: '2009-09-30',
    gender: 'female',
    admissionNumber: 'STU007',
    enrollmentDate: '2024-01-13',
    classId: 'class-4',
    className: 'Grade 9B',
    grade: '9',
    status: 'inactive',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
  },
  {
    id: 'student-8',
    schoolId: 'school-1',
    firstName: 'Noah',
    lastName: 'Anderson',
    dateOfBirth: '2008-04-12',
    gender: 'male',
    admissionNumber: 'STU008',
    enrollmentDate: '2024-01-13',
    classId: 'class-5',
    className: 'Grade 10A',
    grade: '10',
    status: 'active',
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13',
  },
];

export function getStudents(query?: StudentsQuery): PaginatedResponse<Student> {
  let filtered = [...mockStudents];

  if (query?.search) {
    const search = query.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.firstName.toLowerCase().includes(search) ||
        s.lastName.toLowerCase().includes(search) ||
        s.admissionNumber.toLowerCase().includes(search)
    );
  }

  if (query?.classId) {
    filtered = filtered.filter((s) => s.classId === query.classId);
  }

  if (query?.grade) {
    filtered = filtered.filter((s) => s.grade === query.grade);
  }

  if (query?.status) {
    filtered = filtered.filter((s) => s.status === query.status);
  }

  const page = query?.page || 1;
  const limit = query?.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = filtered.slice(start, end);

  return {
    data,
    page,
    limit,
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / limit),
  };
}
