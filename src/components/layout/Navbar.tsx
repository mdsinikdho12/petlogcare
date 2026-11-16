"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  PawPrint,
  Search,
  Globe,
  ChevronDown,
  Heart,
  Bell,
  ArrowRight,
  Check,
  User,
  LayoutDashboard,
  LogOut,
  Calendar,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store/authStore";

const navLinks = [
  { label: "Home", href: "/", id: "home" },
  { label: "Find Providers", href: "/providers", id: "providers" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "Pricing", href: "/pricing", id: "pricing" },
  { label: "Blog", href: "/blog", id: "blog" },
  { label: "Contact", href: "/#contact", id: "contact" },
];

const languages = [
  { code: "EN", label: "English" },
  { code: "BN", label: "বাংলা" },
];

const searchHints = ["Vet", "Clinic", "Pet service"];

export default function Navbar({ hasUnread = false }: { hasUnread?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const [query, setQuery] = useState("");
  const [sectionActive, setSectionActive] = useState("home");

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    clearAuth();
    setIsProfileOpen(false);
    setIsMobileOpen(false);
    window.location.href = "/";
  };

  /* ---------- Scroll state ---------- */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- Highlight the home-page section in view ---------- */
  useEffect(() => {
    if (pathname !== "/") return;
    const ids = navLinks.filter((l) => l.href.includes("#")).map((l) => l.id);
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSectionActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));

    const onTop = () => window.scrollY < 120 && setSectionActive("home");
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [pathname]);

  const isActive = (l: (typeof navLinks)[number]) => {
    if (l.href.includes("#") || l.id === "home") return pathname === "/" && sectionActive === l.id;
    return pathname.startsWith(l.href);
  };

  /* ---------- Scroll lock, Escape, Cmd/Ctrl+K ---------- */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen || isSearchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen, isSearchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileOpen(false);
        setIsSearchOpen(false);
        setIsLangOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchInputRef.current?.focus();
  }, [isSearchOpen]);

  /* ---------- Close menus on outside click ---------- */
  useEffect(() => {
    if (!isLangOpen && !isProfileOpen) return;
    const onDown = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setIsLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isLangOpen, isProfileOpen]);

  const submitSearch = (q: string) => {
    const term = q.trim();
    setIsSearchOpen(false);
    setIsMobileOpen(false);
    router.push(term ? `/providers?q=${encodeURIComponent(term)}` : "/providers");
  };

  /* Same glass recipe as the rest of the page. More opaque after scrolling. */
  const glass = cn(
    "border backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300",
    isScrolled
      ? "border-white/70 bg-white/65 shadow-[0_8px_30px_rgba(1,95,160,0.14),inset_0_1px_0_rgba(255,255,255,0.9)]"
      : "border-white/60 bg-white/35 shadow-[0_6px_24px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.85)]"
  );
  const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D96E6]";
  const iconBtn = cn(
    "relative flex h-9 w-9 items-center justify-center rounded-full text-[#06395F]/80 transition-colors hover:bg-white/70 hover:text-[#06395F]",
    focus
  );
  const primaryBtn =
    "bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white shadow-[0_6px_18px_rgba(13,150,230,0.4),inset_0_1px_0_rgba(255,255,255,0.5)]";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between gap-3"
        >
          {/* Group 1: Brand */}
          <Link
            href="/"
            className={cn("group flex h-12 items-center gap-2 rounded-full pl-1.5 pr-4", glass, focus)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-transform group-hover:scale-105">
              <PawPrint className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-[#06395F]">
              Pet<span className="text-[#0D8BE0]">Care</span>Log
            </span>
          </Link>

          {/* Group 2: Page links */}
          <ul className={cn("hidden h-12 items-center gap-0.5 rounded-full p-1.5 xl:flex", glass)}>
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  aria-current={isActive(link) ? "page" : undefined}
                  className={cn(
                    "block whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-200",
                    focus,
                    isActive(link)
                      ? "bg-white/85 text-[#06395F] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_4px_rgba(1,95,160,0.12)]"
                      : "text-[#06395F]/70 hover:bg-white/50 hover:text-[#06395F]"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Group 3: Utilities (search, language, favorites, notifications) */}
            <div className={cn("hidden h-12 items-center gap-0.5 rounded-full p-1.5 xl:flex", glass)}>
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search vets, clinics and pet services"
                className={iconBtn}
              >
                <Search className="h-[18px] w-[18px]" aria-hidden />
              </button>

              {/* Language */}
              <div ref={langRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={isLangOpen}
                  aria-label={`Language: ${lang}`}
                  className={cn(
                    "flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-semibold text-[#06395F]/80 transition-colors hover:bg-white/70 hover:text-[#06395F]",
                    focus
                  )}
                >
                  <Globe className="h-[18px] w-[18px]" aria-hidden />
                  {lang}
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 transition-transform", isLangOpen && "rotate-180")}
                    aria-hidden
                  />
                </button>

                {isLangOpen && (
                  <div
                    role="menu"
                    className="animate-fade-in absolute right-0 top-full mt-3 w-44 rounded-2xl border border-white/70 bg-white/80 p-1.5 shadow-[0_20px_50px_rgba(1,95,160,0.22),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-150"
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        role="menuitemradio"
                        aria-checked={lang === l.code}
                        onClick={() => {
                          setLang(l.code);
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-[#06395F] transition-colors hover:bg-white",
                          focus
                        )}
                      >
                        {l.label}
                        {lang === l.code && <Check className="h-4 w-4 text-[#0D8BE0]" aria-hidden />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/favorites" aria-label="Favorites" className={iconBtn}>
                <Heart className="h-[18px] w-[18px]" aria-hidden />
              </Link>

              <Link
                href="/notifications"
                aria-label={hasUnread ? "Notifications, you have unread" : "Notifications"}
                className={iconBtn}
              >
                <Bell className="h-[18px] w-[18px]" aria-hidden />
                {hasUnread && (
                  <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white/80" />
                )}
              </Link>
            </div>

            {/* Group 4: Account */}
            <div className="hidden items-center gap-2 xl:flex">
              {mounted && isAuthenticated && user ? (
                <div ref={profileRef} className="relative">
                  {(() => {
                    const avatarSrc =
                      user.profileImage?.url ||
                      (user as any).avatar ||
                      (user as any).image;
                    return (
                      <>
                        <button
                          type="button"
                          onClick={() => setIsProfileOpen((v) => !v)}
                          aria-haspopup="menu"
                          aria-expanded={isProfileOpen}
                          aria-label="User account menu"
                          className={cn(
                            "flex h-12 items-center gap-2.5 rounded-full pl-2 pr-3.5 transition duration-200 hover:bg-white/70",
                            glass,
                            focus
                          )}
                        >
                          {avatarSrc ? (
                            <img
                              src={avatarSrc}
                              alt={user.name || "User Avatar"}
                              className="h-8 w-8 rounded-full object-cover border border-white/80 shadow-xs"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#2FB0FF] to-[#0D8BE0] text-xs font-bold text-white shadow-xs">
                              {user.name ? user.name[0].toUpperCase() : "U"}
                            </div>
                          )}
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-[#06395F] leading-tight max-w-[110px] truncate">
                              {user.name?.split(" ")[0] || "Account"}
                            </span>
                            <span className="text-[10px] font-medium text-[#0D8BE0] leading-none">
                              {user.role === "PROVIDER"
                                ? "Provider"
                                : user.role === "ADMIN"
                                ? "Admin"
                                : "Pet Parent"}
                            </span>
                          </div>
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-[#06395F]/60 transition-transform",
                              isProfileOpen && "rotate-180"
                            )}
                          />
                        </button>

                        {isProfileOpen && (
                          <div
                            role="menu"
                            className="animate-fade-in absolute right-0 top-full mt-3 w-64 rounded-[2rem] border border-white/70 bg-white/45 p-2.5 shadow-[0_20px_50px_rgba(1,95,160,0.22),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-150 z-50"
                          >
                            {/* Pure Glass User Card Header */}
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-md mb-2">
                              {avatarSrc ? (
                                <img
                                  src={avatarSrc}
                                  alt={user.name || "User"}
                                  className="h-10 w-10 rounded-full object-cover border border-white/80 shadow-sm shrink-0"
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#2FB0FF] to-[#0D8BE0] text-sm font-bold text-white shadow-sm shrink-0">
                                  {user.name ? user.name[0].toUpperCase() : "U"}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#06395F] truncate">
                                  {user.name}
                                </p>
                                <p className="text-[11px] text-[#0B4C7A]/75 truncate mt-0.5">
                                  {user.email}
                                </p>
                                <span className="inline-block mt-1 text-[10px] font-semibold text-[#0D8BE0] bg-sky-100/70 border border-white/80 px-2 py-0.5 rounded-full">
                                  {user.role === "PROVIDER"
                                    ? "Service Provider"
                                    : user.role === "ADMIN"
                                    ? "Administrator"
                                    : "Pet Parent"}
                                </span>
                              </div>
                            </div>

                            {/* Menu links */}
                            <div className="space-y-0.5">
                              <Link
                                href={
                                  user.role === "ADMIN"
                                    ? "/admin"
                                    : user.role === "PROVIDER"
                                    ? "/dashboard/provider"
                                    : "/dashboard/owner"
                                }
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#06395F] hover:bg-white/60 active:bg-white/80 transition"
                              >
                                <div className="w-6 h-6 rounded-lg bg-sky-500/15 text-[#0D8BE0] flex items-center justify-center">
                                  <LayoutDashboard className="w-3.5 h-3.5" />
                                </div>
                                <span>Dashboard</span>
                              </Link>

                              {user.role === "USER" && (
                                <>
                                  <Link
                                    href="/dashboard/owner/pets"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#06395F] hover:bg-white/60 active:bg-white/80 transition"
                                  >
                                    <div className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-600 flex items-center justify-center">
                                      <PawPrint className="w-3.5 h-3.5" />
                                    </div>
                                    <span>My Pets</span>
                                  </Link>
                                  <Link
                                    href="/dashboard/owner/bookings"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#06395F] hover:bg-white/60 active:bg-white/80 transition"
                                  >
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                                      <Calendar className="w-3.5 h-3.5" />
                                    </div>
                                    <span>My Bookings</span>
                                  </Link>
                                </>
                              )}

                              {user.role === "PROVIDER" && (
                                <>
                                  <Link
                                    href="/dashboard/provider/services"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#06395F] hover:bg-white/60 active:bg-white/80 transition"
                                  >
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                    </div>
                                    <span>My Services</span>
                                  </Link>
                                  <Link
                                    href="/dashboard/provider/bookings"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#06395F] hover:bg-white/60 active:bg-white/80 transition"
                                  >
                                    <div className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-600 flex items-center justify-center">
                                      <Calendar className="w-3.5 h-3.5" />
                                    </div>
                                    <span>Patient Flow</span>
                                  </Link>
                                </>
                              )}

                              <Link
                                href={
                                  user.role === "PROVIDER"
                                    ? "/dashboard/provider/messages"
                                    : "/dashboard/owner/messages"
                                }
                                onClick={() => setIsProfileOpen(false)}
                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[#06395F] hover:bg-white/60 active:bg-white/80 transition"
                              >
                                <div className="w-6 h-6 rounded-lg bg-violet-500/15 text-violet-600 flex items-center justify-center">
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </div>
                                <span>Messages</span>
                              </Link>
                            </div>

                            <div className="my-1.5 border-t border-white/60" />

                            <button
                              type="button"
                              onClick={handleLogout}
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50/70 transition"
                            >
                              <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-600 flex items-center justify-center">
                                <LogOut className="w-3.5 h-3.5" />
                              </div>
                              <span>Log out</span>
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      "flex h-12 items-center rounded-full px-5 text-[13px] font-semibold text-[#06395F] hover:bg-white/70",
                      glass,
                      focus
                    )}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className={cn(
                      "flex h-12 items-center rounded-full px-6 text-[13px] font-semibold transition duration-200 hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D8BE0]",
                      primaryBtn
                    )}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Below xl: search + menu buttons */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search vets, clinics and pet services"
              className={cn("flex h-12 w-12 items-center justify-center rounded-full text-[#06395F] xl:hidden", glass, focus)}
            >
              <Search className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              className={cn("flex h-12 w-12 items-center justify-center rounded-full text-[#06395F] xl:hidden", glass, focus)}
              onClick={() => setIsMobileOpen((v) => !v)}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* ---------- Search overlay ---------- */}
      {isSearchOpen && (
        <div role="dialog" aria-modal="true" aria-label="Search" className="fixed inset-0 z-[60]">
          <div
            className="animate-fade-in absolute inset-0 bg-[#06395F]/25 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="animate-fade-in absolute inset-x-3 top-4 mx-auto max-w-2xl rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-[0_24px_70px_rgba(1,95,160,0.28),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-150 sm:top-6 sm:p-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch(query);
              }}
              className="flex items-center gap-3"
            >
              <div className="flex h-14 flex-1 items-center gap-3 rounded-full border border-white/80 bg-white/80 pl-5 pr-2 shadow-[inset_0_1px_2px_rgba(1,95,160,0.08)] focus-within:ring-2 focus-within:ring-[#0D96E6]">
                <Search className="h-5 w-5 flex-shrink-0 text-[#06395F]/60" aria-hidden />
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="vet, clinic, pet service..."
                  aria-label="Search vets, clinics and pet services"
                  className="h-full min-w-0 flex-1 bg-transparent text-base text-[#06395F] outline-none placeholder:text-[#06395F]/45"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full", primaryBtn, focus)}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                className={cn("flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-[#06395F] hover:bg-white/70", focus)}
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
              <span className="text-sm text-[#0B4C7A]/65">Try</span>
              {searchHints.map((hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => submitSearch(hint)}
                  className={cn(
                    "rounded-full border border-white/80 bg-white/70 px-4 py-1.5 text-sm font-medium text-[#06395F] transition-colors hover:bg-white",
                    focus
                  )}
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------- Mobile menu ---------- */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-300 xl:hidden",
          isMobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-[#06395F]/20 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-x-3 top-[5rem] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-[0_20px_60px_rgba(1,95,160,0.25),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-150 transition-transform duration-300 sm:inset-x-6",
            isMobileOpen ? "translate-y-0" : "-translate-y-3"
          )}
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  aria-current={isActive(link) ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center rounded-2xl px-4 text-base font-medium transition-colors",
                    isActive(link) ? "bg-white/80 text-[#06395F]" : "text-[#06395F]/75 hover:bg-white/60"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="my-3 h-px bg-[#06395F]/10" />

          {/* Favorites + notifications */}
          <div className="flex flex-col">
            <Link
              href="/favorites"
              onClick={() => setIsMobileOpen(false)}
              className="flex min-h-12 items-center gap-3 rounded-2xl px-4 text-base font-medium text-[#06395F]/75 hover:bg-white/60"
            >
              <Heart className="h-5 w-5" aria-hidden />
              Favorites
            </Link>
            <Link
              href="/notifications"
              onClick={() => setIsMobileOpen(false)}
              className="flex min-h-12 items-center gap-3 rounded-2xl px-4 text-base font-medium text-[#06395F]/75 hover:bg-white/60"
            >
              <Bell className="h-5 w-5" aria-hidden />
              Notifications
              {hasUnread && <span className="ml-auto h-2.5 w-2.5 rounded-full bg-rose-500" aria-label="Unread" />}
            </Link>
          </div>

          {/* Language */}
          <div className="mt-3 flex items-center gap-3 px-4">
            <Globe className="h-5 w-5 text-[#06395F]/60" aria-hidden />
            <div role="radiogroup" aria-label="Language" className="flex flex-1 rounded-full border border-white/70 bg-white/50 p-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  role="radio"
                  aria-checked={lang === l.code}
                  onClick={() => setLang(l.code)}
                  className={cn(
                    "min-h-10 flex-1 rounded-full text-sm font-semibold transition-colors",
                    lang === l.code ? "bg-white text-[#06395F] shadow-sm" : "text-[#06395F]/60"
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <div className="my-3 h-px bg-[#06395F]/10" />

          {mounted && isAuthenticated && user ? (
            <div className="flex flex-col gap-2">
              {(() => {
                const mobAvatar =
                  user.profileImage?.url ||
                  (user as any).avatar ||
                  (user as any).image;
                return (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-white/80">
                    {mobAvatar ? (
                      <img
                        src={mobAvatar}
                        alt={user.name || "User Avatar"}
                        className="h-10 w-10 rounded-full object-cover border border-white/80 shadow-xs"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#2FB0FF] to-[#0D8BE0] text-sm font-bold text-white shadow-xs">
                        {user.name ? user.name[0].toUpperCase() : "U"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#06395F] truncate">{user.name}</p>
                      <p className="text-xs text-[#0B4C7A]/70 truncate">{user.email}</p>
                    </div>
                  </div>
                );
              })()}

              <Link
                href={
                  user.role === "ADMIN"
                    ? "/admin"
                    : user.role === "PROVIDER"
                    ? "/dashboard/provider"
                    : "/dashboard/owner"
                }
                onClick={() => setIsMobileOpen(false)}
                className={cn("flex min-h-12 items-center justify-center rounded-full text-base font-semibold", primaryBtn)}
              >
                Go to Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex min-h-12 items-center justify-center rounded-full border border-rose-200 bg-rose-50/70 text-base font-semibold text-rose-600 hover:bg-rose-100"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileOpen(false)}
                className="flex min-h-12 items-center justify-center rounded-full border border-white/70 bg-white/60 text-base font-semibold text-[#06395F]"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileOpen(false)}
                className={cn("flex min-h-12 items-center justify-center rounded-full text-base font-semibold", primaryBtn)}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}