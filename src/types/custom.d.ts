// 为了解决各种TS模块报错问题
import * as React from 'react';

declare module 'react' {
  interface JSX {}
}

declare module '@mui/material/styles' {
  interface Theme {
    // 添加任何缺失的主题属性
  }
  interface ThemeOptions {
    // 添加任何缺失的主题选项
  }
}

declare module 'chart.js' {
  // 添加任何缺失的chart.js类型
}

declare module 'react-chartjs-2' {
  // 添加任何缺失的react-chartjs-2类型
}

declare module '@mui/x-date-pickers/AdapterDateFns' {
  // 添加任何缺失的date-pickers类型
}

declare module 'date-fns/locale/zh-CN' {
  const locale: any;
  export default locale;
} 