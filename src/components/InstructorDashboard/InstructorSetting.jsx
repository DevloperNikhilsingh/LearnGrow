import React, { useState, useRef } from "react";
import { User, Bell, CreditCard, Camera, Check, Loader2, ChevronRight } from "lucide-react";
import { getCurrentUser } from "../../services/authService";

const InstructorSettings = () => {
  const user = getCurrentUser();
  const [activeSection, setActiveSection] = useState("profile");
  const fileInputRef = useRef(null);

  const profileKey = `lg_instructor_profile_${user?.id}`;
  let savedExtra = {};
  try {
    savedExtra = JSON.parse(localStorage.getItem(profileKey)) || {};
  } catch {
    savedExtra = {};
  }

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(savedExtra.phone || "");
  const [bio, setBio] = useState(savedExtra.bio || "");
  const [expertise, setExpertise] = useState(savedExtra.expertise || "");
  const [avatar, setAvatar] = useState(savedExtra.avatar || user?.avatar || "");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [bioError, setBioError] = useState("");

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [newEnrollment, setNewEnrollment] = useState(true);
  const [courseReview, setCourseReview] = useState(true);
  const [liveClassReminder, setLiveClassReminder] = useState(true);
  const [payoutUpdates, setPayoutUpdates] = useState(false);
  const [marketingTips, setMarketingTips] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  const [accountHolder, setAccountHolder] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [accountHolderError, setAccountHolderError] = useState("");
  const [bankNameError, setBankNameError] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");
  const [ifscError, setIfscError] = useState("");
  const [payoutSaving, setPayoutSaving] = useState(false);
  const [payoutSaved, setPayoutSaved] = useState(false);

  const PHONE_RE = /^\+?[0-9]{10,13}$/;
  const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const ACCOUNT_NUM_RE = /^[0-9]{9,18}$/;

  const inputClass = (hasError, disabled) => {
    if (disabled) return "w-full rounded-xl border px-3.5 py-2.5 text-sm border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed";
    if (hasError) return "w-full rounded-xl border px-3.5 py-2.5 text-sm border-red-300 bg-red-50/40 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-400";
    return "w-full rounded-xl border px-3.5 py-2.5 text-sm border-slate-200 bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 focus:bg-white";
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    if (!name.trim()) {
      setNameError("Name is required.");
      hasError = true;
    } else {
      setNameError("");
    }

    if (phone.trim() && !PHONE_RE.test(phone.trim())) {
      setPhoneError("Enter a valid phone number (10–13 digits).");
      hasError = true;
    } else {
      setPhoneError("");
    }

    if (bio.length > 400) {
      setBioError("Bio must be under 400 characters.");
      hasError = true;
    } else {
      setBioError("");
    }

    if (hasError) return;

    setProfileSaving(true);
    setProfileSaved(false);
    setTimeout(() => {
      localStorage.setItem(profileKey, JSON.stringify({ phone, bio, expertise, avatar }));
      setProfileSaving(false);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    }, 500);
  };

  const handleNotifSubmit = (e) => {
    e.preventDefault();
    setNotifSaving(true);
    setNotifSaved(false);
    setTimeout(() => {
      setNotifSaving(false);
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 2000);
    }, 500);
  };

  const handlePayoutSubmit = (e) => {
    e.preventDefault();

    let hasError = false;

    if (!accountHolder.trim()) {
      setAccountHolderError("Account holder name is required.");
      hasError = true;
    } else {
      setAccountHolderError("");
    }

    if (!bankName.trim()) {
      setBankNameError("Bank name is required.");
      hasError = true;
    } else {
      setBankNameError("");
    }

    if (!accountNumber.trim()) {
      setAccountNumberError("Account number is required.");
      hasError = true;
    } else if (!ACCOUNT_NUM_RE.test(accountNumber.trim())) {
      setAccountNumberError("Account number must be 9–18 digits.");
      hasError = true;
    } else {
      setAccountNumberError("");
    }

    if (!ifsc.trim()) {
      setIfscError("IFSC code is required.");
      hasError = true;
    } else if (!IFSC_RE.test(ifsc.trim().toUpperCase())) {
      setIfscError("Enter a valid IFSC code (e.g. HDFC0001234).");
      hasError = true;
    } else {
      setIfscError("");
    }

    if (hasError) return;

    setPayoutSaving(true);
    setPayoutSaved(false);
    setTimeout(() => {
      setPayoutSaving(false);
      setPayoutSaved(true);
      setTimeout(() => setPayoutSaved(false), 2000);
    }, 500);
  };

  const getInitials = () => {
    if (!name) return "?";
    return name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  };

  if (!user) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 pt-20 lg:pt-6 pb-10">
        <p className="text-sm text-slate-500">You're not logged in. Please log in to view your settings.</p>
      </div>
    );
  }

  return (
    <>
    <div className="mb-6 hidden lg:flex items-center bg-[#0b1030] px-6 py-5">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white">Settings</h1>
        </div>
      </div>
    <div className="px-4 sm:px-6 lg:px-8 pt-20 lg:pt-6 pb-10 w-full max-w-full overflow-x-hidden">
      <div className="flex flex-col lg:flex-row gap-6 max-w-5xl">
        <nav className="lg:w-56 shrink-0">
          <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1 lg:mx-0 lg:px-0">
            <button
              type="button"
              onClick={() => setActiveSection("profile")}
              className={
                activeSection === "profile"
                  ? "flex items-center gap-2.5 whitespace-nowrap px-3.5 py-2.5 rounded-xl text-sm font-medium shrink-0 bg-indigo-50 text-indigo-700"
                  : "flex items-center gap-2.5 whitespace-nowrap px-3.5 py-2.5 rounded-xl text-sm font-medium shrink-0 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            >
              <User size={16} className={activeSection === "profile" ? "text-indigo-600" : "text-slate-400"} />
              Profile
              <ChevronRight size={14} className={activeSection === "profile" ? "ml-auto hidden lg:block text-indigo-400" : "ml-auto hidden lg:block opacity-0"} />
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("notifications")}
              className={
                activeSection === "notifications"
                  ? "flex items-center gap-2.5 whitespace-nowrap px-3.5 py-2.5 rounded-xl text-sm font-medium shrink-0 bg-indigo-50 text-indigo-700"
                  : "flex items-center gap-2.5 whitespace-nowrap px-3.5 py-2.5 rounded-xl text-sm font-medium shrink-0 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            >
              <Bell size={16} className={activeSection === "notifications" ? "text-indigo-600" : "text-slate-400"} />
              Notifications
              <ChevronRight size={14} className={activeSection === "notifications" ? "ml-auto hidden lg:block text-indigo-400" : "ml-auto hidden lg:block opacity-0"} />
            </button>

            <button
              type="button"
              onClick={() => setActiveSection("payout")}
              className={
                activeSection === "payout"
                  ? "flex items-center gap-2.5 whitespace-nowrap px-3.5 py-2.5 rounded-xl text-sm font-medium shrink-0 bg-indigo-50 text-indigo-700"
                  : "flex items-center gap-2.5 whitespace-nowrap px-3.5 py-2.5 rounded-xl text-sm font-medium shrink-0 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }
            >
              <CreditCard size={16} className={activeSection === "payout" ? "text-indigo-600" : "text-slate-400"} />
              Payout Details
              <ChevronRight size={14} className={activeSection === "payout" ? "ml-auto hidden lg:block text-indigo-400" : "ml-auto hidden lg:block opacity-0"} />
            </button>
          </div>
        </nav>

        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-7">
          {activeSection === "profile" && (
            <form onSubmit={handleProfileSubmit} noValidate>
              <div className="mb-6">
                <h2 className="text-base font-bold text-slate-900">Profile</h2>
                <p className="text-sm text-slate-500 mt-1">This information is visible to your students.</p>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

              <div className="flex items-center gap-4 mb-7">
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-lg font-bold shrink-0 shadow-sm overflow-hidden relative group"
                  title="Change photo"
                >
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    getInitials()
                  )}
                  <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera size={18} />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Camera size={14} />
                  Change Photo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-500 mb-1.5">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass(!!nameError, false)}
                  />
                  {nameError && <p className="text-xs text-red-500 mt-1.5">{nameError}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-500 mb-1.5">Email Address</label>
                  <input id="email" name="email" type="email" readOnly disabled value={email} className={inputClass(false, true)} />
                  <p className="text-[11px] text-slate-400 mt-1.5">Email is your login ID and can't be changed here.</p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-slate-500 mb-1.5">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass(!!phoneError, false)}
                  />
                  {phoneError && <p className="text-xs text-red-500 mt-1.5">{phoneError}</p>}
                </div>

                <div>
                  <label htmlFor="expertise" className="block text-xs font-semibold text-slate-500 mb-1.5">Area of Expertise</label>
                  <input
                    id="expertise"
                    name="expertise"
                    type="text"
                    placeholder="e.g. Python, Data Analytics"
                    value={expertise}
                    onChange={(e) => setExpertise(e.target.value)}
                    className={inputClass(false, false)}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="bio" className="block text-xs font-semibold text-slate-500 mb-1.5">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  maxLength={400}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell students a little about your background..."
                  className={inputClass(!!bioError, false) + " resize-none"}
                />
                {bioError && <p className="text-xs text-red-500 mt-1.5">{bioError}</p>}
                <p className="text-[11px] text-slate-400 mt-1 text-right">{bio.length}/400</p>
              </div>

              <div className="mt-3 pt-5 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 w-full sm:w-auto"
                >
                  {profileSaving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Saving...
                    </>
                  ) : profileSaved ? (
                    <>
                      <Check size={15} /> Saved
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}

          {activeSection === "notifications" && (
            <form onSubmit={handleNotifSubmit}>
              <div className="mb-6">
                <h2 className="text-base font-bold text-slate-900">Notifications</h2>
                <p className="text-sm text-slate-500 mt-1">Choose what you get notified about.</p>
              </div>

              <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">New enrollments</p>
                  <p className="text-xs text-slate-500 mt-0.5">Get notified when a student enrolls in your course</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={newEnrollment}
                  onClick={() => setNewEnrollment(!newEnrollment)}
                  className={"relative shrink-0 w-11 h-6 rounded-full " + (newEnrollment ? "bg-indigo-600" : "bg-slate-200")}
                >
                  <span className={"absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform " + (newEnrollment ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">Course reviews</p>
                  <p className="text-xs text-slate-500 mt-0.5">Get notified when a student leaves a review</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={courseReview}
                  onClick={() => setCourseReview(!courseReview)}
                  className={"relative shrink-0 w-11 h-6 rounded-full " + (courseReview ? "bg-indigo-600" : "bg-slate-200")}
                >
                  <span className={"absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform " + (courseReview ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">Live class reminders</p>
                  <p className="text-xs text-slate-500 mt-0.5">Reminders before your scheduled live sessions</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={liveClassReminder}
                  onClick={() => setLiveClassReminder(!liveClassReminder)}
                  className={"relative shrink-0 w-11 h-6 rounded-full " + (liveClassReminder ? "bg-indigo-600" : "bg-slate-200")}
                >
                  <span className={"absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform " + (liveClassReminder ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">Payout updates</p>
                  <p className="text-xs text-slate-500 mt-0.5">Get notified about payout status changes</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={payoutUpdates}
                  onClick={() => setPayoutUpdates(!payoutUpdates)}
                  className={"relative shrink-0 w-11 h-6 rounded-full " + (payoutUpdates ? "bg-indigo-600" : "bg-slate-200")}
                >
                  <span className={"absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform " + (payoutUpdates ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">Tips & product updates</p>
                  <p className="text-xs text-slate-500 mt-0.5">Occasional emails about new instructor features</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={marketingTips}
                  onClick={() => setMarketingTips(!marketingTips)}
                  className={"relative shrink-0 w-11 h-6 rounded-full " + (marketingTips ? "bg-indigo-600" : "bg-slate-200")}
                >
                  <span className={"absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform " + (marketingTips ? "translate-x-5" : "translate-x-0")} />
                </button>
              </div>

              <div className="mt-7 pt-5 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={notifSaving}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 w-full sm:w-auto"
                >
                  {notifSaving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Saving...
                    </>
                  ) : notifSaved ? (
                    <>
                      <Check size={15} /> Saved
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}

          {activeSection === "payout" && (
            <form onSubmit={handlePayoutSubmit} noValidate>
              <div className="mb-6">
                <h2 className="text-base font-bold text-slate-900">Payout Details</h2>
                <p className="text-sm text-slate-500 mt-1">Where we send your course earnings.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="accountHolder" className="block text-xs font-semibold text-slate-500 mb-1.5">Account Holder Name</label>
                  <input
                    id="accountHolder"
                    name="accountHolder"
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className={inputClass(!!accountHolderError, false)}
                  />
                  {accountHolderError && <p className="text-xs text-red-500 mt-1.5">{accountHolderError}</p>}
                </div>

                <div>
                  <label htmlFor="bankName" className="block text-xs font-semibold text-slate-500 mb-1.5">Bank Name</label>
                  <input
                    id="bankName"
                    name="bankName"
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className={inputClass(!!bankNameError, false)}
                  />
                  {bankNameError && <p className="text-xs text-red-500 mt-1.5">{bankNameError}</p>}
                </div>

                <div>
                  <label htmlFor="accountNumber" className="block text-xs font-semibold text-slate-500 mb-1.5">Account Number</label>
                  <input
                    id="accountNumber"
                    name="accountNumber"
                    type="text"
                    inputMode="numeric"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ""))}
                    className={inputClass(!!accountNumberError, false)}
                  />
                  {accountNumberError && <p className="text-xs text-red-500 mt-1.5">{accountNumberError}</p>}
                </div>

                <div>
                  <label htmlFor="ifsc" className="block text-xs font-semibold text-slate-500 mb-1.5">IFSC Code</label>
                  <input
                    id="ifsc"
                    name="ifsc"
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    placeholder="HDFC0001234"
                    className={inputClass(!!ifscError, false)}
                  />
                  {ifscError && <p className="text-xs text-red-500 mt-1.5">{ifscError}</p>}
                </div>
              </div>

              <div className="mt-7 pt-5 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={payoutSaving}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 w-full sm:w-auto"
                >
                  {payoutSaving ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Saving...
                    </>
                  ) : payoutSaved ? (
                    <>
                      <Check size={15} /> Saved
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default InstructorSettings;