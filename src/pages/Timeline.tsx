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

const API_BASE = "/api";

const Timeline = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State for the events array
  const [events, setEvents] = useState<Event[]>([]);
  // State for the form inputs
  const [eventDate, setEventDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventMemory, setEventMemory] = useState(""); // optional description
  // State for loading/disabling the button
  const [isLoading, setIsLoading] = useState(false);

  // Fetch events from sqlite API on mount
  useEffect(() => {
    fetch(`${API_BASE}/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
      });
  }, []);

  /**
   * Adds a new event by POSTing to the server. Server returns the created event.
   */
  const addNewTimelineItem = async (date: string, title: string, description?: string) => {
    try {
      const payload = {
        date,
        title,
        description: description || "A new chapter in our story, written with love.",
      };

      const res = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Failed to create event");
      }

      const newEvent = await res.json();
      setEvents((prev) => [...prev, newEvent]);
      setEventDate("");
      setEventTitle("");
      setEventMemory("");
    } catch (err) {
      console.error("Error adding event:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpandStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate || !eventTitle || isLoading) return;
    setIsLoading(true);
    await addNewTimelineItem(eventDate, eventTitle, eventMemory);
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
          <h1 
          className="text-5xl md:text-6xl text-foreground-light">Our Love Story</h1>
          <p className="text-xl text-muted-foreground">Every moment with you is a cherished memory</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="mt-4 retro-btn retro-btn-secondary"
          >
            &lt; Logout
          </Button>
        </div>

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
          <div className="relative">
          {/* Timeline line */}
          <div 
          style={{background : "var(--retro-accent)"}}
          className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary transform -translate-x-1/2" 
          ></div>

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