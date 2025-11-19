import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Plus,
  Search,
  MoreHorizontal,
  Users,
  Mail,
  Phone,
  Briefcase,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getStaff } from '@/lib/mock-data/staff';
import type { StaffQuery } from '@/types';

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  inactive: 'bg-gray-100 text-gray-700 border-gray-200',
  on_leave: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const roleColors: Record<string, string> = {
  teacher: 'bg-blue-100 text-blue-700 border-blue-200',
  admin: 'bg-purple-100 text-purple-700 border-purple-200',
  accountant: 'bg-green-100 text-green-700 border-green-200',
  librarian: 'bg-orange-100 text-orange-700 border-orange-200',
  nurse: 'bg-pink-100 text-pink-700 border-pink-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

export function StaffPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState<StaffQuery>({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['staff', query],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return getStaff(query);
    },
  });

  const handleSearch = (value: string) => {
    setQuery((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleRoleFilter = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      role: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const handleStatusFilter = (value: string) => {
    setQuery((prev) => ({
      ...prev,
      status: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ');
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="gradient-secondary rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight drop-shadow-md">Staff</h1>
            <p className="text-white/80 mt-1">Manage teachers and staff members</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <Users className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
            <span className="text-sm">Total: {data?.total || 0} staff members</span>
          </div>
          <Button
            onClick={() => navigate('/staff/add')}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      <Card className="card-interactive">
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100">
              <Briefcase className="h-4 w-4 text-indigo-600" />
            </span>
            <CardTitle>All Staff</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                className="pl-9"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select onValueChange={handleRoleFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="librarian">Librarian</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-sm font-semibold">No staff found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data.map((staff) => (
                      <TableRow
                        key={staff.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/staff/${staff.id}/edit`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                {getInitials(staff.firstName, staff.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {staff.firstName} {staff.lastName}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {staff.email}
                              </div>
                              {staff.phone && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  {staff.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{staff.employeeId}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={roleColors[staff.role]}>
                            {formatRole(staff.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>{staff.department || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[staff.status]}>
                            {formatStatus(staff.status)}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => navigate(`/staff/${staff.id}/edit`)}
                              >
                                Edit Staff
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Schedule</DropdownMenuItem>
                              <DropdownMenuItem>Assign Classes</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data && data.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(data.page - 1) * data.limit + 1} to{' '}
                    {Math.min(data.page * data.limit, data.total)} of {data.total} staff
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.page === 1}
                      onClick={() => setQuery((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={data.page === data.totalPages}
                      onClick={() => setQuery((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
