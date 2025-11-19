import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Search,
  Clock,
  CreditCard,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getInvoices, getFeeStats, mockFeeStructures } from '@/lib/mock-data/fees';
import type { InvoiceQuery } from '@/types';

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700 border-gray-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  paid: 'bg-green-100 text-green-700 border-green-200',
  overdue: 'bg-red-100 text-red-700 border-red-200',
  cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
};

export function FeesPage() {
  const [query, setQuery] = useState<InvoiceQuery>({
    page: 1,
    limit: 10,
  });

  const { data: stats } = useQuery({
    queryKey: ['fee-stats'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getFeeStats();
    },
  });

  const { data: invoicesData, isLoading } = useQuery({
    queryKey: ['invoices', query],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return getInvoices(query);
    },
  });

  const handleSearch = (value: string) => {
    setQuery(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleStatusFilter = (value: string) => {
    setQuery(prev => ({
      ...prev,
      status: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SZ', {
      style: 'currency',
      currency: 'SZL',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="gradient-primary rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight drop-shadow-md">Fees & Billing</h1>
            <p className="text-white/80 mt-1">Manage fee structures and student invoices</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Expected</span>
            </div>
            <p className="text-xl font-bold mt-1">
              {stats ? formatCurrency(stats.totalExpected) : 'E0'}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Collected</span>
            </div>
            <p className="text-xl font-bold mt-1">
              {stats ? formatCurrency(stats.totalCollected) : 'E0'}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-xl font-bold mt-1">
              {stats ? formatCurrency(stats.pendingAmount) : 'E0'}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Overdue</span>
            </div>
            <p className="text-xl font-bold mt-1">
              {stats ? formatCurrency(stats.overdueAmount) : 'E0'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
            <span className="p-1.5 rounded-lg bg-blue-100">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.totalExpected) : 'E0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.invoiceCount.total || 0} invoices
            </p>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-green-500 to-green-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <span className="p-1.5 rounded-lg bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats ? formatCurrency(stats.totalCollected) : 'E0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.invoiceCount.paid || 0} paid
            </p>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-yellow-500 to-yellow-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <span className="p-1.5 rounded-lg bg-yellow-100">
              <Clock className="h-4 w-4 text-yellow-600" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats ? formatCurrency(stats.pendingAmount) : 'E0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.invoiceCount.pending || 0} invoices
            </p>
          </CardContent>
        </Card>

        <Card className="card-interactive">
          <div className="h-1 bg-gradient-to-r from-red-500 to-red-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <span className="p-1.5 rounded-lg bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats ? formatCurrency(stats.overdueAmount) : 'E0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.invoiceCount.overdue || 0} overdue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Collection Progress */}
      <Card className="card-interactive">
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100">
              <DollarSign className="h-4 w-4 text-indigo-600" />
            </span>
            <div>
              <CardTitle>Collection Progress</CardTitle>
              <CardDescription>Current term fee collection rate</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Collected</span>
              <span className="font-medium">{stats?.collectionRate || 0}%</span>
            </div>
            <Progress value={stats?.collectionRate || 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Fee Structures and Invoices */}
      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="structures">Fee Structures</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card className="card-interactive">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100">
                  <FileText className="h-4 w-4 text-blue-600" />
                </span>
                <div>
                  <CardTitle>Student Invoices</CardTitle>
                  <CardDescription>Manage and track all invoices</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-9"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <Select onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : invoicesData?.data.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold">No invoices found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Paid</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoicesData?.data.map((invoice) => (
                        <TableRow key={invoice.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell>
                            <div className="font-medium">{invoice.invoiceNumber}</div>
                          </TableCell>
                          <TableCell>{invoice.studentName}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(invoice.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusColors[invoice.status]}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                          <TableCell>
                            {invoice.paidAt ? formatDate(invoice.paidAt) : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {invoicesData && invoicesData.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(invoicesData.page - 1) * invoicesData.limit + 1} to{' '}
                    {Math.min(invoicesData.page * invoicesData.limit, invoicesData.total)} of{' '}
                    {invoicesData.total} invoices
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={invoicesData.page === 1}
                      onClick={() => setQuery(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={invoicesData.page === invoicesData.totalPages}
                      onClick={() => setQuery(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structures" className="space-y-4">
          <Card className="card-interactive">
            <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-100">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                </span>
                <div>
                  <CardTitle>Fee Structures</CardTitle>
                  <CardDescription>Define fee types and amounts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {mockFeeStructures.map((fee) => (
                  <div
                    key={fee.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{fee.name}</h4>
                      <Badge className={fee.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}>
                        {fee.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {formatCurrency(fee.amount)}
                      <span className="text-sm font-normal text-muted-foreground ml-1">
                        / {fee.frequency}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{fee.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {fee.grades.map((grade) => (
                        <Badge key={grade} variant="outline" className="text-xs bg-indigo-100 text-indigo-700 border-indigo-200">
                          Grade {grade}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
