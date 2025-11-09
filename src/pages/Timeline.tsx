import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TimelineEvent } from "@/components/TimelineEvent";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Timeline = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    navigate("/auth");
  };

  if (!isAuthenticated) {
    return null;
  }

  const events = [
    {
      id: "first-meeting",
      date: "January 2024",
      title: "First Meeting",
      description: "The day we first met and everything changed. A moment I'll never forget.",
      side: "left" as const,
    },
    {
      id: "first-date",
      date: "February 2024",
      title: "First Date",
      description: "Our first official date. Nervous smiles, endless conversation, and the beginning of something beautiful.",
      side: "right" as const,
    },
    {
      id: "made-official",
      date: "March 2024",
      title: "Made It Official",
      description: "The day you said yes. The happiest moment of my life so far.",
      side: "left" as const,
    },
    {
      id: "first-trip",
      date: "April 2024",
      title: "First Trip Together",
      description: "Our first adventure together. Making memories that will last forever.",
      side: "right" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl text-foreground">Our Love Story</h1>
          <p className="text-xl text-muted-foreground">Every moment with you is a cherished memory</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="mt-4"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary transform -translate-x-1/2"></div>
          
          {/* Timeline events */}
          <div className="space-y-16">
            {events.map((event, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <TimelineEvent {...event} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-lg text-muted-foreground italic">
            And this is just the beginning of our story...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
