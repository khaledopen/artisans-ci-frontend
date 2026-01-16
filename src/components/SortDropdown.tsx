type SortOption = "rating" | "reviews" | "priceAsc" | "priceDesc";

type SortDropdownProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

const SortDropdown = ({ value, onChange }: SortDropdownProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="border px-4 py-2 rounded-lg"
    >
      <option value="rating">Meilleures notes</option>
      <option value="reviews">Plus d'avis</option>
      <option value="priceAsc">Prix croissant</option>
      <option value="priceDesc">Prix décroissant</option>
    </select>
  );
};

export default SortDropdown;
