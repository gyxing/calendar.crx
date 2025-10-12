import { Festival, getHolidays, getSafeMonth } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import Content from './content';
import Footer from './footer';
import Header from './header';

export default () => {
  const [current, setCurrent] = useState<Date>(new Date());
  const [festivals, setFestivals] = useState<Festival>();
  const cacheRef = useRef<Date>(current);

  useEffect(() => {
    cacheRef.current = current;
  }, [current]);

  useEffect(() => {
    getHolidays().then((res) => {
      setFestivals(res);
    });
  }, []);

  const onToMonth = useCallback((value: number) => {
    const newValue = getSafeMonth(cacheRef.current, value);
    setCurrent(newValue);
  }, []);

  return (
    <div className="calendar-page">
      <Header current={current} onToMonth={onToMonth} />
      <Content
        festivals={festivals}
        current={current}
        setCurrent={setCurrent}
      />
      <Footer current={current} setCurrent={setCurrent} />
    </div>
  );
};
