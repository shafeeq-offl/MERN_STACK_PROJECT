import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { X, QrCode, Download, Calendar, MapPin, User, CheckCircle } from "lucide-react";
export const QRCodeModal = ({ registration, onClose }) => {
  if (!registration) return null;
  const handlePrint = () => {
    window.print();
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 relative", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10",
        children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-indigo-700 to-indigo-900 text-white p-6 text-center relative", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-2", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "w-3.5 h-3.5 text-emerald-300" }),
        "Verified Event Pass"
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold leading-tight line-clamp-2", children: registration.event?.title || "College Event" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-200 mt-1", children: "Present this QR code at the event entrance" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 text-center space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "inline-block p-4 bg-white rounded-2xl border-2 border-dashed border-indigo-200 shadow-xs", children: registration.qrCodeData ? /* @__PURE__ */ jsx(
        "img",
        {
          src: registration.qrCodeData,
          alt: "Ticket QR Code",
          className: "w-48 h-48 mx-auto"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "w-48 h-48 flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl", children: /* @__PURE__ */ jsx(QrCode, { className: "w-12 h-12 animate-pulse" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3 border border-slate-200", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold uppercase tracking-wider text-slate-400 block", children: "Official Ticket Code" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono text-lg font-extrabold text-indigo-700 tracking-wider", children: registration.ticketCode })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-left bg-slate-50/70 rounded-2xl p-4 space-y-2 text-xs border border-slate-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1 border-b border-slate-200/60", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-slate-500 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5 text-slate-400" }),
            " Attendee:"
          ] }),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: registration.studentName })
        ] }),
        registration.event && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1 border-b border-slate-200/60", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-slate-500 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-slate-400" }),
              " Date & Time:"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "font-semibold text-slate-800", children: [
              registration.event.date,
              " (",
              registration.event.time,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1", children: [
            /* @__PURE__ */ jsxs("span", { className: "text-slate-500 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-slate-400" }),
              " Venue:"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800 truncate max-w-[200px]", children: registration.event.location })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handlePrint,
            className: "flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
              "Print / Save Pass"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "py-2.5 px-6 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors",
            children: "Done"
          }
        )
      ] })
    ] })
  ] }) });
};
