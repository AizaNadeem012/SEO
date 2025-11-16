import { useState, useEffect } from "react";
import { FileText, Target, BarChart3, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ContentSEOCardProps {
  data: {
    wordCount: number;
    readabilityScore: number;
    keywords: Array<{ keyword: string; density: number }>;
  };
}

// Mock API function to simulate fetching content SEO data
const fetchContentSEOData = async (initialData: ContentSEOCardProps['data']) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, this would fetch fresh data from an API
  // For now, we'll return the initial data with some slight variations to simulate real-time updates
  return {
    wordCount: initialData.wordCount,
    readabilityScore: initialData.readabilityScore,
    keywords: initialData.keywords.map(kw => ({
      keyword: kw.keyword,
      density: parseFloat((kw.density + (Math.random() * 0.2 - 0.1)).toFixed(2))
    }))
  };
};

const ContentSEOCard = ({ data }: ContentSEOCardProps) => {
  const [loading, setLoading] = useState(true);
  const [contentData, setContentData] = useState(data);

  useEffect(() => {
    const getContentData = async () => {
      try {
        const freshData = await fetchContentSEOData(data);
        setContentData(freshData);
      } catch (error) {
        console.error("Error fetching content SEO data:", error);
      } finally {
        setLoading(false);
      }
    };

    getContentData();
  }, [data]);

  const keywords = contentData.keywords.map(kw => ({
    keyword: kw.keyword,
    density: kw.density,
    target: Math.max(2.0, kw.density * 1.2) // Target is 20% higher than current
  }));

  return (
    <div className="glass-card rounded-[var(--radius)] p-6 animate-scale-in delay-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Content SEO Audit</h3>
        <FileText className="h-5 w-5 text-primary" />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Analyzing content...</span>
        </div>
      ) : (
        <>
          {/* Readability Score */}
          <div className="mb-6 p-4 bg-secondary rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary-foreground">Readability Score</span>
              <span className={`text-lg font-bold ${
                contentData.readabilityScore >= 70 ? 'text-success' : 
                contentData.readabilityScore >= 50 ? 'text-warning' : 'text-destructive'
              }`}>
                {contentData.readabilityScore}/100
              </span>
            </div>
            <Progress value={contentData.readabilityScore} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {contentData.readabilityScore >= 70 ? 'Content is easy to read' :
               contentData.readabilityScore >= 50 ? 'Content is moderately easy to read' :
               'Content may be difficult to read'}
            </p>
          </div>

          {/* Keyword Density */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Target className="h-4 w-4" />
              <span>Keyword Density</span>
            </div>
            
            {keywords.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{item.keyword}</span>
                  <span className="font-semibold text-foreground">
                    {item.density}% / {item.target}%
                  </span>
                </div>
                <Progress 
                  value={(item.density / item.target) * 100} 
                  className="h-1.5"
                />
              </div>
            ))}
          </div>

          {/* Content Stats */}
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Word Count
              </span>
              <span className="font-semibold text-foreground">{contentData.wordCount.toLocaleString()} words</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Content Length</span>
              <span className={`font-semibold ${
                contentData.wordCount >= 1000 ? 'text-success' : 
                contentData.wordCount >= 300 ? 'text-warning' : 'text-destructive'
              }`}>
                {contentData.wordCount >= 1000 ? 'Good' : 
                 contentData.wordCount >= 300 ? 'Moderate' : 'Too Short'}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContentSEOCard;