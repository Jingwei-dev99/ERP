import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';
import { Logger } from '../utils/logger';
import { ValidationError } from '../utils/errors';
import { 
  CreateCustomerDTO, 
  UpdateCustomerDTO, 
  CreateInteractionDTO, 
  CreateSegmentDTO 
} from '../models/customer.model';

// Extend Request type to include user property
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

export class CustomerController {
  private readonly logger: Logger;

  constructor(private customerService: CustomerService) {
    this.logger = new Logger('CustomerController');
  }

  // 客户管理接口
  async createCustomer(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerData: CreateCustomerDTO = req.body;
      const customer = await this.customerService.createCustomer(customerData, req.user.id);
      res.status(201).json(customer);
    } catch (error) {
      this.logger.error('Error creating customer:', error);
      next(error);
    }
  }

  async updateCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const customerData: UpdateCustomerDTO = req.body;
      const customer = await this.customerService.updateCustomer(id, customerData);
      res.json(customer);
    } catch (error) {
      this.logger.error('Error updating customer:', error);
      next(error);
    }
  }

  async getCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const customer = await this.customerService.getCustomerById(id);
      res.json(customer);
    } catch (error) {
      this.logger.error('Error getting customer:', error);
      next(error);
    }
  }

  async searchCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query = '', limit = '10', offset = '0' } = req.query;
      if (typeof query !== 'string') {
        throw new ValidationError('Search query must be a string');
      }
      
      const result = await this.customerService.searchCustomers(
        query,
        parseInt(limit as string, 10),
        parseInt(offset as string, 10)
      );
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // 客户互动接口
  async createInteraction(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const interactionData: CreateInteractionDTO = {
        ...req.body,
        customerId: req.params.customerId
      };
      const interaction = await this.customerService.createInteraction(interactionData, req.user.id);
      res.status(201).json(interaction);
    } catch (error) {
      this.logger.error('Error creating customer interaction:', error);
      next(error);
    }
  }

  async getCustomerInteractions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customerId } = req.params;
      const { page = '1', limit = '10' } = req.query;
      const offset = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
      
      const interactions = await this.customerService.getCustomerInteractions(
        customerId,
        parseInt(limit as string, 10),
        offset
      );
      res.json(interactions);
    } catch (error) {
      this.logger.error('Error getting customer interactions:', error);
      next(error);
    }
  }

  // 客户分类接口
  async createSegment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, description = '' } = req.body as CreateSegmentDTO;
      const segment = await this.customerService.createSegment(name, description, req.user.id);
      res.status(201).json(segment);
    } catch (error) {
      next(error);
    }
  }

  async addCustomerToSegment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { customerId, segmentId } = req.params;
      await this.customerService.addCustomerToSegment(customerId, segmentId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getSegmentCustomers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { segmentId } = req.params;
      const { limit = '10', offset = '0' } = req.query;
      
      const result = await this.customerService.getSegmentCustomers(
        segmentId,
        parseInt(limit as string, 10),
        parseInt(offset as string, 10)
      );
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSegments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { limit = '10', offset = '0' } = req.query;
      
      const result = await this.customerService.getSegments(
        parseInt(limit as string, 10),
        parseInt(offset as string, 10)
      );
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, type, search } = req.query;
      const customers = await this.customerService.getCustomers({
        page: Number(page),
        limit: Number(limit),
        type: type as string,
        search: search as string
      });
      res.json(customers);
    } catch (error) {
      this.logger.error('Error getting customers:', error);
      next(error);
    }
  }

  async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.customerService.deleteCustomer(id);
      res.status(204).send();
    } catch (error) {
      this.logger.error('Error deleting customer:', error);
      next(error);
    }
  }

  async getCustomerSegments(req: Request, res: Response, next: NextFunction) {
    try {
      const segments = await this.customerService.getCustomerSegments();
      res.json(segments);
    } catch (error) {
      this.logger.error('Error getting customer segments:', error);
      next(error);
    }
  }

  async assignCustomerSegment(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerId, segmentId } = req.params;
      await this.customerService.assignCustomerSegment(customerId, segmentId);
      res.status(204).send();
    } catch (error) {
      this.logger.error('Error assigning customer segment:', error);
      next(error);
    }
  }
} 