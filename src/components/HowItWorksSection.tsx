import StepCard from "./StepCard";
import type { Step } from "../types/step";

type HowItWorksSectionProps = {
  title: string;
  subtitle?: string;
  steps: Step[];
};

const HowItWorksSection = ({
  title,
  subtitle,
  steps,
}: HowItWorksSectionProps) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Titre */}
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {/* Étapes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <StepCard
              key={step.id}
              step={step}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
