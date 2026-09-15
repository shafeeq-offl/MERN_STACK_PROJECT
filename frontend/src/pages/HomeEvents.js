import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, Filter, Calendar, CheckCircle2, ChevronDown } from "lucide-react";
import api from "../services/api.js";
import { EventCard } from "../components/EventCard.js";
import { QRCodeModal } from "../components/QRCodeModal.js";
import { useAuth } from "../context/AuthContext.js";
export const HomeEvents = ({ onOpenAuth }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [selectedQRReg, setSelectedQRReg] = useState(null);
  const [registeringId, setRegisteringId] = useState(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState(null);
  const fetchEvents = async () => {
    try {
      const params = {};
      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (selectedStatus !== "All") params.status = selectedStatus;
      const res = await api.get("/events", { params });
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchMyRegistrations = async () => {
    if (!user || user.role !== "student") return;
    try {
      const res = await api.get("/registrations/my");
      if (res.data.success) {
        setMyRegistrations(res.data.registrations);
      }
    } catch (e) {
    }
  };
  useEffect(() => {
    fetchEvents();
  }, [searchQuery, selectedStatus]);
  useEffect(() => {
    fetchMyRegistrations();
  }, [user]);
  const handleRegister = async (event) => {
    if (!user) {
      onOpenAuth("login");
      return;
    }
    if (user.role !== "student") {
      alert("Only students can register for events. Please switch to a student account.");
      return;
    }
    setRegisteringId(event._id);
    try {
      const res = await api.post("/registrations", { eventId: event._id });
      if (res.data.success) {
        setActionSuccessMessage(`Successfully registered for ${event.title}! Your QR Pass is ready.`);
        setSelectedQRReg({
          ...res.data.registration,
          event
        });
        fetchEvents();
        fetchMyRegistrations();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
    } finally {
      setRegisteringId(null);
    }
  };
  const isEventRegistered = (eventId) => {
    return myRegistrations.some((r) => r.eventId === eventId && r.status === "confirmed");
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }),
        /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search events...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2.5 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsx(Filter, { className: "w-4 h-4 text-indigo-500 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("select", { value: selectedStatus, onChange: (e) => setSelectedStatus(e.target.value), className: "appearance-none min-w-40 pl-3 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:border-indigo-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer", children: [
          /* @__PURE__ */ jsx("option", { value: "All", children: "All Statuses" }),
          /* @__PURE__ */ jsx("option", { value: "upcoming", children: "Upcoming" }),
          /* @__PURE__ */ jsx("option", { value: "completed", children: "Past / Completed" })
          ] }),
          /* @__PURE__ */ jsx(ChevronDown, { className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" })
        ] })
      ] })
    ] }),
    actionSuccessMessage && /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center justify-between animate-in fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-medium", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-600 shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: actionSuccessMessage })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActionSuccessMessage(null),
          className: "text-emerald-700 font-semibold hover:underline text-xs",
          children: "Dismiss"
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsxs("div", { className: "py-20 text-center space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Loading events..." })
    ] }) : events.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsx(Calendar, { className: "w-8 h-8" }) }),
      /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-lg", children: "No Events Found" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 max-w-sm mx-auto", children: "We couldn't find any events matching your search or filters. Try adjusting your filters or search query." }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setSearchQuery("");
            setSelectedStatus("All");
          },
          className: "px-4 py-2 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-xl hover:bg-indigo-100",
          children: "Clear Filters"
        }
      )
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: events.map((event) => /* @__PURE__ */ jsx(
      EventCard,
      {
        event,
        isRegistered: isEventRegistered(event._id),
        onRegisterClick: () => handleRegister(event)
      },
      event._id
    )) }),
    /* @__PURE__ */ jsx(
      QRCodeModal,
      {
        registration: selectedQRReg,
        onClose: () => setSelectedQRReg(null)
      }
    )
  ] });
};
