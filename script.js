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
    }

    if (inputElement) {
      inputElement.setAttribute("aria-invalid", "true");
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
    }
  }

  function validateName() {
    const name = getByTestId("test-contact-name").value.trim();
    if (!name) {
      showError("name", "Full name is required");
      return false;
    }
    clearError("name");
    return true;
  }

  function validateEmail() {
    const email = getByTestId("test-contact-email").value.trim();
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
    const subject = getByTestId("test-contact-subject").value.trim();
    if (!subject) {
      showError("subject", "Subject is required");
      return false;
    }
    clearError("subject");
    return true;
  }

  function validateMessage() {
    const message = getByTestId("test-contact-message").value.trim();
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
    }
  });
});
