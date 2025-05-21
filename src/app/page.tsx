
// src/app/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ModeToggle } from '@/components/mode-toggle';
import { BrainCircuit, TrendingUp, BarChartBig, ArrowRight, Users, Zap, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function Home() {
  const { user, loading, logOut } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-secondary/30 to-background dark:from-background dark:via-secondary/10 dark:to-background text-foreground">
      <header className="sticky top-0 z-50 flex items-center justify-between p-3 sm:p-4 bg-card/80 dark:bg-card/70 backdrop-blur-lg shadow-md border-b border-border/40">
        <div className="flex items-center gap-2 sm:gap-3">
           <div className="p-1.5 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-lg shadow-inner">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6 sm:h-7 sm:w-7"><path d="m12 3 4 4 2-2 4 4-6 6-4-4-2 2-4-4 6-6z"/><path d="m3 12 4 4 6-6 4 4 4-4"/></svg>
           </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
            FashionFlow AI
          </h1>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2">
           <Link href="/predict" passHref>
                <Button variant="ghost" size="sm" className="text-sm sm:text-base px-2 sm:px-3 hover:bg-primary/10 dark:hover:bg-primary/20">
                  <Zap className="mr-1 sm:mr-2 h-4 w-4" /> Predict
                </Button>
            </Link>
           <Link href="/about" passHref>
                 <Button variant="ghost" size="sm" className="text-sm sm:text-base px-2 sm:px-3 hover:bg-primary/10 dark:hover:bg-primary/20">
                  <Users className="mr-1 sm:mr-2 h-4 w-4" /> About
                 </Button>
            </Link>
          
          {!loading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-sm sm:text-base px-2 sm:px-3 hover:bg-primary/10 dark:hover:bg-primary/20">
                  <UserCircle className="mr-1 sm:mr-2 h-4 w-4" /> My Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs text-muted-foreground">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !loading ? (
            <Link href="/login" passHref>
              <Button variant="outline" size="sm" className="text-sm sm:text-base px-2 sm:px-3 hover:bg-accent/10 dark:hover:bg-accent/20 border-primary/50 text-primary hover:text-accent-foreground">
                <LogIn className="mr-1 sm:mr-2 h-4 w-4" /> Login
              </Button>
            </Link>
          ) : null}
          <ModeToggle />
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 text-center">
        <Card className="w-full max-w-2xl xl:max-w-3xl shadow-xl border border-border/50 bg-card/90 dark:bg-card/85 rounded-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:border-primary/40 p-6 sm:p-8 md:p-10">
          <CardHeader className="pb-4">
             <BrainCircuit className="mx-auto h-12 w-12 md:h-14 md:w-14 text-accent mb-4" strokeWidth={2}/>
            <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x mb-2">
              Welcome to FashionFlow AI
            </CardTitle>
            <CardDescription className="text-md sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
              Predict the future of your fashion designs. Upload your creation and let our AI analyze its market potential and sales forecast.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              FashionFlow AI leverages the power of Google Gemini to analyze your new fashion designs based on its image and key details like target location, age group, and gender. We provide insights into potential market trends and generate a predicted sales forecast for the next 5 months, visualized in an easy-to-understand chart.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4">
                 <div className="flex items-start gap-3 p-4 bg-secondary/30 dark:bg-secondary/20 rounded-lg border border-border/30 hover:shadow-md transition-shadow">
                    <TrendingUp className="h-6 w-6 text-primary mt-1 shrink-0"/>
                    <div>
                        <h3 className="font-semibold mb-1 text-foreground">Trend Prediction</h3>
                        <p className="text-sm text-muted-foreground">Understand the potential market trajectory of your design.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3 p-4 bg-secondary/30 dark:bg-secondary/20 rounded-lg border border-border/30 hover:shadow-md transition-shadow">
                    <BarChartBig className="h-6 w-6 text-primary mt-1 shrink-0"/>
                    <div>
                        <h3 className="font-semibold mb-1 text-foreground">Sales Forecast</h3>
                        <p className="text-sm text-muted-foreground">Visualize estimated sales performance over the next 5 months.</p>
                    </div>
                 </div>
            </div>

             <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link href="/predict" passHref>
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-shadow text-base sm:text-lg">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
             </div>
          </CardContent>
        </Card>
      </main>

       <footer className="text-center p-4 text-xs sm:text-sm text-muted-foreground border-t border-border/20">
           © {new Date().getFullYear()} FashionFlow AI. Project by Isuru Shavinda.
           <Link href="/about" className="ml-2 underline hover:text-primary">About</Link>
           <Link href="/predict" className="ml-2 underline hover:text-primary">Predict Tool</Link>
       </footer>
    </div>
  );
}
