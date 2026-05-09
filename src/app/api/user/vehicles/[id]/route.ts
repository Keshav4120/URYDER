import connectDb from "@/lib/db";
import Vehicle from "@/models/vehicle.model";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDb();
        const { id } = await params;

        const vehicle = await Vehicle.findById(id).populate("owner", "name profileImage rating");

        if (!vehicle) {
            return NextResponse.json({ success: false, message: "Vehicle not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, vehicle });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
