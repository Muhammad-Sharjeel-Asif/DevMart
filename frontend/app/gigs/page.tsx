"use client";

import { useEffect, useState } from "react";
import GigCard from "@/components/GigCard";
import { Search, Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { apiFetch } from "@/lib/api";

export default function GigListingPage() {
    const [gigs, setGigs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadGigs = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await apiFetch("/gigs/");
            setGigs(data);
        } catch (err: any) {
            setError(err.message || "Failed to load gigs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadGigs();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                        Explore Great Services
                    </h1>
                    <p className="text-lg text-slate-600">
                        Find the perfect developer for your next big project.
                    </p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search for services..."
                        className="pl-10"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
                    <p className="text-slate-500 font-medium">Loading amazing gigs...</p>
                </div>
            ) : error ? (
                <div className="bg-white border border-slate-200 p-12 rounded-[40px] text-center shadow-xl shadow-slate-100 max-w-2xl mx-auto">
                    <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Network Error</h3>
                    <p className="text-slate-500 font-medium mb-8">
                        {error}. Please check if the backend server is running.
                    </p>
                    <Button
                        onClick={() => loadGigs()}
                        className="h-14 px-8 rounded-2xl bg-indigo-600 font-black shadow-lg shadow-indigo-100"
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                </div>
            ) : gigs.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-slate-300">
                    <p className="text-slate-500 font-medium italic">No gigs found. Be the first to create one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {gigs.map((gig) => (
                        <GigCard key={gig.id} gig={gig} />
                    ))}
                </div>
            )}
        </div>
    );
}
