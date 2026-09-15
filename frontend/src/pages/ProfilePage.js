import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { User, Mail, Building, Phone, Hash, ShieldCheck, Check, Save, ImagePlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";
export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [studentId, setStudentId] = useState(user?.studentId || "");
  const [organization, setOrganization] = useState(user?.organization || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const res = await updateProfile({
      name,
      department,
      phone,
      studentId: user?.role === "student" ? studentId : void 0,
      organization: user?.role === "organizer" ? organization : void 0
      ,profilePicture
    });
    setLoading(false);
    if (res.success) {
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(null), 4e3);
    }
  };
  const handlePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      return;
    }
    if (file.size > 1024 * 1024) {
      window.alert("Please choose an image smaller than 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProfilePicture(reader.result);
    reader.readAsDataURL(file);
  };
  return /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto space-y-6 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 border-b border-slate-100 pb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", children: [
        profilePicture ? /* @__PURE__ */ jsx("img", { src: profilePicture, alt: "Profile", className: "w-20 h-20 rounded-3xl object-cover border-4 border-white shadow-lg ring-2 ring-teal-100" }) : /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-black text-3xl flex items-center justify-center shadow-lg", children: user?.name?.charAt(0) || "U" }),
        /* @__PURE__ */ jsxs("label", { htmlFor: "profile-picture", className: "absolute -right-2 -bottom-2 w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-teal-700 transition-colors", title: "Change profile picture", children: [
          /* @__PURE__ */ jsx(ImagePlus, { className: "w-4 h-4" }),
          /* @__PURE__ */ jsx("input", { id: "profile-picture", type: "file", accept: "image/*", onChange: handlePictureChange, className: "sr-only" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-slate-900", children: user?.name }),
          /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${user?.role === "organizer" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`, children: user?.role })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: user?.email })
      ] })
    ] }),
    message && /* @__PURE__ */ jsxs("div", { className: "p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Check, { className: "w-4 h-4 text-emerald-600" }),
      message
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 text-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-teal-50 border border-teal-100 p-4 flex items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-teal-950", children: "Personal details" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-teal-800/70 mt-0.5", children: "Keep your event identity up to date." })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest text-teal-700", children: user?.role })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Full Name" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(User, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              required: true,
              value: name,
              onChange: (e) => setName(e.target.value),
              className: "w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Email Address" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              disabled: true,
              value: user?.email || "",
              className: "w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400 mt-0.5 block", children: "Email address cannot be changed" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Department" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Building, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "e.g. Computer Science & Engineering",
              value: department,
              onChange: (e) => setDepartment(e.target.value),
              className: "w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] })
      ] }),
      user?.role === "student" ? /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Student Roll / ID Number" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Hash, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "e.g. CS2023042",
              value: studentId,
              onChange: (e) => setStudentId(e.target.value),
              className: "w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Organization / Club Name" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "e.g. IEEE Student Branch / Robotics Society",
              value: organization,
              onChange: (e) => setOrganization(e.target.value),
              className: "w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "font-semibold text-slate-700 block mb-1", children: "Contact Phone" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4 text-slate-400 absolute left-3.5 top-3" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              placeholder: "+91 98765 43210",
              value: phone,
              onChange: (e) => setPhone(e.target.value),
              className: "w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-4 flex justify-end", children: /* @__PURE__ */ jsxs(
        "button",
        {
          type: "submit",
          disabled: loading,
          className: "py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5",
          children: [
            /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" }),
            loading ? "Saving..." : "Save Profile Changes"
          ]
        }
      ) })
    ] })
  ] }) });
};
