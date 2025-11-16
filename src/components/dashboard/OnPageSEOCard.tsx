import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface OnPageSEOCardProps {
  data: {
    title: { content: string; length: number; status: string };
    metaDescription: { content: string; length: number; status: string };
    headings: { h1: number; h2: number; h3: number; status: string };
    images: { total: number; missingAlt: number; status: string };
    links: { internal: number; external: number; status: string };
  };
}

// Mock API function to simulate fetching on-page SEO data
const fetchOnPageSEOData = async (initialData: OnPageSEOCardProps['data']) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would fetch fresh data from an API
  // For now, we'll return the initial data
  return initialData;
};

const OnPageSEOCard = ({ data }: OnPageSEOCardProps) => {
  const [loading, setLoading] = useState(true);
  const [onPageData, setOnPageData] = useState(data);

  useEffect(() => {
    const getOnPageData = async () => {
      try {
        const freshData = await fetchOnPageSEOData(data);
        setOnPageData(freshData);
      } catch (error) {
        console.error("Error fetching on-page SEO data:", error);
      } finally {
        setLoading(false);
      }
    };

    getOnPageData();
  }, [data]);

  const issues = [
    { 
      status: onPageData.title.status, 
      title: "Meta Title", 
      description: onPageData.title.content 
        ? `${onPageData.title.content.substring(0, 50)}... (${onPageData.title.length} characters)` 
        : "No title tag found"
    },
    { 
      status: onPageData.metaDescription.status, 
      title: "Meta Description", 
      description: onPageData.metaDescription.content 
        ? `${onPageData.metaDescription.content.substring(0, 60)}... (${onPageData.metaDescription.length} characters)` 
        : "No meta description found"
    },
    { 
      status: onPageData.headings.status, 
      title: "Heading Structure", 
      description: `H1: ${onPageData.headings.h1}, H2: ${onPageData.headings.h2}, H3: ${onPageData.headings.h3}${
        onPageData.headings.h1 > 1 ? " - Multiple H1 tags found" : onPageData.headings.h1 === 0 ? " - No H1 tag found" : ""
      }`
    },
    { 
      status: onPageData.images.status, 
      title: "Alt Text", 
      description: `${onPageData.images.total} images found, ${onPageData.images.missingAlt} missing alt attributes`
    },
    { 
      status: onPageData.links.status, 
      title: "Internal Links", 
      description: `${onPageData.links.internal} internal links, ${onPageData.links.external} external links`
    },
  ];

  const getIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case "error":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="glass-card rounded-[var(--radius)] p-6 animate-scale-in delay-100 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold text-foreground mb-4">On-Page SEO Audit</h3>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Analyzing on-page elements...</span>
        </div>
      ) : (
        <>
          <Accordion type="single" collapsible className="space-y-2">
            {issues.map((issue, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-3">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-3">
                    {getIcon(issue.status)}
                    <span className="text-sm font-medium text-foreground">{issue.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-3 text-sm text-muted-foreground">
                  {issue.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-4 p-3 bg-secondary rounded-lg">
            <p className="text-sm text-secondary-foreground">
              <span className="font-semibold">Priority:</span> Fix alt text and heading structure first
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default OnPageSEOCard;