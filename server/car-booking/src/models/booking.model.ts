import mongoose, { Document, Schema } from 'mongoose';
export interface IBooking extends Document {
    userId:string;
    carId:string;
    pickupLocation:string;
    dropoffLocation:string;
    pickupDate:Date;
    dropoffDate:Date;
    status:'Reserved'|'Cancelled'|'Completed';
}
const bookingSchema = new Schema<IBooking>({
    userId: { type: String, required: true },
    carId: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    dropoffDate: { type: Date, required: true },
    status: { type: String, enum: ['Reserved', 'Cancelled', 'Completed'], default: 'Reserved' }
}, {
    timestamps:true
});
export default mongoose.model<IBooking>('Booking', bookingSchema);