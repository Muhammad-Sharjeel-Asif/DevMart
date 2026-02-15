"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
    CheckCircle2,
    Clock,
    CreditCard,
    FileText,
    Loader2,
    MessageSquare,
    AlertCircle,
    ArrowLeft,
    Upload,
    User,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { apiFetch } from "@/lib/api";

export default function OrderDetailPage() {
    const { id } = useParams();
    const { data: session } = authClient.useSession();
    const [order, setOrder] = useState<any>(null);
    const [gig, setGig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [paymentData, setPaymentData] = useState({
        proof_reference: "",
        payer_name: "",
        amount: ""
    });
    const [actionLoading, setActionLoading] = useState(false);
    const router = useRouter();

    const fetchOrder = async () => {
        try {
            // Use apiFetch helper
            const data = await apiFetch("/orders/", {
                credentials: "include"
            });
            const currentOrder = data.find((o: any) => o.id === id);
            if (!currentOrder) throw new Error("Order not found");
            setOrder(currentOrder);

            // Fetch Gig details
            const gigData = await apiFetch(`/gigs/${currentOrder.gig_id}`);
            setGig(gigData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const handleAction = async (endpoint: string, body?: any) => {
        setActionLoading(true);
        try {
            await apiFetch(`/orders/${id}/${endpoint}`, {
                method: "PATCH",
                body: JSON.stringify(body),
                credentials: "include"
            });
            await fetchOrder();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        </div>
    );

    if (error || !order) return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-slate-500 mb-6">{error}</p>
            <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>
    );

    const isClient = session?.user?.id === order.client_id;
    const isFreelancer = session?.user?.id === order.freelancer_id;

    const steps = [
        { key: "PENDING_PAYMENT", label: "Paid", icon: CreditCard },
        { key: "PAYMENT_CONFIRMED", label: "Working", icon: Clock },
        { key: "SUBMITTED", label: "Review", icon: FileText },
        { key: "COMPLETED", label: "Completed", icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex(s => s.key === order.status) !== -1
        ? steps.findIndex(s => s.key === order.status)
        : (order.status === "PAYMENT_SUBMITTED" ? 0 : 3);

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-8 text-slate-500 font-bold hover:text-indigo-600 px-0 hover:bg-transparent"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Order Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">Order Summary</span>
                                <h1 className="text-3xl font-black text-slate-900 mt-2">{gig?.title}</h1>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-slate-400 uppercase">Total Amount</span>
                                <p className="text-3xl font-black text-indigo-600">${gig?.price}</p>
                            </div>
                        </div>

                        {/* Stepper */}
                        <div className="relative flex justify-between mb-12 py-4">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />
                            <div
                                className="absolute top-1/2 left-0 h-0.5 bg-indigo-500 -translate-y-1/2 -z-10 transition-all duration-500"
                                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                            />
                            {steps.map((step, idx) => (
                                <div key={step.key} className="flex flex-col items-center gap-2">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center border-4 border-slate-50 transition-all ${idx <= currentStepIndex ? "bg-indigo-600 text-white" : "bg-white text-slate-300 border-slate-100"
                                        }`}>
                                        <step.icon className="h-5 w-5" />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${idx <= currentStepIndex ? "text-indigo-600" : "text-slate-300"
                                        }`}>{step.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Content Based on Status */}
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                            {order.status === "PENDING_PAYMENT" && isClient && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-indigo-600 mb-2">
                                        <CreditCard className="h-6 w-6" />
                                        <h3 className="text-lg font-black">Submit Payment Proof</h3>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Please transfer <strong>${gig?.price}</strong> to our verified account and upload the transaction details here for verification.
                                    </p>
                                    <div className="grid gap-4">
                                        <Input
                                            placeholder="Payer Name"
                                            value={paymentData.payer_name}
                                            onChange={(e) => setPaymentData({ ...paymentData, payer_name: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Transaction Reference ID"
                                            value={paymentData.proof_reference}
                                            onChange={(e) => setPaymentData({ ...paymentData, proof_reference: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Amount"
                                            type="number"
                                            value={paymentData.amount}
                                            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                        />
                                        <Button
                                            className="w-full h-12 shadow-lg shadow-indigo-100 font-bold"
                                            onClick={() => handleAction("submit-payment", {
                                                ...paymentData,
                                                amount: parseFloat(paymentData.amount)
                                            })}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? <Loader2 className="animate-spin" /> : "Submit Proof"}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {order.status === "PAYMENT_SUBMITTED" && (
                                <div className="text-center py-6">
                                    <Loader2 className="h-12 w-12 text-indigo-400 animate-spin mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Awaiting Confirmation</h3>
                                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                        The freelancer is currently verifying your payment. This usually takes 1-2 hours.
                                    </p>
                                    {isFreelancer && (
                                        <Button
                                            className="mt-6 bg-green-600 hover:bg-green-700"
                                            onClick={() => handleAction("confirm-payment")}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? <Loader2 className="animate-spin" /> : "Verify & Start Working"}
                                        </Button>
                                    )}
                                </div>
                            )}

                            {order.status === "PAYMENT_CONFIRMED" && (
                                <div className="text-center py-6 space-y-4">
                                    <Clock className="h-12 w-12 text-indigo-400 mx-auto mb-2" />
                                    <h3 className="text-xl font-bold text-slate-900">Project in Progress</h3>
                                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                        {isFreelancer ? "You have confirmed the payment. Now get to work!" : "The freelancer is working on your project."}
                                    </p>
                                    {isFreelancer && (
                                        <Button
                                            className="mt-4"
                                            onClick={() => handleAction("submit-work")}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? <Loader2 className="animate-spin" /> : "Submit Completed Work"}
                                        </Button>
                                    )}
                                </div>
                            )}

                            {order.status === "SUBMITTED" && (
                                <div className="text-center py-6 space-y-4">
                                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
                                    <h3 className="text-xl font-bold text-slate-900">Work Submitted</h3>
                                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                        {isClient ? "The freelancer has submitted the work. Please review it." : "Work submitted. Waiting for client approval."}
                                    </p>
                                    {isClient && (
                                        <div className="flex gap-4 justify-center mt-6">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleAction("revision")}
                                                disabled={actionLoading}
                                                className="font-bold border-slate-200"
                                            >
                                                Request Revision
                                            </Button>
                                            <Button
                                                onClick={() => handleAction("approve")}
                                                disabled={actionLoading}
                                                className="font-bold bg-green-600 hover:bg-green-700"
                                            >
                                                Approve & Complete
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {order.status === "COMPLETED" && (
                                <div className="text-center py-6">
                                    <div className="h-16 w-16 bg-green-100 flex items-center justify-center rounded-full mx-auto mb-4">
                                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">Order Completed!</h3>
                                    <p className="text-slate-500 text-sm mb-6">Thank you for using DevMarket.</p>
                                    <Link href={`/reviews/create?order_id=${id}`}>
                                        <Button className="font-bold ring-4 ring-indigo-50">Leave a Review</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar */}
                <div className="space-y-6">
                    {/* Participants */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6">
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">People involved</h4>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400">Client</p>
                                    <p className="text-sm font-black text-slate-700">Project Owner</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                                    <Briefcase className="h-5 w-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400">Freelancer</p>
                                    <p className="text-sm font-black text-slate-700">Service Provider</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Prompt */}
                    <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200">
                        <MessageSquare className="h-8 w-8 mb-4 opacity-50" />
                        <h4 className="text-xl font-bold mb-2">Need to talk?</h4>
                        <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                            Send a direct message to discuss requirements or get updates.
                        </p>
                        <Link href={`/messages?user_id=${isClient ? order.freelancer_id : order.client_id}`}>
                            <Button variant="secondary" className="w-full font-bold bg-white text-indigo-600 hover:bg-indigo-50 border-none">
                                Open Chat
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Briefcase(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            <rect width="20" height="14" x="2" y="6" rx="2" />
        </svg>
    )
}
