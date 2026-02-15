"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        await authClient.signIn.email({
            email,
            password,
        }, {
            onSuccess: () => {
                router.push("/dashboard");
            },
            onError: (ctx) => {
                alert(ctx.error.message);
            },
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-2xl font-bold">Login</h1>
            <input
                className="border p-2 m-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="border p-2 m-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-blue-500 text-white p-2 m-2" onClick={handleLogin}>
                Sign In
            </button>
        </div>
    );
}
