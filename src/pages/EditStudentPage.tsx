import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Trash2, GraduationCap, User, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { mockStudents, mockClasses } from '@/lib/mock-data/students';

const studentSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  admissionNumber: z.string().min(1, 'Admission number is required'),
  enrollmentDate: z.string().min(1, 'Enrollment date is required'),
  classId: z.string().min(1, 'Class is required'),
  grade: z.string().min(1, 'Grade is required'),
  status: z.enum(['active', 'inactive', 'graduated', 'transferred']),
  address: z.string().optional(),
  medicalInfo: z.string().optional(),
  guardianFirstName: z.string().min(2, 'Guardian first name is required'),
  guardianLastName: z.string().min(2, 'Guardian last name is required'),
  guardianEmail: z.string().email('Invalid email'),
  guardianPhone: z.string().min(8, 'Phone number is required'),
  guardianRelationship: z.enum(['father', 'mother', 'guardian', 'other']),
});

type StudentFormData = z.infer<typeof studentSchema>;

export function EditStudentPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('personal');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  // Fetch student data
  const { data: student, isLoading } = useQuery({
    queryKey: ['student', id],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const found = mockStudents.find(s => s.id === id);
      if (!found) throw new Error('Student not found');
      return found;
    },
    enabled: !!id,
  });

  // Populate form when student data loads
  useEffect(() => {
    if (student) {
      const guardian = student.guardians?.[0];
      reset({
        firstName: student.firstName,
        lastName: student.lastName,
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        admissionNumber: student.admissionNumber,
        enrollmentDate: student.enrollmentDate,
        classId: student.classId,
        grade: student.grade,
        status: student.status,
        address: student.address || '',
        medicalInfo: student.medicalInfo || '',
        guardianFirstName: guardian?.firstName || '',
        guardianLastName: guardian?.lastName || '',
        guardianEmail: guardian?.email || '',
        guardianPhone: guardian?.phone || '',
        guardianRelationship: guardian?.relationship || 'guardian',
      });
    }
  }, [student, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Updating student:', data);
      return { id };
    },
    onSuccess: () => {
      toast.success('Student updated successfully');
      navigate('/students');
    },
    onError: () => {
      toast.error('Failed to update student');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Deleting student:', id);
      return true;
    },
    onSuccess: () => {
      toast.success('Student deleted successfully');
      navigate('/students');
    },
    onError: () => {
      toast.error('Failed to delete student');
    },
  });

  const onSubmit = (data: StudentFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold">Student not found</h3>
        <Button variant="link" onClick={() => navigate('/students')}>
          Back to students
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Hero Section */}
      <div className="gradient-primary rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/students')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight drop-shadow-md">Edit Student</h1>
            <p className="text-white/80 mt-1">
              {student.firstName} {student.lastName} - {student.admissionNumber}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="bg-white/20 backdrop-blur-sm hover:bg-red-500/80 border-0">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Student
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Student</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {student.firstName} {student.lastName}?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="gap-2">
              <User className="h-4 w-4" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="academic" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Academic
            </TabsTrigger>
            <TabsTrigger value="guardian" className="gap-2">
              <Users className="h-4 w-4" />
              Guardian
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card className="card-interactive">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-100">
                    <User className="h-4 w-4 text-blue-600" />
                  </span>
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Basic student details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" {...register('firstName')} />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" {...register('lastName')} />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={watch('gender')}
                      onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" {...register('address')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalInfo">Medical Information</Label>
                  <Textarea
                    id="medicalInfo"
                    placeholder="Any allergies, conditions, or special needs..."
                    {...register('medicalInfo')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic">
            <Card className="card-interactive">
              <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-100">
                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                  </span>
                  <div>
                    <CardTitle>Academic Details</CardTitle>
                    <CardDescription>Class and enrollment information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="admissionNumber">Admission Number *</Label>
                    <Input id="admissionNumber" {...register('admissionNumber')} />
                    {errors.admissionNumber && (
                      <p className="text-sm text-destructive">{errors.admissionNumber.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentDate">Enrollment Date *</Label>
                    <Input id="enrollmentDate" type="date" {...register('enrollmentDate')} />
                    {errors.enrollmentDate && (
                      <p className="text-sm text-destructive">{errors.enrollmentDate.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade *</Label>
                    <Select
                      value={watch('grade')}
                      onValueChange={(value) => setValue('grade', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">Grade 8</SelectItem>
                        <SelectItem value="9">Grade 9</SelectItem>
                        <SelectItem value="10">Grade 10</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.grade && (
                      <p className="text-sm text-destructive">{errors.grade.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="classId">Class *</Label>
                    <Select
                      value={watch('classId')}
                      onValueChange={(value) => setValue('classId', value)}
                    >
                      <SelectTrigger>
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
                    {errors.classId && (
                      <p className="text-sm text-destructive">{errors.classId.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={watch('status')}
                    onValueChange={(value) => setValue('status', value as 'active' | 'inactive' | 'graduated' | 'transferred')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="graduated">Graduated</SelectItem>
                      <SelectItem value="transferred">Transferred</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guardian">
            <Card className="card-interactive">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-100">
                    <Users className="h-4 w-4 text-purple-600" />
                  </span>
                  <div>
                    <CardTitle>Guardian Information</CardTitle>
                    <CardDescription>Primary parent/guardian contact</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="guardianFirstName">First Name *</Label>
                    <Input id="guardianFirstName" {...register('guardianFirstName')} />
                    {errors.guardianFirstName && (
                      <p className="text-sm text-destructive">{errors.guardianFirstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianLastName">Last Name *</Label>
                    <Input id="guardianLastName" {...register('guardianLastName')} />
                    {errors.guardianLastName && (
                      <p className="text-sm text-destructive">{errors.guardianLastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="guardianEmail">Email *</Label>
                    <Input id="guardianEmail" type="email" {...register('guardianEmail')} />
                    {errors.guardianEmail && (
                      <p className="text-sm text-destructive">{errors.guardianEmail.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone">Phone *</Label>
                    <Input id="guardianPhone" {...register('guardianPhone')} />
                    {errors.guardianPhone && (
                      <p className="text-sm text-destructive">{errors.guardianPhone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianRelationship">Relationship *</Label>
                  <Select
                    value={watch('guardianRelationship')}
                    onValueChange={(value) => setValue('guardianRelationship', value as 'father' | 'mother' | 'guardian' | 'other')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={updateMutation.isPending || !isDirty}>
            {updateMutation.isPending ? (
              'Saving...'
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
