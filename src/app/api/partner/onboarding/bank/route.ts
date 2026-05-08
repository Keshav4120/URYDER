import { auth } from "@/auth"
import connectDb from "@/lib/db"
import PartnerBank from "@/models/partnerBank.model"
import User from "@/models/user.model"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email) {
            return Response.json({ status: 400, message: "Unauthorized" })
        }
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return Response.json({ status: 404, message: "User not found" })
        }

        const { accountHolder, accountNumber, upiId, ifsc, mobileNumber } = await req.json()
        if (!accountHolder || !accountNumber || !ifsc || !mobileNumber) {
            return Response.json({ message: "All fields are required" }, { status: 400 })
        }
        const partnerBank = await PartnerBank.findOneAndUpdate(
            { owner: user._id },
            {
                accountHolder,
                accountNumber,
                ifsc,
                upiId,
                status: "added"
            }, { upsert: true, new: true }
        )

        user.mobileNumber = mobileNumber
        if (user.partnerOnboardingStep < 3) {
            user.partnerOnboardingStep = 3
        }
        user.partnerStatus = "pending"
        await user.save()
        return Response.json(partnerBank, { status: 200 })
    } catch (error) {
        return Response.json({ message: `partner bank error, ${error}` }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDb()
        const session = await auth()
        if (!session || !session.user?.email) {
            return Response.json({ status: 400, message: "Unauthorized" })
        }
        const user = await User.findOne({ email: session.user.email })
        if (!user) {
            return Response.json({ status: 404, message: "User not found" })
        }
        const partnerBank = await PartnerBank.findOne({ owner: user._id })
        if (partnerBank) {
            return Response.json({ partnerBank, mobileNumber: user.mobileNumber }, { status: 200 })
        } else {
            return Response.json(null, { status: 404 })
        }
    } catch (error) {
        return Response.json({ message: "Get partner bank error" }, { status: 500 })
    }
}