import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/user.model";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { lng, lat } = await req.json();
        if (typeof lng !== 'number' || typeof lat !== 'number') {
            return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
        }

        await dbConnect();

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                currentLocation: {
                    type: "Point",
                    coordinates: [lng, lat]
                }
            },
            { new: true }
        );

        return NextResponse.json({ success: true, location: updatedUser.currentLocation });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
