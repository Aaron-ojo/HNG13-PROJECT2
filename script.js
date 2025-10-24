document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  function getByTestId(testId) {
    return document.querySelector(`[data-testid="${testId}"]`);
  }

  function showError(field, message) {
    const errorElement = getByTestId(`test-contact-error-${field}`);
    const inputElement = getByTestId(`test-contact-${field}`);

    if (errorElement) {
      errorElement.textContent = message;
      if (!errorElement.id) {
        errorElement.id = `error-${field}`;
      }
      if (inputElement) {
        inputElement.setAttribute("aria-describedby", errorElement.id);
        inputElement.setAttribute("aria-invalid", "true");
      }
    }
  }

  function clearError(field) {
    const errorElement = getByTestId(`test-contact-error-${field}`);
    const inputElement = getByTestId(`test-contact-${field}`);

    if (errorElement) {
      errorElement.textContent = "";
    }

    if (inputElement) {
      inputElement.removeAttribute("aria-invalid");
    }
  }

  function showSuccess() {
    const successMessage = getByTestId("test-contact-success");
    if (successMessage) {
      successMessage.textContent =
        "Thank you! Your message has been sent successfully.";

      form.reset();

      ["name", "email", "subject", "message"].forEach((f) => clearError(f));

      successMessage.focus?.();
    }
  }

  function validateName() {
    const el = getByTestId("test-contact-name");
    const name = el && el.value ? el.value.trim() : "";
    if (!name) {
      showError("name", "Full name is required");
      return false;
    }
    clearError("name");
    return true;
  }

  function validateEmail() {
    const el = getByTestId("test-contact-email");
    const email = el && el.value ? el.value.trim() : "";
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
    const subject = el && el.value ? el.value.trim() : "";
    if (!subject) {
      showError("subject", "Subject is required");
      return false;
    }
    clearError("subject");
    return true;
  }

  function validateMessage() {
    const el = getByTestId("test-contact-message");
    const message = el && el.value ? el.value.trim() : "";
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

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
      showSuccess();
    } else {
      const firstInvalid = form.querySelector("[aria-invalid='true']");
      if (firstInvalid) firstInvalid.focus();
    }
  });
});
