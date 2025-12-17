import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Radio, ChartLine, FileText, Zap, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const { checkAuth, isAuthenticated, isLoading } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Radio className="h-12 w-12 text-brand" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Futuristic grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,238,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,238,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Glowing orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-20 right-1/4 w-80 h-80 bg-brand/15 rounded-full blur-[100px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/30 bg-brand/5 text-brand mb-8 animate-fade-in">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Analytics</span>
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Thinker<span className="text-brand">&</span>Builder
          </h1>

          <p
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Transform your YouTube podcast data into actionable insights with professional performance reports
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Button size="lg" onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")} className="group">
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            {isAuthenticated && (
              <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
                View Reports
              </Button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          {[
            {
              icon: ChartLine,
              title: "Real-time Analytics",
              desc: "Track views, subscribers, and engagement metrics in real-time",
            },
            { icon: FileText, title: "Pro Reports", desc: "Generate detailed Word documents with charts and insights" },
            { icon: Radio, title: "Scheduled Reports", desc: "Automate daily, weekly, or monthly report generation" },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-brand/20 bg-card/50 backdrop-blur-sm hover:border-brand/40 hover:bg-card/80 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${0.4 + i * 0.1}s` }}
            >
              <div className="p-3 rounded-xl bg-brand/10 w-fit mb-4 group-hover:bg-brand/20 transition-colors">
                <feature.icon className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Cyber line decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      </div>
    </div>
  );
};

export default Index;
