import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Example tour data (replace with props or context if needed)
const TOUR_INFO = {
  name: "Ha Long Bay - World Natural Wonder",
  location: "Quang Ninh",
  price: 2500000,
  duration: "2 days 1 night",
};

// Payment methods
const PAYMENT_METHODS = [
  { id: "e-wallet", label: "E-wallet" },
  { id: "bank-transfer", label: "Bank Transfer" },
  { id: "cash", label: "Cash" },
];

// Main BookTour page component
const BookTour: React.FC = () => {
  // State for customer info form
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    people: 1,
    note: "",
    payment: "e-wallet",
  });
  // State for form validation and submission
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "people" ? Number(value) : value });
    setErrors({ ...errors, [name]: "" });
  };

  // Validate form fields
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (form.people < 1) newErrors.people = "At least 1 person required.";
    if (!form.payment) newErrors.payment = "Please select a payment method.";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Simulate booking (replace with API call if needed)
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({
      fullName: "",
      phone: "",
      email: "",
      people: 1,
      note: "",
      payment: "e-wallet",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fcff] flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="w-full max-w-3xl px-4">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Book Tour</h1>
      {/* Tour information section */}
      <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Tour Information</h2>
        <ul className="space-y-2">
          <li><strong>Name:</strong> {TOUR_INFO.name}</li>
          <li><strong>Location:</strong> {TOUR_INFO.location}</li>
          <li><strong>Price:</strong> {TOUR_INFO.price.toLocaleString()} VND</li>
          <li><strong>Duration:</strong> {TOUR_INFO.duration}</li>
        </ul>
      </div>
      {/* Booking form section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
        <form onSubmit={handleSubmit} noValidate>
          {/* Full name field */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
              placeholder="Your full name"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>
          {/* Phone field */}
          <div className="mb-4">
            <label htmlFor="phone" className="block font-medium mb-1">Phone Number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
              placeholder="Your phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
          {/* Email field */}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="Your email address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          {/* Number of people field */}
          <div className="mb-4">
            <label htmlFor="people" className="block font-medium mb-1">Number of People</label>
            <input
              type="number"
              id="people"
              name="people"
              min={1}
              value={form.people}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.people ? "border-red-500" : "border-gray-300"}`}
              placeholder="Number of people"
            />
            {errors.people && <p className="text-red-500 text-sm mt-1">{errors.people}</p>}
          </div>
          {/* Note field */}
          <div className="mb-4">
            <label htmlFor="note" className="block font-medium mb-1">Note</label>
            <textarea
              id="note"
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
              placeholder="Additional notes (optional)"
              rows={3}
            />
          </div>
          {/* Payment method selection */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Payment Method</label>
            <div className="flex gap-6">
              {PAYMENT_METHODS.map((method) => (
                <label key={method.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={form.payment === method.id}
                    onChange={handleChange}
                  />
                  {method.label}
                </label>
              ))}
            </div>
            {errors.payment && <p className="text-red-500 text-sm mt-1">{errors.payment}</p>}
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-semibold"
            disabled={submitted}
          >
            {submitted ? "Booking Successful!" : "Book Now"}
          </button>
        </form>
      </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookTour;
