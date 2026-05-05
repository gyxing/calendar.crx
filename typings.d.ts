import 'umi/typings';

declare global {
  interface Window {
    LunarCalendar: any; // 或更具体的类型
    chrome?: {
      storage?: ChromeStorage;
    };
  }

  // Chrome API 类型
  interface ChromeStorage {
    local: {
      get: (keys: string[], callback: (result: { holidays?: Festival }) => void) => void;
      set: (items: { holidays?: Festival }) => void;
    };
  }

  // 节假日 API 响应类型
  interface FestivalItem {
    StartDate: string;
    Duration: number;
    CompDays?: string[];
  }

  interface HolidayAPIResponse {
    Years?: {
      [year: string]: FestivalItem[];
    };
  }

  // 缓存数据类型
  interface CachedHolidays {
    data: Festival;
    timestamp: number;
  }

  // 农历信息类型
  interface LunarInfo {
    lYear: number;
    lMonth: number;
    lDay: number;
    animal: string;
    yearCn: string;
    monthCn: string;
    dayCn: string;
    ncWeek: string;
    isToday: boolean;
    festival?: string;
    lunarFestival?: string;
    term?: string;
  }
}

// 导出类型供其他文件使用
declare module 'solarlunar-es' {
  export function solar2lunar(year: number, month: number, day: number): LunarInfo | number;
}
