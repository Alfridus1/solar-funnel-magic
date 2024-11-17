import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export const RoofCheck = () => {
  const [analyzing, setAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalyzing(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg animate-fade-up">
      <div className="text-center">
        {analyzing ? (
          <>
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analyzing your roof...</h3>
            <p className="text-gray-600">Using AI to check solar potential</p>
          </>
        ) : (
          <>
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Great News!</h3>
            <p className="text-gray-600 mb-4">
              Your roof has excellent solar potential. Based on our AI analysis,
              you could save up to 60% on your energy bills.
            </p>
          </>
        )}
      </div>
    </div>
  );
};