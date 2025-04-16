import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
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
  MenuItem,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Grid,
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';

// 模拟交易数据
const transactions = [
  { id: 1, type: 'income', date: '2023-05-01', category: '销售', amount: 1200 },
  { id: 2, type: 'expense', date: '2023-05-02', category: '物资', amount: 350 },
  { id: 3, type: 'income', date: '2023-05-03', category: '服务', amount: 850 },
  { id: 4, type: 'expense', date: '2023-05-03', category: '租金', amount: 1200 },
  { id: 5, type: 'income', date: '2023-05-04', category: '销售', amount: 950 },
  { id: 6, type: 'expense', date: '2023-05-05', category: '办公用品', amount: 280 },
  { id: 7, type: 'income', date: '2023-05-06', category: '咨询', amount: 1500 },
  { id: 8, type: 'expense', date: '2023-05-07', category: '水电费', amount: 420 },
  { id: 9, type: 'income', date: '2023-05-08', category: '销售', amount: 1100 },
  { id: 10, type: 'expense', date: '2023-05-09', category: '市场营销', amount: 600 },
];

const FinancePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const rowsPerPage = 5;
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setFilterCategory(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesTab = tabValue === 0 
        ? true // 全部
        : tabValue === 1 
          ? transaction.type === 'income' // 收入
          : transaction.type === 'expense'; // 支出
      
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      
      const matchesSearch = searchQuery === '' || 
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.amount.toString().includes(searchQuery);
      
      const matchesDateRange = 
        (!dateRange.startDate || new Date(transaction.date) >= dateRange.startDate) &&
        (!dateRange.endDate || new Date(transaction.date) <= dateRange.endDate);
        
      return matchesTab && matchesCategory && matchesSearch && matchesDateRange;
    })
    .slice(startIndex, endIndex);

  const categories = [...new Set(transactions.map(t => t.category))];
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        财务管理
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="全部" />
        <Tab label="收入" />
        <Tab label="支出" />
        <Tab label="发票" />
        <Tab label="税务设置" />
      </Tabs>

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Button variant="contained" color="primary">
          添加新交易
        </Button>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>筛选</InputLabel>
            <Select
              value={filterCategory}
              label="筛选"
              onChange={handleCategoryFilterChange}
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="all">全部类别</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
            <Grid container spacing={1} sx={{ maxWidth: 300 }}>
              <Grid item xs={6}>
                <DatePicker
                  label="起始日期"
                  value={dateRange.startDate}
                  onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="结束日期"
                  value={dateRange.endDate}
                  onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>

          <TextField
            size="small"
            placeholder="搜索..."
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

      <Typography variant="h6" gutterBottom>
        交易历史
      </Typography>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>类型</TableCell>
              <TableCell>日期</TableCell>
              <TableCell>类别</TableCell>
              <TableCell>金额</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {transaction.type === 'income' ? '💰' : '💸'}
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.date), 'yyyy/MM/dd')}
                </TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Typography
                    color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {`¥${transaction.amount.toLocaleString()}`}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary">
                    <ViewIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default FinancePage; 