import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Eye,
  Bell,
  ClipboardList,
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
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
  mockSchoolStudentAnalytics,
  mockStudentAnalyticsRows,
} from '@/lib/mock-data/analytics';

const RISK_COLORS = {
  none: '#10b981',
  low: '#3b82f6',
  medium: '#f59e0b',
  high: '#ef4444',
};

const GRADE_COLORS = ['#10b981', '#22c55e', '#f59e0b', '#f97316', '#ef4444'];

export default function StudentAnalyticsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const analytics = mockSchoolStudentAnalytics;

  const filteredStudents = mockStudentAnalyticsRows.filter(student => {
    const matchesSearch =
      searchTerm === '' ||
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = gradeFilter === 'all' || student.gradeLevel === gradeFilter;
    const matchesRisk = riskFilter === 'all' || student.riskLevel === riskFilter;

    return matchesSearch && matchesGrade && matchesRisk;
  });

  const riskBadgeColor = {
    none: 'bg-emerald-100 text-emerald-700',
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Student Analytics</h1>
          <p className="text-gray-500">School-wide student performance analysis</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Users className="h-4 w-4" />
              Total Students
            </div>
            <div className="text-2xl font-bold">{analytics.overview.totalStudents}</div>
            <div className="text-xs text-gray-500">{analytics.overview.activeStudents} active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <BarChart3 className="h-4 w-4" />
              Avg Performance
            </div>
            <div className="text-2xl font-bold">{analytics.overview.averagePerformance}%</div>
            <div className="text-xs text-emerald-600">+2% this term</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Users className="h-4 w-4" />
              Attendance
            </div>
            <div className="text-2xl font-bold">{analytics.overview.averageAttendance}%</div>
            <div className="text-xs text-gray-500">School average</div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-amber-700 mb-1">
              <AlertTriangle className="h-4 w-4" />
              At Risk
            </div>
            <div className="text-2xl font-bold text-amber-700">{analytics.overview.atRiskCount}</div>
            <div className="text-xs text-amber-600">Need attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <ClipboardList className="h-4 w-4" />
              Interventions
            </div>
            <div className="text-2xl font-bold">18</div>
            <div className="text-xs text-gray-500">Active</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Performance Trend */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Performance & Attendance Trend</CardTitle>
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
                    dataKey="averageGrade"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Avg Grade"
                  />
                  <Line
                    type="monotone"
                    dataKey="attendanceRate"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Attendance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={analytics.riskDistribution}
                    dataKey="count"
                    nameKey="level"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                  >
                    {analytics.riskDistribution.map((entry) => (
                      <Cell
                        key={entry.level}
                        fill={RISK_COLORS[entry.level]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {analytics.riskDistribution.map(item => (
                <div key={item.level} className="flex items-center gap-1 text-xs">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: RISK_COLORS[item.level] }}
                  />
                  <span className="capitalize">{item.level}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grade Level Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance by Grade Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.byGradeLevel}>
                <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="averagePerformance" fill="#6366f1" name="Avg Grade" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attendanceRate" fill="#10b981" name="Attendance" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Student Performance List</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="Form 1">Form 1</SelectItem>
                  <SelectItem value="Form 2">Form 2</SelectItem>
                  <SelectItem value="Form 3">Form 3</SelectItem>
                  <SelectItem value="Form 4">Form 4</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map(student => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.admissionNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span
                        className={cn(
                          'font-semibold',
                          student.currentAverage >= 80 && 'text-emerald-600',
                          student.currentAverage >= 60 && student.currentAverage < 80 && 'text-amber-600',
                          student.currentAverage < 60 && 'text-red-600'
                        )}
                      >
                        {student.currentAverage}%
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({student.gradeLetter})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.trend === 'up' && (
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                    )}
                    {student.trend === 'down' && (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    {student.trend === 'stable' && (
                      <Minus className="h-4 w-4 text-gray-400" />
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        student.attendanceRate >= 90 && 'text-emerald-600',
                        student.attendanceRate >= 75 && student.attendanceRate < 90 && 'text-amber-600',
                        student.attendanceRate < 75 && 'text-red-600'
                      )}
                    >
                      {student.attendanceRate}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('capitalize', riskBadgeColor[student.riskLevel])}>
                      {student.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{student.teacherName}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/analytics/students/${student.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Analysis
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="h-4 w-4 mr-2" />
                          Notify Guardian
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ClipboardList className="h-4 w-4 mr-2" />
                          Create Intervention
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
