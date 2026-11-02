import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRM(n: number): string {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-MY').format(n);
}

// Sales WhatsApp — Mr. Kan, 012-667 5762, the same number every WhatsApp
// button on autolabellermalaysia.com uses. wa.me needs the international
// form: country code 60, no leading 0, no spaces or dashes. (The 1-700
// hotline can't receive WhatsApp.) Every site-wide WhatsApp CTA goes
// through whatsappLink(); the contact page also lists each salesperson.
export const WHATSAPP_NUMBER = '60126675762';
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
