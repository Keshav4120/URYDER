import { auth } from "@/auth";
import uploadToCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import PartnerDocs from "@/models/partnerDocs.model";
import User from "@/models/user.model";
import { NextRequest } from "next/server";

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

        const formData = await req.formData()
        const aadhar = formData.get("aadhar") as Blob | null
        const drivingLicence = formData.get("licence") as Blob | null
        const rc = formData.get("rc") as Blob | null

        if (!aadhar || !drivingLicence || !rc) {
            return Response.json({ message: "all documents are required" }, { status: 400 })
        }

        const updatePayload: any = {
            status: "pending"
        }

        if (aadhar) {
            const aadharUrl = await uploadToCloudinary(aadhar)
            if (!aadharUrl) {
                return Response.json({ message: "Aadhar url fail" }, { status: 500 })
            }
            updatePayload.aadharUrl = aadharUrl
        }
        if (drivingLicence) {
            const licenceUrl = await uploadToCloudinary(drivingLicence)
            if (!licenceUrl) {
                return Response.json({ message: "Driving Licence url fail" }, { status: 500 })
            }
            updatePayload.licenseUrl = licenceUrl
        }
        if (rc) {
            const rcUrl = await uploadToCloudinary(rc)
            if (!rcUrl) {
                return Response.json({ message: "RC url fail" }, { status: 500 })
            }
            updatePayload.rcUrl = rcUrl
        }

        const partnerDocs = await PartnerDocs.findOneAndUpdate({ owner: user._id },
            { $set: updatePayload },
            { upsert: true, new: true }
        )

        if (user.partnerOnboardingStep < 2) {
            user.partnerOnboardingStep = 2
        }
        user.partnerStatus = "pending"
        await user.save()
        return Response.json(partnerDocs, { status: 200 })
    } catch (error: any) {
        require('fs').writeFileSync('last_error.txt', error.stack || error.toString());
        console.log(error)
        return Response.json({ message: "Internal Server Error", error: error.message }, { status: 500 })
    }
}