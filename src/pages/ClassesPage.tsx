import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Users,
  GraduationCap,
  BookOpen,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockClasses } from '@/lib/mock-data/students';

export function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes', searchTerm, gradeFilter],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      let filtered = [...mockClasses];

      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(search) ||
          c.teacherName?.toLowerCase().includes(search)
        );
      }

      if (gradeFilter !== 'all') {
        filtered = filtered.filter(c => c.grade === gradeFilter);
      }

      return filtered;
    },
  });

  const totalStudents = classes?.reduce((sum, c) => sum + c.studentCount, 0) || 0;
  const totalCapacity = classes?.reduce((sum, c) => sum + c.capacity, 0) || 0;
  const utilizationRate = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

  const grades = [...new Set(mockClasses.map(c => c.grade))].sort();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="gradient-accent rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight drop-shadow-md">Classes</h1>
            <p className="text-white/80 mt-1">Manage class schedules and assignments</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
            <span className="text-sm">Total: {classes?.length || 0} classes</span>
          </div>
          <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-indigo-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <span className="p-1.5 rounded-lg bg-indigo-100">
              <BookOpen className="h-4 w-4 text-indigo-600" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Active this term</p>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <span className="p-1.5 rounded-lg bg-blue-100">
              <GraduationCap className="h-4 w-4 text-blue-600" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all classes
            </p>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacity Utilization</CardTitle>
            <span className="p-1.5 rounded-lg bg-purple-100">
              <Users className="h-4 w-4 text-purple-600" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{utilizationRate}%</div>
            <Progress value={utilizationRate} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {grades.map(grade => (
              <SelectItem key={grade} value={grade}>
                Grade {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Classes Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : classes?.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-sm font-semibold">No classes found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes?.map((cls) => {
            const capacityUsed = Math.round((cls.studentCount / cls.capacity) * 100);
            return (
              <Card key={cls.id} className="card-interactive cursor-pointer">
                <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                      Grade {cls.grade}
                    </Badge>
                  </div>
                  <CardDescription>
                    {cls.teacherName || 'No teacher assigned'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-blue-100">
                          <Users className="h-3 w-3 text-blue-600" />
                        </span>
                        <span>Students</span>
                      </div>
                      <span className="font-medium">
                        {cls.studentCount} / {cls.capacity}
                      </span>
                    </div>
                    <Progress value={capacityUsed} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{capacityUsed}% capacity</span>
                      <span>{cls.capacity - cls.studentCount} seats available</span>
                    </div>
                    {cls.section && (
                      <Badge variant="secondary" className="text-xs">
                        Section {cls.section}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
