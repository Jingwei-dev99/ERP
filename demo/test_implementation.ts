import { UserService } from '../server/src/services/user.service';
import { CustomerService } from '../server/src/services/customer.service';
import { FinanceService } from '../server/src/services/finance.service';
import { CustomerType, CustomerStatus, InteractionType } from '../server/src/models/customer.model';
import { TransactionType, PaymentMethod, PaymentStatus } from '../server/src/models/finance.model';
import { Logger } from '../server/src/utils/logger';
import pool from '../server/src/config/database';

// Set environment variables for JWT
process.env.JWT_SECRET = 'demo-secret-key';
process.env.JWT_REFRESH_SECRET = 'demo-refresh-secret-key';
process.env.JWT_EXPIRES_IN = '24h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

// Set environment variables for Database
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'case1';
process.env.DB_USER = 'jessie';
process.env.DB_PASSWORD = '';

const logger = new Logger('Demo');

async function runDemo() {
  try {
    // Initialize services
    const userService = new UserService();
    const customerService = new CustomerService(pool);
    const financeService = new FinanceService();

    // Authenticate user
    console.log('Authenticating user...');
    const authResult = await userService.authenticate('demo@example.com', 'demoPassword123');
    console.log('User authenticated:', authResult.user.id);

    // Create a new customer
    console.log('\nCreating a new customer...');
    const timestamp = Date.now();
    const newCustomer = await customerService.createCustomer({
      name: 'Acme Corporation',
      email: `contact_${timestamp}@acme.com`,
      phone: '+1-555-0123',
      address: {
        line1: '123 Business Ave',
        city: 'Tech City',
        state: 'CA',
        postalCode: '94105',
        country: 'USA'
      },
      companyName: 'Acme Corporation',
      type: CustomerType.BUSINESS,
      status: CustomerStatus.ACTIVE,
      notes: 'Key enterprise customer'
    }, authResult.user.id);
    console.log('Customer created:', newCustomer.id);

    // Create a customer interaction
    console.log('\nCreating a customer interaction...');
    const interaction = await customerService.createInteraction({
      customer_id: newCustomer.id,
      type: InteractionType.MEETING,
      summary: 'Initial consultation',
      details: 'Discussed business needs and potential solutions',
      interaction_date: new Date(),
      next_follow_up_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }, authResult.user.id);
    console.log('Interaction created:', interaction.id);

    // Create a customer segment
    console.log('\nCreating a customer segment...');
    const segment = await customerService.createSegment(
      `VIP Business Customers ${new Date().toISOString()}`,
      'High-value business customers',
      authResult.user.id
    );
    console.log('Segment created:', segment.id);

    // Add customer to segment
    console.log('\nAdding customer to segment...');
    await customerService.addCustomerToSegment(newCustomer.id, segment.id);
    console.log('Customer added to segment');

    // Get customer interactions
    console.log('\nFetching customer interactions...');
    const interactions = await customerService.getCustomerInteractions(newCustomer.id);
    console.log('Found interactions:', interactions.interactions.length);

    // Get segment customers
    console.log('\nFetching segment customers...');
    const segmentCustomers = await customerService.getSegmentCustomers(segment.id);
    console.log('Found customers in segment:', segmentCustomers.customers.length);

    // 3. Finance Management Demo
    logger.info('\n💰 Testing Finance Management...');

    // Create a transaction
    const transaction = await financeService.createTransaction({
      type: TransactionType.INCOME,
      amount: 5000.00,
      category: 'Services',
      description: 'Consulting services for Acme Corp',
      date: new Date()
    }, authResult.user.id);
    logger.info('Created transaction:', { transactionId: transaction.id });

    // Create an invoice
    const invoice = await financeService.createInvoice({
      customer_id: newCustomer.id,
      items: [{
        description: 'Consulting Services',
        quantity: 1,
        unit_price: 5000.00,
        tax_rate: 0.10
      }],
      issue_date: new Date(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      notes: 'Net 30 payment terms',
      terms: 'Payment due within 30 days'
    }, authResult.user.id);
    logger.info('Created invoice:', { invoiceId: invoice.id });

    // Create a payment
    const payment = await financeService.createPayment({
      invoice_id: invoice.id,
      amount: 5500.00, // Including tax
      payment_date: new Date(),
      payment_method: PaymentMethod.BANK_TRANSFER,
      notes: 'Full payment received'
    }, authResult.user.id);
    logger.info('Created payment:', { paymentId: payment.id });

    // 4. Demonstrate Search and Filtering
    logger.info('\n🔍 Testing Search and Filtering...');

    // Search customers
    const searchResults = await customerService.searchCustomers('Acme');
    logger.info('Customer search results:', { 
      total: searchResults.total,
      found: searchResults.customers.length 
    });

    logger.info('\n✅ Demo completed successfully!');

  } catch (error) {
    logger.error('Demo failed:', error);
    throw error;
  }
}

// Run the demo
runDemo().catch(error => {
  logger.error('Demo failed:', error);
  process.exit(1);
});