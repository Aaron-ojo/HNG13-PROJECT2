const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function findEl(base, fallbacks = []) {
  let el = document.getElementById(base);
  if (el) return el;
  el = document.querySelector(`[data-testid="${base}"]`);
  if (el) return el;
  for (const id of fallbacks) {
    el = document.getElementById(id);
    if (el) return el;
    el = document.querySelector(`[data-testid="${id}"]`);
    if (el) return el;
  }
  return null;
}

(function initTimeUpdater() {
  const timeEl = findEl("test-user-time", [
    "test-user-time",
    "time",
    "profile-time",
  ]);
  if (!timeEl) return;
  function updateTime() {
    timeEl.textContent = Date.now();
  }
  updateTime();
  setInterval(updateTime, 1000);
})();

(function initAvatarUpload() {
  const fileInput = document.getElementById("file-upload");
  const avatarPreview = findEl("test-user-avatar", [
    "test-user-avatar",
    "test-user-avatar-upload",
    "avatar-preview",
  ]);
  if (!fileInput || !avatarPreview) return;
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type || !file.type.startsWith("image/")) {
      try {
        window.alert("Please select a valid image file (jpg, png, gif, etc.).");
      } catch (err) {}
      return;
    }
    if (avatarPreview.src && avatarPreview.src.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(avatarPreview.src);
      } catch (err) {}
    }
    avatarPreview.src = URL.createObjectURL(file);
  });
  fileInput.addEventListener("click", () => {
    console.log("File selector opened");
  });
})();

(function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const subjectInput = document.getElementById("contact-subject");
  const messageInput = document.getElementById("contact-message");
  const errName = findEl("test-contact-error-name", [
    "error-name",
    "test-contact-error-name",
  ]);
  const errEmail = findEl("test-contact-error-email", [
    "error-email",
    "test-contact-error-email",
  ]);
  const errSubject = findEl("test-contact-error-subject", [
    "error-subject",
    "test-contact-error-subject",
  ]);
  const errMessage = findEl("test-contact-error-message", [
    "error-message",
    "test-contact-error-message",
  ]);
  const successEl = findEl("test-contact-success", [
    "contact-success",
    "test-contact-success",
  ]);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(el, message) {
    if (!el) return;
    el.textContent = message;
    const describedInput =
      form.querySelector(
        `[aria-describedby="${el.id}"], [aria-describedby="${el.getAttribute(
          "data-testid"
        )}"]`
      ) || null;
    if (describedInput) {
      describedInput.setAttribute("aria-invalid", "true");
    }
  }

  function clearError(el) {
    if (!el) return;
    el.textContent = "";
    const describedInput =
      form.querySelector(
        `[aria-describedby="${el.id}"], [aria-describedby="${el.getAttribute(
          "data-testid"
        )}"]`
      ) || null;
    if (describedInput) {
      describedInput.removeAttribute("aria-invalid");
    }
  }

  function clearAllErrors() {
    [errName, errEmail, errSubject, errMessage].forEach(clearError);
    if (successEl) {
      successEl.textContent = "";
      successEl.hidden = true;
    }
  }

  function validate() {
    let valid = true;
    clearAllErrors();
    if (!nameInput || nameInput.value.trim() === "") {
      setError(errName, "Full name is required.");
      if (nameInput) nameInput.setAttribute("aria-invalid", "true");
      valid = false;
    }
    if (!emailInput || emailInput.value.trim() === "") {
      setError(errEmail, "Email is required.");
      if (emailInput) emailInput.setAttribute("aria-invalid", "true");
      valid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      setError(errEmail, "Please enter a valid email (name@example.com).");
      if (emailInput) emailInput.setAttribute("aria-invalid", "true");
      valid = false;
    }
    if (!subjectInput || subjectInput.value.trim() === "") {
      setError(errSubject, "Subject is required.");
      if (subjectInput) subjectInput.setAttribute("aria-invalid", "true");
      valid = false;
    }
    if (!messageInput || messageInput.value.trim() === "") {
      setError(errMessage, "Message is required.");
      if (messageInput) messageInput.setAttribute("aria-invalid", "true");
      valid = false;
    } else if (messageInput.value.trim().length < 10) {
      setError(errMessage, "Message must be at least 10 characters.");
      if (messageInput) messageInput.setAttribute("aria-invalid", "true");
      valid = false;
    }
    return valid;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    [nameInput, emailInput, subjectInput, messageInput].forEach((i) => {
      if (i) i.removeAttribute("aria-invalid");
    });
    if (validate()) {
      if (successEl) {
        successEl.textContent = "✅ Thanks — your message was sent!";
        successEl.hidden = false;
      } else {
        try {
          window.alert("Thanks — your message was sent!");
        } catch (err) {}
      }
      try {
        form.reset();
      } catch (err) {}
      if (successEl) {
        successEl.setAttribute("tabindex", "-1");
        successEl.focus();
      }
    } else {
      const firstInvalid = form.querySelector(
        '[aria-invalid="true"], :invalid'
      );
      if (firstInvalid && typeof firstInvalid.focus === "function")
        firstInvalid.focus();
    }
  });

  if (nameInput) {
    nameInput.addEventListener("blur", () => {
      if (nameInput.value.trim() !== "") clearError(errName);
    });
  }
  if (emailInput) {
    emailInput.addEventListener("blur", () => {
      if (
        emailInput.value.trim() !== "" &&
        emailRegex.test(emailInput.value.trim())
      )
        clearError(errEmail);
    });
  }
  if (subjectInput) {
    subjectInput.addEventListener("blur", () => {
      if (subjectInput.value.trim() !== "") clearError(errSubject);
    });
  }
  if (messageInput) {
    messageInput.addEventListener("input", () => {
      if (messageInput.value.trim().length >= 10) clearError(errMessage);
    });
  }
})();
