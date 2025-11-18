import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

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
import { Progress } from '@/components/ui/progress';
import { mockClasses } from '@/lib/mock-data/students';

const studentSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  admissionNumber: z.string().min(1, 'Admission number is required'),
  enrollmentDate: z.string().min(1, 'Enrollment date is required'),
  classId: z.string().min(1, 'Class is required'),
  grade: z.string().min(1, 'Grade is required'),
  address: z.string().optional(),
  medicalInfo: z.string().optional(),
  guardianFirstName: z.string().min(2, 'Guardian first name is required'),
  guardianLastName: z.string().min(2, 'Guardian last name is required'),
  guardianEmail: z.string().email('Invalid email'),
  guardianPhone: z.string().min(8, 'Phone number is required'),
  guardianRelationship: z.enum(['father', 'mother', 'guardian', 'other']),
});

type StudentFormData = z.infer<typeof studentSchema>;

const steps = [
  { id: 1, name: 'Personal Info', description: 'Basic student information' },
  { id: 2, name: 'Academic', description: 'Class and enrollment details' },
  { id: 3, name: 'Guardian', description: 'Parent/Guardian information' },
];

export function AddStudentPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      enrollmentDate: new Date().toISOString().split('T')[0],
      gender: 'male',
      guardianRelationship: 'father',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: StudentFormData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Creating student:', data);
      return { id: 'new-student' };
    },
    onSuccess: () => {
      toast.success('Student enrolled successfully');
      navigate('/students');
    },
    onError: () => {
      toast.error('Failed to enroll student');
    },
  });

  const validateStep = async () => {
    let fieldsToValidate: (keyof StudentFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'address', 'medicalInfo'];
        break;
      case 2:
        fieldsToValidate = ['admissionNumber', 'enrollmentDate', 'classId', 'grade'];
        break;
      case 3:
        fieldsToValidate = ['guardianFirstName', 'guardianLastName', 'guardianEmail', 'guardianPhone', 'guardianRelationship'];
        break;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: StudentFormData) => {
    createMutation.mutate(data);
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/students')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Student</h1>
          <p className="text-muted-foreground">Enroll a new student</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Step {currentStep} of {steps.length}</span>
          <span>{steps[currentStep - 1].name}</span>
        </div>
        <Progress value={progress} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Enter the student's basic details</CardDescription>
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
        )}

        {/* Step 2: Academic */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Academic Details</CardTitle>
              <CardDescription>Class and enrollment information</CardDescription>
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
            </CardContent>
          </Card>
        )}

        {/* Step 3: Guardian */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Guardian Information</CardTitle>
              <CardDescription>Primary parent/guardian contact</CardDescription>
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
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                'Enrolling...'
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Enroll Student
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
