"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2, Send, MessageSquare, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

import { apiFetch } from "@/lib/api";

export default function MessagesPage() {
    const searchParams = useSearchParams();
    const targetUserId = searchParams.get("user_id");
    const { data: session, isPending } = authClient.useSession();
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const socketRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchHistory = async () => {
        if (!targetUserId) return;
        try {
            const data = await apiFetch(`/messages/${targetUserId}`, {
                credentials: "include"
            });
            setMessages(data.reverse()); // Chronological
            setLoading(false);
            setTimeout(scrollToBottom, 100);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (session && targetUserId) {
            fetchHistory();

            // Connect WebSocket
            const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
            const socket = new WebSocket(`${wsUrl}/api/v1/messages/ws/${session.user?.id}`);
            socketRef.current = socket;

            socket.onmessage = (event) => {
                fetchHistory();
            };

            return () => socket.close();
        }
    }, [session, targetUserId]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !targetUserId) return;

        try {
            const newMessage = await apiFetch("/messages/", {
                method: "POST",
                body: JSON.stringify({
                    receiver_id: targetUserId,
                    content: inputValue
                }),
                credentials: "include"
            });

            setMessages(prev => [...prev, newMessage]);
            setInputValue("");
            setTimeout(scrollToBottom, 100);
        } catch (err) {
            console.error(err);
        }
    };

    if (isPending || loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        </div>
    );

    if (!targetUserId) return (
        <div className="max-w-2xl mx-auto py-32 px-4 text-center">
            <MessageSquare className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900">Select a conversation</h2>
            <p className="text-slate-500 mt-2 mb-8">Go to your dashboard or an order to start messaging.</p>
            <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
            </Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col my-8 px-4">
            {/* Header */}
            <div className="bg-white p-4 rounded-t-3xl border border-slate-200 flex items-center gap-4">
                <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                    <p className="text-sm font-black text-slate-900">Conversation</p>
                    <p className="text-xs text-slate-400 font-bold">Active now</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-white border-x border-slate-200 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {messages.map((msg: any) => {
                    const isMe = msg.sender_id === session?.user?.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] px-6 py-3 rounded-2xl text-sm font-medium shadow-sm transition-all ${isMe
                                ? "bg-indigo-600 text-white rounded-br-none"
                                : "bg-slate-100 text-slate-700 rounded-bl-none"
                                }`}>
                                {msg.content}
                                <p className={`text-[10px] mt-1 opacity-60 ${isMe ? "text-right" : "text-left"}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
                onSubmit={sendMessage}
                className="bg-white p-4 rounded-b-3xl border border-slate-200 border-t-slate-100 flex gap-4"
            >
                <Input
                    className="flex-1 h-12 bg-slate-50 border-none rounded-2xl px-6 focus-visible:ring-indigo-500 font-medium"
                    placeholder="Write a message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <Button
                    type="submit"
                    size="icon"
                    className="h-12 w-12 rounded-2xl shadow-lg shadow-indigo-100 shrink-0"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </form>
        </div>
    );
}
