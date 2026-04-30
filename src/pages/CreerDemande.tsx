import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createDemandeWithPhoto } from "../api/demande.api";
import PaiementWave from "../components/PaiementWave";
import { 
  Loader2, 
  AlertCircle, 
  Calendar, 
  FileText, 
  Upload, 
  X, 
  Info, 
  MapPin, 
  User,
  CreditCard
} from "lucide-react";

const CreerDemande = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  const [form, setForm] = useState({
    date_rendez_vous: "",
    description_travail: "",
  });
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedArtisan, setSelectedArtisan] = useState<{ id: number; name: string } | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const clientId = user.id;
  const clientLocalisation = user.localisation || "Abidjan";
  const clientCommune = user.commune || "";
  const clientTelephone = user.telephone || "0707070707";

  // Récupérer l'artisan sélectionné
  useEffect(() => {
    const artisanId = localStorage.getItem("selectedArtisanId");
    const artisanName = localStorage.getItem("selectedArtisanName");
    
    if (artisanId && artisanName) {
      setSelectedArtisan({
        id: parseInt(artisanId),
        name: artisanName,
      });
    }
  }, []);

  // Gérer la sélection de photo
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Supprimer la photo
  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  // Valider le formulaire
  const validateForm = () => {
    if (!form.date_rendez_vous) {
      setError("Veuillez sélectionner une date");
      return false;
    }
    if (!form.description_travail) {
      setError("Veuillez décrire les travaux");
      return false;
    }
    if (!selectedArtisan) {
      setError("Aucun artisan sélectionné");
      return false;
    }
    return true;
  };

  // Créer la demande
  const handleCreateDemande = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const demandeData = {
        date_rendez_vous: form.date_rendez_vous,
        description_travail: form.description_travail,
        clientId: clientId,
        artisanId: selectedArtisan.id,
        commune: clientCommune,
        localisation: clientLocalisation,
        telephone: clientTelephone,
      };
      
      console.log("📤 Envoi de la demande:", demandeData);
      await createDemandeWithPhoto(demandeData, photo || undefined);
      
      localStorage.removeItem("selectedArtisanId");
      localStorage.removeItem("selectedArtisanName");
      
      setSuccess(`Demande envoyée avec succès à ${selectedArtisan.name} !`);
      
      setTimeout(() => {
        navigate("/dashboard-client");
      }, 2000);
      
    } catch (err: any) {
      console.error("Erreur:", err);
      setError(err.response?.data?.message || "Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  // Paiement réussi
  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    handleCreateDemande();
  };

  // Si le paiement est en cours, afficher le composant de paiement
  if (showPayment && !paymentCompleted) {
    return (
      <>
        <Navbar brand="ArtisanCI" links={[]} />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-md mx-auto px-6">
            <PaiementWave
              montant={5000}
              description={`Travaux: ${form.description_travail.substring(0, 50)}...`}
              telephone={clientTelephone}
              onSuccess={handlePaymentSuccess}
              onCancel={() => setShowPayment(false)}
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }

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

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-6">
          
          <div className="mb-8">
            <button
              onClick={() => navigate("/artisans")}
              className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-2"
            >
              ← Retour aux artisans
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Nouvelle demande de service</h1>
            <p className="text-gray-500 mt-1">Remplissez le formulaire ci-dessous.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
              <h2 className="text-white text-xl font-semibold">Informations de la demande</h2>
              <p className="text-blue-100 text-sm mt-1">Tous les champs sont obligatoires</p>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                  {success}
                </div>
              )}

              {/* Artisan sélectionné */}
              {selectedArtisan && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <User size={16} />
                    Artisan sélectionné : <strong>{selectedArtisan.name}</strong>
                  </p>
                </div>
              )}

              {/* Localisation */}
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <MapPin size={16} />
                  Votre localisation : <strong>{clientCommune ? `${clientCommune}, ` : ""}{clientLocalisation}</strong>
                </p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                {/* Date du rendez-vous */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar size={16} /> Date du rendez-vous *
                  </label>
                  <input
                    type="date"
                    value={form.date_rendez_vous}
                    onChange={(e) => setForm({ ...form, date_rendez_vous: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 outline-none transition"
                    required
                  />
                </div>

                {/* Description des travaux */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FileText size={16} /> Description des travaux *
                  </label>
                  <textarea
                    value={form.description_travail}
                    onChange={(e) => setForm({ ...form, description_travail: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 outline-none transition resize-none"
                    placeholder="Décrivez précisément les travaux à réaliser..."
                    required
                  />
                </div>

                {/* Photo optionnelle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Upload size={16} /> Photo (optionnelle)
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl transition flex items-center gap-2">
                      <Upload size={16} />
                      Choisir une photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                    {photo && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <X size={16} /> Supprimer
                      </button>
                    )}
                  </div>
                  {photoPreview && (
                    <div className="mt-3">
                      <img src={photoPreview} alt="Aperçu" className="w-32 h-32 object-cover rounded-xl border" />
                    </div>
                  )}
                </div>

                {/* Bouton Payer */}
                <button
                  type="button"
                  onClick={() => setShowPayment(true)}
                  disabled={loading || !selectedArtisan}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition disabled:opacity-70 flex items-center justify-center gap-2 mt-6"
                >
                  <CreditCard size={18} />
                  Payer 5 000 FCFA et envoyer la demande
                </button>
              </form>

              {/* Information supplémentaire */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Comment ça marche ?</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Effectuez le paiement sécurisé via Wave. Une fois payé, votre demande sera immédiatement envoyée à l'artisan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CreerDemande;