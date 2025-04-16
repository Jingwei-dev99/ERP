import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import pool from '../config/database';

const router = Router();
const customerController = new CustomerController(pool);

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create a new customer
router.post('/', (req, res, next) => customerController.createCustomer(req, res, next));

// Get all customers
router.get('/', (req, res, next) => customerController.getAllCustomers(req, res, next));

// Create a customer interaction
router.post('/:customerId/interactions', (req, res, next) => customerController.createInteraction(req, res, next));

// Create a customer segment
router.post('/segments', (req, res, next) => customerController.createSegment(req, res, next));

export default router; 