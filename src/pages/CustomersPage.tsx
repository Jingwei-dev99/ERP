import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Pagination,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import StatCard from '../components/StatCard';

// 客户数据接口
interface Customer {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  type: string;
  joinDate: string;
  lastContact: string;
  value: number;
  avatar?: string;
}

// 互动记录接口
interface Interaction {
  id: number;
  customerId: number;
  date: string;
  type: string;
  description: string;
  outcome: string;
}

// 模拟客户数据
const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 1, 
    name: '张伟', 
    company: 'ABC科技公司', 
    phone: '13800138001', 
    email: 'zhangwei@example.com',
    type: 'vip', 
    joinDate: '2022-01-15',
    lastContact: '2023-05-08',
    value: 25000,
  },
  {
    id: 2, 
    name: '王芳', 
    company: 'DEF贸易有限公司', 
    phone: '13800138002', 
    email: 'wangfang@example.com',
    type: 'regular', 
    joinDate: '2022-03-22',
    lastContact: '2023-05-05',
    value: 12000,
  },
  {
    id: 3, 
    name: '李明', 
    company: 'GHI咨询公司', 
    phone: '13800138003', 
    email: 'liming@example.com',
    type: 'new', 
    joinDate: '2023-04-10',
    lastContact: '2023-05-01',
    value: 5000,
  },
  {
    id: 4, 
    name: '赵红', 
    company: 'JKL设计工作室', 
    phone: '13800138004', 
    email: 'zhaohong@example.com',
    type: 'regular', 
    joinDate: '2022-06-18',
    lastContact: '2023-04-25',
    value: 18000,
  },
  {
    id: 5, 
    name: '刘强', 
    company: 'MNO营销公司', 
    phone: '13800138005', 
    email: 'liuqiang@example.com',
    type: 'vip', 
    joinDate: '2021-11-30',
    lastContact: '2023-05-10',
    value: 32000,
  },
  {
    id: 6, 
    name: '陈静', 
    company: 'PQR软件公司', 
    phone: '13800138006', 
    email: 'chenjing@example.com',
    type: 'regular', 
    joinDate: '2022-08-05',
    lastContact: '2023-04-28',
    value: 15000,
  },
  {
    id: 7, 
    name: '杨光', 
    company: 'STU医疗器械公司', 
    phone: '13800138007', 
    email: 'yangguang@example.com',
    type: 'new', 
    joinDate: '2023-03-15',
    lastContact: '2023-05-02',
    value: 8000,
  },
];

// 模拟互动数据
const INITIAL_INTERACTIONS: Interaction[] = [
  {
    id: 1,
    customerId: 1,
    date: '2023-05-08',
    type: 'meeting',
    description: '产品演示会议',
    outcome: '客户表示有意购买新产品'
  },
  {
    id: 2,
    customerId: 1,
    date: '2023-04-15',
    type: 'call',
    description: '跟进电话',
    outcome: '安排了产品演示'
  },
  {
    id: 3,
    customerId: 2,
    date: '2023-05-05',
    type: 'email',
    description: '发送报价单',
    outcome: '客户正在考虑'
  },
  {
    id: 4,
    customerId: 3,
    date: '2023-05-01',
    type: 'meeting',
    description: '初次会面',
    outcome: '了解需求，提供了解决方案'
  },
  {
    id: 5,
    customerId: 5,
    date: '2023-05-10',
    type: 'call',
    description: '订单跟进',
    outcome: '确认了订单细节'
  },
];

// 客户类型配置
const CUSTOMER_TYPES = {
  vip: { label: 'VIP客户', color: 'error' },
  regular: { label: '常规客户', color: 'primary' },
  new: { label: '新客户', color: 'success' },
};

const CustomersPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [interactions, setInteractions] = useState(INITIAL_INTERACTIONS);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    company: '',
    phone: '',
    email: '',
    type: 'new',
  });
  const [isEditing, setIsEditing] = useState(false);

  const rowsPerPage = 5;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // 处理Tab切换
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 处理搜索查询变更
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1); // 重置为第一页
  };

  // 处理客户类型筛选变更
  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value);
    setPage(1); // 重置为第一页
  };

  // 处理分页变更
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // 处理查看客户详情
  const handleViewCustomer = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setTabValue(1); // 切换到互动历史标签
  };

  // 处理添加新客户
  const handleAddCustomer = () => {
    setNewCustomer({
      name: '',
      company: '',
      phone: '',
      email: '',
      type: 'new',
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  // 处理编辑客户
  const handleEditCustomer = (customerId: number) => {
    const customerToEdit = customers.find(c => c.id === customerId);
    if (customerToEdit) {
      setNewCustomer({ ...customerToEdit });
      setIsEditing(true);
      setIsDialogOpen(true);
    }
  };

  // 处理删除客户
  const handleDeleteCustomer = (customerId: number) => {
    if (window.confirm('确定要删除此客户吗？')) {
      setCustomers(customers.filter(c => c.id !== customerId));
      setInteractions(interactions.filter(i => i.customerId !== customerId));
    }
  };

  // 处理保存客户
  const handleSaveCustomer = () => {
    if (isEditing && newCustomer.id) {
      // 更新现有客户
      setCustomers(customers.map(c => 
        c.id === newCustomer.id ? { 
          ...c, 
          ...newCustomer,
        } : c
      ));
    } else {
      // 添加新客户
      const newId = Math.max(...customers.map(c => c.id)) + 1;
      setCustomers([
        ...customers,
        { 
          ...newCustomer as Customer, 
          id: newId,
          joinDate: new Date().toISOString().split('T')[0],
          lastContact: new Date().toISOString().split('T')[0],
          value: 0,
        }
      ]);
    }
    setIsDialogOpen(false);
  };

  // 筛选客户
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'all' || customer.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // 分页后的客户
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);
  
  // 计算总页数
  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);

  // 获取客户互动历史
  const getCustomerInteractions = (customerId: number) => {
    return interactions.filter(interaction => interaction.customerId === customerId);
  };

  // 获取客户统计信息
  const getCustomerStats = () => {
    const vipCount = customers.filter(c => c.type === 'vip').length;
    const newCount = customers.filter(c => c.type === 'new').length;
    const totalValue = customers.reduce((sum, customer) => sum + customer.value, 0);
    
    return {
      total: customers.length,
      vip: vipCount,
      new: newCount,
      totalValue
    };
  };

  // 渲染客户统计卡片
  const renderCustomerStats = () => {
    const stats = getCustomerStats();
    
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard 
            title="客户总数"
            value={stats.total}
            icon={<PersonIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard 
            title="VIP客户"
            value={stats.vip}
            icon={<BusinessIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard 
            title="新客户"
            value={stats.new}
            icon={<PersonIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard 
            title="客户总价值"
            value={`¥${stats.totalValue.toLocaleString()}`}
            icon={<TimelineIcon />}
            color="primary"
          />
        </Grid>
      </Grid>
    );
  };

  // 渲染客户列表
  const renderCustomerDirectory = () => {
    return (
      <>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddCustomer}
          >
            添加客户
          </Button>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>客户类型</InputLabel>
              <Select
                value={filterType}
                label="客户类型"
                onChange={handleTypeFilterChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">所有客户</MenuItem>
                {Object.entries(CUSTOMER_TYPES).map(([type, { label }]) => (
                  <MenuItem key={type} value={type}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              placeholder="搜索客户..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>客户</TableCell>
                <TableCell>联系方式</TableCell>
                <TableCell>类型</TableCell>
                <TableCell>加入日期</TableCell>
                <TableCell>最近联系</TableCell>
                <TableCell align="right">客户价值</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((customer) => {
                  const typeConfig = CUSTOMER_TYPES[customer.type as keyof typeof CUSTOMER_TYPES];
                  
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2 }}>
                            {customer.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1">{customer.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {customer.company}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{customer.phone}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2">{customer.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={typeConfig.label} 
                          size="small"
                          color={typeConfig.color as any}
                        />
                      </TableCell>
                      <TableCell>{customer.joinDate}</TableCell>
                      <TableCell>{customer.lastContact}</TableCell>
                      <TableCell align="right">¥{customer.value.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleViewCustomer(customer.id)}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary" onClick={() => handleEditCustomer(customer.id)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteCustomer(customer.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    没有找到匹配的客户
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </>
    );
  };

  // 渲染互动历史
  const renderInteractionHistory = () => {
    if (!selectedCustomerId) {
      return (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography color="text.secondary">请选择一个客户查看互动历史</Typography>
        </Box>
      );
    }

    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) {
      return null;
    }

    const customerInteractions = getCustomerInteractions(selectedCustomerId);

    return (
      <>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
              {customer.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">{customer.name}</Typography>
              <Typography variant="body1">{customer.company}</Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">联系信息</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>{customer.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography>{customer.email}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">客户信息</Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>客户类型:</strong> {CUSTOMER_TYPES[customer.type as keyof typeof CUSTOMER_TYPES].label}
                  </Typography>
                  <Typography variant="body2">
                    <strong>加入日期:</strong> {customer.joinDate}
                  </Typography>
                  <Typography variant="body2">
                    <strong>客户价值:</strong> ¥{customer.value.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>互动历史</Typography>
        
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />} 
          sx={{ mb: 2 }}
          onClick={() => console.log('添加互动')}
        >
          添加互动
        </Button>

        {customerInteractions.length > 0 ? (
          <List>
            {customerInteractions.map((interaction) => (
              <React.Fragment key={interaction.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      {interaction.type === 'meeting' ? 'M' : 
                       interaction.type === 'call' ? 'C' : 'E'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1">{interaction.description}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {interaction.date}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span" color="text.primary">
                          {interaction.type === 'meeting' ? '会议' : 
                           interaction.type === 'call' ? '电话' : '邮件'}
                        </Typography>
                        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                          {interaction.outcome}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography color="text.secondary">暂无互动记录</Typography>
          </Box>
        )}
      </>
    );
  };

  // 渲染客户表单对话框
  const renderCustomerDialog = () => {
    return (
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditing ? '编辑客户' : '添加新客户'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="客户姓名"
              value={newCustomer.name || ''}
              onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
              required
              error={!newCustomer.name}
              helperText={!newCustomer.name ? '请输入客户姓名' : ''}
            />

            <TextField
              fullWidth
              margin="normal"
              label="公司名称"
              value={newCustomer.company || ''}
              onChange={(e) => setNewCustomer({...newCustomer, company: e.target.value})}
            />

            <TextField
              fullWidth
              margin="normal"
              label="电话号码"
              value={newCustomer.phone || ''}
              onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
              required
              error={!newCustomer.phone}
              helperText={!newCustomer.phone ? '请输入电话号码' : ''}
            />

            <TextField
              fullWidth
              margin="normal"
              label="电子邮箱"
              type="email"
              value={newCustomer.email || ''}
              onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
              required
              error={!newCustomer.email}
              helperText={!newCustomer.email ? '请输入电子邮箱' : ''}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>客户类型</InputLabel>
              <Select
                value={newCustomer.type || 'new'}
                label="客户类型"
                onChange={(e) => setNewCustomer({...newCustomer, type: e.target.value})}
              >
                {Object.entries(CUSTOMER_TYPES).map(([type, { label }]) => (
                  <MenuItem key={type} value={type}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>取消</Button>
          <Button 
            onClick={handleSaveCustomer} 
            variant="contained"
            disabled={!newCustomer.name || !newCustomer.phone || !newCustomer.email}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        客户管理
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="客户目录" />
        <Tab label="互动历史" />
        <Tab label="客户分析" />
      </Tabs>
      
      {tabValue === 0 && (
        <>
          {renderCustomerStats()}
          {renderCustomerDirectory()}
          {renderCustomerDialog()}
        </>
      )}
      
      {tabValue === 1 && (
        <Card>
          <CardContent>
            {renderInteractionHistory()}
          </CardContent>
        </Card>
      )}
      
      {tabValue === 2 && (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 5, color: 'text.secondary' }}>
          客户分析功能（开发中）
        </Typography>
      )}
    </Box>
  );
};

export default CustomersPage; 