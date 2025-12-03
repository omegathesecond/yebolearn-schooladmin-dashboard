import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Target,
  Calendar,
  BookOpen,
  ClipboardCheck,
  Users,
  Bell,
  Brain,
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
import { getStudentDetailedAnalysis } from '@/lib/mock-data/analytics';

export default function StudentDetailAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const analysis = getStudentDetailedAnalysis(id || '');

  if (!analysis) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => navigate('/analytics/students')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Student analysis not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { student, metrics, subjects, performanceTrend, strengths, areasForImprovement, aiRecommendations, recentActivity } = analysis;

  const riskBadgeColor = {
    none: 'bg-emerald-100 text-emerald-700',
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700',
  };

  const activityIcon = {
    assessment: <ClipboardCheck className="h-4 w-4 text-blue-500" />,
    attendance: <Calendar className="h-4 w-4 text-amber-500" />,
    behavior: <Users className="h-4 w-4 text-purple-500" />,
    achievement: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/analytics/students')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">
                {student.firstName} {student.lastName}
              </h1>
              <Badge className={cn('capitalize', riskBadgeColor[metrics.riskLevel])}>
                {metrics.riskLevel === 'none' ? 'No Risk' : `${metrics.riskLevel} Risk`}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span>{student.admissionNumber}</span>
              <span>{student.className}</span>
              <span>Teacher: {student.teacherName}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notify Guardian
          </Button>
          <Button>
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Create Intervention
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <BarChart3 className="h-4 w-4" />
              Current Average
            </div>
            <div className="flex items-center gap-2">
              <span className={cn(
                'text-2xl font-bold',
                metrics.currentAverage >= 80 && 'text-emerald-600',
                metrics.currentAverage >= 60 && metrics.currentAverage < 80 && 'text-amber-600',
                metrics.currentAverage < 60 && 'text-red-600'
              )}>
                {metrics.currentAverage}%
              </span>
              <span className="text-lg text-gray-500">({metrics.gradeLetter})</span>
            </div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {metrics.trend === 'up' && (
                <>
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-600">Improving</span>
                </>
              )}
              {metrics.trend === 'down' && (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-red-600">Declining</span>
                </>
              )}
              {metrics.trend === 'stable' && (
                <>
                  <Minus className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-500">Stable</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Users className="h-4 w-4" />
              Class Rank
            </div>
            <div className="text-2xl font-bold">
              {metrics.classRank}<span className="text-sm text-gray-500">/{metrics.classSize}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar className="h-4 w-4" />
              Attendance
            </div>
            <div className={cn(
              'text-2xl font-bold',
              metrics.attendanceRate >= 90 && 'text-emerald-600',
              metrics.attendanceRate >= 75 && metrics.attendanceRate < 90 && 'text-amber-600',
              metrics.attendanceRate < 75 && 'text-red-600'
            )}>
              {metrics.attendanceRate}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <ClipboardCheck className="h-4 w-4" />
              Assignments
            </div>
            <div className="text-2xl font-bold">
              {metrics.assignmentsCompleted}<span className="text-sm text-gray-500">/{metrics.assignmentsTotal}</span>
            </div>
            <Progress
              value={(metrics.assignmentsCompleted / metrics.assignmentsTotal) * 100}
              className="h-1.5 mt-2"
            />
          </CardContent>
        </Card>
        {metrics.riskLevel !== 'none' && (
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm text-amber-700 mb-1">
                <AlertTriangle className="h-4 w-4" />
                Risk Level
              </div>
              <div className="text-2xl font-bold text-amber-700 capitalize">
                {metrics.riskLevel}
              </div>
              <div className="text-xs text-amber-600 mt-1">Needs attention</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Trend & Subject Breakdown */}
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
                    dataKey="average"
                    stroke="#6366f1"
                    strokeWidth={2}
                    name="Average"
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Attendance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2 rounded hover:bg-gray-50">
                  {activityIcon[activity.type]}
                  <div className="flex-1">
                    <div className="text-sm">{activity.description}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown with AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            Subject Performance with AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map(subject => (
              <div key={subject.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{subject.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'font-bold',
                      subject.grade >= 80 && 'text-emerald-600',
                      subject.grade >= 60 && subject.grade < 80 && 'text-amber-600',
                      subject.grade < 60 && 'text-red-600'
                    )}>
                      {subject.grade}% ({subject.gradeLetter})
                    </span>
                    {subject.trend === 'up' && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                    {subject.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                    {subject.trend === 'stable' && <Minus className="h-4 w-4 text-gray-400" />}
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  Teacher: {subject.teacherName} • Last: {new Date(subject.lastAssessment).toLocaleDateString()}
                </div>
                <div className="p-3 bg-indigo-50 rounded text-sm text-indigo-900">
                  <div className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span>{subject.aiInsights}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Summary */}
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

        {/* Areas for Improvement */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-amber-700">
              <Target className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {areasForImprovement.map((area, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-blue-700">
              <Lightbulb className="h-5 w-5" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {aiRecommendations.map((rec, idx) => (
                <li key={idx} className="text-sm flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
