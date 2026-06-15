'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Trophy, Code, Users, Zap, Terminal, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null; // Avoid rendering flash before redirect

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="container relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              DevBattle Phase 1 is Live
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70 animate-in fade-in slide-in-from-bottom-6">
              Code. Compete. <span className="text-primary">Conquer.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-10 animate-in fade-in slide-in-from-bottom-8">
              The ultimate platform to enhance your programming skills, battle with developers globally, and climb the leaderboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8">
                  Start Coding Now
                </Button>
              </Link>
              <Link href="/problems">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-12 px-8">
                  Explore Problems
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-20 border-y border-border/40 bg-muted/30">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</h3>
                <p className="text-muted-foreground font-medium">Active Users</p>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</h3>
                <p className="text-muted-foreground font-medium">Problems</p>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">1M+</h3>
                <p className="text-muted-foreground font-medium">Submissions</p>
              </div>
              <div>
                <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</h3>
                <p className="text-muted-foreground font-medium">Contests</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DevBattle?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to master algorithms, prepare for technical interviews, and prove your skills.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-card/50 backdrop-blur border-border/50 transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Extensive Problem Library</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Practice with a vast collection of algorithmic problems ranging from beginner to advanced levels.
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-border/50 transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                    <Trophy className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>Global Contests</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Participate in weekly contests, climb the leaderboard, and earn exclusive badges.
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-border/50 transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-success" />
                  </div>
                  <CardTitle>Lightning Fast Execution</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Our custom judge engine evaluates your code securely and quickly across multiple languages.
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-border/50 transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                    <Terminal className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle>Advanced Editor</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Code in your browser with a powerful Monaco-based editor featuring syntax highlighting and autocomplete.
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-border/50 transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Vibrant Community</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Discuss solutions, learn from others, and build your network with developers worldwide.
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-border/50 transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle>Interview Prep</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Targeted problem sets for top tech companies to help you land your dream job.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="container max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Join the Battle?</h2>
            <p className="text-xl text-muted-foreground mb-10">
              Create your account today and start your journey to becoming a top competitive programmer.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
