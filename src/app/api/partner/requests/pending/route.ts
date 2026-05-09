import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Booking from "@/models/booking.model";
import Vehicle from "@/models/vehicle.model";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || (session.user as any).role !== 'partner') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 1. Get partner's vehicle type
        // 1. Get partner's vehicle
        const vehicle = await Vehicle.findOne({ owner: (session.user as any).id || session.user.email });
        
        if (!vehicle || vehicle.status !== "approved") {
            // If no vehicle or not approved, just return empty list instead of 404 to avoid console errors
            return NextResponse.json({ success: true, requests: [] });
        }

        // 2. Find pending bookings for this vehicle type
        // In a real app, we would also filter by location (near the partner)
        const pendingBookings = await Booking.find({
            status: "pending",
            vehicleType: vehicle.type
        }).populate("user", "name mobileNumber").sort({ createdAt: -1 });

        return NextResponse.json({ success: true, requests: pendingBookings });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
