import { FC, memo, useMemo } from 'react';

interface Props {
  // 当前日期
  current?: Date;
  // value = 1 是前进一个月，-1 是 后退一个月
  onToMonth?: (value: number) => void;
}

const Index: FC<Props> = ({ current, onToMonth }) => {
  const title = useMemo(() => {
    if (current) {
      return `${current.getFullYear()}年${current.getMonth() + 1}月`;
    }
    return '';
  }, [current]);

  return (
    <div className="calendar-header">
      <span className="action" onClick={() => onToMonth?.(-1)}>
        &lt;
      </span>
      <span className="title">{title}</span>
      <span className="action" onClick={() => onToMonth?.(1)}>
        &gt;
      </span>
    </div>
  );
};

export default memo(Index);
