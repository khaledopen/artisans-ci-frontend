import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../api/auth.api";
import { updateArtisanProfile } from "../api/artisan.api";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const ProfileArtisan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [form, setForm] = useState({
    id: 0,
    nom: "",
    prenom: "",
    email: "",
    localisation: "",
    commune: "",
    photoprofil: "",
    metier: { id: 0, nom: "" }
  });

  // Charger les infos de l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const user = await getMe();
        setForm({
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          localisation: user.localisation || "",
          commune: (user as any).commune || "",
          photoprofil: user.photoprofil || "",
          metier: (user as any).metier || { id: 0, nom: "" }
        });
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const updated = await updateArtisanProfile(form);
      setSuccess("Profil mis à jour avec succès !");
      // Mettre à jour localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        user.nom = updated.nom;
        user.prenom = updated.prenom;
        user.email = updated.email;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Modifier mon profil</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Métier</label>
            <input
              type="text"
              value={form.metier.nom}
              disabled
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">Le métier ne peut pas être modifié</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
            <input
              type="text"
              value={form.localisation}
              onChange={(e) => setForm({ ...form, localisation: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
            <input
              type="text"
              value={form.commune}
              onChange={(e) => setForm({ ...form, commune: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil (URL)</label>
            <input
              type="text"
              value={form.photoprofil}
              onChange={(e) => setForm({ ...form, photoprofil: e.target.value })}
              placeholder="https://exemple.com/photo.jpg"
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-400 outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileArtisan;