import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { X, QrCode, CheckCircle2, AlertCircle, Search, ShieldCheck, Sparkles } from "lucide-react";
import api from "../services/api.js";
export const AttendanceScannerModal = ({
  isOpen,
  onClose,
  onAttendanceMarked
}) => {
  const [ticketInput, setTicketInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  if (!isOpen) return null;
  const handleVerifyTicket = async (codeToVerify) => {
    const code = codeToVerify || ticketInput.trim();
    if (!code) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post("/attendance/mark", { ticketCode: code });
      if (res.data.success) {
        setResult({
          success: true,
          message: res.data.message,
          studentName: res.data.studentName,
          eventTitle: res.data.eventTitle,
          certificateId: res.data.certificate?.certificateId
        });
        setTicketInput("");
        onAttendanceMarked?.();
      }
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.message || "Verification failed. Please check ticket code."
      });
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 relative", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors",
          children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-2", children: [
        /* @__PURE__ */ jsx(QrCode, { className: "w-3.5 h-3.5" }),
        "Organizer Check-in Desk"
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "QR Attendance Scanner & Ticket Verification" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-300 mt-1", children: "Scan attendee QR code or enter ticket code to record attendance and unlock certificates." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative border-2 border-dashed border-indigo-300 rounded-2xl p-6 bg-indigo-50/40 text-center overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-20 h-20 mx-auto rounded-2xl bg-white border border-indigo-200 shadow-sm flex items-center justify-center text-indigo-600 mb-3 relative", children: [
          /* @__PURE__ */ jsx(QrCode, { className: "w-10 h-10" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-x-0 h-0.5 bg-indigo-500 animate-bounce shadow-xs" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-slate-700", children: "Ready to verify student QR pass" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-slate-500 mt-0.5", children: "Enter the student's Ticket Code below to record attendance in real-time." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs", children: [
        /* @__PURE__ */ jsxs("span", { className: "font-semibold text-slate-600 flex items-center gap-1 mb-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5 text-amber-500" }),
          " Quick Demo Test Tickets:"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setTicketInput("TKT-HACK-8821");
              handleVerifyTicket("TKT-HACK-8821");
            },
            className: "px-2.5 py-1 bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-lg font-mono text-[11px] transition-colors",
            children: "TKT-HACK-8821 (Rahul Sharma - HackCampus)"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            handleVerifyTicket();
          },
          className: "space-y-3",
          children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-semibold text-slate-700 block", children: "Enter or Paste Ticket Code / QR Payload" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                /* @__PURE__ */ jsx(Search, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "e.g. TKT-HACK-8821",
                    value: ticketInput,
                    onChange: (e) => setTicketInput(e.target.value),
                    className: "w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase tracking-wider focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: loading || !ticketInput.trim(),
                  className: "px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5",
                  children: loading ? "Verifying..." : "Check In"
                }
              )
            ] })
          ]
        }
      ),
      result && /* @__PURE__ */ jsx(
        "div",
        {
          className: `p-4 rounded-2xl border text-left transition-all ${result.success ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-rose-50 border-rose-200 text-rose-900"}`,
          children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            result.success ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-600 shrink-0 mt-0.5" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-5 h-5 text-rose-600 shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-xs", children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-sm", children: result.message }),
              result.studentName && /* @__PURE__ */ jsxs("p", { className: "text-emerald-800", children: [
                /* @__PURE__ */ jsx("strong", { children: "Student:" }),
                " ",
                result.studentName
              ] }),
              result.eventTitle && /* @__PURE__ */ jsxs("p", { className: "text-emerald-800", children: [
                /* @__PURE__ */ jsx("strong", { children: "Event:" }),
                " ",
                result.eventTitle
              ] }),
              result.certificateId && /* @__PURE__ */ jsxs("p", { className: "text-emerald-700 flex items-center gap-1 pt-1 font-medium", children: [
                /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-emerald-600" }),
                "Certificate Generated: ",
                /* @__PURE__ */ jsx("span", { className: "font-mono", children: result.certificateId })
              ] })
            ] })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-4 bg-slate-50 border-t border-slate-100 flex justify-end", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "py-2 px-5 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 text-xs font-semibold transition-colors",
        children: "Close Scanner"
      }
    ) })
  ] }) });
};
