import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export function InstagramIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function TwitterXIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.676.15-.2.301-.776.978-.951 1.178-.175.201-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.675-2.085-.175-.301-.019-.464.132-.614.135-.135.301-.351.451-.526.15-.175.2-.301.301-.501.101-.201.05-.376-.025-.526-.075-.15-.676-1.629-.926-2.23-.244-.585-.492-.506-.676-.515-.175-.009-.376-.01-.577-.01-.201 0-.527.075-.802.376s-1.053 1.028-1.053 2.507c0 1.479 1.078 2.908 1.228 3.109.15.201 2.122 3.24 5.141 4.543.718.31 1.279.496 1.716.635.721.23 1.378.198 1.897.12.578-.087 1.78-.727 2.03-1.429.251-.702.251-1.304.175-1.429-.075-.125-.276-.201-.577-.351zM12.04 2C6.536 2 2.07 6.466 2.07 11.97c0 1.876.52 3.633 1.423 5.138L2 22l5.053-1.453c1.453.829 3.13 1.393 4.987 1.393 5.504 0 9.97-4.466 9.97-9.97C22.01 6.466 17.544 2 12.04 2z" />
    </svg>
  );
}

export function TikTokIcon({ className = '', size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.29 8.29 0 0 0 4.83 1.52V6.77a4.84 4.84 0 0 1-1.06-.08z" />
    </svg>
  );
}

export function getSocialIcon(name: string, size = 18) {
  const lower = name.toLowerCase();
  if (lower.includes('insta')) return <InstagramIcon size={size} />;
  if (lower.includes('twitter') || lower === 'x') return <TwitterXIcon size={size} />;
  if (lower.includes('whats') || lower === 'wa') return <WhatsAppIcon size={size} />;
  if (lower.includes('tik')) return <TikTokIcon size={size} />;
  return <InstagramIcon size={size} />;
}
