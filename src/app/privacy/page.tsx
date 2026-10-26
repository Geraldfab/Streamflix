import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Database,
  Eye,
  EyeOff,
  Cookie,
  Server,
  FileText,
  Mail,
  AlertCircle,
  CheckCircle2,
  Globe,
  Clock,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — StreamFlix Cinema Studio",
  description:
    "Learn how StreamFlix Cinema Studio respects your privacy, manages local browser storage, handles server-side feedback, and complies with the Philippine Data Privacy Act of 2012 (RA 10173).",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  const effectiveDate = "October 26, 2026";
  const lastUpdated = "October 26, 2026";

  const tableOfContents = [
    { id: "introduction", title: "1. Introduction & Privacy Commitment" },
    { id: "information-processed", title: "2. Categories of Information Processed" },
    { id: "browser-storage", title: "3. Browser Local Storage vs. Server Storage" },
    { id: "purposes-lawful-basis", title: "4. Purposes & Lawful Basis (Philippine DPA)" },
    { id: "cookies-tracking", title: "5. Cookies & Tracking Technologies" },
    { id: "third-party-processing", title: "6. Third-Party Services & Embedded Video Players" },
    { id: "data-sharing", title: "7. Data Sharing & Disclosure Practices" },
    { id: "retention-deletion", title: "8. Data Retention, Correction & Deletion" },
    { id: "data-security", title: "9. Technical Safeguards & Security Limitations" },
    { id: "international-transfers", title: "10. International Transfers & Cross-Border Processing" },
    { id: "user-rights", title: "11. Your Privacy Rights Under Philippine Law (RA 10173)" },
    { id: "childrens-privacy", title: "12. Children's Privacy" },
    { id: "policy-updates-contact", title: "13. Policy Updates & Contact Information" },
  ];

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <header className="space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Data Privacy & Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          At StreamFlix Cinema Studio, we prioritize simplicity, privacy, and full transparency. This Privacy Policy
          explains what happens when you use our website, why we store preferences locally on your device, and how
          your rights are safeguarded under the Philippine Data Privacy Act of 2012 (Republic Act No. 10173).
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
      <aside className="mb-12 p-6 rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-zinc-50/70 dark:from-zinc-900/90 dark:via-zinc-900/50 dark:to-zinc-950 border border-emerald-200/70 dark:border-emerald-500/20 shadow-sm space-y-3">
        <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Privacy at a Glance</span>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-600 dark:text-zinc-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Zero User Accounts:</strong> No signups, no passwords, and no email verification required.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Device-Only Storage:</strong> Watchlists, watch progress, and history remain exclusively in your browser.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>No Ad Tracking:</strong> We do not set first-party marketing cookies or sell your personal data.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span><strong>Philippine DPA Compliant:</strong> Committed to RA 10173 standards and National Privacy Commission guidance.</span>
          </li>
        </ul>
      </aside>

      {/* Table of Contents */}
      <nav aria-label="Table of Contents" className="mb-12 p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Table of Contents</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {tableOfContents.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-1 flex items-center gap-1.5"
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
        <section id="introduction" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              01
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Introduction & Privacy Commitment
            </h2>
          </div>
          <p>
            <strong>StreamFlix Cinema Studio</strong> (&ldquo;StreamFlix&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is an
            independent web application created and maintained by software developer Gerald Fabre (&ldquo;Fabs&rdquo;), operating from the
            Republic of the Philippines.
          </p>
          <p>
            We are dedicated to safeguarding your privacy and ensuring transparency in all software operations.
            This Privacy Policy sets forth how information relating to you is handled when you visit our website at{" "}
            <a href="https://streamflixmedia.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline underline-offset-2 hover:text-emerald-700 dark:hover:text-emerald-300">
              https://streamflixmedia.vercel.app/
            </a>.
          </p>
          <p>
            Where applicable, our data processing practices are governed by the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong>,
            its Implementing Rules and Regulations (IRR), and issuance directives of the <strong>National Privacy Commission (NPC)</strong> of the Philippines.
          </p>
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
            <p><strong>Entity & Operational Notice:</strong></p>
            <p>
              StreamFlix is operated as an individual developer project and is not a registered commercial corporation or legal partnership.
              There is no separate commercial board or formal Data Protection Officer (DPO). The individual developer handles all privacy inquiries,
              data subject rights requests, and security management directly.
            </p>
          </div>
        </section>

        {/* Section 2 */}
        <section id="information-processed" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              02
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Categories of Information Processed
            </h2>
          </div>
          <p>
            We adhere strictly to the principle of <em>data minimization</em>. We do not collect personal data that is unnecessary for the basic
            operation of our catalog browsing and viewing interface. The categories of information processed are:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-sm space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>1. Locally Stored Client Data (Stored Exclusively on Your Device)</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                To provide features like watchlists and continue-watching, StreamFlix saves data directly to your browser&apos;s <code>localStorage</code>.
                <strong> This data never leaves your device and is never transmitted to our servers:</strong>
              </p>
              <ul className="list-disc pl-5 text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
                <li><code>streamflix_watchlist</code>: Media items you have added to your list.</li>
                <li><code>streamflix_continue_watching</code>: Playback progress timestamps, duration percentages, and active season/episode.</li>
                <li><code>streamflix_history</code>: Chronological log of titles you have previously played.</li>
                <li><code>streamflix_preferences</code>: Player server choice, autoplay toggles, audio/subtitle language preferences, and subtitle styling.</li>
                <li><code>streamflix_recent_searches</code>: Recent search queries entered into the search modal.</li>
                <li><code>streamflix_theme</code>: Visual theme selection (dark, light, or system sync).</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-sm space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Server className="w-4 h-4 text-purple-600 dark:text-rose-400" />
                <span>2. Voluntary Server-Side Feedback & Reaction Data</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                When you voluntarily interact with the &ldquo;Support Dev&rdquo; feature, the following data is transmitted to and saved in our server data file:
              </p>
              <ul className="list-disc pl-5 text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
                <li><strong>Author Nickname:</strong> An optional display name you supply (defaults to &ldquo;Anonymous Viewer&rdquo; if blank; max 40 characters).</li>
                <li><strong>Feedback Message:</strong> The message text you submit (max 300 characters).</li>
                <li><strong>Avatar Emoji:</strong> An emoji selected to represent your reaction.</li>
                <li><strong>Timestamp:</strong> The UTC date and time the feedback was submitted.</li>
                <li><strong>Love/Heart Counter:</strong> Aggregated counter incremented when users send heart reactions.</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-sm space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>3. Technical Network & Request Information (Vercel Infrastructure)</span>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-300">
                When your browser requests a web page from StreamFlix, our hosting provider (Vercel) automatically processes standard HTTP headers:
              </p>
              <ul className="list-disc pl-5 text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
                <li>Internet Protocol (IP) address.</li>
                <li>Browser type, version, and device operating system (User-Agent string).</li>
                <li>Date, time, requested URL path, and HTTP status response codes.</li>
                <li>Referring URL.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section id="browser-storage" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              03
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Browser Local Storage vs. Server Storage
            </h2>
          </div>
          <p>
            It is critical to distinguish between <em>local browser storage</em> and <em>server-side database storage</em>:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-zinc-200 dark:border-white/10 rounded-2xl overflow-hidden">
              <thead className="bg-zinc-100 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 font-bold">
                <tr>
                  <th className="p-3 border border-zinc-200 dark:border-white/10">Data Category</th>
                  <th className="p-3 border border-zinc-200 dark:border-white/10">Storage Location</th>
                  <th className="p-3 border border-zinc-200 dark:border-white/10">Accessible By StreamFlix Server?</th>
                  <th className="p-3 border border-zinc-200 dark:border-white/10">User Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-white/10 text-zinc-600 dark:text-zinc-300">
                <tr>
                  <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">Watchlist & Watch History</td>
                  <td className="p-3">Client Browser <code>localStorage</code></td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">NO (Never transmitted)</td>
                  <td className="p-3">Clear via History page or browser settings</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">Player Preferences & Theme</td>
                  <td className="p-3">Client Browser <code>localStorage</code></td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-semibold">NO (Never transmitted)</td>
                  <td className="p-3">Reset via Settings page or browser settings</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">Community Feedback Messages</td>
                  <td className="p-3">Server JSON file (<code>support-feedback.json</code>)</td>
                  <td className="p-3 text-amber-600 dark:text-amber-400 font-semibold">YES (Publicly displayed)</td>
                  <td className="p-3">Request deletion via email</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">Web Traffic & Server Logs</td>
                  <td className="p-3">Vercel Edge Network</td>
                  <td className="p-3 text-zinc-500 font-semibold">Vercel Infrastructure Only</td>
                  <td className="p-3">Automatic 30-day purge by Vercel</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 */}
        <section id="purposes-lawful-basis" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              04
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Purposes & Lawful Basis for Processing (Philippine DPA)
            </h2>
          </div>
          <p>
            Under Section 12 of the Philippine Data Privacy Act of 2012 (RA 10173), the processing of information is permitted only when supported
            by a recognized lawful basis:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Legitimate Interests (Sec. 12(f)):</strong> We process technical request headers, IP addresses, and aggregate visitor analytics to maintain website functionality, secure our infrastructure against malicious attacks or scraping, and optimize page load performance.
            </li>
            <li>
              <strong>Consent (Sec. 12(a)):</strong> When you voluntarily submit a message or nickname through our &ldquo;Support Dev&rdquo; feedback form, you give your explicit consent for that feedback and nickname to be stored and displayed publicly on the community feedback rail.
            </li>
            <li>
              <strong>Performance of Service (Sec. 12(b)):</strong> Saving user preferences and watch progress in your browser&apos;s local storage is initiated by your direct interaction with the platform to fulfill your request to resume playback or remember customized settings.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section id="cookies-tracking" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              05
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Cookies & Tracking Technologies
            </h2>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 space-y-2 text-xs">
            <p className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Cookie className="w-4 h-4 text-amber-500" />
              <span>First-Party Cookies Statement</span>
            </p>
            <p className="text-zinc-600 dark:text-zinc-300">
              <strong>StreamFlix DOES NOT set first-party tracking cookies, advertising identifiers, or persistent user session cookies on your device.</strong>
              All client-side preferences and history rely strictly on standard HTML5 <code>localStorage</code>, which remains on your machine and cannot be read across different domains.
            </p>
          </div>
          <p>
            <strong>Vercel Analytics:</strong> StreamFlix integrates <code>@vercel/analytics</code>, an audience measurement tool engineered by our hosting provider.
            Vercel Analytics operates without collecting personally identifiable information (PII), does not use persistent cross-site tracking cookies,
            and records only anonymized aggregate metrics (such as total pageviews, country of origin, and referral paths).
          </p>
          <p>
            <strong>Third-Party Embedded Cookies:</strong> When you activate a third-party streaming server inside our video player (e.g., 0vidads or ZXC Stream),
            the embedded provider loads content from its own external domain via an <code>&lt;iframe&gt;</code>. These independent providers may attempt to set their
            own third-party cookies or local storage. You can prevent third-party tracking by enabling &ldquo;Block third-party cookies&rdquo; in your web browser settings.
          </p>
        </section>

        {/* Section 6 */}
        <section id="third-party-processing" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              06
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Third-Party Services & Embedded Video Players
            </h2>
          </div>
          <p>
            When utilizing StreamFlix, certain data flows directly between your web browser and independent third-party services:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Vercel Inc. (Hosting & Edge CDN):</strong> Hosts the website application code, routes user requests, and provides DDoS mitigation. (Vercel Privacy Policy: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">vercel.com/legal/privacy-policy</a>).
            </li>
            <li>
              <strong>The Movie Database (TMDB):</strong> Provides title descriptions, ratings, episode details, and poster artwork. TMDB receives search and discovery API calls made by our server to populate catalog items. (TMDB Terms: <a href="https://www.themoviedb.org/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">themoviedb.org/terms-of-use</a>).
            </li>
            <li>
              <strong>Third-Party Video Streaming Providers (0vidads, ZXC Stream):</strong> When you click play, your browser establishes a direct network connection to external video host domains. These third parties independently process your IP address, browser metadata, and may serve video streams, subtitles, or advertisements outside our control.
            </li>
            <li>
              <strong>Payment Providers (GCash / Mynt & PayPal):</strong> When using the developer tip jar, transactions take place entirely on external payment platforms. StreamFlix never accesses or receives your bank account details, credit card numbers, or billing addresses.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section id="data-sharing" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              07
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Data Sharing & Disclosure Practices
            </h2>
          </div>
          <p>
            <strong>We DO NOT sell, rent, monetize, or trade your personal information.</strong>
          </p>
          <p>
            Information may only be disclosed under the following narrowly defined circumstances:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Service Providers:</strong> Sharing technical routing data with infrastructure providers (such as Vercel) strictly to the extent necessary to deliver the web application.
            </li>
            <li>
              <strong>Legal Compliance:</strong> If required to do so by applicable Philippine laws, valid subpoena, court order, or official directive issued by a competent government authority or the National Privacy Commission (NPC).
            </li>
            <li>
              <strong>Protection of Rights & Safety:</strong> To investigate, prevent, or take action regarding illegal activities, suspected fraud, cyberattacks, or threats to the physical safety of any person.
            </li>
          </ul>
        </section>

        {/* Section 8 */}
        <section id="retention-deletion" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              08
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Data Retention, Correction & Deletion
            </h2>
          </div>
          <p>
            We retain information only for as long as necessary to fulfill the specific purposes outlined in this policy:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Local Browser Storage:</strong> Data stored in your browser (watchlist, history, preferences) remains on your machine indefinitely until you manually clear it. You can purge this data at any time via the &ldquo;Clear Watch History&rdquo; button on our History page, the &ldquo;Reset All Preferences&rdquo; button on Settings, or by clearing your browser cache and cookies.
            </li>
            <li>
              <strong>Server-Side Feedback Data:</strong> Submitted feedback messages are retained in our server data file indefinitely to display community support. If you wish to have a feedback comment deleted or corrected, please email us with your author name and the text of your submission.
            </li>
            <li>
              <strong>Technical Server Logs:</strong> Standard server access logs on Vercel are automatically overwritten and purged according to Vercel&apos;s standard data retention schedule (typically 30 days or less).
            </li>
          </ul>
        </section>

        {/* Section 9 */}
        <section id="data-security" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              09
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Technical Safeguards & Security Limitations
            </h2>
          </div>
          <p>
            We implement reasonable organizational and technical safeguards designed to protect personal information against unauthorized access,
            accidental loss, or unlawful processing:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>HTTPS / TLS Encryption:</strong> All communications between your web browser and StreamFlix are encrypted in transit using industry-standard Transport Layer Security (TLS/SSL).
            </li>
            <li>
              <strong>No Credential Storage:</strong> Because StreamFlix requires no user accounts, passwords, or credit card numbers, there is no risk of password leaks or credential database exposure.
            </li>
            <li>
              <strong>Server-Side Input Sanitization:</strong> Feedback messages and author fields are strictly truncated, sanitized, and validated to prevent script injection and malicious payload execution.
            </li>
          </ul>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
            Disclaimer: While we take reasonable steps to secure the platform, no method of transmission over the internet or electronic storage
            is 100% impenetrable. We cannot warrant or guarantee absolute security against all potential cyber threats.
          </p>
        </section>

        {/* Section 10 */}
        <section id="international-transfers" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              10
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              International Transfers & Cross-Border Processing
            </h2>
          </div>
          <p>
            StreamFlix is operated by an individual located in the Philippines. However, our web infrastructure is hosted globally through Vercel Inc.,
            whose edge nodes and server clusters are located in the United States and internationally. Furthermore, TMDB API endpoints and third-party
            video streaming servers are situated outside the Philippines.
          </p>
          <p>
            By using the website, you acknowledge that technical connection information and voluntary feedback may be processed in countries
            outside of your jurisdiction, where data protection laws may differ from those of the Republic of the Philippines.
          </p>
        </section>

        {/* Section 11 */}
        <section id="user-rights" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              11
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Your Privacy Rights Under Philippine Law (RA 10173)
            </h2>
          </div>
          <p>
            As a data subject under the Philippine Data Privacy Act of 2012 (Republic Act No. 10173), you are entitled to statutory rights regarding your personal information:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 space-y-1">
              <strong className="text-zinc-900 dark:text-zinc-100">1. Right to Be Informed:</strong>
              <p className="text-zinc-600 dark:text-zinc-400">The right to know whether personal data pertaining to you shall be, are being, or have been processed.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 space-y-1">
              <strong className="text-zinc-900 dark:text-zinc-100">2. Right to Access:</strong>
              <p className="text-zinc-600 dark:text-zinc-400">The right to reasonable access to your personal data that we maintain.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 space-y-1">
              <strong className="text-zinc-900 dark:text-zinc-100">3. Right to Rectification:</strong>
              <p className="text-zinc-600 dark:text-zinc-400">The right to dispute inaccuracies or errors in your personal data and have them corrected.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 space-y-1">
              <strong className="text-zinc-900 dark:text-zinc-100">4. Right to Erasure or Blocking:</strong>
              <p className="text-zinc-600 dark:text-zinc-400">The right to suspend, withdraw, or order the blocking, removal, or destruction of your personal data.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 space-y-1">
              <strong className="text-zinc-900 dark:text-zinc-100">5. Right to Object:</strong>
              <p className="text-zinc-600 dark:text-zinc-400">The right to object to the processing of your personal data based on consent or legitimate interest.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 space-y-1">
              <strong className="text-zinc-900 dark:text-zinc-100">6. Right to Data Portability:</strong>
              <p className="text-zinc-600 dark:text-zinc-400">The right to obtain an electronic copy of your data in a structured, commonly used format.</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 space-y-2 text-xs">
            <p className="font-bold text-zinc-900 dark:text-zinc-100">
              National Privacy Commission (NPC) Complaint Mechanism:
            </p>
            <p className="text-zinc-600 dark:text-zinc-400">
              If you feel that your personal information has been improperly handled or your rights have been violated, you have the right under
              Section 16(f) of the DPA to lodge a complaint with the National Privacy Commission of the Philippines:
            </p>
            <p className="text-zinc-600 dark:text-zinc-300">
              <strong>Website:</strong> <a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">https://privacy.gov.ph</a><br />
              <strong>Email:</strong> <a href="mailto:complaints@privacy.gov.ph" className="text-emerald-600 dark:text-emerald-400 hover:underline">complaints@privacy.gov.ph</a> | <a href="mailto:info@privacy.gov.ph" className="text-emerald-600 dark:text-emerald-400 hover:underline">info@privacy.gov.ph</a><br />
              <strong>Address:</strong> 5th Floor, Delegation Building, Philippine International Convention Center (PICC) Complex, Roxas Boulevard, Pasay City, Metro Manila 1307.
            </p>
          </div>
          <p>
            <strong>How to Exercise Your Rights With Us:</strong> To exercise any of your statutory rights, please send an email to{" "}
            <a href="mailto:geraldfabre282@gmail.com?subject=StreamFlix%20Privacy%20Rights%20Request" className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline">
              geraldfabre282@gmail.com
            </a>{" "}
            with the subject line &ldquo;Data Privacy Request&rdquo;. We will respond within thirty (30) days without undue delay.
          </p>
        </section>

        {/* Section 12 */}
        <section id="childrens-privacy" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              12
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Children&apos;s Privacy
            </h2>
          </div>
          <p>
            StreamFlix is designed for a general audience. We do not knowingly solicit, collect, or process personal information from children
            under thirteen (13) years of age (or under eighteen (18) years without parental consent).
          </p>
          <p>
            Because StreamFlix does not require user accounts or registration, we do not verify user ages. If you are a parent or legal guardian
            and believe that your child has submitted personal information through our feedback form, please contact us at{" "}
            <a href="mailto:geraldfabre282@gmail.com?subject=Children%20Privacy%20Inquiry" className="text-emerald-600 dark:text-emerald-400 hover:underline">
              geraldfabre282@gmail.com
            </a>{" "}
            and we will take immediate steps to permanently delete that information from our records.
          </p>
        </section>

        {/* Section 13 */}
        <section id="policy-updates-contact" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              13
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Policy Updates & Contact Information
            </h2>
          </div>
          <p>
            We may periodically revise or update this Privacy Policy to reflect changes in our software architecture, third-party integrations,
            or legal requirements. All updates will be published directly to this page with an updated &ldquo;Last Updated&rdquo; revision date.
            We encourage you to review this page periodically to stay informed about our data handling practices.
          </p>
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-white/10 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Contact the Developer & Privacy Handler</span>
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              For any questions, data subject requests, or privacy concerns regarding StreamFlix, please contact us directly:
            </p>
            <div className="pt-2 text-xs space-y-1 text-zinc-700 dark:text-zinc-300">
              <p><strong>Platform:</strong> StreamFlix Cinema Studio</p>
              <p><strong>Developer & Privacy Contact:</strong> Gerald Fabre (&ldquo;Fabs&rdquo;)</p>
              <p><strong>Location:</strong> Republic of the Philippines</p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:geraldfabre282@gmail.com?subject=StreamFlix%20Privacy%20Inquiry"
                  className="font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
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
          href="/terms"
          className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <span>← View Terms of Service</span>
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
