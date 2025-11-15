import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Search, Briefcase, Users, TrendingUp } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Check if this is a new OAuth user
        const pendingRole = localStorage.getItem("pendingRole");
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!profile && pendingRole) {
          // Create profile for OAuth user
          await supabase.from("profiles").insert({
            id: session.user.id,
            email: session.user.email!,
            full_name: session.user.user_metadata.full_name || session.user.user_metadata.name,
            role: pendingRole as "job_seeker" | "employer",
          });
          
          localStorage.removeItem("pendingRole");
          navigate(pendingRole === "job_seeker" ? "/seeker-dashboard" : "/employer-dashboard");
        } else if (profile) {
          navigate(profile.role === "job_seeker" ? "/seeker-dashboard" : "/employer-dashboard");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setIsAuthenticated(true);
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile) {
        navigate(profile.role === "job_seeker" ? "/seeker-dashboard" : "/employer-dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/50 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-hero-gradient bg-clip-text text-transparent">
            JobConnect
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!isAuthenticated && (
              <Button onClick={() => navigate("/auth")}>Get Started</Button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-hero-gradient bg-clip-text text-transparent">
            Connect Talent with Opportunity
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The modern platform where job seekers discover their dream careers and employers find exceptional talent
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="shadow-hero-glow" onClick={() => navigate("/auth")}>
              <Search className="mr-2 h-5 w-5" />
              Find Jobs
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              <Briefcase className="mr-2 h-5 w-5" />
              Post a Job
            </Button>
          </div>
        </section>

        <section className="bg-accent/50 py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Why Choose JobConnect?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-hero-glow transition-shadow">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">Vast Network</h4>
                <p className="text-muted-foreground">
                  Connect with thousands of companies and millions of job seekers worldwide
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-hero-glow transition-shadow">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">Smart Matching</h4>
                <p className="text-muted-foreground">
                  AI-powered recommendations to find the perfect match for skills and culture
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-lg hover:shadow-hero-glow transition-shadow">
                <Briefcase className="h-12 w-12 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">Easy Management</h4>
                <p className="text-muted-foreground">
                  Streamlined tools to manage applications, postings, and communications
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to Get Started?</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and companies already using JobConnect
          </p>
          <Button size="lg" className="shadow-hero-glow" onClick={() => navigate("/auth")}>
            Sign Up Now
          </Button>
        </section>
      </main>

      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 JobConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
