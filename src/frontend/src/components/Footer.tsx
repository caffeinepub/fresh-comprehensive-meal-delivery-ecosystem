import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-8 px-4">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {year}. Built with</span>
            <Heart className="h-4 w-4 fill-fresh-500 text-fresh-500" />
            <span>using</span>
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-fresh-600 transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
