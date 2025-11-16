import { useEffect, useState } from "react";
import { TrendingUp, Loader2 } from "lucide-react";

interface SEOScoreCardProps {
  score: number;
  url: string;
}

// Mock API function to simulate fetching SEO score
const fetchSEOScore = async (url: string, initialScore: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would fetch the actual score from an API
  // For now, we'll return the initial score with some slight variation to simulate real-time updates
  return initialScore + Math.floor(Math.random() * 5) - 2;
};

const SEOScoreCard = ({ score: initialScore, url }: SEOScoreCardProps) => {
  const [score, setScore] = useState(0);
  const [targetScore, setTargetScore] = useState(initialScore);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSEOScore = async () => {
      try {
        const freshScore = await fetchSEOScore(url, initialScore);
        setTargetScore(freshScore);
      } catch (error) {
        console.error("Error fetching SEO score:", error);
        setTargetScore(initialScore);
      } finally {
        setLoading(false);
      }
    };

    getSEOScore();
  }, [url, initialScore]);

  useEffect(() => {
    if (loading) return;
    
    const timer = setInterval(() => {
      setScore((prev) => {
        if (prev >= targetScore) {
          clearInterval(timer);
          return targetScore;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, [targetScore, loading]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-card rounded-[var(--radius)] p-6 animate-scale-in hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Technical SEO Score</h3>
        <TrendingUp className="h-5 w-5 text-primary" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Calculating SEO score...</span>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center py-6">
            <div className="relative w-40 h-40">
              {/* Background Circle */}
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress Circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="hsl(var(--primary))"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: "drop-shadow(0 0 8px hsl(var(--primary)))"
                  }}
                />
              </svg>
              
              {/* Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${getScoreColor(score)}`}>
                  {score}
                </span>
                <span className="text-sm text-muted-foreground">/ 100</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Performance</span>
              <span className="font-semibold text-success">Good</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Accessibility</span>
              <span className="font-semibold text-success">Excellent</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Best Practices</span>
              <span className="font-semibold text-warning">Needs Work</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SEOScoreCard;