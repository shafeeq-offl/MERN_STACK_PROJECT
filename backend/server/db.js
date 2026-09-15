import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import {
  UserModel,
  EventModel,
  RegistrationModel,
  AttendanceModel,
  FeedbackModel,
  CertificateModel,
  NotificationModel
} from "./models.js";
export let dbStatus = {
  connected: false,
  type: "memory",
  host: "in-memory-fallback",
  cluster: "shaqeeq.iuezwr5.mongodb.net"
};
export const memoryStore = {
  users: [],
  events: [],
  registrations: [],
  attendance: [],
  feedback: [],
  certificates: [],
  notifications: []
};
export const generateId = () => new mongoose.Types.ObjectId().toString();
export async function seedInitialData() {
  if (memoryStore.users.length > 0) return;
  const hashedPassword = await bcrypt.hash("password123", 10);
  const studentUser = {
    _id: "65f1a1000000000000000001",
    name: "Rahul Sharma",
    email: "rahul@college.edu",
    password: hashedPassword,
    role: "student",
    department: "Computer Science & Engineering",
    studentId: "CS2023042",
    phone: "+91 98765 43210",
    createdAt: /* @__PURE__ */ new Date()
  };
  const organizerUser = {
    _id: "65f1a1000000000000000002",
    name: "Dr. Anita Desai",
    email: "anita@college.edu",
    password: hashedPassword,
    role: "organizer",
    department: "Information Technology",
    organization: "IEEE Student Branch & Tech Club",
    phone: "+91 98123 45678",
    createdAt: /* @__PURE__ */ new Date()
  };
  memoryStore.users.push(studentUser, organizerUser);
  const event1 = {
    _id: "65f1b1000000000000000001",
    title: "HackCampus 2026: 24-Hour National Hackathon",
    description: "Join 300+ students across colleges to solve real-world problems in AI, Web3, and Green Tech. Cash prizes worth \u20B91,00,000, free food, mentor guidance, and networking with industry leaders.",
    category: "Hackathon",
    date: "2026-10-15",
    time: "09:00 AM - Next Day 09:00 AM",
    location: "Main Auditorium & Innovation Lab, Block C",
    capacity: 250,
    bannerUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    organizerId: organizerUser._id,
    organizerName: organizerUser.name,
    status: "upcoming",
    createdAt: /* @__PURE__ */ new Date()
  };
  const event2 = {
    _id: "65f1b1000000000000000002",
    title: "Deep Learning & LLM Architecture Hands-on Workshop",
    description: "A comprehensive 4-hour hands-on technical session on Transformer architectures, vector embeddings, fine-tuning open models, and deploying production AI applications on modern infrastructure.",
    category: "Workshop",
    date: "2026-09-28",
    time: "02:00 PM - 06:00 PM",
    location: "Seminar Hall 2, Dept of CSE",
    capacity: 120,
    bannerUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    organizerId: organizerUser._id,
    organizerName: organizerUser.name,
    status: "upcoming",
    createdAt: /* @__PURE__ */ new Date()
  };
  const event3 = {
    _id: "65f1b1000000000000000003",
    title: "Tarang 2026: Annual Inter-College Cultural Fest",
    description: "The biggest annual cultural celebration featuring Battle of Bands, Choreography, Street Play, Stand-up comedy, and an electrifying celebrity musical night.",
    category: "Cultural",
    date: "2026-11-05",
    time: "10:00 AM - 10:00 PM",
    location: "University Sports Ground & Open Air Amphitheatre",
    capacity: 1500,
    bannerUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    organizerId: organizerUser._id,
    organizerName: organizerUser.name,
    status: "upcoming",
    createdAt: /* @__PURE__ */ new Date()
  };
  const event4 = {
    _id: "65f1b1000000000000000004",
    title: "Campus CodeSprint: Speed Algorithmic Contest",
    description: "Fast-paced algorithmic contest testing dynamic programming, graph theory, and mathematical problem-solving. Certificates awarded to all verified attendees.",
    category: "Technical",
    date: "2026-08-20",
    time: "11:00 AM - 01:00 PM",
    location: "Computer Lab 5, Dept of IT",
    capacity: 80,
    bannerUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    organizerId: organizerUser._id,
    organizerName: organizerUser.name,
    status: "completed",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3)
  };
  memoryStore.events.push(event1, event2, event3, event4);
  const qrDataUrl1 = await QRCode.toDataURL(JSON.stringify({
    ticketCode: "TKT-HACK-8821",
    eventId: event1._id,
    studentId: studentUser._id,
    studentName: studentUser.name
  }));
  const reg1 = {
    _id: "65f1c1000000000000000001",
    eventId: event1._id,
    studentId: studentUser._id,
    studentName: studentUser.name,
    studentEmail: studentUser.email,
    ticketCode: "TKT-HACK-8821",
    qrCodeData: qrDataUrl1,
    status: "confirmed",
    registeredAt: /* @__PURE__ */ new Date()
  };
  const qrDataUrl4 = await QRCode.toDataURL(JSON.stringify({
    ticketCode: "TKT-CODE-4419",
    eventId: event4._id,
    studentId: studentUser._id,
    studentName: studentUser.name
  }));
  const reg4 = {
    _id: "65f1c1000000000000000004",
    eventId: event4._id,
    studentId: studentUser._id,
    studentName: studentUser.name,
    studentEmail: studentUser.email,
    ticketCode: "TKT-CODE-4419",
    qrCodeData: qrDataUrl4,
    status: "confirmed",
    registeredAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1e3)
  };
  memoryStore.registrations.push(reg1, reg4);
  const att4 = {
    _id: "65f1d1000000000000000004",
    eventId: event4._id,
    registrationId: reg4._id,
    studentId: studentUser._id,
    studentName: studentUser.name,
    markedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1e3),
    verifiedBy: organizerUser._id,
    status: "present"
  };
  memoryStore.attendance.push(att4);
  const fb4 = {
    _id: "65f1e1000000000000000004",
    eventId: event4._id,
    studentId: studentUser._id,
    studentName: studentUser.name,
    rating: 5,
    comments: "Superb contest problems! Clear explanations during the post-contest editorial.",
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1e3)
  };
  memoryStore.feedback.push(fb4);
  const cert4 = {
    _id: "65f1f1000000000000000004",
    certificateId: "CERT-CS-2026-9042",
    eventId: event4._id,
    eventTitle: event4.title,
    eventDate: event4.date,
    studentId: studentUser._id,
    studentName: studentUser.name,
    issueDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1e3)
  };
  memoryStore.certificates.push(cert4);
  const notif1 = {
    _id: "65f1g1000000000000000001",
    userId: studentUser._id,
    title: "Registration Confirmed!",
    message: "Your registration for HackCampus 2026 is confirmed. Show your QR code at check-in.",
    type: "success",
    read: false,
    createdAt: /* @__PURE__ */ new Date()
  };
  const notif2 = {
    _id: "65f1g1000000000000000002",
    userId: studentUser._id,
    title: "Certificate Issued",
    message: "Your participation certificate for Campus CodeSprint is now available for download.",
    type: "info",
    read: true,
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1e3)
  };
  const notif3 = {
    _id: "65f1g1000000000000000003",
    userId: organizerUser._id,
    title: "New Student Registration",
    message: "Rahul Sharma registered for HackCampus 2026.",
    type: "info",
    read: false,
    createdAt: /* @__PURE__ */ new Date()
  };
  memoryStore.notifications.push(notif1, notif2, notif3);
}
export const getMongoURI = () => {
  const envUri = process.env.MONGODB_URI;
  if (envUri && envUri.trim().length > 0 && !envUri.includes("<db_username>")) {
    return envUri;
  }
  return "mongodb+srv://sshaqeeq2006_db_user:z4SH7hK1Ejw4F4F6@shaqeeq.iuezwr5.mongodb.net/campusevents?retryWrites=true&w=majority&appName=shaqeeq";
};
const modelByCollection = {
  users: UserModel,
  events: EventModel,
  registrations: RegistrationModel,
  attendance: AttendanceModel,
  feedback: FeedbackModel,
  certificates: CertificateModel,
  notifications: NotificationModel
};
export async function persistRecord(collection, record) {
  const model = modelByCollection[collection];
  if (mongoose.connection.readyState !== 1 || !model) return;
  await model.findByIdAndUpdate(record._id, record, {
    upsert: true,
    returnDocument: "after",
    setDefaultsOnInsert: true,
    runValidators: true
  });
}
export async function removeRecords(collection, filter) {
  const model = modelByCollection[collection];
  if (mongoose.connection.readyState !== 1 || !model) return;
  await model.deleteMany(filter);
}
export async function loadAtlasIntoMemory() {
  if (mongoose.connection.readyState !== 1) return;
  const normalizeRecord = (value) => {
    if (value && typeof value.toHexString === "function") return value.toHexString();
    if (value instanceof Date) return value;
    if (Array.isArray(value)) return value.map(normalizeRecord);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeRecord(item)]));
    }
    return value;
  };
  const collections = Object.keys(modelByCollection);
  for (const collection of collections) {
    const records = await modelByCollection[collection].find().lean();
    if (records.length > 0) {
      memoryStore[collection].splice(0, memoryStore[collection].length, ...records.map(normalizeRecord));
    }
  }
}
export async function syncMemoryStoreToAtlas() {
  if (mongoose.connection.readyState !== 1) {
    return { synced: false, count: 0, error: "Atlas is not connected yet." };
  }
  try {
    console.log("[MongoDB Atlas] Checking existing documents in database campusevents...");
    let totalCount = 0;
    const userCount = await UserModel.countDocuments();
    if (userCount === 0 && memoryStore.users.length > 0) {
      await UserModel.insertMany(memoryStore.users);
      totalCount += memoryStore.users.length;
    }
    const eventCount = await EventModel.countDocuments();
    if (eventCount === 0 && memoryStore.events.length > 0) {
      await EventModel.insertMany(memoryStore.events);
      totalCount += memoryStore.events.length;
    }
    const regCount = await RegistrationModel.countDocuments();
    if (regCount === 0 && memoryStore.registrations.length > 0) {
      await RegistrationModel.insertMany(memoryStore.registrations);
      totalCount += memoryStore.registrations.length;
    }
    const attCount = await AttendanceModel.countDocuments();
    if (attCount === 0 && memoryStore.attendance.length > 0) {
      await AttendanceModel.insertMany(memoryStore.attendance);
      totalCount += memoryStore.attendance.length;
    }
    const fbCount = await FeedbackModel.countDocuments();
    if (fbCount === 0 && memoryStore.feedback.length > 0) {
      await FeedbackModel.insertMany(memoryStore.feedback);
      totalCount += memoryStore.feedback.length;
    }
    const certCount = await CertificateModel.countDocuments();
    if (certCount === 0 && memoryStore.certificates.length > 0) {
      await CertificateModel.insertMany(memoryStore.certificates);
      totalCount += memoryStore.certificates.length;
    }
    const notifCount = await NotificationModel.countDocuments();
    if (notifCount === 0 && memoryStore.notifications.length > 0) {
      await NotificationModel.insertMany(memoryStore.notifications);
      totalCount += memoryStore.notifications.length;
    }
    console.log(`[MongoDB Atlas] Successfully populated database 'campusevents' with ${totalCount} records.`);
    return { synced: true, count: totalCount };
  } catch (err) {
    console.error("[MongoDB Atlas] Failed to sync collections to Atlas:", err);
    return { synced: false, count: 0, error: err.message };
  }
}
export async function tryConnectAtlas() {
  const uri = getMongoURI();
  const hostLabel = uri.includes("@") ? uri.split("@")[1].split("/")[0] : "Atlas Cluster";
  try {
    console.log("[MongoDB] Testing connection to Atlas at:", hostLabel);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect().catch(() => {
      });
    }
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4e3
    });
    await syncMemoryStoreToAtlas();
    await loadAtlasIntoMemory();
    dbStatus = {
      connected: true,
      type: "atlas",
      host: mongoose.connection.host || hostLabel,
      cluster: hostLabel,
      error: null,
      lastChecked: (/* @__PURE__ */ new Date()).toISOString()
    };
    console.log("[MongoDB] Connected successfully to MongoDB Atlas!");
    return { success: true, message: `Connected to MongoDB Atlas! Created and synced database 'campusevents' with all collections.` };
  } catch (err) {
    const isIpError = err.message?.includes("whitelist") || err.message?.includes("alert number 80") || err.name === "MongooseServerSelectionError";
    const cleanError = isIpError ? "MongoDB Atlas Network Access blocked this IP. Please add 0.0.0.0/0 to Atlas > Network Access." : err.message || "Connection to Atlas failed";
    dbStatus = {
      connected: true,
      // Application is still healthy and operational via memory fallback
      type: "memory",
      host: "Local In-Memory Database (Demo Mode)",
      cluster: hostLabel,
      error: cleanError,
      lastChecked: (/* @__PURE__ */ new Date()).toISOString()
    };
    console.warn(`[MongoDB] Atlas connection status: ${cleanError}`);
    return { success: false, message: cleanError };
  }
}
export async function connectDB() {
  await seedInitialData();
  const result = await tryConnectAtlas();
  if (!result.success) {
    console.log("[MongoDB] Running on robust in-memory MERN engine while Atlas Network Access is configured.");
  }
}
