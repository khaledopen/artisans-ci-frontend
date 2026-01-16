import { useEffect, useState } from "react";
import type { Stat } from "../types/stat";

type StatCardProps = {
  stat: Stat;
};

const StatCard = ({ stat }: StatCardProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = stat.value;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / end), 20);

    const timer = setInterval(() => {
      start += Math.ceil(end / 50);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [stat.value]);

  return (
    <div className="flex flex-col items-center text-center text-white">
      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-4">
        {stat.icon}
      </div>

      <div className="text-3xl font-bold mb-1">
        {count.toLocaleString()}
        {stat.suffix}
      </div>

      <div className="text-sm opacity-90">
        {stat.label}
      </div>
    </div>
  );
};

export default StatCard;
