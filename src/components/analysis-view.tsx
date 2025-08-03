'use client';

import type { AnalysisData, CategoryAnalysis } from '@/lib/types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useState } from 'react';

const getStatusStyles = (status: 'over' | 'on' | 'under') => {
  switch (status) {
    case 'over':
      return {
        className: 'text-destructive',
        Icon: TrendingUp,
        color: 'hsl(var(--destructive))',
      };
    case 'on':
      return {
        className: 'text-blue-500',
        Icon: Minus,
        color: 'hsl(var(--chart-4))',
      };
    case 'under':
      return {
        className: 'text-green-600',
        Icon: TrendingDown,
        color: 'hsl(var(--chart-2))',
      };
    default:
      return {
        className: 'text-muted-foreground',
        Icon: Minus,
        color: 'hsl(var(--muted-foreground))',
      };
  }
};

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

function SummaryCard({
                       title,
                       value,
                       description,
                     }: {
  title: string;
  value: string;
  description: React.ReactNode;
}) {
  return (
      <Card>
        <CardHeader>
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-3xl">{value}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">{description}</div>
        </CardContent>
      </Card>
  );
}

export function AnalysisView({ data, periodLabel }: { data: AnalysisData | null; periodLabel: string }) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryAnalysis | null>(null);

  if (!data || data.categories.length === 0) {
    return (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>
              There is no expense data for {periodLabel}.
            </CardDescription>
          </CardHeader>
        </Card>
    );
  }

  const { summary, categories } = data;
  const summaryStatus = getStatusStyles(summary.status);
  const overBudgetCategories = categories.filter(c => c.status === 'over');

  const handlePieClick = (entry: any) => {
    const categoryData = categories.find(c => c.category === entry.name);
    setSelectedCategory(categoryData || null);
  };

  return (
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Summary for {periodLabel}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <SummaryCard
                title="Total Expenses"
                value={formatCurrency(summary.totalExpenses)}
                description={
                  <span className="flex items-center gap-1">
                        vs. Budget of {formatCurrency(summary.totalBudget)}
                    </span>
                }
            />
            <SummaryCard
                title="Budget vs Actual"
                value={formatCurrency(summary.difference)}
                description={
                  <span className={cn('flex items-center gap-1 font-semibold', summaryStatus.className)}>
                        <summaryStatus.Icon className="h-4 w-4" />
                    {summary.status.charAt(0).toUpperCase() + summary.status.slice(1)} budget
                    </span>
                }
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Budget vs Expenditure</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                      }}
                      formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend />
                  <Bar dataKey="total" name="Spent" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="budget" name="Budget" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Click a slice to see tag breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                      data={categories}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                      onClick={(e) => handlePieClick(e)}
                      style={{cursor: 'pointer'}}
                  >
                    {categories.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                        />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {selectedCategory && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Tag Breakdown for {selectedCategory.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={selectedCategory.tags} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                    <YAxis type="category" dataKey="tag" width={100} />
                    <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          borderColor: 'hsl(var(--border))',
                        }}
                        formatter={(value) => formatCurrency(Number(value))}
                    />
                    <Legend />
                    <Bar dataKey="total" name="Spent" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="budget" name="Budget" fill="hsl(var(--accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        )}

        {overBudgetCategories.length > 0 && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-destructive">Over-Budget Categories</CardTitle>
                <CardDescription>
                  The following categories have exceeded their budget. Here is a tag-wise breakdown.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {overBudgetCategories.map((category) => (
                    <div key={category.category}>
                      <h3 className="mb-2 text-lg font-semibold">{category.category}</h3>
                      <ResponsiveContainer width="100%" height={100 + category.tags.length * 40}>
                        <BarChart data={category.tags} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                          <YAxis type="category" dataKey="tag" width={150} />
                          <Tooltip
                              contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                borderColor: 'hsl(var(--border))',
                              }}
                              formatter={(value) => formatCurrency(Number(value))}
                          />
                          <Legend />
                          <Bar dataKey="total" name="Spent">
                            {category.tags.map((tag, index) => (
                                <Cell key={`cell-${index}`} fill={tag.status === 'over' ? 'hsl(var(--destructive))' : 'hsl(var(--chart-1))'} />
                            ))}
                          </Bar>
                          <Bar dataKey="budget" name="Budget" fill="hsl(var(--accent))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                ))}
              </CardContent>
            </Card>
        )}


        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Detailed Breakdown</CardTitle>
            <CardDescription>
              View detailed spending and budget status for each category and tag.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category / Tag</TableHead>
                  <TableHead className="text-right">Amount Spent</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                    <>
                      <TableRow key={cat.category} className="bg-muted/50">
                        <TableCell className="font-bold">{cat.category}</TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(cat.total)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(cat.budget)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                              variant={cat.status === 'over' ? 'destructive' : 'secondary'}
                              className={cn(getStatusStyles(cat.status).className)}
                          >
                            {cat.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      {cat.tags.map((tag) => (
                          <TableRow key={tag.tag}>
                            <TableCell className="pl-8">{tag.tag}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(tag.total)}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(tag.budget)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                  variant={tag.status === 'over' ? 'destructive' : 'outline'}
                                  className={cn(getStatusStyles(tag.status).className)}
                              >
                                {tag.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                      ))}
                    </>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
}
