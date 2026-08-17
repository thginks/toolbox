// 主题接口
export interface Theme {
  id: string
  name: string
  isDark: boolean
  colors: ThemeColors
}

// 主题颜色
export interface ThemeColors {
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  border: string
}

// 默认主题
export const defaultThemes = {
  light: {
    id: 'light',
    name: '浅色主题',
    isDark: false,
    colors: {
      primary: '#0ea5e9',
      secondary: '#64748b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      border: '#e2e8f0'
    }
  },
  dark: {
    id: 'dark',
    name: '深色主题',
    isDark: true,
    colors: {
      primary: '#38bdf8',
      secondary: '#94a3b8',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      border: '#334155'
    }
  }
}