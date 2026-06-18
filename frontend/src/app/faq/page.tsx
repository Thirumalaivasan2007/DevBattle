"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, MessageCircleQuestion, Trophy, Shield, Zap, Users, Code2 } from 'lucide-react';

const faqCategories = [
  { id: 'general', name: 'General', icon: MessageCircleQuestion },
  { id: 'battles', name: 'Battles & Contests', icon: Swords },
  { id: 'teams', name: 'Teams', icon: Users },
  { id: 'judging', name: 'Code Execution', icon: Code2 },
];

function Swords(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" x2="19" y1="19" y2="13" />
      <line x1="16" x2="20" y1="16" y2="20" />
      <line x1="19" x2="21" y1="21" y2="19" />
      <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
      <line x1="5" x2="9" y1="14" y2="18" />
      <line x1="7" x2="4" y1="17" y2="20" />
      <line x1="3" x2="5" y1="19" y2="21" />
    </svg>
  )
}

const faqs = [
  {
    category: 'general',
    question: 'What makes DevBattle different from other platforms?',
    answer: 'DevBattle focuses on real-time multiplayer coding. Instead of just solving algorithms in isolation, you can challenge friends to 1v1 Battles, form Teams to climb global leaderboards, and experience an interactive, gamified learning path.'
  },
  {
    category: 'general',
    question: 'How is my global rating calculated?',
    answer: 'We use an adapted Elo-rating system similar to chess. You gain rating points by solving problems, winning 1v1 battles, and ranking high in weekly contests. Defeating a higher-rated opponent yields significantly more points.'
  },
  {
    category: 'battles',
    question: 'What happens if a Battle ends in a tie?',
    answer: 'If both players pass all test cases, the winner is determined by Execution Time (performance) and Space Complexity (memory). If both are identical, the player who submitted their correct code first wins.'
  },
  {
    category: 'teams',
    question: 'How do Team levels work?',
    answer: 'Teams earn XP when any member completes daily challenges, solves hard problems, or wins battles. As the Team levels up, you unlock exclusive banners, larger roster caps, and the ability to host custom tournaments.'
  },
  {
    category: 'judging',
    question: 'Which programming languages are supported?',
    answer: 'Our custom Judge Engine currently supports Python, JavaScript, TypeScript, C++, Java, and Go. All code is executed in isolated, secure Docker containers.'
  }
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pt-20 pb-24">
      <div className="container max-w-5xl mx-auto px-4 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 border border-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.3)]">
            <MessageCircleQuestion className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            How can we help?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about the product and billing. Can't find the answer? Reach out to our support team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Sidebar Categories */}
          <div className="md:col-span-4 space-y-2">
            {faqCategories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => { setActiveCategory(category.id); setOpenFaq(0); }}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 text-left ${
                    isActive 
                      ? 'bg-primary/10 border-primary/30 border shadow-sm text-primary font-semibold translate-x-2' 
                      : 'hover:bg-muted/50 border border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : 'opacity-70'}`} />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* FAQ Accordion Area */}
          <div className="md:col-span-8 space-y-4">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <Card 
                  key={index} 
                  className={`border-border/40 transition-all duration-300 overflow-hidden cursor-pointer ${isOpen ? 'shadow-md border-primary/30 bg-muted/20' : 'hover:border-border/80 hover:bg-muted/10'}`}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <div className="p-6 flex items-start justify-between gap-4">
                    <h3 className={`text-lg font-semibold transition-colors ${isOpen ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {faq.question}
                    </h3>
                    <ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 text-muted-foreground ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                  </div>
                  
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </Card>
              )
            })}
            
            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No FAQs available for this category yet.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
