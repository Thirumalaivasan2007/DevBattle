"use client";

import React from 'react';
import { ShieldCheck, Scale, FileText, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/5 via-background to-background pt-20 pb-24">
      <div className="container max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Scale className="h-10 w-10 text-indigo-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto border-b border-border/40 pb-8">
            Effective Date: <span className="text-foreground font-medium">June 18, 2026</span>
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          
          <Card className="border-border/40 bg-card/40 backdrop-blur-sm shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform origin-top transition-transform group-hover:scale-y-100 opacity-50"></div>
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-muted rounded-lg">
                  <FileText className="h-6 w-6 text-indigo-500" />
                </div>
                <h2 className="text-2xl font-bold">1. Platform Usage & Accounts</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  DevBattle grants you a personal, worldwide, royalty-free, non-assignable and non-exclusive license to use the software provided to you. This license is for the sole purpose of enabling you to use and enjoy the benefit of the Services as provided by DevBattle, in the manner permitted by these Terms.
                </p>
                <p>
                  You are responsible for safeguarding the password that you use to access the Services and for any activities or actions under your password. We encourage you to use "strong" passwords. DevBattle cannot and will not be liable for any loss or damage arising from your failure to comply with the above.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/40 backdrop-blur-sm shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 transform origin-top transition-transform group-hover:scale-y-100 opacity-50"></div>
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-muted rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-rose-500" />
                </div>
                <h2 className="text-2xl font-bold">2. Anti-Cheating & Fair Play</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  As a highly competitive ranking platform, integrity is our core foundation. We employ automated heuristics, machine learning, and manual reviews to detect plagiarism, unauthorized bot usage, and rating manipulation.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-rose-500">
                  <li><span className="text-foreground font-medium">Multiple Accounts:</span> Operating "smurf" accounts to farm rating or manipulate matchmaking is strictly prohibited.</li>
                  <li><span className="text-foreground font-medium">Code Plagiarism:</span> Copying solutions during an active contest will result in a permanent ban.</li>
                  <li><span className="text-foreground font-medium">Platform Abuse:</span> Attempting to maliciously exploit the Judge execution environments will result in immediate termination and potential legal action.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/40 backdrop-blur-sm shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 transform origin-top transition-transform group-hover:scale-y-100 opacity-50"></div>
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-muted rounded-lg">
                  <ShieldCheck className="h-6 w-6 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold">3. User-Generated Content</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  Our platform allows you to post code solutions, discussion threads, and comments. You retain full ownership of the intellectual property rights that you hold in that content. However, by submitting content, you grant DevBattle a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content.
                </p>
                <p>
                  Any toxic behavior, hate speech, or harassment in the community channels will lead to immediate revocation of your posting privileges.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
