function padStr(value: number) {
  return `${value}`.padStart(2, '0');
}

// @return 2025-01-01
export function formatDate(date: Date) {
  return `${date.getFullYear()}-${padStr(date.getMonth() + 1)}-${padStr(date.getDate())}`;
}

export interface Festival {
  [key: string]: {
    isWorkday?: boolean;
    isHoliday?: boolean;
  };
}

function fetchHolidays() {
  return fetch(
    'https://www.shuyz.com/githubfiles/china-holiday-calender/master/holidayAPI.json',
  )
    .then((res) => res.json())
    .then((res) => {
      if (res?.Years) {
        const dateMap: Festival = {};
        Object.values(res.Years).forEach((festivals: any) => {
          festivals?.forEach((festival: any) => {
            // 补班
            festival?.CompDays?.forEach((d: string) => {
              dateMap[d] = { isWorkday: true };
            });
            // 假期
            const startDate = new Date(festival.StartDate);
            const length = festival.Duration;
            for (let i = 0; i < length; i++) {
              const date = new Date(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate() + i,
              );
              const key = formatDate(date);
              dateMap[key] = { isHoliday: true };
            }
          });
        });
        window.chrome?.storage?.local.set({
          holidays: dateMap,
        });
        return dateMap;
      }
      return undefined;
    });
}

export function getHolidays(): Promise<Festival | undefined> {
  return new Promise((resolve) => {
    if (window.chrome?.storage) {
      window.chrome.storage.local.get(['holidays'], (result: any) => {
        if (result.holidays) {
          fetchHolidays(); // 更新数据
          resolve(result.holidays);
        } else {
          fetchHolidays().then((value) => {
            resolve(value);
          });
        }
      });
    } else {
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
