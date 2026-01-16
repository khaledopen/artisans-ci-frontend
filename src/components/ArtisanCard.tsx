import type { Artisan } from "../types/artisan";
import { Star, MapPin, Phone, Mail, BadgeCheck } from "lucide-react";

type ArtisanCardProps = {
  artisan: Artisan;
};

const ArtisanCard = ({ artisan }: ArtisanCardProps) => {
  return (
    <div className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-shadow">

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={artisan.avatar}
          alt={artisan.name}
          className="w-16 h-16 rounded-full object-cover"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{artisan.name}</h3>
            {artisan.verified && (
              <BadgeCheck className="text-blue-600 w-4 h-4" />
            )}
          </div>
          <p className="text-gray-600 text-sm">{artisan.role}</p>

          <div className="flex items-center gap-2 text-sm mt-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">{artisan.rating}</span>
            <span className="text-gray-500">
              ({artisan.reviews} avis)
            </span>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <MapPin className="w-4 h-4" />
            {artisan.city}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">
        {artisan.description}
      </p>

      {/* Infos */}
      <div className="flex flex-wrap gap-2 text-sm mb-4">
        <span className="bg-gray-100 px-3 py-1 rounded-full">
          {artisan.experience} ans d'expérience
        </span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">
          {artisan.pricePerHour}€/h
        </span>
        {artisan.verified && (
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
            Vérifié
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
          <Phone className="w-4 h-4" />
          Contacter
        </button>
        <button className="flex-1 border py-2 rounded-lg flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          Demander un devis
        </button>
      </div>
    </div>
  );
};

export default ArtisanCard;
