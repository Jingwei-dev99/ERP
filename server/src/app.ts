import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error';
import logger from './config/logger';

// 加载环境变量
dotenv.config();

const app = express();

// 安全中间件
app.use(helmet());

// CORS 配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));

// 请求限制
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
});
app.use(limiter);

// 日志中间件
app.use(morgan('combined', { 
  stream: { 
    write: (message: string) => logger.info(message.trim()) 
  } 
}));

// 请求解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 路由
// TODO: 添加路由

// 错误处理
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`服务器运行在端口 ${port}`);
});

export default app; 