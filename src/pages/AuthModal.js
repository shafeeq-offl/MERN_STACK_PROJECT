import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { X, LogIn, UserPlus, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";
export const AuthModal = ({
  isOpen,
  onClose,
  defaultTab = "login",
  defaultRole = "student"
}) => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultTab === "login");
  const [role, setRole] = useState(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [studentId, setStudentId] = useState("");
  const [organization, setOrganization] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  if (!isOpen) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          onClose();
        } else {
          setError(result.message || "Invalid credentials.");
        }
      } else {
        const result = await register({
          name,
          email,
          password,
          role,
          department,
          studentId: role === "student" ? studentId : void 0,
          organization: role === "organizer" ? organization : void 0,
          phone
        });
        if (result.success) {
          onClose();
        } else {
          setError(result.message || "Registration failed.");
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 relative my-6", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10",
        children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-indigo-700 to-indigo-900 text-white p-6 pb-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: isLogin ? "Sign In to CampusEvents" : "Create an Account" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-indigo-200 mt-1", children: "College event registrations, QR passes, and certificates portal" }),
      /* @__PURE__ */ jsxs("div", { className: "flex bg-indigo-950/40 p-1 rounded-xl mt-4 border border-indigo-500/30", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setIsLogin(true);
              setError(null);
            },
            className: `flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${isLogin ? "bg-white text-indigo-900 shadow-sm" : "text-indigo-200 hover:text-white"}`,
            children: "Sign In"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              setIsLogin(false);
              setError(null);
            },
            className: `flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${!isLogin ? "bg-white text-indigo-900 shadow-sm" : "text-indigo-200 hover:text-white"}`,
            children: "Register"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4 text-xs", children: [
      error && /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2", children: [
        /* @__PURE__ */ jsx(AlertCircle, { className: "w-4 h-4 text-rose-600 shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsx("span", { children: error })
      ] }),
      !isLogin && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Select Role *" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setRole("student"),
              className: `py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${role === "student" ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`,
              children: "\u{1F393} College Student"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setRole("organizer"),
              className: `py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${role === "organizer" ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`,
              children: "\u{1F3DB}\uFE0F Club Organizer / Faculty"
            }
          )
        ] })
      ] }),
      !isLogin && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Full Name *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            required: true,
            placeholder: "e.g. Rahul Sharma",
            value: name,
            onChange: (e) => setName(e.target.value),
            className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "College Email Address *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            required: true,
            placeholder: "e.g. rahul@college.edu",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Password *" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            required: true,
            placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          }
        )
      ] }),
      !isLogin && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Department" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "e.g. Computer Science & Engineering",
              value: department,
              onChange: (e) => setDepartment(e.target.value),
              className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] }),
        role === "student" ? /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Student Roll / ID No." }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "e.g. CS2023042",
              value: studentId,
              onChange: (e) => setStudentId(e.target.value),
              className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] }) : /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Club / Organization Name" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "e.g. IEEE Student Branch / Robotics Club",
              value: organization,
              onChange: (e) => setOrganization(e.target.value),
              className: "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm shadow-xs transition-colors flex items-center justify-center gap-2",
          children: [
            isLogin ? /* @__PURE__ */ jsx(LogIn, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(UserPlus, { className: "w-4 h-4" }),
            loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"
          ]
        }
      )
    ] })
  ] }) });
};
