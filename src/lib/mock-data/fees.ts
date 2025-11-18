import type { FeeStructure, Invoice, Payment, InvoiceQuery, PaginatedResponse } from '@/types';

export const mockFeeStructures: FeeStructure[] = [
  {
    id: 'fee-1',
    schoolId: 'school-1',
    name: 'Tuition Fee',
    amount: 5000,
    currency: 'SZL',
    type: 'tuition',
    frequency: 'termly',
    grades: ['8', '9', '10'],
    isActive: true,
    dueDate: '2024-02-15',
    description: 'Standard tuition fee for all grades',
    createdAt: '2024-01-01',
  },
  {
    id: 'fee-2',
    schoolId: 'school-1',
    name: 'Registration Fee',
    amount: 500,
    currency: 'SZL',
    type: 'registration',
    frequency: 'once',
    grades: ['8', '9', '10'],
    isActive: true,
    description: 'One-time registration fee for new students',
    createdAt: '2024-01-01',
  },
  {
    id: 'fee-3',
    schoolId: 'school-1',
    name: 'Exam Fee',
    amount: 300,
    currency: 'SZL',
    type: 'exam',
    frequency: 'termly',
    grades: ['10'],
    isActive: true,
    dueDate: '2024-03-01',
    description: 'Examination fee for Grade 10 students',
    createdAt: '2024-01-01',
  },
  {
    id: 'fee-4',
    schoolId: 'school-1',
    name: 'Transport Fee',
    amount: 800,
    currency: 'SZL',
    type: 'transport',
    frequency: 'monthly',
    grades: ['8', '9', '10'],
    isActive: true,
    description: 'School bus transport fee',
    createdAt: '2024-01-01',
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    schoolId: 'school-1',
    studentId: 'student-1',
    studentName: 'Sarah Johnson',
    invoiceNumber: 'INV-2024-001',
    amount: 5500,
    currency: 'SZL',
    status: 'paid',
    items: [
      { id: 'item-1', feeStructureId: 'fee-1', description: 'Tuition Fee', amount: 5000 },
      { id: 'item-2', feeStructureId: 'fee-2', description: 'Registration Fee', amount: 500 },
    ],
    dueDate: '2024-02-15',
    paidAt: '2024-02-10',
    paymentMethod: 'mobile_money',
    createdAt: '2024-01-15',
  },
  {
    id: 'inv-2',
    schoolId: 'school-1',
    studentId: 'student-2',
    studentName: 'Michael Smith',
    invoiceNumber: 'INV-2024-002',
    amount: 5000,
    currency: 'SZL',
    status: 'pending',
    items: [
      { id: 'item-3', feeStructureId: 'fee-1', description: 'Tuition Fee', amount: 5000 },
    ],
    dueDate: '2024-02-15',
    createdAt: '2024-01-15',
  },
  {
    id: 'inv-3',
    schoolId: 'school-1',
    studentId: 'student-3',
    studentName: 'Emily Brown',
    invoiceNumber: 'INV-2024-003',
    amount: 5300,
    currency: 'SZL',
    status: 'overdue',
    items: [
      { id: 'item-4', feeStructureId: 'fee-1', description: 'Tuition Fee', amount: 5000 },
      { id: 'item-5', feeStructureId: 'fee-3', description: 'Exam Fee', amount: 300 },
    ],
    dueDate: '2024-01-31',
    createdAt: '2024-01-10',
  },
  {
    id: 'inv-4',
    schoolId: 'school-1',
    studentId: 'student-4',
    studentName: 'James Wilson',
    invoiceNumber: 'INV-2024-004',
    amount: 5800,
    currency: 'SZL',
    status: 'paid',
    items: [
      { id: 'item-6', feeStructureId: 'fee-1', description: 'Tuition Fee', amount: 5000 },
      { id: 'item-7', feeStructureId: 'fee-4', description: 'Transport Fee', amount: 800 },
    ],
    dueDate: '2024-02-15',
    paidAt: '2024-02-05',
    paymentMethod: 'bank_transfer',
    createdAt: '2024-01-15',
  },
  {
    id: 'inv-5',
    schoolId: 'school-1',
    studentId: 'student-5',
    studentName: 'Emma Taylor',
    invoiceNumber: 'INV-2024-005',
    amount: 5300,
    currency: 'SZL',
    status: 'pending',
    items: [
      { id: 'item-8', feeStructureId: 'fee-1', description: 'Tuition Fee', amount: 5000 },
      { id: 'item-9', feeStructureId: 'fee-3', description: 'Exam Fee', amount: 300 },
    ],
    dueDate: '2024-02-28',
    createdAt: '2024-01-20',
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    invoiceId: 'inv-1',
    studentId: 'student-1',
    studentName: 'Sarah Johnson',
    amount: 5500,
    currency: 'SZL',
    method: 'mobile_money',
    reference: 'MTN-123456',
    status: 'completed',
    paidAt: '2024-02-10T10:30:00Z',
    receivedBy: 'admin',
  },
  {
    id: 'pay-2',
    invoiceId: 'inv-4',
    studentId: 'student-4',
    studentName: 'James Wilson',
    amount: 5800,
    currency: 'SZL',
    method: 'bank_transfer',
    reference: 'TRF-789012',
    status: 'completed',
    paidAt: '2024-02-05T14:15:00Z',
    receivedBy: 'admin',
  },
];

export function getInvoices(query?: InvoiceQuery): PaginatedResponse<Invoice> {
  let filtered = [...mockInvoices];

  if (query?.search) {
    const search = query.search.toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.studentName?.toLowerCase().includes(search) ||
        i.invoiceNumber.toLowerCase().includes(search)
    );
  }

  if (query?.status) {
    filtered = filtered.filter((i) => i.status === query.status);
  }

  if (query?.studentId) {
    filtered = filtered.filter((i) => i.studentId === query.studentId);
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

export function getFeeStats() {
  const totalExpected = mockInvoices.reduce((sum, i) => sum + i.amount, 0);
  const totalCollected = mockInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);
  const overdueAmount = mockInvoices
    .filter(i => i.status === 'overdue')
    .reduce((sum, i) => sum + i.amount, 0);
  const pendingAmount = mockInvoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);

  return {
    totalExpected,
    totalCollected,
    overdueAmount,
    pendingAmount,
    collectionRate: Math.round((totalCollected / totalExpected) * 100),
    invoiceCount: {
      total: mockInvoices.length,
      paid: mockInvoices.filter(i => i.status === 'paid').length,
      pending: mockInvoices.filter(i => i.status === 'pending').length,
      overdue: mockInvoices.filter(i => i.status === 'overdue').length,
    },
  };
}
