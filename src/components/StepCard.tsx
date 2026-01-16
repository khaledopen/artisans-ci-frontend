import type { Step } from "../types/step";

type StepCardProps = {
  step: Step;
  index: number;
};

const StepCard = ({ step, index }: StepCardProps) => {
  return (
    <div className="relative bg-white border rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">

      {/* Icône */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: step.color }}
      >
        {step.icon}
      </div>

      {/* Numéro */}
      <div className="text-gray-400 text-lg mb-2">
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Titre */}
      <h3 className="font-semibold text-gray-900 mb-3">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {step.description}
      </p>
    </div>
  );
};

export default StepCard;
