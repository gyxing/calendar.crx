import solarLunar from 'solarlunar-es';

// Type definitions
export interface Festival {
  [key: string]: {
    isWorkday?: boolean;
    isHoliday?: boolean;
  };
}

export interface FestivalItem {
  StartDate: string;
  Duration: number;
  CompDays?: string[];
}

export interface HolidayAPIResponse {
  Years: {
    [year: string]: FestivalItem[];
  };
}

export interface CachedHolidays {
  data: Festival;
  timestamp: number;
}

export interface LunarInfo {
  lYear: number;
  lMonth: number;
  lDay: number;
  animal: string;
  yearCn: string;
  monthCn: string;
  dayCn: string;
  cYear: number;
  cMonth: number;
  cDay: number;
  gzYear: string;
  gzMonth: string;
  gzDay: string;
  isToday: boolean;
  isLeap: boolean;
  nWeek: number;
  ncWeek: string;
  isTerm: boolean;
  term: string;
  lunarFestival: string;
  festival: string;
}

// Utility functions
function padStr(value: number) {
  return `${value}`.padStart(2, '0');
}

// @return 2025-01-01
export function formatDate(date: Date) {
  return `${date.getFullYear()}-${padStr(date.getMonth() + 1)}-${padStr(date.getDate())}`;
}

// 新增：日期创建辅助函数
export function createDate(year: number, month: number, day: number): Date {
  return new Date(year, month, day);
}

// 新增：农历信息工具函数
export function getLunarInfo(date: Date): LunarInfo | number {
  return solarLunar.solar2lunar(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  ) as LunarInfo | number;
}

async function fetchHolidays(): Promise<Festival | undefined> {
  try {
    const res = await fetch(
      'https://www.shuyz.com/githubfiles/china-holiday-calender/master/holidayAPI.json',
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data: HolidayAPIResponse = await res.json();

    if (data?.Years) {
      const dateMap: Festival = {};
      Object.values(data.Years).forEach((festivals: FestivalItem[]) => {
        festivals?.forEach((festival: FestivalItem) => {
          // 补班
          festival?.CompDays?.forEach((d: string) => {
            dateMap[d] = { isWorkday: true };
          });
          // 假期
          const startDate = new Date(festival.StartDate);
          const length = festival.Duration;
          for (let i = 0; i < length; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const key = formatDate(date);
            dateMap[key] = { isHoliday: true };
          }
        });
      });

      // 保存到缓存，包含时间戳
      const cachedData: CachedHolidays = {
        data: dateMap,
        timestamp: Date.now(),
      };
      window.chrome?.storage?.local.set({
        holidays: cachedData,
      });

      return dateMap;
    }
    return undefined;
  } catch (error) {
    console.error('获取节假日数据失败:', error);
    return undefined;
  }
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 小时

function isCacheExpired(timestamp: number): boolean {
  return Date.now() - timestamp > CACHE_DURATION;
}

export function getHolidays(): Promise<Festival | undefined> {
  return new Promise((resolve) => {
    if (window.chrome?.storage) {
      window.chrome.storage.local.get(['holidays'], (result: { holidays?: CachedHolidays }) => {
        const cached = result.holidays;

        if (cached && cached.data && !isCacheExpired(cached.timestamp)) {
          // 缓存有效，直接返回
          resolve(cached.data);
        } else {
          // 缓存过期或不存在，获取新数据
          fetchHolidays().then((value) => {
            resolve(value);
          });
        }
      });
    } else {
      // 非扩展环境，直接获取
      fetchHolidays().then((value) => {
        resolve(value);
      });
    }
  });
}

// 需处理跨年和无效日期
export function getSafeMonth(date: Date, value: number) {
  const newDate = new Date(date);
  const originalDate = newDate.getDate();
  newDate.setMonth(newDate.getMonth() + value);
  if (newDate.getDate() !== originalDate) {
    newDate.setDate(0);
  }
  return newDate;
}
