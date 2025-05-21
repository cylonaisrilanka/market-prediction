
// src/app/predict/page.tsx
'use client';

import {useState, useCallback, useEffect} from 'react';
import {predictTrendRenewal} from '@/ai/flows/predict-trend-renewal';
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
import {BrainCircuit, TrendingUp, BarChartBig, Info, UploadCloud, Home as HomeIcon} from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast'; // Import useToast


export default function PredictPage() {
  const [trendPrediction, setTrendPrediction] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Array<{name: string; sales: number}>>([]);
  const [productDescription, setProductDescription] = useState<string>('');
  const [trendAnalysis, setTrendAnalysis] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [location, setLocation] = useState('');
  const [ageSuitability, setAgeSuitability] = useState('');
  const [gender, setGender] = useState('');
  const [hasUploadedAndDetailed, setHasUploadedAndDetailed] = useState(false);
  const { toast } = useToast(); // Initialize toast

  const handleTrendPrediction = useCallback(async () => {
    if (!productDescription || !location || !ageSuitability || !gender) {
      // This case should ideally be prevented by UI logic, but good to have a guard
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please ensure product image is processed and all details (location, age, gender) are filled.",
      });
      return;
    }

    setIsPredicting(true);
    setTrendPrediction(null);
    setTrendAnalysis(null);
    setChartData([]);

    try {
      const predictionResult = await predictTrendRenewal({
        productDescription: productDescription,
        location: location,
        ageSuitability: ageSuitability,
        gender: gender,
      });
      setTrendPrediction(predictionResult.predictedTrend);
      setTrendAnalysis(predictionResult.trendAnalysis);

      const salesData = generateSalesData(predictionResult.predictedTrend, location, ageSuitability, gender);
      setChartData(salesData);
      toast({
        title: "Prediction Successful",
        description: "Market trend and sales forecast have been generated.",
      });
    } catch (error: any) {
      console.error('Error generating trend prediction:', error);
      setTrendPrediction('Failed to generate trend prediction.');
      setTrendAnalysis('Failed to generate trend analysis.');
      setChartData([]);
      toast({ // Added toast notification for error
        variant: "destructive",
        title: "Prediction Failed",
        description: error.message || "Could not generate trend prediction. Please try again.",
        duration: 6000,
      });
    } finally {
      setIsPredicting(false);
      // setHasUploadedAndDetailed(true); // This is already set by onUploadAndDetailsComplete
    }
  }, [productDescription, location, ageSuitability, gender, toast]);

    const generateSalesData = (
        prediction: string,
        loc: string,
        age: string,
        gen: string
    ): Array<{name: string; sales: number}> => {
        let baseSales = 1500;
        const today = new Date();
        const modifier = calculateSalesModifier(prediction, loc, age, gen);
        const trendMultiplier = getTrendMultiplier(prediction);
        const seasonality = [0.9, 1.0, 1.15, 1.25, 1.1]; 

        const simulatedData = Array.from({length: 5}, (_, i) => {
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const monthName = nextMonth.toLocaleString('default', {month: 'short'});
            // Ensure month sales calculation is robust
            let monthSales = baseSales * modifier * Math.pow(trendMultiplier, i) * seasonality[i] * (1 + (Math.random() * 0.15 - 0.075));
            monthSales = isNaN(monthSales) ? 50 : monthSales; // Fallback if NaN
            return {
                name: `${monthName} ' ${String(nextMonth.getFullYear()).slice(-2)}`,
                sales: Math.max(50, Math.round(monthSales)), // Ensure sales are at least 50
            };
        });
        return simulatedData;
    };

    const calculateSalesModifier = (prediction: string, loc: string, age: string, gen: string): number => {
        let modifier = 1.0;
        const predictionLower = prediction?.toLowerCase() || "";
        const locLower = loc?.toLowerCase() || "";
        const ageLower = age?.toLowerCase() || "";
        const genLower = gen?.toLowerCase() || "";

        if (predictionLower.includes('strong growth') || predictionLower.includes('high demand') || predictionLower.includes('very popular') || predictionLower.includes('significant renewal')) modifier += 0.6;
        else if (predictionLower.includes('moderate growth') || predictionLower.includes('stable') || predictionLower.includes('growing popularity') || predictionLower.includes('likely renewal')) modifier += 0.25;
        else if (predictionLower.includes('niche') || predictionLower.includes('emerging') || predictionLower.includes('potential renewal')) modifier += 0.1;
        else if (predictionLower.includes('decline') || predictionLower.includes('low demand') || predictionLower.includes('saturated') || predictionLower.includes('unlikely renewal')) modifier -= 0.5;

        if (['colombo', 'galle fort', 'kandy city', 'negombo'].some(city => locLower.includes(city)) || locLower.includes('urban') || locLower.includes('major city')) modifier += 0.25;
        else if (locLower.includes('suburban') || locLower.includes('major town')) modifier += 0.1;
        else if (locLower.includes('rural') || locLower.includes('village')) modifier -= 0.2;

        if (['teen', '15-19', 'young adult', '18-25', '20s', 'gen z'].some(term => ageLower.includes(term))) modifier += 0.3;
        else if (['25-35', '30s', 'millennial'].some(term => ageLower.includes(term))) modifier += 0.15;
        else if (['35-50', '40s', 'middle-aged', 'gen x'].some(term => ageLower.includes(term))) modifier -= 0.05;
        else if (['50+', 'senior', 'older', 'boomer'].some(term => ageLower.includes(term))) modifier -= 0.25;
        
        if (genLower === 'unisex' || genLower.includes('all gender')) modifier += 0.15;
        else if (genLower.includes('women') || genLower.includes('female')) modifier += 0.05;
        // else if (genLower.includes('men') || genLower.includes('male')) modifier -= 0.03; // Adjusted to be neutral or slightly positive for men

        if ((predictionLower.includes('growth') || predictionLower.includes('popular') || predictionLower.includes('renewal')) &&
            (['teen', 'young adult', '18-25', '20s'].some(term => ageLower.includes(term))) &&
            (locLower.includes('urban') || locLower.includes('major city'))) {
            modifier += 0.15;
        }
         if ((predictionLower.includes('niche')) &&
             (['50+', 'senior', 'older'].some(term => ageLower.includes(term))) &&
             (locLower.includes('rural'))) {
             modifier += 0.05; 
         }
        return Math.max(0.1, modifier);
    };

    const getTrendMultiplier = (prediction: string): number => {
        const predictionLower = prediction?.toLowerCase() || "";
        if (predictionLower.includes('strong growth') || predictionLower.includes('high demand') || predictionLower.includes('significant renewal')) return 1.18;
        if (predictionLower.includes('moderate growth') || predictionLower.includes('growing popularity') || predictionLower.includes('likely renewal')) return 1.08;
        if (predictionLower.includes('stable') || predictionLower.includes('potential renewal')) return 1.03;
        if (predictionLower.includes('niche') || predictionLower.includes('emerging')) return 1.01;
        if (predictionLower.includes('decline') || predictionLower.includes('low demand') || predictionLower.includes('unlikely renewal')) return 0.92;
        return 1.0; 
    };

  useEffect(() => {
    if (productDescription && location && ageSuitability && gender && hasUploadedAndDetailed && !isPredicting) { // Ensure not already predicting
      handleTrendPrediction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDescription, location, ageSuitability, gender, hasUploadedAndDetailed]); // Removed handleTrendPrediction from deps to avoid loop, isPredicting also removed as it's managed inside the effect/handler

  const onUploadAndDetailsComplete = useCallback(() => {
     setHasUploadedAndDetailed(true); 
  }, []);


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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-8 items-start"> {/* Added items-start */}
            <div className="lg:col-span-1 lg:sticky lg:top-20"> {/* Make form sticky on larger screens */}
              <ProductUploadForm
                setProductDescription={setProductDescription}
                setLocation={setLocation}
                setAgeSuitability={setAgeSuitability}
                setGender={setGender}
                isPredictingGlobal={isPredicting} // Pass global predicting state
                onUploadComplete={onUploadAndDetailsComplete}
              />
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 gap-4 md:gap-6 xl:gap-8">
              {(isPredicting || hasUploadedAndDetailed || trendPrediction || trendAnalysis || chartData.length > 0) && ( // Show if predicting OR any result exists
                <>
                   <Card className="shadow-lg border border-border/50 overflow-hidden bg-card/90 dark:bg-card/80 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                    <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 dark:to-transparent border-b border-border/30 p-4 sm:p-5">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold tracking-tight text-primary">
                        <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6 text-accent" strokeWidth={2.5}/>
                        <span>Market Trend Prediction</span>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm mt-1">AI-powered forecast based on your design and market factors.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 min-h-[60px] flex items-center">
                      {isPredicting && !trendPrediction ? ( // Show skeleton only if predicting AND no old prediction displayed
                        <div className="space-y-2 pt-1 w-full">
                          <Skeleton className="h-6 w-3/4 rounded bg-muted/50" />
                          <Skeleton className="h-4 w-1/2 rounded bg-muted/40" />
                        </div>
                      ) : trendPrediction ? (
                        <p className="text-lg sm:text-xl font-semibold text-foreground leading-snug">{trendPrediction}</p>
                      ) : (
                         <p className="text-muted-foreground italic">Upload details to see prediction.</p>
                      )}
                    </CardContent>
                  </Card>

                   <Card className="shadow-lg border border-border/50 overflow-hidden bg-card/90 dark:bg-card/80 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                    <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 dark:to-transparent border-b border-border/30 p-4 sm:p-5">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold tracking-tight text-primary">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent" strokeWidth={2.5}/>
                        <span>Trend Analysis</span>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm mt-1">Insights into the market dynamics influencing the prediction.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 min-h-[100px] flex items-center">
                      {isPredicting && !trendAnalysis ? ( // Show skeleton only if predicting AND no old analysis
                        <div className="space-y-3 pt-1 w-full">
                          <Skeleton className="h-4 w-full rounded bg-muted/50" />
                          <Skeleton className="h-4 w-full rounded bg-muted/40" />
                          <Skeleton className="h-4 w-5/6 rounded bg-muted/30" />
                        </div>
                      ) : trendAnalysis ? (
                        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{trendAnalysis}</p>
                      ) : (
                         <p className="text-muted-foreground italic">Upload details to see analysis.</p>
                      )}
                    </CardContent>
                  </Card>

                   <Card className="shadow-lg border border-border/50 overflow-hidden bg-card/90 dark:bg-card/80 rounded-xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30">
                    <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 dark:to-transparent border-b border-border/30 p-4 sm:p-5">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold tracking-tight text-primary">
                        <BarChartBig className="h-5 w-5 sm:h-6 sm:w-6 text-accent" strokeWidth={2.5}/>
                        <span>Predicted Sales Trend (Next 5 Months)</span>
                          <ShadTooltip delayDuration={100}>
                               <TooltipTrigger asChild>
                                   <Info size={16} className="text-muted-foreground cursor-help transition-colors hover:text-accent"/>
                               </TooltipTrigger>
                               <TooltipContent className="max-w-xs text-xs bg-card/90 backdrop-blur-sm border-accent/30 text-foreground" side="top">
                                 Estimated relative sales volume based on the predicted trend, location, age, and gender inputs. This is a simulation for illustrative purposes.
                               </TooltipContent>
                          </ShadTooltip>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm mt-1">Estimated sales volume based on predicted trends and inputs.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      {isPredicting && chartData.length === 0 ? ( // Show skeleton only if predicting AND no old chart data
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
                              tickFormatter={(value) => `${value}`}
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
                           <p className="text-muted-foreground italic text-center py-10">Upload details to see sales trend chart.</p>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
              {!hasUploadedAndDetailed && !isPredicting && (
                <Card className="shadow-lg border border-dashed border-border/40 bg-gradient-to-br from-muted/20 via-transparent to-muted/10 dark:from-muted/10 dark:via-transparent dark:to-muted/5 rounded-xl flex flex-col items-center justify-center min-h-[300px] lg:min-h-[calc(100vh-10rem)] transition-all duration-500 hover:shadow-primary/10 hover:border-primary/30">
                    <div className="text-center p-8 opacity-70 group-hover:opacity-100 transition-opacity">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4 transition-transform group-hover:scale-110" strokeWidth={1.5}/>
                        <p className="text-lg font-medium text-muted-foreground">Upload a Design to Begin</p>
                        <p className="text-sm text-muted-foreground/80 mt-1 max-w-xs mx-auto">Provide an image and details on the left to generate insights and predict market trends.</p>
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
