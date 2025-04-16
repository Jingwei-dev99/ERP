import { UserService } from '../server/src/services/user.service';
import { UserRole } from '../server/src/models/user.model';
import { Logger } from '../server/src/utils/logger';

const logger = new Logger('Setup');

async function createTestUser() {
  try {
    const userService = new UserService();
    const user = await userService.createUser({
      username: 'demo_user',
      email: 'demo@example.com',
      password: 'demoPassword123',
      role: UserRole.ADMIN
    });
    logger.info('Test user created successfully:', { userId: user.id });
  } catch (error) {
    logger.error('Failed to create test user:', error);
  }
}

createTestUser().catch(console.error); 