import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  AccessTime as AccessTimeIcon,
  Payment as PaymentIcon,
  Business as BusinessIcon,
  VerifiedUser as VerifiedUserIcon,
  Group as GroupIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';

// 用户数据接口
interface UserProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  language: string;
  timezone: string;
  avatar?: string;
}

// 系统偏好接口
interface SystemPreferences {
  emailSummary: boolean;
  appointmentReminders: boolean;
  lowStockAlerts: boolean;
  autoReports: boolean;
  darkMode: boolean;
}

const SettingsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '陈明',
    title: '总经理',
    email: 'chenming@example.com',
    phone: '13800138000',
    language: 'zh_CN',
    timezone: 'Asia/Shanghai'
  });

  const [preferences, setPreferences] = useState<SystemPreferences>({
    emailSummary: false,
    appointmentReminders: true,
    lowStockAlerts: true,
    autoReports: false,
    darkMode: false,
  });

  // 处理Tab切换
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 处理个人资料变更
  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  // 处理系统偏好变更
  const handlePreferenceChange = (field: keyof SystemPreferences) => {
    setPreferences({ ...preferences, [field]: !preferences[field] });
  };

  // 处理语言选择变更
  const handleLanguageChange = (event: SelectChangeEvent) => {
    handleProfileChange('language', event.target.value);
  };

  // 处理时区选择变更
  const handleTimezoneChange = (event: SelectChangeEvent) => {
    handleProfileChange('timezone', event.target.value);
  };

  // 渲染个人资料设置
  const renderProfileSettings = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                {profile.name.charAt(0)}
              </Avatar>
              <Box sx={{ position: 'relative' }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                />
                <label htmlFor="avatar-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CameraIcon />}
                    size="small"
                  >
                    更改头像
                  </Button>
                </label>
              </Box>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                个人资料
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="姓名"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="职位"
                    value={profile.title}
                    onChange={(e) => handleProfileChange('title', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="电子邮箱"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="电话号码"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>语言</InputLabel>
                    <Select
                      value={profile.language}
                      label="语言"
                      onChange={handleLanguageChange}
                    >
                      <MenuItem value="zh_CN">简体中文</MenuItem>
                      <MenuItem value="en_US">English (US)</MenuItem>
                      <MenuItem value="ja_JP">日本語</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>时区</InputLabel>
                    <Select
                      value={profile.timezone}
                      label="时区"
                      onChange={handleTimezoneChange}
                    >
                      <MenuItem value="Asia/Shanghai">（GMT+8）北京</MenuItem>
                      <MenuItem value="America/New_York">（GMT-5）纽约</MenuItem>
                      <MenuItem value="Europe/London">（GMT+0）伦敦</MenuItem>
                      <MenuItem value="Asia/Tokyo">（GMT+9）东京</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary">
                  保存更改
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                系统偏好
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="每日邮件摘要" 
                    secondary="通过电子邮件接收每日业务摘要"
                  />
                  <Switch
                    edge="end"
                    checked={preferences.emailSummary}
                    onChange={() => handlePreferenceChange('emailSummary')}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="预约提醒" 
                    secondary="在即将到来的预约前收到提醒"
                  />
                  <Switch
                    edge="end"
                    checked={preferences.appointmentReminders}
                    onChange={() => handlePreferenceChange('appointmentReminders')}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUserIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="低库存提醒" 
                    secondary="当产品库存不足时收到提醒"
                  />
                  <Switch
                    edge="end"
                    checked={preferences.lowStockAlerts}
                    onChange={() => handlePreferenceChange('lowStockAlerts')}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemIcon>
                    <PaletteIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="暗色模式" 
                    secondary="使用深色背景的界面主题"
                  />
                  <Switch
                    edge="end"
                    checked={preferences.darkMode}
                    onChange={() => handlePreferenceChange('darkMode')}
                  />
                </ListItem>
              </List>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary">
                  保存偏好
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // 渲染安全设置
  const renderSecuritySettings = () => {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            安全设置
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText 
                primary="密码" 
                secondary="上次更改时间: 2023年4月15日"
              />
              <Button 
                variant="outlined" 
                size="small"
              >
                更改密码
              </Button>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <VerifiedUserIcon />
              </ListItemIcon>
              <ListItemText 
                primary="两步验证" 
                secondary="使用手机接收验证码增强账户安全性"
              />
              <Button 
                variant="outlined" 
                color="success" 
                size="small"
              >
                启用
              </Button>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText 
                primary="会话超时" 
                secondary="控制无操作自动登出的时间"
              />
              <FormControl sx={{ width: 200 }}>
                <Select
                  value="30"
                  size="small"
                >
                  <MenuItem value="15">15分钟</MenuItem>
                  <MenuItem value="30">30分钟</MenuItem>
                  <MenuItem value="60">1小时</MenuItem>
                  <MenuItem value="120">2小时</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText 
                primary="登录活动" 
                secondary="查看您的账户登录历史"
              />
              <Button 
                variant="outlined" 
                size="small"
              >
                查看历史
              </Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
  };

  // 渲染显示设置
  const renderDisplaySettings = () => {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            显示设置
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <PaletteIcon />
              </ListItemIcon>
              <ListItemText 
                primary="主题" 
                secondary="更改应用的颜色主题"
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    width: 35,
                    height: 35
                  }}
                >
                  <VerifiedUserIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  sx={{ 
                    bgcolor: '#673ab7', 
                    color: 'white',
                    '&:hover': { bgcolor: '#5e35b1' },
                    width: 35,
                    height: 35
                  }}
                >
                  <VerifiedUserIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  sx={{ 
                    bgcolor: '#e91e63', 
                    color: 'white',
                    '&:hover': { bgcolor: '#d81b60' },
                    width: 35,
                    height: 35
                  }}
                >
                  <VerifiedUserIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <PaletteIcon />
              </ListItemIcon>
              <ListItemText 
                primary="暗色模式" 
                secondary="切换为暗色主题"
              />
              <Switch
                edge="end"
                checked={preferences.darkMode}
                onChange={() => handlePreferenceChange('darkMode')}
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText 
                primary="语言" 
                secondary="设置应用界面语言"
              />
              <FormControl sx={{ width: 150 }}>
                <Select
                  value={profile.language}
                  size="small"
                  onChange={handleLanguageChange}
                >
                  <MenuItem value="zh_CN">简体中文</MenuItem>
                  <MenuItem value="en_US">English (US)</MenuItem>
                  <MenuItem value="ja_JP">日本語</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText 
                primary="日期格式" 
                secondary="设置日期显示格式"
              />
              <FormControl sx={{ width: 150 }}>
                <Select
                  value="yyyy-MM-dd"
                  size="small"
                >
                  <MenuItem value="yyyy-MM-dd">YYYY-MM-DD</MenuItem>
                  <MenuItem value="dd/MM/yyyy">DD/MM/YYYY</MenuItem>
                  <MenuItem value="MM/dd/yyyy">MM/DD/YYYY</MenuItem>
                </Select>
              </FormControl>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
  };

  // 渲染系统设置
  const renderSystemSettings = () => {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            系统设置
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText 
                primary="公司信息" 
                secondary="管理公司名称、地址和联系方式"
              />
              <Button 
                variant="outlined" 
                size="small"
                startIcon={<EditIcon />}
              >
                编辑
              </Button>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText 
                primary="用户管理" 
                secondary="管理用户账户和权限"
              />
              <Button 
                variant="outlined" 
                size="small"
              >
                管理
              </Button>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <PaymentIcon />
              </ListItemIcon>
              <ListItemText 
                primary="支付设置" 
                secondary="配置支付方式和发票模板"
              />
              <Button 
                variant="outlined" 
                size="small"
              >
                配置
              </Button>
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="数据备份" 
                secondary="配置自动备份和数据导出"
              />
              <Button 
                variant="outlined" 
                size="small"
                color="primary"
              >
                备份
              </Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        系统设置
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<PersonIcon />} label="个人资料" />
          <Tab icon={<SecurityIcon />} label="安全设置" />
          <Tab icon={<PaletteIcon />} label="显示设置" />
          <Tab icon={<SettingsIcon />} label="系统设置" />
        </Tabs>
      </Paper>
      
      {tabValue === 0 && renderProfileSettings()}
      {tabValue === 1 && renderSecuritySettings()}
      {tabValue === 2 && renderDisplaySettings()}
      {tabValue === 3 && renderSystemSettings()}
    </Box>
  );
};

export default SettingsPage; 