"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Navbar() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                },
            },
        });
    };

    return (
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-bold text-indigo-600 tracking-tight">
                            DevMarket
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/gigs" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                                Browse Gigs
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {isPending ? (
                            <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                        ) : session ? (
                            <>
                                <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-3">
                                    Dashboard
                                </Link>
                                <Link href="/gigs/create" className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-3">
                                    Create Gig
                                </Link>
                                <Button variant="outline" size="sm" onClick={handleSignOut}>
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-3">
                                    Log in
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
