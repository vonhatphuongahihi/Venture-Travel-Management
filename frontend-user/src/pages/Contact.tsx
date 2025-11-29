import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ToursSection from "@/components/tour/ToursSection";
import { MapPin, Clock, Mail, FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from "lucide-react";
import heroVietnam from "@/assets/top-3-destination.png"
import { useSendContactMessage } from "@/services/contact/contactHook";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";

// Contact information for the company
const CONTACT_INFO = {
  address: "Khu phố 34, Phường Linh Xuân, Thành phố Hồ Chí Minh.",
  email: "info@venture.com",
  phone: "+84 123 456 789",
};

// Main Contact page component
const Contact: React.FC = () => {
  const sendContactMessage = useSendContactMessage();
  const { showToast } = useToast();

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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Send contact message
    try {
      setSubmitted(true);
      await sendContactMessage.mutateAsync({
        name: form.name,
        email: form.email,
        message: form.message,
      });

      showToast("Message sent successfully!", "success");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      showToast("Failed to send message. Please try again later.", "error");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="w-full">
        <img
          src="/src/assets/hero-vietnam-2.jpg"
          alt="Contact banner"
          className="w-full h-44 object-cover"
        />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="w-full max-w-3xl lg:max-w-5xl px-4">
          {/* Page title */}
          <h1 className="text-3xl font-bold mb-6 text-center text-primary">
            Liên hệ với chúng tôi
          </h1>
          <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 justify-between">
            {/* Contact information section */}
            <div className="w-full lg:w-1/2 bg-card rounded-2xl shadow-lg p-6 border border-border bg-cover" style={{ backgroundImage: `url(${heroVietnam})` }}>
              <h2 className="text-xl font-semibold mb-4 text-background">
                Thông tin liên hệ
              </h2>
              <ul className="space-y-2 lg:space-y-6 mb-4 lg:mb-8 text-background">
                <li>
                  <strong className="text-background">Địa chỉ:</strong>{" "}
                 {CONTACT_INFO.address}
                </li>
                <li>
                  <strong className="text-background">Email:</strong>{" "}
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-background underline hover:text-primary"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </li>
                <li>
                  <strong className="text-background">Điện thoại:</strong>{" "}
                  <a
                    href={`tel:${CONTACT_INFO.phone}`}
                    className="text-background underline hover:text-primary"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </li>
              </ul>
              {/* Social button section */}
              <div className="flex items-center gap-4 w-full">
                <Button className="size-8 lg:size-10 rounded-full bg-background text-primary hover:bg-background/80" title="Theo dõi trên Facebook">
                <a href="https://facebook.com" target="_blank"><FacebookIcon /></a>     
                </Button>
                <Button className="size-8 lg:size-10 rounded-full bg-background text-primary hover:bg-background/80" title="Theo dõi trên Instagram">
                <a href="https://instagram.com" target="_blank"><InstagramIcon /></a>     
                </Button>
                <Button className="size-8 lg:size-10 rounded-full bg-background text-primary hover:bg-background/80" title="Theo dõi trên X">
                <a href="https://x.com" target="_blank"><TwitterIcon /></a>     
                </Button>
                <Button className="size-8 lg:size-10 rounded-full bg-background text-primary hover:bg-background/80" title="Theo dõi trên Youtube">
                <a href="https://youtube.com" target="_blank"><YoutubeIcon /></a>     
                </Button>
              </div>
            </div>
            {/* Contact form section */}
            <div className="bg-card w-full lg:w-1/2 rounded-2xl shadow-lg p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <form onSubmit={handleSubmit} noValidate>
                {/* Name field */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block font-medium mb-1 text-foreground"
                  >
                    Tên người dùng <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                      errors.name ? "border-destructive" : "border-input"
                    } bg-background`}
                    placeholder="Nhập tên của bạn"
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                {/* Email field */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block font-medium mb-1 text-foreground"
                  >
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                      errors.email ? "border-destructive" : "border-input"
                    } bg-background`}
                    placeholder="Nhập địa chỉ email"
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                {/* Message field */}
                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block font-medium mb-1 text-foreground"
                  >
                    Tin nhắn <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
                      errors.message ? "border-destructive" : "border-input"
                    } bg-background`}
                    placeholder="Nhập tin nhắn của bạn"
                    rows={5}
                  />
                  {errors.message && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>
                {/* Submit button */}
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-6 py-2 rounded hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
                  disabled={submitted}
                >
                  {submitted ? "Đang gửi tin nhắn..." : "Gửi tin nhắn"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
