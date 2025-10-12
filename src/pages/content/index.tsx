import { Festival, formatDate } from '@/utils';
import { FC, memo, useMemo } from 'react';
import solarLunar from 'solarlunar-es';

const weekLabels = ['日', '一', '二', '三', '四', '五', '六'];

interface ItemValue {
  date: Date;
  day: number;
  dayCN: string;
  dateCN: string;
  dateStr: string;
  week: string;
  timestamp: number;
  festival?: string;
  festivals?: string[];
  isToday?: boolean;
  isWeekend?: boolean;
  disabled?: boolean;
}

interface Props {
  // 当前日期
  current?: Date;
  setCurrent?: (value: Date) => void;
  // 假期/补班 数据
  festivals?: Festival;
}

function getItemValue(sDate: Date, disabled?: boolean) {
  const date = new Date(sDate);
  const info = solarLunar.solar2lunar(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  if (typeof info === 'number' || !info) {
    return {
      date: date,
      timestamp: date.getTime(),
      day: date.getDate(),
      disabled: disabled,
    } as ItemValue;
  }
  const day = date.getDay();
  const festivals = [info.lunarFestival, info.festival, info.term].filter(
    (d) => !!d,
  );
  return {
    date: date,
    timestamp: date.getTime(),
    day: date.getDate(),
    dayCN: info.lDay === 1 ? info.monthCn : info.dayCn,
    dateCN: info.monthCn + info.dayCn,
    dateStr: formatDate(date),
    week: info.ncWeek,
    festival: festivals?.[0],
    festivals: festivals,
    isToday: info.isToday,
    isWeekend: day === 0 || day === 6,
    disabled: disabled,
  } as ItemValue;
}

// 划分一个月中的周期
function getWeeks(year: number, month: number) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  const res: ItemValue[][] = [];
  let week: ItemValue[] = [];
  for (let i = startDate.getDate(); i <= endDate.getDate(); i++) {
    startDate.setDate(i);
    if (startDate.getDay() == 0) {
      if (week.length > 0) {
        res.push(week);
      }
      week = [getItemValue(startDate)];
    } else {
      week.push(getItemValue(startDate));
    }
    if (startDate.getDate() == endDate.getDate()) {
      res.push(week);
    }
  }
  // ====== 补位 =======
  // 第一周
  const firstWeek = res[0];
  if (firstWeek.length < 7) {
    const firstDay = firstWeek[0];
    const count = 7 - firstWeek.length;
    for (let i = 0; i < count; i++) {
      const value = new Date(
        firstDay.date.getFullYear(),
        firstDay.date.getMonth(),
        -i,
      );
      res[0].unshift(getItemValue(value, true));
    }
  }
  // 最后一周
  const lastWeek = res[res.length - 1];
  if (lastWeek.length < 7) {
    const lastDay = lastWeek[lastWeek.length - 1];
    const count = 7 - lastWeek.length;
    for (let i = 0; i < count; i++) {
      const value = new Date(
        lastDay.date.getFullYear(),
        lastDay.date.getMonth(),
        lastDay.date.getDate() + i + 1,
      );
      res[res.length - 1].push(getItemValue(value, true));
    }
  }
  return res;
}

const Index: FC<Props> = ({ current, setCurrent, festivals }) => {
  const dateList = useMemo(() => {
    if (!current) {
      return undefined;
    }
    return getWeeks(current.getFullYear(), current.getMonth());
  }, [current]);

  return (
    <table className="calendar-table">
      <thead>
        <tr>
          {weekLabels.map((w) => (
            <th key={w}>{w}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dateList?.map((row, i) => (
          <tr key={i}>
            {row?.map((cell) => {
              const cls: string[] = [];
              if (cell.isWeekend) {
                cls.push('weekend');
              }
              if (cell.isToday) {
                cls.push('today');
              } else if (current && cell.dateStr === formatDate(current)) {
                cls.push('selected');
              }
              if (cell.disabled) {
                cls.push('disabled');
              }
              const fest = festivals?.[cell.dateStr];
              if (fest?.isHoliday) {
                cls.push('holiday');
              }
              if (fest?.isWorkday) {
                cls.push('workday');
              }
              return (
                <td
                  key={cell.day}
                  className={cls.join(' ')}
                  onClick={() => setCurrent?.(cell.date)}
                >
                  <div className="value">{cell.day}</div>
                  {cell.festival ? (
                    <div className="festival">{cell.festival}</div>
                  ) : (
                    <div className="label">{cell.dayCN}</div>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default memo(Index);
