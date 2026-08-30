import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Heart, ShoppingCart, MessageCircle, Share2, Search, X, Menu,
  Plus, Minus, Upload, Image as ImageIcon, Video, Package, User,
  LogIn, ChevronRight, ChevronLeft, Star, CheckCircle, Truck,
  CreditCard, LayoutGrid, List, Trash2, Edit3, BarChart3, Eye,
  MapPin, Send, ShieldCheck, ArrowRight, LogOut, CheckSquare, Square,
  Save, SlidersHorizontal, RefreshCw, Layers, Percent, Check, Copy,
  Gift, Sparkles, MessageSquare, Home, Play, Pause
} from "lucide-react";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminChatModal } from "./components/AdminChatModal";
import { BottomNavBar } from "./components/BottomNavBar";
import { CategoryStrip } from "./components/CategoryStrip";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { ProductCard } from "./components/ProductCard";
import { OrderTracking } from "./components/OrderTracking";
import { MyOrdersModal } from "./components/MyOrdersModal";
import { MediaWrapper } from "./components/MediaWrapper";

/* ---------------------------------------------------------
   DESIGN TOKENS
   Navy / porcelain / sand / brass — "shipping manifest" motif
--------------------------------------------------------- */
const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80";

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

    .rwi {
      --navy: #4a156e;
      --navy-deep: #2c0e3b;
      --porcelain: #FFFFFF;
      --sand: #FAF5FF;
      --brass: #D4AF37;
      --brass-light: #E6CA65;
      --slate: #7E6B93;
      --line: #EEDFF8;
      font-family: 'Inter', sans-serif;
      color: var(--navy);
      background: var(--porcelain);
    }
    .rwi .font-display { font-family: 'Cinzel', 'Fraunces', serif; }
    .rwi .font-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.03em; }

    .rwi .bg-navy { background-color: var(--navy); }
    .rwi .bg-navy-deep { background-color: var(--navy-deep); }
    .rwi .bg-sand { background-color: var(--sand); }
    .rwi .bg-porcelain { background-color: var(--porcelain); }
    .rwi .bg-brass { background-color: var(--brass); }
    .rwi .text-navy { color: var(--navy); }
    .rwi .text-brass { color: var(--brass); }
    .rwi .text-slate { color: var(--slate); }
    .rwi .text-porcelain { color: var(--porcelain); }
    .rwi .border-brass { border-color: var(--brass); }
    .rwi .border-line { border-color: var(--line); }

    .rwi .btn-primary {
      background: var(--brass); color: var(--navy-deep); font-weight: 600;
      transition: background 0.15s ease, transform 0.1s ease;
    }
    .rwi .btn-primary:hover { background: var(--brass-light); }
    .rwi .btn-primary:active { transform: scale(0.98); }
    .rwi .btn-outline {
      border: 1.5px solid var(--navy); color: var(--navy); background: transparent;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .rwi .btn-outline:hover { background: var(--navy); color: var(--porcelain); }
    .rwi .btn-outline-light {
      border: 1.5px solid rgba(255,255,255,0.5); color: var(--porcelain); background: transparent;
      transition: background 0.15s ease;
    }
    .rwi .btn-outline-light:hover { background: rgba(255,255,255,0.12); }

    /* manifest stamp / tag motif — signature element */
    .rwi .manifest-tag {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
      border: 1px dashed var(--brass); color: var(--navy);
      padding: 3px 9px; border-radius: 2px; display: inline-flex; align-items: center; gap: 5px;
      background: var(--porcelain);
    }
    .rwi .manifest-tag .dot { width: 4px; height: 4px; border-radius: 50%; background: var(--brass); }

    .rwi .stamp {
      font-family: 'IBM Plex Mono', monospace;
      border: 2px solid currentColor; border-radius: 4px;
      padding: 4px 10px; font-size: 11px; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase;
      transform: rotate(-3deg); display: inline-block;
    }

    .rwi .route-line {
      position: relative; height: 1px; background: repeating-linear-gradient(
        90deg, var(--brass), var(--brass) 6px, transparent 6px, transparent 12px
      );
    }

    .rwi .perf { background-image: radial-gradient(circle, var(--line) 1.5px, transparent 1.5px);
      background-size: 10px 10px; }

    .rwi .card-hover { transition: transform 0.18s ease, box-shadow 0.18s ease; }
    .rwi .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 28px -12px rgba(15,35,64,0.25); }

    .rwi ::selection { background: var(--brass-light); color: var(--navy-deep); }
    .rwi *:focus-visible { outline: 2px solid var(--brass); outline-offset: 2px; }

    .rwi .scrollbar-none::-webkit-scrollbar { display: none; }
    .rwi .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

    @media (prefers-reduced-motion: reduce) {
      .rwi * { transition: none !important; animation: none !important; }
    }

    .rwi .fade-in { animation: rwiFadeIn 0.25s ease; }
    @keyframes rwiFadeIn { from { opacity: 0; transform: translateY(6px);} to { opacity: 1; transform: translateY(0);} }

    .rwi input, .rwi textarea, .rwi select {
      font-family: 'Inter', sans-serif;
    }
  `}</style>
);

/* ---------------------------------------------------------
   MOCK DATA
--------------------------------------------------------- */
const CATEGORIES = ["Kitchen", "Home Interior", "Electrical", "Fashion"];

const img = (seed, w = 600, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

const PRODUCTS: any[] = [];

const seedPosts = () => [];

const NGN = (n) => `₦${n.toLocaleString()}`;

// Emails recognized as admin on sign-in. Add more addresses here as needed.
const ADMIN_EMAILS = ["ibrahimfaruqolamilekan4@gmail.com", "roheemoh2020@gmail.com"];

const ADMIN_PROFILES = [
  {
    id: "admin-reemah",
    name: "Sister Reemah",
    role: "Founder & Chief Import Buyer",
    email: "ibrahimfaruqolamilekan4@gmail.com",
    avatar: "R",
    avatarBg: "bg-amber-600",
    bio: "Direct importer of luxury Turkish cookware, kitchenware, and modern home decor.",
    phone: "+234 801 234 5678",
  },
  {
    id: "admin-fatima",
    name: "Sister Fatima",
    role: "Logistics & Wholesale Director",
    email: "roheemoh2020@gmail.com",
    avatar: "F",
    avatarBg: "bg-purple-700",
    bio: "Managing container arrivals, electrical appliances inspection, and nationwide dispatch.",
    phone: "+234 802 345 6789",
  },
];


/* ---------------------------------------------------------
   SMALL SHARED COMPONENTS
--------------------------------------------------------- */
const ManifestTag = ({ children }) => (
  <span className="manifest-tag"><span className="dot" />{children}</span>
);

const Toast = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] fade-in">
      <div className="bg-navy text-porcelain px-5 py-3 rounded-md shadow-xl text-sm font-medium flex items-center gap-2">
        <CheckCircle size={16} className="text-brass" /> {message}
      </div>
    </div>
  );
};

const Stars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={13} className={i <= Math.round(rating) ? "text-brass fill-current" : "text-slate"} />
    ))}
    <span className="text-xs text-slate ml-1 font-mono">{rating}</span>
  </div>
);

const WhatsAppButton = () => (
  <a
    href="https://wa.me/2340000000000?text=Hi%20Reemah%20World%20Import%2C%20I%27d%20like%20to%20ask%20about%20a%20product"
    target="_blank" rel="noreferrer"
    className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-[#25D366] text-white pl-3 pr-4 py-3 rounded-full shadow-xl hover:brightness-105 transition"
    aria-label="Chat with us on WhatsApp"
  >
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.47 1.29 4.92L2 22l5.29-1.39a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.09c-.24.68-1.39 1.32-1.92 1.4-.49.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.12-4.85-4.31-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.37.24-.27.53-.34.71-.34h.51c.16 0 .38-.06.6.46.24.57.8 1.97.87 2.11.07.14.11.3.02.49-.08.19-.13.3-.26.46-.13.16-.27.35-.38.47-.13.14-.26.28-.11.55.14.27.63 1.04 1.36 1.69.94.83 1.72 1.09 1.99 1.22.27.13.43.11.58-.06.16-.19.68-.79.86-1.06.18-.27.35-.22.6-.13.24.08 1.55.73 1.82.86.27.14.44.2.51.32.06.11.06.65-.18 1.34z"/></svg>
    <span className="hidden sm:inline text-sm font-semibold">Chat with us</span>
  </a>
);

/* ---------------------------------------------------------
   NAVBAR
--------------------------------------------------------- */
const Navbar = ({ page, setPage, cartCount, wishlistCount, isLoggedIn, isAdmin, onOpenLogin, onOpenCart, onOpenWishlist, onLogout, search, setSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navBtn = (label, key) => (
    <button
      onClick={() => { setPage(key); setMenuOpen(false); }}
      className={`text-sm font-medium transition ${page === key ? "text-brass" : "text-porcelain/80 hover:text-porcelain"}`}
    >
      {label}
    </button>
  );
  return (
    <header className="bg-navy sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <button onClick={() => setPage("home")} className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-brass shadow-md bg-white flex items-center justify-center p-0.5">
              <img src="/logo2.jpg" alt="Reemah World Logo" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
            </div>
            <div className="text-left leading-tight">
              <div className="font-display text-porcelain text-[15px] font-bold tracking-wide">Reemah World Imports</div>
              <div className="hidden sm:block text-[10px] font-mono text-brass tracking-wider">OFFICIAL ESOTERIC IMPORT SANCTUARY</div>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-7">
            {navBtn("Home", "home")}
            {navBtn("Shop Feed", "feed")}
            {navBtn("Track Order", "tracking")}
            {isLoggedIn && navBtn("Order History", "orderHistory")}
            {isAdmin && navBtn("Admin", "admin")}
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-xs">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-white/10 focus:bg-white text-porcelain focus:text-navy placeholder:text-porcelain/50 focus:placeholder:text-slate rounded-full pl-9 pr-3 py-1.5 text-sm outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={onOpenWishlist} className="relative p-2 text-porcelain hover:text-brass transition" aria-label="Wishlist">
              <Heart size={19} />
              {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-brass text-navy-deep text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{wishlistCount}</span>}
            </button>
            <button onClick={onOpenCart} className="relative p-2 text-porcelain hover:text-brass transition" aria-label="Cart">
              <ShoppingCart size={19} />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-brass text-navy-deep text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
            {isLoggedIn ? (
              <button onClick={onLogout} className="hidden sm:flex items-center gap-1.5 text-porcelain/80 hover:text-porcelain text-sm px-2 py-1.5" title="Log out">
                <LogOut size={16} /> <span className="hidden lg:inline">Log out</span>
              </button>
            ) : (
              <button onClick={onOpenLogin} className="flex items-center gap-1.5 btn-outline-light text-sm px-3 py-1.5 rounded-full">
                <LogIn size={14} /> <span className="hidden sm:inline">Sign in</span>
              </button>
            )}
            <button className="md:hidden p-2 text-porcelain" onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 fade-in">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
                className="w-full bg-white/10 text-porcelain placeholder:text-porcelain/50 rounded-full pl-9 pr-3 py-2 text-sm outline-none" />
            </div>
            {navBtn("Home", "home")}
            {navBtn("Shop Feed", "feed")}
            {navBtn("Track Order", "tracking")}
            {isLoggedIn && navBtn("Order History", "orderHistory")}
            {isAdmin && navBtn("Admin", "admin")}
          </div>
        )}
      </div>
    </header>
  );
};

/* ---------------------------------------------------------
   HOME PAGE
--------------------------------------------------------- */
const Hero = ({ setPage }) => (
  <section className="bg-navy relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
    <div className="max-w-6xl mx-auto px-6 pt-16 pb-14 sm:pt-24 sm:pb-20 grid md:grid-cols-2 gap-10 items-center relative z-10">
      <div>
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-brass/40 text-brass text-xs font-mono mb-4 backdrop-blur-sm">
          <div className="w-5 h-5 bg-white rounded flex items-center justify-center p-0.5"><img src="/logo2.jpg" alt="Logo" className="w-full h-full object-contain" /></div>
          <span>Esoteric Sanctuary Import · Lagos &amp; Global</span>
        </div>
        <h1 className="font-display text-porcelain text-4xl sm:text-6xl leading-[1.08] mt-2 font-bold tracking-tight">
          Elite Kitchen Utensils, Home Decor &amp; Electrical Goods.
        </h1>
        <p className="text-porcelain/80 mt-5 text-base sm:text-lg max-w-md leading-relaxed">
          "We Import Quality, You Enjoy!" — Sourced directly from master manufacturers in Guangzhou &amp; Yiwu with absolute durability verification.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <button onClick={() => setPage("feed")} className="btn-primary px-7 py-3.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
            Explore All Collections <ArrowRight size={16} />
          </button>
          <button onClick={() => document.getElementById("about-section")?.scrollIntoView({behavior:"smooth"})} className="btn-outline-light px-7 py-3.5 rounded-full text-sm font-semibold">
            Our Esoteric Story
          </button>
        </div>
        <div className="route-line w-56 mt-10" />
        <div className="flex items-center justify-between w-56 mt-2 text-[10px] font-mono text-brass tracking-wider">
          <span>GUANGZHOU</span><span>YOUR SANCTUARY</span>
        </div>
      </div>
      <div className="relative">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-brass/50 aspect-square bg-white flex items-center justify-center p-4">
          <img src="/logo2.jpg" alt="Reemah World Logo Emblem" className="w-full h-full object-contain hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-transparent to-transparent flex items-end p-6">
            <div className="text-white space-y-1">
              <p className="text-xs font-mono text-brass tracking-widest uppercase">Verified Authentic</p>
              <h3 className="font-display text-xl font-bold">Reemah World Imports Sanctuary</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section id="about-section" className="bg-sand">
    <div className="max-w-6xl mx-auto px-6 py-16 sm:py-20 grid md:grid-cols-5 gap-12">
      <div className="md:col-span-2">
        <ManifestTag>Our Story</ManifestTag>
        <h2 className="font-display text-3xl font-semibold mt-4 leading-tight">Built on trust, one container at a time.</h2>
      </div>
      <div className="md:col-span-3 text-slate leading-relaxed space-y-4 text-[15px]">
        <p>Reemah World Import started as a small family effort to bring well-made, affordable household goods directly from trusted manufacturers in China to homes across Nigeria — cutting out the layers of resellers that drive prices up.</p>
        <p>Today, we work hand-in-hand as a family business: sourcing kitchenware, home interior pieces and electrical goods that we'd be proud to use ourselves, inspecting every batch before it ships, and getting it to your door quickly and reliably.</p>
        <p>Every product on this site has been personally vetted for quality — because our name is on every package that goes out.</p>
        <div className="flex items-center gap-2 pt-2 text-navy">
          <ShieldCheck size={18} className="text-brass" />
          <span className="text-sm font-medium">Quality-checked before it ships. Every time.</span>
        </div>
      </div>
    </div>
  </section>
);

const Footer = ({ setPage }) => (
  <footer className="bg-navy-deep text-porcelain/70">
    <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-8 text-sm">
      <div>
        <div className="font-display text-porcelain text-lg font-semibold">Reemah World Import</div>
        <p className="mt-3 leading-relaxed">Premium kitchen, home appliances &amp; electrical goods shipped from China to your door.</p>
      </div>
      <div>
        <div className="font-mono text-brass text-xs tracking-wider mb-3">NAVIGATE</div>
        <div className="flex flex-col gap-2">
          <button onClick={() => setPage("home")} className="text-left hover:text-porcelain transition">Home</button>
          <button onClick={() => setPage("feed")} className="text-left hover:text-porcelain transition">Shop Feed</button>
        </div>
      </div>
      <div>
        <div className="font-mono text-brass text-xs tracking-wider mb-3">GET IN TOUCH</div>
        <div className="flex items-center gap-2"><MapPin size={14} /> Lagos, Nigeria</div>
        <div className="mt-2">WhatsApp: +234 000 000 0000</div>
      </div>
    </div>
    <div className="border-t border-white/10 text-center text-xs py-4">© 2026 Reemah World Import. All rights reserved. Prototype build.</div>
  </footer>
);

/* ---------------------------------------------------------
   ADMIN PROFILE MODAL & FEED COMPONENTS
--------------------------------------------------------- */
const AdminProfileModal = ({ admin, open, onClose, onStartChat }: any) => {
  if (!open || !admin) return null;
  return (
    <div className="fixed inset-0 z-[105] bg-navy-deep/60 flex items-center justify-center p-4 fade-in" onClick={onClose}>
      <div className="bg-porcelain rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-line" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-navy" aria-label="Close modal"><X size={18} /></button>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 rounded-full ${admin.avatarBg} text-white flex items-center justify-center text-2xl font-serif font-bold shadow-md`}>
            {admin.avatar}
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-navy">{admin.name}</h3>
            <p className="text-xs font-mono text-brass font-semibold">{admin.role}</p>
            <p className="text-xs text-slate mt-0.5">{admin.email}</p>
          </div>
        </div>
        <p className="text-sm text-stone-700 leading-relaxed mb-6 bg-sand/50 p-3.5 rounded-xl border border-line">
          {admin.bio}
        </p>
        <div className="space-y-1.5 text-xs text-slate mb-6 font-mono">
          <div>Phone / Direct: {admin.phone}</div>
          <div>Verification: <span className="text-emerald-600 font-semibold">● Official Verified Admin</span></div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { onClose(); onStartChat(admin); }}
            className="flex-1 btn-primary py-3 rounded-full text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageSquare size={14} /> Message {admin.name} Directly
          </button>
        </div>
      </div>
    </div>
  );
};

const AutoPlayVideo: React.FC<{ src: string; autoPlayEnabled: boolean }> = ({ src, autoPlayEnabled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && autoPlayEnabled) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [autoPlayEnabled]);

  return (
    <video
      ref={videoRef}
      src={src}
      muted
      playsInline
      loop
      controls
      className="w-full h-full object-cover"
    />
  );
};

const FeedPost: React.FC<any> = ({ post, product, onLike, onComment, onOpenProduct, onAddToCart, onShare, onOpenAdminProfile, autoPlayVideos }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const postRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" }
    );
    if (postRef.current) {
      observer.observe(postRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const admin = ADMIN_PROFILES.find(a => a.id === post.adminId) || ADMIN_PROFILES[0];
  const rawImages = [
    ...(post.images || []),
    ...(product?.images || []),
    product?.mediaUrl || "",
    ...(product?.additionalImages || []),
    product?.img || "",
    FALLBACK_PRODUCT_IMAGE
  ];
  const allImages = rawImages.filter((img: string) => img && typeof img === 'string' && img.trim() !== "");
  const validImages = Array.from(new Set(allImages));
  const videoSrc = post.videoUrl || product?.videoUrl;
  const [mediaMode, setMediaMode] = useState<'video' | 'images'>(videoSrc ? 'video' : 'images');

  return (
    <article ref={postRef} className="bg-porcelain border border-line rounded-md overflow-hidden fade-in">
      <div className="flex items-center justify-between p-3.5 border-b border-line/50">
        <div 
          onClick={() => onOpenAdminProfile(admin)}
          role="button"
          tabIndex={0}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className={`w-9 h-9 rounded-full ${admin.avatarBg} text-white flex items-center justify-center font-serif text-sm font-bold shadow-sm group-hover:scale-105 transition-transform`}>
            {admin.avatar}
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight group-hover:text-brass transition-colors flex items-center gap-1.5">
              {admin.name}
              <span className="text-[10px] bg-brass/20 text-navy px-1.5 py-0.5 rounded-full font-mono">Verified Admin</span>
            </div>
            <div className="text-[11px] text-slate">{admin.role} · Tap profile to message direct</div>
          </div>
        </div>
        <button 
          onClick={() => onOpenAdminProfile(admin)} 
          className="text-xs text-brass hover:underline font-mono font-semibold"
        >
          Message Direct 💬
        </button>
      </div>

      {videoSrc && validImages.length > 0 && (
        <div className="flex bg-stone-900 border-b border-line text-xs font-mono">
          <button 
            onClick={() => setMediaMode('video')} 
            className={`flex-1 py-2 text-center transition flex items-center justify-center gap-1.5 ${mediaMode === 'video' ? 'bg-brass text-navy font-bold' : 'text-stone-300 hover:text-white'}`}
          >
            🎥 Video Demonstration
          </button>
          <button 
            onClick={() => setMediaMode('images')} 
            className={`flex-1 py-2 text-center transition flex items-center justify-center gap-1.5 ${mediaMode === 'images' ? 'bg-brass text-navy font-bold' : 'text-stone-300 hover:text-white'}`}
          >
            🖼️ Photos ({validImages.length})
          </button>
        </div>
      )}

      {videoSrc && (!validImages.length || mediaMode === 'video') ? (
        <div className="relative bg-black w-full h-80">
          <MediaWrapper src={videoSrc} type="video" autoPlay={autoPlayVideos} controls className="w-full h-80" />
        </div>
      ) : (
        <div className="relative bg-sand/50">
          <button onClick={() => onOpenProduct(product)} className="block w-full">
            {isInView ? (
              <MediaWrapper 
                src={validImages[activeImgIdx]} 
                alt={product?.name || "Product"} 
                type="image"
                className="w-full h-80"
              />
            ) : (
              <div className="w-full h-80 bg-sand animate-pulse flex items-center justify-center text-xs text-slate font-mono">Loading image...</div>
            )}
          </button>
          {validImages.length > 1 && (
            <>
              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full font-mono">
                {activeImgIdx + 1} / {validImages.length}
              </div>
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                {activeImgIdx > 0 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveImgIdx(i => i - 1); }}
                    className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto hover:bg-black transition"
                  >
                    ‹
                  </button>
                )}
                <div className="ml-auto">
                  {activeImgIdx < validImages.length - 1 && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveImgIdx(i => i + 1); }}
                      className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto hover:bg-black transition"
                    >
                      ›
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-1.5 p-2 bg-stone-900/80 overflow-x-auto">
                {validImages.map((imgSrc: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImgIdx(idx)}
                    className={`w-12 h-12 rounded overflow-hidden border-2 transition ${activeImgIdx === idx ? "border-brass" : "border-transparent opacity-60"}`}
                  >
                    {isInView ? (
                      <MediaWrapper 
                        src={imgSrc} 
                        alt="" 
                        type="image"
                        className="w-full h-full" 
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-800" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <div className="p-3.5">
        <div className="flex items-center gap-4">
          <button onClick={() => onLike(post.id)} className="flex items-center gap-1.5 text-sm group" aria-label="Like post">
            <Heart size={19} className={`transition-transform duration-300 ease-out ${post.likedByMe ? "text-brass fill-current scale-125" : "text-navy group-hover:scale-110"}`} />
            <span className="font-mono text-xs">{post.likes}</span>
          </button>
          <button onClick={() => setShowComments(s => !s)} className="flex items-center gap-1.5 text-sm">
            <MessageCircle size={19} className="text-navy" />
            <span className="font-mono text-xs">{post.comments.length}</span>
          </button>
          <button
            onClick={() => onShare({ title: product?.name || post.caption || "Reemah World Imports", text: `${product?.name || 'Reemah Import'} — ${product?.price ? NGN(product.price) : ''}: ${post.caption}` })}
            className="flex items-center gap-1.5 text-sm ml-auto text-navy hover:text-brass transition"
            aria-label="Share post"
          >
            <Share2 size={18} />
          </button>
        </div>
        <p className="text-sm mt-2.5 leading-relaxed">{post.caption}</p>
        {product && (
          <div onClick={() => onOpenProduct(product)} role="button" tabIndex={0} className="flex items-center justify-between mt-3 bg-sand rounded-md p-2.5 w-full text-left cursor-pointer">
            <div>
              <div className="text-sm font-medium">{product.name}</div>
              <div className="font-display text-brass font-semibold text-sm mt-0.5">{NGN(product.price)}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="btn-primary text-xs px-3 py-2 rounded-full font-semibold flex items-center gap-1">
              <ShoppingCart size={12} /> Add
            </button>
          </div>
        )}

        {showComments && (
          <div className="mt-3 border-t border-line pt-3 space-y-2 fade-in">
            {post.comments.map(c => (
              <div key={c.id} className="text-sm"><span className="font-semibold">{c.user}:</span> <span className="text-slate">{c.text}</span></div>
            ))}
            {post.comments.length === 0 && <div className="text-xs text-slate">No comments yet — be the first.</div>}
            <div className="flex items-center gap-2 pt-1">
              <input
                value={commentText} onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 border border-line rounded-full px-3 py-1.5 text-sm outline-none focus:border-brass"
                onKeyDown={(e) => { if (e.key === "Enter" && commentText.trim()) { onComment(post.id, commentText); setCommentText(""); } }}
              />
              <button
                onClick={() => { if (commentText.trim()) { onComment(post.id, commentText); setCommentText(""); } }}
                className="text-brass" aria-label="Send comment"
              ><Send size={17} /></button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

const TikTokReelsCard: React.FC<any> = ({ post, product, onLike, onComment, onOpenProduct, onAddToCart, onShare, onOpenAdminProfile, autoPlayVideos }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const admin = ADMIN_PROFILES.find(a => a.id === post.adminId) || ADMIN_PROFILES[0];
  const rawImages = [
    ...(post.images || []),
    ...(product?.images || []),
    product?.mediaUrl || "",
    ...(product?.additionalImages || []),
    product?.img || "",
    FALLBACK_PRODUCT_IMAGE
  ];
  const allImages = rawImages.filter((img: string) => img && typeof img === 'string' && img.trim() !== "");
  const validImages = Array.from(new Set(allImages));
  const videoSrc = post.videoUrl || product?.videoUrl;
  const [mediaMode, setMediaMode] = useState<'video' | 'images'>(videoSrc ? 'video' : 'images');

  return (
    <div className="relative w-full max-w-md mx-auto h-[80vh] sm:h-[84vh] bg-black snap-center flex flex-col justify-between overflow-hidden rounded-2xl shadow-2xl border border-white/10 my-4">
      {/* Media background */}
      <div className="absolute inset-0 z-0">
        {videoSrc && validImages.length > 0 && (
          <div className="absolute top-16 inset-x-4 z-20 flex bg-black/80 backdrop-blur border border-white/20 rounded-full overflow-hidden text-xs font-mono">
            <button 
              onClick={() => setMediaMode('video')} 
              className={`flex-1 py-1.5 text-center transition ${mediaMode === 'video' ? 'bg-brass text-navy font-bold' : 'text-stone-300 hover:text-white'}`}
            >
              🎥 Video
            </button>
            <button 
              onClick={() => setMediaMode('images')} 
              className={`flex-1 py-1.5 text-center transition ${mediaMode === 'images' ? 'bg-brass text-navy font-bold' : 'text-stone-300 hover:text-white'}`}
            >
              🖼️ Photos ({validImages.length})
            </button>
          </div>
        )}

        {videoSrc && (!validImages.length || mediaMode === 'video') ? (
          <MediaWrapper src={videoSrc} type="video" autoPlay={autoPlayVideos} controls className="w-full h-full" />
        ) : (
          <div className="relative w-full h-full">
            <MediaWrapper 
              src={validImages[activeImgIdx]} 
              alt={product?.name || "Product"} 
              type="image"
              className="w-full h-full brightness-95" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40 pointer-events-none" />
            {validImages.length > 1 && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full font-mono z-10">
                {activeImgIdx + 1} / {validImages.length}
              </div>
            )}
            {validImages.length > 1 && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-10 pointer-events-none">
                {activeImgIdx > 0 && (
                  <button onClick={() => setActiveImgIdx(i => i - 1)} className="w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center pointer-events-auto hover:bg-black">‹</button>
                )}
                <div className="ml-auto">
                  {activeImgIdx < validImages.length - 1 && (
                    <button onClick={() => setActiveImgIdx(i => i + 1)} className="w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center pointer-events-auto hover:bg-black">›</button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Top Header / Creator info */}
      <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent">
        <div onClick={() => onOpenAdminProfile(admin)} className="flex items-center gap-3 cursor-pointer group">
          <div className={`w-10 h-10 rounded-full ${admin.avatarBg} text-white flex items-center justify-center font-serif font-bold shadow-lg ring-2 ring-brass`}>
            {admin.avatar}
          </div>
          <div>
            <div className="text-white font-semibold text-sm flex items-center gap-1.5 group-hover:text-brass transition">
              {admin.name}
              <span className="bg-brass text-navy-deep text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">Verified</span>
            </div>
            <div className="text-stone-300 text-xs">{admin.role}</div>
          </div>
        </div>
        <button onClick={() => onOpenAdminProfile(admin)} className="bg-white/15 hover:bg-white/25 text-white text-xs px-3.5 py-1.5 rounded-full backdrop-blur-md transition font-mono">
          Message 💬
        </button>
      </div>

      {/* Right TikTok-style floating action bar */}
      <div className="absolute right-3 bottom-32 z-20 flex flex-col items-center gap-4">
        <button onClick={() => onLike(post.id)} className="flex flex-col items-center group">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition ${post.likedByMe ? "bg-brass text-navy-deep scale-110 shadow-lg shadow-brass/30" : "bg-black/60 text-white group-hover:bg-black/80"}`}>
            <Heart size={24} className={post.likedByMe ? "fill-current" : ""} />
          </div>
          <span className="text-white text-xs font-mono mt-1 font-semibold drop-shadow">{post.likes}</span>
        </button>

        <button onClick={() => setShowComments(s => !s)} className="flex flex-col items-center group">
          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-black/80 transition">
            <MessageCircle size={24} />
          </div>
          <span className="text-white text-xs font-mono mt-1 font-semibold drop-shadow">{post.comments.length}</span>
        </button>

        <button onClick={() => onShare({ title: product?.name || post.caption || "Reemah World Imports", text: `${product?.name || 'Reemah Import'} — ${product?.price ? NGN(product.price) : ''}: ${post.caption}` })} className="flex flex-col items-center group">
          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-black/80 transition">
            <Share2 size={24} />
          </div>
          <span className="text-white text-xs font-mono mt-1 font-semibold drop-shadow">Share</span>
        </button>
      </div>

      {/* Bottom info & Product Overlay */}
      <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/85 to-transparent space-y-3">
        <p className="text-white text-sm leading-relaxed drop-shadow font-medium">{post.caption}</p>

        {/* Product Card Quick Bar */}
        {product && (
          <div onClick={() => onOpenProduct(product)} className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-white/25 transition shadow-xl">
            <div className="flex items-center gap-3">
              <img src={product.img || product.mediaUrl || FALLBACK_PRODUCT_IMAGE} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-white/20" />
              <div>
                <div className="text-white text-sm font-semibold line-clamp-1">{product.name}</div>
                <div className="text-brass font-display font-bold text-sm">{NGN(product.price)}</div>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="btn-primary text-xs px-4 py-2.5 rounded-full font-semibold flex items-center gap-1.5 shadow-lg shrink-0">
              <ShoppingCart size={14} /> Buy Now
            </button>
          </div>
        )}

        {/* Comments Drawer / Overlay */}
        {showComments && (
          <div className="bg-black/95 backdrop-blur-2xl border border-white/20 rounded-xl p-4 max-h-52 overflow-y-auto space-y-3 fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-white text-xs font-mono font-bold">Comments ({post.comments.length})</span>
              <button onClick={() => setShowComments(false)} className="text-white/70 hover:text-white"><X size={16} /></button>
            </div>
            {post.comments.map(c => (
              <div key={c.id} className="text-xs text-white"><span className="font-semibold text-brass">{c.user}:</span> {c.text}</div>
            ))}
            {post.comments.length === 0 && <div className="text-xs text-stone-400 text-center py-2">No comments yet.</div>}
            <div className="flex items-center gap-2 pt-1">
              <input
                value={commentText} onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-white/15 border border-white/20 rounded-full px-3.5 py-2 text-xs text-white placeholder-stone-300 outline-none focus:border-brass"
                onKeyDown={(e) => { if (e.key === "Enter" && commentText.trim()) { onComment(post.id, commentText); setCommentText(""); } }}
              />
              <button onClick={() => { if (commentText.trim()) { onComment(post.id, commentText); setCommentText(""); } }} className="text-brass p-1.5"><Send size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FeedPage = ({ posts, products, search, categoryFilter, setCategoryFilter, onLike, onComment, onOpenProduct, onAddToCart, onToggleWishlist, wishlist, isLoggedIn, onOpenLogin, onShare, onOpenAdminProfile }) => {
  const [view, setView] = useState("tiktok"); // tiktok | grid | list
  const [autoPlayVideos, setAutoPlayVideos] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  // Reset visible count when category or search changes
  useEffect(() => {
    setVisibleCount(3);
  }, [categoryFilter, search, view]);

  const filteredProducts = useMemo(() => products.filter(p =>
    (!categoryFilter || p.category === categoryFilter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  ), [products, categoryFilter, search]);

  const feedPosts = useMemo(() => posts.filter(post => {
    const product = products.find(p => p.id === post.productId);
    if (!product) return false;
    return (!categoryFilter || product.category === categoryFilter) && product.name.toLowerCase().includes(search.toLowerCase());
  }), [posts, products, categoryFilter, search]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const displayedPosts = feedPosts.slice(0, visibleCount);
  const hasMore = view === "grid" ? visibleCount < filteredProducts.length : visibleCount < feedPosts.length;

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-sand flex items-center justify-center mx-auto mb-5">
          <LogIn size={22} className="text-brass" />
        </div>
        <h2 className="font-display text-2xl font-semibold">Sign in to browse the feed</h2>
        <p className="text-slate text-sm mt-2">Create a free account to like, comment, share and shop products from our community feed.</p>
        <button onClick={onOpenLogin} className="btn-primary rounded-full px-6 py-3 text-sm mt-6">Sign in / Sign up</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setCategoryFilter(null)} className={`text-xs font-medium px-3 py-1.5 rounded-full border ${!categoryFilter ? "bg-navy text-porcelain border-navy" : "border-line text-slate"}`}>All</button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategoryFilter(c)} className={`text-xs font-medium px-3 py-1.5 rounded-full border ${categoryFilter === c ? "bg-navy text-porcelain border-navy" : "border-line text-slate"}`}>{c}</button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {view !== "grid" && (
            <button
              onClick={() => setAutoPlayVideos(!autoPlayVideos)}
              className={`text-xs font-mono px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition ${autoPlayVideos ? "bg-brass/10 border-brass text-navy font-semibold" : "bg-stone-100 border-line text-slate"}`}
              title="Toggle automatic video play in viewport (muted)"
            >
              {autoPlayVideos ? <Play size={12} className="text-brass fill-current" /> : <Pause size={12} />}
              <span>Auto-play: {autoPlayVideos ? "ON" : "OFF"}</span>
            </button>
          )}
          <div className="flex items-center gap-1 bg-sand rounded-full p-1">
            <button onClick={() => setView("tiktok")} className={`px-3 py-1 rounded-full text-xs font-semibold transition ${view === "tiktok" ? "bg-navy text-porcelain shadow-sm" : "text-slate hover:text-navy"}`}>TikTok Reels</button>
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-full ${view === "grid" ? "bg-porcelain shadow-sm" : ""}`} aria-label="Grid view"><LayoutGrid size={15} /></button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-full ${view === "list" ? "bg-porcelain shadow-sm" : ""}`} aria-label="List view"><List size={15} /></button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayedProducts.map(p => (
              <ProductCard key={p.id} product={p} onOpen={onOpenProduct} onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist} isWishlisted={wishlist.includes(p.id)} />
            ))}
          </div>
          {filteredProducts.length === 0 && <div className="text-center text-slate text-sm py-16">No products match your search.</div>}
          {hasMore && (
            <div className="text-center pt-4">
              <button onClick={() => setVisibleCount(c => c + 4)} className="btn-secondary rounded-full px-8 py-3 text-sm font-medium shadow-sm hover:shadow transition">
                Load More Products ({filteredProducts.length - displayedProducts.length} remaining)
              </button>
            </div>
          )}
        </div>
      ) : view === "list" ? (
        <div className="max-w-xl mx-auto flex flex-col gap-5">
          {displayedPosts.map(post => {
            const product = products.find(p => p.id === post.productId);
            return <FeedPost key={post.id} post={post} product={product} onLike={onLike} onComment={onComment} onOpenProduct={onOpenProduct} onAddToCart={onAddToCart} onShare={onShare} onOpenAdminProfile={onOpenAdminProfile} autoPlayVideos={autoPlayVideos} />;
          })}
          {feedPosts.length === 0 && <div className="text-center text-slate text-sm py-16">No posts match your search.</div>}
          {hasMore && (
            <div className="text-center pt-4">
              <button onClick={() => setVisibleCount(c => c + 3)} className="btn-secondary rounded-full px-8 py-3 text-sm font-medium shadow-sm hover:shadow transition">
                Load More Posts ({feedPosts.length - displayedPosts.length} remaining)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="overflow-y-scroll snap-y snap-mandatory scrollbar-none h-[80vh] py-2 flex flex-col items-center w-full">
            {displayedPosts.map(post => {
              const product = products.find(p => p.id === post.productId);
              if (!product) return null;
              return <TikTokReelsCard key={post.id} post={post} product={product} onLike={onLike} onComment={onComment} onOpenProduct={onOpenProduct} onAddToCart={onAddToCart} onShare={onShare} onOpenAdminProfile={onOpenAdminProfile} autoPlayVideos={autoPlayVideos} />;
            })}
            {feedPosts.length === 0 && <div className="text-center text-slate text-sm py-16">No posts match your search.</div>}
          </div>
          {hasMore && (
            <div className="text-center py-4 bg-transparent">
              <button onClick={() => setVisibleCount(c => c + 2)} className="bg-white/15 hover:bg-white/25 text-navy font-semibold border border-line rounded-full px-8 py-3 text-sm shadow-sm transition">
                Load More Reels ({feedPosts.length - displayedPosts.length} remaining) ↓
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------------
   PRODUCT MODAL
--------------------------------------------------------- */
const ProductModal = ({ product, onClose, onAddToCart, onToggleWishlist, isWishlisted, onShare, reviewsMap, onAddReview, userName, isLoggedIn, onOpenLogin }: any) => {
  const [qty, setQty] = useState(1);
  const [newRating, setNewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [priceDropSubscribed, setPriceDropSubscribed] = useState(false);
  const [priceDropEmail, setPriceDropEmail] = useState("");

  const rawImages = [
    ...(product?.images || []),
    product?.img,
    product?.mediaUrl,
    ...(product?.additionalImages || []),
    FALLBACK_PRODUCT_IMAGE
  ];
  const validImages = Array.from(new Set(rawImages.filter((src: any) => src && typeof src === 'string' && src.trim() !== "")));
  const videoSrc = product?.videoUrl;
  
  const [modalMediaMode, setModalMediaMode] = useState<'video' | 'images'>(videoSrc && !validImages.length ? 'video' : 'images');
  const [activeModalImgIdx, setActiveModalImgIdx] = useState(0);

  if (!product) return null;

  const productReviews = reviewsMap[product.id] || [];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    onAddReview(product.id, newRating, reviewText.trim());
    setReviewText("");
  };

  return (
    <div className="fixed inset-0 z-[80] bg-navy-deep/60 flex items-end sm:items-center justify-center p-0 sm:p-6 fade-in" onClick={onClose}>
      <div className="bg-porcelain rounded-t-xl sm:rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto scrollbar-none flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="grid sm:grid-cols-2">
          <div className="flex flex-col bg-sand/30 sm:rounded-l-xl overflow-hidden">
            {videoSrc && validImages.length > 0 && (
              <div className="flex bg-stone-900 text-xs font-mono border-b border-line">
                <button
                  type="button"
                  onClick={() => setModalMediaMode('images')}
                  className={`flex-1 py-2 text-center transition flex items-center justify-center gap-1 ${modalMediaMode === 'images' ? 'bg-brass text-navy font-bold' : 'text-stone-300 hover:text-white'}`}
                >
                  🖼️ Photos ({validImages.length})
                </button>
                <button
                  type="button"
                  onClick={() => setModalMediaMode('video')}
                  className={`flex-1 py-2 text-center transition flex items-center justify-center gap-1 ${modalMediaMode === 'video' ? 'bg-brass text-navy font-bold' : 'text-stone-300 hover:text-white'}`}
                >
                  🎥 Video Demo
                </button>
              </div>
            )}
            
            <div className="relative w-full h-72 sm:h-80 bg-black flex items-center justify-center">
              {modalMediaMode === 'video' && videoSrc ? (
                <video src={videoSrc} controls className="w-full h-full object-contain" autoPlay />
              ) : (
                <>
                  <img
                    src={validImages[activeModalImgIdx] || product.img || product.mediaUrl || FALLBACK_PRODUCT_IMAGE}
                    alt={product.name || product.title}
                    className="w-full h-full object-cover"
                  />
                  {validImages.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      {activeModalImgIdx + 1} / {validImages.length}
                    </div>
                  )}
                  {validImages.length > 1 && (
                    <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                      {activeModalImgIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => setActiveModalImgIdx(i => i - 1)}
                          className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto hover:bg-black text-sm"
                        >
                          ‹
                        </button>
                      )}
                      <div className="ml-auto">
                        {activeModalImgIdx < validImages.length - 1 && (
                          <button
                            type="button"
                            onClick={() => setActiveModalImgIdx(i => i + 1)}
                            className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center pointer-events-auto hover:bg-black text-sm"
                          >
                            ›
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {validImages.length > 1 && modalMediaMode === 'images' && (
              <div className="flex gap-1.5 p-2 bg-stone-900 overflow-x-auto">
                {validImages.map((src: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveModalImgIdx(idx)}
                    className={`w-12 h-12 rounded overflow-hidden border-2 transition shrink-0 ${activeModalImgIdx === idx ? 'border-brass' : 'border-transparent opacity-60'}`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="p-6 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-navy" aria-label="Close"><X size={20} /></button>
            <div className="manifest-tag">{product.category}</div>
            <h2 className="font-display text-2xl font-semibold mt-3 leading-tight">{product.name}</h2>
            <div className="mt-2 flex items-center gap-2">
              <Stars rating={product.rating} />
              <span className="text-xs text-slate font-mono">({productReviews.length} reviews)</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="font-display text-2xl font-semibold text-navy">{NGN(product.price)}</span>
              {product.oldPrice && <span className="text-sm text-slate line-through">{NGN(product.oldPrice)}</span>}
            </div>
            <p className="text-sm text-slate leading-relaxed mt-4">{product.desc}</p>
            <div className="text-xs font-mono text-slate mt-3">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</div>

            <div className="flex items-center gap-3 mt-5">
              <div className="flex items-center border border-line rounded-full">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="p-2" aria-label="Decrease quantity"><Minus size={14} /></button>
                <span className="w-8 text-center text-sm font-mono">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="p-2" aria-label="Increase quantity"><Plus size={14} /></button>
              </div>
              <button onClick={() => onToggleWishlist(product.id)} className="p-2.5 border border-line rounded-full hover:border-brass transition" aria-label="Toggle wishlist">
                <Heart size={17} className={isWishlisted ? "text-brass fill-current" : "text-navy"} />
              </button>
              <button onClick={() => onShare({ title: product.name, text: `${product.name} — ${NGN(product.price)}: ${product.desc}` })} className="p-2.5 border border-line rounded-full hover:border-brass transition text-navy" aria-label="Share product">
                <Share2 size={17} />
              </button>
            </div>

            <button onClick={() => { onAddToCart(product, qty); onClose(); }} className="btn-primary w-full rounded-full py-3 text-sm font-semibold mt-5 flex items-center justify-center gap-2">
              <ShoppingCart size={15} /> Add {qty} to cart
            </button>

            <div className="mt-4 pt-4 border-t border-line">
              <details className="group">
                <summary className="text-xs font-semibold text-navy cursor-pointer flex items-center justify-between hover:text-brass">
                  <span>🔔 Notify me of price drop</span>
                  <span className="text-[10px] text-slate font-mono group-open:rotate-180 transition-transform">▼</span>
                </summary>
                {priceDropSubscribed ? (
                  <div className="mt-2.5 bg-emerald-50 text-emerald-800 p-2.5 rounded-md text-xs flex items-center gap-1.5">
                    <Check size={14} /> You're set! We'll alert {priceDropEmail} when price drops.
                  </div>
                ) : (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    if (priceDropEmail) {
                      setPriceDropSubscribed(true);
                    }
                  }} className="mt-2.5 flex gap-2">
                    <input
                      type="email"
                      value={priceDropEmail}
                      onChange={(e) => setPriceDropEmail(e.target.value)}
                      placeholder="Enter email for price alerts"
                      required
                      className="flex-1 text-xs border border-line rounded-md px-3 py-2 outline-none focus:border-brass bg-sand/30"
                    />
                    <button type="submit" className="btn-primary px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap">
                      Alert Me
                    </button>
                  </form>
                )}
              </details>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-line p-6 bg-sand/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold flex items-center gap-2">
              <Star size={18} className="text-brass fill-current" /> Verified Buyer Reviews &amp; Ratings ({productReviews.length})
            </h3>
          </div>

          {/* List of Reviews */}
          <div className="space-y-3 mb-6">
            {productReviews.map((r: any) => (
              <div key={r.id} className="bg-porcelain border border-line rounded-lg p-3.5 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{r.user}</span>
                    {r.verified && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                        <Check size={10} /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate font-mono">{r.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={12} className={i <= r.rating ? "text-brass fill-current" : "text-line"} />
                  ))}
                </div>
                <p className="text-sm text-slate leading-relaxed">{r.text}</p>
              </div>
            ))}
            {productReviews.length === 0 && (
              <div className="text-center text-slate text-xs py-6 bg-porcelain border border-line rounded-lg">
                No reviews yet for this product. Be the first verified buyer to leave a review!
              </div>
            )}
          </div>

          {/* Write a Review Form */}
          <div className="bg-porcelain border border-line rounded-lg p-4">
            <h4 className="font-display font-semibold text-sm mb-2">Leave a review &amp; rating</h4>
            {!isLoggedIn ? (
              <div className="text-xs text-slate py-3 flex items-center justify-between">
                <span>Please sign in as a verified buyer to post your rating and comments.</span>
                <button onClick={onOpenLogin} className="btn-primary px-4 py-1.5 rounded-full text-xs font-semibold">Sign in</button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate">YOUR RATING:</span>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 focus:outline-none"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          size={18}
                          className={(hoverRating || newRating) >= star ? "text-brass fill-current transition-colors" : "text-slate"}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono font-bold ml-1">{newRating} / 5</span>
                  </div>
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with quality, delivery, and usage..."
                  rows={3}
                  className="w-full border border-line rounded-md px-3 py-2 text-sm outline-none focus:border-brass resize-none"
                  required
                />

                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-slate font-mono">Posting as {userName} (Verified Buyer badge included)</span>
                  <button type="submit" className="btn-primary rounded-full px-5 py-2 text-xs font-semibold flex items-center gap-1.5">
                    <Send size={13} /> Post Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShareModal = ({ open, onClose, title, text, url, toast }: any) => {
  if (!open) return null;
  const shareUrl = typeof url === 'string' && url ? url : (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = typeof text === 'string' && text ? text : (typeof title === 'string' && title ? title : "Check out this amazing product on Reemah World Import!");
  const shareTitle = typeof title === 'string' && title ? title : "Reemah World Imports";

  const handleCopy = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(shareUrl).catch(() => {});
      }
    } catch (e) {}
    toast("Link copied to clipboard!");
    onClose();
  };

  const handleNativeShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share({
          title: String(shareTitle),
          text: String(shareText),
          url: String(shareUrl)
        });
        onClose();
        return;
      }
    } catch (err) {
      // User cancelled, permission denied in iframe, or clone error - fallback gracefully
    }
    handleCopy();
  };

  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="fixed inset-0 z-[95] bg-navy-deep/60 flex items-center justify-center p-6 fade-in" onClick={onClose}>
      <div className="bg-porcelain rounded-xl max-w-sm w-full p-6 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-navy" aria-label="Close"><X size={20} /></button>
        <h3 className="font-display text-lg font-semibold mb-1">Share item</h3>
        <p className="text-slate text-xs mb-5">Spread the word with family, friends, or social media.</p>

        <div className="space-y-2.5">
          {canShare && (
            <button onClick={handleNativeShare} className="w-full flex items-center gap-3 border border-line rounded-md p-3 text-left hover:bg-sand transition text-sm font-medium">
              <Share2 size={18} className="text-brass" />
              <span>Share via device menu</span>
            </button>
          )}

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noreferrer"
            onClick={onClose}
            className="w-full flex items-center gap-3 border border-line rounded-md p-3 text-left hover:bg-sand transition text-sm font-medium text-navy"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span>Share on X / Twitter</span>
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank" rel="noreferrer"
            onClick={onClose}
            className="w-full flex items-center gap-3 border border-line rounded-md p-3 text-left hover:bg-sand transition text-sm font-medium text-navy"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span>Share on Facebook</span>
          </a>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
            target="_blank" rel="noreferrer"
            onClick={onClose}
            className="w-full flex items-center gap-3 border border-line rounded-md p-3 text-left hover:bg-sand transition text-sm font-medium text-navy"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.47 1.29 4.92L2 22l5.29-1.39a9.87 9.87 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.09c-.24.68-1.39 1.32-1.92 1.4-.49.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.12-4.85-4.31-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.37.24-.27.53-.34.71-.34h.51c.16 0 .38-.06.6.46.24.57.8 1.97.87 2.11.07.14.11.3.02.49-.08.19-.13.3-.26.46-.13.16-.27.35-.38.47-.13.14-.26.28-.11.55.14.27.63 1.04 1.36 1.69.94.83 1.72 1.09 1.99 1.22.27.13.43.11.58-.06.16-.19.68-.79.86-1.06.18-.27.35-.22.6-.13.24.08 1.55.73 1.82.86.27.14.44.2.51.32.06.11.06.65-.18 1.34z"/></svg>
            <span>Share on WhatsApp</span>
          </a>

          <button onClick={handleCopy} className="w-full flex items-center gap-3 border border-line rounded-md p-3 text-left hover:bg-sand transition text-sm font-medium text-navy">
            <Copy size={18} className="text-navy" />
            <span>Copy link</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   CART DRAWER
--------------------------------------------------------- */
const CartDrawer = ({ open, onClose, cart, updateQty, removeItem, total, onCheckout }) => (
  <div className={`fixed inset-0 z-[85] transition-colors duration-300 ${open ? "" : "pointer-events-none"}`}>
    <div onClick={onClose} className={`absolute inset-0 bg-navy-deep/50 transition-opacity duration-300 ease-in-out ${open ? "opacity-100" : "opacity-0"}`} />
    <div className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-porcelain shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex items-center justify-between p-4 border-b border-line">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2"><ShoppingCart size={18} /> Your Cart</h3>
        <button onClick={onClose} aria-label="Close cart"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 && (
          <div className="text-center text-slate text-sm py-16">
            <Package size={28} className="mx-auto mb-3 text-line" />
            Your cart is empty. Explore the shop feed to add products.
          </div>
        )}
        {cart.map(item => (
          <div key={item.id} className="flex gap-3">
            <img src={item.img} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
            <div className="flex-1">
              <div className="text-sm font-medium leading-snug">{item.name}</div>
              <div className="text-brass font-display font-semibold text-sm mt-0.5">{NGN(item.price)}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center border border-line rounded-full">
                  <button onClick={() => updateQty(item.id, item.qty-1)} className="p-1" aria-label="Decrease quantity"><Minus size={12} /></button>
                  <span className="w-6 text-center text-xs font-mono">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty+1)} className="p-1" aria-label="Increase quantity"><Plus size={12} /></button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-slate hover:text-red-500" aria-label="Remove item"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {cart.length > 0 && (
        <div className="p-4 border-t border-line">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate">Subtotal</span>
            <span className="font-display font-semibold text-lg">{NGN(total)}</span>
          </div>
          <button onClick={onCheckout} className="btn-primary w-full rounded-full py-3 text-sm font-semibold">Checkout</button>
        </div>
      )}
    </div>
  </div>
);

/* ---------------------------------------------------------
   WISHLIST DRAWER
--------------------------------------------------------- */
const WishlistDrawer = ({ open, onClose, items, onAddToCart, onRemove }) => (
  <div className={`fixed inset-0 z-[85] transition-colors duration-300 ${open ? "" : "pointer-events-none"}`}>
    <div onClick={onClose} className={`absolute inset-0 bg-navy-deep/50 transition-opacity duration-300 ease-in-out ${open ? "opacity-100" : "opacity-0"}`} />
    <div className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-porcelain shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex items-center justify-between p-4 border-b border-line">
        <h3 className="font-display text-lg font-semibold flex items-center gap-2"><Heart size={18} /> Wishlist</h3>
        <button onClick={onClose} aria-label="Close wishlist"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {items.length === 0 && <div className="text-center text-slate text-sm py-16">Nothing saved yet. Tap the heart on any product to save it here.</div>}
        {items.map(item => (
          <div key={item.id} className="flex gap-3 items-center">
            <img src={item.img} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
            <div className="flex-1">
              <div className="text-sm font-medium leading-snug">{item.name}</div>
              <div className="text-brass font-display font-semibold text-sm mt-0.5">{NGN(item.price)}</div>
              <div className="flex items-center gap-3 mt-1.5">
                <button onClick={() => onAddToCart(item)} className="text-xs font-semibold text-navy underline">Add to cart</button>
                <button onClick={() => onRemove(item.id)} className="text-xs text-slate hover:text-red-500">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ---------------------------------------------------------
   LOGIN MODAL (mock auth)
--------------------------------------------------------- */
const LoginModal = ({ open, onClose, onLogin }) => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] bg-navy-deep/60 flex items-center justify-center p-6 fade-in" onClick={onClose}>
      <div className="bg-porcelain rounded-xl max-w-sm w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-navy" aria-label="Close"><X size={20} /></button>
        <div className="w-11 h-11 rounded-md bg-brass flex items-center justify-center font-display font-bold text-navy-deep text-lg mb-4">R</div>
        <h2 className="font-display text-xl font-semibold">{mode === "login" ? "Welcome back" : "Create your account"}</h2>
        <p className="text-slate text-sm mt-1">{mode === "login" ? "Sign in to shop the community feed." : "Join to like, comment and shop products."}</p>
        <div className="mt-5 space-y-3">
          {mode === "signup" && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
              className="w-full border border-line rounded-md px-3 py-2.5 text-sm outline-none focus:border-brass" />
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email"
            className="w-full border border-line rounded-md px-3 py-2.5 text-sm outline-none focus:border-brass" />
          <input placeholder="Password" type="password"
            className="w-full border border-line rounded-md px-3 py-2.5 text-sm outline-none focus:border-brass" />
        </div>
        <button
          onClick={() => onLogin(name || "Guest Shopper", email || "guest@example.com")}
          className="btn-primary w-full rounded-full py-3 text-sm font-semibold mt-5"
        >
          {mode === "login" ? "Sign in" : "Create account"}
        </button>
        <div className="text-center text-xs text-slate mt-4">
          {mode === "login" ? (
            <>New here? <button onClick={() => setMode("signup")} className="text-brass font-semibold">Create an account</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode("login")} className="text-brass font-semibold">Sign in</button></>
          )}
        </div>
        <div className="text-[11px] text-slate text-center mt-3 font-mono">Prototype — no real account is created</div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   CHECKOUT PAGE
--------------------------------------------------------- */
const CheckoutPage = ({ cart, total, onComplete, setPage }) => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: "", phone: "", street: "", city: "", state: "" });
  const [payMethod, setPayMethod] = useState("card");
  const [placed, setPlaced] = useState(false);
  const orderNo = useRef("RWI-" + Math.floor(100000 + Math.random()*900000));

  if (cart.length === 0 && !placed) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <Package size={28} className="mx-auto mb-3 text-line" />
        <h2 className="font-display text-xl font-semibold">Your cart is empty</h2>
        <button onClick={() => setPage("feed")} className="btn-primary rounded-full px-6 py-3 text-sm mt-6">Go to shop feed</button>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center fade-in">
        <div className="w-16 h-16 rounded-full bg-sand flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-brass" />
        </div>
        <div className="stamp text-brass inline-block mb-3">Order Confirmed</div>
        <h2 className="font-display text-2xl font-semibold">Thank you, {address.name.split(" ")[0] || "friend"}!</h2>
        <p className="text-slate text-sm mt-2">Your order <span className="font-mono text-navy">{orderNo.current}</span> has been placed and will be processed shortly. A confirmation will be sent to your WhatsApp / email.</p>
        <div className="bg-sand rounded-md p-4 mt-6 text-left text-sm space-y-1.5">
          <div className="flex justify-between"><span className="text-slate">Delivery to</span><span className="font-medium">{address.city || "—"}, {address.state || "—"}</span></div>
          <div className="flex justify-between"><span className="text-slate">Payment method</span><span className="font-medium capitalize">{payMethod}</span></div>
          <div className="flex justify-between"><span className="text-slate">Total paid</span><span className="font-semibold text-navy">{NGN(total)}</span></div>
        </div>
        <button onClick={() => setPage("home")} className="btn-outline rounded-full px-6 py-3 text-sm mt-8">Continue shopping</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-5 gap-8">
      <div className="md:col-span-3">
        <div className="flex items-center gap-2 mb-6 text-xs font-mono">
          {["Address", "Payment", "Review"].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 ${step === i+1 ? "text-navy font-semibold" : "text-slate"}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= i+1 ? "bg-brass text-navy-deep" : "bg-sand"}`}>{i+1}</span>
                {s}
              </div>
              {i < 2 && <ChevronRight size={13} className="text-slate" />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-3 fade-in">
            <h3 className="font-display text-lg font-semibold mb-3">Delivery address</h3>
            <input value={address.name} onChange={(e) => setAddress({...address, name: e.target.value})} placeholder="Full name" className="w-full border border-line rounded-md px-3 py-2.5 text-sm outline-none focus:border-brass" />
            <input value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} placeholder="Phone number" className="w-full border border-line rounded-md px-3 py-2.5 text-sm outline-none focus:border-brass" />
            <input value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} placeholder="Street address" className="w-full border border-line rounded-md px-3 py-2.5 text-sm outline-none focus:border-brass" />
            <div className="grid grid-cols-2 gap-3">
              <input value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} placeholder="City" className="border border-line rounded-md px-3 py-2.5 text-sm outline-none focus:border-brass" />
              <input value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} placeholder="State" className="border border-line rounded-md px-3 py-2.5 text-sm outline-none focus:border-brass" />
            </div>
            <button onClick={() => setStep(2)} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold mt-2">Continue to payment</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 fade-in">
            <h3 className="font-display text-lg font-semibold mb-3">Payment method</h3>
            {[
              { id: "card", label: "Debit / Credit Card", sub: "Visa, Mastercard, Verve — via Paystack" },
              { id: "transfer", label: "Bank Transfer", sub: "Instant transfer — via Paystack" },
              { id: "ussd", label: "USSD", sub: "Pay with your bank's USSD code" },
            ].map(m => (
              <button key={m.id} onClick={() => setPayMethod(m.id)} className={`w-full flex items-center gap-3 border rounded-md p-3.5 text-left ${payMethod === m.id ? "border-brass bg-sand" : "border-line"}`}>
                <CreditCard size={18} className="text-navy" />
                <div>
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-xs text-slate">{m.sub}</div>
                </div>
              </button>
            ))}
            <div className="flex gap-3 mt-2">
              <button onClick={() => setStep(1)} className="btn-outline rounded-full px-6 py-3 text-sm font-semibold">Back</button>
              <button onClick={() => setStep(3)} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold">Review order</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 fade-in">
            <h3 className="font-display text-lg font-semibold mb-1">Review &amp; place order</h3>
            <div className="bg-sand rounded-md p-4 text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-slate">Deliver to</span><span className="font-medium text-right">{address.name}, {address.street}, {address.city}</span></div>
              <div className="flex justify-between"><span className="text-slate">Phone</span><span className="font-medium">{address.phone || "—"}</span></div>
              <div className="flex justify-between"><span className="text-slate">Payment</span><span className="font-medium capitalize">{payMethod}</span></div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate"><ShieldCheck size={14} className="text-brass" /> Payments are securely processed by Paystack. We never store your card details.</div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-outline rounded-full px-6 py-3 text-sm font-semibold">Back</button>
              <button onClick={() => {
                setPlaced(true);
                const newOrder = {
                  id: orderNo.current,
                  userId: "user_current",
                  customerName: address.name || "Valued Shopper",
                  customerEmail: "shopper@example.com",
                  customerPhone: address.phone || "+234 800 000 0000",
                  shippingAddress: {
                    street: address.street || "Lagos Street",
                    city: address.city || "Lagos",
                    state: address.state || "Lagos State",
                    country: "Nigeria"
                  },
                  items: cart.map(i => ({
                    productId: i.id,
                    title: i.name,
                    price: i.price,
                    quantity: i.qty,
                    mediaUrl: i.img
                  })),
                  totalAmount: total,
                  paymentMethod: payMethod as any,
                  paymentReference: "RW-PAY-" + Math.floor(100000 + Math.random()*900000),
                  status: "Processing" as const,
                  createdAt: new Date().toISOString()
                };
                onComplete(newOrder);
              }} className="btn-primary rounded-full px-6 py-3 text-sm font-semibold flex items-center gap-2">
                <Truck size={15} /> Place order — {NGN(total)}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        <div className="bg-sand rounded-md p-4 sticky top-24">
          <h4 className="font-display font-semibold mb-3 text-sm">Order summary</h4>
          <div className="space-y-2.5 max-h-64 overflow-y-auto scrollbar-none">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-slate">{item.name} × {item.qty}</span>
                <span className="font-medium">{NGN(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-line mt-3 pt-3 flex justify-between font-semibold">
            <span>Total</span><span className="text-navy">{NGN(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   ADMIN DASHBOARD
--------------------------------------------------------- */
const emptyProductForm = { name: "", category: CATEGORIES[0], price: "", oldPrice: "", stock: "", desc: "" };

const TemuPromoRibbon = ({ setPage }) => (
  <div className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white text-xs font-medium py-3 px-4 shadow-sm">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center gap-2 font-mono uppercase tracking-wider">
        <span className="bg-white text-red-600 font-bold px-1.5 py-0.5 rounded text-[10px]">TEMU UPDATE</span>
        <span>⚡ Lightning Deal: Extra 50% Off Selected Kitchen & Electrical Goods</span>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center">
        <span className="hidden md:flex items-center gap-1"><Truck size={13} /> Free Shipping &amp; Refund Guarantee</span>
        <button onClick={() => setPage("feed")} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full underline font-semibold transition-colors animate-pulse">Shop Flash Deals →</button>
      </div>
    </div>
  </div>
);

const TemuRewardsStrip = ({ setPage, onOpenChat }) => (
  <section className="bg-porcelain border-b border-line py-4">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-brass" />
          <h3 className="font-display text-lg font-semibold">Earn credits &amp; Free gifts</h3>
        </div>
        <button onClick={onOpenChat} className="text-xs font-semibold text-brass hover:underline flex items-center gap-1">
          <MessageSquare size={13} /> Message Admin for ₦5k Voucher
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { title: "FREE your gifts", sub: "Tap to spin & win", bg: "bg-emerald-600", text: "text-white" },
          { title: "GIFTS Open Now", sub: "Claim 3 items free", bg: "bg-emerald-500", text: "text-white" },
          { title: "Lightning Deals", sub: "Up to 70% off today", bg: "bg-amber-500", text: "text-white" },
          { title: "Message Admin", sub: "Instant bulk inquiries", bg: "bg-navy", text: "text-brass", action: onOpenChat },
        ].map((item, i) => (
          <div
            key={i}
            onClick={item.action ? item.action : () => setPage("feed")}
            className={`${item.bg} ${item.text} rounded-lg p-3.5 cursor-pointer card-hover flex flex-col justify-between h-24 shadow-sm relative overflow-hidden`}
          >
            <div className="font-display font-bold text-sm leading-tight">{item.title}</div>
            <div className="text-[11px] opacity-90">{item.sub}</div>
            <div className="absolute -bottom-3 -right-3 opacity-15 font-display text-4xl font-bold">₦</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default function ReemahWorldImport() {
  const [products, setProducts] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('reemah_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return PRODUCTS;
  });
  const [toastMsg, setToastMsg] = useState("");
  const toast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [adminProfileModalAdmin, setAdminProfileModalAdmin] = useState(null);
  const [targetAdminChat, setTargetAdminChat] = useState(null);

  const handleStartChatWithAdmin = (admin: any) => {
    setTargetAdminChat(admin);
    setChatOpen(true);
  };

  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('reemah_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('reemah_chat', JSON.stringify(chatMessages));
    } catch (e) {}
  }, [chatMessages]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [posts, setPosts] = useState(() => {
    try {
      const saved = localStorage.getItem('reemah_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('reemah_products', JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  // Neon Database sync so uploaded goods never disappear
  useEffect(() => {
    // Fetch from Neon API
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(err => console.log("Neon products fetch error", err));

    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data.sort((a, b) => b.createdAt - a.createdAt));
        }
      })
      .catch(err => console.log("Neon posts fetch error", err));

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
        }
      })
      .catch(err => console.log("Neon orders fetch error", err));
  }, []);
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('reemah_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('reemah_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const [unreadOrdersCount, setUnreadOrdersCount] = useState(() => {
    try {
      const saved = localStorage.getItem('reemah_unread_orders');
      return saved ? Number(saved) : 1;
    } catch (e) {
      return 1;
    }
  });

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(() => {
    try {
      const saved = localStorage.getItem('reemah_unread_messages');
      return saved ? Number(saved) : 0;
    } catch (e) {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem('reemah_unread_orders', String(unreadOrdersCount));
  }, [unreadOrdersCount]);

  useEffect(() => {
    localStorage.setItem('reemah_unread_messages', String(unreadMessagesCount));
  }, [unreadMessagesCount]);
  const [emailNotifications, setEmailNotifications] = useState([
    {
      id: "notif_1",
      orderId: "RW-10294",
      recipient: "amaka@example.com",
      subject: "Order Status Update: RW-10294 is now Shipped",
      body: "Hello Amaka O., your order RW-10294 containing Non-Stick Wok Set (3pc) has been dispatched via express logistics from our Lagos hub.",
      status: "Sent Successfully",
      sentAt: new Date(Date.now() - 86400000 * 1.5).toISOString()
    }
  ]);

  const updateOrderStatus = (orderId: string, newStatus: any) => {
    let targetOrder: any = null;
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        targetOrder = { ...o, status: newStatus };
        return targetOrder;
      }
      return o;
    }));

    if (targetOrder) {
      const subject = `Reemah World Import — Order Update #${orderId}: ${newStatus}`;
      const body = `Dear ${targetOrder.customerName},\n\nYour order #${orderId} status has been updated to: ${newStatus}.\nDelivery Address: ${targetOrder.shippingAddress.street}, ${targetOrder.shippingAddress.city}.\nTotal Amount: ₦${targetOrder.totalAmount.toLocaleString()}.\n\nThank you for choosing Reemah World Import!`;
      
      const newNotif = {
        id: "notif_" + Date.now(),
        orderId,
        recipient: targetOrder.customerEmail,
        subject,
        body,
        status: "Sent Successfully",
        sentAt: new Date().toISOString()
      };

      setEmailNotifications(prev => [newNotif, ...prev]);
      console.log(`📧 [Mockup Email Notification Service]\nTo: ${targetOrder.customerEmail}\nSubject: ${subject}\nBody:\n${body}`);
      toast(`📧 Confirmation email dispatched to ${targetOrder.customerEmail} (${newStatus})`);
    }
  };

  const handleAddProduct = async (newProdData: any) => {
    const newProduct = {
      id: "p_" + Date.now(),
      ...newProdData,
      likes: 0,
      comments: 0,
      ratingAverage: 5.0,
      createdAt: new Date().toISOString()
    };
    try {
      // Save to Neon API
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      
      // Create corresponding community post with all uploaded pictures and video
      const newPost = {
        id: "post_" + Date.now(),
        productId: newProduct.id,
        caption: `✨ New Chinese Import Arrival! ${newProduct.title}\n\n${newProduct.description}\n\nPrice: ₦${newProduct.price.toLocaleString()}`,
        likes: 0,
        likedByMe: false,
        comments: [],
        createdAt: Date.now(),
        images: [newProduct.mediaUrl, ...(newProduct.additionalImages || [])],
        videoUrl: newProduct.videoUrl || undefined,
        adminId: ADMIN_PROFILES.find(a => a.email === userEmail)?.id || ADMIN_PROFILES[0].id
      };

      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
      setPosts(prev => [newPost, ...prev]);
    } catch (e) {
      console.error("Error saving to Neon:", e);
    }
    setProducts(prev => [newProduct, ...prev]);
    toast(`Product "${newProduct.title}" uploaded & saved to Neon database successfully!`);
  };

  const handleUpdateProductStock = async (productId: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
    } catch (e) {
      console.error("Error updating stock in Neon:", e);
    }
    toast(`Stock updated successfully`);
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.error("Error deleting product from Neon:", e);
    }
    toast(`Product removed successfully`);
  };
  const [shareData, setShareData] = useState<{ title?: string; text?: string; url?: string } | null>(null);

  const handleOpenShare = (data: any) => {
    if (data && typeof data === 'object') {
      setShareData({
        title: typeof data.title === 'string' ? data.title : 'Reemah World Imports',
        text: typeof data.text === 'string' ? data.text : '',
        url: typeof data.url === 'string' ? data.url : window.location.href,
      });
    }
  };

  const [reviewsMap, setReviewsMap] = useState<Record<string, Array<{ id: string; user: string; rating: number; text: string; date: string; verified: boolean }>>>({});

  const handleAddReview = (productId: string, rating: number, text: string) => {
    const newReview = {
      id: "rev_" + Date.now(),
      user: userName || "Verified Shopper",
      rating,
      text,
      date: "Just now",
      verified: true
    };
    setReviewsMap(prev => {
      const existing = prev[productId] || [];
      const updated = [newReview, ...existing];
      const avgRating = Number((updated.reduce((s, r) => s + r.rating, 0) / updated.length).toFixed(1));
      setProducts(prodPrev => prodPrev.map(p => p.id === productId ? { ...p, rating: avgRating } : p));
      if (selectedProduct && selectedProduct.id === productId) {
        setSelectedProduct((sp: any) => sp ? { ...sp, rating: avgRating } : null);
      }
      return { ...prev, [productId]: updated };
    });
    toast("Review posted successfully!");
  };

  const activePosts = useMemo(() => {
    return posts.filter((post: any) => {
       if (categoryFilter && categoryFilter !== "All") {
         const product = products.find((p: any) => p.id === post.productId);
         return product?.category === categoryFilter;
       }
       return true;
    });
  }, [posts, categoryFilter, products]);

  const addToCart = (product: any) => {
    setCart((prev: any) => {
      const existing = prev.find((i: any) => i.id === product.id);
      if (existing) {
        return prev.map((i: any) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    toast(`${product.name} added to cart`);
  };
  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };
  const wishlistItems = products.filter(p => wishlist.includes(p.id));

  const handleLike = (postId) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likedByMe: !p.likedByMe, likes: p.likes + (p.likedByMe ? -1 : 1) } : p));
  };
  const handleComment = (postId, text) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, { id: "c"+Date.now(), user: userName || "You", text }] } : p));
  };

  const handleSendMessage = (text) => {
    const newMsg = { id: "m_" + Date.now(), sender: userName || "You", text, timestamp: Date.now(), isAdminResponse: false };
    setChatMessages(prev => [...prev, newMsg]);
    setUnreadMessagesCount(prev => prev + 1);
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: "m_reply_" + Date.now(),
        sender: "Admin Support",
        text: `Thanks for messaging us! We have received your inquiry: "${text}". Our admin team will respond shortly.`,
        timestamp: Date.now(),
        isAdminResponse: true
      }]);
    }, 1200);
  };

  const handleLogin = (name, email) => {
    setUserEmail(email.trim().toLowerCase());
    const recognizedAdmin = ADMIN_EMAILS.includes(email.trim().toLowerCase());
    setUserName(name);
    setIsLoggedIn(true);
    setIsAdmin(recognizedAdmin);
    setLoginOpen(false);
    toast(recognizedAdmin ? `Welcome back, Admin ${name}!` : `Welcome, ${name}!`);
    if (recognizedAdmin) setPage("admin");
  };
  const handleLogout = () => { setIsLoggedIn(false); setIsAdmin(false); setPage("home"); };

  const goCheckout = () => { setCartOpen(false); setPage("checkout"); };

  return (
    <div className="rwi min-h-screen flex flex-col pb-16 md:pb-0">
      <GlobalStyle />
      <TemuPromoRibbon setPage={setPage} />
      <Navbar
        page={page} setPage={setPage} cartCount={cartCount} wishlistCount={wishlist.length}
        isLoggedIn={isLoggedIn} isAdmin={isAdmin}
        onOpenLogin={() => setLoginOpen(true)} onOpenCart={() => setCartOpen(true)} onOpenWishlist={() => setWishlistOpen(true)}
        onLogout={handleLogout} search={search} setSearch={setSearch}
      />

      {/* demo-only role switch so both experiences are reachable without real auth */}
      {isLoggedIn && (
        <div className="bg-brass/15 border-b border-brass/30 text-center py-1.5 text-[11px] font-mono text-navy">
          Prototype demo — viewing as {isAdmin ? "Admin" : "Shopper"} ({userName}) ·{" "}
          <button onClick={() => setIsAdmin(a => !a)} className="underline font-semibold">
            Switch to {isAdmin ? "shopper" : "admin"} view (testing override)
          </button>
        </div>
      )}

      <main className="flex-1">
        {page === "home" && (
          <>
            <Hero setPage={setPage} />
            <TemuRewardsStrip setPage={setPage} onOpenChat={() => setChatOpen(true)} />
            <AboutSection />
            <CategoryStrip setPage={setPage} setCategoryFilter={setCategoryFilter} />
            <FeaturedProducts products={products} onOpen={setSelectedProduct} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist} />
          </>
        )}
        {page === "feed" && (
          <FeedPage
            posts={activePosts} products={products} search={search} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
            onLike={handleLike} onComment={handleComment} onOpenProduct={setSelectedProduct} onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist} wishlist={wishlist} isLoggedIn={isLoggedIn} onOpenLogin={() => setLoginOpen(true)}
            onShare={handleOpenShare} onOpenAdminProfile={(admin) => setAdminProfileModalAdmin(admin)}
          />
        )}
        {page === "checkout" && (
          <CheckoutPage cart={cart} total={cartTotal} onComplete={async (newOrder) => {
            setOrders(prev => [newOrder, ...prev]);
            setUnreadOrdersCount(prev => prev + 1);
            setCart([]);
            try {
              await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newOrder)
              });
            } catch (e) {
              console.error("Error saving order to Neon:", e);
            }
            toast(`Order ${newOrder.id} placed successfully!`);
          }} setPage={setPage} />
        )}
        {page === "tracking" && (
          <OrderTracking orders={orders} onBackToShop={() => setPage("home")} />
        )}
        {page === "orderHistory" && isLoggedIn && (
          <MyOrdersModal orders={orders} onBackToShop={() => setPage("home")} />
        )}
        {page === "admin" && isAdmin && (
          <AdminDashboard
            posts={activePosts}
            products={products}
            setPosts={setPosts}
            setProducts={setProducts}
            toast={toast}
            orders={orders}
            emailNotifications={emailNotifications}
            chatMessages={chatMessages}
            unreadOrdersCount={unreadOrdersCount}
            unreadMessagesCount={unreadMessagesCount}
            onClearOrderNotifications={() => setUnreadOrdersCount(0)}
            onClearMessageNotifications={() => setUnreadMessagesCount(0)}
            onUpdateOrderStatus={updateOrderStatus}
          />
        )}
      </main>

      <Footer setPage={setPage} />
      <WhatsAppButton />
      <Toast message={toastMsg} />

      <ProductModal
        product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist} isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onShare={handleOpenShare} reviewsMap={reviewsMap} onAddReview={handleAddReview}
        userName={userName} isLoggedIn={isLoggedIn} onOpenLogin={() => setLoginOpen(true)}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQty={updateQty} removeItem={removeItem} total={cartTotal} onCheckout={goCheckout} />
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} items={wishlistItems} onAddToCart={addToCart} onRemove={toggleWishlist} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
      <ShareModal
        open={Boolean(shareData)} onClose={() => setShareData(null)}
        title={shareData?.title} text={shareData?.text} url={shareData?.url} toast={toast}
      />
      <AdminProfileModal
        admin={adminProfileModalAdmin}
        open={Boolean(adminProfileModalAdmin)}
        onClose={() => setAdminProfileModalAdmin(null)}
        onStartChat={handleStartChatWithAdmin}
      />
      <AdminChatModal
        open={chatOpen} onClose={() => { setChatOpen(false); setTargetAdminChat(null); }} messages={chatMessages}
        onSendMessage={handleSendMessage} userName={userName} isLoggedIn={isLoggedIn} onOpenLogin={() => setLoginOpen(true)}
        targetAdmin={targetAdminChat}
      />
      <BottomNavBar
        page={page} setPage={setPage} cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)} onOpenChat={() => setChatOpen(true)} unreadCount={chatMessages.filter(m => m.isAdminResponse).length}
      />
    </div>
  );
}
