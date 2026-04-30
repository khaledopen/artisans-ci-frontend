// src/components/PaiementWave.tsx

import { useState } from "react";
import { 
  CreditCard, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Smartphone,
  QrCode,
  ArrowRight,
  Clock
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

  const handleInitierPaiement = () => {
    setStep("qr");
  };

  const handleSimulerPaiement = () => {
    setStep("processing");
    
    // Simulation du traitement du paiement
    setTimeout(() => {
      // Simuler un succès (90% de chance)
      const isSuccess = Math.random() > 0.1;
      
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

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <CreditCard size={28} className="text-white" />
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
            <span className="text-gray-800">{description}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Téléphone Wave</span>
            <span className="text-gray-800">{telephone}</span>
          </div>
        </div>

        {/* Étapes */}
        {step === "form" && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Smartphone className="text-blue-600" size={20} />
                <p className="text-sm text-blue-800 font-medium">Paiement via Wave</p>
              </div>
              <p className="text-xs text-blue-600">
                Vous allez être redirigé vers Wave pour effectuer le paiement.
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
              <div className="w-48 h-48 bg-white rounded-xl flex flex-col items-center justify-center mx-auto shadow-md">
                <QrCode size={80} className="text-gray-800" />
                <p className="text-xs text-gray-500 mt-2">Code QR Wave</p>
              </div>
            </div>
            
            <div className="p-3 bg-amber-50 rounded-xl">
              <p className="text-sm text-amber-700 flex items-center justify-center gap-2">
                <Clock size={16} />
                Scannez le code QR avec l'application Wave
              </p>
            </div>
            
            <button
              onClick={handleSimulerPaiement}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              J'ai payé, vérifier
            </button>
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
              <p className="text-sm text-green-700">
                ✓ Transaction effectuée avec succès
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