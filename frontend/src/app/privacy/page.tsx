"use client";

import React from 'react';
import { Lock, Eye, Database, Server, Fingerprint } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/5 via-background to-background pt-20 pb-24">
      <div className="container max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 shadow-[0_0_30px_rgba(20,184,166,0.2)]">
            <Lock className="h-10 w-10 text-teal-500" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto border-b border-border/40 pb-8">
            Your data is your code. We protect both.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          
          <Card className="border-border/40 bg-card/40 backdrop-blur-sm shadow-sm relative overflow-hidden group hover:border-teal-500/30 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 opacity-50"></div>
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-muted rounded-lg">
                  <Fingerprint className="h-6 w-6 text-teal-500" />
                </div>
                <h2 className="text-2xl font-bold">1. Information We Collect</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  When you register for DevBattle, we collect basic identifying information such as your email address, username, and encrypted password hash. We also collect data regarding your problem submissions, code execution metrics (time/memory), and battle history to accurately calculate your Elo rating.
                </p>
                <p>
                  We do <span className="text-foreground font-medium">not</span> collect any financial information directly. If we introduce premium subscriptions in the future, payment processing will be handled entirely by third-party secure gateways like Stripe.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/40 backdrop-blur-sm shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-50"></div>
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-muted rounded-lg">
                  <Database className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold">2. How We Use Your Data</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  Your performance data is the core of our platform. We use it to:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                    <span className="text-sm">Maintain and update your global competitive rating and division rankings.</span>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                    <span className="text-sm">Generate aggregate statistics to balance problem difficulties.</span>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                    <span className="text-sm">Analyze execution engine performance for infrastructure scaling.</span>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                    <span className="text-sm">Provide personalized problem recommendations.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/40 backdrop-blur-sm shadow-sm relative overflow-hidden group hover:border-purple-500/30 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-50"></div>
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-muted rounded-lg">
                  <Server className="h-6 w-6 text-purple-500" />
                </div>
                <h2 className="text-2xl font-bold">3. Data Security & Storage</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  We implement enterprise-grade security measures. Your code is executed in isolated Docker sandboxes with no internet access and strict resource limits to prevent server exploitation. Passwords are cryptographically hashed using bcrypt.
                </p>
                <p>
                  While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security, as no method of transmission over the Internet is 100% secure.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
