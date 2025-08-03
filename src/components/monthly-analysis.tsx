'use client';

import { useState, useEffect, useMemo } from 'react';
import type { AnalysisData } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisView } from './analysis-view';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, 'label': 'November' },
  { value: 12, label: 'December' },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

async function fetchAnalysisData(
  month: number,
  year: number
): Promise<AnalysisData | null> {
  const requestBody = { month, year };
  const response = await fetch('/api/expenses/monthly-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Could not read error response from server.');
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }
  if (response.status === 204) { // No Content
    return null;
  }
  return response.json();
}

export function MonthlyAnalysis() {
  const { toast } = useToast();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    fetchAnalysisData(selectedMonth, selectedYear)
      .then((result) => {
        setData(result);
      })
      .catch(error => {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error Fetching Data',
            description: error.message || 'Could not load analysis data. Please check network connection and backend status.',
        });
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedMonth, selectedYear, toast]);

  const periodLabel = useMemo(() => {
    const monthLabel = months.find(m => m.value === selectedMonth)?.label;
    return `${monthLabel} ${selectedYear}`;
  }, [selectedMonth, selectedYear]);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Filter by Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Select
              value={String(selectedMonth)}
              onValueChange={(val) => setSelectedMonth(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={String(m.value)}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(selectedYear)}
              onValueChange={(val) => setSelectedYear(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-40 w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      ) : (
        <AnalysisView data={data} periodLabel={periodLabel} />
      )}
    </div>
  );
}
