import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Print as PrintIcon,
  GetApp as DownloadIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// 注册 ChartJS 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [reportType, setReportType] = useState('pl');
  const [timeFrame, setTimeFrame] = useState('q2_2023');

  // 处理Tab切换
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 处理报表类型变更
  const handleReportTypeChange = (event: SelectChangeEvent) => {
    setReportType(event.target.value);
  };

  // 处理时间范围变更
  const handleTimeFrameChange = (event: SelectChangeEvent) => {
    setTimeFrame(event.target.value);
  };

  // 模拟财务数据 - 收入
  const revenueData = {
    labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
    datasets: [
      {
        label: '收入',
        data: [15800, 23400, 18900, 27600, 24500, 28800],
        backgroundColor: 'rgba(44, 123, 229, 0.2)',
        borderColor: 'rgba(44, 123, 229, 1)',
        borderWidth: 2,
      },
    ],
  };

  // 模拟财务数据 - 支出
  const expenseData = {
    labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
    datasets: [
      {
        label: '支出',
        data: [10500, 14200, 12800, 16300, 15700, 18100],
        backgroundColor: 'rgba(237, 85, 101, 0.2)',
        borderColor: 'rgba(237, 85, 101, 1)',
        borderWidth: 2,
      },
    ],
  };

  // 模拟财务数据 - 利润
  const profitData = {
    labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
    datasets: [
      {
        label: '利润',
        data: [5300, 9200, 6100, 11300, 8800, 10700],
        backgroundColor: 'rgba(0, 217, 126, 0.2)',
        borderColor: 'rgba(0, 217, 126, 1)',
        borderWidth: 2,
      },
    ],
  };

  // 模拟销售数据 - 产品销售比例
  const productSalesData = {
    labels: ['办公家具', '电子设备', '办公用品', '其他'],
    datasets: [
      {
        data: [42, 28, 18, 12],
        backgroundColor: [
          'rgba(44, 123, 229, 0.7)',
          'rgba(0, 217, 126, 0.7)',
          'rgba(237, 85, 101, 0.7)',
          'rgba(252, 185, 0, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 模拟销售数据 - 客户类型销售比例
  const customerSalesData = {
    labels: ['VIP客户', '常规客户', '新客户'],
    datasets: [
      {
        data: [55, 35, 10],
        backgroundColor: [
          'rgba(237, 85, 101, 0.7)',
          'rgba(44, 123, 229, 0.7)',
          'rgba(0, 217, 126, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 图表配置
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // 损益表数据
  const plData = {
    revenue: {
      services: 58500,
      products: 37200,
      other: 4300,
      total: 100000,
    },
    expenses: {
      labor: 35000,
      rent: 15000,
      equipment: 8500,
      marketing: 5200,
      other: 6300,
      total: 70000,
    },
    profit: 30000,
  };

  // 渲染财务报表
  const renderFinancialReports = () => {
    return (
      <>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>报表类型</InputLabel>
              <Select
                value={reportType}
                label="报表类型"
                onChange={handleReportTypeChange}
              >
                <MenuItem value="pl">损益表</MenuItem>
                <MenuItem value="balance">资产负债表</MenuItem>
                <MenuItem value="cashflow">现金流量表</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>时间范围</InputLabel>
              <Select
                value={timeFrame}
                label="时间范围"
                onChange={handleTimeFrameChange}
              >
                <MenuItem value="q1_2023">2023年第一季度</MenuItem>
                <MenuItem value="q2_2023">2023年第二季度</MenuItem>
                <MenuItem value="h1_2023">2023年上半年</MenuItem>
                <MenuItem value="2022">2022年全年</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <IconButton color="primary" aria-label="打印报表">
              <PrintIcon />
            </IconButton>
            <IconButton color="primary" aria-label="下载报表">
              <DownloadIcon />
            </IconButton>
          </Box>
        </Box>

        {reportType === 'pl' && (
          <Card>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">损益表 - 2023年第二季度</Typography>
                <Box>
                  <Button 
                    startIcon={<FileIcon />}
                    variant="outlined" 
                    size="small" 
                    sx={{ mr: 1 }}
                  >
                    PDF
                  </Button>
                  <Button 
                    startIcon={<FileIcon />}
                    variant="outlined" 
                    size="small"
                  >
                    Excel
                  </Button>
                </Box>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle1" fontWeight="bold">收入</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>服务收入</TableCell>
                      <TableCell align="right">¥{plData.revenue.services.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>产品销售</TableCell>
                      <TableCell align="right">¥{plData.revenue.products.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>其他收入</TableCell>
                      <TableCell align="right">¥{plData.revenue.other.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>
                        <Typography fontWeight="bold">总收入</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">¥{plData.revenue.total.toLocaleString()}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell colSpan={2} sx={{ pt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold">支出</Typography>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>人工成本</TableCell>
                      <TableCell align="right">¥{plData.expenses.labor.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>租金</TableCell>
                      <TableCell align="right">¥{plData.expenses.rent.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>设备与用品</TableCell>
                      <TableCell align="right">¥{plData.expenses.equipment.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>市场营销</TableCell>
                      <TableCell align="right">¥{plData.expenses.marketing.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ pl: 4 }}>其他费用</TableCell>
                      <TableCell align="right">¥{plData.expenses.other.toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>
                        <Typography fontWeight="bold">总支出</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">¥{plData.expenses.total.toLocaleString()}</Typography>
                      </TableCell>
                    </TableRow>

                    <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                      <TableCell>
                        <Typography variant="subtitle1" fontWeight="bold">净利润</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          ¥{plData.profit.toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        {reportType !== 'pl' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography variant="h6" color="text.secondary">
              {reportType === 'balance' ? '资产负债表' : '现金流量表'}报表（开发中）
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>财务趋势分析</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>收入趋势</Typography>
                <Box sx={{ height: 250 }}>
                  <Line data={revenueData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>支出趋势</Typography>
                <Box sx={{ height: 250 }}>
                  <Line data={expenseData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>利润趋势</Typography>
                <Box sx={{ height: 250 }}>
                  <Line data={profitData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  };

  // 渲染销售报表
  const renderSalesReports = () => {
    return (
      <>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>按产品类别的销售分布</Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                  <Pie data={productSalesData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>按客户类型的销售分布</Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                  <Pie data={customerSalesData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>月度销售趋势</Typography>
                <Box sx={{ height: 300 }}>
                  <Bar 
                    data={{
                      labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
                      datasets: [
                        {
                          label: '产品销售',
                          data: [6800, 8900, 7400, 9200, 8500, 9800],
                          backgroundColor: 'rgba(44, 123, 229, 0.7)',
                        },
                        {
                          label: '服务收入',
                          data: [9000, 14500, 11500, 18400, 16000, 19000],
                          backgroundColor: 'rgba(0, 217, 126, 0.7)',
                        },
                      ],
                    }} 
                    options={chartOptions} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  };

  // 渲染库存报表
  const renderInventoryReports = () => {
    return (
      <>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>库存类别分布</Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                  <Pie 
                    data={{
                      labels: ['办公家具', '电子设备', '办公用品', '其他'],
                      datasets: [
                        {
                          data: [35, 25, 30, 10],
                          backgroundColor: [
                            'rgba(44, 123, 229, 0.7)',
                            'rgba(0, 217, 126, 0.7)',
                            'rgba(237, 85, 101, 0.7)',
                            'rgba(252, 185, 0, 0.7)',
                          ],
                        },
                      ],
                    }} 
                    options={chartOptions} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>库存价值分布</Typography>
                <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                  <Pie 
                    data={{
                      labels: ['办公家具', '电子设备', '办公用品', '其他'],
                      datasets: [
                        {
                          data: [42000, 68000, 15000, 5000],
                          backgroundColor: [
                            'rgba(44, 123, 229, 0.7)',
                            'rgba(0, 217, 126, 0.7)',
                            'rgba(237, 85, 101, 0.7)',
                            'rgba(252, 185, 0, 0.7)',
                          ],
                        },
                      ],
                    }}
                    options={chartOptions} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>热门产品库存水平</Typography>
                <Box sx={{ height: 300 }}>
                  <Bar 
                    data={{
                      labels: ['办公椅', '办公桌', '笔记本电脑', '打印机', '文件柜', '投影仪', '会议桌'],
                      datasets: [
                        {
                          label: '当前库存',
                          data: [15, 8, 5, 3, 10, 2, 4],
                          backgroundColor: 'rgba(44, 123, 229, 0.7)',
                        },
                        {
                          label: '补货点',
                          data: [10, 5, 3, 2, 5, 1, 2],
                          backgroundColor: 'rgba(237, 85, 101, 0.7)',
                        },
                      ],
                    }}
                    options={chartOptions} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        报表与分析
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton color="primary" sx={{ mr: 1 }}>
          <PieChartIcon />
        </IconButton>
        <Typography variant="body1">
          通过数据驱动的分析来增强业务决策
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab icon={<MoneyIcon />} label="财务报表" />
        <Tab icon={<BarChartIcon />} label="销售报表" />
        <Tab icon={<InventoryIcon />} label="库存报表" />
        <Tab icon={<TimelineIcon />} label="自定义报表" />
      </Tabs>
      
      {tabValue === 0 && renderFinancialReports()}
      {tabValue === 1 && renderSalesReports()}
      {tabValue === 2 && renderInventoryReports()}
      {tabValue === 3 && (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 5, color: 'text.secondary' }}>
          自定义报表功能（开发中）
        </Typography>
      )}
    </Box>
  );
};

export default ReportsPage; 