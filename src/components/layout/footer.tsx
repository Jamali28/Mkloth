import Link from "next/link";
import { Truck, RefreshCcw, ShieldCheck } from "lucide-react";

import { CATEGORIES } from "@/lib/constants";
import { BrandLogo } from "@/components/layout/brand-logo";

const PERKS = [
  { icon: Truck, title: "Fast Delivery", text: "Nationwide within 3-5 days" },
  { icon: RefreshCcw, title: "Easy Returns", text: "7-day hassle-free exchange" },
  { icon: ShieldCheck, title: "Secure Payments", text: "Cash on Delivery available" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#2C2823] bg-[#11100E] text-[#F5F1E8]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-[#2C2823] pb-12 sm:grid-cols-3">
          {PERKS.map((perk) => (
            <div key={perk.title} className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#C6A15B]/40 text-accent">
                <perk.icon className="size-6" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide">
                  {perk.title}
                </p>
                <p className="text-xs text-[#BDB5A8]">{perk.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandLogo className="text-3xl" />
            <p className="mt-4 max-w-xs text-sm text-[#BDB5A8]">
              Premium t-shirts in three signature cuts — Drop Shoulder, Crop
              and Polo. Heavyweight fabrics, sharp fits, made for the streets.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest">
              Shop
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#BDB5A8]">
              <li>
                <Link href="/shop" className="transition-colors hover:text-[#C6A15B]">
                  All Tees
                </Link>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/collections/${c.slug}`}
                    className="transition-colors hover:text-[#C6A15B]"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#BDB5A8]">
              {[
                { label: "Shop All", href: "/shop" },
                { label: "New Arrivals", href: "/shop?sort=newest&new=1" },
                { label: "Best Sellers", href: "/shop?best=1" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-[#C6A15B]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#BDB5A8]">
              <li>Karachi, Pakistan</li>
              <li>support@example.com</li>
              <li>+92 300 0000000</li>
              <li>Mon – Sat: 10am – 8pm</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#2C2823] pt-6 text-xs text-[#BDB5A8] sm:flex-row">
          <p>
            © {new Date().getFullYear()} MKloth. All rights reserved.
          </p>
          <p>Made for the streets. Crafted for you.</p>
        </div>
      </div>
    </footer>
  );
}
