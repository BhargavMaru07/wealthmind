import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
      <h1 className="text-6xl font-bold gradiant-title mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        Oops! The Page You&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link href={"/"}>
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}

export default NotFound;