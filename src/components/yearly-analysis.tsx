'use client';

import { useState, useEffect } from 'react';
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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

async function fetchYearlyAnalysisData(
  year: number
): Promise<AnalysisData | null> {
  const requestBody = { year };
  const response = await fetch('/api/expenses/yearly-analysis', {
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

export function YearlyAnalysis() {
  const { toast } = useToast();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setLoading(true);
    fetchYearlyAnalysisData(selectedYear)
      .then((result) => {
        setData(result);
      })
      .catch(error => {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Error Fetching Data',
            description: error.message || 'Could not load yearly analysis data. Please check network connection and backend status.',
        });
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedYear, toast]);

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Filter by Year</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={String(selectedYear)}
            onValueChange={(val) => setSelectedYear(Number(val))}
          >
            <SelectTrigger className="w-full md:w-1/2">
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
        <AnalysisView data={data} periodLabel={`Year ${selectedYear}`} />
      )}
    </div>
  );
}
