// ══ app.js v3 – All Features ══

let posts         = loadPosts();
let notifications = loadNotifications();
let stories       = loadStories();
let nextId        = Math.max(...posts.map(p=>p.id))+1;
let selectedImage = null;
let activeReactionPostId = null;
let storyIndex    = 0;
let storyTimer    = null;
let showingPoll   = false;

/* ══ NOTIFICATIONS ══ */
function renderNotifBadge(){
  const u=notifications.filter(n=>!n.read).length;
  const d=document.getElementById("notifDot");
  const b=document.getElementById("notifBadge");
  if(d) d.className=u>0?"notif-dot show":"notif-dot";
  if(b) b.textContent=u>0?u:"";
}
function renderNotifPanel(){
  const ul=document.getElementById("notifList"); if(!ul)return;
  const map={like:"fa-heart",comment:"fa-comment",follow:"fa-user-plus"};
  ul.innerHTML=notifications.length===0?`<li style="padding:20px;text-align:center;color:var(--muted)">No notifications</li>`:
    notifications.map(n=>`
      <li class="notif-item ${n.read?'':'unread'}" onclick="markRead(${n.id})">
        <div class="notif-icon ${n.type}"><i class="fa-solid ${map[n.type]||'fa-bell'}"></i></div>
        <div><div class="notif-text"><strong>${n.user}</strong> ${n.text}</div><div class="notif-time">${n.time}</div></div>
      </li>`).join("");
}
function toggleNotifPanel(){
  document.getElementById("notifPanel").classList.toggle("open");
  renderNotifPanel();
  closeReactionPicker();
}
function markRead(id){ const n=notifications.find(x=>x.id===id); if(n){n.read=true;saveNotifications(notifications);} renderNotifBadge();renderNotifPanel(); }
function markAllRead(){ notifications.forEach(n=>n.read=true);saveNotifications(notifications);renderNotifBadge();renderNotifPanel(); }
function pushNotif(type,user,text){
  notifications.unshift({id:Date.now(),type,user,text,time:"Just now",read:false});
  saveNotifications(notifications); renderNotifBadge();
}

/* ══ STORIES ══ */
function renderStories(){
  const bar=document.getElementById("storiesBar"); if(!bar)return;
  bar.innerHTML=stories.map((s,i)=>`
    <div class="story-thumb ${s.viewed&&!s.isOwn?'viewed':''}" onclick="${s.isOwn?'addStory()':'openStory('+i+')'}">
      <div class="story-ring" style="background:${s.isOwn?'var(--border)':s.viewed?'var(--muted)':'linear-gradient(135deg,#f59e0b,#ef4444,#ec4899)'}">
        <div class="story-avatar" style="background:${s.color}">${s.initials}</div>
      </div>
      ${s.isOwn?'<span class="story-add-icon">+</span>':''}
      <p class="story-name">${s.isOwn?'Your Story':s.user}</p>
    </div>`).join("");
}

function openStory(idx){
  storyIndex=idx;
  document.getElementById("storyModal").classList.add("open");
  document.body.style.overflow="hidden";
  showStory();
}
function showStory(){
  const s=stories[storyIndex];
  document.getElementById("storyAvatar").textContent=s.initials;
  document.getElementById("storyAvatar").style.background=s.color;
  document.getElementById("storyUser").textContent=s.user;
  document.getElementById("storyTime").textContent="Just now";
  const content=document.getElementById("storyContent");
  content.style.background=s.bg;
  content.innerHTML=s.image
    ?`<img src="${s.image}" style="width:100%;height:100%;object-fit:cover"/><div class="story-caption">${s.text}</div>`
    :`<div class="story-text-display">${s.text}</div>`;
  // mark viewed
  s.viewed=true; saveStories(stories); renderStories();
  // progress bar
  const bar=document.getElementById("storyBar");
  bar.style.transition="none"; bar.style.width="0%";
  clearTimeout(storyTimer);
  setTimeout(()=>{ bar.style.transition="width 5s linear"; bar.style.width="100%"; },50);
  storyTimer=setTimeout(nextStory,5000);
}
function nextStory(){
  clearTimeout(storyTimer);
  if(storyIndex<stories.length-1){ storyIndex++; showStory(); }
  else closeStory();
}
function prevStory(){
  clearTimeout(storyTimer);
  if(storyIndex>0){ storyIndex--; showStory(); }
}
function closeStory(){ clearTimeout(storyTimer); document.getElementById("storyModal").classList.remove("open"); document.body.style.overflow=""; }
function closeStoryOutside(e){ if(e.target===document.getElementById("storyModal"))closeStory(); }
function addStory(){ alert("Story upload feature — choose a photo to add your story! (In a real app, this opens a file picker.)"); }

/* ══ LIVE BAR ══ */
function renderLiveBar(){
  const bar=document.getElementById("liveBar"); if(!bar)return;
  bar.innerHTML=`<div class="live-label"><span class="live-dot"></span> LIVE NOW</div>`+
    LIVE_USERS.map(u=>`
      <div class="live-card" onclick="alert('${u.user} is live: ${u.topic}')">
        <div class="live-avatar-wrap">
          <div class="friend-avatar" style="background:${u.color};width:48px;height:48px;font-size:1rem">${u.initials}</div>
          <span class="live-badge">LIVE</span>
        </div>
        <p class="live-user">${u.user}</p>
        <p class="live-viewers"><i class="fa-solid fa-eye"></i> ${u.viewers.toLocaleString()}</p>
      </div>`).join("");
}

/* ══ TRENDING HASHTAGS ══ */
function renderTrending(){
  const ul=document.getElementById("trendingList"); if(!ul)return;
  ul.innerHTML=TRENDING_HASHTAGS.map(h=>`
    <li class="trending-item" onclick="searchHashtag('${h.tag}')">
      <span class="trending-tag">${h.tag}</span>
      <span class="trending-count">${h.posts.toLocaleString()} posts</span>
    </li>`).join("");
}
function searchHashtag(tag){
  document.getElementById("searchInput").value=tag;
  handleSearch(tag);
}

/* ══ SEARCH ══ */
function handleSearch(val){
  const panel=document.getElementById("searchPanel"); if(!panel)return;
  val=val.trim();
  if(!val){ panel.classList.remove("open"); return; }
  const q=val.toLowerCase().replace("#","");
  const matchedPosts=posts.filter(p=>p.text&&(p.text.toLowerCase().includes(q)));
  const matchedUsers=FRIENDS.filter(f=>f.name.toLowerCase().includes(q));
  const matchedTags=TRENDING_HASHTAGS.filter(h=>h.tag.toLowerCase().includes(q));
  if(!matchedPosts.length&&!matchedUsers.length&&!matchedTags.length){
    panel.innerHTML=`<div class="search-empty">No results for "<strong>${val}</strong>"</div>`;
  } else {
    panel.innerHTML=
      (matchedTags.length?`<div class="search-section-title">Hashtags</div>`+matchedTags.map(h=>`<div class="search-result" onclick="searchHashtag('${h.tag}')"><i class="fa-solid fa-hashtag"></i> ${h.tag} <span>${h.posts.toLocaleString()} posts</span></div>`).join(""):"") +
      (matchedUsers.length?`<div class="search-section-title">People</div>`+matchedUsers.map(u=>`<div class="search-result"><div class="friend-avatar" style="background:${u.color};width:28px;height:28px;font-size:0.75rem">${u.initials}</div> ${u.name}</div>`).join(""):"") +
      (matchedPosts.length?`<div class="search-section-title">Posts</div>`+matchedPosts.slice(0,3).map(p=>`<div class="search-result" onclick="scrollToPost(${p.id})"><i class="fa-solid fa-file-lines"></i> ${p.text.substring(0,50)}…</div>`).join(""):"");
  }
  panel.classList.add("open");
}
function showSearchPanel(){ if(document.getElementById("searchInput").value.trim()) document.getElementById("searchPanel").classList.add("open"); }
function scrollToPost(id){ document.getElementById("searchPanel").classList.remove("open"); const el=document.querySelector(`[data-id="${id}"]`); if(el)el.scrollIntoView({behavior:"smooth",block:"center"}); }

/* ══ FRIENDS & SUGGESTED ══ */
function renderFriends(){
  document.getElementById("friendsList").innerHTML=FRIENDS.map(f=>`
    <li class="friend-item">
      <div class="friend-avatar" style="background:${f.color}">${f.initials}</div>
      <div class="friend-info"><strong>${f.name}</strong>
        <span class="${f.online?'status-online':'status-offline'}">${f.online?'● Online':'○ Offline'}</span>
      </div>
    </li>`).join("");
}
const followState={};
function renderSuggested(){
  document.getElementById("suggestedList").innerHTML=SUGGESTED.map(u=>`
    <li class="friend-item">
      <div class="friend-avatar" style="background:${u.color}">${u.initials}</div>
      <div class="friend-info"><strong>${u.name}</strong></div>
      <button class="follow-btn ${followState[u.name]?'following':''}" onclick="toggleFollow(this,'${u.name}')">
        ${followState[u.name]?'Following':'Follow'}
      </button>
    </li>`).join("");
}
function toggleFollow(btn,name){
  followState[name]=!followState[name];
  btn.textContent=followState[name]?"Following":"Follow";
  btn.classList.toggle("following",followState[name]);
  if(followState[name]) pushNotif("follow","You",`followed ${name}`);
}

/* ══ IMAGE PREVIEW ══ */
function previewImage(e){
  const file=e.target.files[0]; if(!file)return;
  document.getElementById("fileName").textContent=file.name;
  const reader=new FileReader();
  reader.onload=ev=>{ selectedImage=ev.target.result; const img=document.getElementById("imgPreview"); img.src=selectedImage;img.style.display="block"; };
  reader.readAsDataURL(file);
}

/* ══ POLL ══ */
function togglePoll(){
  showingPoll=!showingPoll;
  document.getElementById("pollSection").style.display=showingPoll?"block":"none";
}
function addPollOption(){
  const opts=document.getElementById("pollOptions");
  if(opts.children.length>=4){alert("Maximum 4 options!");return;}
  const inp=document.createElement("input");
  inp.type="text"; inp.className="poll-opt-input";
  inp.placeholder=`Option ${opts.children.length+1}`;
  opts.appendChild(inp);
}

/* ══ CREATE POST ══ */
function createPost(){
  const text=document.getElementById("postText").value.trim();
  let poll=null;
  if(showingPoll){
    const q=document.getElementById("pollQ").value.trim();
    const optInputs=[...document.querySelectorAll(".poll-opt-input")];
    const opts=optInputs.map(i=>i.value.trim()).filter(Boolean);
    if(!q||opts.length<2){alert("Poll needs a question and at least 2 options!");return;}
    poll={question:q,options:opts.map(o=>({text:o,votes:0})),myVote:null};
  }
  if(!text&&!selectedImage&&!poll){alert("Write something, add an image, or create a poll!");return;}
  const post={id:nextId++,user:"Chamath Awantha",initials:"CA",text,image:selectedImage||null,time:"Just now",likes:0,liked:false,reactions:{},comments:[],saved:false,reposts:0,poll};
  posts.unshift(post); savePosts(posts); renderFeed();
  // reset
  document.getElementById("postText").value="";
  document.getElementById("imgPreview").style.display="none";
  document.getElementById("fileName").textContent="No file chosen";
  document.getElementById("imgInput").value="";
  selectedImage=null;
  if(showingPoll){ togglePoll(); document.getElementById("pollQ").value=""; [...document.querySelectorAll(".poll-opt-input")].forEach((i,idx)=>{i.value=""; if(idx>1)i.remove();}); }
}

/* ══ LIKE ══ */
function toggleLike(id){
  const post=posts.find(p=>p.id===id); if(!post)return;
  post.liked=!post.liked; post.likes+=post.liked?1:-1;
  if(post.liked){post.reactions=post.reactions||{};post.reactions["me"]="❤️";}
  else if(post.reactions)delete post.reactions["me"];
  savePosts(posts);
  const card=document.querySelector(`[data-id="${id}"]`);
  card.querySelector(".like-btn").className=`action-btn like-btn${post.liked?" liked":""}`;
  card.querySelector(".like-btn").innerHTML=`<i class="${post.liked?'fa-solid':'fa-regular'} fa-heart"></i> ${post.likes}`;
  refreshPostReactions(id);
}

/* ══ REPOST ══ */
function repost(id){
  const post=posts.find(p=>p.id===id); if(!post)return;
  post.reposts=(post.reposts||0)+1; savePosts(posts);
  const card=document.querySelector(`[data-id="${id}"]`);
  const btn=card.querySelector(".repost-btn");
  btn.innerHTML=`<i class="fa-solid fa-retweet" style="color:#22c55e"></i> ${post.reposts}`;
  // create a repost in feed
  const reposted={id:nextId++,user:"Chamath Awantha",initials:"CA",text:`🔁 Reposted from @${post.user}:\n${post.text||""}`,image:post.image||null,time:"Just now",likes:0,liked:false,reactions:{},comments:[],saved:false,reposts:0,poll:null,isRepost:true};
  posts.unshift(reposted); savePosts(posts); renderFeed();
}

/* ══ EMOJI REACTIONS ══ */
function openReactionPicker(postId,btnEl){
  const picker=document.getElementById("reactionPicker");
  activeReactionPostId=postId;
  if(picker.classList.contains("open")&&picker.dataset.pid==postId){closeReactionPicker();return;}
  const rect=btnEl.getBoundingClientRect();
  picker.style.left=rect.left+"px"; picker.style.top=(rect.top-58+window.scrollY)+"px";
  picker.dataset.pid=postId; picker.classList.add("open");
}
function closeReactionPicker(){ document.getElementById("reactionPicker").classList.remove("open"); activeReactionPostId=null; }
function pickReaction(emoji){
  const id=activeReactionPostId; if(!id)return;
  const post=posts.find(p=>p.id===id); if(!post)return;
  if(!post.reactions)post.reactions={};
  const old=post.reactions["me"];
  if(old===emoji) delete post.reactions["me"];
  else{ post.reactions["me"]=emoji; if(emoji==="❤️"){post.liked=true;post.likes++;} }
  savePosts(posts); closeReactionPicker(); refreshPostReactions(id);
}
function refreshPostReactions(id){
  const post=posts.find(p=>p.id===id); if(!post)return;
  const card=document.querySelector(`[data-id="${id}"]`); if(!card)return;
  const pills=card.querySelector(".post-reactions"); if(pills)pills.innerHTML=buildReactionPills(post);
  const lb=card.querySelector(".like-btn"); if(lb){ lb.classList.toggle("liked",post.liked); lb.innerHTML=`<i class="${post.liked?'fa-solid':'fa-regular'} fa-heart"></i> ${post.likes}`; }
}
function buildReactionPills(post){
  if(!post.reactions)return"";
  const counts={};
  Object.values(post.reactions).forEach(e=>counts[e]=(counts[e]||0)+1);
  const my=post.reactions["me"];
  return Object.entries(counts).map(([e,c])=>`<span class="react-pill ${my===e?'mine':''}">${e} ${c}</span>`).join("");
}

/* ══ POLL VOTE ══ */
function votePoll(postId, optIdx){
  const post=posts.find(p=>p.id===postId); if(!post||!post.poll)return;
  if(post.poll.myVote!==null)return;
  post.poll.options[optIdx].votes++; post.poll.myVote=optIdx;
  savePosts(posts);
  const card=document.querySelector(`[data-id="${postId}"]`);
  if(card){ card.querySelector(".poll-widget").outerHTML=buildPoll(post.poll,postId); }
}
function buildPoll(poll,postId){
  const total=poll.options.reduce((s,o)=>s+o.votes,0);
  const voted=poll.myVote!==null;
  return `<div class="poll-widget">
    <p class="poll-question">${poll.question}</p>
    ${poll.options.map((o,i)=>{
      const pct=total?Math.round(o.votes/total*100):0;
      return `<div class="poll-option ${voted&&poll.myVote===i?'my-vote':''}" onclick="${voted?'':'votePoll('+postId+','+i+')'}">
        <div class="poll-bar" style="width:${voted?pct:0}%"></div>
        <span class="poll-opt-text">${o.text}</span>
        ${voted?`<span class="poll-pct">${pct}%</span>`:''}
      </div>`;
    }).join("")}
    <p class="poll-total">${total} vote${total!==1?'s':''}</p>
  </div>`;
}

/* ══ SAVE ══ */
function toggleSave(id){
  const post=posts.find(p=>p.id===id); if(!post)return;
  post.saved=!post.saved; savePosts(posts);
  const card=document.querySelector(`[data-id="${id}"]`);
  if(card){ const btn=card.querySelector(".save-btn"); btn.classList.toggle("saved-active",post.saved); btn.innerHTML=`<i class="${post.saved?'fa-solid':'fa-regular'} fa-bookmark"></i>`; }
}
function openSaved(){
  const modal=document.getElementById("savedModal"); const list=document.getElementById("savedList");
  modal.classList.add("open");
  const saved=posts.filter(p=>p.saved);
  if(!saved.length){ list.innerHTML=`<div class="saved-empty"><i class="fa-regular fa-bookmark" style="font-size:2rem"></i><p style="margin-top:8px">No saved posts yet.</p></div>`; return; }
  list.innerHTML=saved.map(post=>`
    <div class="saved-item">
      ${post.image?`<img src="${post.image}" alt="saved"/>`:`<div style="width:60px;height:60px;border-radius:8px;background:linear-gradient(135deg,#1877f2,#7c3aed);display:flex;align-items:center;justify-content:center;color:white;font-weight:700">${post.initials}</div>`}
      <div class="saved-item-text">
        <div class="saved-user">${post.user}</div>
        <div class="saved-caption">${(post.text||"(image post)").substring(0,60)}…</div>
      </div>
      <button class="unsave-btn" onclick="unsaveFromModal(${post.id})"><i class="fa-solid fa-bookmark-slash"></i></button>
    </div>`).join("");
}
function unsaveFromModal(id){
  const p=posts.find(x=>x.id===id); if(p){p.saved=false;savePosts(posts);} openSaved();
  const card=document.querySelector(`[data-id="${id}"]`); if(card){const b=card.querySelector(".save-btn"); if(b){b.classList.remove("saved-active");b.innerHTML=`<i class="fa-regular fa-bookmark"></i>`;}}
}
function closeSaved(){ document.getElementById("savedModal").classList.remove("open"); }
function closeSavedOutside(e){ if(e.target===document.getElementById("savedModal"))closeSaved(); }

/* ══ COMMENTS ══ */
function toggleComments(id){ document.querySelector(`[data-id="${id}"] .comments-section`).classList.toggle("open"); }
function addComment(id){
  const inp=document.querySelector(`[data-id="${id}"] .comment-input`);
  const text=inp.value.trim(); if(!text)return;
  const post=posts.find(p=>p.id===id);
  post.comments.push({user:"Chamath Awantha",text}); savePosts(posts); inp.value="";
  document.querySelector(`[data-id="${id}"] .comments-list`).innerHTML=renderComments(post.comments);
  document.querySelector(`[data-id="${id}"] .comment-btn`).innerHTML=`<i class="fa-regular fa-comment"></i> ${post.comments.length}`;
}
function renderComments(comments){
  return comments.map(c=>`
    <div class="comment-item">
      <div class="avatar" style="width:30px;height:30px;font-size:0.7rem;flex-shrink:0">${c.user.substring(0,2).toUpperCase()}</div>
      <div class="comment-bubble"><strong>${c.user}</strong>${c.text}</div>
    </div>`).join("");
}

/* ══ DELETE ══ */
function deletePost(id){ if(!confirm("Delete this post?"))return; posts=posts.filter(p=>p.id!==id); savePosts(posts); renderFeed(); }

/* ══ RENDER FEED ══ */
function renderFeed(){
  const feed=document.getElementById("postsFeed");
  if(!posts.length){
    feed.innerHTML=`<div class="card" style="text-align:center;color:var(--muted);padding:32px"><i class="fa-regular fa-face-smile" style="font-size:2rem"></i><p style="margin-top:8px">No posts yet!</p></div>`;
    return;
  }
  feed.innerHTML=posts.map(post=>`
    <div class="post-card" data-id="${post.id}">
      ${post.isRepost?`<div class="repost-label"><i class="fa-solid fa-retweet"></i> Reposted</div>`:""}
      <div class="post-header">
        <div class="avatar">${post.initials}</div>
        <div class="post-user"><p class="post-username">${post.user}</p><p class="post-time">${post.time}</p></div>
        ${post.user==="Chamath Awantha"?`<button class="post-delete" onclick="deletePost(${post.id})"><i class="fa-solid fa-trash"></i></button>`:""}
      </div>
      ${post.text?`<div class="post-body">${formatText(post.text)}</div>`:""}
      ${post.image?`<img class="post-img" src="${post.image}" alt="post" loading="lazy"/>`:""}
      ${post.poll?buildPoll(post.poll,post.id):""}
      <div class="post-reactions">${buildReactionPills(post)}</div>
      <div class="post-actions">
        <button class="action-btn like-btn ${post.liked?'liked':''}" onclick="toggleLike(${post.id})">
          <i class="${post.liked?'fa-solid':'fa-regular'} fa-heart"></i> ${post.likes}
        </button>
        <button class="action-btn" onclick="openReactionPicker(${post.id},this)">😊</button>
        <button class="action-btn comment-btn" onclick="toggleComments(${post.id})">
          <i class="fa-regular fa-comment"></i> ${post.comments.length}
        </button>
        <button class="action-btn repost-btn" onclick="repost(${post.id})">
          <i class="fa-solid fa-retweet"></i> ${post.reposts||0}
        </button>
        <button class="action-btn save-btn ${post.saved?'saved-active':''}" onclick="toggleSave(${post.id})">
          <i class="${post.saved?'fa-solid':'fa-regular'} fa-bookmark"></i>
        </button>
      </div>
      <div class="comments-section">
        <div class="comments-list">${renderComments(post.comments)}</div>
        <div class="comment-input-row">
          <input type="text" class="comment-input" placeholder="Write a comment…" onkeydown="if(event.key==='Enter')addComment(${post.id})"/>
          <button onclick="addComment(${post.id})">Post</button>
        </div>
      </div>
    </div>`).join("");
}

// Format hashtags as highlighted spans
function formatText(text){
  return text.replace(/(#\w+)/g,'<span class="hashtag" onclick="searchHashtag(\'$1\')">$1</span>');
}

/* ══ GLOBAL CLICK CLOSE ══ */
document.addEventListener("click",e=>{
  if(!document.querySelector(".notif-wrap")?.contains(e.target))
    document.getElementById("notifPanel")?.classList.remove("open");
  if(!document.getElementById("reactionPicker")?.contains(e.target)&&!e.target.closest(".action-btn"))
    closeReactionPicker();
  if(!document.querySelector(".search-wrap")?.contains(e.target))
    document.getElementById("searchPanel")?.classList.remove("open");
});

/* ══ INIT ══ */
renderFriends();
renderSuggested();
renderStories();
renderLiveBar();
renderTrending();
renderFeed();
renderNotifBadge();
