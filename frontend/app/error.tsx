'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="bg-white p-12 rounded-[40px] shadow-2xl shadow-red-100 border border-red-50 text-center max-w-lg w-full">
                <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4">Something went wrong!</h2>
                <p className="text-slate-500 font-medium mb-12">
                    We encountered an unexpected error. Don't worry, it's not you, it's us.
                </p>
                <div className="flex flex-col gap-4">
                    <Button
                        onClick={() => reset()}
                        className="h-16 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-xl shadow-indigo-100 w-full"
                    >
                        <RefreshCcw className="mr-2 h-5 w-5" />
                        Try again
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => window.location.href = '/'}
                        className="text-slate-400 font-bold hover:text-slate-600"
                    >
                        Go back home
                    </Button>
                </div>
            </div>
        </div>
    )
}
