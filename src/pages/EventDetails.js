import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  ArrowLeft,
  QrCode,
  CheckCircle2,
  XCircle,
  Send,
  Award,
  ShieldCheck,
  Tag
} from "lucide-react";
import api from "../services/api.js";
import { QRCodeModal } from "../components/QRCodeModal.js";
import { useAuth } from "../context/AuthContext.js";
export const EventDetails = ({ onOpenAuth }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [userRegistration, setUserRegistration] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const fetchEventData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.event);
      }
      const fbRes = await api.get(`/feedback/event/${id}`);
      if (fbRes.data.success) {
        setFeedbackList(fbRes.data.feedback);
        setAvgRating(fbRes.data.averageRating);
      }
    } catch (err) {
      console.error("Failed to load event details", err);
    } finally {
      setLoading(false);
    }
  };
  const checkUserRegistration = async () => {
    if (!user || user.role !== "student") return;
    try {
      const res = await api.get("/registrations/my");
      if (res.data.success) {
        const found = res.data.registrations.find(
          (r) => r.eventId === id && r.status === "confirmed"
        );
        setUserRegistration(found || null);
      }
    } catch (e) {
    }
  };
  useEffect(() => {
    fetchEventData();
  }, [id]);
  useEffect(() => {
    checkUserRegistration();
  }, [id, user]);
  const handleRegister = async () => {
    if (!user) {
      onOpenAuth("login");
      return;
    }
    if (user.role !== "student") {
      alert("Only students can register for events. Switch to a student account to register.");
      return;
    }
    setRegistering(true);
    try {
      const res = await api.post("/registrations", { eventId: id });
      if (res.data.success) {
        setUserRegistration(res.data.registration);
        setShowQRModal(true);
        fetchEventData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    } finally {
      setRegistering(false);
    }
  };
  const handleCancelRegistration = async () => {
    if (!userRegistration) return;
    if (!window.confirm("Are you sure you want to cancel your registration?")) return;
    try {
      const res = await api.delete(`/registrations/${userRegistration._id}`);
      if (res.data.success) {
        setUserRegistration(null);
        fetchEventData();
        alert("Registration cancelled successfully.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel registration.");
    }
  };
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth("login");
      return;
    }
    setSubmittingFeedback(true);
    try {
      const res = await api.post("/feedback", {
        eventId: id,
        rating: ratingInput,
        comments: commentInput.trim()
      });
      if (res.data.success) {
        setFeedbackSuccess(true);
        setCommentInput("");
        fetchEventData();
        setTimeout(() => setFeedbackSuccess(false), 4e3);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setSubmittingFeedback(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "py-24 text-center space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Loading event details..." })
    ] });
  }
  if (!event) {
    return /* @__PURE__ */ jsxs("div", { className: "py-16 text-center space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-800", children: "Event Not Found" }),
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "text-indigo-600 font-semibold text-xs hover:underline inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
        " Back to all events"
      ] })
    ] });
  }
  const percentageFilled = Math.min(100, Math.round(event.registeredCount / event.capacity * 100));
  return /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto space-y-8 pb-16", children: [
    /* @__PURE__ */ jsxs(
      Link,
      {
        to: "/",
        className: "inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors",
        children: [
          /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
          "Back to Event Catalog"
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: event.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
            alt: event.title,
            className: "w-full h-full object-cover opacity-85",
            referrerPolicy: "no-referrer"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" }),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-4 left-4 flex gap-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/90 text-indigo-900 backdrop-blur-md shadow-xs", children: [
            /* @__PURE__ */ jsx(Tag, { className: "w-3.5 h-3.5" }),
            event.category
          ] }),
          /* @__PURE__ */ jsx("span", { className: `px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs backdrop-blur-md ${event.status === "completed" ? "bg-slate-800/90" : event.status === "cancelled" ? "bg-rose-600/90" : "bg-emerald-600/90"}`, children: event.status.toUpperCase() })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute bottom-6 left-6 right-6 text-white space-y-2", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight drop-shadow-sm", children: event.title }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm text-slate-200", children: [
            "Organized by ",
            /* @__PURE__ */ jsx("strong", { className: "text-white", children: event.organizerName }),
            " \u2022 Published directly to students"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-semibold text-slate-400 block", children: "Date" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800", children: event.date })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(Clock, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-semibold text-slate-400 block", children: "Time" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800", children: event.time })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 col-span-2 sm:col-span-1", children: [
              /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { className: "truncate", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase font-semibold text-slate-400 block", children: "Venue" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800 truncate block", children: event.location })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-slate-900 border-b border-slate-100 pb-2", children: "About This Event" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-700 leading-relaxed whitespace-pre-line", children: event.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-xs font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Award, { className: "w-4 h-4 text-indigo-600" }),
              "Student Benefits Included"
            ] }),
            /* @__PURE__ */ jsxs("ul", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-indigo-900", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0" }),
                "Instant Digital QR Admission Pass"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0" }),
                "Official Participation Certificate"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0" }),
                "Contact hours & academic credit eligibility"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600 shrink-0" }),
                "Live Q&A & Hands-on Mentorship"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wider", children: "Registration Status" }),
            userRegistration ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }),
              " Confirmed"
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full", children: "Open" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-slate-600 flex items-center gap-1 font-medium", children: [
                /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5 text-slate-400" }),
                "Seats Filled"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-slate-800", children: [
                event.registeredCount,
                " / ",
                event.capacity
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-2.5 bg-slate-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "h-full bg-indigo-600 rounded-full transition-all duration-300",
                style: { width: `${percentageFilled}%` }
              }
            ) }),
            /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-500 text-right", children: [
              event.spotsRemaining,
              " spots remaining"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 pt-2", children: userRegistration ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setShowQRModal(true),
                className: "w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors",
                children: [
                  /* @__PURE__ */ jsx(QrCode, { className: "w-4 h-4" }),
                  "View My QR Ticket Pass"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleCancelRegistration,
                className: "w-full py-2 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsx(XCircle, { className: "w-3.5 h-3.5" }),
                  "Cancel Registration"
                ]
              }
            )
          ] }) : event.isFull ? /* @__PURE__ */ jsx(
            "button",
            {
              disabled: true,
              className: "w-full py-3 px-4 rounded-xl bg-slate-200 text-slate-500 text-xs font-bold cursor-not-allowed",
              children: "Event is Full"
            }
          ) : event.status === "completed" ? /* @__PURE__ */ jsx("div", { className: "p-3 bg-slate-200 rounded-xl text-center text-xs font-medium text-slate-600", children: "This event has concluded." }) : /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleRegister,
              disabled: registering,
              className: "w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2",
              children: registering ? "Reserving your seat..." : "Register for Event (Free)"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1", children: [
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-indigo-600" }),
              "Direct enrollment: No approval wait times."
            ] }),
            /* @__PURE__ */ jsx("p", { children: "QR pass generated instantly upon registration." })
          ] })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-slate-900", children: "Student Reviews & Ratings" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Verified attendee feedback and event evaluation" })
        ] }),
        avgRating > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl", children: [
          /* @__PURE__ */ jsx(Star, { className: "w-5 h-5 fill-amber-400 text-amber-400" }),
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-amber-900", children: [
            avgRating,
            " / 5.0"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-amber-700", children: [
            "(",
            feedbackList.length,
            " reviews)"
          ] })
        ] })
      ] }),
      user?.role === "student" && /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmitFeedback, className: "bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-slate-800 uppercase tracking-wider", children: "Leave Your Event Feedback" }),
        feedbackSuccess && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-600" }),
          "Thank you! Your feedback has been published."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-slate-600", children: "Your Rating:" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setRatingInput(star),
              className: "p-1 text-amber-400 hover:scale-110 transition-transform",
              children: /* @__PURE__ */ jsx(
                Star,
                {
                  className: `w-6 h-6 ${star <= ratingInput ? "fill-amber-400" : "text-slate-300"}`
                }
              )
            },
            star
          )) }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-amber-800 ml-2", children: [
            ratingInput,
            " Stars"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          "textarea",
          {
            required: true,
            rows: 3,
            placeholder: "Share what you learned, quality of speakers, session organization...",
            value: commentInput,
            onChange: (e) => setCommentInput(e.target.value),
            className: "w-full p-3 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: submittingFeedback || !commentInput.trim(),
            className: "py-2 px-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Send, { className: "w-3.5 h-3.5" }),
              submittingFeedback ? "Posting..." : "Submit Feedback"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: feedbackList.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-6 text-slate-400 text-xs", children: "No reviews yet. Be the first student to review this event!" }) : feedbackList.map((fb) => /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-1.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-slate-800", children: fb.studentName }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1", children: [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsx(
            Star,
            {
              className: `w-3.5 h-3.5 ${s <= fb.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`
            },
            s
          )) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: fb.comments }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 block", children: new Date(fb.createdAt).toLocaleDateString() })
      ] }, fb._id)) })
    ] }),
    /* @__PURE__ */ jsx(
      QRCodeModal,
      {
        registration: userRegistration ? {
          ...userRegistration,
          event
        } : null,
        onClose: () => setShowQRModal(false)
      }
    )
  ] });
};
