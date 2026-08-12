import "./style.css";

const root = document.documentElement;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const projects = [
  {
    kicker: "Full-stack product · 2026",
    title: "VCT Fantasy",
    description:
      "A multi-page fantasy product for professional VALORANT: authentication, constrained roster building, player projections, public teams, leaderboards, generated share cards, admin tooling, and scheduled VLR data sync.",
    tags: ["PHP", "SQL", "Data sync", "Product systems"],
    href: "https://github.com/LucPeloquin/VALORANTfantasy",
  },
  {
    kicker: "Computer vision · Evolving R&D",
    title: "Broadcast Vision",
    description:
      "An evolving vision system that converts esports broadcasts into structured match data. It began with screen capture, OCR, fuzzy matching, and weapon templates, then moved toward YOLO-based detection for scores, timers, player panels, agents, and the minimap.",
    tags: ["Python", "YOLOv8", "OpenCV", "OCR"],
    href: "https://github.com/LucPeloquin/VCT-UI",
  },
  {
    kicker: "Adaptive image processing · 2024",
    title: "Fashion Enhancer",
    description:
      "A desktop and batch-processing pipeline that inspects each fashion image before choosing its enhancement path: denoising, Lanczos upscaling, LAB and CLAHE corrections, sharpening, shadow recovery, segmentation, background removal, and final quality assessment.",
    tags: ["Python", "OpenCV", "U2Net", "Parallel processing"],
    href: "https://github.com/LucPeloquin/Automatic-Enhancement-of-Fashion-Imagery",
  },
  {
    kicker: "Experimental interface · 2026",
    title: "Portfolio OS",
    description:
      "An interactive portfolio treated as a complete interface system: a dual-screen firmware metaphor, boot sequence, physical-style controls, sound, touch and keyboard navigation, motion, state management, deterministic asset tooling, and automated tests.",
    tags: ["TypeScript", "Next.js", "Motion", "Web audio"],
    href: "https://github.com/LucPeloquin/flick-owens-dotdev",
  },
  {
    kicker: "Browser utility · 2025",
    title: "Quick Save",
    description:
      "A focused Manifest V3 extension for saving images, links, video, and audio with Alt-click or a context-menu action. It includes configurable download folders, immediate visual feedback, and no external data service.",
    tags: ["JavaScript", "Chrome APIs", "Manifest V3", "Privacy"],
    href: "https://github.com/LucPeloquin/InstaDL",
  },
];

function formatClock(zone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("hour")}:${get("minute")} ${get("dayPeriod")}`;
}

function updateClocks() {
  document.querySelectorAll("[data-clock]").forEach((clock) => {
    const time = formatClock(clock.dataset.zone);
    clock.querySelectorAll("[data-clock-time]").forEach((node) => {
      node.textContent = time;
    });
    clock.dateTime = new Date().toISOString();
  });
}

updateClocks();
window.setInterval(updateClocks, 15_000);
document.querySelectorAll("[data-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

function currentTheme() {
  return root.dataset.theme === "dark" ? "dark" : "light";
}

function syncThemeControls() {
  const nextTheme = currentTheme() === "dark" ? "light" : "dark";
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
  });
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    currentTheme() === "dark" ? "#181918" : "#f7f7f3",
  );
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  try {
    localStorage.setItem("jl-theme", theme);
  } catch (_) {}
  syncThemeControls();
  window.dispatchEvent(new CustomEvent("jl:theme", { detail: { theme } }));
}

function toggleTheme() {
  const nextTheme = currentTheme() === "dark" ? "light" : "dark";
  if (document.startViewTransition && !prefersReducedMotion.matches) {
    document.startViewTransition(() => applyTheme(nextTheme));
  } else {
    applyTheme(nextTheme);
  }
}

document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
  button.addEventListener("click", toggleTheme);
});
syncThemeControls();

const menuDialog = document.querySelector("[data-menu-dialog]");
const contactDialog = document.querySelector("[data-contact-dialog]");

function setModalQuery(value) {
  const url = new URL(window.location.href);
  if (value) url.searchParams.set("modal", value);
  else url.searchParams.delete("modal");
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

const dialogReturnFocus = new WeakMap();

function openDialog(dialog, returnFocus = document.activeElement) {
  if (!dialog || dialog.open) return;
  if (returnFocus instanceof HTMLElement) dialogReturnFocus.set(dialog, returnFocus);
  dialog.showModal();
}

function closeDialog(dialog) {
  if (dialog?.open) dialog.close();
}

document.querySelector("[data-menu-open]")?.addEventListener("click", (event) => {
  openDialog(menuDialog, event.currentTarget);
});

document.querySelector("[data-menu-close]")?.addEventListener("click", () => {
  closeDialog(menuDialog);
});

document.querySelectorAll("[data-menu-link]").forEach((control) => {
  control.addEventListener("click", () => closeDialog(menuDialog));
});

document.querySelectorAll("[data-contact-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const returnFocus = button;
    closeDialog(menuDialog);
    window.setTimeout(() => {
      openDialog(contactDialog, returnFocus);
      setModalQuery("contact");
    }, menuDialog?.open ? 120 : 0);
  });
});

document.querySelector("[data-contact-close]")?.addEventListener("click", () => {
  closeDialog(contactDialog);
});

function restoreDialogFocus(dialog) {
  const returnFocus = dialogReturnFocus.get(dialog);
  dialogReturnFocus.delete(dialog);
  if (returnFocus?.isConnected && typeof returnFocus.focus === "function") {
    window.requestAnimationFrame(() => returnFocus.focus());
  }
}

menuDialog?.addEventListener("close", () => restoreDialogFocus(menuDialog));
contactDialog?.addEventListener("close", () => {
  setModalQuery(null);
  restoreDialogFocus(contactDialog);
});

[menuDialog, contactDialog].forEach((dialog) => {
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
});

if (new URL(window.location.href).searchParams.get("modal") === "contact") {
  window.requestAnimationFrame(() => openDialog(contactDialog));
}

const toast = document.querySelector("[data-toast]");
let toastTimeout;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

document.querySelector("[data-copy-email]")?.addEventListener("click", async () => {
  const email = "lucpeloquin77@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    showToast("Email copied");
  } catch (_) {
    const textArea = document.createElement("textarea");
    textArea.value = email;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.append(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    showToast("Email copied");
  }
});

const revealNodes = document.querySelectorAll("[data-reveal]");
if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );
  revealNodes.forEach((node) => revealObserver.observe(node));
}

function animateCount(element) {
  if (element.dataset.counted === "true") return;
  element.dataset.counted = "true";
  const end = Number(element.dataset.count);
  if (prefersReducedMotion.matches) {
    element.textContent = end;
    return;
  }
  const startTime = performance.now();
  const duration = 1150;
  const tick = (now) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(end * eased));
    if (progress < 1) window.requestAnimationFrame(tick);
  };
  window.requestAnimationFrame(tick);
}

const counters = document.querySelectorAll("[data-count]");
if ("IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.55 },
  );
  counters.forEach((counter) => countObserver.observe(counter));
} else {
  counters.forEach(animateCount);
}

const projectTabs = [...document.querySelectorAll("[data-project-tab]")];
const projectPosters = [...document.querySelectorAll("[data-project-poster]")];
const projectTitle = document.querySelector("[data-project-title]");
const projectKicker = document.querySelector("[data-project-kicker]");
const projectDescription = document.querySelector("[data-project-description]");
const projectTags = document.querySelector("[data-project-tags]");
const projectLink = document.querySelector("[data-project-link]");
const projectCurrent = document.querySelector("[data-project-current]");
const projectPanel = document.querySelector("#project-panel");
let activeProject = 0;

function renderProject(index, { focus = false } = {}) {
  activeProject = (index + projects.length) % projects.length;
  const project = projects[activeProject];
  projectKicker.textContent = project.kicker;
  projectTitle.textContent = project.title;
  projectDescription.textContent = project.description;
  projectTags.replaceChildren(
    ...project.tags.map((tag) => {
      const item = document.createElement("li");
      item.textContent = tag;
      return item;
    }),
  );
  projectLink.href = project.href;
  projectCurrent.textContent = String(activeProject + 1).padStart(2, "0");

  projectTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === activeProject;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  projectPosters.forEach((poster, posterIndex) => {
    const selected = posterIndex === activeProject;
    poster.hidden = !selected;
    poster.classList.toggle("is-active", selected);
  });

  const activeTab = projectTabs[activeProject];
  projectPanel?.setAttribute("aria-labelledby", activeTab?.id ?? "");
  activeTab?.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth", block: "nearest", inline: "center" });
  if (focus) activeTab?.focus();
}

projectTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderProject(index));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? projectTabs.length - 1 : activeProject + (event.key === "ArrowRight" ? 1 : -1);
    renderProject(nextIndex, { focus: true });
  });
});

document.querySelector("[data-project-prev]")?.addEventListener("click", () => renderProject(activeProject - 1));
document.querySelector("[data-project-next]")?.addEventListener("click", () => renderProject(activeProject + 1));

const noteSlides = [...document.querySelectorAll("[data-note-slide]")];
const noteCurrent = document.querySelector("[data-note-current]");
const noteToggle = document.querySelector("[data-note-toggle]");
const principlesSection = document.querySelector("#principles");
let activeNote = 0;
let noteTimer;
let notePaused = false;
let noteInView = false;

function renderNote(index) {
  activeNote = (index + noteSlides.length) % noteSlides.length;
  noteSlides.forEach((slide, slideIndex) => {
    const selected = slideIndex === activeNote;
    slide.hidden = !selected;
    slide.classList.toggle("is-active", selected);
  });
  noteCurrent.textContent = String(activeNote + 1).padStart(2, "0");
}

function startNoteTimer() {
  window.clearInterval(noteTimer);
  if (prefersReducedMotion.matches || notePaused) return;
  noteTimer = window.setInterval(() => renderNote(activeNote + 1), 6500);
}

function syncNoteToggle() {
  if (!noteToggle) return;
  noteToggle.textContent = notePaused ? "Resume" : "Pause";
  noteToggle.setAttribute("aria-label", `${notePaused ? "Resume" : "Pause"} principles carousel`);
  noteToggle.setAttribute("aria-pressed", String(notePaused));
}

function pauseNotes() {
  notePaused = true;
  window.clearInterval(noteTimer);
  syncNoteToggle();
}

function moveNote(direction) {
  pauseNotes();
  renderNote(activeNote + direction);
}

document.querySelector("[data-note-prev]")?.addEventListener("click", () => moveNote(-1));
document.querySelector("[data-note-next]")?.addEventListener("click", () => moveNote(1));
noteToggle?.addEventListener("click", () => {
  notePaused = !notePaused;
  syncNoteToggle();
  if (notePaused) window.clearInterval(noteTimer);
  else if (noteInView) startNoteTimer();
});
syncNoteToggle();

if (principlesSection && "IntersectionObserver" in window) {
  const noteObserver = new IntersectionObserver(
    ([entry]) => {
      noteInView = entry.isIntersecting;
      if (noteInView) startNoteTimer();
      else window.clearInterval(noteTimer);
    },
    { threshold: 0.25 },
  );
  noteObserver.observe(principlesSection);
}

const artifactCanvas = document.querySelector("#artifact-canvas");
const artifactStage = document.querySelector("[data-artifact-stage]");
if (artifactCanvas && artifactStage) {
  import("./artifact.js")
    .then(({ initArtifact }) => initArtifact(artifactCanvas, artifactStage, { reducedMotion: prefersReducedMotion.matches }))
    .catch((error) => {
      console.error("3D artifact failed to initialize", error);
      artifactStage.classList.add("artifact-failed");
      const status = document.querySelector("[data-artifact-status]");
      if (status) status.textContent = "STATIC MODE";
    });
}
