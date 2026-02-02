import SearchBar from "./SearchBar";
import PopularSearches from "./PopularSearches";

type HeroProps = {
  title: string;
  subtitle: string;
  popularSearches: string[];
};

const Hero = ({ title, subtitle, popularSearches }: HeroProps) => {
  return (
    <section className="relative w-full bg-gradient-to-br from-blue-700 to-blue-900 py-16 md:py-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl opacity-90 mb-8">
          {subtitle}
        </p>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <SearchBar placeholder="Quel service recherchez-vous ?" />
        </div>

        {/* Popular searches */}
        <div className="mt-2">
          <PopularSearches items={popularSearches} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
