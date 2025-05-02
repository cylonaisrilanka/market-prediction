// src/components/product-upload-form.tsx
'use client';

import {useState, useCallback, useRef} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {generateProductDescription} from '@/ai/flows/generate-product-description';
import {filterProductDescription} from '@/ai/flows/filter-product-description';
import {useToast} from '@/hooks/use-toast';
import Image from 'next/image';
import {UploadCloud, FileImage, DollarSign, MapPin, User, Users, Type, Asterisk, Loader2} from 'lucide-react'; // Added Loader2
import {Skeleton} from '@/components/ui/skeleton';

interface ProductUploadFormProps {
  setProductDescription: (description: string) => void;
  setLocation: (location: string) => void;
  setAgeSuitability: (ageSuitability: string) => void;
  setGender: (gender: string) => void;
  isPredicting: boolean;
  onUploadComplete: () => void; // Callback when initial image is processed and prediction should trigger
}

export const ProductUploadForm: React.FC<ProductUploadFormProps> = ({
  setProductDescription,
  setLocation,
  setAgeSuitability,
  setGender,
  isPredicting,
  onUploadComplete,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [localLocation, setLocalLocation] = useState('');
  const [localAgeSuitability, setLocalAgeSuitability] = useState('');
  const [localGender, setLocalGender] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const {toast} = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload an image file (JPEG, PNG, GIF, etc.).',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: 'Image size should not exceed 5MB.',
        });
        return;
      }

      setImageUrl(''); // Clear previous image while processing
      setDescription(''); // Clear previous description
      setProductDescription(''); // Clear parent state
      setIsGenerating(true); // Set generating state early

      const reader = new FileReader();
      reader.onloadend = async () => {
        const imgDataUrl = reader.result as string;
        setImageUrl(imgDataUrl); // Show preview immediately
        await generateAndFilterDescription(imgDataUrl); // Generate description after loading
      };
      reader.onerror = () => {
        setIsGenerating(false);
        toast({
          variant: 'destructive',
          title: 'File Read Error',
          description: 'Could not read the selected image file.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAndFilterDescription = async (imageDataUri: string) => {
    setDescription('AI is analyzing the design...');
    setProductDescription('');

    const details = `Analyze the fashion item in the image. Additional context: Location: ${localLocation || 'Not specified'}, Age Suitability: ${localAgeSuitability || 'Not specified'}, Gender: ${localGender || 'Not specified'}${price ? `, Estimated Price: LKR ${price}` : ''}. Generate a compelling and appropriate product description.`;

    try {
      // 1. Generate Description
      const genResult = await generateProductDescription({
        productImageDataUri: imageDataUri,
        additionalDetails: details,
      });

      setDescription('Filtering description...'); // Update status

      // 2. Filter Description
      const filterResult = await filterProductDescription({
        description: genResult.productDescription,
      });

      // Update state with final description
      setDescription(filterResult.filteredDescription);
      setProductDescription(filterResult.filteredDescription); // Update parent state

      if (!filterResult.isSafe) {
        toast({
          variant: 'destructive', // Use destructive for warnings
          title: 'Content Filtered',
          description: 'Generated description was modified for appropriateness.',
          duration: 5000, // Slightly longer duration
        });
      } else {
        toast({
          title: 'Description Ready',
          description: 'AI generated description is complete.',
          duration: 3000,
        });
      }

      // Signal that initial processing is done, triggering prediction if other fields are ready
      if (localLocation && localAgeSuitability && localGender) {
        onUploadComplete();
      } else {
         // Don't trigger yet, wait for other fields.
         // Optionally inform user details are still needed if they expect immediate prediction.
         // Toast might be too noisy here, maybe a subtle UI indicator?
      }
    } catch (error: any) {
      console.error('Error generating/filtering description:', error);
      setDescription(''); // Clear description on error
      setProductDescription('');
      toast({
        variant: 'destructive',
        title: 'Description Generation Failed',
        description: error.message || 'Could not generate description. Check console or try again.',
      });
    } finally {
      setIsGenerating(false); // Ensure loading state is turned off
    }
  };

  // Generic handler for attribute inputs
  const handleAttributeChange = (
    setter: (value: string) => void, // Local state setter
    parentSetter: (value: string) => void, // Parent state setter
    value: string
  ) => {
    setter(value); // Update local state immediately for UI responsiveness
    parentSetter(value); // Update parent state

     // Check if all details are now filled after this change, *and* image+description exist
    const isLocationFilled = setter === setLocalLocation ? !!value : !!localLocation;
    const isAgeFilled = setter === setLocalAgeSuitability ? !!value : !!localAgeSuitability;
    const isGenderFilled = setter === setLocalGender ? !!value : !!localGender;

    if (imageUrl && description && isLocationFilled && isAgeFilled && isGenderFilled) {
        onUploadComplete(); // Trigger prediction if this change completes the requirements
    }
  };

  const allDetailsFilled = Boolean(imageUrl && description && localLocation && localAgeSuitability && localGender);
  const canPredict = allDetailsFilled && !isGenerating;


  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border border-border/50 bg-gradient-to-br from-card via-card/95 to-card dark:from-card dark:via-card/90 dark:to-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/40">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 dark:to-transparent border-b border-border/30 p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl flex items-center gap-3 text-primary font-semibold tracking-tight">
          <UploadCloud size={28} strokeWidth={2.5} className="text-accent"/> Upload New Design
        </CardTitle>
        <CardDescription className="text-primary/80 dark:text-primary/70 text-sm mt-1">
          Provide an image and details to analyze market trends.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6 px-4 sm:px-6 pb-6">
        {/* Image Upload */}
        <div className="space-y-3">
          <Label htmlFor="image" className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
            <FileImage size={16} className="text-muted-foreground" /> Fashion Design Image
            <Asterisk size={10} className="text-destructive ml-0.5" /> {/* Required indicator */}
          </Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-primary file:to-accent file:text-primary-foreground hover:file:opacity-90 cursor-pointer focus-visible:ring-primary disabled:opacity-70 disabled:cursor-not-allowed bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
            disabled={isGenerating || isPredicting}
            required
          />
          {imageUrl && (
            <div className="mt-4 flex justify-center p-2 border-2 border-dashed border-border/50 rounded-lg bg-gradient-to-br from-secondary/30 to-background dark:from-secondary/20 dark:to-card/50">
              <Image
                src={imageUrl}
                alt="Fashion Design Preview"
                width={200} // Slightly larger preview
                height={200}
                className="object-contain rounded-md shadow-md bg-white dark:bg-muted/50"
                data-ai-hint="fashion clothing preview"
                priority
              />
            </div>
          )}
          {isGenerating && !imageUrl && (
             <div className="mt-4 flex justify-center items-center p-2 border-2 border-dashed border-border/50 rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 h-[216px]">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
        </div>

        <hr className="border-border/20" />

        {/* Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground/90 mb-1 tracking-tight">Additional Details</h3>
          <p className="text-sm text-muted-foreground mb-4">Provide context for more accurate predictions. <span className="text-destructive">* Required</span></p>

          {/* Price */}
          <div className="space-y-1.5 relative group">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                <DollarSign size={16} />
            </span>
            <Label htmlFor="price" className="sr-only">Estimated Price (LKR)</Label>
            <Input
              type="number"
              id="price"
              placeholder="Estimated Price (LKR)"
              value={price}
              onChange={(e) => setPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
              className="w-full focus-visible:ring-primary disabled:opacity-70 pl-10 bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
              disabled={isGenerating || isPredicting}
              min="0"
            />
            <p className="text-xs text-muted-foreground pl-1">Optional, but helps analysis.</p>
          </div>

          {/* Location */}
          <div className="space-y-1.5 relative group">
            <span className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                <MapPin size={16} />
            </span>
            <Label htmlFor="location" className="sr-only">Target Location</Label>
            <Input
              type="text"
              id="location"
              placeholder="Target Location"
              value={localLocation}
              onChange={(e) => handleAttributeChange(setLocalLocation, setLocation, e.target.value)}
              className="w-full focus-visible:ring-primary disabled:opacity-70 pl-10 bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
              disabled={isGenerating || isPredicting}
              required
            />
            <Asterisk size={10} className="absolute right-3 top-3 text-destructive opacity-70 group-focus-within:opacity-100" />
          </div>

          {/* Age Suitability */}
          <div className="space-y-1.5 relative group">
            <span className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                 <User size={16}/>
            </span>
            <Label htmlFor="ageSuitability" className="sr-only">Target Age Group</Label>
            <Input
              type="text"
              id="ageSuitability"
              placeholder="Target Age Group (e.g., 18-25)"
              value={localAgeSuitability}
              onChange={(e) => handleAttributeChange(setLocalAgeSuitability, setAgeSuitability, e.target.value)}
              className="w-full focus-visible:ring-primary disabled:opacity-70 pl-10 bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
              disabled={isGenerating || isPredicting}
              required
            />
            <Asterisk size={10} className="absolute right-3 top-3 text-destructive opacity-70 group-focus-within:opacity-100" />
          </div>

          {/* Gender */}
          <div className="space-y-1.5 relative group">
             <span className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                 <Users size={16}/>
             </span>
            <Label htmlFor="gender" className="sr-only">Target Gender</Label>
            <Input
              type="text"
              id="gender"
              placeholder="Target Gender (e.g., Women)"
              value={localGender}
              onChange={(e) => handleAttributeChange(setLocalGender, setGender, e.target.value)}
              className="w-full focus-visible:ring-primary disabled:opacity-70 pl-10 bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
              disabled={isGenerating || isPredicting}
              required
            />
             <Asterisk size={10} className="absolute right-3 top-3 text-destructive opacity-70 group-focus-within:opacity-100" />
          </div>
        </div>

        <hr className="border-border/20" />

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
            <Type size={16} className="text-muted-foreground" /> AI Generated Description
          </Label>
          <Textarea
            id="description"
            placeholder={
              isGenerating ? 'AI is working its magic...' :
              !imageUrl ? 'Upload an image to generate description...' :
              'Description will appear here...'
            }
            value={description}
            onChange={(e) => {
              const newDescription = e.target.value;
              setDescription(newDescription);
              setProductDescription(newDescription); // Keep parent updated on manual edits
               // Re-check if prediction can be triggered after manual edit
               if (imageUrl && newDescription && localLocation && localAgeSuitability && localGender) {
                 onUploadComplete();
               }
            }}
            className="w-full min-h-[150px] focus-visible:ring-primary bg-secondary/30 dark:bg-card/40 disabled:opacity-70 rounded-md shadow-inner border-input hover:border-primary/30"
            disabled={isPredicting || isGenerating} // Disable if predicting OR generating
            readOnly={isGenerating} // Readonly only while generating
          />
           <p className="text-xs text-muted-foreground mt-1">
             {isGenerating ? 'Generating...' : (description ? 'You can edit the description above.' : 'Generated after image upload.')}
          </p>
        </div>

        {/* Consolidated Loading/Status Indicator */}
        {(isGenerating || isPredicting) && (
          <div className="flex justify-center items-center gap-2 pt-4 text-sm text-primary font-medium">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{isGenerating ? 'Analyzing Design & Generating Text...' : 'Predicting Market Trends...'}</span>
          </div>
        )}
         {!allDetailsFilled && imageUrl && !isGenerating && (
             <p className="text-sm text-center text-amber-600 dark:text-amber-500 font-medium pt-2 px-2">
                Please fill in all required (*) details (Location, Age, Gender) to enable trend prediction.
             </p>
         )}
      </CardContent>
    </Card>
  );
};
