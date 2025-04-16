# 小型企业ERP系统

一个为小型企业量身定制的企业资源规划系统，提供财务管理、日程安排、库存管理、客户关系管理等功能，帮助小型企业优化运营流程并提升效率。

## 功能特性

- **仪表盘**: 直观展示业务绩效指标，包括收入、支出和利润的可视化图表
- **财务管理**: 跟踪收入支出，生成发票，管理税务计算
- **日程与预约**: 安排会议和预约，与日历同步，设置提醒
- **库存管理**: 追踪产品库存，管理供应商，生成订单
- **客户管理**: 维护客户信息，记录互动历史，客户细分
- **报表与分析**: 生成财务报表、销售报表和库存报表，提供数据分析
- **系统设置**: 个性化配置，用户管理，安全设置

## 技术栈

- **前端**: React, TypeScript, Material-UI
- **状态管理**: React Hooks
- **UI组件**: Material-UI组件库
- **图表可视化**: Chart.js, React-Chartjs-2
- **日期处理**: date-fns

## 安装与运行

### 系统要求

- Node.js 14.0 或更高版本
- npm 7.0 或更高版本

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/small-business-erp.git
   cd small-business-erp
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 启动开发服务器
   ```bash
   npm start
   ```

4. 打开浏览器访问
   ```
   http://localhost:3000
   ```

## 部署指南

### 构建生产版本

```bash
npm run build
```

生成的静态文件将存放在 `build` 目录中，可以部署到任何Web服务器上。

### 使用Docker部署

1. 构建Docker镜像
   ```bash
   docker build -t small-business-erp .
   ```

2. 运行容器
   ```bash
   docker run -p 80:80 small-business-erp
   ```

## 使用指南

### 初始设置

1. 登录系统（示例默认账户：admin/admin）
2. 在"系统设置"中配置公司信息
3. 添加用户并设置权限
4. 开始使用各个功能模块

### 快速入门

- **添加产品**: 在库存管理页面添加您的产品
- **添加客户**: 在客户管理页面录入客户信息
- **记录交易**: 在财务管理页面记录收入和支出
- **安排预约**: 在日程管理页面创建预约

## 屏幕截图

### 仪表盘
![仪表盘](screenshots/dashboard.png)

### 财务管理
![财务管理](screenshots/finance.png)

### 日程与预约
![日程与预约](screenshots/calendar.png)

### 库存管理
![库存管理](screenshots/inventory.png)

## 开发信息

### 项目结构

```
src/
  ├── components/       # 共享组件
  ├── pages/            # 页面组件
  ├── layouts/          # 布局组件
  ├── theme/            # 主题配置
  ├── utils/            # 工具函数
  ├── App.tsx           # 应用主入口
  └── main.tsx          # 应用渲染入口
```

### 添加新功能

1. 在 `src/components` 中创建需要的组件
2. 在 `src/pages` 中创建新页面
3. 在 `src/App.tsx` 中添加新路由

## 许可证

[MIT](LICENSE) 