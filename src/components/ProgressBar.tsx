import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; description: string }[];
  baseUrl?: string;
}

export const ProgressBar = ({ currentStep, totalSteps, steps = [], baseUrl = "/configurator" }: ProgressBarProps) => {
  const navigate = useNavigate();

  if (!steps || steps.length === 0) {
    return null;
  }

  const handleStepClick = (index: number) => {
    if (index >= currentStep) return; // Don't allow clicking future steps

    const routes = [
      "consumption",
      "modules",
      "inverter",
      "battery",
      "summary"
    ];

    navigate(`${baseUrl}/${routes[index]}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-8">
      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center flex-1 px-2",
                  "transition-all duration-200 ease-in-out",
                  index < currentStep ? "text-solar-orange hover:opacity-80 cursor-pointer" : "text-gray-400",
                  index >= currentStep && "cursor-not-allowed opacity-50"
                )}
                onClick={() => handleStepClick(index)}
                role="button"
                tabIndex={index < currentStep ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleStepClick(index);
                  }
                }}
              >
                <div
                  className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mb-2",
                    "text-xs sm:text-sm transition-colors duration-200",
                    index < currentStep ? "bg-solar-orange text-white" : "bg-gray-200"
                  )}
                >
                  {index + 1}
                </div>
                <div className="text-center">
                  <div className="font-semibold text-xs sm:text-sm whitespace-nowrap">
                    {step.title}
                  </div>
                  <div className="text-xs hidden sm:block text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-solar-orange rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};