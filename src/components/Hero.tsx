import SearchBar from "./SearchBar";
import PopularSearches from "./PopularSearches";

type HeroProps = {
  title: string;
  subtitle: string;
  popularSearches: string[];
};

const Hero = ({ title, subtitle, popularSearches }: HeroProps) => {
  return (
    <section className="relative w-full bg-gradient-to-br from-blue-700 to-blue-900 py-24 overflow-hidden">

      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative max-w-4xl mx-auto px-6 text-center text-white">

        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {title}
        </h1>

        <p className="text-lg md:text-xl opacity-90 mb-10">
          {subtitle}
        </p>

        <div className="flex justify-center">
          <SearchBar
            placeholder="Quel service recherchez-vous ?"
          />
        </div>

        <PopularSearches items={popularSearches} />
      </div>
    </section>
  );
};

export default Hero;
