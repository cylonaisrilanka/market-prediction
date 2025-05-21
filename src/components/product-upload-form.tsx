
// src/components/product-upload-form.tsx
'use client';

import {useState, useCallback, useRef, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from '@/components/ui/card';
import {generateProductDescription} from '@/ai/flows/generate-product-description';
import {filterProductDescription} from '@/ai/flows/filter-product-description';
import {useToast} from '@/hooks/use-toast';
import Image from 'next/image';
import {UploadCloud, FileImage, DollarSign, MapPin, User, Users, Type, Asterisk, Loader2, AlertCircle} from 'lucide-react';
import {Skeleton} from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductUploadFormProps {
  setProductDescription: (description: string) => void;
  setLocation: (location: string) => void;
  setAgeSuitability: (ageSuitability: string) => void;
  setGender: (gender: string) => void;
  isPredictingGlobal: boolean; // Renamed to avoid conflict with local isPredicting
  onUploadComplete: () => void;
}

export const ProductUploadForm: React.FC<ProductUploadFormProps> = ({
  setProductDescription,
  setLocation,
  setAgeSuitability,
  setGender,
  isPredictingGlobal,
  onUploadComplete,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageDataUriForAI, setImageDataUriForAI] = useState(''); // Store the data URI separately for AI
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [localLocation, setLocalLocation] = useState('');
  const [localAgeSuitability, setLocalAgeSuitability] = useState('');
  const [localGender, setLocalGender] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const {toast} = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formSubmittedOnce, setFormSubmittedOnce] = useState(false);


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
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: 'Image size should not exceed 5MB.',
        });
        return;
      }

      setImageUrl(URL.createObjectURL(file)); // For immediate preview
      setDescription('');
      setProductDescription('');
      setIsGeneratingDescription(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const imgDataUrl = reader.result as string;
        setImageDataUriForAI(imgDataUrl); // Store for AI processing
        // Do not call generateAndFilterDescription here, it will be called by useEffect
      };
      reader.onerror = () => {
        setIsGeneratingDescription(false);
        toast({
          variant: 'destructive',
          title: 'File Read Error',
          description: 'Could not read the selected image file.',
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // useEffect to trigger description generation when all necessary inputs for it are ready
  useEffect(() => {
    if (imageDataUriForAI && (localLocation || localAgeSuitability || localGender || price !== '')) {
      // Check if any of the optional details that go into the description prompt are available
      // or if the user intends to proceed without them by filling required fields later
      generateAndFilterDescription(imageDataUriForAI);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageDataUriForAI, localLocation, localAgeSuitability, localGender, price]); // Dependencies that influence the description generation prompt

  const generateAndFilterDescription = async (imageDataUri: string) => {
    if (!imageDataUri) return; // Should not happen if called from useEffect correctly

    setDescription('AI is analyzing the design...');
    setProductDescription('');
    setIsGeneratingDescription(true); // Ensure this is set

    const details = `Analyze the fashion item in the image. Additional context: Target Location: ${localLocation || 'Not specified'}, Target Age Suitability: ${localAgeSuitability || 'Not specified'}, Target Gender: ${localGender || 'Not specified'}${price ? `, Estimated Price: LKR ${price}` : ''}. Generate a compelling and appropriate product description.`;

    try {
      const genResult = await generateProductDescription({
        productImageDataUri: imageDataUri,
        additionalDetails: details,
      });

      setDescription('Filtering description...');

      const filterResult = await filterProductDescription({
        description: genResult.productDescription,
      });

      setDescription(filterResult.filteredDescription);
      setProductDescription(filterResult.filteredDescription);

      if (!filterResult.isSafe) {
        toast({
          variant: 'destructive',
          title: 'Content Moderated',
          description: 'Generated description was modified for appropriateness.',
          duration: 5000,
        });
      } else {
        toast({
          title: 'Description Generated',
          description: 'AI has generated a product description.',
          duration: 3000,
        });
      }
      // Check if prediction can be triggered now
      if (filterResult.filteredDescription && localLocation && localAgeSuitability && localGender) {
        onUploadComplete();
      }

    } catch (error: any) {
      console.error('Error generating/filtering description:', error);
      setDescription('');
      setProductDescription('');
      toast({
        variant: 'destructive',
        title: 'Description Generation Failed',
        description: error.message || 'Could not generate description. Please try again.',
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleAttributeChange = (
    setter: (value: string) => void,
    parentSetter: (value: string) => void,
    value: string
  ) => {
    setter(value);
    parentSetter(value);

    // If an image has been processed and its description is available,
    // and now all *required* text fields are filled, trigger prediction.
    if (imageUrl && description && value && (setter === setLocalLocation ? true : !!localLocation) && (setter === setLocalAgeSuitability ? true : !!localAgeSuitability) && !!localGender) {
        onUploadComplete();
    }
  };

  const handleGenderChange = (value: string) => {
    setLocalGender(value);
    setGender(value);
    if (imageUrl && description && localLocation && localAgeSuitability && value) {
      onUploadComplete();
    }
  };

  const isFormFullyDisabled = isGeneratingDescription || isPredictingGlobal;
  const allRequiredDetailsFilledForPrediction = !!(imageUrl && description && localLocation && localAgeSuitability && localGender);

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
        <div className="space-y-3">
          <Label htmlFor="image" className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
            <FileImage size={16} className="text-muted-foreground" /> Fashion Design Image
            <Asterisk size={10} className="text-destructive ml-0.5" />
          </Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-primary file:to-accent file:text-primary-foreground hover:file:opacity-90 cursor-pointer focus-visible:ring-primary disabled:opacity-70 disabled:cursor-not-allowed bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
            disabled={isFormFullyDisabled}
            required
          />
          {imageUrl && (
            <div className="mt-4 flex justify-center p-2 border-2 border-dashed border-border/50 rounded-lg bg-gradient-to-br from-secondary/30 to-background dark:from-secondary/20 dark:to-card/50">
              <Image
                src={imageUrl}
                alt="Fashion Design Preview"
                width={200}
                height={200}
                className="object-contain rounded-md shadow-md bg-white dark:bg-muted/50"
                data-ai-hint="fashion clothing preview"
                priority
              />
            </div>
          )}
          {isGeneratingDescription && !imageUrl && (
             <div className="mt-4 flex justify-center items-center p-2 border-2 border-dashed border-border/50 rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 h-[216px]">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
        </div>

        <hr className="border-border/20" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground/90 mb-1 tracking-tight">Additional Details</h3>
          <p className="text-sm text-muted-foreground mb-4">Provide context for more accurate predictions. <span className="text-destructive">* Required</span></p>

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
              disabled={isFormFullyDisabled}
              min="0"
            />
            <p className="text-xs text-muted-foreground pl-1">Optional, but helps analysis.</p>
          </div>

          <div className="space-y-1.5 relative group">
            <span className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                <MapPin size={16} />
            </span>
            <Label htmlFor="location" className="sr-only">Target Location</Label>
            <Input
              type="text"
              id="location"
              placeholder="Target Location (e.g., Colombo, Kandy)"
              value={localLocation}
              onChange={(e) => handleAttributeChange(setLocalLocation, setLocation, e.target.value)}
              className="w-full focus-visible:ring-primary disabled:opacity-70 pl-10 bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
              disabled={isFormFullyDisabled}
              required
            />
            <Asterisk size={10} className="absolute right-3 top-3 text-destructive opacity-70 group-focus-within:opacity-100" />
          </div>

          <div className="space-y-1.5 relative group">
            <span className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                 <User size={16}/>
            </span>
            <Label htmlFor="ageSuitability" className="sr-only">Target Age Group</Label>
            <Input
              type="text"
              id="ageSuitability"
              placeholder="Target Age Group (e.g., 18-25, Teenagers)"
              value={localAgeSuitability}
              onChange={(e) => handleAttributeChange(setLocalAgeSuitability, setAgeSuitability, e.target.value)}
              className="w-full focus-visible:ring-primary disabled:opacity-70 pl-10 bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
              disabled={isFormFullyDisabled}
              required
            />
            <Asterisk size={10} className="absolute right-3 top-3 text-destructive opacity-70 group-focus-within:opacity-100" />
          </div>

          <div className="space-y-1.5 relative group">
             <span className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors z-10">
                 <Users size={16}/>
             </span>
            <Label htmlFor="gender" className="sr-only">Target Gender</Label>
            <Select
                value={localGender}
                onValueChange={handleGenderChange}
                disabled={isFormFullyDisabled}
                required
            >
              <SelectTrigger className="w-full pl-10 bg-background/50 dark:bg-card/60 border-input hover:border-primary/30 focus-visible:ring-primary disabled:opacity-70" id="gender">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Unisex">Unisex</SelectItem> 
              </SelectContent>
            </Select>
             <Asterisk size={10} className="absolute right-3 top-3 text-destructive opacity-70 group-focus-within:opacity-100" />
          </div>
        </div>

        <hr className="border-border/20" />

        <div className="space-y-1.5">
          <Label htmlFor="description" className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
            <Type size={16} className="text-muted-foreground" /> AI Generated Description
          </Label>
          <Textarea
            id="description"
            placeholder={
              isGeneratingDescription ? 'AI is working its magic...' :
              !imageUrl ? 'Upload an image to generate description...' :
              'Description will appear here once generated...'
            }
            value={description}
            onChange={(e) => {
              const newDescription = e.target.value;
              setDescription(newDescription);
              setProductDescription(newDescription);
               if (imageUrl && newDescription && localLocation && localAgeSuitability && localGender) {
                 onUploadComplete();
               }
            }}
            className="w-full min-h-[120px] sm:min-h-[150px] focus-visible:ring-primary bg-secondary/30 dark:bg-card/40 disabled:opacity-70 rounded-md shadow-inner border-input hover:border-primary/30"
            disabled={isPredictingGlobal} // Only disable for global prediction, allow edit during own generation
            readOnly={isGeneratingDescription} // Readonly only while *this form* is generating
          />
           <p className="text-xs text-muted-foreground mt-1">
             {isGeneratingDescription ? 'Generating description...' : (description ? 'You can edit the AI-generated description above.' : 'Description will be generated after image upload and providing some details.')}
          </p>
        </div>

        {(isGeneratingDescription || isPredictingGlobal) && (
          <div className="flex justify-center items-center gap-2 pt-4 text-sm text-primary font-medium">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{isGeneratingDescription ? 'Analyzing Design & Generating Text...' : (isPredictingGlobal ? 'Predicting Market Trends...' : '')}</span>
          </div>
        )}
         {!allRequiredDetailsFilledForPrediction && imageUrl && !isGeneratingDescription && !isPredictingGlobal && (
             <p className="text-sm text-center text-amber-600 dark:text-amber-500 font-medium pt-2 px-2 flex items-center justify-center gap-2">
                <AlertCircle size={16} /> Please fill in all required (*) details to enable trend prediction.
             </p>
         )}
      </CardContent>
    </Card>
  );
};
