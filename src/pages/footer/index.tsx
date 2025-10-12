import { FC, memo, useMemo } from 'react';
import solarLunar from 'solarlunar-es';

interface Props {
  // 当前日期
  current?: Date;
  setCurrent?: (value: Date) => void;
}

const Index: FC<Props> = ({ current, setCurrent }) => {
  const info = useMemo(() => {
    if (!current) {
      return undefined;
    }
    return solarLunar.solar2lunar(
      current.getFullYear(),
      current.getMonth() + 1,
      current.getDate(),
    );
  }, [current]);

  return (
    <div className="calendar-footer" onClick={() => setCurrent?.(new Date())}>
      {typeof info === 'number' || !info ? (
        <span>{info}</span>
      ) : (
        <>
          {info.isToday && <span>今天:</span>}
          <span>【{info.animal}】</span>
          <span>
            {(info as any).yearCn} {info.monthCn}
            {info.dayCn}
          </span>
          <span>{info.ncWeek}</span>
          {!!info.festival && <span>{info.festival}</span>}
          {!!info.lunarFestival && <span>{info.lunarFestival}</span>}
        </>
      )}
    </div>
  );
};

export default memo(Index);
