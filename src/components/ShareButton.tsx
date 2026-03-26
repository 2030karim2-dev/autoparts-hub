import { Share2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
  className?: string;
}

const ShareButton = ({ title, text, url, className = "" }: ShareButtonProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const shareUrl = url || window.location.href;
  const encodedText = encodeURIComponent(`${title}\n${text}\n${shareUrl}`);

  const shareOptions = [
    { label: "واتساب", icon: "💬", url: `https://wa.me/?text=${encodedText}` },
    { label: "تيليجرام", icon: "✈️", url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`${title} - ${text}`)}` },
    { label: "نسخ الرابط", icon: "🔗", action: () => { navigator.clipboard.writeText(shareUrl); setShowMenu(false); } },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {}
    } else {
      setShowMenu(!showMenu);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button onClick={handleShare} className="w-9 h-9 flex items-center justify-center rounded-full bg-muted active:scale-90 transition-transform">
        <Share2 className="w-4 h-4 text-muted-foreground" />
      </button>
      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute left-0 top-full mt-1 bg-card rounded-xl shadow-lg border border-border z-50 overflow-hidden min-w-[140px] animate-fade-in-up">
            {shareOptions.map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  if (opt.action) { opt.action(); } else { window.open(opt.url, "_blank"); setShowMenu(false); }
                }}
                className="w-full px-3 py-2.5 flex items-center gap-2 text-sm hover:bg-muted transition-colors"
              >
                <span>{opt.icon}</span>
                <span className="font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
