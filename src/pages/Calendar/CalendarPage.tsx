import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';
import { 
  Add as AddIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  VideoCall as VideoCallIcon,
  Group as GroupIcon 
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { zhCN } from 'date-fns/locale';
import { format, isSameDay, isSameMonth, isToday } from 'date-fns';
import StatCard from '../../components/StatCard';

// 预约类型配置
const APPOINTMENT_TYPES = {
  client: { label: '客户会议', color: 'primary', icon: <VideoCallIcon fontSize="small" /> },
  team: { label: '团队活动', color: 'success', icon: <GroupIcon fontSize="small" /> },
  sales: { label: '销售活动', color: 'warning', icon: <EventIcon fontSize="small" /> },
  vendor: { label: '供应商', color: 'secondary', icon: <CalendarIcon fontSize="small" /> },
  review: { label: '审核', color: 'error', icon: <EventIcon fontSize="small" /> },
};

// 模拟预约数据
const INITIAL_APPOINTMENTS = [
  {
    id: 1,
    title: '客户会议',
    start: new Date(2023, 4, 10, 9, 0),
    end: new Date(2023, 4, 10, 10, 0),
    type: 'client',
  },
  {
    id: 2,
    title: '团队午餐',
    start: new Date(2023, 4, 12, 12, 0),
    end: new Date(2023, 4, 12, 13, 0),
    type: 'team',
  },
  {
    id: 3,
    title: '销售电话',
    start: new Date(2023, 4, 15, 14, 0),
    end: new Date(2023, 4, 15, 14, 30),
    type: 'sales',
  },
  {
    id: 4,
    title: '供应商访问',
    start: new Date(2023, 4, 16, 11, 0),
    end: new Date(2023, 4, 16, 12, 0),
    type: 'vendor',
  },
  {
    id: 5,
    title: '季度审核',
    start: new Date(2023, 4, 23, 13, 0),
    end: new Date(2023, 4, 23, 15, 0),
    type: 'review',
  },
];

// 日历单元格组件
interface CalendarCellProps {
  date: Date;
  isCurrentMonth: boolean;
  appointments: Array<{
    id: number;
    title: string;
    start: Date;
    type: string;
  }>;
}

const CalendarCell: React.FC<CalendarCellProps> = ({ date, isCurrentMonth, appointments }) => {
  const isDateToday = isToday(date);
  
  return (
    <Box
      sx={{
        height: 100,
        border: '1px solid #e0e0e0',
        p: 1,
        backgroundColor: isCurrentMonth ? '#fff' : '#f5f5f5',
        ...(isDateToday && {
          border: '2px solid #2c7be5',
          backgroundColor: 'rgba(44, 123, 229, 0.05)',
        }),
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: isDateToday ? 'bold' : 'normal',
          color: isCurrentMonth ? '#12263f' : '#95aac9',
        }}
      >
        {format(date, 'd')}
      </Typography>
      
      <Box sx={{ mt: 1, overflow: 'hidden' }}>
        {appointments.map((appointment) => {
          const typeConfig = APPOINTMENT_TYPES[appointment.type as keyof typeof APPOINTMENT_TYPES] || 
                             { color: 'default', icon: null };
          return (
            <Chip
              key={appointment.id}
              size="small"
              label={`${format(appointment.start, 'HH:mm')} ${appointment.title}`}
              color={typeConfig.color as any}
              icon={typeConfig.icon}
              sx={{ 
                mb: 0.5, 
                fontSize: '0.7rem',
                height: 20,
                "& .MuiChip-label": { 
                  px: 0.5,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

// 预约表单类型
interface AppointmentFormData {
  title: string;
  start: Date;
  end: Date;
  type: string;
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState(0); // 0: 月视图, 1: 周视图, 2: 日视图
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [formData, setFormData] = useState<AppointmentFormData>({
    title: '',
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000), // 1小时后
    type: 'client',
  });

  // 处理视图类型切换
  const handleViewChange = (_event: React.SyntheticEvent, newValue: number) => {
    setViewType(newValue);
  };

  // 打开新建预约对话框
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  // 关闭新建预约对话框
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // 创建新预约
  const handleCreateAppointment = () => {
    const nextId = Math.max(...appointments.map(a => a.id)) + 1;
    setAppointments([
      ...appointments,
      {
        id: nextId,
        ...formData,
      },
    ]);
    setIsDialogOpen(false);
    setFormData({
      title: '',
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
      type: 'client',
    });
  };

  // 表单变更处理
  const handleFormChange = (field: keyof AppointmentFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  // 生成日历视图
  const generateCalendarCells = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 获取当月第一天和最后一天
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // 计算日历需要显示的所有日期
    const startDay = firstDayOfMonth.getDay(); // 当月第一天是星期几
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    
    // 添加上月剩余天数
    for (let i = 0; i < startDay; i++) {
      const day = new Date(year, month, -i);
      days.unshift({
        date: day,
        isCurrentMonth: false,
      });
    }
    
    // 添加当月天数
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }
    
    // 补齐到6行，添加下月日期
    const totalCells = 42; // 6行 * 7天
    while (days.length < totalCells) {
      const day: Date = new Date(year, month, days.length - startDay + 1);
      days.push({
        date: day,
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  // 获取指定日期的预约
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(appointment.start, date)
    );
  };

  // 按类型统计今日预约
  const getTodayAppointmentStats = () => {
    const today = new Date();
    const todayAppointments = appointments.filter(apt => isSameDay(apt.start, today));
    const upcomingAppointments = appointments.filter(apt => 
      apt.start > today && isSameMonth(apt.start, currentDate)
    );
    
    return {
      total: todayAppointments.length,
      upcoming: upcomingAppointments.length
    };
  };

  // 渲染日历月视图
  const renderMonthView = () => {
    const days = generateCalendarCells();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const stats = getTodayAppointmentStats();
    
    return (
      <>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <StatCard 
              title="今日预约"
              value={stats.total}
              icon={<EventIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <StatCard 
              title="本月即将到来的预约"
              value={stats.upcoming}
              icon={<CalendarIcon />}
              color="success"
            />
          </Grid>
        </Grid>
        
        <Box sx={{ width: '100%' }}>
          <Grid container>
            {weekDays.map((day) => (
              <Grid item xs={12 / 7} key={day}>
                <Box
                  sx={{
                    p: 1,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    backgroundColor: '#f9fbfd',
                  }}
                >
                  {day}
                </Box>
              </Grid>
            ))}
            
            {days.map((day) => (
              <Grid item xs={12 / 7} key={day.date.toISOString()}>
                <CalendarCell 
                  date={day.date} 
                  isCurrentMonth={day.isCurrentMonth} 
                  appointments={getAppointmentsForDate(day.date)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </>
    );
  };

  // 渲染预约表单对话框
  const renderAppointmentDialog = () => (
    <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      <DialogTitle>新建预约</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="预约标题"
            value={formData.title}
            onChange={(e) => handleFormChange('title', e.target.value)}
            margin="normal"
          />
          
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <DatePicker
                label="日期"
                value={formData.start}
                onChange={(date) => {
                  if (!date) return;
                  const newStart = new Date(date);
                  newStart.setHours(formData.start.getHours());
                  newStart.setMinutes(formData.start.getMinutes());
                  const duration = formData.end.getTime() - formData.start.getTime();
                  const newEnd = new Date(newStart.getTime() + duration);
                  
                  handleFormChange('start', newStart);
                  handleFormChange('end', newEnd);
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TimePicker
                label="开始时间"
                value={formData.start}
                onChange={(time) => {
                  if (!time) return;
                  handleFormChange('start', time);
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
              
              <TimePicker
                label="结束时间"
                value={formData.end}
                onChange={(time) => {
                  if (!time) return;
                  handleFormChange('end', time);
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Box>
          </LocalizationProvider>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>预约类型</InputLabel>
            <Select
              value={formData.type}
              label="预约类型"
              onChange={(e) => handleFormChange('type', e.target.value)}
            >
              {Object.entries(APPOINTMENT_TYPES).map(([key, { label, icon }]) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {icon}
                    <Box sx={{ ml: 1 }}>{label}</Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>取消</Button>
        <Button 
          onClick={handleCreateAppointment} 
          variant="contained"
          disabled={formData.title.trim() === ''}
        >
          创建
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        日程与预约
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Tabs value={viewType} onChange={handleViewChange}>
          <Tab label="月视图" />
          <Tab label="周视图" />
          <Tab label="日视图" />
        </Tabs>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
            <DatePicker
              label="选择日期"
              value={currentDate}
              onChange={(newDate) => newDate && setCurrentDate(newDate)}
              slotProps={{ textField: { size: 'small' } }}
            />
          </LocalizationProvider>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            新建预约
          </Button>
        </Box>
      </Box>
      
      <Card>
        <CardContent>
          {viewType === 0 && renderMonthView()}
          {viewType === 1 && <Typography>周视图（开发中）</Typography>}
          {viewType === 2 && <Typography>日视图（开发中）</Typography>}
        </CardContent>
      </Card>
      
      {renderAppointmentDialog()}
    </Box>
  );
};

export default CalendarPage; 