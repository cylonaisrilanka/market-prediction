'use client';

import {useState, useCallback, useEffect} from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {ModeToggle} from '@/components/mode-toggle';
import {predictTrendRenewal} from '@/ai/flows/predict-trend-renewal';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
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
import {ProductUploadForm} from '@/components/product-upload-form'; // Ensure this import is present
import {Toaster} from '@/components/ui/toaster'; // Import Toaster

export default function Home() {
  const [trendPrediction, setTrendPrediction] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Array<{name: string; sales: number}>>([]);
  const [productDescription, setProductDescription] = useState<string>('');
  const [trendAnalysis, setTrendAnalysis] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false); // Add loading state for prediction
  const [location, setLocation] = useState('');
  const [ageSuitability, setAgeSuitability] = useState('');
  const [gender, setGender] = useState('');


  const handleTrendPrediction = useCallback(async () => {
    if (!productDescription || !location || !ageSuitability || !gender) {
      console.log('Please provide product description and all attributes.');
      // Optionally show a toast message to the user
      return;
    }
    setIsPredicting(true); // Start loading
    setTrendPrediction('Analyzing market trends...'); // Show loading message
    setTrendAnalysis(null); // Clear previous analysis
    setChartData([]); // Clear previous chart data

    try {
      const predictionResult = await predictTrendRenewal({
        productDescription: productDescription,
        location: location,
        ageSuitability: ageSuitability,
        gender: gender,
      });
      setTrendPrediction(predictionResult.predictedTrend);
      setTrendAnalysis(predictionResult.trendAnalysis);

      // Generate sales data based on prediction and inputs
      const salesData = generateSalesData(predictionResult.trendAnalysis, location, ageSuitability, gender);
      setChartData(salesData);
    } catch (error: any) {
      console.error('Error generating trend prediction:', error);
      setTrendPrediction('Failed to generate trend prediction');
      setTrendAnalysis('Failed to generate trend analysis.');
      setChartData([]); // Reset chart data on error
    } finally {
      setIsPredicting(false); // End loading
    }
  }, [productDescription, location, ageSuitability, gender]); // Add dependencies


  // Function to generate sales data based on trend analysis and attributes
  const generateSalesData = (
    trendAnalysis: string,
    location: string,
    ageSuitability: string,
    gender: string
  ) => {
    let baseSales = 100; // Base sales number
    const today = new Date();
    const modifier = calculateModifier(trendAnalysis, location, ageSuitability, gender);

    // Simulate data for the next 5 months
    const simulatedData = [];
    for (let i = 0; i < 5; i++) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + i, 1); // Start of next month
      const monthName = nextMonth.toLocaleString('default', {month: 'short'});
      // Calculate sales with modifier and add some randomness
      const sales = Math.max(0, Math.round(baseSales * (modifier + (Math.random() * 0.4 - 0.2)))); // Ensure sales are not negative
      simulatedData.push({name: `Month ${i + 1} (${monthName})`, sales});
    }

    return simulatedData;
  };

  // Function to calculate sales modifier based on analysis and attributes
  const calculateModifier = (
    trendAnalysis: string,
    location: string,
    ageSuitability: string,
    gender: string
  ) => {
    let modifier = 1; // Default modifier

    // Adjust based on trend analysis keywords
    if (trendAnalysis.toLowerCase().includes('high demand') || trendAnalysis.toLowerCase().includes('popular') || trendAnalysis.toLowerCase().includes('strong growth')) {
      modifier += 0.6;
    } else if (trendAnalysis.toLowerCase().includes('stable') || trendAnalysis.toLowerCase().includes('moderate growth')) {
        modifier += 0.2;
    } else if (trendAnalysis.toLowerCase().includes('niche') || trendAnalysis.toLowerCase().includes('emerging')) {
      modifier += 0.3;
    } else if (trendAnalysis.toLowerCase().includes('decline') || trendAnalysis.toLowerCase().includes('saturated') || trendAnalysis.toLowerCase().includes('low demand')) {
      modifier -= 0.4;
    }

     // Adjust based on location (example logic)
    if (location.toLowerCase().includes('urban') || location.toLowerCase().includes('colombo')) {
        modifier += 0.1;
    } else if (location.toLowerCase().includes('rural')) {
        modifier -= 0.05;
    }

     // Adjust based on age suitability (example logic)
    if (ageSuitability.toLowerCase().includes('young adult') || ageSuitability.toLowerCase().includes('teen')) {
        modifier += 0.15;
    } else if (ageSuitability.toLowerCase().includes('senior') || ageSuitability.toLowerCase().includes('older')) {
        modifier -= 0.1;
    }

     // Adjust based on gender (example logic)
    if (gender.toLowerCase() === 'unisex') {
        modifier += 0.05; // Slightly broader appeal potentially
    }


    return Math.max(0.1, modifier); // Ensure modifier doesn't go below a certain threshold
  };


  // Automatically trigger prediction when description and attributes are set
  useEffect(() => {
    if (productDescription && location && ageSuitability && gender) {
      handleTrendPrediction();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productDescription, location, ageSuitability, gender]); // Removed handleTrendPrediction from dependencies


  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Upload Fashion</SidebarMenuButton>
              </SidebarMenuItem>
              {/* Add other sidebar items if needed */}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-2 sm:p-4 md:p-6"> {/* Adjusted padding */}
          <div className="flex justify-end mb-4">
            <ModeToggle />
          </div>
          <ProductUploadForm
            setProductDescription={setProductDescription}
            setLocation={setLocation}
            setAgeSuitability={setAgeSuitability}
            setGender={setGender}
            isPredicting={isPredicting} // Pass loading state
          />

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Trend Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              {isPredicting ? (
                 <p>Analyzing market trends...</p>
              ): trendPrediction ? (
                <p>{trendPrediction}</p>
              ) : (
                <p>Upload a design and provide details to see the prediction.</p>
              )}
            </CardContent>
          </Card>

          {trendAnalysis && !isPredicting && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{trendAnalysis}</p>
              </CardContent>
            </Card>
          )}

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Predicted Sales Trend (Next 5 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              {isPredicting ? (
                 <p>Generating sales forecast...</p>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{top: 5, right: 20, left: 10, bottom: 5}}> {/* Adjusted margins */}
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} /> {/* Adjusted font size */}
                    <YAxis fontSize={12} /> {/* Adjusted font size */}
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(var(--primary))" // Use theme color
                      strokeWidth={2}
                      activeDot={{r: 8}}
                      dot={{r: 4}} // Smaller dots
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p>No sales data to display. Upload a design and details first.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
       <Toaster /> {/* Add Toaster component here */}
    </SidebarProvider>
  );
}
