import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { supabase } from "@/integrations/supabase/client";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { RegistrationOverlay } from "@/components/solar-showcase/components/registration/RegistrationOverlay";
import { useGeolocation } from "@/components/RoofCheck/hooks/useGeolocation";
import { RoofCheck } from "@/components/RoofCheck";
import { Testimonials } from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";
import { HeroSection } from "@/components/landing/HeroSection";
import { Features } from "@/components/landing/Features";
import { PhotoGallery } from "@/components/landing/PhotoGallery";

export function Index() {
  const [address, setAddress] = useState("");
  const [showRoofCheck, setShowRoofCheck] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegistrationOverlay, setShowRegistrationOverlay] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
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
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="container mx-auto px-4">
          <Header 
            isLoggedIn={isLoggedIn}
            userRole={userRole}
            onShowLogin={() => setShowLoginDialog(true)}
            onShowRegister={() => setShowRegistrationOverlay(true)}
            handleDashboardNavigation={() => navigate('/dashboard')}
          />
        </div>

        <HeroSection
          address={address}
          setAddress={setAddress}
          handleGeolocation={handleGeolocation}
          setShowRoofCheck={setShowRoofCheck}
        />

        <div className="container mx-auto px-4">
          <Features />
          <PhotoGallery />

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

          <div className="text-center py-20">
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
          </div>
        </div>
      </div>

      <Footer />

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
