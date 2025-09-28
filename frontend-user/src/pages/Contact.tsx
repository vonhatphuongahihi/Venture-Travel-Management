import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Contact information for the company
const CONTACT_INFO = {
  address: "123 Nguyen Van Cu, Hanoi, Vietnam",
  email: "info@viettravel.com",
  phone: "+84 123 456 789",
};

// Main Contact page component
const Contact: React.FC = () => {
  // State for form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  // State for form validation and submission
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Validate form fields
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!form.message.trim()) newErrors.message = "Message is required.";
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
    // Simulate sending message (replace with API call if needed)
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#f8fcff] flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="w-full max-w-3xl px-4">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Contact Us</h1>
      {/* Contact information section */}
      <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Our Contact Information</h2>
        <ul className="space-y-2">
          <li><strong>Address:</strong> {CONTACT_INFO.address}</li>
          <li><strong>Email:</strong> <a href={`mailto:${CONTACT_INFO.email}`} className="text-blue-600 underline">{CONTACT_INFO.email}</a></li>
          <li><strong>Phone:</strong> <a href={`tel:${CONTACT_INFO.phone}`} className="text-blue-600 underline">{CONTACT_INFO.phone}</a></li>
        </ul>
      </div>
      {/* Contact form section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
        <form onSubmit={handleSubmit} noValidate>
          {/* Name field */}
          <div className="mb-4">
            <label htmlFor="name" className="block font-medium mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.name ? "border-red-500" : "border-gray-300"}`}
              placeholder="Your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
          {/* Message field */}
          <div className="mb-4">
            <label htmlFor="message" className="block font-medium mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.message ? "border-red-500" : "border-gray-300"}`}
              placeholder="Your message"
              rows={5}
            />
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-semibold"
            disabled={submitted}
          >
            {submitted ? "Message Sent!" : "Send Message"}
          </button>
        </form>
      </div>
      {/* Optional: Google Maps embed (commented out) */}
      {/*
      <div className="mt-8">
        <iframe
          title="Company Location"
          src="https://www.google.com/maps/embed?..."
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
      */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
