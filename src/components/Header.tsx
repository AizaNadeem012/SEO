import { useState, useEffect } from "react";
import { 
  Sparkles, Zap, Globe, TrendingUp, Menu, X, ChevronDown, 
  ArrowRight, BarChart3, Search, FileText, Settings, 
  CheckCircle, Star, Shield, ArrowUpRight
} from "lucide-react";

const Header = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const timer = setTimeout(() => setIsLoaded(true), 100);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Calculate parallax effect based on mouse position
  const calculateParallax = (factor: number) => {
    const x = (mousePosition.x - window.innerWidth / 2) * factor;
    const y = (mousePosition.y - window.innerHeight / 2) * factor;
    return { x, y };
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      name: "Analysis",
      href: "/analysis",
      icon: <Search className="h-4 w-4" />,
      dropdown: [
        { name: "On-Page SEO", href: "/analysis/on-page" },
        { name: "Technical SEO", href: "/analysis/technical" },
        { name: "Content Analysis", href: "/analysis/content" }
      ]
    },
    {
      name: "Backlinks",
      href: "/backlinks",
      icon: <Globe className="h-4 w-4" />
    },
    {
      name: "Competitors",
      href: "/competitors",
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      name: "Action Plan",
      href: "/action-plan",
      icon: <Zap className="h-4 w-4" />
    }
  ];

  return (
    <>
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-[#20B2AA]/20" 
          : "bg-white/95 backdrop-blur-md shadow-lg border-b border-[#20B2AA]/20"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#20B2AA] to-teal-500 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">SEOMatrix Bot</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.dropdown ? (
                    <button
                      className="flex items-center space-x-1 px-4 py-2 rounded-lg text-slate-700 hover:text-[#20B2AA] hover:bg-[#20B2AA]/10 transition-all duration-200"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`} />
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className="flex items-center space-x-1 px-4 py-2 rounded-lg text-slate-700 hover:text-[#20B2AA] hover:bg-[#20B2AA]/10 transition-all duration-200"
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </a>
                  )}
                  
                  {/* Dropdown Menu */}
                  {item.dropdown && activeDropdown === item.name && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-xl overflow-hidden border border-[#20B2AA]/20"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.dropdown.map((subItem) => (
                        <a
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-slate-700 hover:text-[#20B2AA] hover:bg-[#20B2AA]/10 transition-all duration-200"
                        >
                          {subItem.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#20B2AA] to-teal-500 text-white hover:from-[#20B2AA]/90 hover:to-teal-500/90 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-[#20B2AA]/25">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-96" : "max-h-0"
        }`}>
          <div className="px-4 py-2 space-y-1 bg-white/95 backdrop-blur-md">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.dropdown ? (
                  <div>
                    <button
                      className="flex items-center justify-between w-full px-4 py-2 rounded-lg text-slate-700 hover:text-[#20B2AA] hover:bg-[#20B2AA]/10 transition-all duration-200"
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === item.name ? "rotate-180" : ""
                      }`} />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="pl-6 pr-4 py-2 space-y-1">
                        {item.dropdown.map((subItem) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 rounded-lg text-slate-600 hover:text-[#20B2AA] hover:bg-[#20B2AA]/10 transition-all duration-200"
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center space-x-1 px-4 py-2 rounded-lg text-slate-700 hover:text-[#20B2AA] hover:bg-[#20B2AA]/10 transition-all duration-200"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </a>
                )}
              </div>
            ))}
            <button className="w-full mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#20B2AA] to-teal-500 text-white hover:from-[#20B2AA]/90 hover:to-teal-500/90 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-[#20B2AA]/25">
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - White Theme */}
      <header className="relative overflow-hidden bg-gradient-to-br from-white via-[#f0fdfa] to-white pt-24 md:pt-32 pb-32 md:pb-40">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(32, 178, 170, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(32, 178, 170, 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              transform: `translate(${calculateParallax(0.01).x}px, ${calculateParallax(0.01).y}px)`
            }}
          ></div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#20B2AA]/5 via-transparent to-teal-500/5"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-20 left-10 w-32 h-32 bg-[#20B2AA]/10 rounded-full blur-2xl"
            style={{
              transform: `translate(${calculateParallax(0.03).x}px, ${calculateParallax(0.03).y}px)`
            }}
          ></div>
          <div 
            className="absolute top-1/3 right-1/4 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl"
            style={{
              transform: `translate(${calculateParallax(0.02).x}px, ${calculateParallax(0.02).y}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-20 right-20 w-36 h-36 bg-[#20B2AA]/10 rounded-full blur-2xl"
            style={{
              transform: `translate(${calculateParallax(0.04).x}px, ${calculateParallax(0.04).y}px)`
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full bg-[#20B2AA]/10 backdrop-blur-sm border border-[#20B2AA]/20 transition-all duration-1000 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}>
              <Sparkles className="h-4 w-4 text-[#20B2AA] mr-2" />
              <span className="text-sm text-slate-700">AI-Powered SEO Analysis</span>
            </div>

            {/* Main Title */}
            <h1 
              className={`text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight transition-all duration-1000 delay-200 transform ${
                isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <span className="block text-slate-900">AIZA NADEEM</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-2 font-semibold text-[#20B2AA]">
                AI SEO & Backlink Intelligence
              </span>
            </h1>

            {/* Description */}
            <p className={`text-lg md:text-xl text-slate-600 font-light tracking-wide max-w-3xl mx-auto transition-all duration-1000 delay-400 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}>
              Analyze your website's SEO performance, identify improvement opportunities, and outrank your competitors with our AI-powered tools.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}>
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#20B2AA] to-teal-500 text-white hover:from-[#20B2AA]/90 hover:to-teal-500/90 transition-all duration-200 flex items-center justify-center space-x-2 group shadow-lg shadow-[#20B2AA]/25">
                <span>Start Analysis</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button className="px-8 py-3 rounded-lg border border-[#20B2AA]/30 text-slate-700 hover:bg-[#20B2AA]/10 transition-all duration-200">
                View Demo
              </button>
            </div>

            {/* Feature Pills */}
            <div className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 delay-600 transform ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white shadow-md border border-[#20B2AA]/20">
                <Globe className="h-4 w-4 text-[#20B2AA]" />
                <span className="text-sm text-slate-700">Analyze</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white shadow-md border border-[#20B2AA]/20">
                <TrendingUp className="h-4 w-4 text-teal-500" />
                <span className="text-sm text-slate-700">Improve</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white shadow-md border border-[#20B2AA]/20">
                <Zap className="h-4 w-4 text-teal-600" />
                <span className="text-sm text-slate-700">Rank</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className={`grid md:grid-cols-3 gap-6 mt-16 transition-all duration-1000 delay-700 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}>
            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#20B2AA]/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#20B2AA]/20 mb-4">
                <CheckCircle className="h-6 w-6 text-[#20B2AA]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Comprehensive Analysis</h3>
              <p className="text-slate-600">Get detailed insights into your website's SEO performance with our advanced analysis tools.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#20B2AA]/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#20B2AA]/20 mb-4">
                <Star className="h-6 w-6 text-[#20B2AA]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">AI-Powered Insights</h3>
              <p className="text-slate-600">Leverage artificial intelligence to uncover hidden opportunities and optimize your strategy.</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#20B2AA]/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#20B2AA]/20 mb-4">
                <Shield className="h-6 w-6 text-[#20B2AA]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Competitive Edge</h3>
              <p className="text-slate-600">Stay ahead of your competitors with real-time monitoring and strategic recommendations.</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;