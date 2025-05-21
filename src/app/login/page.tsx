// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Mail, Lock } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle'; // Added ModeToggle


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { logIn } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await logIn(email, password);
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      router.push('/'); // Redirect to home page after successful login
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-background p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <Card className="w-full max-w-md shadow-xl border border-border/50 bg-card/90 dark:bg-card/85 rounded-xl backdrop-blur-md">
        <CardHeader className="text-center border-b border-border/30 pb-6 pt-8">
          <LogIn className="mx-auto h-12 w-12 text-accent mb-4" strokeWidth={2}/>
          <CardTitle className="text-3xl font-bold tracking-tight text-primary">Welcome Back!</CardTitle>
          <CardDescription className="text-lg text-muted-foreground mt-1">Log in to continue to FashionFlow AI.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-1.5 text-foreground/90">
                <Lock size={16} className="text-muted-foreground"/> Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-background/50 dark:bg-card/60 border-input hover:border-primary/30"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent/90 text-primary-foreground shadow-md hover:shadow-lg" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center text-sm pt-4 pb-6 border-t border-border/30">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
           <Link href="/" className="mt-4 text-muted-foreground hover:text-primary hover:underline text-xs">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
