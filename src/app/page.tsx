'use client';

import {useState, useEffect, useCallback} from 'react';
import {ProductUploadForm} from '@/components/product-upload-form';
import {ProductList} from '@/components/product-list';
import {SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {ModeToggle} from '@/components/mode-toggle';
import {predictTrendRenewal} from '@/ai/flows/predict-trend-renewal';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { Line } from 'recharts';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([
    {
      imageUrl: 'https://picsum.photos/200/300',
      price: 250,
      description: 'A beautiful summer dress',
    },
    {
      imageUrl: 'https://picsum.photos/200/300',
      price: 100,
      description: 'Nice Jeans',
    },
  ]);

  const [trendPrediction, setTrendPrediction] = useState<string | null>(null);

  useEffect(() => {
    // Persist state to local storage
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    // Load state from local storage on initial render
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const addProduct = (newProduct: Product) => {
    setProducts([...products, newProduct]);
  };

  const handleTrendPrediction = useCallback(async () => {
    const historicalData = 'Past 3 months: High demand, medium demand, low demand';
    try {
      const prediction = await predictTrendRenewal({historicalData});
      setTrendPrediction(prediction.predictedTrend);
    } catch (error: any) {
      console.error('Error generating trend prediction:', error);
      setTrendPrediction('Failed to generate trend prediction');
    }
  }, [predictTrendRenewal]);

  useEffect(() => {
    handleTrendPrediction();
  }, [handleTrendPrediction]);

  // Dummy data for chart
  const chartData = [
    { name: 'Jan', sales: 200 },
    { name: 'Feb', sales: 300 },
    { name: 'Mar', sales: 400 },
    { name: 'Apr', sales: 300 },
    { name: 'May', sales: 200 },
  ];

  const chartConfig = {
    sales: {
      label: "Sales",
      color: "var(--primary)",
    },
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>Upload Product</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-4">
          <div className="flex justify-end">
            <ModeToggle />
          </div>
          <ProductUploadForm onProductUpload={addProduct} />
          <ProductList products={products} />

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

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Sales Chart</CardTitle>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
                  <Line dataKey="sales" stroke="var(--chart-1)" />
                  <ChartTooltip>
                    <ChartTooltipContent/>
                  </ChartTooltip>
                </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  );
}

export interface Product {
  imageUrl: string;
  price: number;
  description: string;
}
