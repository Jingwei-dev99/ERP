import { Pool } from 'pg';
import { 
  Transaction, 
  Invoice, 
  Payment, 
  CreateTransactionDTO, 
  CreateInvoiceDTO, 
  CreatePaymentDTO,
  TransactionType,
  InvoiceStatus,
  PaymentStatus
} from '../models/finance.model';
import { AppError } from '../middleware/error';
import pool from '../config/database';
import logger from '../config/logger';

export class FinanceService {
  private db: Pool;

  constructor() {
    this.db = pool;
  }

  // 交易相关方法
  async createTransaction(data: CreateTransactionDTO, userId: string): Promise<Transaction> {
    try {
      const result = await this.db.query(
        `INSERT INTO transactions 
         (type, amount, category, description, date, reference_no, attachment_url, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          data.type,
          data.amount,
          data.category,
          data.description,
          data.date,
          data.reference_no,
          data.attachment_url,
          userId
        ]
      );

      return result.rows[0];
    } catch (error) {
      logger.error('创建交易记录失败:', error);
      throw new AppError('创建交易记录失败', 500);
    }
  }

  async getTransactions(
    filters: {
      type?: TransactionType;
      startDate?: Date;
      endDate?: Date;
      category?: string;
    },
    page: number = 1,
    limit: number = 10
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (filters.type) {
      conditions.push(`type = $${paramCount++}`);
      values.push(filters.type);
    }

    if (filters.startDate) {
      conditions.push(`date >= $${paramCount++}`);
      values.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push(`date <= $${paramCount++}`);
      values.push(filters.endDate);
    }

    if (filters.category) {
      conditions.push(`category = $${paramCount++}`);
      values.push(filters.category);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM transactions ${whereClause}`,
      values
    );

    const result = await this.db.query(
      `SELECT * FROM transactions 
       ${whereClause}
       ORDER BY date DESC
       LIMIT $${paramCount++} OFFSET $${paramCount}`,
      [...values, limit, offset]
    );

    return {
      transactions: result.rows,
      total: parseInt(countResult.rows[0].count)
    };
  }

  // 发票相关方法
  async createInvoice(data: CreateInvoiceDTO, userId: string): Promise<Invoice> {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // 生成发票编号
      const number = await this.generateInvoiceNumber();

      // 计算总额
      let subtotal = 0;
      let taxTotal = 0;

      data.items.forEach(item => {
        const itemAmount = item.quantity * item.unit_price;
        const itemTax = itemAmount * item.tax_rate;
        subtotal += itemAmount;
        taxTotal += itemTax;
      });

      const total = subtotal + taxTotal;

      // 创建发票
      const invoiceResult = await client.query(
        `INSERT INTO invoices 
         (customer_id, number, issue_date, due_date, subtotal, tax_total, total, 
          notes, terms, status, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          data.customer_id,
          number,
          data.issue_date,
          data.due_date,
          subtotal,
          taxTotal,
          total,
          data.notes,
          data.terms,
          InvoiceStatus.DRAFT,
          userId
        ]
      );

      const invoice = invoiceResult.rows[0];

      // 创建发票项目
      for (const item of data.items) {
        const amount = item.quantity * item.unit_price;
        await client.query(
          `INSERT INTO invoice_items 
           (invoice_id, description, quantity, unit_price, tax_rate, amount)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            invoice.id,
            item.description,
            item.quantity,
            item.unit_price,
            item.tax_rate,
            amount
          ]
        );
      }

      await client.query('COMMIT');
      return this.getInvoiceById(invoice.id);
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('创建发票失败:', error);
      throw new AppError('创建发票失败', 500);
    } finally {
      client.release();
    }
  }

  private async generateInvoiceNumber(): Promise<string> {
    const result = await this.db.query(
      "SELECT number FROM invoices WHERE number LIKE $1 ORDER BY number DESC LIMIT 1",
      [`INV${new Date().getFullYear()}%`]
    );

    const prefix = `INV${new Date().getFullYear()}`;
    if (result.rows.length === 0) {
      return `${prefix}0001`;
    }

    const lastNumber = parseInt(result.rows[0].number.replace(prefix, ''));
    return `${prefix}${(lastNumber + 1).toString().padStart(4, '0')}`;
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const invoiceResult = await this.db.query(
      'SELECT * FROM invoices WHERE id = $1',
      [id]
    );

    if (!invoiceResult.rows[0]) {
      throw new AppError('发票不存在', 404);
    }

    const invoice = invoiceResult.rows[0];

    const itemsResult = await this.db.query(
      'SELECT * FROM invoice_items WHERE invoice_id = $1',
      [id]
    );

    invoice.items = itemsResult.rows;
    return invoice;
  }

  async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    const result = await this.db.query(
      'UPDATE invoices SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (!result.rows[0]) {
      throw new AppError('发票不存在', 404);
    }

    return this.getInvoiceById(id);
  }

  // 支付相关方法
  async createPayment(data: CreatePaymentDTO, userId: string): Promise<Payment> {
    const client = await this.db.connect();

    try {
      await client.query('BEGIN');

      // 检查发票是否存在
      const invoice = await this.getInvoiceById(data.invoice_id);

      // 检查支付金额是否正确
      if (data.amount > invoice.total) {
        throw new AppError('支付金额不能大于发票总额', 400);
      }

      // 创建支付记录
      const result = await client.query(
        `INSERT INTO payments 
         (invoice_id, amount, payment_date, payment_method, reference_no, notes, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          data.invoice_id,
          data.amount,
          data.payment_date,
          data.payment_method,
          data.reference_no,
          data.notes,
          userId
        ]
      );

      // 检查是否需要更新发票状态
      const paymentsSum = await this.getInvoicePaymentsSum(data.invoice_id);
      if (paymentsSum >= invoice.total) {
        await this.updateInvoiceStatus(data.invoice_id, InvoiceStatus.PAID);
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('创建支付记录失败:', error);
      throw new AppError('创建支付记录失败', 500);
    } finally {
      client.release();
    }
  }

  private async getInvoicePaymentsSum(invoiceId: string): Promise<number> {
    const result = await this.db.query(
      `SELECT SUM(amount) as total 
       FROM payments 
       WHERE invoice_id = $1 AND status = $2`,
      [invoiceId, PaymentStatus.COMPLETED]
    );

    return parseFloat(result.rows[0].total) || 0;
  }

  async getPaymentsByInvoiceId(invoiceId: string): Promise<Payment[]> {
    const result = await this.db.query(
      'SELECT * FROM payments WHERE invoice_id = $1 ORDER BY payment_date DESC',
      [invoiceId]
    );

    return result.rows;
  }
} 