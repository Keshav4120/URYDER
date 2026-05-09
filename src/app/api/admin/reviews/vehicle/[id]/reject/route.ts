import { auth } from "@/auth"
import connectDb from "@/lib/db"
import Vehicle from "@/models/vehicle.model"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {

        const session = await auth()
        if (!session || !session.user?.email || session.user.role != "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }
        const { rejectionReason } = await req.json()
        await connectDb()
        const vehicleId = (await context.params).id
        const vehicle = await Vehicle.findById(vehicleId).populate("owner")
        if (!vehicle) {
            return Response.json({ error: "vehicle not found" }, { status: 404 })
        }
        vehicle.status = "rejected"
        vehicle.rejectionReason = rejectionReason
        await vehicle.save()
        return NextResponse.json(vehicle, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: `Admin Dashboard Error: ${err.message}` }, { status: 500 })
    }
}
