"use client";

import { useState, useRef, useEffect } from "react";
import {
  Share2,
  Check,
  Copy,
  Linkedin,
  Twitter,
  Facebook,
  Link2,
} from "lucide-react";

interface JobShareButtonProps {
  jobTitle: string;
  companyName?: string;
  jobSlug: string;
}

export function JobShareButton({
  jobTitle,
  companyName,
  jobSlug,
}: JobShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const jobUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/jobs/${jobSlug}`
      : `/jobs/${jobSlug}`;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1800);
    } catch {
      // silent fail
    }
  };

  const handleShare = (platform: string) => {
    const text = `${jobTitle} at ${companyName || "a great company"}`;
    let shareUrl = "";
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(jobUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`;
        break;
    }
    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
      setOpen(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${jobTitle} — ${companyName || "Hiring"}`,
          text: `Check out this job: ${jobTitle}`,
          url: jobUrl,
        });
      } catch {}
    }
    setOpen(false);
  };

  const platforms = [
    {
      id: "twitter",
      label: "Share on X",
      icon: Twitter,
      color: "#000000",
      bg: "#f0f0f0",
    },
    {
      id: "linkedin",
      label: "Share on LinkedIn",
      icon: Linkedin,
      color: "#0A66C2",
      bg: "#e8f0fb",
    },
    {
      id: "facebook",
      label: "Share on Facebook",
      icon: Facebook,
      color: "#1877F2",
      bg: "#e7f0fd",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes sbd-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes sbd-checkpop {
          0%   { transform: scale(0.6); opacity: 0; }
          60%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1);  opacity: 1; }
        }
        .sbd-trigger {
          all: unset;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 16px 8px 13px;
          border-radius: 10px;
          border: 1.5px solid #e2e6ea;
          background: #ffffff;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          font-family: -apple-system, "Segoe UI", sans-serif;
          letter-spacing: -0.01em;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s, transform 0.12s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 1px 1px rgba(0,0,0,0.04);
          user-select: none;
          white-space: nowrap;
        }
        .sbd-trigger:hover {
          border-color: #c2c9d6;
          background: #f8f9fb;
          box-shadow: 0 2px 8px rgba(0,0,0,0.09);
        }
        .sbd-trigger:active { transform: scale(0.97); }
        .sbd-trigger[data-open="true"] {
          border-color: #6366f1;
          background: #f5f5ff;
          color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .sbd-icon-wrap {
          width: 26px; height: 26px;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          background: #f0f1ff;
          transition: background 0.15s;
        }
        .sbd-trigger[data-open="true"] .sbd-icon-wrap { background: #e0e1ff; }

        .sbd-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 240px;
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.07);
          z-index: 999;
          overflow: hidden;
          animation: sbd-in 0.18s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .sbd-section {
          padding: 6px;
        }
        .sbd-section + .sbd-section {
          border-top: 1px solid #f1f3f5;
          padding-top: 6px;
        }
        .sbd-item {
          all: unset;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 9px 10px;
          border-radius: 9px;
          font-size: 13.5px;
          font-weight: 500;
          font-family: -apple-system, "Segoe UI", sans-serif;
          color: #1f2937;
          cursor: pointer;
          transition: background 0.12s;
          box-sizing: border-box;
        }
        .sbd-item:hover { background: #f5f6f8; }
        .sbd-item:active { background: #eef0f4; }
        .sbd-platform-icon {
          width: 30px; height: 30px;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.12s;
        }
        .sbd-item:hover .sbd-platform-icon { transform: scale(1.08); }
        .sbd-copy-icon {
          width: 30px; height: 30px;
          border-radius: 7px;
          background: #f0f1ff;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .sbd-check-anim {
          animation: sbd-checkpop 0.3s ease forwards;
        }
        .sbd-native-btn {
          all: unset;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          padding: 10px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 500;
          font-family: -apple-system, "Segoe UI", sans-serif;
          color: #6366f1;
          cursor: pointer;
          transition: background 0.12s;
          box-sizing: border-box;
          letter-spacing: -0.01em;
        }
        .sbd-native-btn:hover { background: #f5f5ff; }
      `}</style>

      <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
        {/* Trigger */}
        <button
          className="sbd-trigger"
          data-open={open}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span className="sbd-icon-wrap">
            <Share2
              size={13}
              strokeWidth={2.4}
              color={open ? "#6366f1" : "#6b7280"}
            />
          </span>
          Share
        </button>

        {/* Dropdown */}
        {open && (
          <div className="sbd-menu" role="menu">
            {/* Social platforms */}
            <div className="sbd-section">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  className="sbd-item"
                  role="menuitem"
                  onClick={() => handleShare(p.id)}
                  onMouseEnter={() => setHovered(p.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span
                    className="sbd-platform-icon"
                    style={{ background: p.bg }}
                  >
                    <p.icon
                      size={15}
                      strokeWidth={1.8}
                      color={p.color}
                      fill={p.id === "facebook" ? p.color : "none"}
                    />
                  </span>
                  {p.label}
                </button>
              ))}
            </div>

            {/* Copy + Native */}
            <div className="sbd-section">
              {/* Copy link */}
              <button
                className="sbd-item"
                role="menuitem"
                onClick={handleCopyLink}
              >
                <span className="sbd-copy-icon">
                  {copied ? (
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      color="#16a34a"
                      className="sbd-check-anim"
                    />
                  ) : (
                    <Link2 size={14} strokeWidth={2} color="#6366f1" />
                  )}
                </span>
                <span style={{ color: copied ? "#16a34a" : "#1f2937" }}>
                  {copied ? "Link copied!" : "Copy link"}
                </span>
              </button>

              {/* Native share (only shown if supported) */}
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  className="sbd-native-btn"
                  role="menuitem"
                  onClick={handleNativeShare}
                >
                  <Share2 size={13} strokeWidth={2.2} />
                  More options…
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}