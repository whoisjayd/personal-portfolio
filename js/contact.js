// Contact Form Handler
class ContactForm {
  constructor() {
    this.form = document.getElementById("contact-form")
    this.messageElement = document.getElementById("form-message")
    this.submitButton = this.form.querySelector(".submit-button")
    this.isSubmitting = false

    this.init()
  }

  init() {
    // Initialize EmailJS
    window.emailjs = window.emailjs || {}
    if (typeof window.emailjs !== "undefined") {
      window.emailjs.init("xIyOy8I3pQDQwr0nJ")
    } else {
      console.warn("EmailJS not loaded")
    }

    // Add form event listener
    this.form.addEventListener("submit", this.handleSubmit.bind(this))
  }

  async handleSubmit(event) {
    event.preventDefault()

    if (this.isSubmitting) return

    this.isSubmitting = true
    this.showMessage("Sending...", "")
    this.setButtonState(true)

    try {
      if (typeof window.emailjs === "undefined") {
        throw new Error("EmailJS not available")
      }

      await window.emailjs.sendForm("service_kuwbzdy", "template_tnfw7cb", this.form)

      this.showMessage("Message Sent!", "success")
      this.animateSuccess()

      // Reset form after delay
      setTimeout(() => {
        this.resetForm()
      }, 2000)
    } catch (error) {
      console.error("EmailJS error:", error)
      this.showMessage("Failed to send message. Please try again.", "error")
    } finally {
      this.isSubmitting = false
      this.setButtonState(false)
    }
  }

  showMessage(text, type) {
    this.messageElement.textContent = text
    this.messageElement.className = `form-message ${type}`
  }

  setButtonState(disabled) {
    this.submitButton.disabled = disabled
    this.submitButton.style.opacity = disabled ? "0.6" : "1"
    this.submitButton.style.cursor = disabled ? "not-allowed" : "pointer"
  }

  animateSuccess() {
    window.gsap = window.gsap || {}
    if (typeof window.gsap !== "undefined") {
      window.gsap.fromTo(
        this.messageElement,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
      )
    }
  }

  resetForm() {
    this.form.reset()
    this.messageElement.textContent = ""
    this.messageElement.className = "form-message"
  }
}

// Initialize contact form when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ContactForm()
})
