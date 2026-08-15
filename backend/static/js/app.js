document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Animations safely
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }

  // 2. Handle Contact Form Submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // We use the relative path '/contact' so it works on your live domain
      // and directs the request to your FastAPI backend
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, message }),
        });

        // Check if response is JSON before parsing
        const result = await response.json().catch(() => ({}));

        if (response.ok) {
          alert("Message sent successfully!");
          contactForm.reset();
        } else {
          alert("Error: " + (result.message || "Failed to send message."));
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to send message. Please check your network connection.");
      }
    });
  }
});
