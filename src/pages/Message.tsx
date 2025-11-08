import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Save, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Message = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      // Load saved message if exists
      const savedMessage = localStorage.getItem(`message-${eventId}`);
      if (savedMessage) {
        setMessage(savedMessage);
      }
      // Load saved image if exists
      const savedImage = localStorage.getItem(`image-${eventId}`);
      if (savedImage) {
        setImage(savedImage);
      }
    } else {
      navigate("/auth");
    }
  }, [navigate, eventId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSave = () => {
    localStorage.setItem(`message-${eventId}`, message);
    if (image) {
      localStorage.setItem(`image-${eventId}`, image);
    } else {
      localStorage.removeItem(`image-${eventId}`);
    }
    toast({
      title: "Message Saved",
      description: "Your message has been saved successfully! ❤️",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  const eventTitles: Record<string, string> = {
    "first-meeting": "First Meeting",
    "first-date": "First Date",
    "made-official": "Made It Official",
    "first-trip": "First Trip Together",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      <div className="container max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Timeline
        </Link>

        <Card className="shadow-[var(--shadow-soft)] border-border/50">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Heart className="w-8 h-8 text-primary-foreground fill-current" />
              </div>
            </div>
            <CardTitle className="text-3xl font-serif">
              {eventTitles[eventId || ""] || "Write Your Message"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Share your thoughts and feelings about this special moment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here... What made this moment special? How did you feel?"
                className="min-h-[300px] resize-none transition-all duration-300 focus:shadow-[var(--shadow-soft)]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Image</span>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {image && (
                  <span className="text-sm text-muted-foreground">Image uploaded</span>
                )}
              </div>

              {image && (
                <div className="relative rounded-lg overflow-hidden border border-border/50">
                  <img src={image} alt="Uploaded memory" className="w-full h-auto" />
                  <Button
                    onClick={handleRemoveImage}
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 w-8 h-8 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-[var(--shadow-soft)]"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Message;
