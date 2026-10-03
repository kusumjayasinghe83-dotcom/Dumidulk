/* =========================================
   DUMIDUUDDIPANA
   AUTH + SUPABASE + DASHBOARD + PROTECTION
   FINAL CLEAN VERSION
   ========================================= */


/* =========================================
   SUPABASE CONFIG
   ========================================= */

const SUPABASE_URL =
  "https://dxfxfjdoebyszjobbeap.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_2iYq0qbW8-1W2pVYyBozKg_rRUesRqj";


/* =========================================
   WEBSITE URL
   ========================================= */

// Automatically uses the folder the site is running from,
// so it works on GitHub Pages, Netlify, localhost, anywhere.
const WEBSITE_URL =
  window.location.href
    .split("#")[0]
    .split("?")[0]
    .replace(/\/[^\/]*$/, "");


/* =========================================
   SUPABASE CLIENT
   ========================================= */

let supabaseClient = null;


/* =========================================
   START SUPABASE
   ========================================= */

function startSupabase() {

  if (!window.supabase) {

    console.error(
      "Supabase library was not loaded."
    );

    return false;
  }

  try {

    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );

    return true;

  } catch (error) {

    console.error(
      "Supabase initialization error:",
      error
    );

    return false;
  }
}


/* =========================================
   MOBILE MENU
   ========================================= */

function toggleMenu() {

  const navMenu =
    document.getElementById("navMenu");

  if (!navMenu) return;

  navMenu.classList.toggle("mobile-open");
}


/* =========================================
   CLOSE MOBILE MENU
   ========================================= */

function closeMobileMenu() {

  const navMenu =
    document.getElementById("navMenu");

  if (!navMenu) return;

  navMenu.classList.remove("mobile-open");
}


/* =========================================
   MOBILE LINKS
   ========================================= */

function setupMobileLinks() {

  const navMenu =
    document.getElementById("navMenu");

  if (!navMenu) return;

  const links =
    navMenu.querySelectorAll("a");

  links.forEach(function (link) {

    link.addEventListener(
      "click",
      closeMobileMenu
    );

  });
}


/* =========================================
   GET CURRENT USER
   ========================================= */

async function getCurrentUser() {

  if (!supabaseClient) {
    return null;
  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getUser();

    if (error) {

      console.error(
        "Get user error:",
        error
      );

      return null;
    }

    return data?.user || null;

  } catch (error) {

    console.error(
      "Get user exception:",
      error
    );

    return null;
  }
}


/* =========================================
   UPDATE NAVIGATION
   ========================================= */

async function updateNavigation() {

  if (!supabaseClient) return;

  const user =
    await getCurrentUser();


  const navLogin =
    document.getElementById("navLogin");

  const navRegister =
    document.getElementById("navRegister");

  const navDashboard =
    document.getElementById("navDashboard");

  const navLogout =
    document.getElementById("navLogout");

  const menuLogoutButton =
    document.getElementById(
      "menuLogoutButton"
    );

  const heroButtons =
    document.getElementById(
      "heroButtons"
    );


  /* =======================================
     LOGGED OUT
     ======================================= */

  if (!user) {

    if (navLogin) {

      navLogin.style.display =
        "inline-flex";

    }

    if (navRegister) {

      navRegister.style.display =
        "inline-flex";

    }

    if (navDashboard) {

      navDashboard.style.display =
        "none";

    }

    if (navLogout) {

      navLogout.style.display =
        "none";

    }

    if (menuLogoutButton) {

      menuLogoutButton.style.display =
        "none";

    }

    return;
  }


  /* =======================================
     LOGGED IN
     ======================================= */

  if (navLogin) {

    navLogin.style.display =
      "none";

  }

  if (navRegister) {

    navRegister.style.display =
      "none";

  }

  if (navDashboard) {

    navDashboard.style.display =
      "inline-flex";

  }

  if (navLogout) {

    navLogout.style.display =
      "inline-flex";

  }

  if (menuLogoutButton) {

    menuLogoutButton.style.display =
      "block";

  }


  /* =======================================
     HOME HERO
     ======================================= */

  if (heroButtons) {

    heroButtons.innerHTML = `

      <a
        href="dashboard.html"
        class="btn primary"
      >
        Open Dashboard →
      </a>

    `;

  }

}


/* =========================================
   LOGIN FORM
   ========================================= */

function setupLoginForm() {

  const loginForm =
    document.getElementById(
      "loginForm"
    );

  if (!loginForm) return;


  if (
    loginForm.dataset.initialized ===
    "true"
  ) {

    return;

  }

  loginForm.dataset.initialized =
    "true";


  loginForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();
      event.stopPropagation();


      const emailInput =
        document.getElementById(
          "loginEmail"
        );

      const passwordInput =
        document.getElementById(
          "loginPassword"
        );

      const message =
        document.getElementById(
          "loginMessage"
        );

      const button =
        loginForm.querySelector(
          'button[type="submit"]'
        );


      const email =
        emailInput?.value.trim();

      const password =
        passwordInput?.value;


      /* VALIDATION */

      if (!email) {

        if (message) {

          message.textContent =
            "❌ Please enter your email.";

        }

        emailInput?.focus();

        return;
      }


      if (!password) {

        if (message) {

          message.textContent =
            "❌ Please enter your password.";

        }

        passwordInput?.focus();

        return;
      }


      if (!supabaseClient) {

        if (message) {

          message.textContent =
            "❌ Connection error. Please refresh.";

        }

        return;
      }


      /* LOADING */

      if (button) {

        button.disabled = true;

        button.innerHTML =
          "Logging in... ⏳";

      }


      try {

        const {
          data,
          error
        } =
          await supabaseClient.auth
            .signInWithPassword({

              email: email,

              password: password

            });


        if (error) {

          console.error(
            "Login error:",
            error
          );

          if (message) {

            message.textContent =
              "❌ " + error.message;

          }

          if (button) {

            button.disabled = false;

            button.innerHTML =
              "Login →";

          }

          return;
        }


        if (data?.user) {

          if (message) {

            message.textContent =
              "✅ Login successful!";

          }

          if (button) {

            button.innerHTML =
              "Success ✓";

          }


          setTimeout(
            function () {

              window.location.href =
                WEBSITE_URL +
                "/dashboard.html";

            },
            500
          );

          return;
        }


      } catch (error) {

        console.error(
          "Login exception:",
          error
        );

        if (message) {

          message.textContent =
            "❌ Unable to login. Please try again.";

        }

        if (button) {

          button.disabled = false;

          button.innerHTML =
            "Login →";

        }

      }

    }
  );

}


/* =========================================
   REGISTER FORM
   ========================================= */

function setupRegisterForm() {

  const registerForm =
    document.getElementById(
      "registerForm"
    );

  if (!registerForm) return;


  if (
    registerForm.dataset.initialized ===
    "true"
  ) {

    return;

  }

  registerForm.dataset.initialized =
    "true";


  registerForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();
      event.stopPropagation();


      const nameInput =
        document.getElementById("name");

      const emailInput =
        document.getElementById("email");

      const passwordInput =
        document.getElementById("password");

      const confirmPasswordInput =
        document.getElementById(
          "confirmPassword"
        );

      const message =
        document.getElementById(
          "registerMessage"
        );

      const button =
        registerForm.querySelector(
          'button[type="submit"]'
        );


      const name =
        nameInput?.value.trim();

      const email =
        emailInput?.value.trim();

      const password =
        passwordInput?.value;

      const confirmPassword =
        confirmPasswordInput?.value;


      /* VALIDATION */

      if (!name) {

        if (message)
          message.textContent =
            "❌ Please enter your name.";

        nameInput?.focus();

        return;
      }


      if (!email) {

        if (message)
          message.textContent =
            "❌ Please enter your email.";

        emailInput?.focus();

        return;
      }


      if (!password) {

        if (message)
          message.textContent =
            "❌ Please create a password.";

        passwordInput?.focus();

        return;
      }


      if (password.length < 8) {

        if (message)
          message.textContent =
            "❌ Password must be at least 8 characters.";

        passwordInput?.focus();

        return;
      }


      if (
        password !==
        confirmPassword
      ) {

        if (message)
          message.textContent =
            "❌ Passwords do not match.";

        confirmPasswordInput?.focus();

        return;
      }


      if (!supabaseClient) {

        if (message)
          message.textContent =
            "❌ Connection error. Please refresh.";

        return;
      }


      if (button) {

        button.disabled = true;

        button.textContent =
          "Creating Account...";

      }


      try {

        const {
          data,
          error
        } =
          await supabaseClient.auth
            .signUp({

              email: email,

              password: password,

              options: {

                data: {

                  full_name: name

                },

                emailRedirectTo:
                  WEBSITE_URL +
                  "/login.html"

              }

            });


        if (error) {

          console.error(
            "Register error:",
            error
          );

          if (message)
            message.textContent =
              "❌ " + error.message;

          if (button) {

            button.disabled = false;

            button.textContent =
              "Create Account";

          }

          return;
        }


        if (message) {

          if (data?.session) {

            message.textContent =
              "✅ Account created successfully!";

          } else {

            message.textContent =
              "✅ Account created! Check your email.";

          }

        }


        if (button) {

          button.disabled = false;

          button.textContent =
            "Create Account";

        }


      } catch (error) {

        console.error(
          "Register exception:",
          error
        );

        if (message)
          message.textContent =
            "❌ Something went wrong.";

        if (button) {

          button.disabled = false;

          button.textContent =
            "Create Account";

        }

      }

    }
  );

}


/* =========================================
   GOOGLE SIGN IN
   ========================================= */

async function signInWithGoogle(button) {

  if (!supabaseClient) startSupabase();

  if (!supabaseClient) {

    console.error(
      "Supabase is not ready."
    );

    return;
  }

  if (button) {

    button.disabled = true;

  }

  try {

    const {
      error
    } =
      await supabaseClient.auth
        .signInWithOAuth({

          provider: "google",

          options: {

            redirectTo:
              WEBSITE_URL +
              "/dashboard.html"

          }

        });

    if (error) {

      console.error(
        "Google sign in error:",
        error
      );

      if (button) {

        button.disabled = false;

      }

    }

    /* On success, Supabase redirects the browser
       to Google automatically, so there is nothing
       else to do here. */

  } catch (error) {

    console.error(
      "Google sign in exception:",
      error
    );

    if (button) {

      button.disabled = false;

    }

  }

}


/* =========================================
   LOGOUT FUNCTION
   ========================================= */

async function logoutUser(button) {

  if (!supabaseClient) {

    console.error(
      "Supabase is not ready."
    );

    return;
  }


  if (button) {

    button.disabled = true;

    button.textContent =
      "Logging out...";

  }


  try {

    const {
      error
    } =
      await supabaseClient.auth
        .signOut();


    if (error) {

      console.error(
        "Logout error:",
        error
      );

      if (button) {

        button.disabled = false;

        button.textContent =
          "Logout";

      }

      alert(
        "Logout failed. Please try again."
      );

      return;
    }


    /* CLEAR LOCAL SESSION */

    try {

      localStorage.clear();

    } catch (e) {

      console.log(
        "Local storage clear skipped."
      );

    }


    /* GO HOME */

    window.location.replace(
      WEBSITE_URL +
      "/index.html"
    );


  } catch (error) {

    console.error(
      "Logout exception:",
      error
    );

    if (button) {

      button.disabled = false;

      button.textContent =
        "Logout";

    }

  }

}


/* =========================================
   SETUP ALL LOGOUT BUTTONS
   ========================================= */

function setupLogout() {

  const logoutButtons =
    document.querySelectorAll(
      "#navLogout, #menuLogoutButton, #logoutButton"
    );


  if (!logoutButtons.length) return;


  logoutButtons.forEach(
    function (button) {

      if (
        button.dataset.initialized ===
        "true"
      ) {

        return;

      }

      button.dataset.initialized =
        "true";


      button.addEventListener(
        "click",
        async function (event) {

          event.preventDefault();
          event.stopPropagation();

          await logoutUser(button);

        }
      );

    }
  );

}


/* =========================================
   PROTECTED CARDS - HOME
   ========================================= */

function setupProtectedCards() {

  const cards =
    document.querySelectorAll(
      ".protected-card"
    );

  const modal =
    document.getElementById(
      "loginModal"
    );

  const closeButton =
    document.getElementById(
      "modalClose"
    );


  if (
    !cards.length ||
    !modal
  ) {

    return;

  }


  cards.forEach(
    function (card) {

      if (
        card.dataset.initialized ===
        "true"
      ) {

        return;

      }

      card.dataset.initialized =
        "true";


      card.addEventListener(
        "click",
        async function (event) {

          event.preventDefault();


          const user =
            await getCurrentUser();


          /* NOT LOGGED IN */

          if (!user) {

            modal.classList.add(
              "show"
            );

            return;
          }


          /* LOGGED IN */

          const page =
            card.dataset.page;


          if (page) {

            window.location.href =
              page;

          }

        }
      );

    }
  );


  /* CLOSE */

  if (closeButton) {

    closeButton.addEventListener(
      "click",
      function () {

        modal.classList.remove(
          "show"
        );

      }
    );

  }


  /* OUTSIDE CLICK */

  modal.addEventListener(
    "click",
    function (event) {

      if (
        event.target === modal
      ) {

        modal.classList.remove(
          "show"
        );

      }

    }
  );


  /* ESC */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape"
      ) {

        modal.classList.remove(
          "show"
        );

      }

    }
  );

}


/* =========================================
   PROTECT DASHBOARD
   ========================================= */

async function protectDashboard() {

  const isDashboard =
    window.location.pathname
      .toLowerCase()
      .includes(
        "dashboard.html"
      );


  if (!isDashboard) return;


  if (!supabaseClient) {

    window.location.replace(
      WEBSITE_URL +
      "/login.html"
    );

    return;
  }


  const user =
    await getCurrentUser();


  /* NOT LOGGED IN */

  if (!user) {

    window.location.replace(
      WEBSITE_URL +
      "/login.html"
    );

    return;
  }


  /* =======================================
     SHOW USER NAME
     ======================================= */

  const userName =
    document.getElementById(
      "userName"
    );


  if (userName) {

    const name =
      user.user_metadata
        ?.full_name;


    userName.textContent =
      name ||
      user.email ||
      "Student";

  }

}


/* =========================================
   AUTH STATE LISTENER
   ========================================= */

function setupAuthListener() {

  if (!supabaseClient) return;


  supabaseClient.auth.onAuthStateChange(
    async function (
      event,
      session
    ) {

      console.log(
        "Auth event:",
        event
      );


      await updateNavigation();


      /* If signed out */

      if (
        event === "SIGNED_OUT"
      ) {

        const isDashboard =
          window.location.pathname
            .toLowerCase()
            .includes(
              "dashboard.html"
            );


        if (isDashboard) {

          window.location.replace(
            WEBSITE_URL +
            "/login.html"
          );

        }

      }

    }
  );

}


/* =========================================
   PASSWORD SHOW / HIDE
   ========================================= */

function togglePassword(
  inputId,
  button
) {

  const input =
    document.getElementById(
      inputId
    );

  if (!input) return;


  if (
    input.type ===
    "password"
  ) {

    input.type =
      "text";


    if (button) {

      button.textContent =
        "🙈";

      button.setAttribute(
        "aria-label",
        "Hide password"
      );

    }

  } else {

    input.type =
      "password";


    if (button) {

      button.textContent =
        "👁";

      button.setAttribute(
        "aria-label",
        "Show password"
      );

    }

  }

}



/* =========================================
   PROTECT MEMBER-ONLY PAGES
   (pages that have <body data-protected>)
   ========================================= */

async function protectMemberPages() {

  if (!document.body.hasAttribute("data-protected")) return;

  const user = await getCurrentUser();

  if (!user) {
    window.location.replace("login.html");
  }

}


/* =========================================
   COPY BUTTONS (lessons)
   ========================================= */

async function copyLessonText(button) {

  const box =
    button.closest(".lesson-description-box");

  const textarea =
    box ? box.querySelector("textarea") : null;

  if (!textarea) return;

  const original = button.textContent;

  try {

    await navigator.clipboard.writeText(textarea.value);

  } catch (e) {

    textarea.removeAttribute("readonly");
    textarea.select();
    document.execCommand("copy");
    textarea.setAttribute("readonly", "");

  }

  button.textContent = "✅ Copied!";

  setTimeout(function () {
    button.textContent = original;
  }, 1500);

}

function setupCopyButtons() {

  /* Generic: any [data-copy="#id"] button */

  document.querySelectorAll("[data-copy]").forEach(function (btn) {

    btn.addEventListener("click", async function () {

      const target =
        document.querySelector(btn.dataset.copy);

      if (!target) return;

      const text = target.value ?? target.textContent;
      const original = btn.textContent;

      try {
        await navigator.clipboard.writeText(text.trim());
      } catch (e) { /* ignore */ }

      btn.textContent = "✅ Copied!";
      setTimeout(function () { btn.textContent = original; }, 1500);

    });

  });

}


/* =========================================
   YOUTUBE THUMBNAIL TOOL
   ========================================= */

function getYouTubeId(url) {

  try {

    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\.|^m\./, "");

    if (host === "youtu.be") {
      return u.pathname.slice(1).split("/")[0] || null;
    }

    if (host.endsWith("youtube.com")) {

      if (u.searchParams.get("v")) {
        return u.searchParams.get("v");
      }

      const m = u.pathname.match(/^\/(embed|shorts|live|v)\/([\w-]{11})/);

      if (m) return m[2];

    }

  } catch (e) { /* not a URL */ }

  return null;

}

function setupThumbnailTool() {

  const form = document.getElementById("thumbnailForm");

  if (!form) return;

  const input   = document.getElementById("youtubeUrl");
  const message = document.getElementById("thumbnailMessage");
  const result  = document.getElementById("thumbnailResult");
  const image   = document.getElementById("thumbnailImage");
  const openBtn = document.getElementById("downloadThumbnail");
  const saveBtn = document.getElementById("saveThumbnail");

  form.addEventListener("submit", function (event) {

    event.preventDefault();

    const id = getYouTubeId(input.value);

    if (!id) {
      message.textContent = "❌ That doesn't look like a YouTube link.";
      result.style.display = "none";
      return;
    }

    message.textContent = "";

    const best = "https://img.youtube.com/vi/" + id + "/maxresdefault.jpg";
    const fallback = "https://img.youtube.com/vi/" + id + "/hqdefault.jpg";

    function show(url) {
      image.src = url;
      openBtn.href = url;
      saveBtn.href = url;
      result.style.display = "block";
    }

    /* maxres does not exist for every video, so fall back */

    image.onerror = function () {
      image.onerror = null;
      show(fallback);
    };

    show(best);

  });

  /* Download button: fetch as blob so it really downloads */

  saveBtn.addEventListener("click", async function (event) {

    if (!saveBtn.href) return;

    event.preventDefault();

    try {

      const res  = await fetch(saveBtn.href);
      const blob = await res.blob();
      const a    = document.createElement("a");

      a.href = URL.createObjectURL(blob);
      a.download = "youtube-thumbnail.jpg";
      a.click();

      URL.revokeObjectURL(a.href);

    } catch (e) {

      window.open(saveBtn.href, "_blank", "noopener");

    }

  });

}


/* =========================================
   CONTACT FORM
   (saves to Supabase table: contact_messages)
   ========================================= */

function setupContactForm() {

  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", sendContact);

}

async function sendContact(event) {

  event.preventDefault();

  const form    = event.target;
  const result  = document.getElementById("contactResult");
  const button  = form.querySelector('button[type="submit"]');

  const payload = {
    name:    document.getElementById("contactName").value.trim(),
    email:   document.getElementById("contactEmail").value.trim(),
    message: document.getElementById("contactMessage").value.trim()
  };

  if (!supabaseClient) startSupabase();

  if (!supabaseClient) {
    result.textContent = "❌ Connection error. Please refresh and try again.";
    return;
  }

  button.disabled = true;
  button.textContent = "Sending...";

  const { error } =
    await supabaseClient.from("contact_messages").insert(payload);

  button.disabled = false;
  button.textContent = "Send Message";

  if (error) {
    console.error("Contact error:", error);
    result.textContent = "❌ Could not send. Please try again later.";
    return;
  }

  form.reset();
  result.textContent = "✅ Thank you! Your message was sent.";

}


/* =========================================
   FREE EBOOK FORM
   (saves to Supabase table: ebook_requests)
   ========================================= */

function setupEbookForm() { /* uses onsubmit="requestEbook(event)" */ }

async function requestEbook(event) {

  event.preventDefault();

  const form    = event.target;
  const message = document.getElementById("ebookMessage");
  const button  = form.querySelector('button[type="submit"]');

  const payload = {
    name:  document.getElementById("ebookName").value.trim(),
    email: document.getElementById("ebookEmail").value.trim()
  };

  if (!supabaseClient) startSupabase();

  if (!supabaseClient) {
    message.textContent = "❌ Connection error. Please refresh and try again.";
    return;
  }

  button.disabled = true;

  const { error } =
    await supabaseClient.from("ebook_requests").insert(payload);

  button.disabled = false;

  if (error) {
    console.error("Ebook error:", error);
    message.textContent = "❌ Could not save your request. Please try again.";
    return;
  }

  form.reset();
  message.textContent = "✅ Thank you! We will send the eBook to your email.";

}


/* =========================================
   LESSON COMPLETE BUTTON
   ========================================= */

function setupLessonButton() { /* uses onclick="completeLesson()" */ }

function completeLesson() {

  const btn = document.querySelector(".lesson-content .btn");

  try {
    localStorage.setItem("lesson-01-complete", "yes");
  } catch (e) { /* ignore */ }

  if (btn) {
    btn.textContent = "✅ Completed";
    btn.disabled = true;
  }

}


/* =========================================
   PAGE LOAD
   ========================================= */

window.addEventListener(
  "DOMContentLoaded",
  async function () {

    /* THINGS THAT DO NOT NEED SUPABASE */

    setupMobileLinks();
    setupCopyButtons();
    setupThumbnailTool();
    setupContactForm();
    setupEbookForm();
    setupLessonButton();


    /* START SUPABASE */

    const started =
      startSupabase();

    /* Even if Supabase is down, locked cards
       must still show the login popup. */

    if (!started) {

      setupProtectedCards();

      return;

    }

    setupLoginForm();
    setupRegisterForm();

    await updateNavigation();

    setupLogout();
    setupProtectedCards();
    setupAuthListener();

    await protectDashboard();
    await protectMemberPages();

  }
);
