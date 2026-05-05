import { defineConfig } from 'umi';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  title: '日历',
  mfsu: false,
  hash: true,
  history: { type: 'hash' },
  publicPath: isProd ? './' : '/',
  outputPath: './dist/calendar.crx',
  routes: [{ path: '/', component: './index' }],
  extraBabelPlugins: isProd ? ['babel-plugin-dynamic-import-node'] : [],
});
