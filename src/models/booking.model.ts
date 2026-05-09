import mongoose from "mongoose";

export interface IBooking {
    user: mongoose.Types.ObjectId;
    partner?: mongoose.Types.ObjectId;
    vehicle?: mongoose.Types.ObjectId;
    pickup: {
        address: string;
        coordinates: [number, number]; // [lng, lat]
    };
    drop: {
        address: string;
        coordinates: [number, number]; // [lng, lat]
    };
    vehicleType: string;
    fare: number;
    status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled" | "rejected";
    paymentStatus: "pending" | "completed" | "failed";
    paymentMethod: "cash" | "online";
    cancelReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
    },
    pickup: {
        address: { type: String, required: true },
        coordinates: { type: [Number], required: true },
    },
    drop: {
        address: { type: String, required: true },
        coordinates: { type: [Number], required: true },
    },
    vehicleType: {
        type: String,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "in_progress", "completed", "cancelled", "rejected"],
        default: "pending",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "online"],
        default: "cash",
    },
    cancelReason: {
        type: String,
    },
}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
