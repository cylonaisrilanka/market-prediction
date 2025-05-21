
// src/app/predict/page.tsx
'use client';

import {useState, useCallback, useEffect} from 'react';
import {useRouter} from 'next/navigation'; // For redirecting
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
import {BrainCircuit, TrendingUp, BarChartBig, Info, UploadCloud, Home as HomeIcon, Activity, BarChartHorizontalBig, CheckCircle, AlertTriangle, Layers, Lightbulb, ListChecks, LogIn, UserCircle, LogOut } from 'lucide-react';
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
import { useAuth } from '@/contexts/auth-context'; // Import useAuth
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function PredictPage() {
  const [predictionOutput, setPredictionOutput] = useState<PredictTrendRenewalOutput | null>(null);
  const [chartData, setChartData] = useState<Array<{name: string; sales: number}>>([]);
  const [similarItemsChartData, setSimilarItemsChartData] = useState<Array<{name: string; sales: number}>>([]);
  const [salesSuggestions, setSalesSuggestions] = useState<string[]>([]);
  const [productDescription, setProductDescription] = useState<string>('');
  const [isPredicting, setIsPredicting] = useState(false);
  const [location, setLocation] = useState('');
  const [ageSuitability, setAgeSuitability] = useState('');
  const [gender, setGender] = useState('');
  const [hasAttemptedPrediction, setHasAttemptedPrediction] = useState(false);
  
  const { toast } = useToast();
  const { user, loading: authLoading, logOut } = useAuth(); // Get user and authLoading state
  const router = useRouter();

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/predict'); // Redirect to login if not authenticated
    }
  }, [user, authLoading, router]);


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
    setSimilarItemsChartData([]);
    setSalesSuggestions([]);
    setHasAttemptedPrediction(true);

    try {
      const result = await predictTrendRenewal({
        productDescription: productDescription,
        location: location,
        ageSuitability: ageSuitability,
        gender: gender,
      });
      setPredictionOutput(result);
      setSalesSuggestions(result.salesImprovementSuggestions || []);

      const mainSalesData = generateSalesData(result.predictedTrend, result.marketSentiment, result.confidenceLevel, location, ageSuitability, gender);
      setChartData(mainSalesData);

      if (result.similarItemsAnalysis) {
        const similarSalesData = generateSalesData(
          result.similarItemsAnalysis.trendIndicator, 
          result.similarItemsAnalysis.marketSentiment, 
          "Medium", 
          location, 
          ageSuitability, 
          gender 
        );
        setSimilarItemsChartData(similarSalesData);
      }

      toast({
        title: "Prediction Successful",
        description: "Market trend, analysis, and sales forecast have been generated.",
        variant: "default",
         icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    } catch (error: any) {
      console.error('Error generating trend prediction:', error);
      setPredictionOutput({ 
        predictedTrend: 'Prediction Failed',
        trendAnalysis: 'Could not generate trend analysis due to an error. Please check console or try again.',
        marketSentiment: 'Unknown',
        confidenceLevel: 'Low',
        similarItemsAnalysis: { trendIndicator: 'Unknown', marketSentiment: 'Unknown' },
        salesImprovementSuggestions: ['Could not generate suggestions due to an error.'],
      });
      setChartData([]);
      setSimilarItemsChartData([]);
      setSalesSuggestions(['Could not generate suggestions due to an error.']);
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
    trend: string | undefined,
    sentiment: string | undefined,
    confidence: string | undefined,
    loc: string,
    age: string,
    gen: string
  ): Array<{name: string; sales: number}> => {
      let baseSales = 1000; 
      const today = new Date();
      let overallModifier = 1.0;
      let trendStrengthMultiplier = 1.0;

      const sentimentLower = sentiment?.toLowerCase() || "neutral";
      if (sentimentLower.includes('very positive')) { baseSales *= 1.8; overallModifier += 0.7; }
      else if (sentimentLower.includes('positive')) { baseSales *= 1.4; overallModifier += 0.35; }
      else if (sentimentLower.includes('negative')) { baseSales *= 0.6; overallModifier -= 0.3; }
      else if (sentimentLower.includes('very negative')) { baseSales *= 0.3; overallModifier -= 0.6; }

      const trendLower = trend?.toLowerCase() || "";
      if (['strong renewal likely', 'high demand', 'significant upswing', 'strong growth'].some(term => trendLower.includes(term))) { trendStrengthMultiplier = 1.20; overallModifier += 0.3; }
      else if (['moderate growth', 'upswing possible', 'growing popularity'].some(term => trendLower.includes(term))) { trendStrengthMultiplier = 1.10; overallModifier += 0.15; }
      else if (['steady demand foreseen', 'stable'].some(term => trendLower.includes(term))) { trendStrengthMultiplier = 1.02; }
      else if (['niche', 'emerging', 'mixed/volatile'].some(term => trendLower.includes(term))) { trendStrengthMultiplier = 1.05; overallModifier -=0.05}
      else if (['trend expected to fade', 'decline', 'low demand', 'moderate decline', 'strong decline'].some(term => trendLower.includes(term))) { trendStrengthMultiplier = 0.90; overallModifier -= 0.25; }
      else {trendStrengthMultiplier = 1.00;} 

      const locLower = loc?.toLowerCase() || "";
      if (['colombo', 'major urban center'].some(city => locLower.includes(city))) overallModifier += 0.1;
      else if (locLower.includes('rural')) overallModifier -= 0.1;

      const ageLower = age?.toLowerCase() || "";
      if (['teen', '18-25', 'young adult'].some(term => ageLower.includes(term))) overallModifier += 0.1;
      else if (['50+', 'senior'].some(term => ageLower.includes(term))) overallModifier -= 0.1;
      
      const confidenceLower = confidence?.toLowerCase() || "medium";
      if (confidenceLower === 'low') overallModifier *= 0.8; 
      if (confidenceLower === 'high') overallModifier *= 1.1; 

      overallModifier = Math.max(0.2, Math.min(2.5, overallModifier)); 

      const seasonality = [0.9, 1.0, 1.15, 1.25, 1.1]; 
      const simulatedData = Array.from({length: 5}, (_, i) => {
          const nextMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
          const monthName = nextMonth.toLocaleString('default', {month: 'short'});
          let monthSales = baseSales * overallModifier * Math.pow(trendStrengthMultiplier, i) * seasonality[i % seasonality.length] * (1 + (Math.random() * 0.10 - 0.05)); 
          monthSales = isNaN(monthSales) || monthSales < 0 ? Math.max(10, baseSales * 0.1) : monthSales; 
          return {
              name: `${monthName} '${String(nextMonth.getFullYear()).slice(-2)}`,
              sales: Math.max(10, Math.round(monthSales)), 
          };
      });
      return simulatedData;
  };

  useEffect(() => {
    if (user && productDescription && location && ageSuitability && gender && hasAttemptedPrediction && !isPredicting) {
      handleTrendPrediction();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, productDescription, location, ageSuitability, gender, hasAttemptedPrediction]); 


  const onUploadAndDetailsComplete = useCallback(() => {
     setHasAttemptedPrediction(true); 
  }, []);


  const getSentimentBadgeVariant = (sentiment: string | undefined): "default" | "secondary" | "destructive" | "success" | "warning" => {
    const sentimentLower = sentiment?.toLowerCase() || "";
    if (sentimentLower.includes('very positive')) return 'success';
    if (sentimentLower.includes('positive')) return 'success';
    if (sentimentLower.includes('neutral')) return 'secondary';
    if (sentimentLower.includes('very negative')) return 'destructive';
    if (sentimentLower.includes('negative')) return 'destructive';
    return 'default';
  }
  const getConfidenceBadgeVariant = (confidence: string | undefined): "default" | "secondary" | "destructive" | "success" | "warning" => {
    const confidenceLower = confidence?.toLowerCase() || "";
    if (confidenceLower === 'high') return 'success';
    if (confidenceLower === 'medium') return 'warning';
    if (confidenceLower === 'low') return 'destructive';
    return 'default';
  }

  const getTrendIndicatorBadgeVariant = (trendIndicator: string | undefined): "default" | "secondary" | "destructive" | "success" | "warning" => {
    const indicatorLower = trendIndicator?.toLowerCase() || "";
    if (indicatorLower.includes('strong growth') || indicatorLower.includes('moderate growth')) return 'success';
    if (indicatorLower.includes('stable')) return 'secondary';
    if (indicatorLower.includes('moderate decline') || indicatorLower.includes('strong decline')) return 'destructive';
    if (indicatorLower.includes('mixed/volatile')) return 'warning';
    return 'default';
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background">
        <BrainCircuit className="h-16 w-16 text-primary animate-pulse" />
      </div>
    );
  }

  if (!user) {
    // This will typically be handled by the useEffect redirect, but it's a fallback.
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4">
        <Card className="w-full max-w-md text-center p-8">
          <CardTitle className="text-2xl text-primary">Access Denied</CardTitle>
          <CardDescription className="mt-2 mb-4 text-muted-foreground">Please log in to access the prediction tool.</CardDescription>
          <Link href="/login?redirect=/predict">
            <Button>Go to Login</Button>
          </Link>
        </Card>
      </div>
    );
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
                {!authLoading && user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="px-2 sm:px-3 hover:bg-primary/10 dark:hover:bg-primary/20">
                          <UserCircle className="mr-1 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">My Account</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="text-xs text-muted-foreground">{user.email}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logOut} className="cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : !authLoading ? (
                    <Link href="/login" passHref>
                      <Button variant="outline" size="sm" className="hover:bg-accent/10 dark:hover:bg-accent/20 border-primary/50 text-primary hover:text-accent-foreground">
                        <LogIn className="mr-1 sm:mr-2 h-4 w-4" /> Login
                      </Button>
                    </Link>
                  ) : null}
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
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent" strokeWidth={2.5}/>
                        <span>Uploaded Item: Market Trend Prediction</span>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm mt-1">AI-powered forecast for your specific design and market factors.</CardDescription>
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
                        <span>Uploaded Item: Detailed Trend Analysis</span>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm mt-1">Insights into market dynamics, influencing factors, and similar items for your design.</CardDescription>
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
                    <CardHeader className="bg-gradient-to-r from-green-500/10 via-primary/5 to-transparent dark:from-green-500/20 dark:via-primary/10 dark:to-transparent border-b border-border/30 p-4 sm:p-5">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold tracking-tight text-green-600 dark:text-green-500">
                        <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 dark:text-yellow-400" strokeWidth={2.5}/>
                        <span>Sales Enhancement Strategies</span>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm mt-1">AI-generated suggestions to potentially boost your design's market performance.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 min-h-[100px]">
                      {isPredicting && salesSuggestions.length === 0 ? (
                        <div className="space-y-3 pt-1 w-full">
                          <Skeleton className="h-4 w-full rounded bg-muted/50" />
                          <Skeleton className="h-4 w-5/6 rounded bg-muted/40" />
                          <Skeleton className="h-4 w-3/4 rounded bg-muted/30" />
                        </div>
                      ) : salesSuggestions.length > 0 ? (
                        <ul className="space-y-2.5 text-foreground/90 text-sm sm:text-base">
                          {salesSuggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2.5">
                              <ListChecks className="h-5 w-5 text-green-500 mt-0.5 shrink-0" strokeWidth={2}/>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                         <p className="text-muted-foreground italic">Actionable suggestions will appear here.</p>
                      )}
                    </CardContent>
                  </Card>


                   <Card className="shadow-lg border border-border/50 overflow-hidden bg-card/90 dark:bg-card/80 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                    <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 dark:to-transparent border-b border-border/30 p-4 sm:p-5">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold tracking-tight text-primary">
                        <BarChartHorizontalBig className="h-5 w-5 sm:h-6 sm:w-6 text-accent" strokeWidth={2.5}/>
                        <span>Uploaded Item: Predicted Sales Trend (Next 5 Months)</span>
                          <ShadTooltip delayDuration={100}>
                               <TooltipTrigger asChild>
                                   <Info size={16} className="text-muted-foreground cursor-help transition-colors hover:text-accent"/>
                               </TooltipTrigger>
                               <TooltipContent className="max-w-xs text-xs bg-card/90 backdrop-blur-sm border-accent/30 text-foreground" side="top">
                                 Estimated relative sales volume for your uploaded item based on the AI's prediction. This is a simulation for illustrative purposes.
                               </TooltipContent>
                          </ShadTooltip>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm mt-1">Visual forecast of potential sales volume for your design over the next five months.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      {isPredicting && chartData.length === 0 && predictionOutput ? ( 
                        <Skeleton className="h-[250px] sm:h-[300px] w-full rounded-md bg-gradient-to-br from-muted/50 to-muted/30" />
                      ) : chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={chartData} margin={{top: 5, right: 25, left: -15, bottom: 5}}>
                             <defs>
                                <linearGradient id="salesGradientMain" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.2)" />
                            <XAxis dataKey="name" fontSize={11} tick={{fill: 'hsl(var(--muted-foreground))'}} axisLine={{stroke: 'hsl(var(--border)/0.3)'}} tickLine={{stroke: 'hsl(var(--border)/0.3)'}} dy={5} />
                            <YAxis fontSize={11} tick={{fill: 'hsl(var(--muted-foreground))'}} axisLine={{stroke: 'hsl(var(--border)/0.3)'}} tickLine={{stroke: 'hsl(var(--border)/0.3)'}} tickFormatter={(value) => `${value.toLocaleString()}`} domain={['auto', 'auto']} allowDecimals={false} />
                            <Tooltip cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1.5, strokeDasharray: "5 5" }} contentStyle={{ backgroundColor: 'hsl(var(--card)/0.95)', backdropFilter: 'blur(5px)', borderColor: 'hsl(var(--primary)/0.5)', borderRadius: 'var(--radius)', color: 'hsl(var(--foreground))', boxShadow: '0 6px 15px hsla(var(--primary)/0.15)', padding: '10px 14px', }} itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '13px' }} labelStyle={{ fontWeight: '600', marginBottom: '8px', color: 'hsl(var(--primary))', fontSize: '14px' }} formatter={(value: number) => [`${value.toLocaleString()} units`, "Est. Sales (Uploaded Item)"]} />
                            <Legend wrapperStyle={{fontSize: '12px', paddingTop: '15px', color: 'hsl(var(--muted-foreground))'}}/>
                            <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 5, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }} activeDot={{ r: 7, strokeWidth: 2, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))' }} fillOpacity={1} fill="url(#salesGradientMain)" name="Uploaded Item Sales" />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                           <p className="text-muted-foreground italic text-center py-10">Sales trend chart for uploaded item will appear here once prediction is generated.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border border-border/50 overflow-hidden bg-card/90 dark:bg-card/80 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-accent/30">
                    <CardHeader className="bg-gradient-to-r from-accent/10 via-secondary/5 to-transparent dark:from-accent/20 dark:via-secondary/10 dark:to-transparent border-b border-border/30 p-4 sm:p-5">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold tracking-tight text-accent">
                        <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-primary" strokeWidth={2.5}/>
                        <span>Similar Items/Category: Market Outlook</span>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm mt-1">General trend and sentiment for similar items in the market.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 space-y-4">
                       {isPredicting && !predictionOutput?.similarItemsAnalysis ? (
                         <div className="space-y-2 pt-1 w-full min-h-[60px]">
                           <Skeleton className="h-5 w-2/3 rounded bg-muted/50" />
                           <Skeleton className="h-4 w-1/2 rounded bg-muted/40" />
                         </div>
                       ) : predictionOutput?.similarItemsAnalysis ? (
                         <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-sm">
                           <span className="text-muted-foreground">General Trend:</span>
                           <Badge variant={getTrendIndicatorBadgeVariant(predictionOutput.similarItemsAnalysis.trendIndicator)} className="text-xs px-2 py-0.5">
                             {predictionOutput.similarItemsAnalysis.trendIndicator}
                           </Badge>
                           <span className="text-muted-foreground sm:ml-2">Market Sentiment:</span>
                           <Badge variant={getSentimentBadgeVariant(predictionOutput.similarItemsAnalysis.marketSentiment)} className="text-xs px-2 py-0.5">
                             {predictionOutput.similarItemsAnalysis.marketSentiment}
                           </Badge>
                         </div>
                       ) : (
                          <p className="text-muted-foreground italic min-h-[60px] flex items-center">Outlook for similar items will appear here.</p>
                       )}

                      {isPredicting && similarItemsChartData.length === 0 && predictionOutput ? (
                        <Skeleton className="h-[250px] sm:h-[300px] w-full rounded-md bg-gradient-to-br from-muted/40 to-muted/20" />
                      ) : similarItemsChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={similarItemsChartData} margin={{top: 5, right: 25, left: -15, bottom: 5}}>
                            <defs>
                               <linearGradient id="salesGradientSimilar" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.6}/>
                                 <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.2)" />
                            <XAxis dataKey="name" fontSize={11} tick={{fill: 'hsl(var(--muted-foreground))'}} axisLine={{stroke: 'hsl(var(--border)/0.3)'}} tickLine={{stroke: 'hsl(var(--border)/0.3)'}} dy={5}/>
                            <YAxis fontSize={11} tick={{fill: 'hsl(var(--muted-foreground))'}} axisLine={{stroke: 'hsl(var(--border)/0.3)'}} tickLine={{stroke: 'hsl(var(--border)/0.3)'}} tickFormatter={(value) => `${value.toLocaleString()}`} domain={['auto', 'auto']} allowDecimals={false} />
                            <Tooltip cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1.5, strokeDasharray: "5 5" }} contentStyle={{ backgroundColor: 'hsl(var(--card)/0.95)', backdropFilter: 'blur(5px)', borderColor: 'hsl(var(--accent)/0.5)', borderRadius: 'var(--radius)', color: 'hsl(var(--foreground))', boxShadow: '0 6px 15px hsla(var(--accent)/0.15)', padding: '10px 14px', }} itemStyle={{ color: 'hsl(var(--foreground))', fontSize: '13px' }} labelStyle={{ fontWeight: '600', marginBottom: '8px', color: 'hsl(var(--accent))', fontSize: '14px' }} formatter={(value: number) => [`${value.toLocaleString()} units`, "Est. Sales (Similar Items)"]}/>
                            <Legend wrapperStyle={{fontSize: '12px', paddingTop: '15px', color: 'hsl(var(--muted-foreground))'}}/>
                            <Line type="monotone" dataKey="sales" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 5, fill: 'hsl(var(--accent))', stroke: 'hsl(var(--background))', strokeWidth: 2 }} activeDot={{ r: 7, strokeWidth: 2, fill: 'hsl(var(--accent))', stroke: 'hsl(var(--background))' }} fillOpacity={1} fill="url(#salesGradientSimilar)" name="Similar Items Sales"/>
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-muted-foreground italic text-center py-10">Sales trend chart for similar items will appear here.</p>
                      )}
                    </CardContent>
                  </Card>

                </>
              )}
              {!hasAttemptedPrediction && !isPredicting && (
                <Card className="shadow-lg border border-dashed border-border/40 bg-gradient-to-br from-muted/20 via-transparent to-muted/10 dark:from-muted/10 dark:via-transparent dark:to-muted/5 rounded-xl flex flex-col items-center justify-center min-h-[300px] lg:min-h-[calc(100vh-10rem)] transition-all duration-500 hover:shadow-primary/10 hover:border-primary/30 group">
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
         <footer className="text-center p-4 text-xs text-muted-foreground border-t border-border/20">
           © {new Date().getFullYear()} FashionFlow AI.
           <Link href="/" className="ml-2 underline hover:text-primary">Home</Link>
           <Link href="/about" className="ml-2 underline hover:text-primary">About</Link>
       </footer>
      </div>
     </TooltipProvider>
  );
}
