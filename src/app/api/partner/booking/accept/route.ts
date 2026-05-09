import { NextResponse } from "next/server";
import { auth } from "@/auth";
import Booking from "@/models/booking.model";
import Vehicle from "@/models/vehicle.model";
import dbConnect from "@/lib/db";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || session.user.role !== "partner") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { bookingId } = await req.json();
        if (!bookingId) {
            return NextResponse.json({ success: false, message: "Booking ID is required" }, { status: 400 });
        }

        await dbConnect();

        // Check if booking is still pending
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
        }

        if (booking.status !== "pending") {
            return NextResponse.json({ success: false, message: "Booking is already " + booking.status }, { status: 400 });
        }

        // Check if partner has an approved vehicle
        const vehicle = await Vehicle.findOne({ owner: session.user.id, status: "approved" });
        if (!vehicle) {
            return NextResponse.json({ success: false, message: "You don't have an approved vehicle" }, { status: 400 });
        }

        // Update booking
        booking.status = "accepted";
        booking.partner = session.user.id;
        booking.vehicle = vehicle._id;
        await booking.save();

        // Populate partner and user info for the response
        const updatedBooking = await Booking.findById(bookingId)
            .populate("user", "name mobileNumber")
            .populate({
                path: "partner",
                select: "name mobileNumber",
            })
            .populate("vehicle");

        return NextResponse.json({
            success: true,
            message: "Booking accepted successfully",
            booking: updatedBooking
        });

    } catch (error: any) {
        console.error("Booking acceptance error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
