import { Check, Ruler, Sun, FileText } from "lucide-react";

interface ProcessStepsProps {
  currentStep: number;
}

export const ProcessSteps = ({ currentStep }: ProcessStepsProps) => {
  const steps = [
    {
      icon: Check,
      title: "Adresse bestätigt",
      description: "Ihre Adresse wurde erfolgreich erkannt"
    },
    {
      icon: Ruler,
      title: "Dach vermessen",
      description: "Zeichnen Sie die Dachfläche ein"
    },
    {
      icon: Sun,
      title: "Potenzial berechnen",
      description: "Wir analysieren Ihr Solarpotenzial"
    },
    {
      icon: FileText,
      title: "Angebot erstellen",
      description: "Ihr persönliches Angebot"
    }
  ];

  return (
    <div className="mb-8">
      <div className="relative">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
          <div 
            className="h-full bg-solar-orange transition-all duration-500"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = index < currentStep;
            const isActive = index === currentStep - 1;

            return (
              <div 
                key={index}
                className="flex flex-col items-center"
              >
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center 
                    ${isCompleted || isActive ? 'bg-solar-orange text-white' : 'bg-gray-200 text-gray-500'}
                    transition-colors duration-200 z-10
                  `}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                <div className="mt-3 text-center">
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-xs text-gray-500 mt-1 max-w-[120px]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};