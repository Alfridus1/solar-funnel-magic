import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { HeroImage } from "@/components/solar-showcase/components/HeroImage";
import { LeadFormOverlay } from "@/components/solar-showcase/components/LeadFormOverlay";
import { RegistrationOverlay } from "@/components/solar-showcase/components/registration/RegistrationOverlay";
import { SystemMetrics } from "@/components/solar-showcase/components/SystemMetrics";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { PremiumProductsCarousel } from "@/components/solar-showcase/components/PremiumProductsCarousel";
import { PricingCard } from "@/components/solar-showcase/components/PricingCard";
import { PricingOptions } from "@/components/solar-showcase/components/PricingOptions";
import { ConfigSidebar } from "@/components/solar-showcase/components/ConfigSidebar";
import { loadConfigFromCookie, saveConfigToCookie } from "@/utils/configCookieManager";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const RecommendedConfig = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formType, setFormType] = useState<"quote" | "consultation" | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  const { metrics, address } = location.state || loadConfigFromCookie() || {};

  useEffect(() => {
    if (!metrics) {
      navigate("/");
      return;
    }

    saveConfigToCookie({ metrics, address });
  }, [metrics, address, navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        setIsRegistered(true);
        // Only create a new lead if there's no existingLeadId
        if (metrics && !location.state?.existingLeadId) {
          const { error } = await supabase.from('leads').insert({
            user_id: session.user.id,
            type: 'calculation',
            metrics: metrics,
            address: address,
            name: session.user.email || 'Unknown',
            email: session.user.email || '',
            phone: '',
            status: 'new'
          });

          if (error && error.code !== '23505') { // Ignore unique constraint violations
            toast({
              title: "Fehler beim Speichern der Berechnung",
              description: "Ihre Berechnung konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.",
              variant: "destructive",
            });
          }
        }
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        setIsRegistered(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [metrics, address, toast]);

  if (!metrics) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-solar-blue-50">
      <ConfigSidebar />
      
      <div className="flex-1">
        {!isAuthenticated && !isRegistered && (
          <RegistrationOverlay onComplete={() => setIsRegistered(true)} />
        )}
        
        <div className={`relative transition-all duration-300 ${!isRegistered ? 'pointer-events-none opacity-50' : ''}`}>
          <div className="relative">
            <HeroImage />
            {showLeadForm && (
              <LeadFormOverlay formType={formType} />
            )}
          </div>

          <div className="container mx-auto px-4 py-12">
            <Card className="max-w-7xl mx-auto mb-12 p-8 bg-white/95 backdrop-blur shadow-lg rounded-xl">
              <div className="mb-8 -mx-8 -mt-8 p-8 bg-gradient-to-br from-solar-orange/5 to-transparent rounded-t-xl">
                <SystemMetrics
                  moduleCount={Math.round(metrics.kWp * 2)}
                  kWp={metrics.kWp}
                  annualProduction={Math.round(metrics.kWp * 950)}
                  roofArea={metrics.roofArea}
                />
              </div>

              <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Potentialanalyse</h3>
                    <div className="group bg-gradient-to-br from-solar-blue-50/50 to-solar-blue-100/30 rounded-xl p-8 shadow-xl backdrop-blur-sm border border-white/50 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                      <div className="absolute inset-0 bg-gradient-to-tr from-solar-orange/10 via-solar-blue-100/20 to-transparent opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 group-hover:opacity-20 transition-opacity duration-300 h-full" />
                      <div className="relative z-10 backdrop-blur-[2px]">
                        <SavingsCalculator yearlyProduction={Math.round(metrics.kWp * 950)} />
                      </div>
                      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-solar-orange/10 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300" />
                      <div className="absolute -top-20 -left-20 w-40 h-40 bg-solar-blue/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Unverbindliche Preisschätzung</h3>
                    <PricingCard 
                      estimatedPrice={Math.round(metrics.kWp * 1950)} 
                      onShowLeadForm={() => {
                        setFormType("quote");
                        setShowLeadForm(true);
                      }}
                      systemSizeKWp={metrics.kWp}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <div className="max-w-7xl mx-auto mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-solar-orange to-solar-orange-dark bg-clip-text text-transparent">
                  Unsere Premium Komponenten
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Entdecken Sie unsere sorgfältig ausgewählten Premium-Produkte für Ihre Solaranlage
                </p>
              </div>
              
              <PremiumProductsCarousel />

              <PricingOptions
                estimatedPrice={Math.round(metrics.kWp * 1950)}
                onShowQuoteForm={() => {
                  setFormType("quote");
                  setShowLeadForm(true);
                }}
                onShowConsultationForm={() => {
                  setFormType("consultation");
                  setShowLeadForm(true);
                }}
              />
            </div>

            <div className="max-w-4xl mx-auto space-y-16">
              <Testimonials />
              <FAQ />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};