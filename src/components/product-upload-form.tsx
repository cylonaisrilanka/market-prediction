'use client';

import {useState, useCallback, useRef} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label'; // Import Label
import {generateProductDescription} from '@/ai/flows/generate-product-description';
import {filterProductDescription} from '@/ai/flows/filter-product-description';
import {useToast} from '@/hooks/use-toast';
import Image from 'next/image'; // Use next/image for optimization

interface ProductUploadFormProps {
  setProductDescription: (description: string) => void;
  setLocation: (location: string) => void;
  setAgeSuitability: (ageSuitability: string) => void;
  setGender: (gender: string) => void;
  isPredicting: boolean; // Receive predicting state
}

export const ProductUploadForm: React.FC<ProductUploadFormProps> = ({
  setProductDescription,
  setLocation,
  setAgeSuitability,
  setGender,
  isPredicting,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState<number | ''>(''); // Allow empty string for initial state
  const [description, setDescription] = useState('');
  const [localLocation, setLocalLocation] = useState('');
  const [localAgeSuitability, setLocalAgeSuitability] = useState('');
  const [localGender, setLocalGender] = useState('');
  const [isGenerating, setIsGenerating] = useState(false); // Separate state for description generation
  const {toast} = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation for file type and size (optional but recommended)
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload an image file.',
        });
        return;
      }
      // Example size limit (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
          toast({
            variant: 'destructive',
            title: 'File Too Large',
            description: 'Please upload an image smaller than 5MB.',
          });
          return;
      }


      const reader = new FileReader();
      reader.onloadend = async () => {
        const imgDataUrl = reader.result as string;
        setImageUrl(imgDataUrl);
        // Automatically generate description after image is loaded
        await generateAndFilterDescription(imgDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAndFilterDescription = async (imageDataUri: string) => {
     // Don't generate if already generating or predicting
    if (isGenerating || isPredicting) return;

    setIsGenerating(true);
    setDescription('Generating description...'); // Indicate loading
    setProductDescription(''); // Clear parent state while generating

    // Use local state for details if available, otherwise use placeholders or empty strings
    const details = `Location: ${localLocation || 'Not specified'}, Age Suitability: ${localAgeSuitability || 'Not specified'}, Gender: ${localGender || 'Not specified'}. This is a new fashion product.`;

    try {
      const genResult = await generateProductDescription({
        productImageDataUri: imageDataUri,
        additionalDetails: details,
      });

      // Filter the generated description
      const filterResult = await filterProductDescription({
        description: genResult.productDescription,
      });

      setDescription(filterResult.filteredDescription);
      setProductDescription(filterResult.filteredDescription); // Update parent only after filtering

      if (!filterResult.isSafe) {
           toast({
            variant: "destructive",
            title: 'Content Warning',
            description: 'Generated description contained potentially inappropriate content and was filtered.',
          });
      } else {
           toast({
            title: 'Description Generated',
            description: 'Product description is ready.',
          });
      }

    } catch (error: any) {
      console.error('Error generating/filtering description:', error);
      setDescription(''); // Clear description on error
      setProductDescription('');
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate product description. Please try again or enter manually.',
      });
    } finally {
      setIsGenerating(false);
    }
  };


  // Update parent state when local state changes
  const handleAttributeChange = <T extends (value: string) => void>(setter: T, value: string) => {
      setter(value); // Update parent state immediately
  };


  return (
    <div className="w-full max-w-lg mx-auto mt-8 p-4 sm:p-6 border rounded-lg shadow-md bg-card text-card-foreground">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center">Upload New Fashion Design</h2>
      <div className="space-y-4">
        {/* Image Upload */}
        <div>
          <Label htmlFor="image" className="block text-sm font-medium mb-1">
            Fashion Design Image
          </Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            disabled={isGenerating || isPredicting}
          />
          {imageUrl && (
             <div className="mt-3 flex justify-center">
                <Image
                    src={imageUrl}
                    alt="Fashion Design Preview"
                    width={128} // Provide width
                    height={128} // Provide height
                    className="w-32 h-32 object-cover rounded-md border"
                    data-ai-hint="fashion clothing preview"
                />
             </div>
          )}
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price" className="block text-sm font-medium mb-1">
            Price (LKR)
          </Label>
          <Input
            type="number"
            id="price"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full"
            disabled={isGenerating || isPredicting}
            min="0" // Prevent negative prices
          />
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" className="block text-sm font-medium mb-1">
            Target Location
          </Label>
          <Input
            type="text"
            id="location"
            placeholder="e.g., Colombo, Urban, Sri Lanka"
            value={localLocation}
            onChange={(e) => {
                setLocalLocation(e.target.value);
                handleAttributeChange(setLocation, e.target.value);
             }}
            className="w-full"
            disabled={isGenerating || isPredicting}
          />
        </div>

        {/* Age Suitability */}
        <div>
          <Label htmlFor="ageSuitability" className="block text-sm font-medium mb-1">
            Target Age Group
          </Label>
          <Input
            type="text"
            id="ageSuitability"
            placeholder="e.g., Young Adult, 25-35, Teenager"
            value={localAgeSuitability}
             onChange={(e) => {
                setLocalAgeSuitability(e.target.value);
                handleAttributeChange(setAgeSuitability, e.target.value);
             }}
            className="w-full"
            disabled={isGenerating || isPredicting}
          />
        </div>

        {/* Gender */}
        <div>
          <Label htmlFor="gender" className="block text-sm font-medium mb-1">
            Target Gender
          </Label>
          <Input
            type="text"
            id="gender"
            placeholder="e.g., Women, Men, Unisex"
            value={localGender}
             onChange={(e) => {
                setLocalGender(e.target.value);
                handleAttributeChange(setGender, e.target.value);
             }}
            className="w-full"
            disabled={isGenerating || isPredicting}
          />
        </div>

         {/* Description */}
        <div>
          <Label htmlFor="description" className="block text-sm font-medium mb-1">
            Product Description
          </Label>
          <Textarea
            id="description"
            placeholder={isGenerating ? "Generating..." : "Product description will appear here..."}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setProductDescription(e.target.value); // Update parent on manual change
            }}
            className="w-full min-h-[100px]" // Ensure min height
            disabled={isGenerating || isPredicting}
            readOnly={isGenerating} // Make read-only while generating
          />
          <p className="text-xs text-muted-foreground mt-1">Description is auto-generated after image upload. You can edit it afterwards.</p>
        </div>

         {/* No separate buttons needed as actions are triggered automatically */}

      </div>
    </div>
  );
};
