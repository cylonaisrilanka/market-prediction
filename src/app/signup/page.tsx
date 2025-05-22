
// src/app/signup/page.tsx
'use client';
/**
 * @fileOverview Signup page for new user registration.
 * Allows users to create an account using their email and password.
 * Uses Firebase Authentication through the `useAuth` hook.
 */

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; // Corrected import path
import { UserPlus, Mail, Lock } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

/**
 * SignupPage component.
 * Renders the signup form and handles the user registration process.
 * @returns {JSX.Element} The rendered signup page.
 */
export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth(); // Authentication context hook
  const router = useRouter(); // Next.js router hook for navigation
  const { toast } = useToast(); // Toast notification hook

  /**
   * Handles the form submission for user signup.
   * Validates passwords and attempts to create a new user with Firebase.
   * @param {FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic password confirmation
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Passwords do not match.',
      });
      return;
    }
    // Password length validation (Firebase requires at least 6 characters)
    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: 'Password should be at least 6 characters long.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password); // Attempt to sign up with Firebase
      toast({
        title: 'Signup Successful',
        description: 'Welcome! You can now log in.',
      });
      router.push('/login'); // Redirect to login page after successful signup
    } catch (error: any) {
      console.error('Signup failed:', error);
      // Provide more specific error messages if available from Firebase
      let description = 'An error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'This email address is already in use by another account.';
      } else if (error.code === 'auth/invalid-email') {
        description = 'The email address is not valid.';
      } else if (error.code === 'auth/weak-password') {
        description = 'The password is too weak.';
      } else if (error.message) {
        description = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      {/* Theme toggle button positioned at the top right */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      {/* Signup form card */}
      <Card className="w-full max-w-md shadow-xl border border-border/50 bg-card/90 dark:bg-card/85 rounded-xl backdrop-blur-md">
        <CardHeader className="text-center border-b border-border/30 pb-6 pt-8">
          <UserPlus className="mx-auto h-12 w-12 text-accent mb-4" strokeWidth={2}/>
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Create Account</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-1">Join FashionFlow AI to predict trends.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1.5 text-foreground/90">
                <Mail size={16} className="text-muted-foreground"/> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
                disabled={isLoading}
              />
            </div>
            {/* Password input field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-1.5 text-foreground/90">
                <Lock size={16} className="text-muted-foreground"/> Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min. 6 characters)"
                required
                className="bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
                disabled={isLoading}
                minLength={6} // HTML5 validation for minimum length
              />
            </div>
            {/* Confirm Password input field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-1.5 text-foreground/90">
                <Lock size={16} className="text-muted-foreground"/> Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
                disabled={isLoading}
                minLength={6}
              />
            </div>
            {/* Submit button */}
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent/90 text-primary-foreground shadow-md hover:shadow-lg" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm pt-4 pb-6 border-t border-border/30">
          {/* Link to login page */}
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
          {/* Link back to home page */}
          <Link href="/" className="mt-4 text-muted-foreground hover:text-primary hover:underline text-xs">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
