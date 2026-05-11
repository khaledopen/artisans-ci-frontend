import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArtisanCard from "../components/ArtisanCard";
import { getArtisans, filterArtisans } from "../api/artisan.api";
import type { Artisan, FilterArtisansData } from "../types/artisan";
import { Loader2, Navigation, MapPin, RefreshCw, Target, Filter, X } from "lucide-react";

// Fonction pour calculer la distance entre deux coordonnées (formule Haversine)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Cache pour éviter de refaire les mêmes requêtes de geocoding
const geocodingCache: Record<string, { lat: number; lng: number } | null> = {};

// Fonction utilitaire pour attendre (delay)
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour convertir une adresse en coordonnées (geocoding) avec cache et respect des limites
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  if (!address) return null;
  
  // Vérifier le cache d'abord
  if (geocodingCache[address] !== undefined) {
    return geocodingCache[address];
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'Accept-Language': 'fr'
        }
      }
    );

    if (res.status === 429) {
      console.warn("Rate limit atteint pour Nominatim, attente...");
      return null;
    }

    const data = await res.json();
    let result = null;
    
    if (data && data.length > 0) {
      result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    
    // Mettre en cache (même si null pour ne pas retenter inutilement)
    geocodingCache[address] = result;
    return result;
  } catch (error) {
    console.error("Erreur geocoding:", error);
    return null;
  }
};

// Liste des métiers
const metiersList = [
  { id: 1, nom: "Plomberie" },
  { id: 2, nom: "Électricité" },
  { id: 3, nom: "Serrurerie" },
  { id: 4, nom: "Peinture" },
  { id: 5, nom: "Menuiserie" },
  { id: 6, nom: "Maçonnerie" },
  { id: 7, nom: "Chauffage" },
  { id: 8, nom: "Rénovation" },
  { id: 9, nom: "Jardinage" },
  { id: 10, nom: "Nettoyage" },
];

const Artisans = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  
  const serviceParam = params.get("service") || "";
  const searchParam = params.get("search") || "";

  const [search, setSearch] = useState(searchParam);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filtres
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterArtisansData>({
    metierId: "",
    commune: "",
  });
  const [isFiltering, setIsFiltering] = useState(false);
  
  // Géolocalisation utilisateur
  const [userLocation, setUserLocation] = useState<{ 
    lat: number; 
    lng: number; 
    address: string;
    loading: boolean;
  } | null>(null);
  
  const [sortByDistance, setSortByDistance] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  // Coordonnées des artisans (après géocodage)
  const [artisansCoords, setArtisansCoords] = useState<Map<number, { lat: number; lng: number }>>(new Map());

  // Récupérer la position de l'utilisateur
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setGettingLocation(true);
    setUserLocation(prev => prev ? { ...prev, loading: true } : null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "";
          const suburb = data.address?.suburb || data.address?.neighbourhood || "";
          const fullAddress = `${suburb ? suburb + ", " : ""}${city}`.trim() || "Position actuelle";
          
          setUserLocation({ lat, lng, address: fullAddress, loading: false });
          setError("");
        } catch {
          setUserLocation({ lat, lng, address: "Position actuelle", loading: false });
        }
        setGettingLocation(false);
      },
      () => {
        setError("📍 Activez votre localisation pour voir les artisans proches de vous");
        setGettingLocation(false);
        setSortByDistance(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Surveillance position en temps réel
  useEffect(() => {
    let watchId: number | null = null;
    let lastGeocodeTime = 0;
    
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Ne mettre à jour l'adresse textuelle que toutes les 30 secondes pour éviter le spam API
          const now = Date.now();
          if (now - lastGeocodeTime < 30000) {
            setUserLocation(prev => ({ ...prev, lat, lng, loading: false } as any));
            return;
          }

          try {
            lastGeocodeTime = now;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || "";
            const suburb = data.address?.suburb || data.address?.neighbourhood || "";
            const fullAddress = `${suburb ? suburb + ", " : ""}${city}`.trim() || "Position actuelle";
            
            setUserLocation(prev => ({ lat, lng, address: fullAddress, loading: false }));
          } catch {
            setUserLocation(prev => ({ lat, lng, address: prev?.address || "Position actuelle", loading: false }));
          }
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }
    
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId); };
  }, []);

  // Récupérer les artisans depuis l'API
  const fetchArtisans = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await getArtisans(0, 100);
      setArtisans(data.content || []);
      
      const coordsMap = new Map();
      const artisansToFetch = (data.content || []).filter((a: any) => 
        (a.localisation || a.commune) && !geocodingCache[`${a.localisation || ""} ${a.commune || ""}`.trim()]
      );

      // Traiter un artisan à la fois avec un délai si pas en cache
      for (const artisan of (data.content || [])) {
        const artisanAddress = `${artisan.localisation || ""} ${artisan.commune || ""}`.trim();
        if (artisanAddress) {
          const isNew = !geocodingCache[artisanAddress];
          const coords = await geocodeAddress(artisanAddress);
          if (coords) coordsMap.set(artisan.id, coords);
          
          // Si c'était une nouvelle requête, on attend 1s pour respecter la policy Nominatim
          if (isNew && artisansToFetch.length > 1) {
            await sleep(1000);
          }
        }
      }
      setArtisansCoords(coordsMap);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des artisans");
    } finally {
      setLoading(false);
    }
  };

  // Appliquer les filtres
  const applyFilters = async () => {
    setIsFiltering(true);
    try {
      // Nettoyage des filtres : ne pas envoyer de chaînes vides
      const cleanFilters: FilterArtisansData = {};
      if (filters.metierId) cleanFilters.metierId = Number(filters.metierId);
      if (filters.commune?.trim()) cleanFilters.commune = filters.commune.trim();

      const hasFilters = Object.keys(cleanFilters).length > 0;
      let data;
      
      if (hasFilters) {
        console.log("📡 Filtrage avec:", cleanFilters);
        const response = await filterArtisans(cleanFilters);
        // On gère les deux cas : soit une liste directe [], soit un objet { content: [] }
        data = Array.isArray(response) ? response : (response as any).content || [];
      } else {
        const freshData = await getArtisans(0, 100);
        data = freshData.content || [];
      }
      
      setArtisans(data);
      
      // Re-géocoder les artisans
      const coordsMap = new Map();
      for (const artisan of data) {
        const artisanAddress = `${artisan.localisation || ""} ${artisan.commune || ""}`.trim();
        if (artisanAddress) {
          const isNew = !geocodingCache[artisanAddress];
          const coords = await geocodeAddress(artisanAddress);
          if (coords) coordsMap.set(artisan.id, coords);
          
          if (isNew) await sleep(1000);
        }
      }
      setArtisansCoords(coordsMap);
      
    } catch (err) {
      console.error("Erreur filtrage", err);
      setError("Erreur lors du filtrage");
    } finally {
      setIsFiltering(false);
    }
  };

  // Réinitialiser les filtres
  const resetFilters = async () => {
    setFilters({ metierId: "", commune: "" });
    setShowFilters(false);
    await fetchArtisans();
  };

  useEffect(() => {
    fetchArtisans();
    getUserLocation();
  }, []);

  // Filtrer et trier les artisans
  const filteredAndSortedArtisans = useMemo(() => {
    let filtered = artisans.filter((a) =>
      `${a.nom} ${a.prenom} ${a.metier?.nom || ""} ${a.localisation || ""} ${a.commune || ""}`
        .toLowerCase()
        .includes((search || serviceParam).toLowerCase())
    );

    let artisansWithDistance = filtered.map(artisan => {
      let distance = Infinity;
      const artisanCoord = artisansCoords.get(artisan.id);
      if (userLocation && artisanCoord && !userLocation.loading) {
        distance = calculateDistance(userLocation.lat, userLocation.lng, artisanCoord.lat, artisanCoord.lng);
      }
      return { ...artisan, distance };
    });

    if (sortByDistance && userLocation && !userLocation.loading) {
      artisansWithDistance.sort((a, b) => a.distance - b.distance);
    }

    return artisansWithDistance;
  }, [artisans, search, serviceParam, userLocation, sortByDistance, artisansCoords]);

  const getDistanceText = (distance: number) => {
    if (distance === Infinity) return "Distance inconnue";
    if (distance < 1) return `${Math.round(distance * 1000)} m`;
    return `${distance.toFixed(1)} km`;
  };

  const hasActiveFilters = filters.metierId || filters.commune;

  return (
    <>
      <Navbar
        brand="ArtisanCI"
        links={[
          { label: "Accueil", path: "/" },
          { label: "Services", targetId: "services" },
          { label: "Comment ça marche", targetId: "how-it-works" },
          { label: "Contact", targetId: "contact" },
        ]}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 pt-12 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Nos Artisans
            </h1>
            <p className="text-blue-100 text-lg">
              Des professionnels qualifiés près de chez vous
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Carte de localisation utilisateur */}
          <div className="mb-8 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Target size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Votre position actuelle</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" />
                    {userLocation?.loading || gettingLocation ? (
                      <div className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin text-blue-600" />
                        <span className="text-gray-500 text-sm">Localisation en cours...</span>
                      </div>
                    ) : userLocation ? (
                      <span className="font-medium text-gray-800">{userLocation.address}</span>
                    ) : (
                      <span className="text-gray-500 text-sm">Localisation non disponible</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <Filter size={14} />
                  Filtrer
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </button>
                
                <button
                  onClick={getUserLocation}
                  disabled={gettingLocation}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <RefreshCw size={14} className={gettingLocation ? "animate-spin" : ""} />
                  Actualiser
                </button>
                
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sortByDistance}
                    onChange={(e) => setSortByDistance(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                    disabled={!userLocation}
                  />
                  Trier par proximité
                </label>
              </div>
            </div>
            
            {/* Panneau de filtres */}
            {showFilters && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs text-gray-500 mb-1">Métier</label>
                    <select
                      value={filters.metierId}
                      onChange={(e) => setFilters({ ...filters, metierId: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 outline-none"
                    >
                      <option value="">Tous les métiers</option>
                      {metiersList.map((m) => (
                        <option key={m.id} value={m.id}>{m.nom}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs text-gray-500 mb-1">Commune</label>
                    <input
                      type="text"
                      placeholder="Ex: Cocody, Plateau..."
                      value={filters.commune}
                      onChange={(e) => setFilters({ ...filters, commune: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 outline-none"
                    />
                  </div>
                  
                  <button
                    onClick={applyFilters}
                    disabled={isFiltering}
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isFiltering ? "Filtrage..." : "Appliquer"}
                  </button>
                  
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition flex items-center gap-2"
                    >
                      <X size={16} />
                      Réinitialiser
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {userLocation && !userLocation.loading && sortByDistance && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-green-600">
                <Navigation size={12} />
                Les artisans sont triés du plus proche au plus éloigné de votre position
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <p className="text-amber-600 mb-3 text-sm">{error}</p>
              <button
                onClick={getUserLocation}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Activer la localisation
              </button>
            </div>
          )}

          {/* Barre de recherche */}
          <div className="mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, métier ou ville..."
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition shadow-sm"
            />
          </div>

          {loading || isFiltering ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
          ) : (
            <>
              {filteredAndSortedArtisans.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">Aucun artisan trouvé</p>
                  <p className="text-gray-400 text-sm mt-2">Essayez d'autres mots-clés ou filtres</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <p className="text-sm text-gray-500">
                      {filteredAndSortedArtisans.length} artisan(s) trouvé(s)
                    </p>
                    {hasActiveFilters && (
                      <p className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        Filtres actifs
                      </p>
                    )}
                    {userLocation && sortByDistance && (
                      <p className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        Trié par proximité
                      </p>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedArtisans.map((artisan) => (
                      <div
                        key={artisan.id}
                        onClick={() => navigate(`/artisan/${artisan.id}`)}
                        className="cursor-pointer transition-transform hover:scale-[1.02]"
                      >
                        <ArtisanCard 
                          artisan={artisan} 
                          distance={userLocation && !userLocation.loading ? artisan.distance : undefined}
                          distanceText={userLocation && !userLocation.loading && artisan.distance !== Infinity 
                            ? getDistanceText(artisan.distance) 
                            : undefined}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Artisans;