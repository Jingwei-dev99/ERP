import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { CustomerService } from '../services/customer.service';
import { pool } from '../config/database';

const router = Router();
const customerService = new CustomerService(pool);
const customerController = new CustomerController(customerService);

// 客户管理路由
router.post('/', customerController.createCustomer.bind(customerController));
router.put('/:id', customerController.updateCustomer.bind(customerController));
router.get('/:id', customerController.getCustomer.bind(customerController));
router.get('/', customerController.searchCustomers.bind(customerController));

// 客户互动路由
router.post('/:customerId/interactions', customerController.createInteraction.bind(customerController));
router.get('/:customerId/interactions', customerController.getCustomerInteractions.bind(customerController));

// 客户分类路由
router.post('/segments', customerController.createSegment.bind(customerController));
router.post('/segments/:segmentId/customers/:customerId', customerController.addCustomerToSegment.bind(customerController));
router.get('/segments/:segmentId/customers', customerController.getSegmentCustomers.bind(customerController));
router.get('/segments', customerController.getSegments.bind(customerController));

export default router; 