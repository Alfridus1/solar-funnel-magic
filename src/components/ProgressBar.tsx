import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: { title: string; description: string }[];
}

export const ProgressBar = ({ currentStep, totalSteps, steps = [] }: ProgressBarProps) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center w-1/5",
                  index < currentStep ? "text-blue-600" : "text-gray-400"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-2",
                    index < currentStep ? "bg-blue-600 text-white" : "bg-gray-200"
                  )}
                >
                  {index + 1}
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm">{step.title}</div>
                  <div className="text-xs hidden md:block">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};