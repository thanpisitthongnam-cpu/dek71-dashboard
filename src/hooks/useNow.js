import { useEffect, useRef, useState } from 'react';

/**
 * นาฬิกาเรียลไทม์ อัปเดตทุก `ms` มิลลิวินาที (ค่า default = ทุกวินาที)
 */
export default function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(intervalRef.current);
  }, [ms]);

  return now;
}
