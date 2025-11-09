import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TimelineEvent } from "@/components/TimelineEvent";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Timeline = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const handleExpandStory = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventDate = (document.getElementById("eventDate") as HTMLInputElement).value;
    const eventTitle = (document.getElementById("eventTitle") as HTMLInputElement).value;
    const expandBtn = document.getElementById("expand-btn") as HTMLButtonElement;
    const loadingIndicator = document.getElementById("story-loading") as HTMLDivElement;
    if (!eventDate || !eventTitle) return;
    
    // Disable button and show loading indicator
    expandBtn.disabled = true;
    loadingIndicator.classList.remove("hidden");

    addNewTimelineItem(eventDate, eventTitle);
    // Clear inputs on success
    (document.getElementById('eventDate') as HTMLInputElement).value = '';
    (document.getElementById('eventTitle') as HTMLInputElement).value = '';

  };

  const addNewTimelineItem = (date: string, title: string) => {
    // Simulate adding new event to timeline
    setTimeout(() => {
      // Here you would normally update state or make an API call
      // For this example, we just re-enable the button and hide loading
      const expandBtn = document.getElementById("expand-btn") as HTMLButtonElement;
      const loadingIndicator = document.getElementById("story-loading") as HTMLDivElement;
      expandBtn.disabled = false;
      loadingIndicator.classList.add("hidden");
      alert(`New event added: ${title} on ${new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' })}`);
    }, 1500);
  }

  // const addNewTimelineItem(date, title) {
  //     // Add new event to timeline
  //     const lastItem = events[events.length - 1];
  //     const newSide = lastItem && lastItem.side === 'left' ? 'right' as const : 'left' as const;
  //     events.push({
  //       id: `${date}-${title}`.toLowerCase().replace(/\s+/g, '-'),
  //       date: new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' }),
  //       title: title,
  //       description: "A new chapter in our story, added by us.",
  //       side: newSide,
  //     });
  //     // Re-enable button and hide loading indicator
  //     const expandBtn = document.getElementById("expand-btn") as HTMLButtonElement;
  //     const loadingIndicator = document.getElementById("story-loading") as HTMLDivElement;
  //     expandBtn.disabled = false;
  //     loadingIndicator.classList.add("hidden");
  // }

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

  // <-- Sample timeline events data -->
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
            className="mt-4 retro-btn retro-btn-logout"
          >
            &lt; Logout
          </Button>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary transform -translate-x-1/2"></div>
          
          {/* New Event Input Area */}
          <div className="mb-16 flex justify-center animate-fade-in">
            <div className="bg-card rounded-lg shadow-[var(--shadow-soft)] p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-semibold mb-4 text-center">Expand Our Story</h2>
              <form onSubmit={handleExpandStory} className="space-y-4">
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <input
                    type="month"
                    id="eventDate"
                    required
                    className="flex-1 retro-input transition-all duration-300 focus:shadow-[var(--shadow-soft)]"
                  />
                  <input
                    type="text"
                    id="eventTitle"
                    placeholder="Event Title"
                    required
                    className="flex-1 retro-input transition-all duration-300 focus:shadow-[var(--shadow-soft)]"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    type="submit"
                    id="expand-btn"
                    className="from-primary to-accent transition-all duration-300 shadow-[var(--shadow-soft)] retro-btn"
                  >
                    Expand Story
                  </Button>
                  <div
                    id="story-loading"
                    className="hidden w-6 h-6 border-4 border-t-4 border-primary rounded-full animate-spin"
                  ></div>
                </div>
              </form>
            </div>
          </div>


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


