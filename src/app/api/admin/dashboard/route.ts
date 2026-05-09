import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email || session.user.role != "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }
        const totalPartner = await User.countDocuments({ role: "partner" })
        const totalApprovedPartner = await User.countDocuments({ role: "partner", partnerStatus: "approved" })
        const totalPendingPartner = await User.countDocuments({ role: "partner", partnerStatus: "pending" })
        const totalRejectedPartner = await User.countDocuments({ role: "partner", partnerStatus: "rejected" })
        const totalRejectedVehicle = await Vehicle.countDocuments({ status: "rejected" })
        const totalRejected = totalRejectedPartner + totalRejectedVehicle

        const pendingPartnerUsers = await User.find({
            role: "partner",
            partnerStatus: { $in: ["pending", "rejected"] },
            partnerOnboardingStep: { $gte: 3 }
        })

        const partnerIds = pendingPartnerUsers.map((user) => user._id)
        const partnerVehicles = await Vehicle.find({
            owner: { $in: partnerIds }
        })


        // Only show vehicles where owner has reached the pricing step (step 6+)
        const pricingPartners = await User.find({
            role: "partner",
            partnerOnboardingStep: { $gte: 6 }
        }).select("_id")
        const pricingPartnerIds = pricingPartners.map(p => p._id)

        const pendingVehicle = await Vehicle.find({
            status: { $in: ["pending", "rejected"] },
            owner: { $in: pricingPartnerIds }
        }).populate("owner")

        const vehicleTypeMap = new Map(
            partnerVehicles.map(vehicle => [String(vehicle.owner), vehicle.type])
        )

        const pendingPartnerReviews = pendingPartnerUsers.map((p) => ({
            _id: p._id,
            name: p.name,
            email: p.email,
            status: p.partnerStatus,
            vehicleType: vehicleTypeMap.get(String(p._id))
        }
        ))

        return NextResponse.json({
            pendingVehicle,
            stats: {
                totalPartner,
                totalApprovedPartner,
                totalPendingPartner,
                totalRejected: totalRejected
            },
            pendingPartnerReviews
        }, { status: 200 })
    } catch (error) {
        console.log(error)
        return Response.json({ error: `Admin Dashboard Error: ${error}` }, { status: 500 })
    }
}