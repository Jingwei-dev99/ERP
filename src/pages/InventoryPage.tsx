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
  Pagination,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Warning as WarningIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import StatCard from '../components/StatCard';

// 模拟产品数据
const INITIAL_PRODUCTS = [
  { 
    id: 'P001', 
    name: '办公椅', 
    category: '家具', 
    stock: 15, 
    price: 600,
    supplier: '家具供应商A',
    reorderPoint: 10,
    lastUpdated: '2023-05-10',
  },
  { 
    id: 'P002', 
    name: '办公桌', 
    category: '家具', 
    stock: 8, 
    price: 1200,
    supplier: '家具供应商A',
    reorderPoint: 5,
    lastUpdated: '2023-05-05',
  },
  { 
    id: 'P003', 
    name: '笔记本电脑', 
    category: '电子设备', 
    stock: 5, 
    price: 5000,
    supplier: '电子供应商B',
    reorderPoint: 3,
    lastUpdated: '2023-04-28',
  },
  { 
    id: 'P004', 
    name: '打印机', 
    category: '电子设备', 
    stock: 3, 
    price: 1800,
    supplier: '电子供应商B',
    reorderPoint: 2,
    lastUpdated: '2023-04-15',
  },
  { 
    id: 'P005', 
    name: '文件柜', 
    category: '家具', 
    stock: 10, 
    price: 900,
    supplier: '家具供应商C',
    reorderPoint: 5,
    lastUpdated: '2023-05-08',
  },
  { 
    id: 'P006', 
    name: '投影仪', 
    category: '电子设备', 
    stock: 2, 
    price: 3500,
    supplier: '电子供应商D',
    reorderPoint: 1,
    lastUpdated: '2023-04-20',
  },
  { 
    id: 'P007', 
    name: '会议桌', 
    category: '家具', 
    stock: 4, 
    price: 2800,
    supplier: '家具供应商C',
    reorderPoint: 2,
    lastUpdated: '2023-05-02',
  },
];

// 模拟供应商数据
const SUPPLIERS = [
  { id: 1, name: '家具供应商A', contact: '张三', phone: '13800138001', email: 'zhangsan@example.com' },
  { id: 2, name: '电子供应商B', contact: '李四', phone: '13800138002', email: 'lisi@example.com' },
  { id: 3, name: '家具供应商C', contact: '王五', phone: '13800138003', email: 'wangwu@example.com' },
  { id: 4, name: '电子供应商D', contact: '赵六', phone: '13800138004', email: 'zhaoliu@example.com' },
];

// 产品表单类型
interface ProductFormData {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  supplier: string;
  reorderPoint: number;
}

// 产品类别
const CATEGORIES = ['家具', '电子设备', '办公用品', '其他'];

const InventoryPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductFormData>({
    id: '',
    name: '',
    category: '',
    stock: 0,
    price: 0,
    supplier: '',
    reorderPoint: 0,
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

  // 处理类别筛选变更
  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setFilterCategory(event.target.value);
    setPage(1); // 重置为第一页
  };

  // 处理分页变更
  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // 处理添加新产品
  const handleAddProduct = () => {
    // 生成新的产品ID
    const newId = `P${String(products.length + 1).padStart(3, '0')}`;
    setCurrentProduct({
      id: newId,
      name: '',
      category: '',
      stock: 0,
      price: 0,
      supplier: '',
      reorderPoint: 0,
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  // 处理编辑产品
  const handleEditProduct = (productId: string) => {
    const productToEdit = products.find(p => p.id === productId);
    if (productToEdit) {
      setCurrentProduct({
        id: productToEdit.id,
        name: productToEdit.name,
        category: productToEdit.category,
        stock: productToEdit.stock,
        price: productToEdit.price,
        supplier: productToEdit.supplier,
        reorderPoint: productToEdit.reorderPoint,
      });
      setIsEditing(true);
      setIsDialogOpen(true);
    }
  };

  // 处理删除产品
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('确定要删除此产品吗？')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  // 处理保存产品
  const handleSaveProduct = () => {
    if (isEditing) {
      // 更新现有产品
      setProducts(products.map(p => 
        p.id === currentProduct.id ? { 
          ...p, 
          ...currentProduct, 
          lastUpdated: new Date().toISOString().split('T')[0] 
        } : p
      ));
    } else {
      // 添加新产品
      setProducts([
        ...products,
        { 
          ...currentProduct, 
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      ]);
    }
    setIsDialogOpen(false);
  };

  // 处理表单变更
  const handleFormChange = (field: keyof ProductFormData, value: any) => {
    setCurrentProduct({ ...currentProduct, [field]: value });
  };

  // 获取库存不足的产品
  const getLowStockProducts = () => {
    return products.filter(p => p.stock <= p.reorderPoint);
  };

  // 筛选产品
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // 分页后的产品
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  // 计算总页数
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  // 渲染产品表格
  const renderProductsTable = () => {
    return (
      <>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
          >
            添加产品
          </Button>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>筛选类别</InputLabel>
              <Select
                value={filterCategory}
                label="筛选类别"
                onChange={handleCategoryFilterChange}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">所有类别</MenuItem>
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              placeholder="搜索产品..."
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
                <TableCell>产品ID</TableCell>
                <TableCell>名称</TableCell>
                <TableCell>类别</TableCell>
                <TableCell align="right">库存</TableCell>
                <TableCell align="right">价格 (¥)</TableCell>
                <TableCell>供应商</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={product.category} 
                        size="small"
                        color={product.category === '电子设备' ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {product.stock <= product.reorderPoint && (
                          <WarningIcon 
                            fontSize="small" 
                            color="error" 
                            sx={{ mr: 1 }} 
                          />
                        )}
                        {product.stock}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.supplier}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => console.log('查看详情', product.id)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary" onClick={() => handleEditProduct(product.id)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteProduct(product.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    没有找到匹配的产品
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

  // 渲染产品对话框
  const renderProductDialog = () => {
    return (
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditing ? '编辑产品' : '添加新产品'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              margin="normal"
              label="产品ID"
              value={currentProduct.id}
              disabled
              size="small"
            />

            <TextField
              fullWidth
              margin="normal"
              label="产品名称"
              value={currentProduct.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              required
              size="small"
              error={!currentProduct.name}
              helperText={!currentProduct.name ? '请输入产品名称' : ''}
            />

            <FormControl 
              fullWidth 
              margin="normal" 
              size="small"
              error={!currentProduct.category}
            >
              <InputLabel>产品类别</InputLabel>
              <Select
                value={currentProduct.category}
                label="产品类别"
                onChange={(e) => handleFormChange('category', e.target.value)}
                required
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
              {!currentProduct.category && (
                <Typography variant="caption" color="error">
                  请选择产品类别
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="库存数量"
              type="number"
              value={currentProduct.stock}
              onChange={(e) => handleFormChange('stock', parseInt(e.target.value) || 0)}
              InputProps={{
                inputProps: { min: 0 }
              }}
              size="small"
            />

            <TextField
              fullWidth
              margin="normal"
              label="产品价格"
              type="number"
              value={currentProduct.price}
              onChange={(e) => handleFormChange('price', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                inputProps: { min: 0 }
              }}
              size="small"
            />

            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>供应商</InputLabel>
              <Select
                value={currentProduct.supplier}
                label="供应商"
                onChange={(e) => handleFormChange('supplier', e.target.value)}
              >
                {SUPPLIERS.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.name}>{supplier.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="补货点"
              type="number"
              value={currentProduct.reorderPoint}
              onChange={(e) => handleFormChange('reorderPoint', parseInt(e.target.value) || 0)}
              helperText="当库存低于此值时会发出警告"
              InputProps={{
                inputProps: { min: 0 }
              }}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>取消</Button>
          <Button 
            onClick={handleSaveProduct} 
            variant="contained"
            disabled={!currentProduct.name || !currentProduct.category}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // 渲染库存概览
  const renderInventoryOverview = () => {
    const lowStockProducts = getLowStockProducts();
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const totalProductsValue = totalValue.toLocaleString();
    
    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="总产品数量"
            value={totalProducts}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="库存总价值"
            value={`¥${totalProductsValue}`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard 
            title="低库存产品"
            value={lowStockProducts.length}
            color={lowStockProducts.length > 0 ? "error" : "success"}
            trend={lowStockProducts.length > 0 ? {
              value: "需要补货",
              isPositive: false
            } : undefined}
          />
        </Grid>
      </Grid>
    );
  };

  // 渲染低库存产品警告
  const renderLowStockWarning = () => {
    const lowStockProducts = getLowStockProducts();
    
    if (lowStockProducts.length === 0) {
      return null;
    }
    
    return (
      <Alert 
        severity="warning" 
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small">
            补货
          </Button>
        }
      >
        有 {lowStockProducts.length} 个产品库存不足，需要补货。
      </Alert>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        库存管理
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="产品" />
        <Tab label="订单" />
        <Tab label="供应商" />
        <Tab label="设置" />
      </Tabs>
      
      {tabValue === 0 && (
        <>
          {renderInventoryOverview()}
          {renderLowStockWarning()}
          {renderProductsTable()}
          {renderProductDialog()}
        </>
      )}
      
      {tabValue === 1 && (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 5, color: 'text.secondary' }}>
          订单管理功能（开发中）
        </Typography>
      )}
      
      {tabValue === 2 && (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 5, color: 'text.secondary' }}>
          供应商管理功能（开发中）
        </Typography>
      )}
      
      {tabValue === 3 && (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 5, color: 'text.secondary' }}>
          库存设置（开发中）
        </Typography>
      )}
    </Box>
  );
};

export default InventoryPage; 