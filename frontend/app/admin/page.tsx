"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
    Users,
    ShoppingBag,
    Briefcase,
    BarChart3,
    ShieldCheck,
    Loader2,
    Package,
    CheckCircle,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPanelPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [stats, setStats] = useState({
        users: 0,
        gigs: 0,
        orders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, middleware or server-side checks should handle this
        if (!isPending) {
            if (!session) {
                router.push("/login");
            }
            // Note: For now, we allow access to anyone logged in for demonstration
            // in a real app, check if session.user?.is_admin

            // Fetch stats (mocked/simplified since we don't have a specific admin stats endpoint)
            const fetchStats = async () => {
                try {
                    const [u, g, o] = await Promise.all([
                        fetch("http://localhost:8000/api/v1/me", { credentials: "include" }), // dummy for user count
                        fetch("http://localhost:8000/api/v1/gigs/"),
                        fetch("http://localhost:8000/api/v1/orders/", { credentials: "include" })
                    ]);

                    const gigsData = await g.json();
                    const ordersData = await o.json();

                    setStats({
                        users: 1, // mocked
                        gigs: gigsData.length,
                        orders: ordersData.length
                    });
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }
    }, [session, isPending, router]);

    if (isPending || loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                            <ShieldCheck className="h-6 w-6 text-orange-600" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin System</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Global platform oversight and management.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 lg:px-8 space-y-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: "Active Users", value: stats.users, icon: Users, color: "bg-blue-500" },
                        { label: "Total Gigs", value: stats.gigs, icon: Briefcase, color: "bg-indigo-500" },
                        { label: "Completed Orders", value: stats.orders, icon: ShoppingBag, color: "bg-green-500" },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
                            <div className={`absolute -right-4 -bottom-4 h-24 w-24 rounded-full ${item.color} opacity-[0.03] group-hover:scale-150 transition-transform duration-700`} />
                            <item.icon className={`h-8 w-8 mb-6 ${item.color.replace("bg-", "text-")}`} />
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">{item.label}</p>
                            <p className="text-4xl font-black text-slate-900 mt-1">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Content Tabs Mockup */}
                <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="border-b border-slate-100 flex p-2">
                        <button className="px-8 py-4 rounded-[28px] bg-slate-900 text-white text-sm font-bold shadow-lg">Overview</button>
                        <button className="px-8 py-4 rounded-[28px] text-slate-400 text-sm font-bold hover:bg-slate-50">User Management</button>
                        <button className="px-8 py-4 rounded-[28px] text-slate-400 text-sm font-bold hover:bg-slate-50">System Logs</button>
                    </div>

                    <div className="p-12 space-y-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-indigo-600" />
                                Pending Approvals
                            </h2>
                            <Button variant="outline" size="sm" className="font-bold border-slate-200">View All</Button>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-6 rounded-3xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-100 animate-pulse" />
                                        <div>
                                            <p className="text-sm font-black text-slate-900">System generated report #{i * 235}</p>
                                            <p className="text-xs text-slate-400 font-bold tracking-tight mt-0.5">Automated quality check required.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase">
                                                <AlertTriangle className="h-3 w-3" />
                                                Review Required
                                            </span>
                                        </div>
                                        <Button size="sm" className="font-black bg-slate-900 text-white hover:bg-black">Review</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
