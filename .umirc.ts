import { defineConfig } from 'umi';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  title: '日历',
  hash: true,
  history: { type: 'hash' },
  publicPath: isProd ? './' : '/',
  routes: [{ path: '/', component: './index' }],
  outputPath: './dist/calendar.crx',
});
