export type LimitType = {
    id?: string;
    amount_spent: number;
    amount_limit: number;
    category: string;
    has_previous_limits?: boolean;
}