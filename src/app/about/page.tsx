
// src/app/about/page.tsx
'use client';
/**
 * @fileOverview The About page for the FashionFlow AI application.
 * Displays information about the project, its purpose, the supervisor, and the developer.
 * Includes navigation back to the home page, prediction tool, and authentication links/status.
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home as HomeIcon, User, Award, BookOpen, GraduationCap, Eye, Zap, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * AboutPage component.
 * Renders the content for the "/about" route.
 * @returns {JSX.Element} The rendered About page.
 */
export default function AboutPage() {
  const { user, loading, logOut } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-secondary/30 to-background dark:from-background dark:via-secondary/10 dark:to-background text-foreground">
       {/* Header Section */}
       <header className="sticky top-0 z-50 flex items-center justify-between p-3 sm:p-4 bg-card/80 dark:bg-card/70 backdrop-blur-lg shadow-md border-b border-border/40">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo and App Name */}
          <div className="p-1.5 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-lg shadow-inner">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6 sm:h-7 sm:w-7"><path d="m12 3 4 4 2-2 4 4-6 6-4-4-2 2-4-4 6-6z"/><path d="m3 12 4 4 6-6 4 4 4-4"/></svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
            FashionFlow AI - About
          </h1>
        </div>
          {/* Navigation and Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
                 <Link href="/" passHref>
                     <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary/10 dark:hover:bg-primary/20">
                         <HomeIcon className="h-4 w-4" />
                         <span className="sr-only">Home</span>
                     </Button>
                 </Link>
                {/* Auth Status and Actions */}
                {!loading && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="px-2 sm:px-3 hover:bg-primary/10 dark:hover:bg-primary/20">
                        <UserCircle className="mr-1 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">My Account</span>
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
                    <Button variant="outline" size="sm" className="hover:bg-accent/10 dark:hover:bg-accent/20 border-primary/50 text-primary hover:text-accent-foreground">
                      <LogIn className="mr-1 sm:mr-2 h-4 w-4" /> Login
                    </Button>
                  </Link>
                ) : null} {/* Render nothing if auth is still loading */}
              <ModeToggle /> {/* Theme toggle component */}
          </div>
      </header>

      {/* Main Content Section */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <Card className="w-full max-w-xl md:max-w-2xl shadow-xl border border-border/50 bg-card/90 dark:bg-card/85 rounded-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:border-primary/40">
          <CardHeader className="text-center border-b border-border/30 pb-6 pt-8">
             <BookOpen className="mx-auto h-12 w-12 text-accent mb-4" strokeWidth={2}/>
            <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
              About This Project
            </CardTitle>
            <CardDescription className="text-lg md:text-xl text-muted-foreground mt-2 px-2">
              FashionFlow AI: Predicting the Future of Fashion, powered by Google Gemini.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed text-center">
              This application utilizes Google Gemini's advanced AI capabilities to analyze fashion designs based on images and contextual details. It predicts future market trends, provides an estimated sales forecast, and offers actionable insights to designers and fashion professionals.
            </p>

            {/* Supervisor and Developer Information */}
            <div className="space-y-4 pt-4">
                 <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-secondary/30 dark:bg-secondary/20 rounded-lg border border-border/30 hover:shadow-md transition-shadow">
                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-semibold flex items-center justify-center sm:justify-start gap-2 text-foreground">
                          <Eye className="h-5 w-5 text-accent"/> Supervisor
                        </h3>
                        <p className="text-lg text-foreground/90 mt-1">Mrs. Hirushi Dilpriya</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-secondary/30 dark:bg-secondary/20 rounded-lg border border-border/30 hover:shadow-md transition-shadow">
                    <div className="text-center sm:text-left flex-1">
                         <h3 className="text-xl font-semibold flex items-center justify-center sm:justify-start gap-2 text-foreground">
                           <User className="h-5 w-5 text-primary"/> Developer
                        </h3>
                        <p className="text-lg text-foreground/90 mt-1">Kaluthanthiri Patabandi Isuru Shavinda</p>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center justify-center sm:justify-start gap-2"><Award className="h-4 w-4 text-primary/80"/>Plymouth Index: 10749144</p>
                            <p className="flex items-center justify-center sm:justify-start gap-2"><GraduationCap className="h-4 w-4 text-primary/80"/>Program: BSc. Hons Software Engineering</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
             <div className="text-center pt-6">
                 <Link href="/predict" passHref>
                     <Button variant="default" className="bg-gradient-to-r from-primary to-accent/90 text-primary-foreground shadow-md hover:shadow-lg">
                        <Zap className="mr-2 h-4 w-4" /> Try the Prediction Tool
                     </Button>
                 </Link>
             </div>

          </CardContent>
        </Card>
      </main>

       {/* Footer Section */}
       <footer className="text-center p-4 text-xs sm:text-sm text-muted-foreground border-t border-border/20">
           © {new Date().getFullYear()} FashionFlow AI.
           <Link href="/" className="ml-2 underline hover:text-primary">Home</Link>
           <Link href="/predict" className="ml-2 underline hover:text-primary">Predict</Link>
       </footer>
    </div>
  );
}
