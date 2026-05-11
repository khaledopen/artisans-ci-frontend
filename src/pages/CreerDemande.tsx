// src/pages/CreerDemande.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createDemandeWithPhoto } from "../api/demande.api";
import { updateClientProfile } from "../api/client.api";
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
  Image,
  Phone
} from "lucide-react";

const CreerDemande = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const clientId = user.id;
  const clientLocalisation = user.localisation || "Abidjan";
  const clientCommune = user.commune || "";
  const clientTelephone = user.telephone || "0700000000";

  const [form, setForm] = useState({
    date_rendez_vous: "",
    heure: "",
    description_travail: "",
    client_numero: user.telephone || user.clientNumero || "",
  });
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedArtisan, setSelectedArtisan] = useState<{ id: number; name: string } | null>(null);

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
      if (file.size > 5 * 1024 * 1024) {
        setError("La photo ne doit pas dépasser 5 Mo");
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  // Créer la demande après paiement
  const handleCreateDemande = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Mettre à jour le numéro dans le profil si nécessaire
      if (form.client_numero !== user.numero && form.client_numero !== user.telephone) {
        console.log("🔄 Mise à jour du profil client avec le numéro:", form.client_numero);
        try {
          const updatedUser = await updateClientProfile({
            ...user,
            id: clientId, // S'assurer que l'ID est bien là
            numero: form.client_numero
          });
          console.log("✅ Profil mis à jour:", updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (profileErr) {
          console.error("⚠️ Échec mise à jour profil (non bloquant):", profileErr);
        }
      }

      const demandeData = {
        date_rendez_vous: form.date_rendez_vous,
        heure: form.heure || undefined,
        description_travail: form.description_travail,
        clientId: clientId,
        artisanId: selectedArtisan?.id || null,
      };

      console.log("📤 Envoi final de la demande:", demandeData);
      if (photo) console.log("📸 Avec photo:", photo.name, photo.size, "bytes");
      
      const response = await createDemandeWithPhoto(demandeData, photo || undefined);
      console.log("🚀 Demande créée avec succès, réponse:", response);
      
      localStorage.removeItem("selectedArtisanId");
      localStorage.removeItem("selectedArtisanName");
      
      setSuccess("Demande créée avec succès !");
      setPaymentCompleted(true);
      
      setTimeout(() => {
        navigate("/dashboard-client");
      }, 2000);
      
    } catch (err: any) {
      console.error("Erreur:", err);
      setError(err.response?.data?.message || "Erreur lors de la création");
      setPaymentCompleted(false);
    } finally {
      setLoading(false);
    }
  };

  // Valider le formulaire avant paiement
  const validateForm = () => {
    if (!form.date_rendez_vous) {
      setError("Veuillez sélectionner une date");
      return false;
    }
    if (!form.description_travail) {
      setError("Veuillez décrire les travaux");
      return false;
    }
    if (form.description_travail.length < 10) {
      setError("La description doit contenir au moins 10 caractères");
      return false;
    }
    return true;
  };

  const handlePaymentSuccess = () => {
    handleCreateDemande();
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) return;
    setShowPayment(true);
  };

  // Affichage du paiement
  if (showPayment && !paymentCompleted) {
    return (
      <>
        <Navbar brand="ArtisanCI" links={[]} />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-md mx-auto px-6">
            <button
              onClick={() => setShowPayment(false)}
              className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-2"
            >
              ← Retour au formulaire
            </button>
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
          { label: "Trouver un artisan", path: "/artisans" },
          { label: "Mes demandes", path: "/dashboard-client" },
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
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 text-center">
              <h2 className="text-white text-xl font-semibold">Informations de la demande</h2>
              <p className="text-blue-100 text-sm mt-1">Tous les champs sont obligatoires</p>
            </div>

            <div className="p-6">
              {/* Messages */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                  ✅ {success}
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

              {/* Localisation du client */}
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <MapPin size={16} />
                  Votre localisation : <strong>{clientCommune ? `${clientCommune}, ` : ""}{clientLocalisation}</strong>
                </p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar size={16} /> Date du rendez-vous *
                  </label>
                  <input
                    type="date"
                    value={form.date_rendez_vous}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm({ ...form, date_rendez_vous: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FileText size={16} /> Description des travaux *
                  </label>
                  <textarea
                    value={form.description_travail}
                    onChange={(e) => setForm({ ...form, description_travail: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
                    placeholder="Décrivez précisément les travaux à réaliser (minimum 10 caractères)..."
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {form.description_travail.length}/500 caractères
                  </p>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Phone size={16} /> Votre numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    value={form.client_numero}
                    onChange={(e) => setForm({ ...form, client_numero: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    placeholder="Ex: 0707070707"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Ce numéro permettra à l'artisan de vous contacter.
                  </p>
                </div>

                {/* Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Image size={16} /> Photo (optionnelle)
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
                  <p className="text-xs text-gray-400 mt-1">Format JPG, PNG (max 5 Mo)</p>
                </div>

                {/* Montant à payer */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Frais de service</span>
                    <span className="font-bold text-gray-800">5 000 FCFA</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600">Total à payer</span>
                    <span className="font-bold text-lg text-blue-600">5 000 FCFA</span>
                  </div>
                </div>

                {/* Bouton Payer */}
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      💳 Payer 5 000 FCFA
                    </>
                  )}
                </button>
              </form>

              {/* Information */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Comment ça marche ?</p>
                    <p className="text-xs text-gray-500 mt-1">
                      1. Remplissez le formulaire ci-dessus<br />
                      2. Effectuez le paiement sécurisé de 5 000 FCFA via Wave<br />
                      3. Votre demande sera immédiatement envoyée à l'artisan<br />
                      4. L'artisan de votre commune pourra accepter votre demande
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