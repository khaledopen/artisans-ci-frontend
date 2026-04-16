import type { Artisan } from "../types/artisan";
import { Star, MapPin, Phone, Mail, BadgeCheck, Navigation, Briefcase, User } from "lucide-react";

type ArtisanCardProps = {
  artisan: Artisan;
  distance?: number;
  distanceText?: string;
};

const ArtisanCard = ({ artisan, distance, distanceText }: ArtisanCardProps) => {
  // Nom complet
  const fullName = `${artisan.prenom || ""} ${artisan.nom || ""}`.trim() || "Artisan";
  
  // Initiales pour l'avatar de secours
  const getInitials = () => {
    const first = artisan.prenom?.charAt(0) || "";
    const last = artisan.nom?.charAt(0) || "";
    return `${first}${last}`.toUpperCase();
  };

  // Note par défaut (si pas de note, afficher "Nouveau")
  const hasRating = artisan.note && artisan.note > 0;
  const rating = artisan.note || 0;
  const reviews = artisan.avis || 0;

  // Localisation
  const location = artisan.commune 
    ? `${artisan.commune}, ${artisan.localisation || "Abidjan"}`
    : artisan.localisation || "Abidjan";

  return (
    <div className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        {artisan.photoprofil ? (
          <img
            src={artisan.photoprofil}
            alt={fullName}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
            {getInitials()}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg text-gray-800">{fullName}</h3>
            {artisan.verified && (
              <BadgeCheck className="text-blue-600 w-4 h-4" />
            )}
          </div>
          
          <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
            <Briefcase size={12} />
            {artisan.metier?.nom || "Artisan"}
          </p>

          {/* Note et avis */}
          <div className="flex items-center gap-2 text-sm mt-2">
            {hasRating ? (
              <>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-gray-700">{rating.toFixed(1)}</span>
                <span className="text-gray-400">({reviews} avis)</span>
              </>
            ) : (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Nouveau</span>
            )}
          </div>

          {/* Localisation */}
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <MapPin className="w-3 h-3" />
            <span>{location}</span>
          </div>

          {/* Distance (si fournie) */}
          {distanceText && (
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <Navigation className="w-3 h-3" />
              <span>À {distanceText} de vous</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {artisan.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {artisan.description}
        </p>
      )}

      {/* Infos complémentaires */}
      <div className="flex flex-wrap gap-2 text-sm mb-4">
        {artisan.experience && (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
            📅 {artisan.experience} ans d'exp.
          </span>
        )}
        {artisan.pricePerHour && (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
            💰 {artisan.pricePerHour}€/h
          </span>
        )}
        {artisan.verified && (
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
            ✓ Vérifié
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition text-sm font-medium">
          <Phone className="w-4 h-4" />
          Contacter
        </button>
        <button className="flex-1 border border-gray-300 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600 transition text-sm font-medium text-gray-700">
          <Mail className="w-4 h-4" />
          Devis
        </button>
      </div>
    </div>
  );
};

export default ArtisanCard;