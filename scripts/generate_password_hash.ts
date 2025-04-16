import * as bcrypt from 'bcryptjs';

const password = 'demoPassword123';
bcrypt.hash(password, 12).then(hash => {
  console.log('Password:', password);
  console.log('Hash:', hash);
}); 