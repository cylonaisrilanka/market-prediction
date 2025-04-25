'use client';

import {useState, useCallback} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {generateProductDescription} from '@/ai/flows/generate-product-description';
import {filterProductDescription} from '@/ai/flows/filter-product-description';
import {uploadProduct} from '@/services/product-upload';
import {useToast} from '@/hooks/use-toast';

interface ProductUploadFormProps {
  setProductDescription: (description: string) => void;
}

export const ProductUploadForm: React.FC<ProductUploadFormProps> = ({ setProductDescription }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [ageSuitability, setAgeSuitability] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imgDataUrl = reader.result as string;
        setImageUrl(imgDataUrl);
        // Automatically generate and filter description
        setIsLoading(true);
        try {
          const generatedDescription = await generateProductDescription({
            productImageDataUri: imgDataUrl,
            additionalDetails: `Location: ${location}, Age Suitability: ${ageSuitability}, Gender: ${gender}. This is a new fashion product.`,
          });

          const filteredDescription = await filterProductDescription({
            description: generatedDescription.productDescription,
          });

          setDescription(filteredDescription.filteredDescription);
          setProductDescription(filteredDescription.filteredDescription); // Update parent component
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
      };
      reader.readAsDataURL(file);
    }
  };


  const handleUpload = async () => {
    if (!imageUrl || !price || !description || !location || !ageSuitability || !gender) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill in all fields.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const product = {imageUrl, price, description};
      const success = await uploadProduct(product);
      if (success) {
        setImageUrl('');
        setPrice(undefined);
        setDescription('');
        setLocation('');
        setAgeSuitability('');
        setGender('');
        setProductDescription('');
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
      <h2 className="text-2xl font-semibold mb-4">Upload New Fashion Design</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
          Fashion Design Image
        </label>
        <Input type="file" id="image" accept="image/*" onChange={handleImageUpload} />
        {imageUrl && <img src={imageUrl} alt="Fashion Design Preview" className="mt-2 w-32 h-32 object-cover rounded-md" />}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
          Price (LKR)
        </label>
        <Input
          type="number"
          id="price"
          placeholder="Enter price in LKR"
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
          onChange={(e) => {
            setDescription(e.target.value);
            setProductDescription(e.target.value); // Also update product description here
          }}
        />
      </div>
       <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
          Location
        </label>
        <Input
          type="text"
          id="location"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ageSuitability">
          Age Suitability
        </label>
        <Input
          type="text"
          id="ageSuitability"
          placeholder="Enter age suitability"
          value={ageSuitability}
          onChange={(e) => setAgeSuitability(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
          Gender
        </label>
        <Input
          type="text"
          id="gender"
          placeholder="Enter gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
      </div>
      <div className="flex justify-between mb-4">
        <Button variant="accent" type="button" onClick={handleUpload} disabled={isLoading}>
          {isLoading ? 'Analyzing Market Trend...' : 'Upload & Analyze'}
        </Button>
      </div>
    </div>
  );
};
