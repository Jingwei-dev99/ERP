-- Insert test user
-- Password is 'demoPassword123' (this is just for demo purposes)
INSERT INTO users (id, username, email, password, role, status)
VALUES (
  gen_random_uuid(),
  'demo_user',
  'demo@example.com',
  '$2b$12$wJQ6s5PFABuw9V5VhaIl1.NJcHB/dNYVpsdMqjo0rMQRNU7smq5O2', -- hashed 'demoPassword123'
  'admin',
  'active'
) ON CONFLICT (username) DO UPDATE 
SET email = EXCLUDED.email,
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    status = EXCLUDED.status; 