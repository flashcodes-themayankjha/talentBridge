import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Briefcase, Search, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FcGoogle } from "react-icons/fc";
import { BsApple, BsLinkedin } from "react-icons/bs";

export default function Auth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"job_seeker" | "employer" | null>(null);
  
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: {
            full_name: signUpData.fullName,
            role: selectedRole,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Account created successfully!");
        navigate(selectedRole === "job_seeker" ? "/seeker-dashboard" : "/employer-dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: signInData.email,
        password: signInData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user profile to get role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profileError) throw profileError;

        toast.success("Signed in successfully!");
        navigate(profile.role === "job_seeker" ? "/seeker-dashboard" : "/employer-dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: "google" | "apple") => {
    if (!selectedRole) {
      toast.error("Please select a role first");
      return;
    }

    try {
      // Store role temporarily for OAuth callback
      localStorage.setItem("pendingRole", selectedRole);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `Failed to sign in with ${provider}`);
    }
  };

  const handleLinkedInAuth = async () => {
    if (!selectedRole) {
      toast.error("Please select a role first");
      return;
    }

    try {
      // Store role temporarily for OAuth callback
      localStorage.setItem("pendingRole", selectedRole);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with LinkedIn");
    }
  };

  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <ThemeToggle className="absolute top-4 right-4 z-10" />
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl bg-card rounded-3xl shadow-2xl overflow-hidden flex min-h-[600px]">
        {/* Sign In Panel */}
        <div
          className={`w-full md:w-1/2 p-12 flex flex-col justify-center transition-all duration-700 ${
            isSignUp ? "md:opacity-0 md:translate-x-[-100%]" : "md:opacity-100 md:translate-x-0"
          }`}
        >
          <h2 className="text-4xl font-bold mb-8 text-foreground">Sign In</h2>

          {/* Social Auth Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => handleSocialAuth("google")}
              className="flex-1 p-3 border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-center"
            >
              <FcGoogle size={24} />
            </button>
            <button
              onClick={() => handleSocialAuth("apple")}
              className="flex-1 p-3 border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-center"
            >
              <BsApple size={24} className="text-foreground" />
            </button>
            <button
              onClick={handleLinkedInAuth}
              className="flex-1 p-3 border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-center"
            >
              <BsLinkedin size={24} className="text-[#0A66C2]" />
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or use your email password</span>
            </div>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={signInData.email}
                onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                required
                className="h-12"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={signInData.password}
                onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg">
              {isLoading ? <Loader2 className="animate-spin" /> : "SIGN IN"}
            </Button>
          </form>
        </div>

        {/* Sign Up Panel */}
        <div
          className={`absolute md:relative w-full md:w-1/2 p-12 flex flex-col justify-center transition-all duration-700 bg-card ${
            isSignUp ? "md:opacity-100 md:translate-x-0" : "md:opacity-0 md:translate-x-full pointer-events-none md:pointer-events-auto"
          }`}
        >
          {!selectedRole ? (
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">Join Us</h2>
              <p className="text-muted-foreground">Choose your role to get started</p>
              
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedRole("job_seeker")}
                  className="w-full p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-accent transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Search className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">Job Seeker</h3>
                      <p className="text-sm text-muted-foreground">Find your dream job</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedRole("employer")}
                  className="w-full p-6 border-2 border-border rounded-xl hover:border-primary hover:bg-accent transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">Employer</h3>
                      <p className="text-sm text-muted-foreground">Find the best talent</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  ← Change role
                </button>
                <h2 className="text-4xl font-bold text-foreground">Sign Up</h2>
              </div>

              {/* Social Auth Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleSocialAuth("google")}
                  className="flex-1 p-3 border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-center"
                >
                  <FcGoogle size={24} />
                </button>
                <button
                  onClick={() => handleSocialAuth("apple")}
                  className="flex-1 p-3 border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-center"
                >
                  <BsApple size={24} className="text-foreground" />
                </button>
                <button
                  onClick={handleLinkedInAuth}
                  className="flex-1 p-3 border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-center"
                >
                  <BsLinkedin size={24} className="text-[#0A66C2]" />
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">or use your email</span>
                </div>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={signUpData.fullName}
                  onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                  required
                  className="h-12"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  required
                  className="h-12"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  required
                  className="h-12"
                />
                <Button type="submit" disabled={isLoading} className="w-full h-12 text-lg">
                  {isLoading ? <Loader2 className="animate-spin" /> : "SIGN UP"}
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Sliding Overlay Panel */}
        <div
          className={`hidden md:flex absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground transition-all duration-700 ${
            isSignUp ? "translate-x-[-100%]" : "translate-x-0"
          }`}
        >
          <div className="flex items-center justify-center w-full p-12 text-center">
            <div className="space-y-6">
              {!isSignUp ? (
                <>
                  <h2 className="text-5xl font-bold">Hello Friend!</h2>
                  <p className="text-lg opacity-90">
                    Register with your personal details to use all of site features
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSignUp(true)}
                    className="mt-6 px-12 py-6 text-lg border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    SIGN UP
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-5xl font-bold">Welcome Back!</h2>
                  <p className="text-lg opacity-90">
                    To keep connected with us please login with your personal info
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsSignUp(false)}
                    className="mt-6 px-12 py-6 text-lg border-2 border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    SIGN IN
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
