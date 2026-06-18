"use client";

import React from 'react';
import { BookOpen, Calendar, ArrowRight, UserCircle, Cpu, ShieldAlert, Code } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const blogPosts = [
  {
    id: 1,
    title: 'Architecting the DevBattle Judge Engine',
    excerpt: 'Deep dive into how we built a highly concurrent, secure, Docker-based code execution engine that scales to thousands of submissions per minute.',
    category: 'Engineering',
    date: 'June 14, 2026',
    author: 'System Architect',
    readTime: '8 min read',
    icon: Cpu,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    id: 2,
    title: 'The Math Behind Our Elo Rating System',
    excerpt: 'Why traditional Elo fails in 1v1 coding battles and how we adapted Glicko-2 to create a fairer matchmaking experience.',
    category: 'Data Science',
    date: 'May 28, 2026',
    author: 'Data Team',
    readTime: '6 min read',
    icon: Code,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    id: 3,
    title: 'Zero-Day Prevention in Sandboxes',
    excerpt: 'Preventing fork bombs, memory leaks, and network exploits when running untrusted user code in our execution pipeline.',
    category: 'Security',
    date: 'April 02, 2026',
    author: 'Security Team',
    readTime: '12 min read',
    icon: ShieldAlert,
    color: 'text-rose-500',
    bg: 'bg-rose-500/10'
  }
];

export default function BlogPage() {
  const handleComingSoon = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info("Coming Soon", { description: "We are still writing this article. Check back later!" });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pt-20 pb-24">
      <div className="container max-w-6xl mx-auto px-4 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.2)] mb-2">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
            Engineering Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, architecture deep-dives, and competitive programming tips directly from the DevBattle engineering team.
          </p>
        </div>

        {/* Featured Post (Placeholder format) */}
        <div onClick={handleComingSoon} className="relative rounded-3xl overflow-hidden border border-border/40 bg-card shadow-xl group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="grid md:grid-cols-2">
            <div className="p-10 md:p-16 flex flex-col justify-center space-y-6 relative z-10">
              <div className="flex items-center gap-3 text-sm font-medium">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary">Major Update</span>
                <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="h-4 w-4" /> June 18, 2026</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight group-hover:text-primary transition-colors">
                DevBattle Phase 15: Scaling to 100k Users
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're rolling out our massive Enterprise Infrastructure update. Moving from a modular monolith to a scalable Kubernetes microservice architecture backed by Redis caching.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <UserCircle className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-bold">Thirumalaivasan T</p>
                    <p className="text-xs text-muted-foreground">Lead Architect</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block bg-muted/30 border-l border-border/40 relative">
              {/* Abstract decorative graphic for featured post */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105 transform">
                <div className="w-64 h-64 border-4 border-primary rounded-full absolute animate-ping duration-1000"></div>
                <Cpu className="h-32 w-32 text-primary absolute" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts Grid */}
        <div>
          <div className="flex items-center justify-between mb-8 border-b border-border/40 pb-4">
            <h3 className="text-2xl font-bold">Latest Articles</h3>
            <button onClick={handleComingSoon} className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1">
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const Icon = post.icon;
              return (
                <div key={post.id} onClick={handleComingSoon} className="group cursor-pointer">
                  <div className="rounded-2xl border border-border/40 bg-card shadow-sm hover:shadow-lg hover:border-primary/30 transition-all overflow-hidden h-full flex flex-col relative">
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${post.bg} ${post.color}`}>
                          {post.category}
                        </span>
                        <Icon className={`h-5 w-5 ${post.color} opacity-70`} />
                      </div>
                      
                      <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40 text-xs text-muted-foreground">
                        <span className="font-medium">{post.author}</span>
                        <div className="flex items-center gap-3">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
