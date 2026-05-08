import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";
import { NextRequest } from "next/server";

const vechile_regular_expresion = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

export async function POST(req: Request) {
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

        const { type, number, model } = await req.json()
        if (!type || !number || !model) {
            return Response.json({ status: 400, message: "All fields are required" })
        }


        const formattedNumber = number.replace(/\s+/g, "").toUpperCase();

        if (!vechile_regular_expresion.test(formattedNumber)) {
            return Response.json(
                { message: "Invalid vehicle number" }
                , { status: 400 })
        }

        const duplicateVehicle = await Vehicle.findOne({ number: formattedNumber });

        if (duplicateVehicle && duplicateVehicle.owner.toString() !== user._id.toString()) {
            return Response.json(
                { message: "Vehicle number already exists or vehicle already registered" }
                , { status: 400 })
        }

        let vehicle = await Vehicle.findOne({ owner: user._id })
        if (vehicle) {
            vehicle.type = type;
            vehicle.number = formattedNumber;
            vehicle.vechicleModel = model;
            vehicle.status = "pending";
            await vehicle.save();
            return Response.json(vehicle, { status: 200 })
        }

        vehicle = await Vehicle.create({
            owner: user._id,
            type,
            number: formattedNumber,
            vechicleModel: model
        })

        if (user.partnerOnboardingStep < 1) {
            user.partnerOnboardingStep = 1;
        }
        user.role = "partner"
        user.partnerStatus = "pending"
        await user.save();
        return Response.json(vehicle, { status: 201 })




    } catch (error) {
        console.log(error)
        return Response.json({ message: "Internal Server Error" }, { status: 500 })

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

        const vehicle = await Vehicle.findOne({ owner: user._id })
        if (vehicle) {
            return Response.json(vehicle, { status: 200 })
        } else {
            return Response.json(null, { status: 404 })
        }
    } catch (error) {
        console.log(error)
        return Response.json({ message: "Internal Server Error" }, { status: 500 })
    }
}