import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, Users, User, Briefcase, Phone } from 'lucide-react';

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

const staffSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(8, 'Phone number is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
  role: z.enum(['teacher', 'admin', 'accountant', 'librarian', 'nurse', 'other']),
  department: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  hireDate: z.string().min(1, 'Hire date is required'),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  qualifications: z.string().optional(),
});

type StaffFormData = z.infer<typeof staffSchema>;

export function AddStaffPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      hireDate: new Date().toISOString().split('T')[0],
      gender: 'male',
      role: 'teacher',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Creating staff:', data);
      return { id: 'new-staff' };
    },
    onSuccess: () => {
      toast.success('Staff member added successfully');
      navigate('/staff');
    },
    onError: () => {
      toast.error('Failed to add staff member');
    },
  });

  const onSubmit = (data: StaffFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Hero Section */}
      <div className="gradient-secondary rounded-xl p-6 text-white">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/staff')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight drop-shadow-md">Add Staff</h1>
            <p className="text-white/80 mt-1">Add a new staff member</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <Users className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100">
                <User className="h-4 w-4 text-blue-600" />
              </span>
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Basic staff details</CardDescription>
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
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" {...register('phone')} />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
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
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-100">
                <Briefcase className="h-4 w-4 text-indigo-600" />
              </span>
              <div>
                <CardTitle>Employment Details</CardTitle>
                <CardDescription>Role and department information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input id="employeeId" {...register('employeeId')} />
                {errors.employeeId && (
                  <p className="text-sm text-destructive">{errors.employeeId.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="hireDate">Hire Date *</Label>
                <Input id="hireDate" type="date" {...register('hireDate')} />
                {errors.hireDate && (
                  <p className="text-sm text-destructive">{errors.hireDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={watch('role')}
                  onValueChange={(value) => setValue('role', value as StaffFormData['role'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="librarian">Librarian</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" {...register('department')} placeholder="e.g., Science, Languages" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifications">Qualifications</Label>
              <Textarea
                id="qualifications"
                placeholder="Degrees, certifications, etc."
                {...register('qualifications')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100">
                <Phone className="h-4 w-4 text-purple-600" />
              </span>
              <div>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>Contact in case of emergency</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Contact Name</Label>
                <Input id="emergencyContact" {...register('emergencyContact')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input id="emergencyPhone" {...register('emergencyPhone')} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              'Adding...'
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Add Staff Member
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
