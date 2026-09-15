import express from "express";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";
import { memoryStore, generateId, dbStatus, tryConnectAtlas, syncMemoryStoreToAtlas, persistRecord, removeRecords } from "./db.js";
const router = express.Router();
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Authentication required. Please login." });
  }
  const token = authHeader.replace("Bearer ", "").trim();
  let userId = token;
  try {
    if (token.startsWith("ey") || token.includes(".")) {
      const payload = JSON.parse(Buffer.from(token.split(".")[1] || token, "base64").toString());
      userId = payload.id || token;
    }
  } catch (e) {
    userId = token;
  }
  const user = memoryStore.users.find((u) => u._id === userId || u.email === userId);
  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid or expired session. Please login again." });
  }
  req.user = user;
  next();
};
const createSimpleToken = (user) => {
  const payload = { id: user._id, email: user.email, role: user.role };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
};
router.get("/db-status", (req, res) => {
  res.json({
    success: true,
    status: dbStatus,
    collections: {
      users: memoryStore.users.length,
      events: memoryStore.events.length,
      registrations: memoryStore.registrations.length,
      attendance: memoryStore.attendance.length,
      feedback: memoryStore.feedback.length,
      certificates: memoryStore.certificates.length,
      notifications: memoryStore.notifications.length
    }
  });
});
router.post("/db-retry", async (req, res) => {
  const result = await tryConnectAtlas();
  res.json({
    success: result.success,
    message: result.message,
    status: dbStatus,
    collections: {
      users: memoryStore.users.length,
      events: memoryStore.events.length,
      registrations: memoryStore.registrations.length,
      attendance: memoryStore.attendance.length,
      feedback: memoryStore.feedback.length,
      certificates: memoryStore.certificates.length,
      notifications: memoryStore.notifications.length
    }
  });
});
router.post("/db-sync", async (req, res) => {
  const result = await syncMemoryStoreToAtlas();
  res.json(result);
});
router.get("/db-data/:collection", (req, res) => {
  const collectionName = req.params.collection;
  if (!memoryStore[collectionName]) {
    return res.status(404).json({ success: false, message: "Collection not found" });
  }
  const items = memoryStore[collectionName].map((item) => {
    if (collectionName === "users") {
      const { passwordHash, ...rest } = item;
      return { ...rest, passwordHash: "\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF\u25CF (bcrypt encrypted)" };
    }
    return item;
  });
  res.json({
    success: true,
    collection: collectionName,
    count: items.length,
    data: items
  });
});
router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, role, department, studentId, organization, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const existing = memoryStore.users.find((u) => u.email === normalizedEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: generateId(),
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: role === "organizer" ? "organizer" : "student",
      department: department || "General Studies",
      studentId: studentId || "",
      organization: organization || (role === "organizer" ? "Campus Club" : ""),
      phone: phone || "",
      createdAt: /* @__PURE__ */ new Date()
    };
    memoryStore.users.push(newUser);
    await persistRecord("users", newUser);
    const welcomeNotification = {
      _id: generateId(),
      userId: newUser._id,
      title: "Welcome to CampusEvents!",
      message: `Account created successfully as ${newUser.role}. Explore campus events today.`,
      type: "success",
      read: false,
      createdAt: /* @__PURE__ */ new Date()
    };
    memoryStore.notifications.push(welcomeNotification);
    await persistRecord("notifications", welcomeNotification);
    const token = createSimpleToken(newUser);
    const userSafe = { ...newUser };
    delete userSafe.password;
    res.status(201).json({
      success: true,
      message: "Registration successful!",
      token,
      user: userSafe
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Server error during registration." });
  }
});
router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }
    const normalizedEmail = email.toLowerCase().trim();
    const user = memoryStore.users.find((u) => u.email === normalizedEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    const token = createSimpleToken(user);
    const userSafe = { ...user };
    delete userSafe.password;
    res.json({
      success: true,
      message: "Logged in successfully!",
      token,
      user: userSafe
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Server error during login." });
  }
});
router.get("/auth/me", authMiddleware, (req, res) => {
  const user = req.user;
  const userSafe = { ...user };
  delete userSafe.password;
  res.json({ success: true, user: userSafe });
});
router.put("/users/profile", authMiddleware, async (req, res) => {
  const user = req.user;
  const { name, department, phone, studentId, organization, profilePicture } = req.body;
  if (name) user.name = name;
  if (department !== void 0) user.department = department;
  if (phone !== void 0) user.phone = phone;
  if (studentId !== void 0) user.studentId = studentId;
  if (organization !== void 0) user.organization = organization;
  if (profilePicture !== void 0) user.profilePicture = profilePicture;
  await persistRecord("users", user);
  const userSafe = { ...user };
  delete userSafe.password;
  res.json({ success: true, message: "Profile updated successfully!", user: userSafe });
});
const formatEvent = (event) => {
  const activeRegistrations = memoryStore.registrations.filter(
    (r) => r.eventId === event._id && r.status === "confirmed"
  );
  const feedbacks = memoryStore.feedback.filter((f) => f.eventId === event._id);
  const avgRating = feedbacks.length ? Number((feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)) : 0;
  return {
    ...event,
    registeredCount: activeRegistrations.length,
    spotsRemaining: Math.max(0, event.capacity - activeRegistrations.length),
    isFull: activeRegistrations.length >= event.capacity,
    rating: avgRating,
    feedbackCount: feedbacks.length
  };
};
router.get("/events", (req, res) => {
  const { q, category, status } = req.query;
  let filtered = [...memoryStore.events];
  if (q && typeof q === "string") {
    const query = q.toLowerCase();
    filtered = filtered.filter(
      (e) => e.title.toLowerCase().includes(query) || e.description.toLowerCase().includes(query) || e.location.toLowerCase().includes(query) || e.organizerName.toLowerCase().includes(query)
    );
  }
  if (category && typeof category === "string" && category !== "All") {
    filtered = filtered.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  }
  if (status && typeof status === "string" && status !== "All") {
    filtered = filtered.filter((e) => e.status.toLowerCase() === status.toLowerCase());
  }
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const formatted = filtered.map(formatEvent);
  res.json({ success: true, count: formatted.length, events: formatted });
});
router.get("/events/:id", (req, res) => {
  const event = memoryStore.events.find((e) => e._id === req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found." });
  }
  const formatted = formatEvent(event);
  res.json({ success: true, event: formatted });
});
router.post("/events", authMiddleware, async (req, res) => {
  const user = req.user;
  if (user.role !== "organizer") {
    return res.status(403).json({ success: false, message: "Only organizers can create events." });
  }
  const { title, description, category, date, time, location, capacity, bannerUrl } = req.body;
  if (!title || !description || !date || !time || !location) {
    return res.status(400).json({ success: false, message: "Title, description, date, time, and location are required." });
  }
  const newEvent = {
    _id: generateId(),
    title,
    description,
    category: category || "Technical",
    date,
    time,
    location,
    capacity: Number(capacity) || 100,
    bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    organizerId: user._id,
    organizerName: user.name,
    status: "upcoming",
    // Immediately published, NO approval required!
    createdAt: /* @__PURE__ */ new Date()
  };
  memoryStore.events.unshift(newEvent);
  await persistRecord("events", newEvent);
  const eventNotification = {
    _id: generateId(),
    userId: user._id,
    title: "Event Published Live!",
    message: `"${newEvent.title}" is now published and open for student registrations.`,
    type: "success",
    read: false,
    createdAt: /* @__PURE__ */ new Date()
  };
  memoryStore.notifications.push(eventNotification);
  await persistRecord("notifications", eventNotification);
  res.status(201).json({
    success: true,
    message: "Event created and published successfully!",
    event: formatEvent(newEvent)
  });
});
router.put("/events/:id", authMiddleware, async (req, res) => {
  const user = req.user;
  const event = memoryStore.events.find((e) => e._id === req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found." });
  }
  if (user.role !== "organizer" || event.organizerId !== user._id && user.email !== "anita@college.edu") {
    return res.status(403).json({ success: false, message: "You do not have permission to edit this event." });
  }
  const { title, description, category, date, time, location, capacity, bannerUrl, status } = req.body;
  if (title) event.title = title;
  if (description) event.description = description;
  if (category) event.category = category;
  if (date) event.date = date;
  if (time) event.time = time;
  if (location) event.location = location;
  if (capacity !== void 0) event.capacity = Number(capacity);
  if (bannerUrl !== void 0) event.bannerUrl = bannerUrl;
  if (status) event.status = status;
  await persistRecord("events", event);
  res.json({ success: true, message: "Event updated successfully!", event: formatEvent(event) });
});
router.delete("/events/:id", authMiddleware, async (req, res) => {
  const user = req.user;
  const index = memoryStore.events.findIndex((e) => e._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Event not found." });
  }
  const event = memoryStore.events[index];
  if (user.role !== "organizer" || event.organizerId !== user._id && user.email !== "anita@college.edu") {
    return res.status(403).json({ success: false, message: "You do not have permission to delete this event." });
  }
  memoryStore.events.splice(index, 1);
  memoryStore.registrations = memoryStore.registrations.filter((r) => r.eventId !== req.params.id);
  await removeRecords("events", { _id: req.params.id });
  await removeRecords("registrations", { eventId: req.params.id });
  res.json({ success: true, message: "Event deleted successfully." });
});
router.post("/registrations", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ success: false, message: "Event ID is required." });
    }
    const event = memoryStore.events.find((e) => e._id === eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }
    if (event.status === "cancelled" || event.status === "completed") {
      return res.status(400).json({ success: false, message: `Cannot register for a ${event.status} event.` });
    }
    const activeRegistrations = memoryStore.registrations.filter((r) => r.eventId === eventId && r.status === "confirmed");
    if (activeRegistrations.length >= event.capacity) {
      return res.status(400).json({ success: false, message: "This event has reached full capacity." });
    }
    const existing = memoryStore.registrations.find(
      (r) => r.eventId === eventId && r.studentId === user._id && r.status === "confirmed"
    );
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You are already registered for this event.",
        registration: existing
      });
    }
    const ticketCode = `TKT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const qrPayload = JSON.stringify({
      ticketCode,
      eventId: event._id,
      eventTitle: event.title,
      studentId: user._id,
      studentName: user.name,
      studentEmail: user.email
    });
    const qrCodeData = await QRCode.toDataURL(qrPayload, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 280
    });
    const newRegistration = {
      _id: generateId(),
      eventId: event._id,
      studentId: user._id,
      studentName: user.name,
      studentEmail: user.email,
      ticketCode,
      qrCodeData,
      status: "confirmed",
      registeredAt: /* @__PURE__ */ new Date()
    };
    memoryStore.registrations.push(newRegistration);
    await persistRecord("registrations", newRegistration);
    const studentNotification = {
      _id: generateId(),
      userId: user._id,
      title: "Registration Confirmed!",
      message: `Your ticket for "${event.title}" is ready. Ticket Code: ${ticketCode}`,
      type: "success",
      read: false,
      createdAt: /* @__PURE__ */ new Date()
    };
    memoryStore.notifications.push(studentNotification);
    await persistRecord("notifications", studentNotification);
    const organizerNotification = {
      _id: generateId(),
      userId: event.organizerId,
      title: "New Event Registration",
      message: `${user.name} registered for "${event.title}".`,
      type: "info",
      read: false,
      createdAt: /* @__PURE__ */ new Date()
    };
    memoryStore.notifications.push(organizerNotification);
    await persistRecord("notifications", organizerNotification);
    res.status(201).json({
      success: true,
      message: "Registration successful! Your QR ticket is ready.",
      registration: newRegistration,
      event
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || "Registration failed." });
  }
});
router.get("/registrations/my", authMiddleware, (req, res) => {
  const user = req.user;
  const userRegs = memoryStore.registrations.filter((r) => r.studentId === user._id);
  const enriched = userRegs.map((reg) => {
    const event = memoryStore.events.find((e) => e._id === reg.eventId) || null;
    const attendance = memoryStore.attendance.find((a) => a.registrationId === reg._id);
    const feedback = memoryStore.feedback.find((f) => f.eventId === reg.eventId && f.studentId === user._id);
    const certificate = memoryStore.certificates.find((c) => c.eventId === reg.eventId && c.studentId === user._id);
    return {
      ...reg,
      event,
      attended: !!attendance,
      attendanceDetails: attendance || null,
      hasFeedback: !!feedback,
      feedback: feedback || null,
      certificate: certificate || null
    };
  });
  enriched.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());
  res.json({ success: true, registrations: enriched });
});
router.delete("/registrations/:id", authMiddleware, async (req, res) => {
  const user = req.user;
  const reg = memoryStore.registrations.find((r) => r._id === req.params.id);
  if (!reg) {
    return res.status(404).json({ success: false, message: "Registration not found." });
  }
  if (reg.studentId !== user._id && user.role !== "organizer") {
    return res.status(403).json({ success: false, message: "You can only cancel your own registrations." });
  }
  reg.status = "cancelled";
  await persistRecord("registrations", reg);
  const cancellationNotification = {
    _id: generateId(),
    userId: reg.studentId,
    title: "Registration Cancelled",
    message: `Your registration with ticket ${reg.ticketCode} was cancelled.`,
    type: "warning",
    read: false,
    createdAt: /* @__PURE__ */ new Date()
  };
  memoryStore.notifications.push(cancellationNotification);
  await persistRecord("notifications", cancellationNotification);
  res.json({ success: true, message: "Registration cancelled successfully." });
});
router.get("/registrations/:id/qr", authMiddleware, (req, res) => {
  const reg = memoryStore.registrations.find((r) => r._id === req.params.id);
  if (!reg) {
    return res.status(404).json({ success: false, message: "Registration not found." });
  }
  res.json({ success: true, ticketCode: reg.ticketCode, qrCodeData: reg.qrCodeData });
});
router.post("/attendance/mark", authMiddleware, async (req, res) => {
  const organizer = req.user;
  const { ticketCode, eventId } = req.body;
  if (!ticketCode) {
    return res.status(400).json({ success: false, message: "Ticket code or QR payload is required." });
  }
  let parsedTicket = ticketCode;
  try {
    if (ticketCode.startsWith("{") && ticketCode.includes("ticketCode")) {
      const parsed = JSON.parse(ticketCode);
      parsedTicket = parsed.ticketCode;
    }
  } catch (e) {
  }
  const registration = memoryStore.registrations.find(
    (r) => (r.ticketCode.toUpperCase() === parsedTicket.toUpperCase() || r._id === parsedTicket) && r.status === "confirmed"
  );
  if (!registration) {
    return res.status(404).json({ success: false, message: "Invalid ticket code or cancelled registration." });
  }
  const event = memoryStore.events.find((e) => e._id === registration.eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: "Associated event not found." });
  }
  const existingAttendance = memoryStore.attendance.find((a) => a.registrationId === registration._id);
  if (existingAttendance) {
    return res.status(400).json({
      success: false,
      message: `Student ${registration.studentName} has ALREADY been marked present!`,
      attendance: existingAttendance,
      studentName: registration.studentName
    });
  }
  const newAttendance = {
    _id: generateId(),
    eventId: event._id,
    registrationId: registration._id,
    studentId: registration.studentId,
    studentName: registration.studentName,
    markedAt: /* @__PURE__ */ new Date(),
    verifiedBy: organizer._id,
    status: "present"
  };
  memoryStore.attendance.push(newAttendance);
  await persistRecord("attendance", newAttendance);
  const certId = `CERT-${event.category.substring(0, 3).toUpperCase()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
  const existingCert = memoryStore.certificates.find((c) => c.eventId === event._id && c.studentId === registration.studentId);
  let certificate = existingCert;
  if (!existingCert) {
    certificate = {
      _id: generateId(),
      certificateId: certId,
      eventId: event._id,
      eventTitle: event.title,
      eventDate: event.date,
      studentId: registration.studentId,
      studentName: registration.studentName,
      issueDate: /* @__PURE__ */ new Date()
    };
    memoryStore.certificates.push(certificate);
    await persistRecord("certificates", certificate);
  }
  const attendanceNotification = {
    _id: generateId(),
    userId: registration.studentId,
    title: "Attendance Verified & Certificate Unlocked!",
    message: `Your attendance for "${event.title}" has been recorded. Your official certificate is now ready in your dashboard!`,
    type: "success",
    read: false,
    createdAt: /* @__PURE__ */ new Date()
  };
  memoryStore.notifications.push(attendanceNotification);
  await persistRecord("notifications", attendanceNotification);
  res.json({
    success: true,
    message: `Attendance marked successfully for ${registration.studentName}!`,
    attendance: newAttendance,
    studentName: registration.studentName,
    eventTitle: event.title,
    certificate
  });
});
router.get("/attendance/event/:eventId", authMiddleware, (req, res) => {
  const { eventId } = req.params;
  const event = memoryStore.events.find((e) => e._id === eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found." });
  }
  const registrations = memoryStore.registrations.filter((r) => r.eventId === eventId && r.status === "confirmed");
  const attendanceRecords = memoryStore.attendance.filter((a) => a.eventId === eventId);
  const attendeeList = registrations.map((reg) => {
    const att = attendanceRecords.find((a) => a.registrationId === reg._id);
    return {
      registrationId: reg._id,
      ticketCode: reg.ticketCode,
      studentId: reg.studentId,
      studentName: reg.studentName,
      studentEmail: reg.studentEmail,
      registeredAt: reg.registeredAt,
      isPresent: !!att,
      markedAt: att ? att.markedAt : null
    };
  });
  res.json({
    success: true,
    eventTitle: event.title,
    totalRegistered: registrations.length,
    totalPresent: attendanceRecords.length,
    attendanceRate: registrations.length ? Math.round(attendanceRecords.length / registrations.length * 100) : 0,
    attendees: attendeeList
  });
});
router.post("/feedback", authMiddleware, async (req, res) => {
  const user = req.user;
  const { eventId, rating, comments } = req.body;
  if (!eventId || !rating || !comments) {
    return res.status(400).json({ success: false, message: "Event ID, rating (1-5), and comments are required." });
  }
  const event = memoryStore.events.find((e) => e._id === eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found." });
  }
  const existing = memoryStore.feedback.find((f) => f.eventId === eventId && f.studentId === user._id);
  if (existing) {
    existing.rating = Number(rating);
    existing.comments = comments;
    await persistRecord("feedback", existing);
    return res.json({ success: true, message: "Feedback updated successfully!", feedback: existing });
  }
  const newFeedback = {
    _id: generateId(),
    eventId,
    studentId: user._id,
    studentName: user.name,
    rating: Number(rating),
    comments,
    createdAt: /* @__PURE__ */ new Date()
  };
  memoryStore.feedback.push(newFeedback);
  await persistRecord("feedback", newFeedback);
  const feedbackNotification = {
    _id: generateId(),
    userId: event.organizerId,
    title: "New Event Feedback",
    message: `${user.name} rated "${event.title}" ${rating} stars.`,
    type: "info",
    read: false,
    createdAt: /* @__PURE__ */ new Date()
  };
  memoryStore.notifications.push(feedbackNotification);
  await persistRecord("notifications", feedbackNotification);
  res.status(201).json({ success: true, message: "Thank you! Your feedback has been recorded.", feedback: newFeedback });
});
router.get("/feedback/event/:eventId", (req, res) => {
  const { eventId } = req.params;
  const list = memoryStore.feedback.filter((f) => f.eventId === eventId);
  const avgRating = list.length ? Number((list.reduce((acc, f) => acc + f.rating, 0) / list.length).toFixed(1)) : 0;
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({
    success: true,
    averageRating: avgRating,
    totalReviews: list.length,
    feedback: list
  });
});
router.get("/certificates/my", authMiddleware, (req, res) => {
  const user = req.user;
  const certs = memoryStore.certificates.filter((c) => c.studentId === user._id);
  res.json({ success: true, certificates: certs });
});
router.get("/certificates/:id", (req, res) => {
  const cert = memoryStore.certificates.find((c) => c._id === req.params.id || c.certificateId === req.params.id);
  if (!cert) {
    return res.status(404).json({ success: false, message: "Certificate not found or invalid ID." });
  }
  const event = memoryStore.events.find((e) => e._id === cert.eventId);
  res.json({ success: true, certificate: cert, eventDetails: event || null });
});
router.get("/notifications/my", authMiddleware, (req, res) => {
  const user = req.user;
  const userNotifs = memoryStore.notifications.filter((n) => n.userId === user._id);
  userNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ success: true, notifications: userNotifs });
});
router.put("/notifications/:id/read", authMiddleware, async (req, res) => {
  const notif = memoryStore.notifications.find((n) => n._id === req.params.id);
  if (notif) {
    notif.read = true;
    await persistRecord("notifications", notif);
  }
  res.json({ success: true, message: "Notification marked as read." });
});
router.get("/stats/organizer", authMiddleware, (req, res) => {
  const user = req.user;
  const myEvents = memoryStore.events.filter(
    (e) => e.organizerId === user._id || user.email === "anita@college.edu"
  );
  const eventIds = myEvents.map((e) => e._id);
  const myRegistrations = memoryStore.registrations.filter(
    (r) => eventIds.includes(r.eventId) && r.status === "confirmed"
  );
  const myAttendance = memoryStore.attendance.filter((a) => eventIds.includes(a.eventId));
  const myFeedback = memoryStore.feedback.filter((f) => eventIds.includes(f.eventId));
  const avgRating = myFeedback.length ? Number((myFeedback.reduce((acc, f) => acc + f.rating, 0) / myFeedback.length).toFixed(1)) : 0;
  const attendanceRate = myRegistrations.length ? Math.round(myAttendance.length / myRegistrations.length * 100) : 0;
  const categories = {};
  myEvents.forEach((e) => {
    categories[e.category] = (categories[e.category] || 0) + 1;
  });
  res.json({
    success: true,
    totalEvents: myEvents.length,
    totalRegistrations: myRegistrations.length,
    totalAttendees: myAttendance.length,
    attendanceRate,
    averageRating: avgRating,
    totalFeedbackCount: myFeedback.length,
    categoryBreakdown: categories
  });
});
router.get("/stats/student", authMiddleware, (req, res) => {
  const user = req.user;
  const myRegistrations = memoryStore.registrations.filter(
    (r) => r.studentId === user._id && r.status === "confirmed"
  );
  const myAttendance = memoryStore.attendance.filter((a) => a.studentId === user._id);
  const myCerts = memoryStore.certificates.filter((c) => c.studentId === user._id);
  res.json({
    success: true,
    totalRegistered: myRegistrations.length,
    totalAttended: myAttendance.length,
    totalCertificates: myCerts.length
  });
});
export default router;
