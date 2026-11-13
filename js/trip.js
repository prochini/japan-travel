// 「我的行程」手冊頁：分頁切換、每日時間軸、訂位預算、注意事項、打包清單

const PACK_KEY = "jt_trip_pack";

function badgeHTML(st, labelOverride) {
  const labels = { ok: "已確認", warn: "待確認", info: "規劃中" };
  const text = labelOverride || labels[st] || st;
  return `<span class="badge badge-${st}">${text}</span>`;
}

function renderHeader() {
  document.querySelector("#trip-title").textContent = TRIP_INFO.title;
  document.querySelector("#trip-sub").textContent = `${TRIP_INFO.range}・${TRIP_INFO.pax}`;
}

let currentDay = 0;

function renderDayChips() {
  const wrap = document.querySelector("#day-chips");
  wrap.innerHTML = "";
  TRIP_DAYS.forEach((day, i) => {
    const chip = document.createElement("button");
    chip.className = "day-chip" + (i === currentDay ? " active" : "");
    chip.dataset.i = i;
    chip.innerHTML = `<b>${day.date}</b><span>（${day.w}）</span>`;
    wrap.appendChild(chip);
  });
}

function renderDay() {
  const day = TRIP_DAYS[currentDay];

  document.querySelectorAll("#day-chips .day-chip").forEach((c) => {
    c.classList.toggle("active", Number(c.dataset.i) === currentDay);
  });

  document.querySelector("#day-title-block").innerHTML = `
    <span class="region-tag">${day.region}</span>
    <h2>${day.date}（${day.w}）${day.title}</h2>
  `;

  const timeline = document.querySelector("#day-timeline");
  timeline.innerHTML = "";
  day.rows.forEach((row) => {
    const item = document.createElement("div");
    item.className = "tl-item";
    item.innerHTML = `
      <div class="tl-time">${row.tm}</div>
      <div class="tl-title">${row.t}</div>
      <div class="tl-desc">${row.d}</div>
      <div class="tl-meta">
        <span class="tl-mode">${row.tr}</span>
        ${badgeHTML(row.st)}
      </div>
      ${row.note ? `<div class="tl-desc" style="margin-top:4px">💬 ${row.note}</div>` : ""}
    `;
    timeline.appendChild(item);
  });
}

function renderRoutes() {
  const body = document.querySelector("#route-body");
  body.innerHTML = TRIP_ROUTES.map(
    (r) => `<tr><td>${r.route}</td><td>${r.mode}</td><td>${r.time}</td><td>${r.note}</td></tr>`
  ).join("");
}

function renderBudget() {
  const body = document.querySelector("#budget-body");
  body.innerHTML = TRIP_BUDGET.map(
    (b) => `<tr><td>${b.item}</td><td>${b.qty}</td><td>${badgeHTML(b.st, b.label)}</td></tr>`
  ).join("");
}

function renderNotes() {
  const wrap = document.querySelector("#notes-list");
  wrap.innerHTML = "";
  let any = false;

  TRIP_DAYS.forEach((day) => {
    const pending = day.rows.filter((r) => r.st === "warn");
    if (!pending.length) return;
    any = true;
    const heading = document.createElement("div");
    heading.className = "trip-note-day";
    heading.textContent = `${day.date}（${day.w}）${day.title}`;
    wrap.appendChild(heading);

    pending.forEach((row) => {
      const note = document.createElement("div");
      note.className = "note-item";
      note.innerHTML = `${badgeHTML(row.st)}<div><strong>${row.t}</strong><br>${row.note}</div>`;
      wrap.appendChild(note);
    });
  });

  if (!any) {
    wrap.innerHTML = `<p class="empty-state">目前沒有待確認的項目。</p>`;
  }
}

function loadPackState() {
  try {
    return JSON.parse(localStorage.getItem(PACK_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function savePackState(state) {
  localStorage.setItem(PACK_KEY, JSON.stringify(state));
}

function renderPacking() {
  const wrap = document.querySelector("#pack-list");
  const checked = loadPackState();
  wrap.innerHTML = "";

  TRIP_PACKING.forEach((label, i) => {
    const isChecked = !!checked[i];
    const row = document.createElement("label");
    row.className = "pack-item" + (isChecked ? " checked" : "");
    row.innerHTML = `<input type="checkbox" data-i="${i}" ${isChecked ? "checked" : ""} /><span>${label}</span>`;
    wrap.appendChild(row);
  });
}

function setupTabs() {
  const tabs = document.querySelector("#trip-tabs");
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    tabs.querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
    document.querySelectorAll(".trip-panel").forEach((p) => {
      p.classList.toggle("active", p.id === "panel-" + btn.dataset.tab);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderDayChips();
  renderDay();
  renderRoutes();
  renderBudget();
  renderNotes();
  renderPacking();
  setupTabs();

  document.querySelector("#day-chips").addEventListener("click", (e) => {
    const chip = e.target.closest(".day-chip");
    if (!chip) return;
    currentDay = Number(chip.dataset.i);
    renderDay();
  });

  document.querySelector("#pack-list").addEventListener("change", (e) => {
    const input = e.target.closest("input[type=checkbox]");
    if (!input) return;
    const state = loadPackState();
    state[input.dataset.i] = input.checked;
    savePackState(state);
    input.closest(".pack-item").classList.toggle("checked", input.checked);
  });
});
