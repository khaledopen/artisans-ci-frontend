import StatCard from "./StatCard";
import type { Stat } from "../types/stat";

type StatsSectionProps = {
  stats: Stat[];
};

const StatsSection = ({ stats }: StatsSectionProps) => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
