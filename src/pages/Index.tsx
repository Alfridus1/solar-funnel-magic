import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { supabase } from "@/integrations/supabase/client";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { Header } from "@/components/landing/Header";
import { RegistrationOverlay } from "@/components/solar-showcase/components/registration/RegistrationOverlay";
import { motion } from "framer-motion";
import { useGeolocation } from "@/components/RoofCheck/hooks/useGeolocation";
import { RoofCheck } from "@/components/RoofCheck";
import { Testimonials } from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sun, Shield, Sparkles, Euro, MapPin } from "lucide-react";

export function Index() {
  const [address, setAddress] = useState("");
  const [showRoofCheck, setShowRoofCheck] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegistrationOverlay, setShowRegistrationOverlay] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      localStorage.setItem('referralCode', refCode);
    }
  }, [searchParams]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();

          const { data: employee } = await supabase
            .from('employees')
            .select('role')
            .eq('profile_id', session.user.id)
            .maybeSingle();

          if (profile?.role === 'admin') {
            setUserRole('admin');
          } else if (employee?.role) {
            setUserRole('employee');
          } else {
            setUserRole('customer');
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          setUserRole('customer');
        }
      }
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDashboardNavigation = () => {
    switch (userRole) {
      case 'admin':
        navigate('/admin');
        break;
      case 'employee':
        navigate('/employee/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const { handleGeolocation } = useGeolocation({
    onSuccess: (formattedAddress: string) => {
      setAddress(formattedAddress);
      toast({
        title: "Erfolg",
        description: "Ihr Standort wurde erfolgreich erkannt.",
      });
    },
    onError: (errorMessage: string) => {
      toast({
        title: "Fehler",
        description: errorMessage,
        variant: "destructive",
      });
    },
    toast
  });

  if (loadError || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className={loadError ? "text-red-600" : ""}>
          {loadError ? "Fehler beim Laden der Karte. Bitte versuchen Sie es später erneut." : "Laden..."}
        </p>
      </div>
    );
  }

  if (showRoofCheck) {
    return <RoofCheck address={address} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue-50 to-white">
      <div className="container mx-auto px-4">
        <Header 
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          onShowLogin={() => setShowLoginDialog(true)}
          onShowRegister={() => setShowRegistrationOverlay(true)}
          handleDashboardNavigation={() => navigate('/dashboard')}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-20 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-solar-orange to-solar-orange-light bg-clip-text text-transparent">
            Sparen Sie bis zu 80% Ihrer Stromkosten
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Berechnen Sie in nur 2 Minuten Ihr persönliches Solardach und erhalten Sie ein unverbindliches Angebot
          </p>

          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ihre Adresse eingeben"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-solar-orange"
                />
                <Button
                  onClick={handleGeolocation}
                  variant="outline"
                  className="shrink-0 border-gray-200 hover:bg-gray-50"
                  title="Standort erkennen"
                >
                  <MapPin className="h-5 w-5 text-solar-orange" />
                </Button>
              </div>
              <Button 
                onClick={() => setShowRoofCheck(true)}
                className="bg-solar-orange hover:bg-solar-orange-dark text-white px-8 py-3 rounded-lg font-semibold whitespace-nowrap"
              >
                Jetzt berechnen
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-6"
          >
            <Shield className="h-12 w-12 text-solar-orange mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">15 Jahre Garantie</h3>
            <p className="text-gray-600">Umfassender Schutz für Ihre Investition</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center p-6"
          >
            <Sparkles className="h-12 w-12 text-solar-orange mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Premium Qualität</h3>
            <p className="text-gray-600">Nur hochwertige deutsche Komponenten</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center p-6"
          >
            <Euro className="h-12 w-12 text-solar-orange mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Förderung sichern</h3>
            <p className="text-gray-600">Wir beraten Sie zu allen Fördermöglichkeiten</p>
          </motion.div>
        </div>

        <div className="py-16 bg-gradient-to-br from-solar-orange/5 to-white rounded-3xl my-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Über 1.000 zufriedene Kunden
            </h2>
            <p className="text-xl text-gray-600">
              Vertrauen Sie auf unsere Expertise
            </p>
          </div>
          <Testimonials />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bereit für Ihre eigene Solaranlage?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Starten Sie jetzt und sichern Sie sich Ihr persönliches Angebot. Unverbindlich und kostenlos.
          </p>
          <Button
            onClick={() => setShowRoofCheck(true)}
            className="bg-solar-orange hover:bg-solar-orange-dark text-white text-lg px-8 py-6 rounded-lg font-semibold"
          >
            Jetzt Dach vermessen
            <Sun className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>

      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
      />

      {showRegistrationOverlay && (
        <RegistrationOverlay
          onComplete={() => setShowRegistrationOverlay(false)}
        />
      )}
    </div>
  );
}