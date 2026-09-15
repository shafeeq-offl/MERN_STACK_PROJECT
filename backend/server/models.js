import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "organizer"], default: "student" },
  department: { type: String, default: "Computer Science & Engineering" },
  studentId: { type: String, default: "" },
  organization: { type: String, default: "Campus Technical Club" },
  phone: { type: String, default: "" },
  profilePicture: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["Technical", "Cultural", "Sports", "Workshop", "Seminar", "Hackathon"],
    default: "Technical"
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, default: 100 },
  bannerUrl: { type: String, default: "" },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  organizerName: { type: String, required: true },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming"
  },
  createdAt: { type: Date, default: Date.now }
});
const registrationSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  ticketCode: { type: String, required: true, unique: true },
  qrCodeData: { type: String },
  // Base64 data URL of the QR code
  status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  registeredAt: { type: Date, default: Date.now }
});
const attendanceSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  registrationId: { type: mongoose.Schema.Types.ObjectId, ref: "Registration", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, required: true },
  markedAt: { type: Date, default: Date.now },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "present" }
});
const feedbackSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comments: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  eventTitle: { type: String, required: true },
  eventDate: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, required: true },
  issueDate: { type: Date, default: Date.now }
});
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["info", "success", "warning"], default: "info" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export const EventModel = mongoose.models.Event || mongoose.model("Event", eventSchema);
export const RegistrationModel = mongoose.models.Registration || mongoose.model("Registration", registrationSchema);
export const AttendanceModel = mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
export const FeedbackModel = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
export const CertificateModel = mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);
export const NotificationModel = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
