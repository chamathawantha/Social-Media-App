// ── reels.js ──

let reelLikes = JSON.parse(localStorage.getItem("sa_reel_likes") || "{}");

function saveReelLikes() { localStorage.setItem("sa_reel_likes", JSON.stringify(reelLikes)); }

function toggleReelLike(id) {
  reelLikes[id] = !reelLikes[id];
  saveReelLikes();
  const btn = document.querySelector(`[data-reel="${id}"] .reel-like-btn`);
  const reel = REELS_DATA.find(r => r.id === id);
  const count = (reel.likes + (reelLikes[id] ? 1 : 0));
  btn.classList.toggle("liked", reelLikes[id]);
  btn.innerHTML = `<i class="${reelLikes[id] ? 'fa-solid' : 'fa-regular'} fa-heart"></i><span>${count.toLocaleString()}</span>`;
}

function renderReels() {
  const feed = document.getElementById("reelsFeed");
  feed.innerHTML = REELS_DATA.map(reel => `
    <div class="reel-card" data-reel="${reel.id}">
      <div class="reel-video" style="background:${reel.bg}">
        <div class="reel-emoji">${reel.emoji}</div>
        <div class="reel-play-overlay"><i class="fa-solid fa-play"></i></div>
      </div>
      <div class="reel-side">
        <div class="reel-user">
          <div class="friend-avatar" style="background:${reel.color};width:40px;height:40px;font-size:0.9rem">${reel.initials}</div>
          <span>${reel.user}</span>
        </div>
        <p class="reel-caption">${reel.caption}</p>
        <div class="reel-actions">
          <button class="reel-like-btn action-btn ${reelLikes[reel.id] ? 'liked' : ''}" onclick="toggleReelLike(${reel.id})">
            <i class="${reelLikes[reel.id] ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            <span>${(reel.likes + (reelLikes[reel.id] ? 1 : 0)).toLocaleString()}</span>
          </button>
          <button class="action-btn" onclick="alert('Comment feature on Reels!')">
            <i class="fa-regular fa-comment"></i> <span>Reply</span>
          </button>
          <button class="action-btn" onclick="alert('Link copied! (demo)')">
            <i class="fa-solid fa-share-nodes"></i> <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

renderReels();
