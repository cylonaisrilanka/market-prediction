'use client';

import {useState} from 'react';
import {ProductUploadForm} from '@/components/product-upload-form';
import {ProductList} from '@/components/product-list';
import {SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {ModeToggle} from '@/components/mode-toggle';
import {useEffect} from 'react';

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
