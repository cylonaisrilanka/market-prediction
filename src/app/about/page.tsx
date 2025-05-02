// src/app/about/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home as HomeIcon, User, Award, Mail, BookOpen, GraduationCap, Eye } from 'lucide-react'; // Added GraduationCap, Eye

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-secondary/30 to-background dark:from-background dark:via-secondary/10 dark:to-background text-foreground">
       <header className="sticky top-0 z-10 flex items-center justify-between p-3 sm:p-4 bg-card/80 dark:bg-card/70 backdrop-blur-lg shadow-md border-b border-border/40">
        <div className="flex items-center gap-2 sm:gap-3">
           {/* Logo Placeholder */}
          <div className="p-1.5 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-lg shadow-inner">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6 sm:h-7 sm:w-7"><path d="m12 3 4 4 2-2 4 4-6 6-4-4-2 2-4-4 6-6z"/><path d="m3 12 4 4 6-6 4 4 4-4"/></svg>
             </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient-x">
            FashionFlow AI - About
          </h1>
        </div>
          <div className="flex items-center gap-2 sm:gap-4">
                 <Link href="/" passHref>
                     <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                         <HomeIcon className="h-4 w-4" />
                         <span className="sr-only">Home</span>
                     </Button>
                 </Link>
              <ModeToggle />
          </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <Card className="w-full max-w-2xl shadow-xl border border-border/50 bg-card/90 dark:bg-card/85 rounded-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:border-primary/40">
          <CardHeader className="text-center border-b border-border/30 pb-6 pt-8">
             <BookOpen className="mx-auto h-12 w-12 text-accent mb-4" strokeWidth={2}/>
            <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
              About This Project
            </CardTitle>
            <CardDescription className="text-lg md:text-xl text-muted-foreground mt-2">
              FashionFlow AI: Predicting the Future of Fashion
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed text-center">
              This application utilizes Google Gemini's advanced AI capabilities to analyze fashion designs and predict future market trends, providing designers with valuable insights and sales forecasts.
            </p>

            <div className="space-y-4 pt-4">
                 {/* Supervisor Section */}
                 <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-secondary/30 dark:bg-secondary/20 rounded-lg border border-border/30">
                     <Avatar className="h-16 w-16 border-2 border-primary/50 shadow-md">
                        {/* Placeholder image or use a real one if available */}
                        <AvatarImage src="https://picsum.photos/seed/supervisor/100" alt="Supervisor Hirushi Dilpriya" data-ai-hint="professional woman" />
                        <AvatarFallback className="text-lg bg-primary/20 text-primary font-semibold">HD</AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-semibold flex items-center justify-center sm:justify-start gap-2">
                          <Eye className="h-5 w-5 text-accent"/> Supervisor
                        </h3>
                        <p className="text-lg text-foreground mt-1">Mrs. Hirushi Dilpriya</p>
                        {/* Optional: Add title or contact if needed */}
                         {/* <p className="text-sm text-muted-foreground">Senior Lecturer</p> */}
                    </div>
                </div>

                 {/* Student Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-secondary/30 dark:bg-secondary/20 rounded-lg border border-border/30">
                    <Avatar className="h-16 w-16 border-2 border-accent/50 shadow-md">
                         {/* Placeholder image or use a real one if available */}
                        <AvatarImage src="https://picsum.photos/seed/student/100" alt="Isuru Shavinda" data-ai-hint="professional man" />
                        <AvatarFallback className="text-lg bg-accent/20 text-accent font-semibold">IS</AvatarFallback>
                    </Avatar>
                    <div className="text-center sm:text-left flex-1">
                         <h3 className="text-xl font-semibold flex items-center justify-center sm:justify-start gap-2">
                           <User className="h-5 w-5 text-primary"/> Developer
                        </h3>
                        <p className="text-lg text-foreground mt-1">Kaluthanthiri Patabandi Isuru Shavinda</p>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center justify-center sm:justify-start gap-2"><Award className="h-4 w-4 text-primary/80"/>Plymouth Index: 10749144</p>
                            <p className="flex items-center justify-center sm:justify-start gap-2"><GraduationCap className="h-4 w-4 text-primary/80"/>Program: BSc. Hons Software Engineering</p>
                            {/* Optional: Add email or contact link */}
                            {/* <p><Mail className="inline mr-1 h-4 w-4"/> example@email.com</p> */}
                        </div>
                    </div>
                </div>
            </div>

             <div className="text-center pt-6">
                 <Link href="/predict" passHref>
                     <Button variant="link" className="text-primary">
                        Try the Prediction Tool
                     </Button>
                 </Link>
             </div>

          </CardContent>
        </Card>
      </main>

       <footer className="text-center p-4 text-xs text-muted-foreground border-t border-border/20">
           © {new Date().getFullYear()} FashionFlow AI.
           <Link href="/" className="ml-2 underline hover:text-primary">Home</Link>
           <Link href="/predict" className="ml-2 underline hover:text-primary">Predict</Link>
       </footer>
    </div>
  );
}