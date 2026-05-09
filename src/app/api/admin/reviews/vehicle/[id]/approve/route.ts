import { auth } from "@/auth"
import connectDb from "@/lib/db"
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
        const vehicle = await Vehicle.findById(vehicleId)
        if (!vehicle) {
            return Response.json({ error: "vehicle not found" }, { status: 404 })
        }
        vehicle.status = "approved"
        vehicle.isActive = true
        vehicle.rejectionReason = undefined
        await vehicle.save()
        
        // Update onboarding step for the owner to the final Live step
        const owner = await User.findById(vehicle.owner)
        if (owner) {
            owner.partnerOnboardingStep = 8
            await owner.save()
        }

        return NextResponse.json(vehicle, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: `Admin Dashboard Error: ${err.message}` }, { status: 500 })
    }
}
