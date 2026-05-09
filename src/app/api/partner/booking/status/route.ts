import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Booking from "@/models/booking.model";
import dbConnect from "@/lib/db";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || session.user.role !== "partner") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { bookingId, status } = await req.json();
        // Updated to use "in_progress" to match the Mongoose schema enum
        const validStatuses = ["in_progress", "completed", "cancelled"];
        
        if (!bookingId || !status || !validStatuses.includes(status)) {
            return NextResponse.json({ success: false, message: "Invalid parameters" }, { status: 400 });
        }

        await dbConnect();

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
        }

        // Verify that this partner is assigned to this booking
        if (booking.partner.toString() !== session.user.id) {
            return NextResponse.json({ success: false, message: "Not authorized for this booking" }, { status: 403 });
        }

        booking.status = status;
        await booking.save();

        return NextResponse.json({
            success: true,
            message: `Booking status updated to ${status}`,
            booking
        });

    } catch (error: any) {
        console.error("Booking status update error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
