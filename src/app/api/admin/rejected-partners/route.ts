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

        const rejectedPartners = await User.find({
            role: "partner",
            videoKycStatus: "rejected"
        }).select("name email videoKycStatus videoKycRoomId videoKycRejectionReason")

        return NextResponse.json(rejectedPartners, { status: 200 })
    } catch (error) {
        return Response.json({ error: `Admin Dashboard Error: ${error}` }, { status: 500 })
    }
}
