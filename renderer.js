const { ipcRenderer } = require('electron');

// ─── State ────────────────────────────────────────────
const STORAGE_KEY = 'floating-notepad-v3';
let state = {
  activeTab: 0,
  tabs: [{ id: 1, label: 'note 1', content: '' }],
  nextId: 2,
  fontSize: 14,
  theme: 'dark'
};

// ─── DOM refs ─────────────────────────────────────────
const textarea    = document.getElementById('notepad');
const tabsList    = document.getElementById('tabs-list');
const saveStatus  = document.getElementById('save-status');
const statsEl     = document.getElementById('stats');
const body        = document.body;

// ─── Persistence ──────────────────────────────────────
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = { ...state, ...JSON.parse(saved) };
  } catch(e) {}
}

let saveTimer = null;
function scheduleAutoSave() {
  clearTimeout(saveTimer);
  setSaveStatus('saving');
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setSaveStatus('saved');
    } catch(e) {}
  }, 800);
}

function setSaveStatus(s) {
  saveStatus.textContent = s === 'saving' ? 'saving…' : 'saved';
  saveStatus.className = s;
}

// ─── Tabs ──────────────────────────────────────────────
function renderTabs() {
  tabsList.innerHTML = '';
  state.tabs.forEach((tab, i) => {
    const el = document.createElement('div');
    el.className = 'tab' + (i === state.activeTab ? ' active' : '');
    el.dataset.index = i;

    const labelEl = document.createElement('span');
    labelEl.className = 'tab-label';
    labelEl.textContent = tab.label;
    labelEl.title = tab.label;

    // Double-click to rename
    labelEl.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const input = document.createElement('input');
      input.value = tab.label;
      input.style.cssText = 'background:transparent;border:none;outline:none;color:inherit;font:inherit;width:80px;';
      labelEl.replaceWith(input);
      input.focus(); input.select();
      const commit = () => {
        const newLabel = input.value.trim() || tab.label;
        state.tabs[i].label = newLabel;
        renderTabs();
        scheduleAutoSave();
      };
      input.addEventListener('blur', commit);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); if (e.key === 'Escape') { input.value = tab.label; input.blur(); } });
    });

    const closeBtn = document.createElement('span');
    closeBtn.className = 'tab-close';
    closeBtn.textContent = '×';
    closeBtn.addEventListener('click', (e) => { e.stopPropagation(); removeTab(i); });

    el.appendChild(labelEl);
    if (state.tabs.length > 1) el.appendChild(closeBtn);

    el.addEventListener('click', () => switchTab(i));
    tabsList.appendChild(el);
  });
}

function switchTab(index) {
  // Save current tab content
  state.tabs[state.activeTab].content = textarea.value;
  state.activeTab = index;
  textarea.value = state.tabs[index].content;
  renderTabs();
  updateStats();
  textarea.focus();
}

function addTab() {
  state.tabs[state.activeTab].content = textarea.value;
  const id = state.nextId++;
  const label = `note ${state.tabs.length + 1}`;
  state.tabs.push({ id, label, content: '' });
  state.activeTab = state.tabs.length - 1;
  textarea.value = '';
  renderTabs();
  updateStats();
  scheduleAutoSave();
  textarea.focus();
}

function removeTab(index) {
  if (state.tabs.length === 1) return;
  state.tabs.splice(index, 1);
  if (state.activeTab >= state.tabs.length) state.activeTab = state.tabs.length - 1;
  textarea.value = state.tabs[state.activeTab].content;
  renderTabs();
  updateStats();
  scheduleAutoSave();
}

// ─── Stats ────────────────────────────────────────────
function updateStats() {
  const text = textarea.value;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  statsEl.textContent = `${words}w · ${chars}c`;
}

// ─── Font size ────────────────────────────────────────
function applyFontSize() {
  document.documentElement.style.setProperty('--font-size', state.fontSize + 'px');
}

// ─── Theme ────────────────────────────────────────────
function applyTheme() {
  body.className = state.theme === 'light' ? 'light' : '';
}

// ─── Event wiring ─────────────────────────────────────
textarea.addEventListener('input', () => {
  state.tabs[state.activeTab].content = textarea.value;
  updateStats();
  scheduleAutoSave();
});

document.getElementById('btn-new-tab').addEventListener('click', addTab);

document.getElementById('btn-close').addEventListener('click', () => ipcRenderer.send('close-window'));
document.getElementById('btn-minimize').addEventListener('click', () => ipcRenderer.send('minimize-window'));

document.getElementById('btn-pin').addEventListener('click', () => ipcRenderer.send('toggle-always-on-top'));
ipcRenderer.on('always-on-top-changed', (_, val) => {
  document.getElementById('btn-pin').classList.toggle('active', val);
});

document.getElementById('btn-theme').addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  scheduleAutoSave();
});

document.getElementById('btn-font-up').addEventListener('click', () => {
  state.fontSize = Math.min(24, state.fontSize + 1);
  applyFontSize();
  scheduleAutoSave();
});
document.getElementById('btn-font-down').addEventListener('click', () => {
  state.fontSize = Math.max(10, state.fontSize - 1);
  applyFontSize();
  scheduleAutoSave();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 't') { e.preventDefault(); addTab(); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'w') { e.preventDefault(); removeTab(state.activeTab); }
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setSaveStatus('saved');
  }
  // Ctrl+Tab / Ctrl+Shift+Tab to cycle tabs
  if (e.ctrlKey && e.key === 'Tab') {
    e.preventDefault();
    const next = e.shiftKey
      ? (state.activeTab - 1 + state.tabs.length) % state.tabs.length
      : (state.activeTab + 1) % state.tabs.length;
    switchTab(next);
  }
});

// ─── Init ─────────────────────────────────────────────
loadState();
applyTheme();
applyFontSize();
renderTabs();
textarea.value = state.tabs[state.activeTab].content || '';
updateStats();
setSaveStatus('saved');
ipcRenderer.send('get-always-on-top');
textarea.focus();
