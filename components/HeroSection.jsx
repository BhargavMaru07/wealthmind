"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const imageRef = useRef();

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradiant-title mb-4">
          Manage Your Finances <br /> With Intelligence
        </h1>
        <p className="text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
          An AI-Powered financial management platform that helps you track,
          analyze, and optimized your spending with real-time insights.
        </p>
      </div>
      <div className="flex justify-center space-x-8 mb-4">
        <Link href={"/dashboard"}>
          <Button size="lg" className="px-8 animate-bounce">
            Get Started
          </Button>
        </Link>
        <Link href={"/"}>
          <Button size="lg" className="px-8 animate-bounce" variant="outline">
            Watch Demo
          </Button>
        </Link>
      </div>
      <div className="hero-image-wrapper overflow-hidden">
        <div ref={imageRef} className="hero-image ">
          <Image
            src={"/banner.jpeg"}
            alt="DashBoard Preview"
            width={1200}
            height={720}
            priority
            className="rounded-lg shadow-2xl border mx-auto"
          />
        </div>
      </div>
      
    </div>
  );
};

export default HeroSection;
