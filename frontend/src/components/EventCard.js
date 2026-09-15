import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Star, ArrowRight, Tag } from "lucide-react";
const CATEGORY_COLORS = {
  Technical: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  Hackathon: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  Workshop: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Cultural: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  Sports: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  Seminar: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" }
};
export const EventCard = ({ event, isRegistered, onRegisterClick }) => {
  const categoryStyle = CATEGORY_COLORS[event.category] || {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200"
  };
  const percentageFilled = Math.min(100, Math.round(event.registeredCount / event.capacity * 100));
  return /* @__PURE__ */ jsxs("div", { className: "group bg-white rounded-[1.35rem] border border-slate-200/80 overflow-hidden transition-all duration-300 flex flex-col h-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-44 w-full overflow-hidden bg-slate-100", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: event.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
          alt: event.title,
          className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
          referrerPolicy: "no-referrer"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-3 left-3", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md bg-white/95 border ${categoryStyle.border} ${categoryStyle.text} shadow-xs`, children: [
        /* @__PURE__ */ jsx(Tag, { className: "w-3 h-3" }),
        event.category
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3", children: /* @__PURE__ */ jsx("span", { className: `px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md shadow-xs ${event.status === "completed" ? "bg-slate-900/80 text-white" : event.status === "cancelled" ? "bg-rose-600/90 text-white" : "bg-emerald-600/90 text-white"}`, children: event.status.toUpperCase() }) }),
      /* @__PURE__ */ jsxs("div", { className: "absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs font-medium", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 drop-shadow-sm", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5" }),
          event.date
        ] }),
        /* @__PURE__ */ jsx("span", { className: "drop-shadow-sm", children: event.time })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-5 flex-1 flex flex-col justify-between space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500 mb-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "truncate max-w-[170px] font-medium text-slate-600", children: [
            "By ",
            event.organizerName
          ] }),
          event.rating > 0 ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md", children: [
            /* @__PURE__ */ jsx(Star, { className: "w-3 h-3 fill-amber-400 text-amber-400" }),
            event.rating,
            " (",
            event.feedbackCount,
            ")"
          ] }) : /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: "New Event" })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: `/events/${event._id}`, children: /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-lg leading-snug line-clamp-2 hover:text-indigo-600 transition-colors", children: event.title }) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed", children: event.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2 border-t border-slate-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-xs text-slate-600", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-slate-400 shrink-0" }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: event.location })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs text-slate-500 mb-1", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Users, { className: "w-3 h-3 text-slate-400" }),
              "Capacity"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-medium text-slate-700", children: [
              event.registeredCount,
              " / ",
              event.capacity,
              " seats (",
              event.spotsRemaining,
              " spots left)"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full h-1.5 bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: `h-full rounded-full transition-all duration-300 ${percentageFilled >= 90 ? "bg-rose-500" : percentageFilled >= 70 ? "bg-amber-500" : "bg-indigo-500"}`,
              style: { width: `${percentageFilled}%` }
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-2 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/events/${event._id}`,
            className: "flex-1 text-center py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center gap-1",
            children: [
              "View Details",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })
            ]
          }
        ),
        isRegistered ? /* @__PURE__ */ jsx("span", { className: "px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200", children: "Registered \u2713" }) : event.isFull ? /* @__PURE__ */ jsx("span", { className: "px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-400", children: "Housefull" }) : /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onRegisterClick,
            className: "py-2 px-4 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors",
            children: "Register"
          }
        )
      ] })
    ] })
  ] });
};
