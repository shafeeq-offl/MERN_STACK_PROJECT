import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import {
  PlusCircle,
  QrCode,
  Users,
  Calendar,
  Star,
  TrendingUp,
  Edit3,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Eye
} from "lucide-react";
import api from "../services/api.js";
import { CreateEditEventModal } from "./CreateEditEventModal.js";
import { AttendanceScannerModal } from "../components/AttendanceScannerModal.js";
import { useAuth } from "../context/AuthContext.js";
export const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeEventAttendees, setActiveEventAttendees] = useState(null);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [eventsRes, statsRes] = await Promise.all([
        api.get("/events"),
        api.get("/stats/organizer")
      ]);
      if (eventsRes.data.success) {
        const all = eventsRes.data.events;
        const myEvents = all.filter(
          (e) => e.organizerId === user?._id || user?.email === "anita@college.edu"
        );
        setEvents(myEvents);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error("Failed to load organizer dashboard data", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, [user]);
  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the event "${title}"?`)) return;
    try {
      const res = await api.delete(`/events/${id}`);
      if (res.data.success) {
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event.");
    }
  };
  const handleViewAttendees = async (eventId) => {
    setLoadingAttendees(true);
    try {
      const res = await api.get(`/attendance/event/${eventId}`);
      if (res.data.success) {
        setActiveEventAttendees({
          eventId,
          eventTitle: res.data.eventTitle,
          totalRegistered: res.data.totalRegistered,
          totalPresent: res.data.totalPresent,
          attendanceRate: res.data.attendanceRate,
          attendees: res.data.attendees
        });
      }
    } catch (err) {
      alert("Could not fetch attendees list.");
    } finally {
      setLoadingAttendees(false);
    }
  };
  const handleCheckInStudent = async (ticketCode) => {
    try {
      const res = await api.post("/attendance/mark", { ticketCode });
      if (res.data.success) {
        alert(res.data.message);
        if (activeEventAttendees) {
          handleViewAttendees(activeEventAttendees.eventId);
        }
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "w-3.5 h-3.5" }),
          "Organizer Portal \u2022 ",
          user?.organization || "Campus Technical Club"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight", children: "Organizer Management Hub" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-slate-500", children: "Publish events directly without approvals, monitor registrations, record QR attendance, and issue certificates." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsScannerOpen(true),
            className: "py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors shadow-xs",
            children: [
              /* @__PURE__ */ jsx(QrCode, { className: "w-4 h-4 text-indigo-600" }),
              "QR Check-in Scanner"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setEventToEdit(null);
              setIsCreateModalOpen(true);
            },
            className: "py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors",
            children: [
              /* @__PURE__ */ jsx(PlusCircle, { className: "w-4 h-4" }),
              "Create Event (Live Now)"
            ]
          }
        )
      ] })
    ] }),
    stats && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-slate-400 text-xs font-semibold mb-2", children: [
          /* @__PURE__ */ jsx("span", { children: "EVENTS HOSTED" }),
          /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 text-indigo-500" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl sm:text-3xl font-black text-slate-900", children: stats.totalEvents }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 mt-1", children: "Directly published" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-slate-400 text-xs font-semibold mb-2", children: [
          /* @__PURE__ */ jsx("span", { children: "TOTAL REGISTRATIONS" }),
          /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-blue-500" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl sm:text-3xl font-black text-slate-900", children: stats.totalRegistrations }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 mt-1", children: "Confirmed student seats" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-slate-400 text-xs font-semibold mb-2", children: [
          /* @__PURE__ */ jsx("span", { children: "ATTENDANCE RATE" }),
          /* @__PURE__ */ jsx(TrendingUp, { className: "w-4 h-4 text-emerald-500" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-2xl sm:text-3xl font-black text-emerald-600", children: [
          stats.attendanceRate,
          "%"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-slate-500 mt-1", children: [
          stats.totalAttendees,
          " verified check-ins"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-slate-400 text-xs font-semibold mb-2", children: [
          /* @__PURE__ */ jsx("span", { children: "AVERAGE RATING" }),
          /* @__PURE__ */ jsx(Star, { className: "w-4 h-4 text-amber-500 fill-amber-400" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl sm:text-3xl font-black text-amber-700", children: stats.averageRating > 0 ? `${stats.averageRating} \u2605` : "5.0 \u2605" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 mt-1", children: "From student reviews" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-slate-100 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-slate-900", children: "Your Managed Events" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Monitor attendee capacity, edit event information, and record attendance" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setEventToEdit(null);
              setIsCreateModalOpen(true);
            },
            className: "py-1.5 px-3.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsx(PlusCircle, { className: "w-3.5 h-3.5" }),
              "New Event"
            ]
          }
        )
      ] }),
      loading ? /* @__PURE__ */ jsx("div", { className: "p-12 text-center text-xs text-slate-400", children: "Loading events..." }) : events.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-12 text-center space-y-3", children: [
        /* @__PURE__ */ jsx(Calendar, { className: "w-10 h-10 text-slate-300 mx-auto" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "No events created yet." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-slate-100", children: events.map((event) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1.5 max-w-xl", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md", children: event.category }),
                /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${event.status === "completed" ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"}`, children: event.status })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-base", children: event.title }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-500 flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  event.date,
                  " \u2022 ",
                  event.time
                ] }),
                /* @__PURE__ */ jsx("span", { children: "\u2022" }),
                /* @__PURE__ */ jsx("span", { children: event.location })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-1 flex items-center gap-2 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx(Users, { className: "w-3.5 h-3.5 text-slate-400" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  event.registeredCount,
                  " / ",
                  event.capacity,
                  " Registered (",
                  event.spotsRemaining,
                  " spots left)"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => handleViewAttendees(event._id),
                  className: "py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5 text-indigo-600" }),
                    "Attendees List"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => {
                    setEventToEdit(event);
                    setIsCreateModalOpen(true);
                  },
                  className: "p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors",
                  title: "Edit Event",
                  children: /* @__PURE__ */ jsx(Edit3, { className: "w-4 h-4" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDeleteEvent(event._id, event.title),
                  className: "p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors",
                  title: "Delete Event",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
                }
              )
            ] })
          ]
        },
        event._id
      )) })
    ] }),
    activeEventAttendees && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 relative my-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 text-white p-6 relative", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveEventAttendees(null),
            className: "absolute top-4 right-4 p-2 text-slate-400 hover:text-white",
            children: "\u2715"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-xs uppercase font-bold text-indigo-400", children: "Live Attendance Roster" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold mt-1", children: activeEventAttendees.eventTitle }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 text-xs text-slate-300 mt-2", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Total Registered: ",
            /* @__PURE__ */ jsx("strong", { children: activeEventAttendees.totalRegistered })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Present: ",
            /* @__PURE__ */ jsx("strong", { children: activeEventAttendees.totalPresent })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Rate: ",
            /* @__PURE__ */ jsxs("strong", { children: [
              activeEventAttendees.attendanceRate,
              "%"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-6 max-h-96 overflow-y-auto divide-y divide-slate-100", children: activeEventAttendees.attendees.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-8 text-xs text-slate-400", children: "No registered attendees found for this event." }) : activeEventAttendees.attendees.map((att) => /* @__PURE__ */ jsxs("div", { className: "py-3 flex items-center justify-between text-xs", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-900", children: att.studentName }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-500", children: att.studentEmail }),
          /* @__PURE__ */ jsx("span", { className: "font-mono text-[11px] text-indigo-600 font-semibold", children: att.ticketCode })
        ] }),
        /* @__PURE__ */ jsx("div", { children: att.isPresent ? /* @__PURE__ */ jsxs("span", { className: "px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center gap-1 text-[11px]", children: [
          /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }),
          " Present"
        ] }) : /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleCheckInStudent(att.ticketCode),
            className: "px-3 py-1 bg-indigo-600 text-white hover:bg-indigo-700 font-semibold rounded-lg text-[11px] shadow-xs",
            children: "Check In Now"
          }
        ) })
      ] }, att.registrationId)) }),
      /* @__PURE__ */ jsx("div", { className: "p-4 bg-slate-50 border-t border-slate-100 flex justify-end", children: /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveEventAttendees(null),
          className: "py-2 px-5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl text-xs font-semibold",
          children: "Close Roster"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(
      CreateEditEventModal,
      {
        isOpen: isCreateModalOpen,
        onClose: () => {
          setIsCreateModalOpen(false);
          setEventToEdit(null);
        },
        eventToEdit,
        onEventSaved: fetchDashboardData
      }
    ),
    /* @__PURE__ */ jsx(
      AttendanceScannerModal,
      {
        isOpen: isScannerOpen,
        onClose: () => setIsScannerOpen(false),
        onAttendanceMarked: fetchDashboardData
      }
    )
  ] });
};
