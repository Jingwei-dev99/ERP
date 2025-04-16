-- Insert test user
-- Password is 'demoPassword123' (this is just for demo purposes)
INSERT INTO users (username, email, password, role, status)
VALUES (
  'demo_user',
  'demo@example.com',
  '$2b$10$6Yw3Yw3Yw3Yw3Yw3Yw3Y.Yw3Yw3Yw3Yw3Yw3Yw3Yw3Yw3Yw3',
  'admin',
  'active'
) ON CONFLICT (email) DO NOTHING; 