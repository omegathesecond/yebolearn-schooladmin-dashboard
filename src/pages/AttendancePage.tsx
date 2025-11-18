import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ClipboardCheck,
  Check,
  X,
  Clock,
  AlertCircle,
  Users,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Progress } from '@/components/ui/progress';
import {
  getClassesWithAttendance,
  getAttendanceByClass,
  getAttendanceStats,
  mockWeeklyTrend,
} from '@/lib/mock-data/attendance';
import { mockClasses } from '@/lib/mock-data/students';
import type { AttendanceRecord } from '@/types';

const statusConfig = {
  present: { label: 'Present', color: 'bg-green-100 text-green-800', icon: Check },
  absent: { label: 'Absent', color: 'bg-red-100 text-red-800', icon: X },
  late: { label: 'Late', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  excused: { label: 'Excused', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
};

export function AttendancePage() {
  const queryClient = useQueryClient();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Map<string, AttendanceRecord['status']>>(new Map());

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Fetch classes with attendance status
  const { data: classesData } = useQuery({
    queryKey: ['classes-attendance'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getClassesWithAttendance();
    },
  });

  // Fetch attendance for selected class
  const { data: records, isLoading } = useQuery({
    queryKey: ['attendance', selectedClass],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = getAttendanceByClass(selectedClass);
      // Initialize local state with existing data
      const map = new Map<string, AttendanceRecord['status']>();
      data.forEach(r => map.set(r.studentId, r.status));
      setAttendanceData(map);
      return data;
    },
    enabled: !!selectedClass,
  });

  // Save attendance mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      // In real app, send to API
      return true;
    },
    onSuccess: () => {
      toast.success('Attendance saved successfully');
      queryClient.invalidateQueries({ queryKey: ['classes-attendance'] });
    },
    onError: () => {
      toast.error('Failed to save attendance');
    },
  });

  const handleStatusChange = (studentId: string, status: AttendanceRecord['status']) => {
    setAttendanceData(prev => {
      const newMap = new Map(prev);
      newMap.set(studentId, status);
      return newMap;
    });
  };

  const markAllPresent = () => {
    if (!records) return;
    const newMap = new Map<string, AttendanceRecord['status']>();
    records.forEach(r => newMap.set(r.studentId, 'present'));
    setAttendanceData(newMap);
    toast.success('All students marked present');
  };

  const stats = records ? getAttendanceStats(
    records.map(r => ({ ...r, status: attendanceData.get(r.studentId) || r.status }))
  ) : null;

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.map(p => p.charAt(0)).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">{today}</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Marked</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {classesData?.filter(c => c.isMarked).length || 0}/{classesData?.length || 0}
            </div>
            <Progress
              value={classesData ? (classesData.filter(c => c.isMarked).length / classesData.length) * 100 : 0}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <Check className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {classesData?.reduce((sum, c) => sum + c.attendanceStats.present, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
            <X className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {classesData?.reduce((sum, c) => sum + c.attendanceStats.absent, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Late Today</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {classesData?.reduce((sum, c) => sum + c.attendanceStats.late, 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">students</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Class Selection & Marking */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Mark Attendance</CardTitle>
                  <CardDescription>Select a class to mark attendance</CardDescription>
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClasses.map(cls => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {!selectedClass ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">Select a class</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose a class to mark attendance
                  </p>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={markAllPresent}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark All Present
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? 'Saving...' : 'Save Attendance'}
                    </Button>
                  </div>

                  {stats && (
                    <div className="flex gap-4 mb-4 p-3 bg-muted rounded-lg">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Present:</span>{' '}
                        <span className="font-medium text-green-600">{stats.present}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Absent:</span>{' '}
                        <span className="font-medium text-red-600">{stats.absent}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Late:</span>{' '}
                        <span className="font-medium text-yellow-600">{stats.late}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Rate:</span>{' '}
                        <span className="font-medium">{stats.attendanceRate}%</span>
                      </div>
                    </div>
                  )}

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-[300px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {records?.map(record => {
                          const currentStatus = attendanceData.get(record.studentId) || record.status;
                          return (
                            <TableRow key={record.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback className="text-xs">
                                      {getInitials(record.studentName || '')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{record.studentName}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={statusConfig[currentStatus].color}>
                                  {statusConfig[currentStatus].label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  {(['present', 'absent', 'late', 'excused'] as const).map(status => {
                                    const config = statusConfig[status];
                                    const Icon = config.icon;
                                    return (
                                      <Button
                                        key={status}
                                        variant={currentStatus === status ? 'default' : 'outline'}
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleStatusChange(record.studentId, status)}
                                      >
                                        <Icon className="h-4 w-4" />
                                      </Button>
                                    );
                                  })}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trend</CardTitle>
            <CardDescription>Attendance this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockWeeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="present" fill="hsl(var(--chart-1))" name="Present" />
                  <Bar dataKey="absent" fill="hsl(var(--destructive))" name="Absent" />
                  <Bar dataKey="late" fill="hsl(var(--chart-3))" name="Late" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Classes Overview</CardTitle>
          <CardDescription>Today's attendance by class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classesData?.map(cls => (
              <div
                key={cls.id}
                className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedClass(cls.id)}
              >
                <div>
                  <p className="font-medium">{cls.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {cls.teacherName || 'No teacher assigned'}
                  </p>
                </div>
                <div className="text-right">
                  {cls.isMarked ? (
                    <>
                      <p className="text-lg font-bold text-green-600">
                        {cls.attendanceStats.attendanceRate}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cls.attendanceStats.present}/{cls.attendanceStats.totalStudents} present
                      </p>
                    </>
                  ) : (
                    <Badge variant="outline">Not marked</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
