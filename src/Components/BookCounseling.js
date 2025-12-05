import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Phone, Info, ChevronLeft, ChevronRight, X, Loader2, User, Mail, PhoneCall } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const BookCounseling = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("General");
  const [sessionType, setSessionType] = useState("General Counseling");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST)");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const countryCodes = [
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+1", country: "USA", flag: "🇺🇸" }
  ];

  const timezones = [
    { value: "Asia/Kolkata (IST)", label: "Asia/Kolkata (IST) - India Standard Time" },
    { value: "America/Chicago (CST)", label: "America/Chicago (CST) - Central Standard Time" }
  ];

  useEffect(() => {
    if (timezone) {
      fetchTimeSlots();
      if (selectedDate) {
        fetchAvailableSlots();
      }
    }
  }, [timezone]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchTimeSlots = async () => {
    try {
      console.log("🔄 Fetching time slots for timezone:", timezone);
      const response = await axios.get(`http://localhost:3000/api/timeslots/active?timezone=${timezone}`);
      console.log("📥 Time slots response:", response.data);
      if (response.data.success) {
        const slots = response.data.data.map(slot => slot.time);
        setTimeSlots(slots);
        console.log("✅ Loaded time slots:", slots);
        if (slots.length === 0) {
          toast.error(`No time slots available for ${timezone}`);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching time slots:', error);
      toast.error('Failed to load time slots');
    }
  };

  const fetchAvailableSlots = async () => {
    setLoadingSlots(true);
    try {
      const dateStr = selectedDate.toISOString().split('T');
      console.log("🔄 Fetching available slots for:", dateStr, "timezone:", timezone);
      const response = await axios.get(`http://localhost:3000/api/bookings/available-slots?date=${dateStr}&timezone=${timezone}`);
      console.log("📥 Available slots response:", response.data);
      if (response.data.success) {
        setAvailableSlots(response.data.data.availableSlots);
        console.log("✅ Available slots:", response.data.data.availableSlots);
        console.log("❌ Booked slots:", response.data.data.bookedSlots);
      }
    } catch (error) {
      console.error('❌ Error fetching available slots:', error);
      toast.error('Failed to load available slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const generateCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const isPastDate = (date) => {
    if (!date) return true;
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < today;
  };

  const goPrev = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goNext = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const calendarDays = generateCalendar();

  const formatDate = (d) => d ? d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";

  const handleSubmit = async () => {
    if (!name || !email) {
      toast.error('Please enter your name and email');
      return;
    }
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }
    setLoading(true);
    const fullPhone = phone ? `${countryCode} ${phone}` : null;
    const bookingData = {
      name,
      email,
      phone: fullPhone,
      category,
      sessionType,
      timezone,
      bookingDate: selectedDate.toISOString(),
      bookingTime: selectedTime,
      message: message || null,
    };
    console.log("📤 Booking data:", bookingData);
    try {
      const response = await axios.post('http://localhost:3000/api/bookings', bookingData);
      console.log("✅ Booking response:", response.data);
      if (response.data.success) {
        toast.success('🎉 Session booked successfully!');
        const bookingId = response.data.data.booking_id;
        toast.success(`Booking ID: ${bookingId}. Check your email for confirmation!`, { duration: 5000 });
        setName('');
        setEmail('');
        setCountryCode('+91');
        setPhone('');
        setMessage('');
        setSelectedDate(null);
        setSelectedTime(null);
        setCategory('General');
        setSessionType('General Counseling');
        setTimezone('Asia/Kolkata (IST)');
        fetchTimeSlots();
      }
    } catch (error) {
      console.error("❌ Booking error:", error.response?.data);
      const errorMessage = error.response?.data?.message || 'Failed to book session. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTimezoneChange = (newTimezone) => {
    setTimezone(newTimezone);
    setSelectedTime(null);
    setTimeSlots([]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <Toaster position="top-center" />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl overflow-hidden">
        <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center font-bold text-gray-900">M</div>
            <div>
              <h2 className="text-lg font-semibold">MountGC</h2>
              <p className="text-gray-600 text-sm">Schedule your counseling session</p>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800">
            <X size={22} />
          </button>
        </div>
        <div className="grid md:grid-cols-2 divide-x">
          <div className="p-6 space-y-4 text-sm text-gray-700">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <User size={18} />
                <span>Your Information</span>
              </h3>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="text" placeholder="Full Name *" value={name} onChange={(e) => setName(e.target.value)} className="w-full border pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="email" placeholder="Email Address *" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="relative">
                <PhoneCall className="absolute left-3 top-3 text-gray-400" size={18} />
                <div className="flex space-x-2">
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="border pl-10 pr-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32">
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>{country.flag} {country.code}</option>
                    ))}
                  </select>
                  <input type="tel" placeholder="Phone Number (Optional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-semibold text-gray-800">Session Details</h3>
              <select className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option>General</option>
                <option>Visa Assistance</option>
                <option>Profile Review</option>
                <option>University Shortlisting</option>
              </select>
              <select className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
                <option>General Counseling</option>
                <option>Expert Counseling</option>
              </select>
              <select className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={timezone} onChange={(e) => handleTimezoneChange(e.target.value)}>
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
              <textarea className="w-full border rounded-md px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your message (optional)" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            </div>
            <div className="space-y-2 text-gray-600 bg-blue-50 p-3 rounded-md">
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <p>30 Minutes</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <p>On-call session</p>
              </div>
              <div className="flex items-start space-x-2">
                <Info size={16} className="mt-0.5" />
                <p>Join within 5 minutes of the slot time.</p>
              </div>
            </div>
            {selectedDate && (
              <div className="mt-4 p-3 bg-green-50 rounded-md border-l-4 border-green-500">
                <p className="font-semibold text-green-800">Selected Slot:</p>
                <p className="text-green-700">📅 {formatDate(selectedDate)}</p>
                <p className="text-green-700">🕒 {selectedTime || "Not selected"}</p>
                <p className="text-green-700">🌍 {timezone}</p>
              </div>
            )}
            {selectedDate && selectedTime && name && email && (
              <button onClick={handleSubmit} disabled={loading} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Booking Session...
                  </>
                ) : (
                  "✓ Book Session"
                )}
              </button>
            )}
          </div>
          <div className="p-6">
            <div className="flex justify-between items-center mb-3">
              <button onClick={goPrev} className="text-gray-500 hover:text-gray-700 flex items-center space-x-1 transition">
                <ChevronLeft size={18} />
                <span className="text-sm">Previous</span>
              </button>
              <p className="font-semibold text-gray-800">{currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}</p>
              <button onClick={goNext} className="text-gray-500 hover:text-gray-700 flex items-center space-x-1 transition">
                <span className="text-sm">Next</span>
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="grid grid-cols-7 text-center text-gray-600 font-medium mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <p key={d} className="text-xs">{d}</p>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, index) => {
                const disabled = isPastDate(date);
                return (
                  <div key={index} className={`p-2 h-12 rounded-md flex items-center justify-center cursor-pointer transition ${date ? disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-50 hover:bg-blue-50 hover:border-blue-300 border border-transparent" : ""} ${selectedDate && date && date.toDateString() === selectedDate.toDateString() ? "bg-blue-500 text-white font-bold border-blue-600" : ""}`} onClick={() => !disabled && date && (setSelectedDate(date), setSelectedTime(null))}>
                    {date && <p className="text-sm">{date.getDate()}</p>}
                  </div>
                );
              })}
            </div>
            {selectedDate && (
              <div className="mt-6">
                <p className="font-semibold mb-3 text-gray-800">{loadingSlots ? 'Loading slots...' : `Available Time Slots (${timezone.includes('IST') ? 'IST' : 'CST'}):`}</p>
                {loadingSlots ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="animate-spin text-blue-600" size={28} />
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="text-center py-6 bg-yellow-50 rounded-md border border-yellow-200">
                    <Clock className="mx-auto text-yellow-600 mb-2" size={32} />
                    <p className="text-yellow-800 font-medium">No time slots for {timezone.includes('IST') ? 'IST' : 'CST'}</p>
                    <p className="text-yellow-600 text-sm">Try switching timezone or contact admin</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map((t) => {
                        const isAvailable = availableSlots.includes(t);
                        return (
                          <button key={t} onClick={() => isAvailable && setSelectedTime(t)} disabled={!isAvailable} className={`border rounded-lg py-3 text-sm font-medium transition ${!isAvailable ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200" : selectedTime === t ? "bg-green-500 text-white border-green-600 shadow-md" : "bg-white hover:bg-blue-50 hover:border-blue-400 border-gray-300"}`}>
                            {t}
                            {!isAvailable && <span className="block text-xs text-red-500 mt-1">Booked</span>}
                          </button>
                        );
                      })}
                    </div>
                    {availableSlots.length === 0 && (
                      <div className="mt-4 text-center py-4 bg-red-50 rounded-md border border-red-200">
                        <p className="text-red-600 font-medium">All slots are booked for this date</p>
                        <p className="text-red-500 text-sm">Please choose another date</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCounseling;


