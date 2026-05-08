import { auth } from "@/auth";
import connectDb from "@/lib/db";
import PartnerBank from "@/models/partnerBank.model";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session || !session.user?.email || session.user.role != "admin") {
            return Response.json({ error: "Unauthorized" }, { status: 401 })
        }
        await connectDb()
        const partnerId = (await context.params).id
        const partner = await User.findById(partnerId)
        if (!partner || partner.role != "partner") {
            return Response.json({ error: "Partner not found" }, { status: 404 })
        }
        const vehicle = await Vehicle.findOne({ owner: partnerId })
        if (!vehicle) {
            return Response.json({ error: "Vehicle not found" }, { status: 404 })
        }

        const documents = await PartnerDocs.findOne({ owner: partnerId })
        if (!documents) {
            return Response.json({ error: "Documents not found" }, { status: 404 })
        }
        const bankProof = await PartnerBank.findOne({ owner: partnerId })
        if (!bankProof) {
            return Response.json({ error: "Bank proof not found" }, { status: 404 })
        }
        return NextResponse.json({ partner, vehicle, documents, bankProof }, { status: 200 })

    } catch (error) {
        console.log(error)
        return Response.json({ error: `Admin Dashboard Error: ${error}` }, { status: 500 })
    }

}