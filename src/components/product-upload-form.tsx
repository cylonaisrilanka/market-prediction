
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
import {UploadCloud, FileImage, DollarSign, MapPin, User, Users, Type, Asterisk, Loader2, AlertCircle, CheckCircle} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductUploadFormProps {
  setProductDescription: (description: string) => void;
  setLocation: (location: string) => void;
  setAgeSuitability: (ageSuitability: string) => void;
  setGender: (gender: string) => void;
  isPredictingGlobal: boolean;
  onUploadAndDetailsComplete: () => void; // Callback to trigger prediction
}

export const ProductUploadForm: React.FC<ProductUploadFormProps> = ({
  setProductDescription,
  setLocation,
  setAgeSuitability,
  setGender,
  isPredictingGlobal,
  onUploadAndDetailsComplete,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [imageDataUriForAI, setImageDataUriForAI] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [generatedDescription, setGeneratedDescription] = useState(''); // Stores AI generated desc
  const [localLocation, setLocalLocation] = useState('');
  const [localAgeSuitability, setLocalAgeSuitability] = useState('');
  const [localGender, setLocalGender] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const {toast} = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isImageProcessed, setIsImageProcessed] = useState(false);
  const [areDetailsFilled, setAreDetailsFilled] = useState(false);

  // Check if all required details are filled
  useEffect(() => {
    setAreDetailsFilled(!!(localLocation && localAgeSuitability && localGender));
  }, [localLocation, localAgeSuitability, localGender]);

  // Effect to trigger description generation and then prediction
  useEffect(() => {
    const generateAndPredict = async () => {
      if (imageDataUriForAI && areDetailsFilled && !isGeneratingDescription && !isPredictingGlobal) {
        setIsGeneratingDescription(true);
        setGeneratedDescription('AI is analyzing the design...');
        setProductDescription(''); // Clear parent state

        const detailsForDesc = `Fashion item analysis context: Target Location: ${localLocation}, Target Age Group: ${localAgeSuitability}, Target Gender: ${localGender}${price ? `, Estimated Price: LKR ${price}` : ''}. Focus on design elements, style, potential use cases, and material if inferable.`;

        try {
          const genResult = await generateProductDescription({
            productImageDataUri: imageDataUriForAI,
            additionalDetails: detailsForDesc,
          });

          setGeneratedDescription('Filtering description...');
          const filterResult = await filterProductDescription({
            description: genResult.productDescription,
          });

          setGeneratedDescription(filterResult.filteredDescription);
          setProductDescription(filterResult.filteredDescription); // Update parent state for prediction

          if (!filterResult.isSafe) {
            toast({
              variant: 'destructive',
              title: 'Content Moderated',
              description: 'Generated description was modified for appropriateness.',
              duration: 5000,
            });
          } else {
            toast({
              title: 'Description Ready',
              description: 'AI-generated description complete.',
              variant: "default",
              icon: <CheckCircle className="h-5 w-5 text-green-500" />,
              duration: 3000,
            });
          }
          // Now that description is ready and details are filled, trigger prediction
          onUploadAndDetailsComplete();

        } catch (error: any) {
          console.error('Error in description generation/filtering:', error);
          setGeneratedDescription('');
          setProductDescription('');
          toast({
            variant: 'destructive',
            title: 'Description Failed',
            description: error.message || 'Could not generate product description.',
          });
        } finally {
          setIsGeneratingDescription(false);
        }
      }
    };

    if (isImageProcessed && areDetailsFilled) {
      generateAndPredict();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isImageProcessed, areDetailsFilled, imageDataUriForAI, localLocation, localAgeSuitability, localGender, price, onUploadAndDetailsComplete, setProductDescription, toast]);


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload an image.' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ variant: 'destructive', title: 'File Too Large', description: 'Image should be less than 5MB.' });
        return;
      }

      setImageUrl(URL.createObjectURL(file));
      setGeneratedDescription(''); // Reset description
      setProductDescription('');
      setIsImageProcessed(false); // Mark as not yet processed for AI
      setIsGeneratingDescription(true); // Indicate start of processing a new image
      setGeneratedDescription('Processing image...');


      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDataUriForAI(reader.result as string);
        setIsImageProcessed(true); // Mark image as processed for AI
        // The useEffect will now handle description generation if details are also filled
        // No longer setting isGeneratingDescription to false here, useEffect handles it
        if(!areDetailsFilled) {
          setIsGeneratingDescription(false); // If details not filled, stop "processing image..."
          setGeneratedDescription("Please fill all required details for AI analysis.");
        }
      };
      reader.onerror = () => {
        setIsGeneratingDescription(false);
        setIsImageProcessed(false);
        toast({ variant: 'destructive', title: 'File Read Error', description: 'Could not read image file.' });
      };
      reader.readAsDataURL(file);
    }
  };


  const handleAttributeChange = (
    setter: (value: string) => void, // Local state setter
    parentSetter: (value: string) => void, // Parent state setter (for prediction)
    value: string
  ) => {
    setter(value);
    parentSetter(value); // Keep parent state in sync for prediction trigger
  };
  
  const handleGenderChange = (value: string) => {
    handleAttributeChange(setLocalGender, setGender, value);
  };


  const isFormFullyDisabled = isGeneratingDescription || isPredictingGlobal;
  const allRequiredDetailsFilledForPrediction = !!(imageUrl && generatedDescription && localLocation && localAgeSuitability && localGender);

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl border border-border/50 bg-gradient-to-br from-card via-card/95 to-card dark:from-card dark:via-card/90 dark:to-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/40">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/10 dark:to-transparent border-b border-border/30 p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl flex items-center gap-3 text-primary font-semibold tracking-tight">
          <UploadCloud size={28} strokeWidth={2.5} className="text-accent"/> Upload New Design
        </CardTitle>
        <CardDescription className="text-primary/80 dark:text-primary/70 text-sm mt-1">
          Provide image and details for AI trend analysis & sales forecast.
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
          {isGeneratingDescription && !imageUrl && ( // Show loader if processing and no image URL yet (initial click)
             <div className="mt-4 flex justify-center items-center p-2 border-2 border-dashed border-border/50 rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 h-[216px]">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
        </div>

        <hr className="border-border/20" />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground/90 mb-1 tracking-tight">Market Context Details</h3>
          <p className="text-sm text-muted-foreground mb-4">Provide context for accurate AI predictions. <span className="text-destructive">* Required</span></p>

          <div className="space-y-1.5 relative group">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                <DollarSign size={16} />
            </span>
            <Label htmlFor="price" className="sr-only">Estimated Price (LKR)</Label>
            <Input
              type="number"
              id="price"
              placeholder="Estimated Price (LKR, Optional)"
              value={price}
              onChange={(e) => setPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
              className="w-full focus-visible:ring-primary disabled:opacity-70 pl-10 bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
              disabled={isFormFullyDisabled}
              min="0"
            />
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
              placeholder="Target Age Group (e.g., 18-25, Gen Z)"
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
                <SelectValue placeholder="Select Target Gender" />
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
              isGeneratingDescription ? 'AI is crafting a description...' :
              !imageUrl ? 'Upload image and fill details to generate description...' :
              (generatedDescription || 'Description will appear here...')
            }
            value={generatedDescription}
            onChange={(e) => {
              // Allow editing, but prediction uses the AI-generated one passed to parent
              setGeneratedDescription(e.target.value);
              // Optionally, you could update parent here too if manual edits should override AI for prediction
              // setProductDescription(e.target.value); 
            }}
            className="w-full min-h-[120px] sm:min-h-[150px] focus-visible:ring-primary bg-secondary/30 dark:bg-card/40 disabled:opacity-70 rounded-md shadow-inner border-input hover:border-primary/30"
            disabled={isPredictingGlobal} 
            readOnly={isGeneratingDescription && generatedDescription.startsWith('AI is')} // Readonly while initial generation
          />
           <p className="text-xs text-muted-foreground mt-1">
             {isGeneratingDescription ? 'Generating description...' : (generatedDescription ? 'AI description complete. You can edit if needed.' : 'Description will be auto-generated after image upload and all required details are filled.')}
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
                <AlertCircle size={16} /> Please fill in all required (*) details to enable AI analysis and trend prediction.
             </p>
         )}
      </CardContent>
    </Card>
  );
};
