'use client';

import {useState, useCallback} from 'react';
import {ProductUploadForm} from '@/components/product-upload-form';
import {SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {ModeToggle} from '@/components/mode-toggle';
import {predictTrendRenewal} from '@/ai/flows/predict-trend-renewal';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function Home() {
  const [trendPrediction, setTrendPrediction] = useState<string | null>(null);
  const [chartData, setChartData] = useState<Array<{ name: string; sales: number }>>([]);
	const [productDescription, setProductDescription] = useState<string>('');
  const [trendAnalysis, setTrendAnalysis] = useState<string | null>(null);


  const handleTrendPrediction = useCallback(async () => {
    if (!productDescription) {
			console.log('Please provide a product description.');
      return;
    }
    try {
      const predictionResult = await predictTrendRenewal({ productDescription: productDescription });
      setTrendPrediction(predictionResult.predictedTrend);
      setTrendAnalysis(predictionResult.trendAnalysis);

      // Simulate sales data generation based on prediction
      const salesData = generateSalesData(predictionResult.trendAnalysis);
      setChartData(salesData);

    } catch (error: any) {
      console.error('Error generating trend prediction:', error);
      setTrendPrediction('Failed to generate trend prediction');
      setTrendAnalysis('Failed to generate trend analysis.');
      setChartData([]); // Reset chart data on error
    }
  }, [productDescription, predictTrendRenewal]);

  const generateSalesData = (trendAnalysis: string) => {
    const baseSales = 100; // Base sales number
    const today = new Date();
    const modifier = calculateModifier(trendAnalysis);

    const simulatedData = [];
    for (let i = 0; i < 5; i++) {
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + i, today.getDate());
      const monthName = nextMonth.toLocaleString('default', { month: 'short' });
      const sales = Math.round(baseSales * (modifier + (Math.random() * 0.4 - 0.2))); // Add some randomness
      simulatedData.push({ name: `Month ${i + 1} (${monthName})`, sales });
    }

    return simulatedData;
  };

  const calculateModifier = (trendAnalysis: string) => {
      // Use keywords from the trend analysis to adjust the sales modifier
      let modifier = 1; // Default modifier

      if (trendAnalysis.toLowerCase().includes("high demand") || trendAnalysis.toLowerCase().includes("popular")) {
          modifier += 0.5;
      } else if (trendAnalysis.toLowerCase().includes("niche") || trendAnalysis.toLowerCase().includes("emerging")) {
          modifier += 0.3;
      } else if (trendAnalysis.toLowerCase().includes("decline") || trendAnalysis.toLowerCase().includes("saturated")) {
          modifier -= 0.2;
      }

      return modifier;
  };


  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Upload Fashion</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-4">
          <div className="flex justify-end">
            <ModeToggle />
          </div>
          <ProductUploadForm setProductDescription={setProductDescription} onUploadComplete={handleTrendPrediction}/>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Trend Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              {trendPrediction ? (
                <p>{trendPrediction}</p>
              ) : (
                <p>Loading trend prediction...</p>
              )}
            </CardContent>
          </Card>

          {trendAnalysis && (
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
              <CardTitle>Sales Chart</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
                ) : (
                  <p>No sales data to display.</p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}
