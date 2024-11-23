import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

interface NewsItem {
  title: string;
  date: string;
  category: string;
  content: string;
}

const dummyNews: NewsItem[] = [
  {
    title: "Neue Solarmodule verfügbar",
    date: "15. März 2024",
    category: "Produkte",
    content: "Unsere neuesten Hochleistungsmodule sind jetzt verfügbar."
  },
  {
    title: "Wartungsarbeiten geplant",
    date: "20. März 2024",
    category: "Service",
    content: "Routinewartung für optimale Leistung Ihrer Anlage."
  },
  {
    title: "Förderung für Speichersysteme",
    date: "10. März 2024",
    category: "Förderung",
    content: "Neue staatliche Förderung für Batteriespeicher verfügbar."
  }
];

export const NewsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktuelle Neuigkeiten</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {dummyNews.map((news, index) => (
          <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{news.title}</h3>
              <Badge variant="secondary">{news.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{news.content}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-1" />
              {news.date}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};