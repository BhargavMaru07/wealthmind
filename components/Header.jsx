import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";

const Header = () => {
  return (
    <div className="fixed top-0 w-full bg-white/60 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-4 flex items-center justify-between">
        {/* Left side: Logo */}
        <div>
          <Link href="/">
            <Image
              src="/logo2.png"
              alt="WealthMind Logo"
              height={150}
              width={200}
              className="h-20 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right side: Authentication buttons */}
        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button
                variant="outline"
                className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
              >
                <LayoutDashboard />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link href={"/transaction/create"}>
              <Button className="flex items-center gap-2">
                <PenBox />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};


export default Header;
