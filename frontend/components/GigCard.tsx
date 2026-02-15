import Link from "next/link";
import { Button } from "./ui/button";
import { Clock, Tag } from "lucide-react";

interface GigCardProps {
    gig: {
        id: string;
        title: string;
        description: string;
        price: number;
        delivery_days: number;
        freelancer_id: string;
    };
}

export default function GigCard({ gig }: GigCardProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col h-full group">
            <div className="p-6 flex-1">
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-indigo-600">
                            {gig.title.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <span className="text-sm text-slate-500 font-medium">Freelancer</span>
                </div>

                <Link href={`/gigs/${gig.id}`}>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">
                        {gig.title}
                    </h3>
                </Link>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                    {gig.description}
                </p>

                <div className="flex items-center gap-4 text-slate-500 text-xs mb-4">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{gig.delivery_days} days delivery</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        <span>Development</span>
                    </div>
                </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Starting at</span>
                    <p className="text-2xl font-black text-indigo-600">${gig.price}</p>
                </div>
                <Link href={`/gigs/${gig.id}`}>
                    <Button variant="default" size="sm">
                        View Details
                    </Button>
                </Link>
            </div>
        </div>
    );
}
