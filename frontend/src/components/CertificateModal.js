import { jsx, jsxs } from "react/jsx-runtime";
import { X, Award, Download, CheckCircle, ShieldCheck } from "lucide-react";
export const CertificateModal = ({ certificate, onClose }) => {
  if (!certificate) return null;
  const handlePrint = () => {
    window.print();
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 relative my-8", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10",
        children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { id: "printable-certificate", className: "p-8 sm:p-12 bg-[#faf8f5] relative text-center border-12 border-double border-amber-800/40 m-3 rounded-2xl shadow-inner", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-700" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-700" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-700" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-700" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1 mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-600/50 text-amber-800 mb-2 shadow-xs", children: /* @__PURE__ */ jsx(Award, { className: "w-8 h-8" }) }),
        /* @__PURE__ */ jsx("h4", { className: "text-xs uppercase tracking-[0.25em] font-semibold text-amber-900", children: "Campus University \u2022 Directorate of Student Affairs" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-serif font-black tracking-wide text-slate-900 pt-1", children: "Certificate of Participation" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 italic font-serif", children: "This is officially awarded to recognize meritorious campus engagement" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "my-6 space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs uppercase tracking-widest text-slate-500 font-semibold", children: "This certificate is proudly presented to" }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl sm:text-3xl font-serif font-bold text-indigo-950 border-b-2 border-amber-700/60 pb-2 inline-block px-8 max-w-full truncate", children: certificate.studentName }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed pt-2", children: [
          "for active and verified attendance in the college event ",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("strong", { className: "text-slate-900 font-serif text-base", children: certificate.eventTitle }),
          /* @__PURE__ */ jsx("br", {}),
          "conducted on ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-800", children: certificate.eventDate }),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 pt-6 border-t border-amber-200/80 grid grid-cols-3 gap-4 items-end text-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("div", { className: "font-serif italic text-sm text-slate-800 border-b border-slate-400 pb-1", children: "Dr. Anita Desai" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider text-slate-500 block font-semibold", children: "Event Convener" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full border-2 border-amber-600 bg-amber-50 flex items-center justify-center text-amber-700 shadow-xs mb-1", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "w-6 h-6" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-[9px] font-mono text-amber-900 font-bold tracking-tight", children: certificate.certificateId })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("div", { className: "font-serif italic text-sm text-slate-800 border-b border-slate-400 pb-1", children: "Dean of Academics" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider text-slate-500 block font-semibold", children: "Campus University" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 text-[10px] text-slate-400", children: [
        "Issued on ",
        new Date(certificate.issueDate).toLocaleDateString(),
        " \u2022 Verified on CampusEvents Portal"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-emerald-600" }),
        "Verified Digital Credential"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handlePrint,
            className: "py-2 px-4 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 shadow-xs transition-colors",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "w-4 h-4" }),
              "Print / Save PDF"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onClose,
            className: "py-2 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors",
            children: "Close"
          }
        )
      ] })
    ] })
  ] }) });
};
