import React, { useEffect, useState } from "react";
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

const API_BASE = import.meta.env.VITE_BACKEND_URL + "/api";

const Timeline = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State for the events array
  const [events, setEvents] = useState<Event[]>([]);
  // State for the form inputs
  const [eventDate, setEventDate] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  // State for loading/disabling the button
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDate, setEditingDate] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

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
      setEventDescription("");
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
    await addNewTimelineItem(eventDate, eventTitle, eventDescription);
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

  const handleEditClick = (ev: Event) => {
    setEditingId(ev.id);
    setEditingTitle(ev.title);
    setEditingDate(ev.date);
    setEditingDescription(ev.description || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
    setEditingDate("");
    setEditingDescription("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editingTitle.trim() || !editingDate.trim()) return;
    try {
      const url = `${API_BASE}/events/${id}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingTitle.trim(),
          date: editingDate.trim(),
          description: editingDescription.trim(),
        }),
      });
      // capture body for debugging
      const text = await res.text();
      if (!res.ok) {
        console.error("PUT", url, "status", res.status, "body:", text);
        let errMsg = `Failed to update event (status ${res.status})`;
        try {
          const json = JSON.parse(text);
          errMsg = json?.error || json?.message || errMsg;
        } catch { /* ignore JSON parse errors */ }
        throw new Error(errMsg);
      }

      const updated = JSON.parse(text);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      handleCancelEdit();
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to delete event");
      }
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
    }
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
            className="mt-4 retro-btn"
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
                  type="date"
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
                <input
                  type="text"
                  id="eventDescription"
                  placeholder="Event Description (Optional)"
                  required
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
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

        {/* Events list */}
        <div className="mt-8 space-y-4">
          {events.map((ev) => (
            <div key={ev.id} className="retro-card p-4 flex items-start justify-between">
              <div className="flex-1">
                {editingId === ev.id ? (
                  <div className="space-y-2">
                    <input
                      className="retro-input text-sm w-full"
                      value={editingDate}
                      onChange={(e) => setEditingDate(e.target.value)}
                    />
                    <input
                      className="retro-input text-sm w-full"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                    />
                    <textarea
                      className="retro-input text-sm w-full h-20 resize-none"
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="text-xs text-muted-foreground">{ev.date}</div>
                    <div className="text-lg font-medium">{ev.title}</div>
                    <div className="text-sm mt-2">{ev.description}</div>
                  </div>
                )}
              </div>

              <div className="ml-4 flex flex-col gap-2">
                {editingId === ev.id ? (
                  <>
                    <button
                      className="retro-btn retro-btn-primary text-xs"
                      onClick={() => handleSaveEdit(ev.id)}
                    >
                      Save
                    </button>
                    <button className="retro-btn text-xs" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="retro-btn text-xs" onClick={() => handleEditClick(ev)}>
                      Edit
                    </button>
                    <button
                      className="retro-btn retro-btn-destructive text-xs"
                      onClick={() => handleDeleteEvent(ev.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {events.length === 0 && <div className="text-center text-sm text-muted-foreground">No events yet.</div>}
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