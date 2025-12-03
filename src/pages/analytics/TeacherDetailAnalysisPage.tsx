import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  BarChart3,
  AlertTriangle,
  MessageSquare,
  ClipboardList,
  CheckCircle2,
  Lightbulb,
  Target,
  BookOpen,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { getTeacherDetailedAnalysis } from '@/lib/mock-data/analytics';

export default function TeacherDetailAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const analysis = getTeacherDetailedAnalysis(id || '');

  if (!analysis) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate('/analytics/teachers')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Teachers
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Teacher analysis not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { teacher, metrics, classes, performanceTrend, strengths, areasForGrowth, professionalDevelopmentSuggestions } = analysis;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/analytics/teachers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {teacher.firstName} {teacher.lastName}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {teacher.email}
              </span>
              {teacher.department && (
                <Badge variant="outline">{teacher.department}</Badge>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Since {new Date(teacher.hireDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Users className="h-4 w-4" />
              Total Students
            </div>
            <div className="text-2xl font-bold">{metrics.totalStudents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <BarChart3 className="h-4 w-4" />
              Avg Student Grade
            </div>
            <div className="text-2xl font-bold">
              <span className={cn(
                metrics.averageStudentGrade >= 80 && 'text-emerald-600',
                metrics.averageStudentGrade >= 70 && metrics.averageStudentGrade < 80 && 'text-blue-600',
                metrics.averageStudentGrade >= 60 && metrics.averageStudentGrade < 70 && 'text-amber-600',
                metrics.averageStudentGrade < 60 && 'text-red-600'
              )}>
                {metrics.averageStudentGrade}%
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {metrics.gradeImprovement > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-600">+{metrics.gradeImprovement}% this term</span>
                </>
              ) : metrics.gradeImprovement < 0 ? (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">{metrics.gradeImprovement}% this term</span>
                </>
              ) : (
                <span className="text-gray-500">No change</span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Users className="h-4 w-4" />
              Attendance Rate
            </div>
            <div className="text-2xl font-bold">
              <span className={cn(
                metrics.studentAttendanceRate >= 90 && 'text-emerald-600',
                metrics.studentAttendanceRate >= 80 && metrics.studentAttendanceRate < 90 && 'text-amber-600',
                metrics.studentAttendanceRate < 80 && 'text-red-600'
              )}>
                {metrics.studentAttendanceRate}%
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className={cn(metrics.atRiskStudentCount > 0 && 'bg-amber-50 border-amber-200')}>
          <CardContent className="p-4">
            <div className={cn(
              'flex items-center gap-2 text-sm mb-1',
              metrics.atRiskStudentCount > 0 ? 'text-amber-700' : 'text-gray-500'
            )}>
              <AlertTriangle className="h-4 w-4" />
              At-Risk Students
            </div>
            <div className={cn(
              'text-2xl font-bold',
              metrics.atRiskStudentCount > 0 && 'text-amber-700'
            )}>
              {metrics.atRiskStudentCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <ClipboardList className="h-4 w-4" />
              Interventions
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold">{metrics.interventionsCreated}</div>
                <div className="text-xs text-gray-500">Created</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-emerald-600">{metrics.interventionsSuccessful}</div>
                <div className="text-xs text-gray-500">Successful</div>
              </div>
            </div>
            {metrics.interventionsCreated > 0 && (
              <Progress
                value={(metrics.interventionsSuccessful / metrics.interventionsCreated) * 100}
                className="h-2 mt-2"
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <MessageSquare className="h-4 w-4" />
              Parent Communications
            </div>
            <div className="text-xl font-bold">{metrics.parentCommunications}</div>
            <div className="text-xs text-gray-500">This term</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <BookOpen className="h-4 w-4" />
              Classes Taught
            </div>
            <div className="text-xl font-bold">{classes.length}</div>
            <div className="text-xs text-gray-500">Active classes</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend & Class Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Performance Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceTrend}>
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

        {/* Class Performance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Class Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.map(cls => (
                <div key={cls.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cls.name}</span>
                    <span className="text-sm text-gray-500">{cls.studentCount} students</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500">Avg Grade</div>
                      <div className={cn(
                        'font-semibold',
                        cls.averageGrade >= 80 && 'text-emerald-600',
                        cls.averageGrade >= 70 && cls.averageGrade < 80 && 'text-blue-600',
                        cls.averageGrade >= 60 && cls.averageGrade < 70 && 'text-amber-600',
                        cls.averageGrade < 60 && 'text-red-600'
                      )}>
                        {cls.averageGrade}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Attendance</div>
                      <div className={cn(
                        'font-semibold',
                        cls.attendanceRate >= 90 && 'text-emerald-600',
                        cls.attendanceRate >= 80 && cls.attendanceRate < 90 && 'text-amber-600',
                        cls.attendanceRate < 80 && 'text-red-600'
                      )}>
                        {cls.attendanceRate}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">At Risk</div>
                      <div className={cn(
                        'font-semibold',
                        cls.atRiskCount > 0 ? 'text-amber-600' : 'text-gray-500'
                      )}>
                        {cls.atRiskCount}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Strengths */}
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((strength, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-emerald-600 mt-1">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Areas for Growth */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-amber-700">
              <Target className="h-5 w-5" />
              Areas for Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {areasForGrowth.map((area, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Professional Development */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-blue-700">
              <Lightbulb className="h-5 w-5" />
              Development Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {professionalDevelopmentSuggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
