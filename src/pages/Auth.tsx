import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import MyHeart from "@/components/ui/heart";

const Auth = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary client-side check - will be replaced with proper authentication
    if (password === "our-story") {
      localStorage.setItem("authenticated", "true");
      window.location.href = "/";
    } else {
      setError("Incorrect password. Try again ❤️");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-soft)]">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[var(--shadow-glow)]">
              <MyHeart className="w-8 h-8 text-primary-foreground fill-current" />
            </div>
          </div>
          <CardTitle className="text-3xl">Our Story</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter the password to unlock our timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Our first interaction..."
                className="retro-input transition-all duration-300 focus:shadow-[var(--shadow-soft)]"
              />
              {error && (
                <p className="text-sm text-destructive animate-fade-in">{error}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full from-primary to-accent transition-all duration-300 shadow-[var(--shadow-soft)] retro-btn"
            >
              Unlock Our Story
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
