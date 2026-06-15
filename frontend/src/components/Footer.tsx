import Link from 'next/link';
import { Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background pt-12 pb-8">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Code2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">DevBattle</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Code. Compete. Conquer. The ultimate platform to enhance your programming skills and battle with developers globally.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/problems" className="hover:text-primary transition-colors">Problems</Link></li>
              <li><Link href="/contests" className="hover:text-primary transition-colors">Contests</Link></li>
              <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link></li>
              <li><Link href="/discuss" className="hover:text-primary transition-colors">Discuss</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Link 1
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Link 2
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Link 3
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DevBattle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
