import type { Staff, StaffQuery, PaginatedResponse } from '@/types';

export const mockStaff: Staff[] = [
  {
    id: 'staff-1',
    schoolId: 'school-1',
    firstName: 'John',
    lastName: 'Williams',
    email: 'j.williams@school.com',
    phone: '+26878001001',
    role: 'teacher',
    department: 'Mathematics',
    employeeId: 'EMP001',
    hireDate: '2020-01-15',
    dateOfBirth: '1985-03-20',
    gender: 'male',
    address: '123 School Lane, Mbabane',
    emergencyContact: 'Mary Williams',
    emergencyPhone: '+26878002001',
    status: 'active',
    qualifications: 'BSc Mathematics, PGCE',
    createdAt: '2020-01-15',
    updatedAt: '2024-01-10',
  },
  {
    id: 'staff-2',
    schoolId: 'school-1',
    firstName: 'Sarah',
    lastName: 'Thompson',
    email: 's.thompson@school.com',
    phone: '+26878001002',
    role: 'teacher',
    department: 'English',
    employeeId: 'EMP002',
    hireDate: '2019-08-20',
    status: 'active',
    qualifications: 'BA English Literature, PGCE',
    createdAt: '2019-08-20',
    updatedAt: '2024-01-10',
  },
  {
    id: 'staff-3',
    schoolId: 'school-1',
    firstName: 'Michael',
    lastName: 'Davis',
    email: 'm.davis@school.com',
    phone: '+26878001003',
    role: 'teacher',
    department: 'Science',
    employeeId: 'EMP003',
    hireDate: '2021-03-10',
    status: 'active',
    qualifications: 'BSc Physics, MSc Education',
    createdAt: '2021-03-10',
    updatedAt: '2024-01-10',
  },
  {
    id: 'staff-4',
    schoolId: 'school-1',
    firstName: 'Emily',
    lastName: 'Anderson',
    email: 'e.anderson@school.com',
    phone: '+26878001004',
    role: 'admin',
    department: 'Administration',
    employeeId: 'EMP004',
    hireDate: '2018-05-01',
    status: 'active',
    qualifications: 'BA Business Administration',
    createdAt: '2018-05-01',
    updatedAt: '2024-01-10',
  },
  {
    id: 'staff-5',
    schoolId: 'school-1',
    firstName: 'Robert',
    lastName: 'Martinez',
    email: 'r.martinez@school.com',
    phone: '+26878001005',
    role: 'accountant',
    department: 'Finance',
    employeeId: 'EMP005',
    hireDate: '2022-01-10',
    status: 'active',
    qualifications: 'BCom Accounting, CPA',
    createdAt: '2022-01-10',
    updatedAt: '2024-01-10',
  },
  {
    id: 'staff-6',
    schoolId: 'school-1',
    firstName: 'Jennifer',
    lastName: 'Roberts',
    email: 'j.roberts@school.com',
    phone: '+26878001006',
    role: 'teacher',
    department: 'History',
    employeeId: 'EMP006',
    hireDate: '2020-08-15',
    status: 'on_leave',
    qualifications: 'BA History, PGCE',
    createdAt: '2020-08-15',
    updatedAt: '2024-01-10',
  },
  {
    id: 'staff-7',
    schoolId: 'school-1',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'd.wilson@school.com',
    phone: '+26878001007',
    role: 'librarian',
    department: 'Library',
    employeeId: 'EMP007',
    hireDate: '2019-02-01',
    status: 'active',
    qualifications: 'BA Library Science',
    createdAt: '2019-02-01',
    updatedAt: '2024-01-10',
  },
  {
    id: 'staff-8',
    schoolId: 'school-1',
    firstName: 'Amanda',
    lastName: 'Brown',
    email: 'a.brown@school.com',
    phone: '+26878001008',
    role: 'nurse',
    department: 'Health',
    employeeId: 'EMP008',
    hireDate: '2021-06-01',
    status: 'active',
    qualifications: 'BSc Nursing',
    createdAt: '2021-06-01',
    updatedAt: '2024-01-10',
  },
];

export function getStaff(query?: StaffQuery): PaginatedResponse<Staff> {
  let filtered = [...mockStaff];

  if (query?.search) {
    const search = query.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.firstName.toLowerCase().includes(search) ||
        s.lastName.toLowerCase().includes(search) ||
        s.email.toLowerCase().includes(search) ||
        s.employeeId.toLowerCase().includes(search)
    );
  }

  if (query?.role) {
    filtered = filtered.filter((s) => s.role === query.role);
  }

  if (query?.department) {
    filtered = filtered.filter((s) => s.department === query.department);
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

export function getStaffById(id: string): Staff | undefined {
  return mockStaff.find(s => s.id === id);
}

export const departments = [
  'Mathematics',
  'English',
  'Science',
  'History',
  'Administration',
  'Finance',
  'Library',
  'Health',
];

// Export alias for consistency
export const mockStaffMembers = mockStaff;
