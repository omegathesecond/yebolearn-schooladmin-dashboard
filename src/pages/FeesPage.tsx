import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Search,
  Clock,
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
  draft: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fees & Billing</h1>
        <p className="text-muted-foreground">Manage fee structures and student invoices</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
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
      <Card>
        <CardHeader>
          <CardTitle>Collection Progress</CardTitle>
          <CardDescription>Current term fee collection rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Collected</span>
              <span className="font-medium">{stats?.collectionRate || 0}%</span>
            </div>
            <Progress value={stats?.collectionRate || 0} />
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
          <Card>
            <CardHeader>
              <CardTitle>Student Invoices</CardTitle>
              <CardDescription>Manage and track all invoices</CardDescription>
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
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">No invoices found</h3>
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
          <Card>
            <CardHeader>
              <CardTitle>Fee Structures</CardTitle>
              <CardDescription>Define fee types and amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {mockFeeStructures.map((fee) => (
                  <div
                    key={fee.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{fee.name}</h4>
                      <Badge variant={fee.isActive ? 'default' : 'secondary'}>
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
                        <Badge key={grade} variant="outline" className="text-xs">
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
