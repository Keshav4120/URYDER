import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/user.model";
import Vehicle from "@/models/vehicle.model";

export async function POST(req: Request) {
    try {
        const { lng, lat, type, radius = 5000 } = await req.json(); // radius in meters

        if (typeof lng !== 'number' || typeof lat !== 'number') {
            return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
        }

        await dbConnect();

        // 1. Find nearby approved partners
        const nearbyPartners = await User.find({
            role: "partner",
            partnerStatus: "approved",
            currentLocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    $maxDistance: radius
                }
            }
        }).select("_id name mobileNumber currentLocation");

        const partnerIds = nearbyPartners.map(p => p._id);

        // 2. Find their vehicles matching the type
        const query: any = {
            owner: { $in: partnerIds },
            status: "approved",
            isActive: true
        };

        if (type && type !== 'all') {
            query.type = type;
        }

        const vehicles = await Vehicle.find(query).populate("owner", "name mobileNumber currentLocation");

        return NextResponse.json({ success: true, vehicles });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
