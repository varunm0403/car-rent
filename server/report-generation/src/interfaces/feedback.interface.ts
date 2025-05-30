export interface IFeedbackInterface {
  _id: string;
  clientId: string;
  carId: string;
  bookingId: string;
  rating: string;
  feedbackText: string;
  createdAt: Date;
}