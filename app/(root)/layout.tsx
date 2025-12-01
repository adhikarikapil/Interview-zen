import {
  getCurrentUser,
  isAuthenticated,
  logout,
} from "@/lib/actions/auth.action";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import DropdownNav from "../components/DropdownNav";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

    const currentUser = await getCurrentUser();

  if (!isUserAuthenticated) redirect("/sign-in");
  return (
    <div className="root-layout">
      <nav className="flex items-center w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h2 className="text-primary-100">Interview-zen</h2>
        </Link>
        <div className="ml-auto">
                    <DropdownNav name={currentUser?.name} />
        </div>
      </nav>
      {children}
    </div>
  );
};

export default RootLayout;
