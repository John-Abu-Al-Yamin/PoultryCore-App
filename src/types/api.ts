import type { AxiosRequestConfig } from "axios";

export type RequestConfig = AxiosRequestConfig;

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface Barn {
  id: number;
  user_id: number;
  name: string;
  location: string;
  capacity: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  batches?: Batch[];
}

export interface BarnListItem {
  id: number;
  name: string;
  location: string;
  capacity: number;
  batches_count: number;
}

export interface Batch {
  id: number;
  user_id: number;
  barn_id: number;
  poultry_type: string;
  current_quantity: number;
  start_date: string;
  end_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address: string;
  total_debts: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address: string;
  total_dues: string;
  created_at: string;
  updated_at: string;
}

export interface MutationVariables {
  data?: Record<string, unknown>;
  url?: string;
  id?: string | number;
  disableSuccessToast?: boolean;
  disableErrorToast?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
}

export interface MutationContext {
  loadingToastId?: string | number;
}

export interface BatchCosts {
  batch_id: number;
  summary: {
    total_purchases: number;
    total_sales: number;
    net: number;
  };
  purchases: {
    chicks: { total: number; count: number; quantity: number };
    feed: { total: number; count: number; quantity: number };
    medicine: { total: number; count: number; quantity: number };
    other: { total: number; count: number; quantity: number };
  };
  revenue: {
    total: number;
    count: number;
  };
}

export interface DashboardCounts {
  barns: number;
  active_batches: number;
  batches: number;
  purchases: number;
  payments: number;
  suppliers: number;
  customers: number;
  sales: number;
  deaths: number;
  expenses: number;
}

export interface DashboardFinancial {
  total_purchases_cost: number;
  total_sales_revenue: number;
  total_expenses: number;
  total_paid_to_suppliers: number;
  total_received_from_customers: number;
  outstanding_supplier_dues: number;
  outstanding_customer_debts: number;
  net_revenue: number;
}

export interface DashboardProduction {
  total_current_poultry: number;
  active_poultry: number;
  total_deaths: number;
  active_batches: unknown[];
}

export interface DashboardAlerts {
  low_stock_batches: unknown[];
  suppliers_with_dues: unknown[];
  customers_with_debts: unknown[];
  recent_deaths_7_days: number;
  batches_ending_soon: unknown[];
  unpaid_purchases: number;
  unpaid_sales: number;
}

export interface DashboardData {
  counts: DashboardCounts;
  financial_summary: DashboardFinancial;
  production_insights: DashboardProduction;
  alerts: DashboardAlerts;
  recent: {
    purchases: unknown[];
    payments: unknown[];
    batches: unknown[];
    sales: unknown[];
  };
}

export interface PurchasePayment {
  id: number;
  receipt_number: string | null;
  user_id: number;
  type: string;
  supplier_id: number | null;
  purchase_id: number | null;
  customer_id: number | null;
  sale_id: number | null;
  amount: string;
  payment_date: string;
  payment_method: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Purchase {
  id: number;
  purchase_number: string | null;
  user_id: number;
  supplier_id: number;
  batch_id: number;
  type: 'chicks' | 'feed' | 'medicine' | 'other';
  item_name: string;
  quantity: number;
  unit: string;
  unit_price: string;
  total_price: string;
  paid_amount: string;
  status: string;
  purchase_date: string;
  payment_type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  supplier: Supplier;
  batch: Batch;
  payments: PurchasePayment[];
}

export interface Sale {
  id: number;
  sale_number: string | null;
  user_id: number;
  customer_id: number;
  batch_id: number;
  item_name: string;
  quantity: number;
  unit: string;
  unit_price: string;
  total_price: string;
  paid_amount: string;
  payment_type: string;
  status: string;
  sale_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  customer: Customer;
  batch: Batch;
  payments: PurchasePayment[];
}

export interface Expense {
  id: number;
  user_id: number;
  batch_id: number;
  type: string;
  amount: string;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  batch: Batch;
}

export interface Death {
  id: number;
  user_id: number;
  batch_id: number;
  quantity: number;
  reason: string;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  batch: Batch;
}

export interface Payment {
  id: number;
  receipt_number: string | null;
  user_id: number;
  type: string;
  supplier_id: number | null;
  purchase_id: number | null;
  customer_id: number | null;
  sale_id: number | null;
  amount: string;
  payment_date: string;
  payment_method: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  supplier: Supplier | null;
  purchase: Purchase | null;
  customer: Customer | null;
  sale: Sale | null;
}
