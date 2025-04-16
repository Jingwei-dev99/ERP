import React, { ReactNode } from 'react';
import { Box, Card, CardContent, Typography, SxProps, Theme } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  chart?: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  sx?: SxProps<Theme>;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  chart,
  color = 'primary',
  sx = {},
}) => {
  return (
    <Card sx={{ height: '100%', ...sx }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {icon && <Box sx={{ mr: 1 }}>{icon}</Box>}
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
        </Box>
        
        <Typography 
          variant="h4" 
          color={`${color}.main`} 
          gutterBottom
        >
          {value}
        </Typography>
        
        {trend && (
          <Typography 
            variant="body2" 
            color={trend.isPositive ? 'success.main' : 'error.main'}
            sx={{ mb: 2 }}
          >
            {trend.isPositive ? '▲' : '▼'} {trend.value}
          </Typography>
        )}
        
        {chart && (
          <Box sx={{ height: 120, mt: 2 }}>
            {chart}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard; 