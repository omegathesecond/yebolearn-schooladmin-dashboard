import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Search,
  BarChart3,
  GraduationCap,
  MessageSquare,
  ClipboardList,
  Eye,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
  mockSchoolTeacherAnalytics,
  mockTeacherPerformanceRows,
} from '@/lib/mock-data/analytics';

export default function TeacherPerformancePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const analytics = mockSchoolTeacherAnalytics;

  const filteredTeachers = mockTeacherPerformanceRows.filter(teacher => {
    const matchesSearch =
      searchTerm === '' ||
      `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === 'all' || teacher.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(mockTeacherPerformanceRows.map(t => t.department).filter(Boolean))];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Teacher Performance</h1>
          <p className="text-gray-500">Monitor and analyze teacher effectiveness</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Users className="h-4 w-4" />
              Total Teachers
            </div>
            <div className="text-2xl font-bold">{analytics.overview.totalTeachers}</div>
            <div className="text-xs text-gray-500">{analytics.overview.activeTeachers} active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <GraduationCap className="h-4 w-4" />
              Total Classes
            </div>
            <div className="text-2xl font-bold">{analytics.overview.totalClasses}</div>
            <div className="text-xs text-gray-500">Across all grades</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <BarChart3 className="h-4 w-4" />
              Avg Class Performance
            </div>
            <div className="text-2xl font-bold">{analytics.overview.averageClassPerformance}%</div>
            <div className="text-xs text-emerald-600">+2% this term</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Users className="h-4 w-4" />
              Avg Attendance
            </div>
            <div className="text-2xl font-bold">{analytics.overview.averageStudentAttendance}%</div>
            <div className="text-xs text-gray-500">Student attendance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <ClipboardList className="h-4 w-4" />
              Interventions
            </div>
            <div className="text-2xl font-bold">10</div>
            <div className="text-xs text-gray-500">Created this month</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">School-wide Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.trendData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="averageStudentGrade"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Avg Student Grade"
                  />
                  <Line
                    type="monotone"
                    dataKey="averageAttendance"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Avg Attendance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Teacher Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.performanceDistribution}>
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teacher List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Teacher Performance List</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept!}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Avg Grade</TableHead>
                <TableHead>Improvement</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>At Risk</TableHead>
                <TableHead>Comms</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map(teacher => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {teacher.firstName} {teacher.lastName}
                      </div>
                      <div className="text-xs text-gray-500">{teacher.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  <TableCell>{teacher.classCount}</TableCell>
                  <TableCell>{teacher.studentCount}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'font-semibold',
                        teacher.averageStudentGrade >= 80 && 'text-emerald-600',
                        teacher.averageStudentGrade >= 70 && teacher.averageStudentGrade < 80 && 'text-blue-600',
                        teacher.averageStudentGrade >= 60 && teacher.averageStudentGrade < 70 && 'text-amber-600',
                        teacher.averageStudentGrade < 60 && 'text-red-600'
                      )}
                    >
                      {teacher.averageStudentGrade}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {teacher.gradeImprovement > 0 ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                          <span className="text-emerald-600">+{teacher.gradeImprovement}%</span>
                        </>
                      ) : teacher.gradeImprovement < 0 ? (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <span className="text-red-600">{teacher.gradeImprovement}%</span>
                        </>
                      ) : (
                        <span className="text-gray-500">0%</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        teacher.studentAttendanceRate >= 90 && 'text-emerald-600',
                        teacher.studentAttendanceRate >= 80 && teacher.studentAttendanceRate < 90 && 'text-amber-600',
                        teacher.studentAttendanceRate < 80 && 'text-red-600'
                      )}
                    >
                      {teacher.studentAttendanceRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {teacher.atRiskStudentCount > 0 ? (
                      <Badge variant="outline" className="border-amber-300 text-amber-700">
                        {teacher.atRiskStudentCount}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">0</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-gray-400" />
                      <span>{teacher.parentCommunicationCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/analytics/teachers/${teacher.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ClipboardList className="h-4 w-4 mr-2" />
                          View Classes
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
