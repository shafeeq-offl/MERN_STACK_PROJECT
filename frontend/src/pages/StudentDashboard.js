import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Ticket,
  Award,
  CheckCircle2,
  QrCode,
  Calendar,
  MapPin,
  XCircle,
  User,
  ArrowRight
} from "lucide-react";
import api from "../services/api.js";
import { QRCodeModal } from "../components/QRCodeModal.js";
import { CertificateModal } from "../components/CertificateModal.js";
import { useAuth } from "../context/AuthContext.js";
export const StudentDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname === "/student/certificates" ? "certificates" : "tickets");
  const [registrations, setRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState({
    totalRegistered: 0,
    totalAttended: 0,
    totalCertificates: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedQRReg, setSelectedQRReg] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [regRes, certRes, statRes] = await Promise.all([
        api.get("/registrations/my"),
        api.get("/certificates/my"),
        api.get("/stats/student")
      ]);
      if (regRes.data.success) setRegistrations(regRes.data.registrations);
      if (certRes.data.success) setCertificates(certRes.data.certificates);
      if (statRes.data.success) setStats(statRes.data);
    } catch (err) {
      console.error("Failed to load student dashboard data", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [user]);
  useEffect(() => {
    setActiveTab(location.pathname === "/student/certificates" ? "certificates" : "tickets");
  }, [location.pathname]);
  const handleCancelRegistration = async (regId) => {
    if (!window.confirm("Are you sure you want to cancel this event registration?")) return;
    try {
      const res = await api.delete(`/registrations/${regId}`);
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel registration.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-16", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold", children: [
          /* @__PURE__ */ jsx(User, { className: "w-3.5 h-3.5" }),
          "Student Account \u2022 ",
          user?.studentId || "Roll CS2023042"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight", children: [
          "Welcome back, ",
          user?.name || "Student",
          "!"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm text-slate-500", children: [
          user?.department || "Department of Computer Science & Engineering",
          " \u2022 Campus University"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/profile",
          className: "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0",
          children: "Edit Profile"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(Ticket, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider block", children: "Registered Events" }),
          /* @__PURE__ */ jsx("span", { className: "text-2xl font-black text-slate-900", children: stats.totalRegistered })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider block", children: "Events Attended" }),
          /* @__PURE__ */ jsx("span", { className: "text-2xl font-black text-slate-900", children: stats.totalAttended })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center", children: /* @__PURE__ */ jsx(Award, { className: "w-6 h-6" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-400 uppercase tracking-wider block", children: "Certificates Earned" }),
          /* @__PURE__ */ jsx("span", { className: "text-2xl font-black text-slate-900", children: stats.totalCertificates })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex border-b border-slate-200", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("tickets"),
          className: `flex items-center gap-2 py-3 px-6 text-sm font-semibold border-b-2 transition-all ${activeTab === "tickets" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-900"}`,
          children: [
            /* @__PURE__ */ jsx(Ticket, { className: "w-4 h-4" }),
            "My Registrations & QR Passes (",
            registrations.filter((r) => r.status === "confirmed").length,
            ")"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab("certificates"),
          className: `flex items-center gap-2 py-3 px-6 text-sm font-semibold border-b-2 transition-all ${activeTab === "certificates" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-900"}`,
          children: [
            /* @__PURE__ */ jsx(Award, { className: "w-4 h-4" }),
            "My Certificates (",
            certificates.length,
            ")"
          ]
        }
      )
    ] }),
    loading ? /* @__PURE__ */ jsxs("div", { className: "py-16 text-center space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500", children: "Loading records..." })
    ] }) : activeTab === "tickets" ? (
      /* My Tickets / Registrations View */
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: registrations.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3", children: [
        /* @__PURE__ */ jsx(Ticket, { className: "w-12 h-12 text-slate-300 mx-auto" }),
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-base", children: "No Registrations Yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 max-w-sm mx-auto", children: "You have not registered for any events yet. Browse our campus catalog to join exciting workshops and hackathons!" }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/",
            className: "inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700",
            children: [
              "Browse Events ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-3.5 h-3.5" })
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: registrations.map((reg) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `bg-white rounded-2xl border p-5 space-y-4 flex flex-col justify-between ${reg.status === "cancelled" ? "border-rose-200 bg-rose-50/30 opacity-75" : "border-slate-200 shadow-xs"}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md", children: reg.ticketCode }),
                reg.status === "cancelled" ? /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full", children: "Cancelled" }) : reg.attended ? /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3" }),
                  " Present (Attended)"
                ] }) : /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full", children: "Confirmed Pass" })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 text-base", children: reg.event?.title || "College Event" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1 text-xs text-slate-600 pt-1", children: [
                /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-3.5 h-3.5 text-slate-400" }),
                  reg.event?.date,
                  " \u2022 ",
                  reg.event?.time
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsx(MapPin, { className: "w-3.5 h-3.5 text-slate-400" }),
                  reg.event?.location
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-3 border-t border-slate-100 flex items-center justify-between gap-2", children: reg.status !== "cancelled" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setSelectedQRReg(reg),
                  className: "flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(QrCode, { className: "w-3.5 h-3.5" }),
                    "Show QR Pass"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleCancelRegistration(reg._id),
                  className: "py-2 px-3 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 text-xs font-semibold transition-colors",
                  title: "Cancel Registration",
                  children: /* @__PURE__ */ jsx(XCircle, { className: "w-4 h-4" })
                }
              )
            ] }) : /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 italic", children: "Registration cancelled" }) })
          ]
        },
        reg._id
      )) }) })
    ) : (
      /* My Certificates View */
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: certificates.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3", children: [
        /* @__PURE__ */ jsx(Award, { className: "w-12 h-12 text-slate-300 mx-auto" }),
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-800 text-base", children: "No Certificates Yet" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 max-w-sm mx-auto", children: "Certificates are automatically generated when organizers record your QR attendance at college events." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: certificates.map((cert) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-white rounded-2xl border border-amber-200 p-5 space-y-4 shadow-xs flex flex-col justify-between relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-full -z-0" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md", children: cert.certificateId }),
                /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-semibold text-slate-400", children: [
                  "Issued: ",
                  new Date(cert.issueDate).toLocaleDateString()
                ] })
              ] }),
              /* @__PURE__ */ jsx("h3", { className: "font-serif font-bold text-slate-900 text-lg", children: cert.eventTitle }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-slate-600", children: [
                "Awarded to ",
                /* @__PURE__ */ jsx("strong", { children: cert.studentName }),
                " for verified participation."
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-amber-100 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-amber-800 font-semibold flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-600" }),
                "Verified Credential"
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSelectedCert(cert),
                  className: "py-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors",
                  children: "View & Print Certificate"
                }
              )
            ] })
          ]
        },
        cert._id
      )) }) })
    ),
    /* @__PURE__ */ jsx(
      QRCodeModal,
      {
        registration: selectedQRReg,
        onClose: () => setSelectedQRReg(null)
      }
    ),
    /* @__PURE__ */ jsx(
      CertificateModal,
      {
        certificate: selectedCert,
        onClose: () => setSelectedCert(null)
      }
    )
  ] });
};
