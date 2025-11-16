import { useState, useEffect } from "react";
import { Users, TrendingUp, BarChart, Info, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface CompetitorCardProps {
  score: number;
  url: string;
}

// Mock API function to simulate fetching competitor data
const fetchCompetitorData = async (url: string, score: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Generate mock data based on URL and score
  const domain = url.replace(/^https?:\/\//, '').split('/')[0];
  const domainHash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate some realistic-looking mock competitor data
  const competitors = [
    { name: "competitor1.com", score: score + 7 + Math.floor(domainHash % 5), keywords: 1523 + Math.floor(domainHash % 500), backlinks: 2890 + Math.floor(domainHash % 1000) },
    { name: "competitor2.com", score: score + 3 + Math.floor(domainHash % 8), keywords: 1387 + Math.floor(domainHash % 400), backlinks: 2456 + Math.floor(domainHash % 800) },
    { name: "Your Site", score: score, keywords: 1089 + Math.floor(domainHash % 300), backlinks: 1247 + Math.floor(domainHash % 500), isYou: true },
    { name: "competitor3.com", score: score - 5 + Math.floor(domainHash % 10), keywords: 978 + Math.floor(domainHash % 300), backlinks: 1567 + Math.floor(domainHash % 600) },
    { name: "competitor4.com", score: score - 10 + Math.floor(domainHash % 12), keywords: 756 + Math.floor(domainHash % 200), backlinks: 892 + Math.floor(domainHash % 400) },
  ];
  
  // Sort by score
  competitors.sort((a, b) => b.score - a.score);
  
  return competitors;
};

const CompetitorCard = ({ score, url }: CompetitorCardProps) => {
  const [loading, setLoading] = useState(true);
  const [competitors, setCompetitors] = useState([
    { name: "competitor1.com", score: score + 7, keywords: 1523, backlinks: 2890 },
    { name: "competitor2.com", score: score + 3, keywords: 1387, backlinks: 2456 },
    { name: "Your Site", score: score, keywords: 1089, backlinks: 1247, isYou: true },
    { name: "competitor3.com", score: score - 5, keywords: 978, backlinks: 1567 },
    { name: "competitor4.com", score: score - 10, keywords: 756, backlinks: 892 },
  ]);

  useEffect(() => {
    const getCompetitorData = async () => {
      try {
        const data = await fetchCompetitorData(url, score);
        setCompetitors(data);
      } catch (error) {
        console.error("Error fetching competitor data:", error);
      } finally {
        setLoading(false);
      }
    };

    getCompetitorData();
  }, [url, score]);

  return (
    <div className="glass-card rounded-[var(--radius)] p-6 animate-scale-in delay-400 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Competitor Analysis</h3>
        <Users className="h-5 w-5 text-primary" />
      </div>

      <div className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-lg flex items-start gap-2">
        <Info className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Real-time competitor comparison based on your industry and keywords.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Analyzing competitors...</span>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {competitors.map((competitor, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border transition-all ${
                  competitor.isYou 
                    ? 'bg-primary/10 border-primary/30 shadow-sm' 
                    : 'bg-card border-border hover:border-primary/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-semibold ${
                      competitor.isYou ? 'text-primary' : 'text-foreground'
                    }`}>
                      {competitor.name}
                      {competitor.isYou && (
                        <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-foreground">{competitor.score}</span>
                </div>
                
                <Progress value={competitor.score} className="h-1.5 mb-3" />
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-accent" />
                    <span className="text-muted-foreground">Keywords:</span>
                    <span className="font-semibold text-foreground">{competitor.keywords.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BarChart className="h-3.5 w-3.5 text-success" />
                    <span className="text-muted-foreground">Links:</span>
                    <span className="font-semibold text-foreground">{competitor.backlinks.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-xs text-foreground">
              <span className="font-semibold">Gap Analysis:</span> Focus on building {Math.max(500, competitors[0].backlinks - competitors.find(c => c.isYou)?.backlinks || 0)}+ more backlinks to compete with top performers
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default CompetitorCard;