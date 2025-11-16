import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Code, TrendingUp, Headphones, Palette, Scale, Rocket, Building2, Zap, Users, BookOpen, MessageSquare, UserCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  const navigate = useNavigate();

  const jobCategories = [
    { name: "Development & IT", icon: Code },
    { name: "Marketing & Sales", icon: TrendingUp },
    { name: "Customer Service", icon: Headphones },
    { name: "Design & Creative", icon: Palette },
    { name: "Legal & Finance", icon: Scale },
    { name: "Product Management", icon: Rocket },
  ];

  const companyCategories = [
    { name: "Tech Companies", icon: Building2 },
    { name: "Startups", icon: Zap },
    { name: "Enterprise", icon: Building2 },
    { name: "Remote-First", icon: Users },
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="TalentBridge Logo" className="h-10 w-10 mr-2" />
              <span className="font-bold text-xl text-foreground">TalentBridge</span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {/* Jobs Dropdown */}
              <div
                className="relative group"
              >
                <button className="flex items-center text-foreground hover:text-primary transition-colors py-2">
                  Jobs <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-0 w-72 bg-card border border-border rounded-lg shadow-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <h3 className="font-semibold mb-3 text-primary text-base">Job Categories</h3>
                  <div className="space-y-1">
                    {jobCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div
                          key={category.name}
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer py-2 hover:bg-accent px-3 rounded-md transition-colors"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          <span>{category.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Companies Dropdown */}
              <div
                className="relative group"
              >
                <button className="flex items-center text-foreground hover:text-primary transition-colors py-2">
                  Companies <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-0 w-64 bg-card border border-border rounded-lg shadow-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <h3 className="font-semibold mb-3 text-primary text-base">Company Categories</h3>
                  <div className="space-y-1">
                    {companyCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div
                          key={category.name}
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer py-2 hover:bg-accent px-3 rounded-md transition-colors"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          <span>{category.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* About Us Dropdown */}
              <div
                className="relative group"
              >
                <button className="flex items-center text-foreground hover:text-primary transition-colors py-2">
                  About Us <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-0 w-48 bg-card border border-border rounded-lg shadow-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer py-2 hover:bg-accent px-3 rounded-md transition-colors">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>Our Story</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer py-2 hover:bg-accent px-3 rounded-md transition-colors">
                      <UserCircle className="h-4 w-4 text-primary" />
                      <span>Team</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer py-2 hover:bg-accent px-3 rounded-md transition-colors">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span>Blog</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="text-foreground hover:text-primary transition-colors">
                Career
              </button>
              <button className="text-foreground hover:text-primary transition-colors">
                Contact Us
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Login
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Post a Job
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
