import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X, Sparkles, Check } from "lucide-react";
import api from "../services/api.js";
const CATEGORIES = ["Technical", "Hackathon", "Workshop", "Cultural", "Sports", "Seminar"];
export const CreateEditEventModal = ({
  isOpen,
  onClose,
  eventToEdit,
  onEventSaved
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Technical",
    date: "",
    time: "",
    location: "",
    capacity: 100,
    bannerUrl: "",
    status: "upcoming"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title,
        description: eventToEdit.description,
        category: eventToEdit.category,
        date: eventToEdit.date,
        time: eventToEdit.time,
        location: eventToEdit.location,
        capacity: eventToEdit.capacity,
        bannerUrl: eventToEdit.bannerUrl,
        status: eventToEdit.status
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "Technical",
        date: "2026-10-24",
        time: "10:00 AM - 04:00 PM",
        location: "Campus Tech Park, Seminar Hall A",
        capacity: 150,
        bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
        status: "upcoming"
      });
    }
    setError(null);
  }, [eventToEdit, isOpen]);
  if (!isOpen) return null;
  const handlePreFillSample = () => {
    setFormData({
      title: "DevSprint 2026: Full-Stack Web Development Bootcamp",
      description: "Intensive hands-on workshop covering MERN architecture, REST APIs, responsive Tailwind UI, and deployment. Free certificates and project mentorship for all attendees.",
      category: "Workshop",
      date: "2026-11-12",
      time: "09:30 AM - 04:30 PM",
      location: "Central Computing Complex, Lab 3",
      capacity: 120,
      bannerUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
      status: "upcoming"
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (eventToEdit) {
        const res = await api.put(`/events/${eventToEdit._id}`, formData);
        if (res.data.success) {
          onEventSaved();
          onClose();
        }
      } else {
        const res = await api.post("/events", formData);
        if (res.data.success) {
          onEventSaved();
          onClose();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 relative my-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-700 to-indigo-900 text-white p-6 relative", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "absolute top-4 right-4 p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pr-10", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs uppercase font-bold tracking-wider text-indigo-300", children: eventToEdit ? "Edit Event" : "Direct Publishing (No Approval Required)" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mt-0.5", children: eventToEdit ? "Update College Event" : "Create New College Event" })
        ] }),
        !eventToEdit && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: handlePreFillSample,
            className: "hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-semibold backdrop-blur-md transition-colors",
            children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-amber-300" }),
              "Auto-fill Sample"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4 text-xs", children: [
      error && /* @__PURE__ */ jsx("div", { className: "p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs", children: error }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Event Title *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            required: true,
            placeholder: "e.g. HackCampus 2026: National 24-hr Hackathon",
            value: formData.title,
            onChange: (e) => setFormData({ ...formData, title: e.target.value }),
            className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Category *" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: formData.category,
              onChange: (e) => setFormData({ ...formData, category: e.target.value }),
              className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500",
              children: CATEGORIES.map((cat) => /* @__PURE__ */ jsx("option", { value: cat, children: cat }, cat))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Total Capacity (Seats) *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "number",
              min: "10",
              max: "5000",
              required: true,
              value: formData.capacity,
              onChange: (e) => setFormData({ ...formData, capacity: Number(e.target.value) }),
              className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Date *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              required: true,
              value: formData.date,
              onChange: (e) => setFormData({ ...formData, date: e.target.value }),
              className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Timing *" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              required: true,
              placeholder: "e.g. 10:00 AM - 04:00 PM",
              value: formData.time,
              onChange: (e) => setFormData({ ...formData, time: e.target.value }),
              className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Venue / Location *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            required: true,
            placeholder: "e.g. Main Auditorium & Innovation Lab, Block C",
            value: formData.location,
            onChange: (e) => setFormData({ ...formData, location: e.target.value }),
            className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Banner Image URL" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "url",
            placeholder: "https://images.unsplash.com/photo-...",
            value: formData.bannerUrl,
            onChange: (e) => setFormData({ ...formData, bannerUrl: e.target.value }),
            className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          }
        )
      ] }),
      eventToEdit && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Event Status" }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: formData.status,
            onChange: (e) => setFormData({ ...formData, status: e.target.value }),
            className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500",
            children: [
              /* @__PURE__ */ jsx("option", { value: "upcoming", children: "Upcoming" }),
              /* @__PURE__ */ jsx("option", { value: "ongoing", children: "Ongoing" }),
              /* @__PURE__ */ jsx("option", { value: "completed", children: "Completed" }),
              /* @__PURE__ */ jsx("option", { value: "cancelled", children: "Cancelled" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Event Description & Agenda *" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            required: true,
            rows: 4,
            placeholder: "Detail the event objectives, speaker information, agenda, and requirements...",
            value: formData.description,
            onChange: (e) => setFormData({ ...formData, description: e.target.value }),
            className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-slate-100 flex items-center justify-end gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            className: "py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold shadow-xs transition-colors flex items-center gap-1.5",
            children: [
              /* @__PURE__ */ jsx(Check, { className: "w-4 h-4" }),
              loading ? "Saving..." : eventToEdit ? "Update Event" : "Publish Event Live"
            ]
          }
        )
      ] })
    ] })
  ] }) });
};
