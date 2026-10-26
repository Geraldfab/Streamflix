import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  ShieldAlert,
  FileText,
  ExternalLink,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Tv,
  Film,
  Globe,
  Ban,
  Clock,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — StreamFlix Cinema Studio",
  description:
    "Read the Terms of Service for StreamFlix Cinema Studio. Review terms of use, content indexing, third-party embeds, acceptable use, copyright takedown procedures, and liability disclaimers.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsOfServicePage() {
  const effectiveDate = "October 26, 2026";
  const lastUpdated = "October 26, 2026";

  const tableOfContents = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "service-description", title: "2. Description of the Service & Non-Hosting Architecture" },
    { id: "eligibility-acceptable-use", title: "3. Eligibility & Acceptable Use Policy" },
    { id: "intellectual-property", title: "4. Intellectual Property, TMDB Attribution & Copyright Policy" },
    { id: "notice-and-takedown", title: "5. Copyright Infringement Notification & Takedown Procedure" },
    { id: "third-party-services", title: "6. Third-Party Services, Embeds & External Links" },
    { id: "developer-tips", title: "7. Voluntary Developer Tipping & Community Feedback" },
    { id: "service-modifications", title: "8. Availability, Modifications & Service Termination" },
    { id: "disclaimers-liability", title: "9. Warranty Disclaimers & Limitations of Liability" },
    { id: "governing-law", title: "10. Governing Law & Dispute Resolution" },
    { id: "changes-contact", title: "11. Modifications to Terms & Contact Information" },
  ];

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-rose-400 border border-purple-500/20 dark:border-rose-500/20">
          <Scale className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Please read these Terms of Service carefully before accessing or using StreamFlix Cinema Studio.
          These terms outline your legal rights and obligations regarding the platform, content discovery,
          third-party embedded streams, and acceptable use.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Effective Date: <strong>{effectiveDate}</strong></span>
          </div>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
          <div>
            <span>Last Updated: <strong>{lastUpdated}</strong></span>
          </div>
        </div>
      </header>

      {/* Quick Summary / Key Highlights Callout */}
      <aside className="mb-12 p-6 rounded-3xl bg-gradient-to-br from-purple-50/70 via-white to-zinc-50/70 dark:from-zinc-900/90 dark:via-zinc-900/50 dark:to-zinc-950 border border-purple-200/70 dark:border-rose-500/20 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-rose-400">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-rose-500" />
          <span>At-a-Glance Summary (Non-Binding Overview)</span>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>No Account Needed:</strong> StreamFlix requires no user registration, email, or password to browse media.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Non-Hosting Index:</strong> We do not host video files on our servers; playback is powered by external third-party embeds.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Local Data Only:</strong> Watchlists and playback history are saved locally in your own browser storage.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Copyright Respect:</strong> We provide an explicit, fast-acting notice and takedown process for rights holders.</span>
          </li>
        </ul>
      </aside>

      {/* Table of Contents */}
      <nav aria-label="Table of Contents" className="mb-12 p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-600 dark:text-rose-500" />
          <span>Table of Contents</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {tableOfContents.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-rose-400 transition-colors py-1 flex items-center gap-1.5"
            >
              <span className="text-zinc-400 dark:text-zinc-500">•</span>
              <span>{item.title}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Main Document Content */}
      <article className="space-y-12 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {/* Section 1 */}
        <section id="acceptance" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-rose-400 bg-purple-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-rose-900/50">
              01
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Acceptance of Terms
            </h2>
          </div>
          <p>
            Welcome to <strong>StreamFlix Cinema Studio</strong> (&ldquo;StreamFlix&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;),
            accessible at <a href="https://streamflixmedia.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-rose-400 underline underline-offset-2 hover:text-purple-700 dark:hover:text-rose-300">https://streamflixmedia.vercel.app/</a>.
            StreamFlix is an independent web application engineered to deliver a responsive, minimalist interface for discovering cinematic titles,
            browsing rich film and television metadata, and accessing third-party media players.
          </p>
          <p>
            By accessing, browsing, interacting with, or using any feature of StreamFlix, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;) and our accompanying{" "}
            <Link href="/privacy" className="text-purple-600 dark:text-rose-400 underline underline-offset-2 hover:text-purple-700 dark:hover:text-rose-300">
              Privacy Policy
            </Link>. If you do not agree to these Terms in their entirety, you must discontinue your use of the website immediately.
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
            Note: Acceptance is established through your affirmative access and voluntary interaction with the website under applicable law.
            StreamFlix does not employ misleading pre-checked consent boxes or make deceptive representations of explicit agreement where none was provided.
          </p>
        </section>

        {/* Section 2 */}
        <section id="service-description" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-rose-400 bg-purple-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-rose-900/50">
              02
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Description of the Service & Non-Hosting Architecture
            </h2>
          </div>
          <p>
            StreamFlix provides users with tools to explore, organize, and preview entertainment content. Specifically, the service includes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Catalog Discovery & Search:</strong> Browsing popular, trending, and genre-filtered movies, TV series, and anime.
            </li>
            <li>
              <strong>Metadata Display:</strong> Viewing synopses, cast lists, release dates, user ratings, runtime, and promotional backdrops.
            </li>
            <li>
              <strong>Client-Side Personalization:</strong> Creating an in-browser watchlist, tracking continue-watching progress, and maintaining recent watch history (stored exclusively in your local browser storage).
            </li>
            <li>
              <strong>Playback Interface:</strong> A custom web player shell that integrates embedded video feeds from external providers, custom embed URLs, and open-source demonstration media (e.g., Blender Foundation open movies via HLS.js).
            </li>
            <li>
              <strong>Community Features:</strong> An optional developer tip jar (via GCash and PayPal) and community feedback form.
            </li>
          </ul>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Critical Non-Hosting Architecture Notice</span>
            </div>
            <p className="text-xs leading-relaxed">
              <strong>StreamFlix DOES NOT host, upload, encode, store, or manage any commercial movie or television video files on its servers.</strong>
              The platform operates strictly as a front-end catalog interface that dynamically embeds third-party media players (e.g., 0vidads, ZXC Stream)
              hosted and operated by autonomous third parties across the internet. StreamFlix has no ownership or direct control over the servers,
              transmissions, or media content delivered by these independent third-party sources.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section id="eligibility-acceptable-use" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-rose-400 bg-purple-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-rose-900/50">
              03
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Eligibility & Acceptable Use Policy
            </h2>
          </div>
          <p>
            You agree to access and use StreamFlix solely for personal, lawful, non-commercial viewing and discovery.
            When interacting with the platform, you agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Automated Scraping & Denial of Service:</strong> Deploying bots, scrapers, crawlers, automated scripts, or tools designed to harvest data, overload server bandwidth, or cause a denial of service (DoS) to StreamFlix or its underlying hosting infrastructure (Vercel).
            </li>
            <li>
              <strong>System Interference & Exploitation:</strong> Probing, scanning, or testing vulnerabilities of the website, API endpoints, or database structures, or attempting to breach authentication or security protocols.
            </li>
            <li>
              <strong>Malicious Payloads:</strong> Submitting malicious code, SQL injections, script injections, spam, abusive text, or excessive automated requests through the feedback endpoint or any input field.
            </li>
            <li>
              <strong>Impersonation & Fraud:</strong> Impersonating any individual or entity, or misrepresenting your affiliation with any person, studio, distributor, or organization.
            </li>
            <li>
              <strong>Circumvention:</strong> Modifying, reverse-engineering, decompiling, or attempting to bypass technical safeguards implemented by the platform or third-party embedded providers.
            </li>
          </ul>
          <p>
            StreamFlix reserves the right to rate-limit, restrict, or block IP addresses that engage in abusive or harmful conduct.
          </p>
        </section>

        {/* Section 4 */}
        <section id="intellectual-property" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-rose-400 bg-purple-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-rose-900/50">
              04
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Intellectual Property, TMDB Attribution & Copyright Policy
            </h2>
          </div>
          <p>
            <strong>StreamFlix Proprietary Materials:</strong> The StreamFlix brand name, logo, custom user interface design, glassmorphism design system,
            cascading stylesheets, component code, and original software implementations are the intellectual property of Gerald Fabre (&ldquo;Fabs&rdquo;)
            and are protected by applicable copyright and intellectual property laws.
          </p>
          <p>
            <strong>Third-Party Intellectual Property & TMDB Attribution:</strong> All movie and television titles, artwork, posters, backdrops, episode descriptions,
            character names, and actor biographies displayed on StreamFlix are the copyrighted property of their respective film studios, television networks,
            producers, and content owners.
          </p>
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 space-y-2 text-xs">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              The Movie Database (TMDB) Notice:
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              This product uses the TMDB API but is not endorsed, certified, or otherwise affiliated with The Movie Database (TMDB).
              All media catalog metadata, posters, and backdrops are sourced via TMDB API endpoints under their applicable terms of service.
            </p>
          </div>
          <p>
            StreamFlix makes no claim of ownership, copyright, or exclusive licensing over third-party motion pictures, series, or promotional media.
            Embedding third-party media does not imply endorsement, affiliation, or that the original distribution was authorized by StreamFlix.
          </p>
        </section>

        {/* Section 5 */}
        <section id="notice-and-takedown" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-rose-400 bg-purple-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-rose-900/50">
              05
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Copyright Infringement Notification & Takedown Procedure
            </h2>
          </div>
          <p>
            StreamFlix respects the intellectual property rights of creators and copyright owners and is committed to responding expeditiously to valid,
            good-faith notices of alleged copyright infringement. Because StreamFlix does not store or host video content directly, rights holders are
            also advised to contact the third-party web host directly to permanently remove the underlying files.
          </p>
          <p>
            If you are a copyright owner or an authorized agent thereof and believe that any link, embed, or reference on StreamFlix infringes upon
            your copyrighted work, you may submit a written notice containing the following information to our designated contact email:
          </p>
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Required Elements for a Valid Takedown Notice:
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-xs">
              <li>
                <strong>Identification of the Copyrighted Work:</strong> A description of the copyrighted work claimed to have been infringed, or a representative list if multiple works are involved.
              </li>
              <li>
                <strong>Identification of the Infringing Material:</strong> The exact URL, title page, or link on StreamFlix where the material or reference is located (e.g., <code>https://streamflixmedia.vercel.app/title/12345</code> or <code>/watch/12345</code>).
              </li>
              <li>
                <strong>Contact Information:</strong> Your full legal name, company or organization, mailing address, telephone number, and active email address.
              </li>
              <li>
                <strong>Good-Faith Statement:</strong> A statement that you have a good-faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
              </li>
              <li>
                <strong>Accuracy & Authority Statement:</strong> A statement made under penalty of perjury that the information in the notification is accurate and that you are the copyright owner or authorized to act on behalf of the owner.
              </li>
              <li>
                <strong>Signature:</strong> A physical or electronic signature of the copyright owner or authorized representative.
              </li>
            </ol>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-rose-950/20 border border-purple-200 dark:border-rose-900/40 flex items-start gap-3">
            <Mail className="w-5 h-5 text-purple-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                Designated Copyright Notice Contact:
              </p>
              <p className="text-zinc-600 dark:text-zinc-300">
                Please email all notices directly to:{" "}
                <a href="mailto:geraldfabre282@gmail.com?subject=StreamFlix%20Copyright%20Notice" className="font-mono font-semibold text-purple-600 dark:text-rose-400 hover:underline">
                  geraldfabre282@gmail.com
                </a>
              </p>
              <p className="text-zinc-500 dark:text-zinc-400">
                Upon receipt of a complete notice meeting the criteria above, StreamFlix will promptly review the inquiry and remove or disable the identified links or embed references.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section id="third-party-services" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-rose-400 bg-purple-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-rose-900/50">
              06
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Third-Party Services, Embeds & External Links
            </h2>
          </div>
          <p>
            StreamFlix relies on external providers and third-party systems to deliver functionality:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Hosting & Cloud Infrastructure:</strong> Hosted on Vercel Inc., providing edge routing, serverless execution, and basic technical request analytics.
            </li>
            <li>
              <strong>Media Metadata:</strong> The Movie Database (TMDB) provides movie descriptions, cast lists, and artwork.
            </li>
            <li>
              <strong>Embedded Media Players:</strong> When a user launches playback, StreamFlix displays an iframe connecting to third-party streaming providers (e.g., 0vidads, ZXC Stream) or loads public sample streams via HLS.js. These third parties control their own servers, advertisements, buffering speeds, and data handling.
            </li>
            <li>
              <strong>External Links:</strong> The website may contain links to external sites (such as TMDB or payment platforms). We do not control and are not responsible for the content, privacy policies, or practices of any third-party websites.
            </li>
          </ul>
          <p>
            Your interactions with third-party providers are governed by those parties&apos; respective terms of service and privacy policies.
            StreamFlix disclaims all liability arising from your interactions with external services or advertisements delivered within embedded iframes.
          </p>
        </section>

        {/* Section 7 */}
        <section id="developer-tips" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-rose-400 bg-purple-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-rose-900/50">
              07
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Voluntary Developer Tipping & Community Feedback
            </h2>
          </div>
          <p>
            StreamFlix offers a &ldquo;Support Dev&rdquo; modal where users may choose to show appreciation for the platform:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Developer Tip Jar:</strong> Users may voluntarily send tips to support server maintenance costs via independent external payment services (GCash or PayPal). Tipping is entirely voluntary and is not a purchase of goods, subscription, or guarantee of uninterrupted service. StreamFlix does not process credit cards or maintain banking credentials on its servers.
            </li>
            <li>
              <strong>Community Feedback & Love Reactions:</strong> Users may submit short text feedback (up to 300 characters) and voluntary nicknames, which are stored in an internal server database. We reserve the right to remove any feedback containing harassment, profanity, spam, or promotional material.
            </li>
          </ul>
        </section>

        {/* Section 8 */}
        <section id="service-modifications" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-rose-400 bg-purple-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-rose-900/50">
              08
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Availability, Modifications & Service Termination
            </h2>
          </div>
          <p>
            We strive to provide a seamless, high-performance viewing interface. However, StreamFlix is provided on an dynamic basis.
            We reserve the right, at our sole discretion, to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Modify, update, or refine user interface elements, server options, or playback features at any time.</li>
            <li>Temporarily suspend website access for maintenance, security patches, or infrastructure upgrades.</li>
            <li>Remove or discontinue specific catalog categories, third-party server options, or features without prior notice.</li>
            <li>Terminate or cease operation of the website entirely at any time without liability.</li>
          </ul>
          <p>
            StreamFlix does not promise continuous, uninterrupted, or error-free availability on every hardware device or browser version.
          </p>
        </section>

        {/* Section 9 */}
        <section id="disclaimers-liability" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-rose-400 bg-purple-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-rose-900/50">
              09
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Warranty Disclaimers & Limitations of Liability
            </h2>
          </div>
          <p className="uppercase text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400">
            Please Read This Section Carefully as it Limits the Legal Liability of the Operator.
          </p>
          <div className="space-y-3 p-5 rounded-2xl bg-zinc-100/80 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 text-xs leading-relaxed">
            <p>
              <strong>&ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; Basis:</strong> STREAMFLIX AND ALL ASSOCIATED SERVICES, FEATURES, METADATA,
              AND EMBEDDED CONTENT ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND,
              WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. TO THE FULLEST EXTENT PERMISSIBLE BY APPLICABLE LAW, THE OPERATOR EXPRESSLY DISCLAIMS
              ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE,
              ACCURACY, NON-INFRINGEMENT, AND FREEDOM FROM COMPUTER VIRUSES OR HARMFUL COMPONENTS.
            </p>
            <p>
              <strong>Third-Party Media Streams:</strong> THE OPERATOR MAKES NO WARRANTIES OR REPRESENTATIONS REGARDING THE QUALITY, CONTINUITY,
              LEGALITY, AUDIO ACCURACY, SUBTITLE PRECISION, OR SECURITY OF THIRD-PARTY EMBEDDED PLAYERS OR EXTERNAL VIDEO SOURCES.
            </p>
            <p>
              <strong>Limitation of Liability:</strong> TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, IN NO EVENT SHALL THE OPERATOR, DEVELOPER,
              OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO
              LOSS OF PROFITS, DATA, USE, GOODWILL, DEVICE MALFUNCTION, OR OTHER INTANGIBLE LOSSES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR
              INABILITY TO USE THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability for incidental or consequential damages.
            In such jurisdictions, liability shall be limited to the minimum extent permitted by mandatory consumer protection laws.
          </p>
        </section>

        {/* Section 10 */}
        <section id="governing-law" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-rose-400 bg-purple-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-rose-900/50">
              10
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Governing Law & Dispute Resolution
            </h2>
          </div>
          <p>
            These Terms of Service and any dispute, controversy, or claim arising out of or relating to your use of StreamFlix shall be governed by
            and construed in accordance with the laws of the <strong>Republic of the Philippines</strong>, without regard to its conflict of law principles.
          </p>
          <p>
            <strong>Informal Resolution First:</strong> In the event of any controversy or dispute, you agree to first contact the operator in good faith at{" "}
            <a href="mailto:geraldfabre282@gmail.com?subject=StreamFlix%20Dispute%20Inquiry" className="text-purple-600 dark:text-rose-400 hover:underline">
              geraldfabre282@gmail.com
            </a>{" "}
            with a detailed description of the issue to allow for an amicable, non-judicial resolution.
          </p>
          <p>
            If a dispute cannot be resolved informally within thirty (30) days, the dispute shall be subject to the exclusive jurisdiction of the competent
            courts of the Republic of the Philippines.
          </p>
        </section>

        {/* Section 11 */}
        <section id="changes-contact" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-rose-400 bg-purple-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md border border-purple-200 dark:border-rose-900/50">
              11
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Modifications to Terms & Contact Information
            </h2>
          </div>
          <p>
            We reserve the right to revise, update, or replace these Terms of Service at any time. Any modifications will become effective immediately upon
            publication on this page, with an updated &ldquo;Last Updated&rdquo; date displayed at the top of this document. Your continued use of the website
            following the posting of updated terms constitutes your constructive acknowledgment and acceptance of those changes.
          </p>
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-600 dark:text-rose-500" />
              <span>Operator & Contact Details</span>
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              For any questions, legal notices, DMCA inquiries, or feedback regarding these Terms of Service, please reach out directly:
            </p>
            <div className="pt-2 text-xs space-y-1 text-zinc-700 dark:text-zinc-300">
              <p><strong>Platform:</strong> StreamFlix Cinema Studio</p>
              <p><strong>Developer / Operator:</strong> Gerald Fabre (&ldquo;Fabs&rdquo;)</p>
              <p><strong>Jurisdiction:</strong> Republic of the Philippines</p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:geraldfabre282@gmail.com?subject=StreamFlix%20Terms%20Inquiry"
                  className="font-mono text-purple-600 dark:text-rose-400 hover:underline"
                >
                  geraldfabre282@gmail.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Back to Top / Footer Navigation */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <Link
          href="/privacy"
          className="text-purple-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <span>View Privacy Policy</span>
          <span>→</span>
        </Link>
        <a
          href="#"
          className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/20 text-zinc-700 dark:text-zinc-200 transition-colors font-semibold"
        >
          Back to Top ↑
        </a>
      </div>
    </div>
  );
}
