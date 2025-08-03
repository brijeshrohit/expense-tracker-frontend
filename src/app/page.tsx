import { AddExpenseForm } from '@/components/add-expense-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function DashboardPage() {
  return (
      <div className="grid gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Add New Expense</CardTitle>
            <CardDescription>
              Fill in the details below to add a new expense to your tracker. All
              fields are mandatory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddExpenseForm />
          </CardContent>
        </Card>
      </div>
  );
}
