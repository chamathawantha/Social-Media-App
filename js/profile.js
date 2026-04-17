// ── profile.js v3 ──

let posts = loadPosts();
const myPosts = posts.filter(p => p.user === "Chamath Awantha");
const savedPosts = posts.filter(p => p.saved);
document.getElementById("postCount").textContent = myPosts.length;

let currentTab = "posts";

function renderMyPosts() {
  const grid = document.getElementById("myPostsGrid");
  const list = currentTab === "posts" ? myPosts : savedPosts;
  if (!list.length) {
    grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1;padding:20px;text-align:center">No ${currentTab === "posts" ? "posts" : "saved posts"} yet.</p>`;
    return;
  }
  grid.innerHTML = list.map(post => `
    <div class="grid-item">
      ${post.image
        ? `<img src="${post.image}" alt="post"/>`
        : `<div class="grid-item-text">${post.text ? post.text.substring(0, 60) : "📊 Poll"}</div>`}
      <div class="grid-overlay">
        <span><i class="fa-solid fa-heart"></i> ${post.likes}</span>
        <span><i class="fa-regular fa-comment"></i> ${post.comments.length}</span>
      </div>
    </div>`).join("");
}

function switchTab(tab, btn) {
  currentTab = tab;
  document.querySelectorAll(".ptab").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderMyPosts();
}

function toggleEdit() {
  const form = document.getElementById("editForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

function saveProfile() {
  const name = document.getElementById("editName").value.trim();
  const bio  = document.getElementById("editBio").value.trim();
  if (name) document.getElementById("profileName").textContent = name;
  if (bio)  document.getElementById("profileBio").textContent  = bio;
  toggleEdit();
}

renderMyPosts();
