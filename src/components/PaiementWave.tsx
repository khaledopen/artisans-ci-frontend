// src/components/PaiementWave.tsx

import { useState } from "react";
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Smartphone,
  QrCode,
  ArrowRight,
  Clock,
  AlertCircle
} from "lucide-react";

interface PaiementWaveProps {
  montant: number;
  description: string;
  telephone: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

type PaymentStep = "form" | "qr" | "processing" | "success" | "error";

const PaiementWave = ({ montant, description, telephone, onSuccess, onCancel }: PaiementWaveProps) => {
  const [step, setStep] = useState<PaymentStep>("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const handleInitierPaiement = () => {
    setStep("qr");
    // Générer un ID de transaction simulé
    setTransactionId(`WAVE_${Date.now()}_${Math.floor(Math.random() * 10000)}`);
  };

  const handleSimulerPaiement = () => {
    setStep("processing");
    
    // Simulation du traitement du paiement
    setTimeout(() => {
      // Simuler un succès (95% de chance)
      const isSuccess = Math.random() > 0.05;
      
      if (isSuccess) {
        setStep("success");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setErrorMessage("Le paiement a échoué. Veuillez réessayer.");
        setStep("error");
      }
    }, 2000);
  };

  const handleRetry = () => {
    setStep("form");
    setErrorMessage("");
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA';
  };

  // Générer un QR code simulé (pour la démo)
  const getQRCodeDataURL = () => {
    // Simule un QR code avec les infos de paiement
    const qrData = `wave://pay?amount=${montant}&phone=${telephone}&ref=${transactionId}`;
    // Retourne une URL de données simulée (carré gris avec texte)
    return qrData;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Smartphone size={28} className="text-white" />
        </div>
        <h2 className="text-white text-xl font-bold">Paiement Wave</h2>
        <p className="text-green-100 text-sm mt-1">Paiement sécurisé par mobile money</p>
      </div>

      <div className="p-6">
        {/* Résumé de la commande */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Montant</span>
            <span className="font-bold text-lg text-gray-800">{formatMontant(montant)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Description</span>
            <span className="text-gray-800 text-sm truncate max-w-[200px]">{description}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Téléphone Wave</span>
            <span className="text-gray-800 font-mono">{telephone}</span>
          </div>
        </div>

        {/* Contenu selon l'étape */}
        {step === "form" && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="text-blue-600" size={20} />
                <p className="text-sm text-blue-800 font-medium">Paiement via Wave</p>
              </div>
              <p className="text-xs text-blue-600">
                Vous allez scanner un QR code avec l'application Wave pour effectuer le paiement.
                Après validation, votre demande sera créée automatiquement.
              </p>
            </div>
            
            <button
              onClick={handleInitierPaiement}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              Payer {formatMontant(montant)}
              <ArrowRight size={16} />
            </button>
            
            {onCancel && (
              <button
                onClick={onCancel}
                className="w-full border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            )}
          </div>
        )}

        {step === "qr" && (
          <div className="text-center space-y-4">
            <div className="bg-gray-100 rounded-xl p-6">
              <div className="w-48 h-48 bg-white rounded-xl flex flex-col items-center justify-center mx-auto shadow-md border-2 border-green-200">
                {/* QR Code simulé */}
                <div className="bg-black p-2 rounded-lg">
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className={`w-3 h-3 ${Math.random() > 0.5 ? 'bg-white' : 'bg-black'} rounded-sm`} />
                    ))}
                  </div>
                </div>
                <QrCode size={40} className="text-gray-800 mt-2" />
                <p className="text-[10px] text-gray-400 mt-1 font-mono">{transactionId.slice(-12)}</p>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Scannez ce code avec l'application Wave
              </p>
            </div>
            
            <div className="p-3 bg-amber-50 rounded-xl">
              <p className="text-sm text-amber-700 flex items-center justify-center gap-2">
                <Clock size={16} />
                Le code expire dans 5 minutes
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleSimulerPaiement}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                J'ai payé, vérifier
              </button>
              <button
                onClick={() => setStep("form")}
                className="px-4 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition"
              >
                Retour
              </button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="text-center py-8 space-y-4">
            <Loader2 size={48} className="animate-spin text-green-600 mx-auto" />
            <p className="text-gray-600">Vérification du paiement en cours...</p>
            <p className="text-xs text-gray-400">Merci de patienter</p>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Paiement réussi !</h3>
            <p className="text-gray-600">
              Votre paiement de {formatMontant(montant)} a été confirmé.
            </p>
            <div className="p-3 bg-green-50 rounded-xl">
              <p className="text-sm text-green-700 flex items-center justify-center gap-2">
                <CheckCircle size={16} />
                Transaction #{transactionId.slice(-10)} effectuée
              </p>
            </div>
            <p className="text-xs text-gray-400">Redirection en cours...</p>
          </div>
        )}

        {step === "error" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle size={40} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Paiement échoué</h3>
            <p className="text-red-600 text-sm">{errorMessage}</p>
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                Réessayer
              </button>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sécurité */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <span>🔒</span> Paiement sécurisé par Wave
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaiementWave;