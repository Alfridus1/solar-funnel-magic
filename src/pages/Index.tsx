import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RoofCheck } from "@/components/RoofCheck";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Benefits } from "@/components/Benefits";
import { Stats } from "@/components/Stats";
import { HeroSection } from "@/components/landing/HeroSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { TrustIndicators } from "@/components/landing/TrustIndicators";
import { useGeolocation } from "@/components/RoofCheck/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { supabase } from "@/integrations/supabase/client";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

export function Index() {
  const [address, setAddress] = useState("");
  const [showRoofCheck, setShowRoofCheck] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoaded, loadError } = useGoogleMaps();

  // Store referral code in localStorage when the page loads
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      localStorage.setItem('referralCode', refCode);
    }
  }, [searchParams]);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const { data: employee } = await supabase
          .from('employees')
          .select('role')
          .eq('profile_id', session.user.id)
          .single();

        if (profile?.role === 'admin') {
          setUserRole('admin');
        } else if (employee?.role) {
          setUserRole('employee');
        } else {
          setUserRole('customer');
        }
      }
    };
    
    checkAuth();

    // Subscribe to auth changes
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

  const onGeolocationSuccess = (formattedAddress: string) => {
    setAddress(formattedAddress);
    toast({
      title: "Erfolg",
      description: "Ihr Standort wurde erfolgreich erkannt.",
    });
  };

  const onGeolocationError = (errorMessage: string) => {
    toast({
      title: "Fehler",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const { handleGeolocation } = useGeolocation({
    onSuccess: onGeolocationSuccess,
    onError: onGeolocationError,
    toast
  });

  const onPlaceSelected = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.formatted_address) {
      setAddress(place.formatted_address);
    }
  };

  const handleAddressSubmit = () => {
    if (!address) {
      toast({
        title: "Bitte geben Sie eine Adresse ein",
        variant: "destructive",
      });
      return;
    }
    setShowRoofCheck(true);
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <p className="text-red-600">
            Fehler beim Laden der Karte. Bitte versuchen Sie es später erneut.
          </p>
        </Card>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <p>Laden...</p>
        </Card>
      </div>
    );
  }

  if (showRoofCheck) {
    return <RoofCheck address={address} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-blue to-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-end gap-4 py-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profil
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDashboardNavigation}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => {
                  await supabase.auth.signOut();
                  toast({
                    title: "Erfolgreich ausgeloggt",
                    description: "Auf Wiedersehen!",
                  });
                }}>
                  Ausloggen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline"
              onClick={() => setShowLoginDialog(true)}
              className="bg-white hover:bg-solar-orange hover:text-white transition-colors"
            >
              Login
            </Button>
          )}
        </div>
        
        <div className="py-12">
          <HeroSection
            address={address}
            setAddress={setAddress}
            autocompleteRef={autocompleteRef}
            onPlaceSelected={onPlaceSelected}
            handleAddressSubmit={handleAddressSubmit}
            handleGeolocation={handleGeolocation}
          />
          <TrustIndicators />
          <Stats />
          <Benefits />
          <Testimonials />
          <FAQ />
          <FinalCTA handleAddressSubmit={handleAddressSubmit} />
        </div>
      </div>

      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
      />
    </div>
  );
}
