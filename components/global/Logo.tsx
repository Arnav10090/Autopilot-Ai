import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src="/logo.png"
        alt="AutoPilot AI Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
