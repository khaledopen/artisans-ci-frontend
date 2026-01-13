import { useState } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  buttonText?: string;
  onSearch?: (value: string) => void;
};

const SearchBar = ({
  placeholder = "Rechercher...",
  buttonText = "Rechercher",
  onSearch,
}: SearchBarProps) => {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg flex items-center overflow-hidden">
      <div className="flex items-center gap-3 px-4 text-gray-400 w-full">
        <Search size={20} />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full py-4 outline-none text-gray-700"
        />
      </div>

      <button
        onClick={handleSearch}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 font-medium"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default SearchBar;
