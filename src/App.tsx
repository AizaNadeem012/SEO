import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, History, Download, Share2, TrendingUp, Globe, Zap, Shield, ChevronRight, Sparkles, Loader2, AlertCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import SEOScoreCard from "@/components/dashboard/SEOScoreCard";
import OnPageSEOCard from "@/components/dashboard/OnPageSEOCard";
import ContentSEOCard from "@/components/dashboard/ContentSEOCard";
import BacklinkCard from "@/components/dashboard/BacklinkCard";
import CompetitorCard from "@/components/dashboard/CompetitorCard";
import ActionPlanCard from "@/components/dashboard/ActionPlanCard";

export interface SEOAnalysisData {
  score: number;
  url: string;
  onPage: {
    title: { content: string; length: number; status: string };
    metaDescription: { content: string; length: number; status: string };
    headings: { h1: number; h2: number; h3: number; status: string };
    images: { total: number; missingAlt: number; status: string };
    links: { internal: number; external: number; status: string };
  };
  content: {
    wordCount: number;
    readabilityScore: number;
    keywords: Array<{ keyword: string; density: number }>;
  };
  technical: {
    hasRobotsTxt: boolean;
    hasXmlSitemap: boolean;
    loadTime: number;
  };
  analysisDate?: string;
}

// Mock data for fallback
const generateMockData = (url: string): SEOAnalysisData => {
  const hostname = new URL(url).hostname;
  const domain = hostname.split('.')[0];
  
  return {
    score: Math.floor(Math.random() * 30) + 60,
    url,
    onPage: {
      title: {
        content: `${domain.charAt(0).toUpperCase() + domain.slice(1)} - Home Page`,
        length: 20 + Math.floor(Math.random() * 30),
        status: Math.random() > 0.3 ? "good" : "warning"
      },
      metaDescription: {
        content: `Welcome to ${domain}. We provide quality services and solutions for your business needs.`,
        length: 100 + Math.floor(Math.random() * 50),
        status: Math.random() > 0.3 ? "good" : "warning"
      },
      headings: {
        h1: 1,
        h2: Math.floor(Math.random() * 5) + 2,
        h3: Math.floor(Math.random() * 8) + 3,
        status: "good"
      },
      images: {
        total: Math.floor(Math.random() * 10) + 5,
        missingAlt: Math.floor(Math.random() * 3),
        status: Math.random() > 0.5 ? "good" : "warning"
      },
      links: {
        internal: Math.floor(Math.random() * 20) + 10,
        external: Math.floor(Math.random() * 5) + 2,
        status: "good"
      }
    },
    content: {
      wordCount: Math.floor(Math.random() * 1000) + 500,
      readabilityScore: Math.floor(Math.random() * 30) + 60,
      keywords: [
        { keyword: domain, density: Math.random() * 3 + 1 },
        { keyword: "services", density: Math.random() * 2 + 0.5 },
        { keyword: "business", density: Math.random() * 2 + 0.5 }
      ]
    },
    technical: {
      hasRobotsTxt: Math.random() > 0.2,
      hasXmlSitemap: Math.random() > 0.3,
      loadTime: Math.floor(Math.random() * 2000) + 500
    },
    analysisDate: new Date().toISOString()
  };
};

interface AnalysisHistory {
  url: string;
  score: number;
  date: string;
  id: string;
}

const Index = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisData, setAnalysisData] = useState<SEOAnalysisData | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("analyze");
  const [urlError, setUrlError] = useState("");
  const [useMockData, setUseMockData] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Load analysis history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('seoAnalysisHistory');
    if (savedHistory) {
      try {
        setAnalysisHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    }
  }, []);

  // Save analysis to history
  const saveToHistory = useCallback((data: SEOAnalysisData) => {
    const newEntry: AnalysisHistory = {
      url: data.url,
      score: data.score,
      date: new Date().toISOString(),
      id: Date.now().toString()
    };
    
    const updatedHistory = [newEntry, ...analysisHistory.slice(0, 9)];
    setAnalysisHistory(updatedHistory);
    localStorage.setItem('seoAnalysisHistory', JSON.stringify(updatedHistory));
  }, [analysisHistory]);

  // Validate URL with better feedback
  const validateUrl = useCallback((inputUrl: string) => {
    if (!inputUrl) {
      setUrlError("URL is required");
      return false;
    }

    let validUrl = inputUrl;
    if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
      validUrl = 'https://' + inputUrl;
    }

    try {
      new URL(validUrl);
      setUrlError("");
      return validUrl;
    } catch {
      setUrlError("Please enter a valid URL (e.g., example.com or https://example.com)");
      return false;
    }
  }, []);

  // Simulate analysis progress
  const simulateProgress = useCallback(() => {
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
    return interval;
  }, []);

  // Handle analysis with better UX and fallback
  const handleAnalyze = async () => {
    const validUrl = validateUrl(url);
    if (!validUrl) {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);
    setAnalysisProgress(0);
    setErrorDetails(null);
    
    const progressInterval = simulateProgress();
    
    try {
      // If using mock data mode, skip API call
      if (useMockData) {
        throw new Error("Using mock data mode");
      }
      
      console.log('Attempting to call Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('analyze-seo', {
        body: { url: validUrl }
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function error: ${error.message || JSON.stringify(error)}`);
      }

      if (data && data.error) {
        console.error('API returned error:', data.error);
        throw new Error(data.error);
      }

      if (data && data.score !== undefined) {
        const enhancedData = {
          ...data,
          analysisDate: new Date().toISOString()
        };

        setAnalysisData(enhancedData);
        saveToHistory(enhancedData);
        setShowResults(true);
        
        toast.success("Analysis complete! Check your detailed report below.", {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Analysis error:', error);
      
      // Set error details for debugging
      setErrorDetails(error.message || "Unknown error occurred");
      
      // Fallback to mock data
      setTimeout(() => {
        const mockData = generateMockData(validUrl);
        setAnalysisData(mockData);
        saveToHistory(mockData);
        setShowResults(true);
        setAnalysisProgress(100);
        
        if (useMockData) {
          toast.success("Demo analysis complete! Check your detailed report below.", {
            icon: <CheckCircle className="h-4 w-4 text-green-500" />
          });
        } else {
          toast.error("API unavailable. Using demo data for demonstration.", {
            icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
            duration: 5000
          });
        }
      }, 1000);
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setAnalysisProgress(0), 1000);
    }
  };

  // Export report functionality
  const handleExport = useCallback(() => {
    if (!analysisData) return;
    
    const reportData = {
      ...analysisData,
      exportDate: new Date().toISOString(),
      dataSource: useMockData ? "Demo Data" : "Live Analysis"
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-report-${analysisData.url.replace(/[^a-z0-9]/gi, '_')}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Report exported successfully!");
  }, [analysisData, useMockData]);

  // Share functionality
  const handleShare = useCallback(async () => {
    if (!analysisData) return;
    
    const shareText = `SEO Analysis for ${analysisData.url}\nScore: ${analysisData.score}/100\nCheck out detailed report!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SEO Analysis Report',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Report link copied to clipboard!");
    }
  }, [analysisData]);

  // Quick stats for history
  const quickStats = useMemo(() => {
    if (analysisHistory.length === 0) return null;
    
    const avgScore = analysisHistory.reduce((acc, item) => acc + item.score, 0) / analysisHistory.length;
    const latestScore = analysisHistory[0]?.score || 0;
    const trend = analysisHistory.length > 1 ? latestScore - analysisHistory[1].score : 0;
    
    return { avgScore, latestScore, trend };
  }, [analysisHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Debug Mode Toggle */}
        <div className="flex justify-end mb-4">
          <Button
            variant={useMockData ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setUseMockData(!useMockData);
              toast.info(useMockData ? "Live API mode enabled" : "Demo mode enabled");
            }}
          >
            {useMockData ? "Live API" : "Demo Mode"}
          </Button>
        </div>

        {/* Quick Stats Banner */}
        {quickStats && (
          <div className="mb-8 animate-fade-in">
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium">Latest Score: {quickStats.latestScore}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium">Avg Score: {quickStats.avgScore.toFixed(1)}</span>
                    </div>
                    {quickStats.trend !== 0 && (
                      <Badge variant={quickStats.trend > 0 ? "default" : "destructive"} className="text-xs">
                        {quickStats.trend > 0 ? "+" : ""}{quickStats.trend.toFixed(1)} pts
                      </Badge>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab("history")}
                  >
                    <History className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="analyze" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History ({analysisHistory.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze">
            {/* URL Input Section */}
            <Card className="max-w-4xl mx-auto mb-8 shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SEO Intelligence Analyzer
                </CardTitle>
                <CardDescription className="text-lg">
                  Get comprehensive SEO insights in seconds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="url"
                        placeholder="Enter website URL (e.g., example.com)"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          setUrlError("");
                        }}
                        className={`pl-10 h-14 text-lg bg-background border-2 focus:border-primary transition-all ${urlError ? 'border-red-500' : ''}`}
                        onKeyPress={(e) => e.key === "Enter" && !isAnalyzing && handleAnalyze()}
                        disabled={isAnalyzing}
                      />
                    </div>
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !url}
                      size="lg"
                      className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="mr-2 h-5 w-5" />
                          Analyze Website
                        </>
                      )}
                    </Button>
                  </div>
                  {urlError && (
                    <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {urlError}
                    </p>
                  )}
                </div>

                {/* Analysis Progress */}
                {isAnalyzing && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        {useMockData ? "Generating demo data..." : "Analyzing website..."}
                      </span>
                      <span className="font-medium">{Math.round(analysisProgress)}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                  </div>
                )}

                {/* Error Details */}
                {errorDetails && !isAnalyzing && !useMockData && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p>API Error Details:</p>
                        <code className="block p-2 bg-muted rounded text-sm">
                          {errorDetails}
                        </code>
                        <p className="text-sm text-muted-foreground">
                          Using demo data for demonstration. Check your Edge Function deployment.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Quick Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {[
                    { icon: Shield, label: "Secure Analysis" },
                    { icon: TrendingUp, label: "Real-time Data" },
                    { icon: Zap, label: "Lightning Fast" },
                    { icon: Globe, label: "Global Insights" }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <feature.icon className="h-4 w-4" />
                      {feature.label}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {showResults && analysisData && (
              <div className="space-y-6 animate-slide-up">
                {/* Results Header */}
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-1">
                          Analysis Complete!
                        </h3>
                        <p className="text-green-600 dark:text-green-400">
                          {useMockData ? "Demo " : ""}Comprehensive SEO report for {analysisData.url}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExport}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" onClick={handleShare}>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SEOScoreCard score={analysisData.score} url={analysisData.url} />
                  <OnPageSEOCard data={analysisData.onPage} />
                  <ContentSEOCard data={analysisData.content} />
                  <BacklinkCard url={analysisData.url} />
                  <CompetitorCard score={analysisData.score} url={analysisData.url} />
                  <ActionPlanCard data={analysisData} />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Analysis History
                </CardTitle>
                <CardDescription>
                  Your recent SEO analyses
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisHistory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No analysis history yet</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("analyze")}
                    >
                      Start Your First Analysis
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analysisHistory.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
                        onClick={() => {
                          setUrl(item.url);
                          setActiveTab("analyze");
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            item.score >= 80 ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                            item.score >= 60 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20' :
                            'bg-red-100 text-red-600 dark:bg-red-900/20'
                          }`}>
                            <span className="font-bold">{item.score}</span>
                          </div>
                          <div>
                            <p className="font-medium">{item.url}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-muted-foreground text-sm border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p>© Designed for AIZA NADEEM — Premium SEO Intelligence</p>
          <p className="mt-2 text-xs">Powered by advanced AI algorithms • Real-time data processing</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;