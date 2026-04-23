import { Link } from "react-router-dom";
import { Mail, Facebook, Instagram, Send } from "lucide-react";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer id="contact" className="relative mt-24 border-t border-border/50 bg-card/50">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <img src={logo} alt="SWAS Tasks" width={44} height={44} className="h-11 w-11" loading="lazy" />
              <span className="text-2xl font-extrabold text-gradient-brand">SWAS Tasks</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Your Tasks. Your Time. Your Earnings.</p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
              <li><a href="#about" className="text-muted-foreground hover:text-primary">About</a></li>
              <li><a href="#how" className="text-muted-foreground hover:text-primary">How it works</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-primary">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Use</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Refund Policy</a></li>
              <li><Link to="/register" className="text-muted-foreground hover:text-primary">Join Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Support &amp; Help</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 text-primary" /> contact@swastasks.com</li>
              <li className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 text-primary" /> dispute@swastasks.com</li>
              <li className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4 text-primary" /> help@swastasks.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
          SWAS TASKS operates within the SARI DIGITAL ecosystem, leveraging its established brand reputation and digital platforms to deliver reliable task-based services.
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#" className="flex items-center gap-2 rounded-full bg-[#1877f2] px-4 py-2 text-xs font-bold text-white"><Facebook className="h-4 w-4" /> Facebook</a>
          <a href="#" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] px-4 py-2 text-xs font-bold text-white"><Instagram className="h-4 w-4" /> Instagram</a>
          <a href="#" className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-bold text-white">TikTok</a>
          <a href="#" className="flex items-center gap-2 rounded-full bg-[#229ed9] px-4 py-2 text-xs font-bold text-white"><Send className="h-4 w-4" /> Telegram</a>
        </div>

        <div className="mt-8 border-t border-border/50 pt-6 text-center text-sm text-muted-foreground">
          SWAS TASKS © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};
