import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, List, ListItem, Divider } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { Line, Bar, Pie } from 'react-chartjs-2';
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
  Legend,
} from 'chart.js';

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

const Dashboard: React.FC = () => {
  // 收入数据
  const revenueData = {
    labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
    datasets: [
      {
        label: '收入',
        data: [18500, 19200, 22500, 24000, 24500, 26000],
        borderColor: '#2c7be5',
        backgroundColor: 'rgba(44, 123, 229, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // 支出数据
  const expenseData = {
    labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
    datasets: [
      {
        label: '支出',
        data: [15000, 15800, 16000, 15600, 16300, 17200],
        backgroundColor: '#6e84a3',
      },
    ],
  };

  // 利润数据
  const profitData = {
    labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
    datasets: [
      {
        label: '利润',
        data: [3500, 3400, 6500, 8400, 8200, 8800],
        borderColor: '#00d97e',
        backgroundColor: 'rgba(0, 217, 126, 0.1)',
        fill: true,
      },
    ],
  };

  // 收入类别数据
  const revenueCategoryData = {
    labels: ['产品销售', '服务收入', '其他'],
    datasets: [
      {
        data: [45300, 28750, 2800],
        backgroundColor: ['#2c7be5', '#00d97e', '#f6c343'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        仪表盘概览
      </Typography>

      {/* 主要指标卡片 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                收入
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                ¥24,500
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArrowUpward sx={{ color: 'success.main', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  比上月增长12%
                </Typography>
              </Box>
              <Box sx={{ height: 120 }}>
                <Line data={revenueData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                支出
              </Typography>
              <Typography variant="h4" color="secondary" gutterBottom>
                ¥16,300
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArrowDownward sx={{ color: 'success.main', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  比上月减少5%
                </Typography>
              </Box>
              <Box sx={{ height: 120 }}>
                <Bar data={expenseData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                利润
              </Typography>
              <Typography variant="h4" color="success.main" gutterBottom>
                ¥8,200
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArrowUpward sx={{ color: 'success.main', fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2" color="success.main">
                  比上月增长18%
                </Typography>
              </Box>
              <Box sx={{ height: 120 }}>
                <Line data={profitData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 第二行 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                收入类别
              </Typography>
              <Box sx={{ height: 240, display: 'flex', justifyContent: 'center' }}>
                <Pie data={revenueCategoryData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                即将到来的预约
              </Typography>
              <List>
                <ListItem sx={{ py: 1 }}>
                  <Typography variant="body1">- 客户会议 (上午9点)</Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 1 }}>
                  <Typography variant="body1">- 供应商电话 (上午11点)</Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 1 }}>
                  <Typography variant="body1">- 团队审核 (下午2点)</Typography>
                </ListItem>
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button color="primary" variant="outlined">查看日历</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 第三行 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                低库存商品
              </Typography>
              <List>
                <ListItem sx={{ py: 1 }}>
                  <Typography variant="body1">- 产品A (剩余2个)</Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 1 }}>
                  <Typography variant="body1">- 产品B (剩余5个)</Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 1 }}>
                  <Typography variant="body1">- 产品C (剩余3个)</Typography>
                </ListItem>
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button color="primary" variant="contained">订购库存</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                最近交易
              </Typography>
              <List>
                <ListItem sx={{ py: 1 }}>
                  <Typography variant="body1">- 发票#1089已支付</Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 1 }}>
                  <Typography variant="body1">- 新支出: ¥350</Typography>
                </ListItem>
                <Divider />
                <ListItem sx={{ py: 1 }}>
                  <Typography variant="body1">- 发票#1090已发送</Typography>
                </ListItem>
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button color="primary">查看全部</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 