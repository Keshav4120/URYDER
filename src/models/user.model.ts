import mongoose, { Document, Mongoose } from "mongoose";
type VideoKycStatus = "not_required" | "pending" | "in_progress" | "approved" | "rejected" | "re_requested"

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: "user" | "partner" | "admin"
    isEmailVerified?: boolean
    otp?: string
    otpExpires?: Date
    partnerOnboardingStep: number
    mobileNumber?: string
    partnerStatus: "pending" | "approved" | "rejected"
    rejectionReason?: string
    videoKycStatus: VideoKycStatus,
    videoKycRoomId?: string,
    videoKycRejectionReason?: string,
    currentLocation?: {
        type: string,
        coordinates: [number, number]
    },
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    role: {
        type: "String",
        default: "user",
        enum: ["user", "partner", "admin"]
    },
    isEmailVerified: {
        type: "boolean",
        default: false
    },
    partnerOnboardingStep: {
        type: Number,
        min: 0,
        max: 8,
        default: 0,
    },
    mobileNumber: {
        type: String,
    },
    partnerStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    rejectionReason: {
        type: String,
    },
    videoKycStatus: {
        type: String,
        enum: ["not_required", "pending", "in_progress", "approved", "rejected", "re_requested"],
        default: "not_required"
    },
    videoKycRoomId: {
        type: String,
    },
    videoKycRejectionReason: {
        type: String,
    },
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    }

}, { timestamps: true })

userSchema.index({ currentLocation: "2dsphere" });

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User