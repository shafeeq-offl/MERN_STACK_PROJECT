import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import api from "../services/api.js";
import {
  Ticket,
  Award,
  LayoutDashboard,
  PlusCircle,
  QrCode,
  Bell,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
export const Navbar = ({ onOpenAuth, onOpenCreateEvent, onOpenScanner }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get("/notifications/my");
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.notifications.filter((n) => !n.read).length);
      }
    } catch (e) {
    }
  };
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 1e4);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user]);
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(
        (prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
    }
  };
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs", children: [
    /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center text-indigo-700 font-bold text-xl tracking-tight", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxs("span", { className: "leading-tight font-extrabold text-slate-900 flex items-center gap-1", children: [
              "Campus",
              /* @__PURE__ */ jsx("span", { className: "text-indigo-600", children: "Events" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-medium text-slate-500 tracking-normal", children: "College Event Portal" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/" ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,
              children: "Browse Events"
            }
          ),
          user?.role === "student" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/student/dashboard",
                className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/student/dashboard" ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,
                children: [
                  /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-4 h-4" }),
                  "My Dashboard"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/student/tickets",
                className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/student/tickets" ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,
                children: [
                  /* @__PURE__ */ jsx(Ticket, { className: "w-4 h-4" }),
                  "My QR Tickets"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/student/certificates",
                className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/student/certificates" ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,
                children: [
                  /* @__PURE__ */ jsx(Award, { className: "w-4 h-4" }),
                  "Certificates"
                ]
              }
            )
          ] }),
          user?.role === "organizer" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/organizer/dashboard",
                className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/organizer/dashboard" ? "text-indigo-600 bg-indigo-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`,
                children: [
                  /* @__PURE__ */ jsx(LayoutDashboard, { className: "w-4 h-4" }),
                  "Organizer Hub"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: onOpenScanner,
                className: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors",
                children: [
                  /* @__PURE__ */ jsx(QrCode, { className: "w-4 h-4 text-indigo-600" }),
                  "Check-in Scanner"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: onOpenCreateEvent,
                className: "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors",
                children: [
                  /* @__PURE__ */ jsx(PlusCircle, { className: "w-4 h-4" }),
                  "Create Event"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
        user ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setNotificationsOpen(!notificationsOpen),
                className: "relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors",
                title: "Notifications",
                children: [
                  /* @__PURE__ */ jsx(Bell, { className: "w-5 h-5" }),
                  unreadCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center", children: unreadCount > 9 ? "9+" : unreadCount })
                ]
              }
            ),
            notificationsOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 pb-2 border-b border-slate-100", children: [
                /* @__PURE__ */ jsxs("div", { className: "font-semibold text-slate-900 text-sm flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Bell, { className: "w-4 h-4 text-indigo-600" }),
                  "Notifications (",
                  notifications.length,
                  ")"
                ] }),
                unreadCount > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-full", children: [
                  unreadCount,
                  " unread"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "max-h-80 overflow-y-auto divide-y divide-slate-100", children: notifications.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-8 text-center text-slate-400 text-xs", children: "No notifications yet" }) : notifications.map((n) => /* @__PURE__ */ jsx(
                "div",
                {
                  onClick: () => markAsRead(n._id),
                  className: `p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left ${!n.read ? "bg-indigo-50/40" : ""}`,
                  children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2.5", children: [
                    n.type === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-600 mt-0.5 shrink-0" }) : /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-indigo-600 mt-0.5 shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-slate-900", children: n.title }),
                      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 mt-0.5 leading-relaxed", children: n.message }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 mt-1 block", children: new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
                    ] }),
                    !n.read && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-indigo-600 mt-1" })
                  ] })
                },
                n._id
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: "/profile",
              className: "flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors",
              children: [
                user.profilePicture ? /* @__PURE__ */ jsx("img", { src: user.profilePicture, alt: "Profile", className: "w-8 h-8 rounded-lg object-cover ring-1 ring-teal-200" }) : /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs", children: user.name.charAt(0) }),
                /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex flex-col text-left", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-900 leading-tight truncate max-w-[120px]", children: user.name }),
                  /* @__PURE__ */ jsx("span", { className: `text-[10px] font-medium uppercase tracking-wider ${user.role === "organizer" ? "text-purple-600" : "text-blue-600"}`, children: user.role })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: logout,
              className: "p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors",
              title: "Logout",
              children: /* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" })
            }
          )
        ] }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onOpenAuth("login"),
              className: "px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors",
              children: "Sign In"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => onOpenAuth("register"),
              className: "px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors",
              children: "Register"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setMobileMenuOpen(!mobileMenuOpen),
            className: "md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100",
            children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "w-6 h-6" }) : /* @__PURE__ */ jsx(Menu, { className: "w-6 h-6" })
          }
        )
      ] })
    ] }) }),
    mobileMenuOpen && /* @__PURE__ */ jsxs("div", { className: "md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          onClick: () => setMobileMenuOpen(false),
          className: "block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100",
          children: "Browse Events"
        }
      ),
      user?.role === "student" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/student/dashboard",
            onClick: () => setMobileMenuOpen(false),
            className: "block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100",
            children: "My Dashboard"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/student/tickets",
            onClick: () => setMobileMenuOpen(false),
            className: "block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100",
            children: "My QR Tickets"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/student/certificates",
            onClick: () => setMobileMenuOpen(false),
            className: "block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100",
            children: "Certificates"
          }
        )
      ] }),
      user?.role === "organizer" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/organizer/dashboard",
            onClick: () => setMobileMenuOpen(false),
            className: "block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100",
            children: "Organizer Hub"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setMobileMenuOpen(false);
              onOpenScanner?.();
            },
            className: "w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50",
            children: "Check-in Scanner"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              setMobileMenuOpen(false);
              onOpenCreateEvent?.();
            },
            className: "w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 rounded-lg",
            children: "+ Create New Event"
          }
        )
      ] })
    ] })
  ] });
};
