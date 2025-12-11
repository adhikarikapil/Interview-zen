"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { logout } from "@/lib/actions/auth.action";
import { useId } from "react";
import { useEffect, useState } from "react";

const DropdownNav = (userName: any) => {
    const [mounted, setMounted] = useState(false);
    const id = useId();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost">
                <Image
                    src="/arrow-down.svg"
                    alt="down"
                    width={12}
                    height={12}
                />
            </Button>
        );
    }

  return (
    <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild id={id}>
              <Button variant="ghost">
                <Image
                  src="/arrow-down.svg"
                  alt="down"
                  width={12}
                  height={12}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full" align="start">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>{userName.name}</DropdownMenuItem>
                <DropdownMenuItem>
                  <button onClick={()=>logout()}>logout</button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuItem></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
  )
}

export default DropdownNav
