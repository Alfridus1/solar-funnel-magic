import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RoofCheck } from "@/components/RoofCheck";

export const Debug = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const defaultAddress = "Dornfelderweg 9 67157 Wachenheim an der Weinstraße";

  // Function to add logs that can be called from child components
  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Debug Mode - Roof Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Map View</h2>
              <RoofCheck address={defaultAddress} onLog={addLog} />
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