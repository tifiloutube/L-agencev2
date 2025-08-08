import { NextResponse } from 'next/server'
import { getSellerPlans } from '@/lib/stripe/plan'

export async function GET() {
    const plans = await getSellerPlans()
    return NextResponse.json(plans)
}