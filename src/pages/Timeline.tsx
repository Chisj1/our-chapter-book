import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TimelineEvent } from "@/components/TimelineEvent";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

// Define the shape of a timeline event
interface Event {
  id: string;
  date: string;
  title: string;
  description: string;
  side: "left" | "right";
}

// Initial static events
const initialEvents: Event[] = [
  {
    id: "first-meeting",
    date: "January 2024",
    title: "First Meeting",
    description: "The day we first met and everything changed. A moment I'll never forget.",
    side: "left",
  },
  {
    id: "first-date",
    date: "February 2024",
    title: "First Date",
    description: "Our first official date. Nervous smiles, endless conversation, and the beginning of something beautiful.",
    side: "right",
  },
  {
    id: "made-official",
    date: "March 2024",
    title: "Made It Official",
    description: "The day you said yes. The happiest moment of my life so far.",
    side: "left",
  },
  {
    id: "first-trip",
    date: "April 2024",
    title: "First Trip Together",
    description: "Our first adventure together. Making memories that will last forever.",
    side: "right",
  },
];

const Timeline = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State for the events array
  const [events, setEvents] = useState<Event[]>(initialEvents);
  // State for the form inputs
  const [eventDate, setEventDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  // State for loading/disabling the button
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Adds a new event to the timeline state after a short delay (simulating data processing).
   */
  const addNewTimelineItem = (date: string, title: string) => {
    // Logic to determine the side of the new item
    const lastItem = events[events.length - 1];
    const newSide = lastItem && lastItem.side === "left" ? ("right" as const) : ("left" as const);
    
    // Format the date for display
    const formattedDate = new Date(date).toLocaleString("default", { month: "long", year: "numeric" });

    const newEvent: Event = {
      id: `${date}-${title}`.toLowerCase().replace(/\s+/g, "-"),
      date: formattedDate,
      title: title,
      // Default description since LLM integration is removed
      description: "A new chapter in our story, written with love.",
      side: newSide,
    };

    // Simulate API/LLM processing time
    setTimeout(() => {
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setEventDate(""); // Clear form state
      setEventTitle(""); // Clear form state
      setIsLoading(false); // Hide loading
    }, 1500);
  };

  const handleExpandStory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventDate || !eventTitle || isLoading) return;

    setIsLoading(true); // Show loading indicator
    addNewTimelineItem(eventDate, eventTitle);
  };


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
            className="mt-4 retro-btn retro-btn-secondary"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
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
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="flex-1 retro-input transition-all duration-300 focus:shadow-[var(--shadow-soft)]"
                  />
                  <input
                    type="text"
                    id="eventTitle"
                    placeholder="Event Title"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="flex-1 retro-input transition-all duration-300 focus:shadow-[var(--shadow-soft)]"
                  />
                </div>
                <div className="flex items-center space-x-4 justify-center">
                  <Button
                    type="submit"
                    id="expand-btn"
                    disabled={isLoading || !eventDate || !eventTitle}
                    className="from-primary to-accent transition-all duration-300 shadow-[var(--shadow-soft)] retro-btn retro-btn-primary"
                  >
                    Expand Story
                  </Button>
                  <div
                    id="story-loading"
                    // Use conditional rendering instead of class toggling
                    className={
                        isLoading ? "w-6 h-6 border-4 border-t-4 border-primary rounded-full animate-spin" : "hidden"
                    }
                  ></div>
                </div>
              </form>
            </div>
          </div>


          {/* Timeline events */}
          <div className="space-y-16">
            {events.map((event, index) => (
              <div
                key={event.id} // Use a unique ID for the key
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