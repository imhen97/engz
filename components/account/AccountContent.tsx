"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import NavBar from "@/components/NavBar";

interface AccountData {
  name: string;
  email: string;
  plan: string;
  trialActive: boolean;
  trialEndsAt: string | null;
  subscriptionActive: boolean;
}

export default function AccountContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Prevent multiple redirects
  const hasRedirected = useRef(false);
  const hasSetData = useRef(false);

  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirected.current) return;
    
    if (status === "unauthenticated") {
      hasRedirected.current = true;
      router.push("/signup?callbackUrl=/account");
      return;
    }

    if (status === "authenticated" && session?.user && !hasSetData.current) {
      hasSetData.current = true;
      setAccountData({
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        plan: session.user.plan ?? "free",
        trialActive: session.user.trialActive ?? false,
        trialEndsAt: session.user.trialEndsAt?.toISOString() ?? null,
        subscriptionActive: session.user.subscriptionActive ?? false,
      });
      setLoading(false);
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#FFF8F5] text-black">
        <NavBar />
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">로딩 중…</p>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (!accountData) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FFF8F5] text-black">
      <NavBar />
      <div className="mx-auto w-full max-w-4xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 md:px-8 lg:px-10">
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-medium tracking-[0.3em] text-[#F5472C] sm:text-sm">
            MY ACCOUNT
          </p>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 sm:mt-4 sm:text-3xl md:text-4xl">
            Profile & Subscription
          </h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Section */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
              Profile
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500">Name</p>
                <p className="mt-1 text-sm text-gray-900">{accountData.name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Email</p>
                <p className="mt-1 text-sm text-gray-900">
                  {accountData.email}
                </p>
              </div>
            </div>
          </section>

          {/* Subscription Section */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg sm:rounded-3xl sm:p-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
              Subscription Status
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Current Plan
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {accountData.plan === "free"
                    ? "Free Trial"
                    : accountData.plan === "annual"
                    ? "Annual Plan"
                    : "Monthly Plan"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Trial Status
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {accountData.trialActive ? "Active" : "Ended"}
                </p>
                {accountData.trialActive && accountData.trialEndsAt && (
                  <p className="mt-1 text-xs text-gray-500">
                    Ends:{" "}
                    {new Date(accountData.trialEndsAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Subscription Active
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {accountData.subscriptionActive ? "Yes" : "No"}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/subscribe"
                className="inline-flex items-center justify-center rounded-full bg-[#F5472C] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105"
              >
                Manage Subscription →
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-red-500 hover:text-red-500"
          >
            Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
