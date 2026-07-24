import { useState } from "react";
import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import { submitContactForm } from "../services/contactService";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.subject ||
      !formData.message
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await submitContactForm(formData);

      if (response.success) {
        setSuccess(response.message);

        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to submit your message."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Section */}

      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h1 className="text-5xl font-bold">
            Contact Us
          </h1>

          <p className="mt-4 text-lg text-blue-100">
            Have questions? We'd love to hear from you.
          </p>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10">

        {/* Left Side */}

        <div>

          <h2 className="text-3xl font-bold mb-6">
            Get In Touch
          </h2>

          <p className="text-slate-600 mb-8">
            Reach out to our healthcare team for appointments,
            support, emergency guidance, or general inquiries.
          </p>

          <div className="space-y-5">

            <Card>
              <h3 className="font-bold text-lg">
                📍 Address
              </h3>

              <p className="text-slate-600 mt-2">
                Healthcare Center,
                Hyderabad, Sindh, Pakistan
              </p>
            </Card>

            <Card>
              <h3 className="font-bold text-lg">
                📞 Phone
              </h3>

              <p className="text-slate-600 mt-2">
                +92 300 1234567
              </p>
            </Card>

            <Card>
              <h3 className="font-bold text-lg">
                ✉ Email
              </h3>

              <p className="text-slate-600 mt-2">
                support@healthcare.com
              </p>
            </Card>

            <Card>
              <h3 className="font-bold text-lg">
                🕒 Office Hours
              </h3>

              <p className="text-slate-600 mt-2">
                Monday - Saturday
              </p>

              <p className="text-slate-600">
                9:00 AM - 6:00 PM
              </p>
            </Card>

          </div>

        </div>

        {/* Right Side */}

        <div className="space-y-8">

          {/* Contact Form */}

          <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-6">
              Send us a Message
            </h2>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-5">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-5">
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />

              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />

              <div>

                <label className="block mb-2 font-semibold">
                  Message
                </label>

                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />

              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>

            </form>

          </div>

          {/* Google Map */}

          <Card>

            <h2 className="text-2xl font-bold mb-4">
              Our Location
            </h2>

            <iframe
              title="Healthcare Location"
              src="https://www.google.com/maps?q=Mehran+University+of+Engineering+and+Technology+Jamshoro&output=embed"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-2xl"
            ></iframe>

          </Card>

        </div>

      </div>

    </div>
  );
};

export default Contact;