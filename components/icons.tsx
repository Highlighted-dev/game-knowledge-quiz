import React from "react";

export const IconABCD = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="12" cy="19" r="2.5" />
    <circle cx="5" cy="12" r="2.5" />
    <circle cx="19" cy="12" r="2.5" />
    <path d="M12 4v2" />
    <path d="M12 18v2" />
    <path d="M4 12h2" />
    <path d="M18 12h2" />
  </svg>
);

export const IconPhone = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    {/* Minimalist, clear classic phone handset for maximum readability */}
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

export const IconHook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Clean Fishing/Snag Hook for Steal Lifeline */}
    <circle cx="15" cy="5" r="2" />
    <path d="M15 7v8a5 5 0 0 1-10 0v-3" />
    <path d="M5 12l3 3" />
  </svg>
);
