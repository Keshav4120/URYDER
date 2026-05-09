import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Booking from "@/models/booking.model";
import dbConnect from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { reason } = await req.json();
        const session = await auth();

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const booking = await Booking.findByIdAndUpdate(
            id,
            { status: "cancelled", cancelReason: reason },
            { new: true }
        );

        if (!booking) {
            return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, booking });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
