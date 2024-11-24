import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeroImage } from "./components/HeroImage";
import { LeadFormOverlay } from "./components/LeadFormOverlay";
import { SystemMetrics } from "./components/SystemMetrics";
import { SavingsCalculator } from "@/components/SavingsCalculator";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { PDFDownloadButton } from "./components/PDFDownloadButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

export const ProductShowcase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formType, setFormType] = useState<"quote" | "consultation" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  const { metrics, address } = location.state || {};

  // Fetch products from solar_products table
  const { data: products = [] } = useQuery({
    queryKey: ['solar-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('solar_products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (!metrics || !session) {
        navigate("/");
        return;
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, metrics]);

  if (!metrics) {
    navigate("/");
    return null;
  }

  const moduleCount = Math.round(metrics.kWp * 2);
  const annualProduction = Math.round(metrics.kWp * 950);
  const estimatedPrice = Math.round(metrics.kWp * 1950);

  const handleConsultationRequest = () => {
    if (isAuthenticated) {
      setFormType("consultation");
      setShowLeadForm(true);
    } else {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melden Sie sich an oder registrieren Sie sich, um fortzufahren.",
      });
      navigate("/login");
    }
  };

  const handleCloseForm = () => {
    setShowLeadForm(false);
    setFormType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F75c03]/5 to-white">
      <div className="relative">
        <HeroImage />
        {showLeadForm && isAuthenticated && (
          <LeadFormOverlay 
            formType={formType} 
            metrics={metrics} 
            address={address}
            onClose={handleCloseForm}
          />
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto mb-8 p-8 bg-white/90 backdrop-blur shadow-lg">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Ihre Solar-Analyse</h1>
              <PDFDownloadButton metrics={metrics} address={address} />
            </div>

            <SystemMetrics
              moduleCount={moduleCount}
              kWp={metrics.kWp}
              annualProduction={annualProduction}
              roofArea={metrics.roofArea}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SavingsCalculator yearlyProduction={annualProduction} />
            </div>

            <section className="py-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                Unsere Produkte für Sie
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-solar-blue-50 to-white p-6">
                      {product.image_url && (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <div className="text-sm text-gray-600">
                        {product.category === 'module' && `${product.specs.watts}W`}
                        {product.category === 'battery' && `${product.specs.capacity}kWh`}
                        {product.category === 'inverter' && `${product.specs.power}kW`}
                      </div>
                      <div className="font-semibold">{product.price}€</div>
                      <Button 
                        className="w-full bg-solar-orange hover:bg-solar-orange-dark"
                        onClick={handleConsultationRequest}
                      >
                        Beratung anfragen
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section className="py-16 bg-gradient-to-br from-solar-blue-50 to-white rounded-3xl">
              <div className="text-center space-y-6 max-w-3xl mx-auto px-4">
                <h2 className="text-3xl font-bold">
                  Bereit für Ihre eigene Solaranlage?
                </h2>
                <p className="text-lg text-gray-600">
                  Lassen Sie sich von unseren Experten beraten und erhalten Sie ein 
                  maßgeschneidertes Angebot für Ihr Zuhause.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    className="bg-solar-orange hover:bg-solar-orange-dark"
                    onClick={() => {
                      setFormType("quote");
                      setShowLeadForm(true);
                    }}
                  >
                    Kostenloses Angebot
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-solar-orange text-solar-orange hover:bg-solar-orange/10"
                    onClick={handleConsultationRequest}
                  >
                    Beratungstermin vereinbaren
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </Card>

        <div className="max-w-4xl mx-auto">
          <Testimonials />
          <FAQ />
        </div>
      </div>
    </div>
  );
};