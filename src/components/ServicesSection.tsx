import ServiceCard from "./ServiceCard";
import type { Service } from "../types/service";

type ServicesSectionProps = {
  title: string;
  subtitle?: string;
  services: Service[];
  onServiceClick?: (service: Service) => void;
};

const ServicesSection = ({
  title,
  subtitle,
  services,
  onServiceClick,
}: ServicesSectionProps) => {
  return (
    <section className="bg-gray-50 pt-12 pb-14">
      <div className="max-w-7xl mx-auto px-6">

        {/* Titre */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={(s) => onServiceClick?.(s)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
