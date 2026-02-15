"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Star, Loader2, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CreateReviewPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order_id");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId) return;
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/v1/reviews/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: orderId,
                    rating,
                    comment
                }),
                credentials: "include"
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.detail || "Failed to submit review");
            }

            router.push("/dashboard");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-20">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-10 right-10 w-20 h-20 bg-indigo-400 rounded-full blur-2xl animate-bounce" />
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/20">
                        <Sparkles className="h-4 w-4 text-indigo-300" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Share your experience</span>
                    </div>

                    <h1 className="text-4xl font-black tracking-tight mb-4">How was the order?</h1>
                    <p className="text-indigo-100 text-sm font-medium leading-relaxed max-w-sm mx-auto">
                        Your feedback helps our community stay safe and maintain high quality standards.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-12 space-y-10">
                    <div className="text-center">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Select your rating</p>
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setRating(s)}
                                    className={`group relative h-16 w-16 rounded-2xl flex items-center justify-center transition-all ${s <= rating
                                            ? "bg-indigo-600 shadow-xl shadow-indigo-200 scale-110"
                                            : "bg-slate-50 hover:bg-slate-100"
                                        }`}
                                >
                                    <Star className={`h-8 w-8 transition-colors ${s <= rating ? "fill-white text-white" : "text-slate-300"
                                        }`} />
                                </button>
                            ))}
                        </div>
                        <p className="mt-4 text-sm font-black text-indigo-600">
                            {rating === 5 ? "Amazing!" : rating === 4 ? "Great" : rating === 3 ? "Decent" : rating === 2 ? "Poor" : "Terrible"}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wider">Leave a comment</label>
                            <span className="text-[10px] text-slate-400 font-bold italic">Optional but recommended</span>
                        </div>
                        <Textarea
                            placeholder="Tell us what you liked (or what could be improved)..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                            className="rounded-3xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 p-6 text-sm font-medium placeholder:text-slate-300"
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-16 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-2xl shadow-indigo-200"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 animate-spin" />
                                    Submitting Review...
                                </>
                            ) : (
                                <>
                                    Submit Review
                                    <Heart className="ml-2 h-5 w-5 fill-white" />
                                </>
                            )}
                        </Button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Skip for now
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
