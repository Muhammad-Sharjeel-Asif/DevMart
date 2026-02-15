"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    ShoppingBag,
    Briefcase,
    Settings,
    User as UserIcon,
    Loader2,
    ExternalLink,
    ChevronRight,
    PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GigCard from "@/components/GigCard";

import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"buying" | "selling">("buying");
    const [orders, setOrders] = useState<any[]>([]);
    const [myGigs, setMyGigs] = useState<any[]>([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isPending && !session) {
            router.push("/login");
        }
    }, [session, isPending, router]);

    const fetchData = async () => {
        if (!session) return;
        setLoadingItems(true);
        setError("");
        try {
            // Fetch orders with credentials
            const ordersData = await apiFetch("/orders/", {
                credentials: "include"
            });
            setOrders(ordersData);

            // Fetch gigs
            const allGigsData = await apiFetch("/gigs/");
            setMyGigs(allGigsData.filter((g: any) => g.freelancer_id === session.user?.id));

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to load dashboard data");
        } finally {
            setLoadingItems(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [session]);

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-0.5 shadow-xl shadow-indigo-100">
                                <div className="h-full w-full rounded-[14px] bg-white flex items-center justify-center">
                                    <UserIcon className="h-8 w-8 text-indigo-600" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                                    Welcome back, {session.user?.name}
                                </h1>
                                <p className="text-slate-500 font-medium">Manage your freelance business and purchases.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="lg" className="border-slate-200 font-bold text-slate-700">
                                <Settings className="h-4 w-4 mr-2" />
                                Profile Settings
                            </Button>
                            <Link href="/gigs/create">
                                <Button size="lg" className="font-bold shadow-lg shadow-indigo-100">
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Post new Gig
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
                {/* Tabs */}
                <div className="flex items-center gap-4 mb-10 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit">
                    <button
                        onClick={() => setActiveTab("buying")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "buying"
                            ? "bg-slate-900 text-white shadow-lg"
                            : "text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        <ShoppingBag className="h-4 w-4" />
                        Buying
                    </button>
                    <button
                        onClick={() => setActiveTab("selling")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "selling"
                            ? "bg-slate-900 text-white shadow-lg"
                            : "text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        <Briefcase className="h-4 w-4" />
                        Selling
                    </button>
                </div>

                {loadingItems ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        {activeTab === "buying" ? (
                            <>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-900">Your Orders</h2>
                                    <Link href="/gigs" className="text-sm font-bold text-indigo-600 hover:underline flex items-center">
                                        Browse Services <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-20 text-center">
                                        <p className="text-slate-500 italic font-medium">You haven't bought any services yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {orders.map((order: any) => (
                                            <Link
                                                key={order.id}
                                                href={`/orders/${order.id}`}
                                                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                                        <ShoppingBag className="h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-1">Order ID: {order.id.slice(0, 8)}</p>
                                                        <p className="text-lg font-black text-slate-900">Purchase for Project</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-8">
                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Status</p>
                                                        <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-black uppercase">
                                                            {order.status.replace("_", " ")}
                                                        </span>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-slate-900">Manage Your Gigs</h2>
                                    <Link href="/gigs/create" className="text-sm font-bold text-indigo-600 hover:underline flex items-center">
                                        Create new <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                {myGigs.length === 0 ? (
                                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 py-20 text-center">
                                        <p className="text-slate-500 italic font-medium">You haven't posted any gigs yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {myGigs.map((gig: any) => (
                                            <GigCard key={gig.id} gig={gig} />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
