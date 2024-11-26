import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-solar-blue to-white p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Seite nicht gefunden</p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-solar-orange hover:bg-solar-orange/90"
        >
          Zurück zur Startseite
        </Button>
      </div>
    </div>
  );
}