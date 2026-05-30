import Image from "next/image";
import type React from "react";

export interface HeroPosterProps {
  title: React.ReactNode;
  subtitle?: string;
  description?: React.ReactNode;
  imageUrl?: string;
  textMainClass?: string;
  textSubClass?: string;
  descriptionClass?: string;
  children?: React.ReactNode;
  showImage?: boolean;
}

export function HeroPoster({
  title,
  subtitle,
  description,
  imageUrl,
  textMainClass = "text-[#393ADD]",
  textSubClass = "text-white",
  descriptionClass = "text-white/80 max-w-4xl mx-auto",
  children,
  showImage = true,
}: HeroPosterProps) {
  return (
    <section className="w-full h-dvh relative overflow-hidden">
      {showImage && (
        <Image
          src={imageUrl || "/placeholder.jpg"}
          alt="Hero banner"
          fill
          className="object-cover"
          priority
        />
      )}

      <div className="absolute inset-0 bg-black/30 z-10" />

      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="text-center px-4 max-w-7xl mx-auto">
          <h1
            className={`text-3xl md:text-6xl lg:text-7xl font-bold mb-4 ${textMainClass}`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-lg md:text-2xl lg:text-3xl font-semibold mb-6 ${textSubClass}`}
            >
              {subtitle}
            </p>
          )}
          {description && (
            <p
              className={`text-sm md:text-base leading-relaxed ${descriptionClass}`}
            >
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
