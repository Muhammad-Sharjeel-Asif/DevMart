"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Sparkles } from "lucide-react";

export default function CreateGigPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        delivery_days: "",
    });
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/v1/gigs/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    delivery_days: parseInt(formData.delivery_days),
                }),
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to create gig");

            router.push("/gigs");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-indigo-200" />
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">For Freelancers</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Post a New Gig</h1>
                    <p className="text-indigo-100/80 text-sm mt-2">
                        Showcase your skills and start earning from global clients.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Gig Title</label>
                            <Input
                                placeholder="I will build a high-performance Next.js application..."
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <p className="text-[10px] text-slate-400 font-medium italic">Make it catchy and descriptive.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Description</label>
                            <Textarea
                                placeholder="Describe your service in detail..."
                                required
                                rows={6}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Price ($)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <Input
                                        type="number"
                                        placeholder="25.00"
                                        required
                                        className="pl-8 h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Delivery Time (Days)</label>
                                <Input
                                    type="number"
                                    placeholder="3"
                                    required
                                    className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    value={formData.delivery_days}
                                    onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={loading}
                            className="px-8 border-slate-200 text-slate-600 font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="px-8 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-200"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Gig
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
