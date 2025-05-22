
// src/components/product-upload-form.tsx
'use client';
/**
 * @fileOverview ProductUploadForm component for FashionFlow AI.
 * This component handles the user input for fashion design details, including
 * image upload, price, target location, age group, and gender.
 * It integrates with AI flows to generate a product description and then triggers
 * the trend prediction flow upon completion of all required inputs.
 */

import {useState, useCallback, useRef, useEffect, type ChangeEvent} from 'react';
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

/**
 * Props for the ProductUploadForm component.
 */
interface ProductUploadFormProps {
  /** Setter for the AI-generated product description, passed to the parent page. */
  setProductDescription: (description: string) => void;
  /** Setter for the target location, passed to the parent page. */
  setLocation: (location: string) => void;
  /** Setter for the target age suitability, passed to the parent page. */
  setAgeSuitability: (ageSuitability: string) => void;
  /** Setter for the target gender, passed to the parent page. */
  setGender: (gender: string) => void;
  /** Boolean indicating if a global prediction process is ongoing (disables form). */
  isPredictingGlobal: boolean;
  /** Callback function to trigger the prediction flow once all inputs are ready. */
  onUploadAndDetailsComplete: () => void;
}

/**
 * ProductUploadForm functional component.
 * Manages local state for form inputs and orchestrates the AI description generation
 * and subsequent prediction triggering.
 * @param {ProductUploadFormProps} props - The props for the component.
 * @returns {JSX.Element} The rendered product upload form.
 */
export const ProductUploadForm: React.FC<ProductUploadFormProps> = ({
  setProductDescription,
  setLocation,
  setAgeSuitability,
  setGender,
  isPredictingGlobal,
  onUploadAndDetailsComplete,
}) => {
  // State for the image preview URL
  const [imageUrl, setImageUrl] = useState('');
  // State for the image data URI to be sent to the AI
  const [imageDataUriForAI, setImageDataUriForAI] = useState('');
  // State for the estimated price (optional)
  const [price, setPrice] = useState<number | ''>('');
  // State for the AI-generated product description displayed in the textarea
  const [generatedDescription, setGeneratedDescription] = useState('');
  // Local states for market context details
  const [localLocation, setLocalLocation] = useState('');
  const [localAgeSuitability, setLocalAgeSuitability] = useState('');
  const [localGender, setLocalGender] = useState('');
  // State to track if AI description generation is in progress
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const {toast} = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flags to track form completion status
  const [isImageProcessed, setIsImageProcessed] = useState(false);
  const [areDetailsFilled, setAreDetailsFilled] = useState(false);

  // Effect to update `areDetailsFilled` flag when local market context details change.
  useEffect(() => {
    setAreDetailsFilled(!!(localLocation && localAgeSuitability && localGender));
  }, [localLocation, localAgeSuitability, localGender]);

  // Effect to automatically generate product description and then trigger prediction
  // once an image is processed and all required market context details are filled.
  useEffect(() => {
    const generateAndPredict = async () => {
      // Proceed only if image is ready, details are filled, and no AI processes are currently running.
      if (imageDataUriForAI && areDetailsFilled && !isGeneratingDescription && !isPredictingGlobal) {
        setIsGeneratingDescription(true);
        setGeneratedDescription('AI is analyzing the design and crafting a description...');
        setProductDescription(''); // Clear parent's description state

        // Construct additional details string for the description generation AI
        const detailsForDesc = `Fashion item analysis context: Target Location: ${localLocation}, Target Age Group: ${localAgeSuitability}, Target Gender: ${localGender}${price ? `, Estimated Price: LKR ${price}` : ''}. Focus on design elements, style, potential use cases, and material if inferable.`;

        try {
          // Step 1: Generate product description
          const genResult = await generateProductDescription({
            productImageDataUri: imageDataUriForAI,
            additionalDetails: detailsForDesc,
          });

          setGeneratedDescription('Filtering generated description for appropriateness...');
          // Step 2: Filter the generated description for safety
          const filterResult = await filterProductDescription({
            description: genResult.productDescription,
          });

          setGeneratedDescription(filterResult.filteredDescription);
          setProductDescription(filterResult.filteredDescription); // Update parent state with the final description

          if (!filterResult.isSafe) {
            toast({
              variant: 'destructive',
              title: 'Content Moderated',
              description: 'The AI-generated description was modified to ensure appropriateness.',
              duration: 5000,
            });
          } else {
            toast({
              title: 'Description Ready',
              description: 'AI-generated product description is complete.',
              variant: "default",
              icon: <CheckCircle className="h-5 w-5 text-green-500" />,
              duration: 3000,
            });
          }
          // Step 3: Signal parent component that all inputs are ready to trigger prediction
          onUploadAndDetailsComplete();

        } catch (error: any) {
          console.error('Error in AI description generation/filtering:', error);
          setGeneratedDescription(''); // Clear description on error
          setProductDescription('');
          toast({
            variant: 'destructive',
            title: 'AI Description Failed',
            description: error.message || 'Could not generate product description. Please try again.',
          });
        } finally {
          setIsGeneratingDescription(false); // Reset description generation flag
        }
      }
    };

    // Trigger the process if image is processed and details are filled.
    if (isImageProcessed && areDetailsFilled) {
      generateAndPredict();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // Dependencies for this effect. Note: `onUploadAndDetailsComplete` and `setProductDescription` are from props.
  }, [isImageProcessed, areDetailsFilled, imageDataUriForAI, localLocation, localAgeSuitability, localGender, price, onUploadAndDetailsComplete, setProductDescription, toast]);

  /**
   * Handles the image file upload.
   * Validates file type and size, creates a preview URL, and reads the file as a data URI for AI processing.
   * @param {ChangeEvent<HTMLInputElement>} e - The input change event from the file input.
   */
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // File type validation
      if (!file.type.startsWith('image/')) {
        toast({ variant: 'destructive', title: 'Invalid File Type', description: 'Please upload an image file (e.g., JPG, PNG).' });
        return;
      }
      // File size validation (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) { 
        toast({ variant: 'destructive', title: 'File Too Large', description: 'Image size should be less than 5MB.' });
        return;
      }

      setImageUrl(URL.createObjectURL(file)); // For local preview
      setGeneratedDescription(''); // Reset previous AI description
      setProductDescription(''); // Reset parent's description state
      setIsImageProcessed(false); // Mark image as not yet processed for the current AI cycle
      setIsGeneratingDescription(true); // Indicate start of image processing
      setGeneratedDescription('Processing image...'); // Initial feedback

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDataUriForAI(reader.result as string); // Set data URI for AI
        setIsImageProcessed(true); // Mark image as ready for AI
        // The useEffect hook will now handle the description generation if market details are also filled.
        // If details are not yet filled, stop showing "Processing image..." and prompt user.
        if(!areDetailsFilled) {
          setIsGeneratingDescription(false); 
          setGeneratedDescription("Image processed. Please fill all required market context details for AI analysis.");
        }
      };
      reader.onerror = () => {
        setIsGeneratingDescription(false);
        setIsImageProcessed(false);
        toast({ variant: 'destructive', title: 'File Read Error', description: 'Could not read the image file.' });
      };
      reader.readAsDataURL(file); // Read file as Base64 data URI
    }
  };

  /**
   * Generic handler for changes in market context input fields.
   * Updates both local state and parent state (passed via props).
   * @param setter Local state setter function.
   * @param parentSetter Parent component's state setter function.
   * @param value The new value from the input.
   */
  const handleAttributeChange = (
    setter: (value: string) => void,
    parentSetter: (value: string) => void,
    value: string
  ) => {
    setter(value);
    parentSetter(value); // Keep parent state in sync for prediction trigger
  };
  
  /**
   * Specific handler for gender selection change.
   * @param {string} value - The selected gender value.
   */
  const handleGenderChange = (value: string) => {
    handleAttributeChange(setLocalGender, setGender, value);
  };

  // Determine if the entire form should be disabled (e.g., during AI processing).
  const isFormFullyDisabled = isGeneratingDescription || isPredictingGlobal;
  // Check if all conditions are met to enable a prediction attempt (used for UI feedback).
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
        {/* Image Upload Section */}
        <div className="space-y-3">
          <Label htmlFor="image" className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
            <FileImage size={16} className="text-muted-foreground" /> Fashion Design Image
            <Asterisk size={10} className="text-destructive ml-0.5" /> {/* Required field indicator */}
          </Label>
          <Input
            type="file"
            id="image"
            accept="image/*" // Accept only image files
            onChange={handleImageUpload}
            ref={fileInputRef} // Ref for potential programmatic access
            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-primary file:to-accent file:text-primary-foreground hover:file:opacity-90 cursor-pointer focus-visible:ring-primary disabled:opacity-70 disabled:cursor-not-allowed bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
            disabled={isFormFullyDisabled}
            required
          />
          {/* Image Preview Area */}
          {imageUrl && (
            <div className="mt-4 flex justify-center p-2 border-2 border-dashed border-border/50 rounded-lg bg-gradient-to-br from-secondary/30 to-background dark:from-secondary/20 dark:to-card/50">
              <Image
                src={imageUrl}
                alt="Fashion Design Preview"
                width={200}
                height={200}
                className="object-contain rounded-md shadow-md bg-white dark:bg-muted/50"
                data-ai-hint="fashion clothing preview" // Hint for AI image search/generation tools
                priority // Prioritize loading of this image
              />
            </div>
          )}
          {/* Loading indicator for image processing when no preview is available yet */}
          {isGeneratingDescription && !imageUrl && (
             <div className="mt-4 flex justify-center items-center p-2 border-2 border-dashed border-border/50 rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 h-[216px]">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          )}
        </div>

        <hr className="border-border/20" />

        {/* Market Context Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground/90 mb-1 tracking-tight">Market Context Details</h3>
          <p className="text-sm text-muted-foreground mb-4">Provide context for accurate AI predictions. <span className="text-destructive">* Required</span></p>

          {/* Price Input (Optional) */}
          <div className="space-y-1.5 relative group">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                <DollarSign size={16} />
            </span>
            <Label htmlFor="price" className="sr-only">Estimated Price (LKR)</Label>
            <Input
              type="number"
              id="price"
              placeholder="Est. Price (LKR, Optional)"
              value={price}
              onChange={(e) => setPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
              className="w-full focus-visible:ring-primary disabled:opacity-70 pl-10 bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
              disabled={isFormFullyDisabled}
              min="0"
            />
          </div>

          {/* Target Location Input (Required) */}
          <div className="space-y-1.5 relative group">
            <span className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                <MapPin size={16} />
            </span>
            <Label htmlFor="location" className="sr-only">Target Location</Label>
            <Input
              type="text"
              id="location"
              placeholder="Target Location (e.g., Colombo, Paris, Global)"
              value={localLocation}
              onChange={(e) => handleAttributeChange(setLocalLocation, setLocation, e.target.value)}
              className="w-full focus-visible:ring-primary disabled:opacity-70 pl-10 bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
              disabled={isFormFullyDisabled}
              required
            />
            <Asterisk size={10} className="absolute right-3 top-3 text-destructive opacity-70 group-focus-within:opacity-100" />
          </div>

          {/* Target Age Group Input (Required) */}
          <div className="space-y-1.5 relative group">
            <span className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                 <User size={16}/>
            </span>
            <Label htmlFor="ageSuitability" className="sr-only">Target Age Group</Label>
            <Input
              type="text"
              id="ageSuitability"
              placeholder="Target Age Group (e.g., 18-25, Gen Z, 30s)"
              value={localAgeSuitability}
              onChange={(e) => handleAttributeChange(setLocalAgeSuitability, setAgeSuitability, e.target.value)}
              className="w-full focus-visible:ring-primary disabled:opacity-70 pl-10 bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
              disabled={isFormFullyDisabled}
              required
            />
            <Asterisk size={10} className="absolute right-3 top-3 text-destructive opacity-70 group-focus-within:opacity-100" />
          </div>

          {/* Target Gender Select (Required) */}
          <div className="space-y-1.5 relative group">
             <span className="absolute left-3 top-2.5 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors z-10">
                 <Users size={16}/>
             </span>
            <Label htmlFor="gender" className="sr-only">Target Gender</Label>
            <Select
                value={localGender}
                onValueChange={handleGenderChange} // Custom handler for Select component
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

        {/* AI Generated Description Section */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="flex items-center gap-1.5 text-sm font-medium text-foreground/90">
            <Type size={16} className="text-muted-foreground" /> AI Generated Description
          </Label>
          <Textarea
            id="description"
            placeholder={
              isGeneratingDescription ? 'AI is crafting a description...' : // Placeholder during generation
              !imageUrl ? 'Upload image and fill details to auto-generate description...' : // Prompt if no image
              (generatedDescription || 'Description will appear here after processing...') // Default or generated
            }
            value={generatedDescription}
            onChange={(e) => {
              // Allow user to manually edit the AI-generated description if needed.
              setGeneratedDescription(e.target.value);
              // If manual edits should immediately affect prediction, update parent state here:
              // setProductDescription(e.target.value); 
            }}
            className="w-full min-h-[120px] sm:min-h-[150px] focus-visible:ring-primary bg-secondary/30 dark:bg-card/40 disabled:opacity-70 rounded-md shadow-inner border-input hover:border-primary/30"
            disabled={isPredictingGlobal} // Disabled if a global prediction is running
            readOnly={isGeneratingDescription && generatedDescription.includes('AI is')} // Readonly during initial generation phase
          />
           <p className="text-xs text-muted-foreground mt-1">
             {isGeneratingDescription ? 'Generating description...' : (generatedDescription && !generatedDescription.includes("Please fill all required") ? 'AI description complete. You can edit if needed.' : 'Description will be auto-generated after image upload and all required market context details are filled.')}
          </p>
        </div>

        {/* Global Loading Indicator for AI processes */}
        {(isGeneratingDescription || isPredictingGlobal) && (
          <div className="flex justify-center items-center gap-2 pt-4 text-sm text-primary font-medium">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{isGeneratingDescription ? 'Analyzing Design & Generating Text...' : (isPredictingGlobal ? 'Predicting Market Trends...' : '')}</span>
          </div>
        )}
        {/* Prompt to fill details if image is uploaded but details are missing */}
         {!allRequiredDetailsFilledForPrediction && imageUrl && !isGeneratingDescription && !isPredictingGlobal && (
             <p className="text-sm text-center text-amber-600 dark:text-amber-500 font-medium pt-2 px-2 flex items-center justify-center gap-2">
                <AlertCircle size={16} /> Please fill in all required (*) market context details to enable AI analysis and trend prediction.
             </p>
         )}
      </CardContent>
    </Card>
  );
};
