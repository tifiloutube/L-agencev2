import {NextResponse} from "next/server";
import {sellerPlans} from "@/lib/stripe/plan";

export async function GET() {
    return NextResponse.json(sellerPlans)
}