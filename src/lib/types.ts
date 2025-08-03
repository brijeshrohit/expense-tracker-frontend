export interface Expense {
    amount: number;
    date: Date;
    description: string;
    category: string;
    tag: string;
}

export interface TagAnalysis {
    tag: string;
    total: number;
    budget: number;
    status: 'over' | 'on' | 'under';
}

export interface CategoryAnalysis {
    category: string;
    total: number;
    budget: number;
    status: 'over' | 'on' | 'under';
    tags: TagAnalysis[];
}

export interface AnalysisData {
    summary: {
        totalExpenses: number;
        totalBudget: number;
        difference: number;
        status: 'over' | 'on' | 'under';
    };
    categories: CategoryAnalysis[];
}
