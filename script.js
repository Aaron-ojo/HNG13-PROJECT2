document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  function getByTestId(testId) {
    return document.querySelector(`[data-testid="${testId}"]`);
  }

  function showError(field, message) {
    const errorElement = getByTestId(`test-contact-error-${field}`);
    const inputElement = getByTestId(`test-contact-${field}`);

    if (errorElement) {
      errorElement.textContent = message;
      // Ensure the error has an id for aria-describedby
      if (!errorElement.id) {
        errorElement.id = `error-${field}`;
      }
      errorElement.setAttribute("role", "alert");
    }

    if (inputElement) {
      inputElement.setAttribute("aria-invalid", "true");
      inputElement.setAttribute("aria-describedby", errorElement.id);
    }
  }

  function clearError(field) {
    const errorElement = getByTestId(`test-contact-error-${field}`);
    const inputElement = getByTestId(`test-contact-${field}`);

    if (errorElement) {
      errorElement.textContent = "";
      errorElement.removeAttribute("role");
    }

    if (inputElement) {
      inputElement.removeAttribute("aria-invalid");
      inputElement.removeAttribute("aria-describedby");
    }
  }

  function showSuccess() {
    const successMessage = getByTestId("test-contact-success");
    if (successMessage) {
      successMessage.textContent =
        "Thank you! Your message has been sent successfully.";
    }

    // Clear inputs and errors
    ["name", "email", "subject", "message"].forEach((field) => {
      const input = getByTestId(`test-contact-${field}`);
      if (input) input.value = "";
      clearError(field);
    });

    // move focus to success message for screen readers
    if (successMessage) {
      successMessage.focus?.();
    }
  }

  function validateName() {
    const el = getByTestId("test-contact-name");
    const name = el ? el.value.trim() : "";
    if (!name) {
      showError("name", "Full name is required");
      return false;
    }
    clearError("name");
    return true;
  }

  function validateEmail() {
    const el = getByTestId("test-contact-email");
    const email = el ? el.value.trim() : "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      showError("email", "Email is required");
      return false;
    }

    if (!emailRegex.test(email)) {
      showError("email", "Please enter a valid email address");
      return false;
    }

    clearError("email");
    return true;
  }

  function validateSubject() {
    const el = getByTestId("test-contact-subject");
    const subject = el ? el.value.trim() : "";
    if (!subject) {
      showError("subject", "Subject is required");
      return false;
    }
    clearError("subject");
    return true;
  }

  function validateMessage() {
    const el = getByTestId("test-contact-message");
    const message = el ? el.value.trim() : "";
    if (!message) {
      showError("message", "Message is required");
      return false;
    }

    if (message.length < 10) {
      showError("message", "Message must be at least 10 characters long");
      return false;
    }

    clearError("message");
    return true;
  }

  // Realtime clearing of errors while typing
  ["name", "email", "subject", "message"].forEach((field) => {
    const el = getByTestId(`test-contact-${field}`);
    if (el) {
      el.addEventListener("input", () => clearError(field));
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Clear any previous success message
    const successMessage = getByTestId("test-contact-success");
    if (successMessage) successMessage.textContent = "";

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
      showSuccess();
    }
  });
});
