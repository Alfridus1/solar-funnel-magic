import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const APIDebugger = () => {
  const [logs, setLogs] = useState<Record<string, string[]>>({
    supabase: [],
    openSolar: [],
    microsoft: [],
    smartMeter: []
  });
  const { toast } = useToast();

  const addLog = (api: string, message: string) => {
    setLogs(prev => ({
      ...prev,
      [api]: [...(prev[api] || []), `${new Date().toISOString()}: ${message}`]
    }));
  };

  const testSupabase = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      if (error) throw error;
      addLog('supabase', 'Connection successful - Database accessible');
      toast({
        title: "Supabase Test Successful",
        description: "Connection to Supabase is working properly.",
      });
    } catch (error: any) {
      addLog('supabase', `Error: ${error.message}`);
      toast({
        title: "Supabase Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testOpenSolar = async () => {
    try {
      const response = await fetch('/api/opensolar/test', {
        method: 'POST',
      });
      const data = await response.json();
      addLog('openSolar', `API Response: ${JSON.stringify(data)}`);
      toast({
        title: "OpenSolar Test Complete",
        description: "Check logs for details",
      });
    } catch (error: any) {
      addLog('openSolar', `Error: ${error.message}`);
      toast({
        title: "OpenSolar Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testMicrosoftCalendar = async () => {
    try {
      const response = await fetch('/api/microsoft/calendar/test', {
        method: 'POST',
      });
      const data = await response.json();
      addLog('microsoft', `API Response: ${JSON.stringify(data)}`);
      toast({
        title: "Microsoft Calendar Test Complete",
        description: "Check logs for details",
      });
    } catch (error: any) {
      addLog('microsoft', `Error: ${error.message}`);
      toast({
        title: "Microsoft Calendar Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const testSmartMeter = async () => {
    try {
      const response = await fetch('/api/smart-meter/test', {
        method: 'POST',
      });
      const data = await response.json();
      addLog('smartMeter', `API Response: ${JSON.stringify(data)}`);
      toast({
        title: "Smart Meter Test Complete",
        description: "Check logs for details",
      });
    } catch (error: any) {
      addLog('smartMeter', `Error: ${error.message}`);
      toast({
        title: "Smart Meter Test Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">API Debug Console</h1>
      
      <Tabs defaultValue="supabase" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="supabase">Supabase</TabsTrigger>
          <TabsTrigger value="openSolar">OpenSolar</TabsTrigger>
          <TabsTrigger value="microsoft">Microsoft</TabsTrigger>
          <TabsTrigger value="smartMeter">Smart Meter</TabsTrigger>
        </TabsList>

        <TabsContent value="supabase">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Supabase Connection</h2>
              <Button onClick={testSupabase}>Test Connection</Button>
            </div>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {logs.supabase.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-2 border-b border-gray-100 pb-2">
                  {log}
                </div>
              ))}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="openSolar">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">OpenSolar API</h2>
              <Button onClick={testOpenSolar}>Test API</Button>
            </div>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {logs.openSolar.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-2 border-b border-gray-100 pb-2">
                  {log}
                </div>
              ))}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="microsoft">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Microsoft Calendar API</h2>
              <Button onClick={testMicrosoftCalendar}>Test API</Button>
            </div>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {logs.microsoft.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-2 border-b border-gray-100 pb-2">
                  {log}
                </div>
              ))}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="smartMeter">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Smart Meter API</h2>
              <Button onClick={testSmartMeter}>Test API</Button>
            </div>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              {logs.smartMeter.map((log, index) => (
                <div key={index} className="text-sm font-mono mb-2 border-b border-gray-100 pb-2">
                  {log}
                </div>
              ))}
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};