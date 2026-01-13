type PopularSearchesProps = {
  title?: string;
  items: string[];
  onSelect?: (item: string) => void;
};

const PopularSearches = ({
  title = "Recherches populaires :",
  items,
  onSelect,
}: PopularSearchesProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-white">
      <span className="text-sm opacity-80">{title}</span>

      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect?.(item)}
          className="px-4 py-1 rounded-full bg-white/20 backdrop-blur text-sm hover:bg-white/30"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default PopularSearches;
