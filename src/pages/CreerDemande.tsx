import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createDemandeWithPhoto } from "../api/demande.api";
import { Loader2, AlertCircle, Calendar, FileText, Upload, X, Info, MapPin } from "lucide-react";

const CreerDemande = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Formulaire
  const [form, setForm] = useState({
    date_rendez_vous: "",
    description_travail: "",
  });
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Récupérer les infos du client connecté
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const clientId = user.id;
  const clientLocalisation = user.localisation || "Abidjan";
  const clientCommune = user.commune || "";

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

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!form.date_rendez_vous) {
      setError("Veuillez sélectionner une date");
      return;
    }
    if (!form.description_travail) {
      setError("Veuillez décrire les travaux");
      return;
    }

    if (!clientCommune) {
      console.warn("⚠️ Attention: Le client n'a pas de commune définie");
    }

    setLoading(true);

    try {
      // ✅ AJOUT DE LA COMMUNE dans la demande
      const demandeData = {
        date_rendez_vous: form.date_rendez_vous,
        description_travail: form.description_travail,
        clientId: clientId,
        commune: clientCommune,  // ← AJOUTÉ : commune du client
        localisation: clientLocalisation,  // ← AJOUTÉ : ville du client
      };

      console.log("📤 Envoi de la demande avec localisation:", {
        ...demandeData,
        commune: clientCommune,
        localisation: clientLocalisation
      });
      
      await createDemandeWithPhoto(demandeData, photo || undefined);
      
      setSuccess(`Demande envoyée avec succès ! Un artisan de ${clientCommune || clientLocalisation} va la traiter.`);
      
      setTimeout(() => {
        navigate("/dashboard-client");
      }, 2000);
      
    } catch (err: any) {
      console.error("Erreur détaillée:", err);
      console.error("Réponse:", err.response?.data);
      setError(err.response?.data?.message || "Erreur lors de l'envoi de la demande");
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-800">Nouvelle demande de service</h1>
            <p className="text-gray-500 mt-1">
              Remplissez le formulaire ci-dessous. Un artisan proche de votre localisation sera automatiquement assigné.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
              <h2 className="text-white text-xl font-semibold">Informations de la demande</h2>
              <p className="text-blue-100 text-sm mt-1">Tous les champs sont obligatoires</p>
            </div>

            <div className="p-6">
              
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                  {success}
                </div>
              )}

              {/* Information localisation avec la commune */}
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <MapPin size={16} />
                  Votre localisation : <strong>{clientCommune ? `${clientCommune}, ` : ""}{clientLocalisation}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Un artisan de <strong>{clientCommune || clientLocalisation}</strong> recevra votre demande
                </p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar size={16} /> Date du rendez-vous *
                  </label>
                  <input
                    type="date"
                    value={form.date_rendez_vous}
                    onChange={(e) => setForm({ ...form, date_rendez_vous: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FileText size={16} /> Description des travaux *
                  </label>
                  <textarea
                    value={form.description_travail}
                    onChange={(e) => setForm({ ...form, description_travail: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
                    placeholder="Décrivez précisément les travaux à réaliser (ex: fuite d'eau dans la cuisine, installation d'un chauffe-eau, etc.)"
                    required
                  />
                </div>

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
                  <p className="text-xs text-gray-400 mt-1">
                    Ajoutez une photo pour illustrer votre demande (format JPG, PNG)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer la demande"
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-start gap-3">
                  <Info size={18} className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Comment ça marche ?</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Votre demande sera automatiquement envoyée aux artisans disponibles dans votre commune.
                      Vous serez notifié dès qu'un artisan accepte votre demande.
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