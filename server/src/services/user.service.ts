import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Pool } from 'pg';
import { User, UserRole, UserStatus, CreateUserDTO, UpdateUserDTO, UserActivity } from '../models/user.model';
import { AppError } from '../middleware/error';
import logger from '../config/logger';
import pool from '../config/database';

export class UserService {
  private db: Pool;
  private readonly DEFAULT_TOKEN_EXPIRES = '24h' as const;
  private readonly DEFAULT_REFRESH_TOKEN_EXPIRES = '7d' as const;

  constructor() {
    this.db = pool;
  }

  async createUser(userData: CreateUserDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    try {
      const result = await this.db.query(
        `INSERT INTO users (username, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [userData.username, userData.email, hashedPassword, userData.role]
      );

      const user = result.rows[0];
      delete user.password;
      return user;
    } catch (error: any) {
      if (error.code === '23505') { // 唯一约束违反
        if (error.constraint === 'users_email_key') {
          throw new AppError('邮箱已被使用', 400);
        }
        if (error.constraint === 'users_username_key') {
          throw new AppError('用户名已被使用', 400);
        }
      }
      throw error;
    }
  }

  async authenticate(usernameOrEmail: string, password: string): Promise<{ user: User; token: string; refreshToken: string }> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1 OR username = $1',
      [usernameOrEmail]
    );

    const user = result.rows[0];
    if (!user) {
      throw new AppError('用户不存在', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('密码错误', 401);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError('账户未激活或已被停用', 401);
    }

    // 更新最后登录时间
    await this.db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    
    if (!jwtSecret || !jwtRefreshSecret) {
      throw new AppError('JWT 配置错误', 500);
    }

    const signOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN || this.DEFAULT_TOKEN_EXPIRES) as jwt.SignOptions['expiresIn']
    };

    const refreshSignOptions: SignOptions = {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || this.DEFAULT_REFRESH_TOKEN_EXPIRES) as jwt.SignOptions['expiresIn']
    };

    // 生成令牌
    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret,
      signOptions
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      jwtRefreshSecret,
      refreshSignOptions
    );

    delete user.password;
    return { user, token, refreshToken };
  }

  async getUserById(id: string): Promise<User> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    const user = result.rows[0];
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    delete user.password;
    return user;
  }

  async updateUser(id: string, updateData: UpdateUserDTO): Promise<User> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // 构建动态更新查询
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'password') {
          value = bcrypt.hashSync(value, 12);
        }
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      throw new AppError('没有提供要更新的字段', 400);
    }

    values.push(id);
    const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    try {
      const result = await this.db.query(query, values);
      const user = result.rows[0];
      if (!user) {
        throw new AppError('用户不存在', 404);
      }

      delete user.password;
      return user;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new AppError('用户名或邮箱已被使用', 400);
      }
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rowCount === 0) {
      throw new AppError('用户不存在', 404);
    }
  }

  async logActivity(activity: Omit<UserActivity, 'id' | 'created_at'>): Promise<void> {
    await this.db.query(
      `INSERT INTO user_activities (user_id, action, ip_address, details)
       VALUES ($1, $2, $3, $4)`,
      [activity.user_id, activity.action, activity.ip_address, activity.details]
    );
  }

  async getUserActivities(userId: string, limit: number = 10, offset: number = 0): Promise<UserActivity[]> {
    const result = await this.db.query(
      `SELECT * FROM user_activities 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    
    if (!jwtSecret || !jwtRefreshSecret) {
      throw new AppError('JWT 配置错误', 500);
    }

    try {
      const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as { id: string };
      const user = await this.getUserById(decoded.id);

      const signOptions: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || this.DEFAULT_TOKEN_EXPIRES) as jwt.SignOptions['expiresIn']
      };

      const refreshSignOptions: SignOptions = {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || this.DEFAULT_REFRESH_TOKEN_EXPIRES) as jwt.SignOptions['expiresIn']
      };

      const newToken = jwt.sign(
        { id: user.id, role: user.role },
        jwtSecret,
        signOptions
      );

      const newRefreshToken = jwt.sign(
        { id: user.id },
        jwtRefreshSecret,
        refreshSignOptions
      );

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new AppError('无效的刷新令牌', 401);
    }
  }
} 