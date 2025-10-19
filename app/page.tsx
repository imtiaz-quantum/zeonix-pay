// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "./lib/authOptions";

// export default async function HomePage() {
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     redirect("/login");
//   }

//   // Optional role-based redirect from "/"
//   switch (session.user.role) {
//     case "admin":
//       redirect("/admin/dashboard");
//     case "staff":
//       redirect("/staff/dashboard");
//     default:
//       redirect("/merchant//dashboard");
//   }
// }

"use client"
export const dynamic = "force-static";
// Payment Gateway Landing Page – Brand color #674cc4
// Next.js (App Router), React, Tailwind CSS, Framer Motion, lucide-react
// Save as: app/payment-gateway/page.tsx
// Deps: npm i framer-motion lucide-react


declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Banknote,
  Gauge,
  Globe,
  ArrowRight,
  Check,
  Lock,
  BarChart3,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaFacebookMessenger } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const BRAND = {
  primary: "#674cc4",
  primaryHover: "#583bb6",
  primarySoft: "#8a74e6",
  surface: "#ffffff",
  tint100: "#f5f2ff",
  tint200: "#efeaff",
  tint300: "#e9e3ff",
};

const style: React.CSSProperties = {
  '--brand': BRAND.primary,
  '--brand-soft': BRAND.primarySoft,
  '--ring': 'rgba(103,76,196,0.15)',
};

const techStacks = [
  { name: "Next.js", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original-wordmark.svg" },
  { name: "React", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" },
  { name: "Node", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" },
  { name: "Laravel", logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/laravel/laravel-plain-wordmark.svg" },
  { name: "Shopify", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Shopify_logo_2018.svg" },
  { name: "WooCommerce", logo: "https://woocommerce.com/wp-content/themes/woo/images/logo-woocommerce.svg" },
];

const Container: React.FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
  className = "",
}) => (
  <div className={`mx-auto w-full max-w-7xl px-6 md:px-10 ${className}`}>{children}</div>
);

const SectionTitle: React.FC<{ eyebrow?: string; title: string; subtitle?: string }> = ({ eyebrow, title, subtitle }) => (
  <div className="mx-auto max-w-3xl text-center">
    {eyebrow && (
      <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-700 backdrop-blur">
        <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
      </p>
    )}
    <h2 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 text-balance text-gray-600">
        {subtitle}
      </p>
    )}
  </div>
);

const Badge: React.FC<React.PropsWithChildren> = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm backdrop-blur">
    {children}
  </span>
);

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 text-center shadow-sm backdrop-blur">
    <div className="text-2xl font-semibold text-gray-900">{value}</div>
    <div className="mt-1 text-sm text-gray-600">{label}</div>
  </div>
);

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
}> = ({ icon, title, desc }) => (
  <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-sm text-gray-600">{desc}</p>
    <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 ring-1 ring-[color:var(--ring,#0000)] transition group-hover:opacity-100" />
  </div>
);

const CheckItem: React.FC<React.PropsWithChildren> = ({ children }) => (
  <li className="flex items-start gap-3 text-sm text-gray-700">
    <Check className="mt-0.5 h-4 w-4 flex-none text-[color:var(--brand,#674cc4)]" />
    <span>{children}</span>
  </li>
);

export default function PaymentGatewayLanding() {
  return (
    <div
      className="relative min-h-screen bg-gradient-to-b from-white to-gray-50"
      style={style}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full" style={{ backgroundColor: `${BRAND.primary}26`, filter: "blur(36px)" }} />
        <div className="absolute right-[-10%] top-40 h-72 w-72 rounded-full" style={{ backgroundColor: `${BRAND.primarySoft}33`, filter: "blur(36px)" }} />
        <div className="absolute bottom-[-10%] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full" style={{ backgroundColor: `#d6ccff66`, filter: "blur(36px)" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-100/80 bg-white/70 backdrop-blur">
        <Container className="flex h-16 items-center justify-between">
          <div className={`p-1 rounded-sm text-blue-600 text-3xl`}>
            <Image src="/zeonix-logo.png" width={150} height={100} alt="zeonix-logo" />
          </div>
          <nav className="hidden items-center gap-6 text-sm text-gray-700 md:flex">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#pricing" className="hover:text-gray-900">Pricing</a>
            <a href="#integrations" className="hover:text-gray-900">Integrations</a>
            <a href="#faq" className="hover:text-gray-900">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#demo"
              className="hidden rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 md:block"
            >
              Book a demo
            </a>
            <a
              href="#signup"
              className="rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm"
              style={{ backgroundColor: BRAND.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.primary)}
            >
              Get started
            </a>
          </div>
        </Container>
      </header>

      {/* Hero */}
      <section className="relative">
        <Container className="grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="order-2 md:order-1">
            <Badge>
              <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--brand)]" />
              PCI DSS Level 1 · 99.99% uptime
            </Badge>
            <h1 className="mt-4 text-pretty text-4xl font-semibold leading-tight text-gray-900 md:text-5xl">
              One Payment Gateway for Bangladesh—
              <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${BRAND.primary}, ${BRAND.primarySoft})` }}>
                built for scale
              </span>
            </h1>
            <p className="mt-4 text-balance text-gray-600">
              Accept cards, mobile wallets, EMI, and bank transfers with instant checkout,
              intelligent fraud protection, and next‑day settlements. Built for SaaS,
              ecommerce, and high‑growth startups in Bangladesh.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#signup"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-sm"
                style={{ backgroundColor: BRAND.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.primaryHover)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.primary)}
              >
                Start for free <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#docs"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
              >
                View docs <LinkIcon className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 md:max-w-xl">
              <Stat value="1500+" label="Businesses onboarded" />
              <Stat value="BDT 30B+" label="Processed annually" />
              <Stat value="< 300ms" label="Avg. auth time" />
            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <Image
              src="/Home_page_illustration.png"
              alt="Home page illustration"
              width={600}   // adjust to your image’s natural size
              height={400}  // adjust to your image’s natural size
              className="w-full h-auto"
            />
          </motion.div>


        </Container>
      </section>

      {/* Logos */}
      <section>
        <Container className="py-6 md:py-10">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-70">
            <Image src="/bkash-wide.png" width={150} height={100} alt="zeonix-logo" />
            <Image src="/bkash-wide.png" width={150} height={100} alt="zeonix-logo" />
            <Image src="/nagad-wide.png" width={150} height={100} alt="zeonix-logo" />
            <Image src="/rocket-wide.png" width={150} height={100} alt="zeonix-logo" />
            <Image src="/binance-wide.png" width={150} height={100} alt="zeonix-logo" />
          </div>
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24">
        <Container className="py-16 md:py-24">
          <SectionTitle eyebrow="Why PaySwift" title="Everything you need to accept payments in Bangladesh" subtitle="From card tokens to mobile wallets and EMI, PaySwift brings a unified, developer‑friendly API and dashboard with bank‑grade security." />

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard icon={<CreditCard className="h-5 w-5" />} title="Cards & 3DS" desc="Visa, MasterCard, AmEx with automatic 3D Secure and intelligent retries for higher auth rates." />
            <FeatureCard icon={<Smartphone className="h-5 w-5" />} title="Mobile Wallets" desc="bKash, Nagad, Rocket & more with one‑click checkout and deep links." />
            <FeatureCard icon={<Banknote className="h-5 w-5" />} title="EMI & Bank Transfer" desc="Offer flexible EMI plans and instant bank transfers with real‑time status updates." />
            <FeatureCard icon={<ShieldCheck className="h-5 w-5" />} title="Fraud & Risk" desc="Machine‑learning risk engine, velocity limits, device fingerprinting, and rule builder." />
            <FeatureCard icon={<Gauge className="h-5 w-5" />} title="Payouts & Settlement" desc="Next‑day settlements (T+1) with auto reconciliation and detailed statements." />
            <FeatureCard icon={<Globe className="h-5 w-5" />} title="Global Ready" desc="Multi‑currency support, localized checkout, and webhooks for any stack." />
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section>
        <Container className="py-16 md:py-24">
          <SectionTitle eyebrow="How it works" title="Go live in days, not months" subtitle="Simple onboarding, drop‑in checkout, and clear pricing keep you focused on growth." />
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {["Create account", "Connect methods", "Start accepting"].map((t, i) => (
              <div key={t} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[color:var(--brand)]">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{t}</h3>
                <p className="mt-2 text-sm text-gray-600">
                  {i === 0 && "Submit KYC and get sandbox access instantly from your dashboard."}
                  {i === 1 && "Enable cards, wallets, EMI, and bank transfer with toggles—no new contracts."}
                  {i === 2 && "Use hosted checkout or SDKs. Track performance in real‑time analytics."}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Integrations */}
      <section id="integrations" className="scroll-mt-24">
        <Container className="py-16 md:py-24">
          <SectionTitle eyebrow="Integrations" title="Works with your stack" subtitle="Pre‑built plugins and SDKs for popular platforms, plus a clean REST API." />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 justify-center items-center mx-auto">
            <Image src="/python-wide.png" width={150} height={200} alt="zeonix-logo" />
            <Image src="/node-wide.png" width={150} height={200} alt="zeonix-logo" />
            <Image src="/laravel-wide.png" width={150} height={200} alt="zeonix-logo" />
            <Image src="/wordpress-wide.png" width={150} height={200} alt="zeonix-logo" />
            <Image src="/PHP-logo.svg" width={150} height={200} alt="zeonix-logo" />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-700">
            <Badge>
              <LinkIcon className="h-4 w-4 text-[color:var(--brand)]" /> REST & Webhooks
            </Badge>
            <Badge>
              <Lock className="h-4 w-4 text-[color:var(--brand)]" /> OAuth & API Keys
            </Badge>
            <Badge>
              <BarChart3 className="h-4 w-4 text-[color:var(--brand)]" /> Realtime Analytics
            </Badge>
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-24">
        <Container className="py-16 md:py-24">
          <SectionTitle eyebrow="Pricing" title="Simple, transparent rates" subtitle="No setup fees. No hidden charges. Volume discounts available." />
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { name: "Startup", price: "2.5% + BDT 5", points: ["Cards & wallets", "Hosted checkout", "Email support"], cta: "Start now" },
              { name: "Growth", price: "2.2% + BDT 3", points: ["All methods incl. EMI", "Advanced risk + webhooks", "Priority support"], cta: "Upgrade" },
              { name: "Enterprise", price: "Custom", points: ["Dedicated manager", "T+1 settlement", "SLA & SSO"], cta: "Contact sales" },
            ].map((tier, i) => (
              <div key={tier.name} className={`relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${i === 1 ? "ring-2" : ""}`} style={{ boxShadow: i === 1 ? `0 0 0 2px ${BRAND.primary}` : undefined }}>
                {i === 1 && (
                  <span className="absolute right-4 top-4 rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: BRAND.primary }}>
                    Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
          {/*       <p className="mt-2 text-2xl font-semibold text-gray-900">{tier.price}</p> */}
                <ul className="mt-4 grid gap-2">
                  {tier.points.map((p) => (
                    <CheckItem key={p}>{p}</CheckItem>
                  ))}
                </ul>
                <a
                  href="#signup"
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm ${i === 1 ? "text-white" : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-50"}`}
                  style={i === 1 ? { backgroundColor: BRAND.primary } : undefined}
                  onMouseEnter={(e) => {
                    if (i === 1) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = BRAND.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    if (i === 1) (e.currentTarget as HTMLAnchorElement).style.backgroundColor = BRAND.primary;
                  }}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-gray-600">* Interchange, network, and tax/VAT may apply. Contact us for NGO/edu pricing.</p>
        </Container>
      </section>

      {/* Compliance & Security */}
      <section>
        <Container className="py-16 md:py-24">
          <div className="grid grid-cols-1 items-center gap-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:grid-cols-2">
            <div>
              <SectionTitle eyebrow="Compliance" title="Bank‑grade security by default" subtitle="PCI DSS Level 1, tokenization, 3D Secure, and data residency to meet Bangladesh compliance." />
              <ul className="mt-6 grid gap-2">
                <CheckItem>PCI DSS Level 1 • Quarterly ASV scans</CheckItem>
                <CheckItem>Tokenization & vaulting • PAN never touches your servers</CheckItem>
                <CheckItem>3D Secure with step‑up authentication</CheckItem>
                <CheckItem>Encrypted at rest (AES‑256) and in transit (TLS 1.3)</CheckItem>
              </ul>
            </div>
            <div className="grid gap-3 md:pl-8">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" style={{ color: BRAND.primary }} />
                    Tokenized charge • **** 4242
                  </div>
                  <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: BRAND.tint300, color: BRAND.primarySoft }}>Approved</span>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" style={{ color: BRAND.primary }} />
                    3D Secure challenge completed
                  </div>
                  <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: BRAND.tint200, color: BRAND.primary }}>3DS</span>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" style={{ color: BRAND.primary }} />
                    Risk score: Low • 0.07
                  </div>
                  <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: BRAND.tint100, color: BRAND.primarySoft }}>ML</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section>
        <Container className="py-16 md:py-24">
          <SectionTitle eyebrow="Loved by builders" title="What our customers say" subtitle="From D2C brands to subscription apps, teams switch to PaySwift for reliability and support." />
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { quote: "We switched in a week. Auth rates improved by 4% and settlements are finally predictable.", author: "Tanjil, CTO @ ShopNex" },
              { quote: "The drop‑in checkout and webhooks saved weeks. The dashboard is clean and fast.", author: "Nafisa, PM @ Taskly" },
              { quote: "Their support is exceptional. EMI and wallets boosted our conversions.", author: "Rahim, Founder @ WearBD" },
            ].map((t) => (
              <div key={t.author} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-800">“{t.quote}”</p>
                <p className="mt-4 text-xs font-medium text-gray-600">{t.author}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-24">
        <Container className="py-16 md:py-24">
          <SectionTitle eyebrow="FAQ" title="Answers, upfront" subtitle="Short, clear responses to the most common questions." />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
            {[
              { q: "How fast can we go live?", a: "Most teams integrate in 3–5 days using our hosted checkout and SDKs. Enterprise onboarding is available." },
              { q: "Do you support EMI and wallets?", a: "Yes—EMI plans with major banks and mobile wallets like bKash, Nagad, Rocket, and more." },
              { q: "When do settlements happen?", a: "T+1 for domestic methods and T+2/3 for cross‑border, deposited directly to your bank account." },
              { q: "Is there a sandbox?", a: "Absolutely. Create an account and switch to Sandbox mode from the dashboard." },
            ].map((item) => (
              <details key={item.q} className="group open:rounded-b-none">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-medium text-gray-900">
                  {item.q}
                  <span className="text-[color:var(--brand)] transition-transform group-open:rotate-180">▾</span>
                </summary>
                <div className="px-5 pb-5 pt-0 text-sm text-gray-600">{item.a}</div>
                <div className="h-px bg-gray-200" />
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section >
        <Container className="pb-20 pt-10 md:pb-28">
          <div className="text-center gap-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm ">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-gray-900">Ready to level‑up your checkout?</h3>
              <p className="mt-2 text-sm text-gray-600">Create an account in minutes. No credit card required.</p>
              <div className="flex gap-6 text-center justify-center mt-8">
                <Link
                  href="https://wa.me/15793008485"
                  target="_blank"
                  className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 shadow-sm transition hover:shadow-md hover:scale-105"
                >
                  <IoLogoWhatsapp className="text-green-500 text-2xl" />
                  <span className="font-medium text-green-700">+15793008485</span>
                </Link>
                {/*                 <div
                  className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 shadow-sm transition hover:shadow-md hover:scale-105 cursor-pointer"
                >
                  <FaFacebookMessenger className="text-blue-500 text-2xl" />
                  <span className="font-medium text-blue-700">username</span>
                </div> */}
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white/80">
        <Container className="flex flex-col items-center justify-between gap-4 py-8 text-sm text-gray-600 md:flex-row">
          <div className="flex items-center gap-2 text-gray-800">
            <div className="grid h-8 w-8 place-items-center rounded-xl border border-gray-200 bg-white" style={{ color: BRAND.primary }}>
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="font-semibold">ZeonixPay</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#" className="hover:text-gray-900">Docs</a>
            <a href="#" className="hover:text-gray-900">Status</a>
            <a href="#" className="hover:text-gray-900">Security</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div>
          <p className="text-xs">© {new Date().getFullYear()} ZeonixPay. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}
