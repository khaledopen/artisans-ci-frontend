type ArtisansHeaderProps = {
  count: number;
  search: string;
  onSearchChange: (value: string) => void;
};

const ArtisansHeader = ({
  count,
  search,
  onSearchChange,
}: ArtisansHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-1">Nos artisans</h1>
      <p className="text-gray-600 mb-6">
        {count} professionnels disponibles
      </p>

      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Rechercher par nom, spécialité ou ville..."
        className="w-full bg-gray-100 px-4 py-3 rounded-xl outline-none"
      />
    </div>
  );
};

export default ArtisansHeader;
