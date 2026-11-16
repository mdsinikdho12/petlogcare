// src/app/(public)/blogs/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  ShieldCheck,
  Stethoscope,
  Heart,
} from "lucide-react";
import { blogPosts } from "../page";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="relative min-h-screen text-[#06395F] pt-24 sm:pt-28 lg:pt-32 pb-20">
      {/* Background ambient blooms */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
      >
        <div className="absolute top-1/4 -left-20 h-[520px] w-[520px] rounded-full bg-[#9EE7FF]/60 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-[500px] w-[500px] rounded-full bg-[#FFD6E8]/70 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-[480px] w-[480px] rounded-full bg-[#FFF1C9]/60 blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D8BE0] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to pet health knowledge hub</span>
        </Link>

        {/* Article Header Card */}
        <div className="rounded-[13px] border border-white/80 bg-white/55 backdrop-blur-xl backdrop-saturate-150 p-6 sm:p-10 shadow-[0_8px_30px_rgba(1,95,160,0.10),inset_0_1px_0_rgba(255,255,255,0.95)] space-y-4">
          <span className="inline-block px-3 py-1 rounded-[8px] bg-sky-50 text-[#0D8BE0] border border-sky-100 text-xs font-semibold">
            {post.category}
          </span>

          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-[#06395F] leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#06395F]/75 border-t border-[#06395F]/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2FB0FF] to-[#0D8BE0] text-white flex items-center justify-center font-bold text-xs">
                {post.author.charAt(3)}
              </div>
              <div>
                <p className="font-bold text-[#06395F]">{post.author}</p>
                <p className="text-[10px] text-[#06395F]/60">{post.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] ml-auto">
              <Calendar className="w-3.5 h-3.5 text-[#0D8BE0]" />
              <span>{post.date}</span>
              <span className="mx-1">•</span>
              <Clock className="w-3.5 h-3.5 text-[#0D8BE0]" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Article Image */}
        <div className="rounded-[13px] overflow-hidden border border-[#06395F]/10 shadow-[0_1px_2px_rgba(6,57,95,0.06)] h-72 sm:h-96 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="rounded-[13px] bg-white/85 border border-[#06395F]/10 p-6 sm:p-10 shadow-[0_1px_2px_rgba(6,57,95,0.06)] text-xs sm:text-sm text-[#06395F] leading-relaxed space-y-5">
          <p className="text-sm sm:text-base font-medium text-[#06395F]/90 border-l-4 border-[#0D8BE0] pl-4 py-1 italic bg-sky-50/40 rounded-r-[8px]">
            {post.excerpt}
          </p>

          <h2 className="font-display text-lg sm:text-xl font-bold text-[#06395F] pt-2">
            Why clinical timing is vital in Bangladesh
          </h2>

          <p className="font-normal text-[#06395F]/85">
            Pet parents in urban hubs like Dhaka and Chittagong face high ambient bacterial and viral loads due to tropical moisture and street-animal exposure. Timely prophylactic vaccines and preventative deworming form the baseline biological armor for indoor cats and dogs.
          </p>

          <div className="p-4 rounded-[11px] bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="font-bold text-xs text-[#06395F] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Core Vaccine Guidelines Summary</span>
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-[#06395F]/80 font-normal">
              <li><strong>6 - 8 Weeks:</strong> First puppy/kitten core immunization (DHPPi for dogs / Tricat for cats).</li>
              <li><strong>12 Weeks:</strong> Secondary booster and broad-spectrum anthelmintic deworming.</li>
              <li><strong>16 Weeks:</strong> Mandatory Rabies injection with government BVCA-stamped certificate.</li>
              <li><strong>Annual Booster:</strong> Single booster every 12 months to maintain protective antibody titers.</li>
            </ul>
          </div>

          <h2 className="font-display text-lg sm:text-xl font-bold text-[#06395F] pt-2">
            What to do when an unexpected reaction occurs
          </h2>

          <p className="font-normal text-[#06395F]/85">
            Mild lethargy or tenderness at the injection site is normal for 24 hours. However, if your pet exhibits facial swelling, vomiting, or breathing distress, immediately dial our 24/7 emergency vet helpline or navigate to the nearest verified trauma center.
          </p>

          <div className="pt-6 border-t border-[#06395F]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#06395F]/70">Verified by:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>PetCareLog Clinical Review Board</span>
              </span>
            </div>

            <Link
              href="/providers"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[11px] bg-gradient-to-b from-[#2FB0FF] to-[#0D8BE0] text-white text-xs font-semibold shadow-xs hover:-translate-y-0.5 transition"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Book consultation with Dr. Samira</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
