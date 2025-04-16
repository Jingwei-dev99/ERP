import React from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Divider,
  Card,
  CardContent,
  IconButton
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown,
  MoreVert,
  AccountBalance,
  ShoppingCart,
  People,
  CalendarToday
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// 假设数据 - 实际应用中应从API获取
const dashboardData = {
  revenue: {
    current: 24500,
    previous: 21875,
    percentChange: 12
  },
  expenses: {
    current: 16300,
    previous: 17158,
    percentChange: -5
  },
  profit: {
    current: 8200,
    previous: 6950,
    percentChange: 18
  },
  customers: 124,
  inventory: 57,
  appointments: 8
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        仪表盘
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          欢迎回来，{user?.name || '用户'}
        </Typography>
        <Typography variant="body1">
          这是您业务的实时概览。
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 收入卡片 */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography component="h2" variant="subtitle1" color="text.secondary">
                收入
              </Typography>
              <IconButton size="small">
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
            <Typography component="p" variant="h4">
              {formatCurrency(dashboardData.revenue.current)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {dashboardData.revenue.percentChange > 0 ? (
                <TrendingUp color="success" fontSize="small" sx={{ mr: 1 }} />
              ) : (
                <TrendingDown color="error" fontSize="small" sx={{ mr: 1 }} />
              )}
              <Typography 
                variant="body2" 
                color={dashboardData.revenue.percentChange > 0 ? 'success.main' : 'error.main'}
              >
                比上月增长 {Math.abs(dashboardData.revenue.percentChange)}%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* 支出卡片 */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography component="h2" variant="subtitle1" color="text.secondary">
                支出
              </Typography>
              <IconButton size="small">
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
            <Typography component="p" variant="h4">
              {formatCurrency(dashboardData.expenses.current)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {dashboardData.expenses.percentChange < 0 ? (
                <TrendingDown color="success" fontSize="small" sx={{ mr: 1 }} />
              ) : (
                <TrendingUp color="error" fontSize="small" sx={{ mr: 1 }} />
              )}
              <Typography 
                variant="body2" 
                color={dashboardData.expenses.percentChange < 0 ? 'success.main' : 'error.main'}
              >
                比上月减少 {Math.abs(dashboardData.expenses.percentChange)}%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* 利润卡片 */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography component="h2" variant="subtitle1" color="text.secondary">
                利润
              </Typography>
              <IconButton size="small">
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
            <Typography component="p" variant="h4">
              {formatCurrency(dashboardData.profit.current)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {dashboardData.profit.percentChange > 0 ? (
                <TrendingUp color="success" fontSize="small" sx={{ mr: 1 }} />
              ) : (
                <TrendingDown color="error" fontSize="small" sx={{ mr: 1 }} />
              )}
              <Typography 
                variant="body2" 
                color={dashboardData.profit.percentChange > 0 ? 'success.main' : 'error.main'}
              >
                比上月增长 {Math.abs(dashboardData.profit.percentChange)}%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* 业务概览 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              业务概览
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              {/* 客户 */}
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h5">{dashboardData.customers}</Typography>
                      <Typography variant="body2" color="text.secondary">客户</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* 库存 */}
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingCart sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h5">{dashboardData.inventory}</Typography>
                      <Typography variant="body2" color="text.secondary">库存产品</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* 今日预约 */}
              <Grid item xs={12} sm={4}>
                <Card variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarToday sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h5">{dashboardData.appointments}</Typography>
                      <Typography variant="body2" color="text.secondary">今日预约</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 