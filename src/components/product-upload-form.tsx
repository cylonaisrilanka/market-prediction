'use client';

import {useState, useCallback} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {generateProductDescription} from '@/ai/flows/generate-product-description';
import {filterProductDescription} from '@/ai/flows/filter-product-description';
import {Product} from '@/app/page';
import {uploadProduct} from '@/services/product-upload';
import {useToast} from '@/hooks/use-toast';

interface ProductUploadFormProps {
  onProductUpload: (product: Product) => void;
}

export const ProductUploadForm: React.FC<ProductUploadFormProps> = ({onProductUpload}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDescription = useCallback(async () => {
    if (!imageUrl) {
      toast({
        title: 'Missing image',
        description: 'Please upload product image to generate description.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const generatedDescription = await generateProductDescription({
        productImageDataUri: imageUrl,
        additionalDetails: 'This is a new fashion product.',
      });

      const filteredDescription = await filterProductDescription({
        description: generatedDescription.productDescription,
      });

      setDescription(filteredDescription.filteredDescription);
      toast({
        title: 'Success',
        description: 'Product description has been generated',
      });
    } catch (error: any) {
      console.error('Error generating description:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to generate description',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [imageUrl, filterProductDescription, generateProductDescription, toast]);

  const handleUpload = async () => {
    if (!imageUrl || !price || !description) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill in all fields.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const product: Product = {imageUrl, price, description};
      const success = await uploadProduct(product);
      if (success) {
        onProductUpload(product);
        setImageUrl('');
        setPrice(undefined);
        setDescription('');
        toast({
          title: 'Product Uploaded',
          description: 'Product has been uploaded successfully.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'Failed to upload the product. Please try again.',
        });
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Upload New Product</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
          Product Image
        </label>
        <Input type="file" id="image" accept="image/*" onChange={handleImageUpload} />
        {imageUrl && <img src={imageUrl} alt="Product Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
          Price
        </label>
        <Input
          type="number"
          id="price"
          placeholder="Enter price"
          value={price === undefined ? '' : price.toString()}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <Textarea
          id="description"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex justify-between mb-4">
        <Button type="button" onClick={handleGenerateDescription} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Description'}
        </Button>
        <Button variant="accent" type="button" onClick={handleUpload} disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload Product'}
        </Button>
      </div>
    </div>
  );
};
