import { Pool } from 'pg';
import { Logger } from '../utils/logger';
import { withErrorHandling } from '../utils/errors';
import { generateId } from '../utils/id';
import {
  Customer,
  CustomerInteraction,
  CustomerSegment,
  CreateCustomerDTO,
  UpdateCustomerDTO,
  CreateInteractionDTO,
  CustomerStatus,
  CustomerType,
  InteractionType
} from '../models/customer.model';

export class CustomerService {
  private readonly logger = new Logger('CustomerService');

  constructor(private readonly pool: Pool) {}

  // Customer management methods
  async createCustomer(dto: CreateCustomerDTO, creatorId: string): Promise<Customer> {
    return withErrorHandling(this.logger, 'Error creating customer', async () => {
      const id = generateId();
      const now = new Date();
      
      const result = await this.pool.query(
        `INSERT INTO customers (
          id, name, email, phone, 
          address_line1, address_line2, city, state, postal_code, country,
          company_name, industry, annual_revenue, employee_count,
          type, status, notes, created_by, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $19)
        RETURNING *`,
        [
          id,
          dto.name,
          dto.email,
          dto.phone,
          dto.address?.line1 || null,
          dto.address?.line2 || null,
          dto.address?.city || null,
          dto.address?.state || null,
          dto.address?.postalCode || null,
          dto.address?.country || null,
          dto.companyName || null,
          dto.industry || null,
          dto.annualRevenue || null,
          dto.employeeCount || null,
          dto.type || CustomerType.INDIVIDUAL,
          dto.status || CustomerStatus.ACTIVE,
          dto.notes || null,
          creatorId,
          now
        ]
      );

      return result.rows[0];
    });
  }

  async updateCustomer(id: string, dto: UpdateCustomerDTO): Promise<Customer> {
    return withErrorHandling(this.logger, 'Error updating customer', async () => {
      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (dto.name) {
        updates.push(`name = $${paramCount}`);
        values.push(dto.name);
        paramCount++;
      }
      if (dto.email) {
        updates.push(`email = $${paramCount}`);
        values.push(dto.email);
        paramCount++;
      }
      if (dto.phone) {
        updates.push(`phone = $${paramCount}`);
        values.push(dto.phone);
        paramCount++;
      }
      if (dto.address) {
        updates.push(`
          address_line1 = $${paramCount},
          address_line2 = $${paramCount + 1},
          city = $${paramCount + 2},
          state = $${paramCount + 3},
          postal_code = $${paramCount + 4},
          country = $${paramCount + 5}
        `);
        values.push(
          dto.address.line1 || null,
          dto.address.line2 || null,
          dto.address.city || null,
          dto.address.state || null,
          dto.address.postalCode || null,
          dto.address.country || null
        );
        paramCount += 6;
      }
      if (dto.companyName !== undefined) {
        updates.push(`company_name = $${paramCount}`);
        values.push(dto.companyName);
        paramCount++;
      }
      if (dto.industry !== undefined) {
        updates.push(`industry = $${paramCount}`);
        values.push(dto.industry);
        paramCount++;
      }
      if (dto.annualRevenue !== undefined) {
        updates.push(`annual_revenue = $${paramCount}`);
        values.push(dto.annualRevenue);
        paramCount++;
      }
      if (dto.employeeCount !== undefined) {
        updates.push(`employee_count = $${paramCount}`);
        values.push(dto.employeeCount);
        paramCount++;
      }
      if (dto.status) {
        updates.push(`status = $${paramCount}`);
        values.push(dto.status);
        paramCount++;
      }
      if (dto.type) {
        updates.push(`type = $${paramCount}`);
        values.push(dto.type);
        paramCount++;
      }
      if (dto.notes !== undefined) {
        updates.push(`notes = $${paramCount}`);
        values.push(dto.notes);
        paramCount++;
      }

      updates.push(`updated_at = $${paramCount}`);
      values.push(new Date());
      values.push(id);

      const result = await this.pool.query(
        `UPDATE customers 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount + 1}
        RETURNING *`,
        values
      );

      if (result.rowCount === 0) {
        throw new Error(`Customer with ID ${id} not found`);
      }

      return result.rows[0];
    });
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    return withErrorHandling(this.logger, 'Error getting customer', async () => {
      const result = await this.pool.query(
        'SELECT * FROM customers WHERE id = $1',
        [id]
      );

      return result.rows[0] || null;
    });
  }

  async searchCustomers(query: string, limit = 10, offset = 0): Promise<{ customers: Customer[]; total: number }> {
    return withErrorHandling(this.logger, 'Error searching customers', async () => {
      const searchQuery = `%${query}%`;
      
      const [customers, count] = await Promise.all([
        this.pool.query(
          `SELECT * FROM customers 
          WHERE name ILIKE $1 
             OR email ILIKE $1 
             OR phone ILIKE $1 
             OR company_name ILIKE $1
          ORDER BY name
          LIMIT $2 OFFSET $3`,
          [searchQuery, limit, offset]
        ),
        this.pool.query(
          `SELECT COUNT(*) FROM customers 
          WHERE name ILIKE $1 
             OR email ILIKE $1 
             OR phone ILIKE $1 
             OR company_name ILIKE $1`,
          [searchQuery]
        )
      ]);

      return {
        customers: customers.rows,
        total: parseInt(count.rows[0].count, 10)
      };
    });
  }

  // Customer interaction methods
  async createInteraction(dto: CreateInteractionDTO, creatorId: string): Promise<CustomerInteraction> {
    return withErrorHandling(this.logger, 'Error creating customer interaction', async () => {
      const id = generateId();
      const now = new Date();
      
      const result = await this.pool.query(
        `INSERT INTO customer_interactions (
          id, customer_id, type, summary, details, interaction_date, next_follow_up_date,
          created_by, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $9)
        RETURNING *`,
        [
          id,
          dto.customer_id,
          dto.type,
          dto.summary,
          dto.details || null,
          dto.interaction_date || now,
          dto.next_follow_up_date || null,
          creatorId,
          now
        ]
      );

      return result.rows[0];
    });
  }

  async getCustomerInteractions(customerId: string, limit = 10, offset = 0): Promise<{ interactions: CustomerInteraction[]; total: number }> {
    return withErrorHandling(this.logger, 'Error getting customer interactions', async () => {
      const [interactions, count] = await Promise.all([
        this.pool.query(
          `SELECT * FROM customer_interactions 
          WHERE customer_id = $1 
          ORDER BY interaction_date DESC 
          LIMIT $2 OFFSET $3`,
          [customerId, limit, offset]
        ),
        this.pool.query(
          'SELECT COUNT(*) FROM customer_interactions WHERE customer_id = $1',
          [customerId]
        )
      ]);

      return {
        interactions: interactions.rows,
        total: parseInt(count.rows[0].count, 10)
      };
    });
  }

  // Customer segment methods
  async createSegment(name: string, description: string, creatorId: string): Promise<CustomerSegment> {
    return withErrorHandling(this.logger, 'Error creating customer segment', async () => {
      const id = generateId();
      const now = new Date();
      
      const result = await this.pool.query(
        `INSERT INTO customer_segments (
          id, name, description, criteria, created_by, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $6)
        RETURNING *`,
        [
          id,
          name,
          description,
          null,
          creatorId,
          now
        ]
      );

      return result.rows[0];
    });
  }

  async addCustomerToSegment(customerId: string, segmentId: string): Promise<void> {
    return withErrorHandling(this.logger, 'Error adding customer to segment', async () => {
      await this.pool.query(
        `INSERT INTO customer_segment_members (
          customer_id, segment_id, created_at
        ) VALUES ($1, $2, $3)
        ON CONFLICT (customer_id, segment_id) DO NOTHING`,
        [customerId, segmentId, new Date()]
      );
    });
  }

  async getSegmentCustomers(segmentId: string, limit = 10, offset = 0): Promise<{ customers: Customer[]; total: number }> {
    return withErrorHandling(this.logger, 'Error getting segment customers', async () => {
      const [customers, count] = await Promise.all([
        this.pool.query(
          `SELECT c.* FROM customers c
          INNER JOIN customer_segment_members csm ON c.id = csm.customer_id
          WHERE csm.segment_id = $1
          ORDER BY c.name
          LIMIT $2 OFFSET $3`,
          [segmentId, limit, offset]
        ),
        this.pool.query(
          `SELECT COUNT(*) FROM customer_segment_members 
          WHERE segment_id = $1`,
          [segmentId]
        )
      ]);

      return {
        customers: customers.rows,
        total: parseInt(count.rows[0].count, 10)
      };
    });
  }

  async getSegments(limit = 10, offset = 0): Promise<{ segments: CustomerSegment[]; total: number }> {
    return withErrorHandling(this.logger, 'Error getting segments', async () => {
      const [segments, count] = await Promise.all([
        this.pool.query(
          `SELECT * FROM customer_segments 
          ORDER BY name
          LIMIT $1 OFFSET $2`,
          [limit, offset]
        ),
        this.pool.query('SELECT COUNT(*) FROM customer_segments')
      ]);

      return {
        segments: segments.rows,
        total: parseInt(count.rows[0].count, 10)
      };
    });
  }

  async getCustomers(options: { page: number; limit: number; type?: string; search?: string }): Promise<{ customers: Customer[]; total: number }> {
    return withErrorHandling(this.logger, 'Error getting customers', async () => {
      const { page, limit, type, search } = options;
      const offset = (page - 1) * limit;
      const params: any[] = [];
      let paramCount = 1;
      
      let whereClause = '';
      if (type) {
        whereClause += `type = $${paramCount} `;
        params.push(type);
        paramCount++;
      }
      
      if (search) {
        const searchClause = type ? 'AND ' : '';
        whereClause += `${searchClause}(name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR phone ILIKE $${paramCount})`;
        params.push(`%${search}%`);
        paramCount++;
      }

      const queryBase = 'FROM customers' + (whereClause ? ` WHERE ${whereClause}` : '');
      
      const [customers, count] = await Promise.all([
        this.pool.query(
          `SELECT * ${queryBase} 
          ORDER BY name 
          LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
          [...params, limit, offset]
        ),
        this.pool.query(`SELECT COUNT(*) ${queryBase}`, params)
      ]);

      return {
        customers: customers.rows,
        total: parseInt(count.rows[0].count, 10)
      };
    });
  }

  async deleteCustomer(id: string): Promise<void> {
    return withErrorHandling(this.logger, 'Error deleting customer', async () => {
      const result = await this.pool.query(
        'DELETE FROM customers WHERE id = $1',
        [id]
      );

      if (result.rowCount === 0) {
        throw new Error(`Customer with ID ${id} not found`);
      }
    });
  }

  async getCustomerSegments(): Promise<CustomerSegment[]> {
    return withErrorHandling(this.logger, 'Error getting customer segments', async () => {
      const result = await this.pool.query('SELECT * FROM customer_segments ORDER BY name');
      return result.rows;
    });
  }

  async assignCustomerSegment(customerId: string, segmentId: string): Promise<void> {
    return withErrorHandling(this.logger, 'Error assigning customer segment', async () => {
      await this.pool.query(
        `INSERT INTO customer_segment_members (customer_id, segment_id)
        VALUES ($1, $2)
        ON CONFLICT (customer_id, segment_id) DO NOTHING`,
        [customerId, segmentId]
      );
    });
  }
} 