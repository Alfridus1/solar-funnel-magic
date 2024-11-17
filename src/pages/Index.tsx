import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressBar } from "@/components/ProgressBar";
import { RoofCheck } from "@/components/RoofCheck";
import { LeadForm } from "@/components/LeadForm";

const Index = () => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const totalSteps = 3;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Save Big with Solar Power
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of homeowners who are saving up to 60% on their energy
            bills with solar power
          </p>
        </div>

        <ProgressBar currentStep={step} totalSteps={totalSteps} />

        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mb-8">
          {step === 1 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-semibold mb-4">
                Let's Check Your Home's Solar Potential
              </h2>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full"
                />
                <Button
                  onClick={nextStep}
                  disabled={!address}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  Check My Roof
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-semibold mb-4">Analyzing Your Roof</h2>
              <RoofCheck />
              <Button
                onClick={nextStep}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                Get My Solar Quote
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-semibold mb-4">
                Get Your Free Solar Quote
              </h2>
              <LeadForm />
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-8 text-center max-w-4xl mx-auto">
          <div className="flex-1 p-4">
            <div className="text-4xl font-bold text-solar-orange mb-2">60%</div>
            <div className="text-gray-600">Average Energy Savings</div>
          </div>
          <div className="flex-1 p-4">
            <div className="text-4xl font-bold text-solar-orange mb-2">26%</div>
            <div className="text-gray-600">Federal Tax Credit</div>
          </div>
          <div className="flex-1 p-4">
            <div className="text-4xl font-bold text-solar-orange mb-2">24/7</div>
            <div className="text-gray-600">Expert Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;