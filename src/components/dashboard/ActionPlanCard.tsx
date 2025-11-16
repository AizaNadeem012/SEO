import { useState, useEffect } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import type { SEOAnalysisData } from "@/pages/Index";

interface ActionPlanCardProps {
  data: SEOAnalysisData;
}

const ActionPlanCard = ({ data }: ActionPlanCardProps) => {
  const [visibleItems, setVisibleItems] = useState(0);

  // Generate actions based on actual analysis data
  const actions: Array<{ title: string; priority: string; completed: boolean }> = [];

  // Title issues
  if (data.onPage.title.status === 'error') {
    actions.push({ title: "Add a title tag to your page", priority: "High", completed: false });
  } else if (data.onPage.title.status === 'warning') {
    actions.push({ title: `Optimize title length (current: ${data.onPage.title.length} chars)`, priority: "High", completed: false });
  } else {
    actions.push({ title: "Title tag is optimized", priority: "High", completed: true });
  }

  // Meta description issues
  if (data.onPage.metaDescription.status === 'error') {
    actions.push({ title: "Add a meta description", priority: "High", completed: false });
  } else if (data.onPage.metaDescription.status === 'warning') {
    actions.push({ title: `Optimize meta description length (current: ${data.onPage.metaDescription.length} chars)`, priority: "Medium", completed: false });
  } else {
    actions.push({ title: "Meta description is optimized", priority: "High", completed: true });
  }

  // Heading issues
  if (data.onPage.headings.h1 === 0) {
    actions.push({ title: "Add an H1 heading to your page", priority: "High", completed: false });
  } else if (data.onPage.headings.h1 > 1) {
    actions.push({ title: `Fix duplicate H1 tags (found ${data.onPage.headings.h1})`, priority: "High", completed: false });
  } else {
    actions.push({ title: "H1 heading structure is correct", priority: "High", completed: true });
  }

  // Image alt text
  if (data.onPage.images.missingAlt > 0) {
    actions.push({ title: `Add alt text to ${data.onPage.images.missingAlt} images`, priority: "High", completed: false });
  } else {
    actions.push({ title: "All images have alt text", priority: "High", completed: true });
  }

  // Content length
  if (data.content.wordCount < 300) {
    actions.push({ title: "Increase content length (target: 1000+ words)", priority: "High", completed: false });
  } else if (data.content.wordCount < 1000) {
    actions.push({ title: "Add more detailed content (current: " + data.content.wordCount + " words)", priority: "Medium", completed: false });
  } else {
    actions.push({ title: "Content length is optimal", priority: "High", completed: true });
  }

  // Readability
  if (data.content.readabilityScore < 60) {
    actions.push({ title: "Improve content readability (simplify language)", priority: "Medium", completed: false });
  } else {
    actions.push({ title: "Content readability is good", priority: "Medium", completed: true });
  }

  // Technical SEO
  if (!data.technical.hasRobotsTxt) {
    actions.push({ title: "Create and upload robots.txt file", priority: "Medium", completed: false });
  } else {
    actions.push({ title: "Robots.txt file exists", priority: "Medium", completed: true });
  }

  if (!data.technical.hasXmlSitemap) {
    actions.push({ title: "Create XML sitemap and submit to Google", priority: "Medium", completed: false });
  } else {
    actions.push({ title: "XML sitemap exists", priority: "Medium", completed: true });
  }

  // Load time
  if (data.technical.loadTime > 3000) {
    actions.push({ title: `Optimize page load speed (current: ${(data.technical.loadTime / 1000).toFixed(1)}s)`, priority: "High", completed: false });
  } else {
    actions.push({ title: "Page load speed is optimal", priority: "High", completed: true });
  }

  // Internal linking
  if (data.onPage.links.internal < 5) {
    actions.push({ title: "Improve internal linking structure", priority: "Medium", completed: false });
  } else {
    actions.push({ title: "Internal linking is good", priority: "Medium", completed: true });
  }

  // Schema markup - using optional chaining to safely access hasSchema
  const hasSchema = (data.technical as any).hasSchema;
  if (hasSchema) {
    actions.push({ title: "Schema markup is implemented", priority: "Medium", completed: true });
  } else {
    actions.push({ title: "Implement schema markup for better SERP appearance", priority: "Medium", completed: false });
  }

  // Image optimization - using optional chaining to safely access optimizedImages
  const optimizedImages = (data.technical as any).optimizedImages;
  if (optimizedImages) {
    actions.push({ title: "Images are optimized for web", priority: "Low", completed: true });
  } else {
    actions.push({ title: "Optimize images for web (compress & resize)", priority: "Low", completed: false });
  }

  // Sort by priority and completion status
  const sortedActions = actions.sort((a, b) => {
    // First sort by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then sort by priority
    const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  // Limit to 10 items
  const displayActions = sortedActions.slice(0, 10);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleItems((prev) => {
        if (prev >= displayActions.length) {
          clearInterval(timer);
          return displayActions.length;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [displayActions.length]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-destructive";
      case "Medium":
        return "text-warning";
      case "Low":
        return "text-muted-foreground";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="glass-card rounded-[var(--radius)] p-6 animate-scale-in delay-500 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-foreground mb-4">10-Step Action Plan</h3>

      <div className="space-y-3">
        {displayActions.map((action, index) => (
          <div
            key={index}
            className={`transition-all duration-300 ${
              index < visibleItems
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors group">
              <div className="flex-shrink-0 mt-0.5">
                {action.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium group-hover:text-primary transition-colors ${
                  action.completed ? "line-through text-muted-foreground" : "text-foreground"
                }`}>
                  {action.title}
                </p>
                <span className={`text-xs font-semibold ${getPriorityColor(action.priority)}`}>
                  {action.priority} Priority
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg">
        <p className="text-sm font-semibold text-primary mb-1">
          Current Score: {data.score}/100
        </p>
        <p className="text-xs text-muted-foreground">
          Complete high-priority items to improve your SEO score significantly
        </p>
      </div>
    </div>
  );
};

export default ActionPlanCard;