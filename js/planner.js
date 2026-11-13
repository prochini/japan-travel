// 行程規劃工具：新增/排序/刪除景點、預算試算、地區地圖標示、儲存／匯出

const STORAGE_KEY = "jt_itinerary";
const PENDING_KEY = "jt_pending";

function getAllItems() {
  const attractions = ATTRACTIONS.map((a) => ({ ...a, kindLabel: a.category }));
  const foodLodging = FOOD_LODGING.map((f) => ({ ...f, kindLabel: f.type }));
  return [...attractions, ...foodLodging];
}

function findItem(refId) {
  return getAllItems().find((i) => i.id === refId);
}

function uid(prefix) {
  return prefix + Math.random().toString(36).slice(2, 9);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("無法讀取已儲存的行程，將以空白行程開始。", e);
  }
  return { days: [], extra: { transport: 0, other: 0 } };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadPending() {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function savePending(list) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(list));
}

let state = loadState();

/* ===== Days ===== */

function addDay() {
  state.days.push({ id: uid("d"), label: `Day ${state.days.length + 1}`, items: [] });
  saveState();
  renderAll();
}

function removeDay(dayId) {
  if (!confirm("確定要刪除這一天的所有行程嗎？")) return;
  state.days = state.days.filter((d) => d.id !== dayId);
  saveState();
  renderAll();
}

function renameDay(dayId, label) {
  const day = state.days.find((d) => d.id === dayId);
  if (day) {
    day.label = label;
    saveState();
  }
}

function addItemToDay(dayId, refId) {
  const day = state.days.find((d) => d.id === dayId);
  const ref = findItem(refId);
  if (!day || !ref) return;
  day.items.push({
    id: uid("i"),
    refId: ref.id,
    name: ref.name,
    region: ref.region,
    cost: ref.cost || 0,
    kindLabel: ref.kindLabel,
  });
  saveState();
  renderAll();
}

function addCustomItemToDay(dayId, name, cost) {
  const day = state.days.find((d) => d.id === dayId);
  if (!day || !name.trim()) return;
  day.items.push({
    id: uid("i"),
    refId: null,
    name: name.trim(),
    region: null,
    cost: Number(cost) || 0,
    kindLabel: "自訂",
  });
  saveState();
  renderAll();
}

function removeItemFromDay(dayId, itemId) {
  const day = state.days.find((d) => d.id === dayId);
  if (!day) return;
  day.items = day.items.filter((i) => i.id !== itemId);
  saveState();
  renderAll();
}

function reorderItem(dayId, fromIndex, toIndex) {
  const day = state.days.find((d) => d.id === dayId);
  if (!day) return;
  const [moved] = day.items.splice(fromIndex, 1);
  day.items.splice(toIndex, 0, moved);
  saveState();
  renderAll();
}

/* ===== Rendering ===== */

function renderDays() {
  const container = document.querySelector("#days-container");
  const emptyEl = document.querySelector("#days-empty");
  container.innerHTML = "";
  emptyEl.style.display = state.days.length ? "none" : "block";

  const allItems = getAllItems();

  state.days.forEach((day) => {
    const card = document.createElement("div");
    card.className = "day-card";

    const head = document.createElement("div");
    head.className = "day-card-head";
    head.innerHTML = `
      <input type="text" value="${day.label}" data-day="${day.id}" class="day-label-input" />
      <button class="btn-icon" data-remove-day="${day.id}" title="刪除這一天">🗑</button>
    `;
    card.appendChild(head);

    const itemsWrap = document.createElement("div");
    itemsWrap.className = "day-items";
    itemsWrap.dataset.day = day.id;

    day.items.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "day-item";
      row.draggable = true;
      row.dataset.day = day.id;
      row.dataset.index = index;
      row.innerHTML = `
        <span class="drag-handle">⠿</span>
        <div class="day-item-main">
          <div class="name">${item.name}</div>
          <div class="meta">${item.kindLabel}${item.region ? " · " + REGIONS[item.region].name : ""}</div>
        </div>
        <div class="day-item-cost">${item.cost ? "¥" + item.cost.toLocaleString() : "免費"}</div>
        <button class="btn-icon" data-remove-item="${day.id}|${item.id}" title="刪除">✕</button>
      `;
      itemsWrap.appendChild(row);
    });

    card.appendChild(itemsWrap);

    const addRow = document.createElement("div");
    addRow.className = "day-add-row";
    addRow.innerHTML = `
      <select data-select-day="${day.id}">
        <option value="">選擇要加入的景點／美食／住宿...</option>
        <optgroup label="景點">
          ${ATTRACTIONS.map((a) => `<option value="${a.id}">${a.name}（${REGIONS[a.region].name}）</option>`).join("")}
        </optgroup>
        <optgroup label="美食／住宿">
          ${FOOD_LODGING.map((f) => `<option value="${f.id}">${f.name}（${f.type}）</option>`).join("")}
        </optgroup>
      </select>
      <button class="btn btn-small btn-outline" data-add-select="${day.id}">加入</button>
    `;
    card.appendChild(addRow);

    const customForm = document.createElement("div");
    customForm.className = "custom-item-form";
    customForm.innerHTML = `
      <input type="text" name="name" placeholder="自訂項目名稱（如：河豚料理晚餐）" data-custom-name="${day.id}" />
      <input type="number" name="cost" placeholder="花費 ¥" min="0" data-custom-cost="${day.id}" />
      <button class="btn btn-small btn-primary" data-add-custom="${day.id}">新增自訂項目</button>
    `;
    card.appendChild(customForm);

    container.appendChild(card);
  });
}

function renderPending() {
  const panel = document.querySelector("#pending-panel");
  const list = document.querySelector("#pending-list");
  const pending = loadPending();
  list.innerHTML = "";

  if (!pending.length || !state.days.length) {
    panel.style.display = pending.length && !state.days.length ? "block" : "none";
    if (pending.length && !state.days.length) {
      list.innerHTML = `<p class="empty-state" style="padding:14px">先新增一天，才能把待規劃景點加進行程喔。</p>`;
    }
    return;
  }

  panel.style.display = "block";

  pending.forEach((refId) => {
    const ref = findItem(refId);
    if (!ref) return;
    const row = document.createElement("div");
    row.className = "pending-item";
    row.innerHTML = `
      <span>${ref.name}</span>
      <div style="display:flex; gap:6px; align-items:center">
        <select data-pending-day>
          ${state.days.map((d) => `<option value="${d.id}">${d.label}</option>`).join("")}
        </select>
        <button class="btn-icon" data-pending-add="${refId}" title="加入">＋</button>
        <button class="btn-icon" data-pending-remove="${refId}" title="移除">✕</button>
      </div>
    `;
    list.appendChild(row);
  });
}

function renderBudget() {
  let itemsTotal = 0;
  state.days.forEach((d) => d.items.forEach((i) => (itemsTotal += Number(i.cost) || 0)));

  document.querySelector("#budget-items").textContent = "¥" + itemsTotal.toLocaleString();
  document.querySelector("#budget-transport").value = state.extra.transport;
  document.querySelector("#budget-other").value = state.extra.other;

  const total = itemsTotal + Number(state.extra.transport || 0) + Number(state.extra.other || 0);
  document.querySelector("#budget-total").textContent = "¥" + total.toLocaleString();
}

function renderMap() {
  const box = document.querySelector("#map-box");
  box.innerHTML = "";

  const activeRegions = new Set();
  state.days.forEach((d) => d.items.forEach((i) => i.region && activeRegions.add(i.region)));

  Object.entries(REGIONS).forEach(([key, r]) => {
    const pin = document.createElement("div");
    pin.className = "map-pin" + (activeRegions.has(key) ? " active" : "");
    pin.style.left = r.x + "%";
    pin.style.top = r.y + "%";
    pin.innerHTML = `<span class="dot"></span><span class="label">${r.name}</span>`;
    box.appendChild(pin);
  });
}

function renderAll() {
  renderDays();
  renderPending();
  renderBudget();
  renderMap();
}

/* ===== Export / Reset ===== */

function exportItinerary() {
  if (!state.days.length) {
    showToast("還沒有任何行程內容可以匯出");
    return;
  }

  let text = "日本旅遊行程\n";
  text += "=".repeat(20) + "\n\n";

  state.days.forEach((day) => {
    text += `${day.label}\n`;
    if (!day.items.length) {
      text += "（尚未安排項目）\n";
    } else {
      day.items.forEach((item, idx) => {
        const cost = item.cost ? `¥${item.cost.toLocaleString()}` : "免費";
        text += `${idx + 1}. ${item.name}（${item.kindLabel}）- ${cost}\n`;
      });
    }
    text += "\n";
  });

  let itemsTotal = 0;
  state.days.forEach((d) => d.items.forEach((i) => (itemsTotal += Number(i.cost) || 0)));
  const total = itemsTotal + Number(state.extra.transport || 0) + Number(state.extra.other || 0);

  text += "預算試算\n";
  text += "-".repeat(20) + "\n";
  text += `景點／美食／住宿小計：¥${itemsTotal.toLocaleString()}\n`;
  text += `交通費（預估）：¥${Number(state.extra.transport || 0).toLocaleString()}\n`;
  text += `其他花費（預估）：¥${Number(state.extra.other || 0).toLocaleString()}\n`;
  text += `總預算：¥${total.toLocaleString()}\n`;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "日本旅遊行程.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("已匯出行程文字檔");
}

function resetItinerary() {
  if (!confirm("確定要清空整份行程嗎？此動作無法復原。")) return;
  state = { days: [], extra: { transport: 0, other: 0 } };
  saveState();
  renderAll();
  showToast("已清空行程");
}

/* ===== Drag & drop ===== */

let dragInfo = null;

function setupDragAndDrop() {
  const container = document.querySelector("#days-container");

  container.addEventListener("dragstart", (e) => {
    const row = e.target.closest(".day-item");
    if (!row) return;
    dragInfo = { dayId: row.dataset.day, index: Number(row.dataset.index) };
    row.classList.add("dragging");
  });

  container.addEventListener("dragend", (e) => {
    const row = e.target.closest(".day-item");
    if (row) row.classList.remove("dragging");
  });

  container.addEventListener("dragover", (e) => {
    if (!dragInfo) return;
    const row = e.target.closest(".day-item");
    if (!row || row.dataset.day !== dragInfo.dayId) return;
    e.preventDefault();
  });

  container.addEventListener("drop", (e) => {
    if (!dragInfo) return;
    const row = e.target.closest(".day-item");
    if (!row || row.dataset.day !== dragInfo.dayId) return;
    e.preventDefault();
    const toIndex = Number(row.dataset.index);
    if (toIndex !== dragInfo.index) {
      reorderItem(dragInfo.dayId, dragInfo.index, toIndex);
    }
    dragInfo = null;
  });
}

/* ===== Event delegation ===== */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#add-day-btn").addEventListener("click", addDay);
  document.querySelector("#export-btn").addEventListener("click", exportItinerary);
  document.querySelector("#reset-btn").addEventListener("click", resetItinerary);

  document.querySelector("#budget-transport").addEventListener("input", (e) => {
    state.extra.transport = Number(e.target.value) || 0;
    saveState();
    renderBudget();
  });

  document.querySelector("#budget-other").addEventListener("input", (e) => {
    state.extra.other = Number(e.target.value) || 0;
    saveState();
    renderBudget();
  });

  document.querySelector("#days-container").addEventListener("click", (e) => {
    const removeDayBtn = e.target.closest("[data-remove-day]");
    if (removeDayBtn) return removeDay(removeDayBtn.dataset.removeDay);

    const removeItemBtn = e.target.closest("[data-remove-item]");
    if (removeItemBtn) {
      const [dayId, itemId] = removeItemBtn.dataset.removeItem.split("|");
      return removeItemFromDay(dayId, itemId);
    }

    const addSelectBtn = e.target.closest("[data-add-select]");
    if (addSelectBtn) {
      const dayId = addSelectBtn.dataset.addSelect;
      const select = document.querySelector(`select[data-select-day="${dayId}"]`);
      if (select.value) addItemToDay(dayId, select.value);
      return;
    }

    const addCustomBtn = e.target.closest("[data-add-custom]");
    if (addCustomBtn) {
      const dayId = addCustomBtn.dataset.addCustom;
      const nameInput = document.querySelector(`input[data-custom-name="${dayId}"]`);
      const costInput = document.querySelector(`input[data-custom-cost="${dayId}"]`);
      addCustomItemToDay(dayId, nameInput.value, costInput.value);
      return;
    }
  });

  document.querySelector("#days-container").addEventListener("change", (e) => {
    const input = e.target.closest(".day-label-input");
    if (input) renameDay(input.dataset.day, input.value);
  });

  document.querySelector("#pending-list").addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-pending-add]");
    if (addBtn) {
      const refId = addBtn.dataset.pendingAdd;
      const row = addBtn.closest(".pending-item");
      const dayId = row.querySelector("[data-pending-day]").value;
      addItemToDay(dayId, refId);
      const pending = loadPending().filter((id) => id !== refId);
      savePending(pending);
      renderPending();
      return;
    }

    const removeBtn = e.target.closest("[data-pending-remove]");
    if (removeBtn) {
      const refId = removeBtn.dataset.pendingRemove;
      const pending = loadPending().filter((id) => id !== refId);
      savePending(pending);
      renderPending();
      return;
    }
  });

  setupDragAndDrop();
  renderAll();
});
