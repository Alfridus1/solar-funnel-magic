import { ReactNode } from "react";
import { CustomerSidebar } from "./CustomerSidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CustomerLayoutProps {
  children: ReactNode;
}

export const CustomerLayout = ({ children }: CustomerLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <CustomerSidebar />
      <div className="flex-1">
        <header className="border-b bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between px-8 py-4">
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <TooltipProvider>
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7" />
                      <AvatarFallback>
                        <CircleUserRound className="h-5 w-5 text-solar-orange" />
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">Ihr Vertriebs-Experte</p>
                    <p className="text-sm text-muted-foreground">Max Mustermann - Ihr persönlicher Ansprechpartner für alle Fragen rund um Ihre Solaranlage</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" />
                      <AvatarFallback>
                        <CircleUserRound className="h-5 w-5 text-solar-orange" />
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">Ihr Bauleiter</p>
                    <p className="text-sm text-muted-foreground">Thomas Schmidt - Verantwortlich für die professionelle Installation und technische Umsetzung</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1504893524553-b855bce32c67" />
                      <AvatarFallback>
                        <CircleUserRound className="h-5 w-5 text-solar-orange" />
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">Ihr Kundendienst</p>
                    <p className="text-sm text-muted-foreground">Anna Weber - Steht Ihnen bei allen Service- und Wartungsfragen zur Seite</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </header>
        <main className="overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};