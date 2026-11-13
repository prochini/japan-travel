// 共用：導覽列切換、當前頁面標示、提示訊息（toast）

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
    });
  }

  const current = document.body.dataset.page;
  if (current) {
    document.querySelectorAll(".nav-links a").forEach((a) => {
      if (a.dataset.page === current) a.classList.add("active");
    });
  }

  const yearEl = document.querySelector("#footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
