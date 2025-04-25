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
      const salesData = generateSalesData(predictionResult.predictedTrend);
      setChartData(salesData);

    } catch (error: any) {
      console.error('Error generating trend prediction:', error);
      setTrendPrediction('Failed to generate trend prediction');
      setTrendAnalysis('Failed to generate trend analysis.');
      setChartData([]); // Reset chart data on error
    }
  }, [productDescription, predictTrendRenewal]);

  const generateSalesData = (predictedTrend: string) => {
    const baseSales = 100; // Base sales number
    const trendModifier = {
      'High Demand': 2,
      'Medium Demand': 1.5,
      'Low Demand': 0.8,
      'Failed to generate trend prediction': 0.5,
      'Loading trend prediction...': 0.7,
    };

    const modifier = trendModifier[predictedTrend as keyof typeof trendModifier] || 1;

    const simulatedData = [
      { name: 'Month 1', sales: Math.round(baseSales * modifier) },
      { name: 'Month 2', sales: Math.round(baseSales * (modifier + 0.2)) },
      { name: 'Month 3', sales: Math.round(baseSales * (modifier - 0.1)) },
      { name: 'Month 4', sales: Math.round(baseSales * (modifier + 0.3)) },
      { name: 'Month 5', sales: Math.round(baseSales * (modifier - 0.2)) },
    ];

    return simulatedData;
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
          <ProductUploadForm setProductDescription={setProductDescription}/>
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productDescription">
							Product Description
						</label>
						<input
							type="text"
							id="productDescription"
							placeholder="Enter product description"
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							value={productDescription}
							onChange={(e) => setProductDescription(e.target.value)}
						/>
					</div>
					<Button type="button" onClick={handleTrendPrediction}>
						Predict Market Trend
					</Button>

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
