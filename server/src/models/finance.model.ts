export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense'
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  WECHAT = 'wechat',
  ALIPAY = 'alipay'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: Date;
  reference_no?: string;
  attachment_url?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  customer_id: string;
  number: string;
  issue_date: Date;
  due_date: Date;
  subtotal: number;
  tax_total: number;
  total: number;
  notes?: string;
  terms?: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  payment_date: Date;
  payment_method: PaymentMethod;
  reference_no?: string;
  status: PaymentStatus;
  notes?: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: Date;
  reference_no?: string;
  attachment_url?: string;
}

export interface CreateInvoiceDTO {
  customer_id: string;
  issue_date: Date;
  due_date: Date;
  notes?: string;
  terms?: string;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
  }>;
}

export interface CreatePaymentDTO {
  invoice_id: string;
  amount: number;
  payment_date: Date;
  payment_method: PaymentMethod;
  reference_no?: string;
  notes?: string;
} 