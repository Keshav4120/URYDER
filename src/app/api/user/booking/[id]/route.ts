import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Booking from "@/models/booking.model";
import dbConnect from "@/lib/db";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const booking = await Booking.findById(id)
            .populate("user", "name mobileNumber")
            .populate("partner", "name mobileNumber")
            .populate("vehicle");

        if (!booking) {
            return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            booking
        });

    } catch (error: any) {
        console.error("Booking fetch error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
