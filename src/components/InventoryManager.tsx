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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Alert,
  Chip,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Warning,
  CheckCircle,
  LocalShipping,
  Search,
  Visibility,
  ShoppingCart
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
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
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

// 模拟库存数据
const productData = [
  { id: 1, sku: 'P001', name: '办公椅', category: '办公家具', price: 599, stockLevel: 15, reorderPoint: 5 },
  { id: 2, sku: 'P002', name: '办公桌', category: '办公家具', price: 1299, stockLevel: 8, reorderPoint: 3 },
  { id: 3, sku: 'P003', name: '笔记本电脑', category: '电子设备', price: 5999, stockLevel: 12, reorderPoint: 5 },
  { id: 4, sku: 'P004', name: '打印机', category: '电子设备', price: 1499, stockLevel: 4, reorderPoint: 5 },
  { id: 5, sku: 'P005', name: '钢笔套装', category: '办公用品', price: 99, stockLevel: 38, reorderPoint: 10 },
  { id: 6, sku: 'P006', name: 'A4纸 (500张)', category: '办公用品', price: 45, stockLevel: 30, reorderPoint: 15 },
  { id: 7, sku: 'P007', name: '文件柜', category: '办公家具', price: 899, stockLevel: 2, reorderPoint: 3 },
];

const purchaseOrderData = [
  { id: 1, date: '2023-09-05', supplier: '优质办公家具有限公司', status: '已接收', total: 5990 },
  { id: 2, date: '2023-09-12', supplier: '电子设备批发商', status: '已下单', total: 29995 },
  { id: 3, date: '2023-09-15', supplier: '办公用品直销店', status: '待审批', total: 990 },
  { id: 4, date: '2023-09-18', supplier: '文具批发中心', status: '草稿', total: 675 },
];

// 类别选项
const productCategories = ['办公家具', '电子设备', '办公用品', '其他'];
const poStatuses = ['草稿', '待审批', '已下单', '运输中', '已接收', '已取消'];

const InventoryManager: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openPODialog, setOpenPODialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 表单状态
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    category: '',
    price: '',
    stockLevel: '',
    reorderPoint: ''
  });

  const [newPO, setNewPO] = useState({
    date: '',
    supplier: '',
    items: [],
    status: '',
    total: ''
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // 产品表单处理
  const handleProductChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const handleProductCategoryChange = (event: SelectChangeEvent) => {
    setNewProduct({
      ...newProduct,
      category: event.target.value
    });
  };

  const handleProductSubmit = () => {
    // 这里应该添加表单验证和数据提交逻辑
    console.log('提交新产品:', newProduct);
    setOpenProductDialog(false);
    // 重置表单
    setNewProduct({
      sku: '',
      name: '',
      category: '',
      price: '',
      stockLevel: '',
      reorderPoint: ''
    });
  };

  // 采购单表单处理
  const handlePOChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewPO({
      ...newPO,
      [name]: value
    });
  };

  const handlePOStatusChange = (event: SelectChangeEvent) => {
    setNewPO({
      ...newPO,
      status: event.target.value
    });
  };

  const handlePOSubmit = () => {
    // 这里应该添加表单验证和数据提交逻辑
    console.log('提交新采购单:', newPO);
    setOpenPODialog(false);
    // 重置表单
    setNewPO({
      date: '',
      supplier: '',
      items: [],
      status: '',
      total: ''
    });
  };

  // 格式化金额为人民币格式
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount);
  };

  // 获取库存状态
  const getStockStatus = (stockLevel: number, reorderPoint: number) => {
    if (stockLevel <= 0) {
      return { color: 'error', label: '无货', icon: <Warning fontSize="small" /> };
    } else if (stockLevel <= reorderPoint) {
      return { color: 'warning', label: '库存低', icon: <Warning fontSize="small" /> };
    } else {
      return { color: 'success', label: '充足', icon: <CheckCircle fontSize="small" /> };
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        库存管理
      </Typography>

      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="库存管理标签">
            <Tab label="产品目录" id="inventory-tab-0" aria-controls="inventory-tabpanel-0" />
            <Tab label="库存状态" id="inventory-tab-1" aria-controls="inventory-tabpanel-1" />
            <Tab label="采购订单" id="inventory-tab-2" aria-controls="inventory-tabpanel-2" />
          </Tabs>
        </Box>

        {/* 产品目录标签页 */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              label="搜索产品"
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
              onClick={() => setOpenProductDialog(true)}
            >
              添加产品
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>产品名称</TableCell>
                  <TableCell>类别</TableCell>
                  <TableCell align="right">单价</TableCell>
                  <TableCell align="right">库存量</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.sku}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{formatCurrency(row.price)}</TableCell>
                    <TableCell align="right">{row.stockLevel}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <Visibility fontSize="small" />
                      </IconButton>
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

        {/* 库存状态标签页 */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    库存概览
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                    <Typography>总产品数:</Typography>
                    <Typography fontWeight="bold">{productData.length}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                    <Typography>库存充足:</Typography>
                    <Typography fontWeight="bold" color="success.main">
                      {productData.filter(p => p.stockLevel > p.reorderPoint).length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                    <Typography>库存不足:</Typography>
                    <Typography fontWeight="bold" color="warning.main">
                      {productData.filter(p => p.stockLevel > 0 && p.stockLevel <= p.reorderPoint).length}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                    <Typography>缺货产品:</Typography>
                    <Typography fontWeight="bold" color="error.main">
                      {productData.filter(p => p.stockLevel === 0).length}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    需要补货的产品
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>产品名称</TableCell>
                          <TableCell align="right">库存量</TableCell>
                          <TableCell align="right">补货点</TableCell>
                          <TableCell align="right">状态</TableCell>
                          <TableCell align="right"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productData
                          .filter(product => product.stockLevel <= product.reorderPoint)
                          .map(product => {
                            const status = getStockStatus(product.stockLevel, product.reorderPoint);
                            return (
                              <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell align="right">{product.stockLevel}</TableCell>
                                <TableCell align="right">{product.reorderPoint}</TableCell>
                                <TableCell align="right">
                                  <Chip
                                    size="small"
                                    icon={status.icon}
                                    label={status.label}
                                    color={status.color as any}
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <Tooltip title="添加到采购单">
                                    <IconButton size="small" color="primary">
                                      <ShoppingCart fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            所有产品库存
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>SKU</TableCell>
                  <TableCell>产品名称</TableCell>
                  <TableCell align="right">当前库存</TableCell>
                  <TableCell align="right">补货点</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productData.map((row) => {
                  const status = getStockStatus(row.stockLevel, row.reorderPoint);
                  return (
                    <TableRow key={row.id}>
                      <TableCell>{row.sku}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell align="right">{row.stockLevel}</TableCell>
                      <TableCell align="right">{row.reorderPoint}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          icon={status.icon}
                          label={status.label}
                          color={status.color as any}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" color="primary">
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <ShoppingCart fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* 采购订单标签页 */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              label="搜索采购单"
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
              onClick={() => setOpenPODialog(true)}
            >
              创建采购单
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>单号</TableCell>
                  <TableCell>日期</TableCell>
                  <TableCell>供应商</TableCell>
                  <TableCell>状态</TableCell>
                  <TableCell align="right">总金额</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchaseOrderData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>PO-{row.id.toString().padStart(4, '0')}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.supplier}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.status}
                        color={
                          row.status === '已接收' ? 'success' :
                          row.status === '已下单' || row.status === '运输中' ? 'info' :
                          row.status === '待审批' ? 'warning' :
                          row.status === '已取消' ? 'error' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell align="right">{formatCurrency(row.total)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <LocalShipping fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* 添加产品对话框 */}
      <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
        <DialogTitle>添加新产品</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="sku"
                label="SKU"
                fullWidth
                value={newProduct.sku}
                onChange={handleProductChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="产品名称"
                fullWidth
                value={newProduct.name}
                onChange={handleProductChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>类别</InputLabel>
                <Select
                  value={newProduct.category}
                  onChange={handleProductCategoryChange}
                  label="类别"
                >
                  {productCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="单价"
                type="number"
                fullWidth
                value={newProduct.price}
                onChange={handleProductChange}
                InputProps={{
                  startAdornment: <Box component="span" sx={{ mr: 1 }}>¥</Box>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="stockLevel"
                label="初始库存"
                type="number"
                fullWidth
                value={newProduct.stockLevel}
                onChange={handleProductChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="reorderPoint"
                label="补货点"
                type="number"
                fullWidth
                value={newProduct.reorderPoint}
                onChange={handleProductChange}
                helperText="当库存低于此数量时将触发补货提醒"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductDialog(false)}>取消</Button>
          <Button onClick={handleProductSubmit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 创建采购单对话框 */}
      <Dialog open={openPODialog} onClose={() => setOpenPODialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>创建采购单</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date"
                label="日期"
                type="date"
                fullWidth
                value={newPO.date}
                onChange={handlePOChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="supplier"
                label="供应商"
                fullWidth
                value={newPO.supplier}
                onChange={handlePOChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>状态</InputLabel>
                <Select
                  value={newPO.status}
                  onChange={handlePOStatusChange}
                  label="状态"
                >
                  {poStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                采购产品
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                此处应该添加产品选择和数量输入功能
              </Alert>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                >
                  添加产品
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="total"
                label="总金额"
                type="number"
                fullWidth
                value={newPO.total}
                onChange={handlePOChange}
                InputProps={{
                  startAdornment: <Box component="span" sx={{ mr: 1 }}>¥</Box>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPODialog(false)}>取消</Button>
          <Button onClick={handlePOSubmit} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InventoryManager; 