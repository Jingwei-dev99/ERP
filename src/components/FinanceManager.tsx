import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Divider,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  FileDownload,
  Visibility,
  Search
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// 自定义TabPanel组件
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`finance-tabpanel-${index}`}
      aria-labelledby={`finance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// 模拟财务数据
const incomeData = [
  { id: 1, date: '2023-09-01', description: '产品销售 #12345', category: '产品销售', amount: 3500 },
  { id: 2, date: '2023-09-03', description: '咨询服务 #A789', category: '服务', amount: 1200 },
  { id: 3, date: '2023-09-07', description: '软件订阅 #S456', category: '订阅', amount: 499 },
  { id: 4, date: '2023-09-15', description: '产品销售 #12368', category: '产品销售', amount: 2800 },
  { id: 5, date: '2023-09-21', description: '维修服务 #R123', category: '服务', amount: 850 },
];

const expenseData = [
  { id: 1, date: '2023-09-02', description: '办公用品', category: '办公支出', amount: 450 },
  { id: 2, date: '2023-09-05', description: '员工工资', category: '人力资源', amount: 8500 },
  { id: 3, date: '2023-09-10', description: '租金支付', category: '租金/水电', amount: 3000 },
  { id: 4, date: '2023-09-18', description: '材料采购', category: '库存/商品', amount: 1750 },
  { id: 5, date: '2023-09-25', description: '市场推广', category: '营销/广告', amount: 1200 },
];

const invoiceData = [
  { id: 1, date: '2023-09-01', customer: '张三企业', status: '已支付', amount: 3500 },
  { id: 2, date: '2023-09-05', customer: '李四有限公司', status: '未支付', amount: 1200 },
  { id: 3, date: '2023-09-10', customer: '王五工作室', status: '已支付', amount: 2300 },
  { id: 4, date: '2023-09-18', customer: '赵六科技有限公司', status: '逾期', amount: 4500 },
  { id: 5, date: '2023-09-22', customer: '钱七贸易公司', status: '已发送', amount: 1850 },
];

// 类别选项
const incomeCategories = ['产品销售', '服务', '订阅', '其他收入'];
const expenseCategories = ['办公支出', '人力资源', '租金/水电', '库存/商品', '营销/广告', '其他支出'];
const invoiceStatuses = ['草稿', '已发送', '已支付', '逾期', '已取消'];

const FinanceManager: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 表单状态
  const [newIncome, setNewIncome] = useState({
    date: '',
    description: '',
    category: '',
    amount: ''
  });

  const [newExpense, setNewExpense] = useState({
    date: '',
    description: '',
    category: '',
    amount: ''
  });

  const [newInvoice, setNewInvoice] = useState({
    date: '',
    customer: '',
    description: '',
    status: '',
    amount: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // 收入表单处理
  const handleIncomeChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewIncome({
      ...newIncome,
      [name]: value
    });
  };

  const handleIncomeCategoryChange = (event: SelectChangeEvent) => {
    setNewIncome({
      ...newIncome,
      category: event.target.value
    });
  };

  const handleIncomeSubmit = () => {
    // 这里应该添加表单验证和数据提交逻辑
    console.log('提交新收入:', newIncome);
    setOpenIncomeDialog(false);
    // 重置表单
    setNewIncome({
      date: '',
      description: '',
      category: '',
      amount: ''
    });
  };

  // 支出表单处理
  const handleExpenseChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewExpense({
      ...newExpense,
      [name]: value
    });
  };

  const handleExpenseCategoryChange = (event: SelectChangeEvent) => {
    setNewExpense({
      ...newExpense,
      category: event.target.value
    });
  };

  const handleExpenseSubmit = () => {
    // 这里应该添加表单验证和数据提交逻辑
    console.log('提交新支出:', newExpense);
    setOpenExpenseDialog(false);
    // 重置表单
    setNewExpense({
      date: '',
      description: '',
      category: '',
      amount: ''
    });
  };

  // 发票表单处理
  const handleInvoiceChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewInvoice({
      ...newInvoice,
      [name]: value
    });
  };

  const handleInvoiceStatusChange = (event: SelectChangeEvent) => {
    setNewInvoice({
      ...newInvoice,
      status: event.target.value
    });
  };

  const handleInvoiceSubmit = () => {
    // 这里应该添加表单验证和数据提交逻辑
    console.log('提交新发票:', newInvoice);
    setOpenInvoiceDialog(false);
    // 重置表单
    setNewInvoice({
      date: '',
      customer: '',
      description: '',
      status: '',
      amount: ''
    });
  };

  // 格式化金额为人民币格式
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        财务管理
      </Typography>

      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="财务管理标签">
            <Tab label="收入" id="finance-tab-0" aria-controls="finance-tabpanel-0" />
            <Tab label="支出" id="finance-tab-1" aria-controls="finance-tabpanel-1" />
            <Tab label="发票" id="finance-tab-2" aria-controls="finance-tabpanel-2" />
          </Tabs>
        </Box>

        {/* 收入标签页 */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              label="搜索收入"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
              }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenIncomeDialog(true)}
            >
              添加收入
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>日期</TableCell>
                  <TableCell>描述</TableCell>
                  <TableCell>类别</TableCell>
                  <TableCell align="right">金额</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incomeData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* 支出标签页 */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              label="搜索支出"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
              }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenExpenseDialog(true)}
            >
              添加支出
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>日期</TableCell>
                  <TableCell>描述</TableCell>
                  <TableCell>类别</TableCell>
                  <TableCell align="right">金额</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expenseData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* 发票标签页 */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              label="搜索发票"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
              }}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenInvoiceDialog(true)}
            >
              创建发票
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>日期</TableCell>
                  <TableCell>客户</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">金额</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoiceData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          bgcolor: row.status === '已支付' ? 'success.light' :
                                   row.status === '未支付' ? 'warning.light' :
                                   row.status === '逾期' ? 'error.light' : 'info.light',
                          color: row.status === '已支付' ? 'success.dark' :
                                 row.status === '未支付' ? 'warning.dark' :
                                 row.status === '逾期' ? 'error.dark' : 'info.dark',
                        }}
                      >
                        {row.status}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{formatCurrency(row.amount)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <FileDownload fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* 添加收入对话框 */}
      <Dialog open={openIncomeDialog} onClose={() => setOpenIncomeDialog(false)}>
        <DialogTitle>添加新收入</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="date"
                label="日期"
                type="date"
                fullWidth
                value={newIncome.date}
                onChange={handleIncomeChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="描述"
                fullWidth
                value={newIncome.description}
                onChange={handleIncomeChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>类别</InputLabel>
                <Select
                  value={newIncome.category}
                  onChange={handleIncomeCategoryChange}
                  label="类别"
                >
                  {incomeCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="amount"
                label="金额"
                type="number"
                fullWidth
                value={newIncome.amount}
                onChange={handleIncomeChange}
                InputProps={{
                  startAdornment: <Box component="span" sx={{ mr: 1 }}>¥</Box>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenIncomeDialog(false)}>取消</Button>
          <Button onClick={handleIncomeSubmit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 添加支出对话框 */}
      <Dialog open={openExpenseDialog} onClose={() => setOpenExpenseDialog(false)}>
        <DialogTitle>添加新支出</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="date"
                label="日期"
                type="date"
                fullWidth
                value={newExpense.date}
                onChange={handleExpenseChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="描述"
                fullWidth
                value={newExpense.description}
                onChange={handleExpenseChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>类别</InputLabel>
                <Select
                  value={newExpense.category}
                  onChange={handleExpenseCategoryChange}
                  label="类别"
                >
                  {expenseCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="amount"
                label="金额"
                type="number"
                fullWidth
                value={newExpense.amount}
                onChange={handleExpenseChange}
                InputProps={{
                  startAdornment: <Box component="span" sx={{ mr: 1 }}>¥</Box>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExpenseDialog(false)}>取消</Button>
          <Button onClick={handleExpenseSubmit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 创建发票对话框 */}
      <Dialog open={openInvoiceDialog} onClose={() => setOpenInvoiceDialog(false)}>
        <DialogTitle>创建新发票</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="date"
                label="日期"
                type="date"
                fullWidth
                value={newInvoice.date}
                onChange={handleInvoiceChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="customer"
                label="客户名称"
                fullWidth
                value={newInvoice.customer}
                onChange={handleInvoiceChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="描述"
                fullWidth
                value={newInvoice.description}
                onChange={handleInvoiceChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>状态</InputLabel>
                <Select
                  value={newInvoice.status}
                  onChange={handleInvoiceStatusChange}
                  label="状态"
                >
                  {invoiceStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="amount"
                label="金额"
                type="number"
                fullWidth
                value={newInvoice.amount}
                onChange={handleInvoiceChange}
                InputProps={{
                  startAdornment: <Box component="span" sx={{ mr: 1 }}>¥</Box>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInvoiceDialog(false)}>取消</Button>
          <Button onClick={handleInvoiceSubmit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FinanceManager; 