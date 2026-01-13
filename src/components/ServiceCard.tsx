import type { Service } from "../types/service";



type ServiceCardProps = {
  service: Service;
  onClick?: (service: Service) => void;
};

const ServiceCard = ({ service, onClick }: ServiceCardProps) => {
  return (
    <div
      onClick={() => onClick?.(service)}
      className="cursor-pointer bg-white border rounded-2xl p-6 flex flex-col items-center text-center
                 hover:shadow-lg transition-shadow"
    >
      {/* Icône */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: service.color }}
      >
        {service.icon}
      </div>

      {/* Nom */}
      <h3 className="font-semibold text-gray-900 mb-1">
        {service.name}
      </h3>

      {/* Nombre d’artisans */}
      <p className="text-sm text-gray-500">
        {service.artisansCount} artisans
      </p>
    </div>
  );
};

export default ServiceCard;
