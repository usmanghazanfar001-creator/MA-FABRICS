"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth/actions";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await logoutUser();
        router.push("/");
        router.refresh();
      }}
      className="text-sm text-navy/60 hover:text-navy"
    >
      Sign out
    </button>
  );
}
