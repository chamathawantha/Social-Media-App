// ── messages.js ──

let convos = loadConvos();
let activeConvoId = null;

function renderConvoList(filter = "") {
  const ul = document.getElementById("convoList");
  const filtered = convos.filter(c => c.user.toLowerCase().includes(filter.toLowerCase()));
  ul.innerHTML = filtered.map(c => {
    const last = c.messages[c.messages.length - 1];
    const unread = c.messages.filter(m => m.from !== "me" && !m.read).length;
    return `
      <li class="convo-item ${c.id === activeConvoId ? 'active' : ''}" onclick="openConvo(${c.id})">
        <div class="friend-avatar" style="background:${c.color};width:44px;height:44px;font-size:1rem;flex-shrink:0">${c.initials}</div>
        <div class="convo-meta">
          <div class="convo-top">
            <strong>${c.user}</strong>
            <span class="convo-time">${last ? last.time : ""}</span>
          </div>
          <div class="convo-preview">
            <span>${last ? (last.from === "me" ? "You: " : "") + last.text.substring(0, 36) + (last.text.length > 36 ? "…" : "") : "No messages yet"}</span>
            ${unread ? `<span class="convo-badge">${unread}</span>` : ""}
          </div>
        </div>
        <div class="online-indicator ${c.online ? 'online' : ''}"></div>
      </li>`;
  }).join("");
}

function filterConvos(val) { renderConvoList(val); }

function openConvo(id) {
  activeConvoId = id;
  const c = convos.find(x => x.id === id);
  // mark all read
  c.messages.forEach(m => m.read = true);
  saveConvos(convos);

  document.getElementById("chatAvatar").textContent = c.initials;
  document.getElementById("chatAvatar").style.background = c.color;
  document.getElementById("chatName").textContent = c.user;
  document.getElementById("chatStatus").textContent = c.online ? "● Online" : "○ Offline";
  document.getElementById("chatStatus").className = "chat-status " + (c.online ? "status-online" : "status-offline");
  document.getElementById("chatInputRow").style.display = "flex";

  renderMessages(c);
  renderConvoList();
}

function renderMessages(c) {
  const area = document.getElementById("chatMessages");
  if (!c.messages.length) {
    area.innerHTML = `<div class="chat-empty"><p>No messages yet. Say hello! 👋</p></div>`;
    return;
  }
  area.innerHTML = c.messages.map(m => `
    <div class="msg-row ${m.from === "me" ? "mine" : "theirs"}">
      ${m.from !== "me" ? `<div class="friend-avatar" style="background:${c.color};width:30px;height:30px;font-size:0.75rem;flex-shrink:0">${c.initials}</div>` : ""}
      <div class="msg-bubble ${m.from === "me" ? "mine" : ""}">
        <p>${m.text}</p>
        <span class="msg-time">${m.time}</span>
      </div>
    </div>`).join("");
  area.scrollTop = area.scrollHeight;
}

function sendMsg() {
  const inp = document.getElementById("msgInput");
  const text = inp.value.trim();
  if (!text || !activeConvoId) return;
  const c = convos.find(x => x.id === activeConvoId);
  const now = new Date();
  const time = now.getHours() + ":" + String(now.getMinutes()).padStart(2, "0");
  c.messages.push({ from: "me", text, time });
  saveConvos(convos);
  inp.value = "";
  renderMessages(c);
  renderConvoList();

  // Auto reply after 1.5s
  setTimeout(() => {
    const replies = ["😊 Nice!", "That's great!", "Haha true!", "Tell me more!", "Really? 👀", "Wow, cool!", "Sounds fun!"];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    c.messages.push({ from: c.initials, text: reply, time });
    saveConvos(convos);
    if (activeConvoId === c.id) renderMessages(c);
    renderConvoList();
  }, 1500);
}

renderConvoList();
