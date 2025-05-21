
// src/app/predict/page.tsx
'use client';

import {useState, useCallback, useEffect} from 'react';
import {predictTrendRenewal, PredictTrendRenewalOutput} from '@/ai/flows/predict-trend-renewal';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {ProductUploadForm} from '@/components/product-upload-form';
import {Toaster} from '@/components/ui/toaster';
import {BrainCircuit, TrendingUp, BarChartBig, Info, UploadCloud, Home as HomeIcon, Activity, BarChartHorizontalBig, CheckCircle, AlertTriangle } from 'lucide-react';
import {Skeleton} from '@/components/ui/skeleton';
import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';


export default function PredictPage() {
  const [predictionOutput, setPredictionOutput] = useState<PredictTrendRenewalOutput | null>(null);
  const [chartData, setChartData] = useState<Array<{name: string; sales: number}>>([]);
  const [productDescription, setProductDescription] = useState<string>('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [location, setLocation] = useState('');
  const [ageSuitability, setAgeSuitability] = useState('');
  const [gender, setGender] = useState('');
  const [hasAttemptedPrediction, setHasAttemptedPrediction] = useState(false);
  const { toast } = useToast();

  const handleTrendPrediction = useCallback(async () => {
    if (!productDescription || !location || !ageSuitability || !gender) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please ensure product image is processed and all details (location, age, gender) are filled to generate a prediction.",
      });
      return;
    }

    setIsPredicting(true);
    setPredictionOutput(null);
    setChartData([]);
    setHasAttemptedPrediction(true);

    try {
      const result = await predictTrendRenewal({
        productDescription: productDescription,
        location: location,
        ageSuitability: ageSuitability,
        gender: gender,
      });
      setPredictionOutput(result);

      const salesData = generateSalesData(result.predictedTrend, result.marketSentiment, result.confidenceLevel, location, ageSuitability, gender);
      setChartData(salesData);
      toast({
        title: "Prediction Successful",
        description: "Market trend, analysis, and sales forecast have been generated.",
        variant: "default",
         icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    } catch (error: any) {
      console.error('Error generating trend prediction:', error);
      setPredictionOutput({ // Set a default error state for display
        predictedTrend: 'Prediction Failed',
        trendAnalysis: 'Could not generate trend analysis due to an error. Please check console or try again.',
        marketSentiment: 'Unknown',
        confidenceLevel: 'Low',
      });
      setChartData([]);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: error.message || "Could not generate trend prediction. Please try again.",
        duration: 7000,
        icon: <AlertTriangle className="h-5 w-5 text-destructive-foreground" />,
      });
    } finally {
      setIsPredicting(false);
    }
  }, [productDescription, location, ageSuitability, gender, toast]);

  const generateSalesData = (
    trend: string,
    sentiment: string,
    confidence: string,
    loc: string,
    age: string,
    gen: string
  ): Array<{name: string; sales: number}> => {
      let baseSales = 1000; // Initial base sales
      const today = new Date();
      let overallModifier = 1.0;
      let trendStrengthMultiplier = 1.0; // For month-over-month growth/decline

      // Adjust baseSales and overallModifier based on sentiment
      const sentimentLower = sentiment?.toLowerCase() || "neutral";
      if (sentimentLower.includes('very positive')) { baseSales *= 1.8; overallModifier += 0.7; }
      else if (sentimentLower.includes('positive')) { baseSales *= 1.4; overallModifier += 0.35; }
      else if (sentimentLower.includes('negative')) { baseSales *= 0.6; overallModifier -= 0.3; }
      else if (sentimentLower.includes('very negative')) { baseSales *= 0.3; overallModifier -= 0.6; }

      // Adjust trendStrengthMultiplier based on predictedTrend
      const trendLower = trend?.toLowerCase() || "";
      if (trendLower.includes('strong renewal') || trendLower.includes('high demand') || trendLower.includes('significant upswing')) { trendStrengthMultiplier = 1.20; overallModifier += 0.3; } // 20% monthly growth
      else if (trendLower.includes('moderate growth') || trendLower.includes('upswing possible') || trendLower.includes('growing popularity')) { trendStrengthMultiplier = 1.10; overallModifier += 0.15; } // 10% monthly growth
      else if (trendLower.includes('steady demand') || trendLower.includes('stable')) { trendStrengthMultiplier = 1.02; } // 2% slight growth
      else if (trendLower.includes('niche') || trendLower.includes('emerging')) { trendStrengthMultiplier = 1.05; overallModifier -=0.05} // 5% for emerging
      else if (trendLower.includes('fade') || trendLower.includes('decline') || trendLower.includes('low demand')) { trendStrengthMultiplier = 0.90; overallModifier -= 0.25; } // 10% monthly decline
      else {trendStrengthMultiplier = 1.00;} // Neutral trend if not specified

      // Further refine overallModifier by specific demographic and location factors (subtler adjustments)
      const locLower = loc?.toLowerCase() || "";
      if (['colombo', 'major urban center'].some(city => locLower.includes(city))) overallModifier += 0.1;
      else if (locLower.includes('rural')) overallModifier -= 0.1;

      const ageLower = age?.toLowerCase() || "";
      if (['teen', '18-25', 'young adult'].some(term => ageLower.includes(term))) overallModifier += 0.1;
      else if (['50+', 'senior'].some(term => ageLower.includes(term))) overallModifier -= 0.1;
      
      // Confidence adjustment
      const confidenceLower = confidence?.toLowerCase() || "medium";
      if (confidenceLower === 'low') overallModifier *= 0.8; // Reduce impact if confidence is low
      if (confidenceLower === 'high') overallModifier *= 1.1; // Slightly boost impact if confidence is high

      overallModifier = Math.max(0.2, Math.min(2.5, overallModifier)); // Clamp modifier

      const seasonality = [0.9, 1.0, 1.15, 1.25, 1.1]; // Example seasonality factor
      const simulatedData = Array.from({length: 5}, (_, i) => {
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
          const monthName = nextMonth.toLocaleString('default', {month: 'short'});
          let monthSales = baseSales * overallModifier * Math.pow(trendStrengthMultiplier, i) * seasonality[i % seasonality.length] * (1 + (Math.random() * 0.10 - 0.05)); // Add small randomness
          monthSales = isNaN(monthSales) || monthSales < 0 ? Math.max(10, baseSales * 0.1) : monthSales; // Fallback & ensure non-negative
          return {
              name: `${monthName} '${String(nextMonth.getFullYear()).slice(-2)}`,
              sales: Math.max(10, Math.round(monthSales)), // Ensure sales are at least some minimal value
          };
      });
      return simulatedData;
  };

  useEffect(() => {
    // This effect triggers prediction when all necessary inputs are available
    // It's called by onUploadAndDetailsComplete in the form
    if (productDescription && location && ageSuitability && gender && hasAttemptedPrediction && !isPredicting) {
      // Check if hasAttemptedPrediction is true which is set by onUploadAndDetailsComplete
      // and ensure we are not already predicting to avoid loops.
      handleTrendPrediction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDescription, location, ageSuitability, gender, hasAttemptedPrediction]); // Removed handleTrendPrediction, added hasAttemptedPrediction


  const onUploadAndDetailsComplete = useCallback(() => {
     setHasAttemptedPrediction(true); // This will trigger the useEffect above to call handleTrendPrediction
  }, []);


  const getSentimentBadgeVariant = (sentiment: string | undefined) => {
    const sentimentLower = sentiment?.toLowerCase() || "";
    if (sentimentLower.includes('very positive')) return 'success';
    if (sentimentLower.includes('positive')) return 'success';
    if (sentimentLower.includes('neutral')) return 'secondary';
    if (sentimentLower.includes('very negative')) return 'destructive';
    if (sentimentLower.includes('negative')) return 'destructive';
    return 'default';
  }
  const getConfidenceBadgeVariant = (confidence: string | undefined) => {
    const confidenceLower = confidence?.toLowerCase() || "";
    if (confidenceLower === 'high') return 'success';
    if (confidenceLower === 'medium') return 'warning';
    if (confidenceLower === 'low') return 'destructive';
    return 'default';
  }


  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-secondary/30 to-background dark:from-background dark:via-secondary/10 dark:to-background text-foreground">
        <header className="sticky top-0 z-50 flex items-center justify-between p-3 sm:p-4 bg-card/80 dark:bg-card/70 backdrop-blur-lg shadow-md border-b border-border/40">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-lg shadow-inner">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6 sm:h-7 sm:w-7"><path d="m12 3 4 4 2-2 4 4-6 6-4-4-2 2-4-4 6-6z"/><path d="m3 12 4 4 6-6 4 4 4-4"/></svg>
            </div>
             <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
               FashionFlow AI - Predict
             </h1>
          </div>
           <div className="flex items-center gap-2 sm:gap-4">
                 <Link href="/" passHref>
                     <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary/10 dark:hover:bg-primary/20">
                         <HomeIcon className="h-4 w-4" />
                         <span className="sr-only">Home</span>
                     </Button>
                 </Link>
              <ModeToggle />
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-8 items-start">
            <div className="lg:col-span-1 lg:sticky lg:top-20">
              <ProductUploadForm
                setProductDescription={setProductDescription}
                setLocation={setLocation}
                setAgeSuitability={setAgeSuitability}
                setGender={setGender}
                isPredictingGlobal={isPredicting}
                onUploadAndDetailsComplete={onUploadAndDetailsComplete}
              />
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 gap-4 md:gap-6 xl:gap-8">
              {(isPredicting || hasAttemptedPrediction) && (
                <>
                  <Card className="shadow-lg border border-border/50 overflow-hidden bg-card/90 dark:bg-card/80 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                    <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 dark:to-transparent border-b border-border/30 p-4 sm:p-5">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold tracking-tight text-primary">
                        <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6 text-accent" strokeWidth={2.5}/>
                        <span>Market Trend Prediction Summary</span>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm mt-1">AI-powered forecast based on your design and market factors.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 min-h-[80px] flex flex-col gap-3">
                      {isPredicting && !predictionOutput ? (
                        <div className="space-y-2 pt-1 w-full">
                          <Skeleton className="h-6 w-3/4 rounded bg-muted/50" />
                          <Skeleton className="h-4 w-1/2 rounded bg-muted/40" />
                          <Skeleton className="h-4 w-1/3 rounded bg-muted/30" />
                        </div>
                      ) : predictionOutput ? (
                        <>
                          <p className="text-lg sm:text-xl font-semibold text-foreground leading-snug">{predictionOutput.predictedTrend}</p>
                          <div className="flex flex-wrap gap-2 items-center text-sm">
                            <span className="text-muted-foreground">Market Sentiment:</span>
                            <Badge variant={getSentimentBadgeVariant(predictionOutput.marketSentiment)} className="text-xs px-2 py-0.5">{predictionOutput.marketSentiment}</Badge>
                            <span className="text-muted-foreground ml-2">Confidence:</span>
                            <Badge variant={getConfidenceBadgeVariant(predictionOutput.confidenceLevel)} className="text-xs px-2 py-0.5">{predictionOutput.confidenceLevel}</Badge>
                          </div>
                        </>
                      ) : (
                         <p className="text-muted-foreground italic">Provide design details to see prediction.</p>
                      )}
                    </CardContent>
                  </Card>

                   <Card className="shadow-lg border border-border/50 overflow-hidden bg-card/90 dark:bg-card/80 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                    <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 dark:to-transparent border-b border-border/30 p-4 sm:p-5">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold tracking-tight text-primary">
                        <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-accent" strokeWidth={2.5}/>
                        <span>Detailed Trend Analysis</span>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm mt-1">Insights into market dynamics, similar items, and influencing factors.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 min-h-[120px] flex items-center">
                      {isPredicting && !predictionOutput?.trendAnalysis ? (
                        <div className="space-y-3 pt-1 w-full">
                          <Skeleton className="h-4 w-full rounded bg-muted/50" />
                          <Skeleton className="h-4 w-full rounded bg-muted/40" />
                          <Skeleton className="h-4 w-5/6 rounded bg-muted/30" />
                           <Skeleton className="h-4 w-3/4 rounded bg-muted/30" />
                        </div>
                      ) : predictionOutput?.trendAnalysis ? (
                        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{predictionOutput.trendAnalysis}</p>
                      ) : (
                         <p className="text-muted-foreground italic">Detailed analysis will appear here.</p>
                      )}
                    </CardContent>
                  </Card>

                   <Card className="shadow-lg border border-border/50 overflow-hidden bg-card/90 dark:bg-card/80 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                    <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 dark:to-transparent border-b border-border/30 p-4 sm:p-5">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold tracking-tight text-primary">
                        <BarChartHorizontalBig className="h-5 w-5 sm:h-6 sm:w-6 text-accent" strokeWidth={2.5}/>
                        <span>Predicted Sales Trend (Next 5 Months)</span>
                          <ShadTooltip delayDuration={100}>
                               <TooltipTrigger asChild>
                                   <Info size={16} className="text-muted-foreground cursor-help transition-colors hover:text-accent"/>
                               </TooltipTrigger>
                               <TooltipContent className="max-w-xs text-xs bg-card/90 backdrop-blur-sm border-accent/30 text-foreground" side="top">
                                 Estimated relative sales volume based on the AI's predicted trend, market sentiment, confidence, and your inputs. This is a simulation for illustrative purposes.
                               </TooltipContent>
                          </ShadTooltip>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm mt-1">Visual forecast of potential sales volume over the next five months.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      {isPredicting && chartData.length === 0 ? (
                        <Skeleton className="h-[250px] sm:h-[300px] w-full rounded-md bg-gradient-to-br from-muted/50 to-muted/30" />
                      ) : chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartData} margin={{top: 5, right: 25, left: -15, bottom: 5}}>
                             <defs>
                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.6}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.2)" />
                            <XAxis
                              dataKey="name"
                              fontSize={11}
                              tick={{fill: 'hsl(var(--muted-foreground))'}}
                              axisLine={{stroke: 'hsl(var(--border)/0.3)'}}
                              tickLine={{stroke: 'hsl(var(--border)/0.3)'}}
                              dy={5}
                            />
                            <YAxis
                              fontSize={11}
                              tick={{fill: 'hsl(var(--muted-foreground))'}}
                              axisLine={{stroke: 'hsl(var(--border)/0.3)'}}
                              tickLine={{stroke: 'hsl(var(--border)/0.3)'}}
                              tickFormatter={(value) => `${value.toLocaleString()}`}
                              domain={['auto', 'auto']}
                              allowDecimals={false}
                            />
                            <Tooltip
                              cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1.5, strokeDasharray: "5 5" }}
                              contentStyle={{
                                backgroundColor: 'hsl(var(--card)/0.95)',
                                backdropFilter: 'blur(5px)',
                                borderColor: 'hsl(var(--accent)/0.5)',
                                borderRadius: 'var(--radius)',
                                color: 'hsl(var(--foreground))',
                                boxShadow: '0 6px 15px hsla(var(--accent)/0.15)',
                                padding: '10px 14px',
                              }}
                              itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '13px' }}
                              labelStyle={{ fontWeight: '600', marginBottom: '8px', color: 'hsl(var(--primary))', fontSize: '14px' }}
                              formatter={(value: number) => [`${value.toLocaleString()} units`, "Est. Sales"]}
                            />
                            <Legend wrapperStyle={{fontSize: '12px', paddingTop: '15px', color: 'hsl(var(--muted-foreground))'}}/>
                            <Line
                              type="monotone"
                              dataKey="sales"
                              stroke="hsl(var(--primary))"
                              strokeWidth={3}
                              dot={{ r: 5, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }}
                              activeDot={{ r: 7, strokeWidth: 2, fill: 'hsl(var(--accent))', stroke: 'hsl(var(--background))' }}
                              fillOpacity={1}
                              fill="url(#salesGradient)"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                           <p className="text-muted-foreground italic text-center py-10">Sales trend chart will appear here once prediction is generated.</p>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
              {!hasAttemptedPrediction && !isPredicting && (
                <Card className="shadow-lg border border-dashed border-border/40 bg-gradient-to-br from-muted/20 via-transparent to-muted/10 dark:from-muted/10 dark:via-transparent dark:to-muted/5 rounded-xl flex flex-col items-center justify-center min-h-[300px] lg:min-h-[calc(100vh-12rem)] transition-all duration-500 hover:shadow-primary/10 hover:border-primary/30 group">
                    <div className="text-center p-8 opacity-70 group-hover:opacity-100 transition-opacity">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4 transition-transform group-hover:scale-110" strokeWidth={1.5}/>
                        <p className="text-lg font-medium text-muted-foreground">Upload Your Design to Begin</p>
                        <p className="text-sm text-muted-foreground/80 mt-1 max-w-xs mx-auto">Provide an image and target market details on the left to generate AI-powered trend insights and sales forecasts.</p>
                    </div>
                </Card>
              )}
            </div>
          </div>
        </main>
        <Toaster />
         <footer className="text-center p-4 text-xs text-muted-foreground border-t border-border/20">
           © {new Date().getFullYear()} FashionFlow AI.
           <Link href="/" className="ml-2 underline hover:text-primary">Home</Link>
           <Link href="/about" className="ml-2 underline hover:text-primary">About</Link>
       </footer>
      </div>
     </TooltipProvider>
  );
}
