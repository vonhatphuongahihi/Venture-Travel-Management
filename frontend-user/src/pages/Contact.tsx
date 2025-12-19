import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import { useSendContactMessage } from "@/services/contact/contactHook";
import { useToast } from "@/contexts/ToastContext";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = t("contact.errors.nameRequired");
    } else if (form.name.trim().length < 2) {
      newErrors.name = t("contact.errors.nameMinLength");
    } else if (form.name.trim().length > 100) {
      newErrors.name = t("contact.errors.nameMaxLength");
    }

    // Email validation
    if (!form.email.trim()) {
      newErrors.email = t("contact.errors.emailRequired");
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      newErrors.email = t("contact.errors.emailInvalid");
    }

    // Message validation
    if (!form.message.trim()) {
      newErrors.message = t("contact.errors.messageRequired");
    } else if (form.message.trim().length < 10) {
      newErrors.message = t("contact.errors.messageMinLength");
    } else if (form.message.trim().length > 1000) {
      newErrors.message = t("contact.errors.messageMaxLength");
    }

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
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      showToast(t("contact.toast.success"), "success");
      setForm({ name: "", email: "", message: "" });
      setErrors({});
    } catch (error: any) {
      // Parse backend validation error
      const backendError = error?.response?.data?.error || "";
      const errorMessage = error?.response?.data?.message || "";

      // Map backend errors to form fields
      const fieldErrors: { [key: string]: string } = {};
      let toastMessage = t("contact.toast.error");

      if (backendError) {
        const errorLower = backendError.toLowerCase();

        // Check for name errors
        if (errorLower.includes("name") || errorLower.includes("tên")) {
          if (errorLower.includes("required") || errorLower.includes("bắt buộc")) {
            fieldErrors.name = t("contact.errors.nameRequired");
            toastMessage = t("contact.toast.nameRequired");
          } else if (errorLower.includes("min") || errorLower.includes("ít nhất")) {
            fieldErrors.name = t("contact.errors.nameMinLength");
            toastMessage = t("contact.toast.nameMinLength");
          } else if (errorLower.includes("max") || errorLower.includes("vượt quá")) {
            fieldErrors.name = t("contact.errors.nameMaxLength");
            toastMessage = t("contact.toast.nameMaxLength");
          } else {
            fieldErrors.name = backendError;
            toastMessage = backendError;
          }
        }
        // Check for email errors
        else if (errorLower.includes("email")) {
          if (errorLower.includes("required") || errorLower.includes("bắt buộc")) {
            fieldErrors.email = t("contact.errors.emailRequired");
            toastMessage = t("contact.toast.emailRequired");
          } else if (errorLower.includes("valid") || errorLower.includes("hợp lệ")) {
            fieldErrors.email = t("contact.errors.emailInvalid");
            toastMessage = t("contact.toast.emailInvalid");
          } else {
            fieldErrors.email = backendError;
            toastMessage = backendError;
          }
        }
        // Check for message errors
        else if (errorLower.includes("message") || errorLower.includes("tin nhắn")) {
          if (errorLower.includes("required") || errorLower.includes("bắt buộc")) {
            fieldErrors.message = t("contact.errors.messageRequired");
            toastMessage = t("contact.toast.messageRequired");
          } else if (errorLower.includes("min") || errorLower.includes("ít nhất")) {
            fieldErrors.message = t("contact.errors.messageMinLength");
            toastMessage = t("contact.toast.messageMinLength");
          } else if (errorLower.includes("max") || errorLower.includes("vượt quá")) {
            fieldErrors.message = t("contact.errors.messageMaxLength");
            toastMessage = t("contact.toast.messageMaxLength");
          } else {
            fieldErrors.message = backendError;
            toastMessage = backendError;
          }
        }
        // Generic validation error
        else {
          toastMessage = backendError || errorMessage || t("contact.toast.error");
        }
      } else if (errorMessage) {
        toastMessage = errorMessage;
      }

      // Set field errors if any
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      }

      // Show toast with specific error message
      showToast(toastMessage, "error");
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFDFF] flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-primary">
              {t("contact.title")}
            </h1>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-700">
                {t("contact.info.title")}
              </h2>

              <div className="flex items-start space-x-4">
                <MapPin className="text-primary mt-1 w-5 h-5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800">{t("contact.info.addressLabel")}</h3>
                  <p className="text-gray-600">{CONTACT_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="text-primary mt-1 w-5 h-5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800">{t("contact.info.emailLabel")}</h3>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="text-primary mt-1 w-5 h-5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-800">{t("contact.info.phoneLabel")}</h3>
                  <a
                    href={`tel:${CONTACT_INFO.phone}`}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.231437889702!2d106.8000503152608!3d10.8697559922586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527587e9ad5bf%3A0xafa66f9c8be3c91!2sUniversity%20of%20Information%20Technology%20-%20VNUHCM!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="rounded-xl shadow-md"
                title="Location Map"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {t("contact.form.title")}
            </h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("contact.form.nameLabel")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t("contact.form.namePlaceholder")}
                  className={`w-full px-4 py-3 rounded-lg border transition ${errors.name
                    ? "border-destructive focus:ring-2 focus:ring-destructive focus:border-destructive"
                    : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                    }`}
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("contact.form.emailLabel")} <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("contact.form.emailPlaceholder")}
                  className={`w-full px-4 py-3 rounded-lg border transition ${errors.email
                    ? "border-destructive focus:ring-2 focus:ring-destructive focus:border-destructive"
                    : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                    }`}
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("contact.form.messageLabel")} <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder={t("contact.form.messagePlaceholder")}
                  className={`w-full px-4 py-3 rounded-lg border transition ${errors.message
                    ? "border-destructive focus:ring-2 focus:ring-destructive focus:border-destructive"
                    : "border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                    }`}
                ></textarea>
                {errors.message && (
                  <p className="text-destructive text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full bg-primary hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{submitted ? t("contact.form.submitting") : t("contact.form.submit")}</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
