import { auth } from "@/auth"
import connectDb from "@/lib/db"
import PartnerDocs from "@/models/partnerDocs.model"
import User from "@/models/user.model"
import Vehicle from "@/models/vehicle.model"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {

        const session = await auth()
        if (!session || !session.user?.email || session.user.role != "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }
        await connectDb()
        const vehicleId = (await context.params).id
        const vehicle = await Vehicle.findById(vehicleId).populate("owner").lean()
        if (!vehicle) {
            return Response.json({ error: "vehicle not found" }, { status: 404 })
        }

        // Fetch RC URL from PartnerDocs if it exists for this owner
        const docs = await PartnerDocs.findOne({ owner: vehicle.owner._id })

        return NextResponse.json({
            ...vehicle,
            rcUrl: docs?.rcUrl
        }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: `Admin Dashboard Error: ${err.message}` }, { status: 500 })
    }
}