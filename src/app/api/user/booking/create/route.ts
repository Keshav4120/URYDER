import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Booking from "@/models/booking.model";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { pickup, drop, vehicleType, fare, paymentMethod } = await req.json();

        if (!pickup || !drop || !vehicleType || !fare) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        const newBooking = await Booking.create({
            user: (session.user as any).id || session.user.email,
            pickup: {
                address: pickup.address,
                coordinates: pickup.coordinates || [77.1025, 28.7041] // Default Delhi coords if missing
            },
            drop: {
                address: drop.address,
                coordinates: drop.coordinates || [77.2090, 28.6139]
            },
            vehicleType,
            fare,
            paymentMethod: paymentMethod || "cash",
            status: "pending",
            paymentStatus: paymentMethod === "online" ? "completed" : "pending"
        });

        // TODO: Emit socket event to nearby partners here

        return NextResponse.json({ success: true, booking: newBooking });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
