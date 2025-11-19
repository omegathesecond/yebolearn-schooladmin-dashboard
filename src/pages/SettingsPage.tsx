import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Save,
  Building2,
  Clock,
  Bell,
  Palette,
  Shield,
  Settings,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const schoolInfoSchema = z.object({
  name: z.string().min(2, 'School name is required'),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(8, 'Phone is required'),
  email: z.string().email('Invalid email'),
  website: z.string().optional(),
  motto: z.string().optional(),
  principalName: z.string().min(2, 'Principal name is required'),
  establishedYear: z.string().min(4, 'Established year is required'),
});

type SchoolInfoData = z.infer<typeof schoolInfoSchema>;

const academicSchema = z.object({
  currentTerm: z.string().min(1, 'Current term is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  termStartDate: z.string().min(1, 'Term start date is required'),
  termEndDate: z.string().min(1, 'Term end date is required'),
  gradeSystem: z.enum(['percentage', 'gpa', 'letter']),
  passingGrade: z.string().min(1, 'Passing grade is required'),
});

type AcademicData = z.infer<typeof academicSchema>;

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    attendanceAlerts: true,
    feeReminders: true,
    parentNotifications: true,
  });

  // School info form
  const schoolInfoForm = useForm<SchoolInfoData>({
    resolver: zodResolver(schoolInfoSchema),
    defaultValues: {
      name: 'Mbabane High School',
      address: '123 Education Street, Mbabane, Eswatini',
      phone: '+26824001234',
      email: 'info@mbabanehigh.edu.sz',
      website: 'www.mbabanehigh.edu.sz',
      motto: 'Excellence in Education',
      principalName: 'Dr. Sarah Dlamini',
      establishedYear: '1985',
    },
  });

  // Academic form
  const academicForm = useForm<AcademicData>({
    resolver: zodResolver(academicSchema),
    defaultValues: {
      currentTerm: '1',
      academicYear: '2024',
      termStartDate: '2024-01-15',
      termEndDate: '2024-04-05',
      gradeSystem: 'percentage',
      passingGrade: '50',
    },
  });

  const saveSchoolInfoMutation = useMutation({
    mutationFn: async (data: SchoolInfoData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving school info:', data);
      return true;
    },
    onSuccess: () => {
      toast.success('School information saved successfully');
    },
    onError: () => {
      toast.error('Failed to save school information');
    },
  });

  const saveAcademicMutation = useMutation({
    mutationFn: async (data: AcademicData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving academic settings:', data);
      return true;
    },
    onSuccess: () => {
      toast.success('Academic settings saved successfully');
    },
    onError: () => {
      toast.error('Failed to save academic settings');
    },
  });

  const saveNotificationsMutation = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving notifications:', notifications);
      return true;
    },
    onSuccess: () => {
      toast.success('Notification settings saved successfully');
    },
    onError: () => {
      toast.error('Failed to save notification settings');
    },
  });

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="gradient-primary rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight drop-shadow-md">Settings</h1>
            <p className="text-white/80 mt-1">Manage school configuration and preferences</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <Settings className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none">
          <TabsTrigger value="general" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="academic" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Academic</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="card-interactive">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </span>
                <div>
                  <CardTitle>School Information</CardTitle>
                  <CardDescription>Basic information about your school</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={schoolInfoForm.handleSubmit((data) => saveSchoolInfoMutation.mutate(data))} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">School Name *</Label>
                    <Input id="name" {...schoolInfoForm.register('name')} />
                    {schoolInfoForm.formState.errors.name && (
                      <p className="text-sm text-destructive">{schoolInfoForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="principalName">Principal Name *</Label>
                    <Input id="principalName" {...schoolInfoForm.register('principalName')} />
                    {schoolInfoForm.formState.errors.principalName && (
                      <p className="text-sm text-destructive">{schoolInfoForm.formState.errors.principalName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea id="address" {...schoolInfoForm.register('address')} />
                  {schoolInfoForm.formState.errors.address && (
                    <p className="text-sm text-destructive">{schoolInfoForm.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" {...schoolInfoForm.register('phone')} />
                    {schoolInfoForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">{schoolInfoForm.formState.errors.phone.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" {...schoolInfoForm.register('email')} />
                    {schoolInfoForm.formState.errors.email && (
                      <p className="text-sm text-destructive">{schoolInfoForm.formState.errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" {...schoolInfoForm.register('website')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">Established Year *</Label>
                    <Input id="establishedYear" {...schoolInfoForm.register('establishedYear')} />
                    {schoolInfoForm.formState.errors.establishedYear && (
                      <p className="text-sm text-destructive">{schoolInfoForm.formState.errors.establishedYear.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motto">School Motto</Label>
                  <Input id="motto" {...schoolInfoForm.register('motto')} />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saveSchoolInfoMutation.isPending}>
                    {saveSchoolInfoMutation.isPending ? 'Saving...' : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Academic Settings */}
        <TabsContent value="academic">
          <Card className="card-interactive">
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-100">
                  <Clock className="h-4 w-4 text-indigo-600" />
                </span>
                <div>
                  <CardTitle>Academic Settings</CardTitle>
                  <CardDescription>Configure academic year and grading system</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={academicForm.handleSubmit((data) => saveAcademicMutation.mutate(data))} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Academic Year *</Label>
                    <Select
                      value={academicForm.watch('academicYear')}
                      onValueChange={(value) => academicForm.setValue('academicYear', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentTerm">Current Term *</Label>
                    <Select
                      value={academicForm.watch('currentTerm')}
                      onValueChange={(value) => academicForm.setValue('currentTerm', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Term 1</SelectItem>
                        <SelectItem value="2">Term 2</SelectItem>
                        <SelectItem value="3">Term 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="termStartDate">Term Start Date *</Label>
                    <Input id="termStartDate" type="date" {...academicForm.register('termStartDate')} />
                    {academicForm.formState.errors.termStartDate && (
                      <p className="text-sm text-destructive">{academicForm.formState.errors.termStartDate.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="termEndDate">Term End Date *</Label>
                    <Input id="termEndDate" type="date" {...academicForm.register('termEndDate')} />
                    {academicForm.formState.errors.termEndDate && (
                      <p className="text-sm text-destructive">{academicForm.formState.errors.termEndDate.message}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gradeSystem">Grading System *</Label>
                    <Select
                      value={academicForm.watch('gradeSystem')}
                      onValueChange={(value) => academicForm.setValue('gradeSystem', value as 'percentage' | 'gpa' | 'letter')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (0-100)</SelectItem>
                        <SelectItem value="gpa">GPA (0-4)</SelectItem>
                        <SelectItem value="letter">Letter Grades (A-F)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passingGrade">Passing Grade *</Label>
                    <Input id="passingGrade" {...academicForm.register('passingGrade')} placeholder="e.g., 50" />
                    {academicForm.formState.errors.passingGrade && (
                      <p className="text-sm text-destructive">{academicForm.formState.errors.passingGrade.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saveAcademicMutation.isPending}>
                    {saveAcademicMutation.isPending ? 'Saving...' : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="card-interactive">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-100">
                  <Bell className="h-4 w-4 text-purple-600" />
                </span>
                <div>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure how you receive alerts and notifications</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="emailAlerts">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via email
                  </p>
                </div>
                <Switch
                  id="emailAlerts"
                  checked={notifications.emailAlerts}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailAlerts: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="smsAlerts">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive urgent alerts via SMS
                  </p>
                </div>
                <Switch
                  id="smsAlerts"
                  checked={notifications.smsAlerts}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, smsAlerts: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="attendanceAlerts">Attendance Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about attendance issues
                  </p>
                </div>
                <Switch
                  id="attendanceAlerts"
                  checked={notifications.attendanceAlerts}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, attendanceAlerts: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="feeReminders">Fee Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders about pending fees
                  </p>
                </div>
                <Switch
                  id="feeReminders"
                  checked={notifications.feeReminders}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, feeReminders: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="space-y-0.5">
                  <Label htmlFor="parentNotifications">Parent Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send automated notifications to parents
                  </p>
                </div>
                <Switch
                  id="parentNotifications"
                  checked={notifications.parentNotifications}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, parentNotifications: checked }))}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => saveNotificationsMutation.mutate()}
                  disabled={saveNotificationsMutation.isPending}
                >
                  {saveNotificationsMutation.isPending ? 'Saving...' : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="card-interactive">
            <div className="h-1 bg-gradient-to-r from-pink-500 to-orange-500" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-pink-100">
                  <Palette className="h-4 w-4 text-pink-600" />
                </span>
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of the dashboard</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                    <div className="h-8 bg-white border rounded mb-2" />
                    <p className="text-sm font-medium text-center">Light</p>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                    <div className="h-8 bg-gray-900 rounded mb-2" />
                    <p className="text-sm font-medium text-center">Dark</p>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors border-primary">
                    <div className="h-8 bg-gradient-to-r from-white to-gray-900 rounded mb-2" />
                    <p className="text-sm font-medium text-center">System</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'].map((color) => (
                    <div
                      key={color}
                      className="h-8 rounded cursor-pointer hover:ring-2 ring-offset-2 transition-shadow"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1.5 rounded-lg bg-blue-100">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </span>
                  <span className="font-medium">Premium Feature</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Custom branding and white-labeling options are available on the Premium plan.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
