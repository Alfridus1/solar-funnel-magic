import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoofCheck } from "@/components/RoofCheck";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const Debug = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "");
  const defaultAddress = "Dornfelderweg 9 67157 Wachenheim an der Weinstraße";
  const { toast } = useToast();

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const testApiKey = async () => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=Berlin&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === "OK") {
        toast({
          title: "API-Key ist gültig",
          description: "Die Verbindung zu Google Maps funktioniert.",
        });
        addLog("API-Key Test erfolgreich");
      } else {
        toast({
          title: "API-Key ist ungültig",
          description: `Fehler: ${data.status}`,
          variant: "destructive",
        });
        addLog(`API-Key Test fehlgeschlagen: ${data.status}`);
      }
    } catch (error) {
      toast({
        title: "Verbindungsfehler",
        description: "Konnte keine Verbindung zu Google Maps herstellen",
        variant: "destructive",
      });
      addLog(`API-Key Test fehlgeschlagen: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Debug Mode - Roof Analysis</h1>
      
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">API Konfiguration</h2>
          <div className="flex gap-4 items-end mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                Google Maps API Key
              </label>
              <Input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Geben Sie Ihren API-Key ein"
                className="font-mono"
              />
            </div>
            <Button onClick={testApiKey}>
              API-Key testen
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Map View</h2>
              <RoofCheck 
                address={defaultAddress} 
                onLog={addLog}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Debug Log</h2>
              <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="text-sm font-mono mb-2 border-b border-gray-100 pb-2"
                  >
                    {log}
                  </div>
                ))}
                {logs.length === 0 && (
                  <div className="text-gray-500 italic">
                    Warte auf Debug-Informationen...
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Debug;