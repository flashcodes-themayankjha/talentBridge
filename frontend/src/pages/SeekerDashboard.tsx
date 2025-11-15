import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { Search, Briefcase, BookmarkPlus, LogOut } from "lucide-react";

export default function SeekerDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    if (profile) {
      if (profile.role !== "job_seeker") {
        navigate("/employer-dashboard");
        return;
      }
      setUserName(profile.full_name || "");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">JobConnect</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h2>
          <p className="text-muted-foreground">Find your next opportunity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-hero-glow transition-shadow">
            <CardHeader>
              <Search className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Browse Jobs</CardTitle>
              <CardDescription>Discover thousands of job opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Explore Jobs</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-hero-glow transition-shadow">
            <CardHeader>
              <BookmarkPlus className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Saved Jobs</CardTitle>
              <CardDescription>View your bookmarked opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View Saved</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-hero-glow transition-shadow">
            <CardHeader>
              <Briefcase className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Applications</CardTitle>
              <CardDescription>Track your job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">My Applications</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recommended for You</CardTitle>
            <CardDescription>Jobs matching your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-1">Software Engineer</h3>
                  <p className="text-sm text-muted-foreground mb-2">Tech Company • Remote</p>
                  <p className="text-sm mb-3">
                    Join our team to build innovative solutions...
                  </p>
                  <Button size="sm">Apply Now</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
