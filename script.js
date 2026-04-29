const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const contactForm = document.querySelector(".contact-form");

const showFormStatus = (form, message, type = "success") => {
  const status = form.querySelector(".form-status");
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.remove("is-error", "is-success");
  status.classList.add("is-visible", `is-${type}`);
};

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("is-open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    const languageOptions = contactForm.querySelector(".language-options");
    const checkedLanguage = contactForm.querySelector('input[name="talen-client"]:checked');

    if (!checkedLanguage) {
      event.preventDefault();
      languageOptions?.classList.add("has-error");
      showFormStatus(contactForm, "Kies minstens één gewenste taal van de cliënt.", "error");
      contactForm.querySelector('input[name="talen-client"]')?.focus();
      return;
    }

    languageOptions?.classList.remove("has-error");

    if (window.location.protocol !== "file:") {
      return;
    }

    event.preventDefault();

    showFormStatus(
      contactForm,
      "Bedankt, uw bericht is klaar om verzonden te worden. Op Cloudflare wordt dit formulier veilig doorgestuurd naar drrahim@live.be."
    );

    contactForm.reset();
  });

  contactForm.querySelectorAll('input[name="talen-client"]').forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      contactForm.querySelector(".language-options")?.classList.remove("has-error");
      contactForm.querySelector(".form-status")?.classList.remove("is-visible", "is-error");
    });
  });
}
