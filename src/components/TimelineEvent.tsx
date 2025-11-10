import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import MyHeart from "@/components/ui/heart";

interface TimelineEventProps {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  side: "left" | "right";
}

export const TimelineEvent = ({ id, date, title, description, image, side }: TimelineEventProps) => {
  return (
    <div className={`flex items-center gap-8 ${side === "right" ? "flex-row-reverse" : ""}`}>
      <div className={`flex-1 ${side === "right" ? "text-left" : "text-right"}`}>
        <Link to={`/message/${id}`}>
          <Card className="group border-border/50 bg-card/80 backdrop-blur-sm cursor-pointer timeline-event-card">
            <CardContent className="p-6">
            <div className="space-y-3">
              <p className="text-sm text-primary font-medium">{date}</p>
              <h3 className="text-2xl text-foreground-red">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
              {image && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </Link>
      </div>
      
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)] z-10 group-hover:scale-110 transition-transform duration-300">
          <MyHeart className="w-6 h-6 text-primary-foreground fill-current" />
        </div>
      </div>
      
      <div className="flex-1"></div>
    </div>
  );
};
