import { useQuery } from '@tanstack/react-query';
import {
  GraduationCap,
  Users,
  ClipboardCheck,
  DollarSign,
  AlertTriangle,
  Info,
  TrendingUp,
  School,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  mockDashboardStats,
  mockAttendanceTrend,
  mockFeeCollectionTrend,
} from '@/lib/mock-data/dashboard';

export function DashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockDashboardStats;
    },
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="gradient-primary rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight drop-shadow-md">Welcome Back!</h1>
            <p className="text-white/80 mt-1">Here's your school overview for today</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <School className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-medium">Students</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats?.totalStudents || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Staff</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats?.totalStaff || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span className="text-sm font-medium">Attendance</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats?.todayAttendance.attendanceRate || 0}%</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Fees</span>
            </div>
            <p className="text-2xl font-bold mt-1">{stats?.feeCollection.collectionRate || 0}%</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <span className="p-1.5 rounded-lg bg-blue-100">
              <GraduationCap className="h-4 w-4 text-blue-600" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Enrolled this term</p>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <span className="p-1.5 rounded-lg bg-indigo-100">
              <Users className="h-4 w-4 text-indigo-600" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStaff || 0}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-green-500 to-green-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <span className="p-1.5 rounded-lg bg-green-100">
              <ClipboardCheck className="h-4 w-4 text-green-600" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.todayAttendance.attendanceRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.todayAttendance.present || 0} present,{' '}
              {stats?.todayAttendance.absent || 0} absent
            </p>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
            <span className="p-1.5 rounded-lg bg-purple-100">
              <DollarSign className="h-4 w-4 text-purple-600" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.feeCollection.collectionRate || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              ${((stats?.feeCollection.totalCollected || 0) / 1000).toFixed(0)}k collected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100">
                <Calendar className="h-4 w-4 text-blue-600" />
              </span>
              <div>
                <CardTitle>Attendance Trend</CardTitle>
                <CardDescription>Weekly attendance rate</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockAttendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={[90, 100]} className="text-xs" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </span>
              <div>
                <CardTitle>Fee Collection</CardTitle>
                <CardDescription>Monthly collection vs expected</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockFeeCollectionTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="collected" fill="hsl(var(--primary))" />
                  <Bar dataKey="expected" fill="hsl(var(--muted))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Alerts */}
        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500" />
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-yellow-100">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </span>
              <div>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Items requiring attention</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <div className="space-y-3">
                {stats?.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                  >
                    {alert.type === 'warning' ? (
                      <span className="p-1.5 rounded-lg bg-yellow-100">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-lg bg-blue-100">
                        <Info className="h-4 w-4 text-blue-600" />
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                    </div>
                    {!alert.isRead && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">New</Badge>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-green-500 to-teal-500" />
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-green-100">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </span>
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions in the system</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[250px]">
              <div className="space-y-3">
                {stats?.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.userName} · {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Fee Collection Progress */}
      <Card className="card-interactive">
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100">
              <DollarSign className="h-4 w-4 text-indigo-600" />
            </span>
            <div>
              <CardTitle>Fee Collection Progress</CardTitle>
              <CardDescription>Current term fee collection status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Collected</span>
              <span className="font-medium">
                ${((stats?.feeCollection.totalCollected || 0) / 1000).toFixed(1)}k of $
                {((stats?.feeCollection.totalExpected || 0) / 1000).toFixed(1)}k
              </span>
            </div>
            <Progress value={stats?.feeCollection.collectionRate || 0} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Overdue: ${((stats?.feeCollection.overdueAmount || 0) / 1000).toFixed(1)}k
              </span>
              <span>{stats?.feeCollection.collectionRate || 0}% collected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
