import 'umi/typings';

declare global {
  interface Window {
    LunarCalendar: any; // 或更具体的类型
    chrome: any;
  }
}
