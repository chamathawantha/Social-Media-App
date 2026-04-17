// ══ data.js v3 – All Feature Data ══

const FRIENDS = [
  { name:"Alice Johnson", initials:"AJ", online:true,  color:"#f59e0b" },
  { name:"Bob Smith",     initials:"BS", online:false, color:"#6366f1" },
  { name:"Charlie Brown", initials:"CB", online:true,  color:"#ec4899" },
  { name:"Diana Prince",  initials:"DP", online:false, color:"#10b981" },
  { name:"Ethan Hunt",    initials:"EH", online:true,  color:"#ef4444" },
];

const SUGGESTED = [
  { name:"Sara Lee",  initials:"SL", color:"#14b8a6" },
  { name:"Mike Chen", initials:"MC", color:"#f97316" },
  { name:"Zara Ali",  initials:"ZA", color:"#8b5cf6" },
];

const STORIES_DATA = [
  { id:1, user:"Your Story",  initials:"CA", color:"#1877f2", isOwn:true,  viewed:false, bg:"linear-gradient(135deg,#1877f2,#7c3aed)", text:"Add your story", image:null },
  { id:2, user:"alice_j",     initials:"AJ", color:"#f59e0b", isOwn:false, viewed:false, bg:"linear-gradient(135deg,#f59e0b,#ef4444)", text:"Morning vibes! ☕", image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80" },
  { id:3, user:"charlie_b",   initials:"CB", color:"#ec4899", isOwn:false, viewed:false, bg:"linear-gradient(135deg,#ec4899,#8b5cf6)", text:"Mountain top 🏔️", image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },
  { id:4, user:"ethan_h",     initials:"EH", color:"#10b981", isOwn:false, viewed:false, bg:"linear-gradient(135deg,#10b981,#1877f2)", text:"Beach day! 🌊",   image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
  { id:5, user:"diana_p",     initials:"DP", color:"#ef4444", isOwn:false, viewed:true,  bg:"linear-gradient(135deg,#ef4444,#f59e0b)", text:"City lights 🌃",  image:"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80" },
];

const LIVE_USERS = [
  { user:"alice_j",   initials:"AJ", color:"#f59e0b", viewers:1243, topic:"Cooking live 🍳" },
  { user:"mike_chen", initials:"MC", color:"#f97316", viewers:892,  topic:"Gaming session 🎮" },
  { user:"sara_lee",  initials:"SL", color:"#14b8a6", viewers:456,  topic:"Q&A with fans 💬" },
];

const TRENDING_HASHTAGS = [
  { tag:"#SriLanka",     posts:4521 },
  { tag:"#Photography",  posts:3874 },
  { tag:"#Sunset",       posts:2910 },
  { tag:"#Travel",       posts:2345 },
  { tag:"#FoodLovers",   posts:1982 },
];

const REELS_DATA = [
  { id:101, user:"alice_j",   initials:"AJ", color:"#f59e0b", caption:"Sunset time lapse 🌅 #nature #travel", likes:4823, bg:"linear-gradient(180deg,#f59e0b,#ef4444)", emoji:"🌅" },
  { id:102, user:"charlie_b", initials:"CB", color:"#ec4899", caption:"Mountain hike highlights 🏔️ #adventure", likes:3210, bg:"linear-gradient(180deg,#6366f1,#ec4899)", emoji:"🏔️" },
  { id:103, user:"ethan_h",   initials:"EH", color:"#10b981", caption:"Beach vibes 🌊 #summer #beach",         likes:5671, bg:"linear-gradient(180deg,#10b981,#1877f2)", emoji:"🌊" },
  { id:104, user:"sara_lee",  initials:"SL", color:"#14b8a6", caption:"City walking tour 🌃 #urban #city",     likes:2890, bg:"linear-gradient(180deg,#14b8a6,#8b5cf6)", emoji:"🌃" },
];

const INITIAL_CONVOS = [
  {
    id:1, user:"Alice Johnson", initials:"AJ", color:"#f59e0b", online:true,
    messages:[
      { from:"AJ", text:"Hey! Loved your sunset photo 😍", time:"10:30 AM" },
      { from:"me", text:"Thanks! Took it at Galle Face 🌅",  time:"10:32 AM" },
      { from:"AJ", text:"So beautiful! We should go together sometime", time:"10:33 AM" },
    ]
  },
  {
    id:2, user:"Bob Smith", initials:"BS", color:"#6366f1", online:false,
    messages:[
      { from:"BS", text:"Did you see the game last night?", time:"Yesterday" },
      { from:"me", text:"Yeah it was insane! 🔥",           time:"Yesterday" },
    ]
  },
  {
    id:3, user:"Charlie Brown", initials:"CB", color:"#ec4899", online:true,
    messages:[
      { from:"CB", text:"Are you coming to the hike this weekend?", time:"2d ago" },
    ]
  },
];

const INITIAL_NOTIFICATIONS = [
  { id:1, type:"like",    user:"Alice Johnson", text:"liked your post",         time:"2m ago",  read:false },
  { id:2, type:"comment", user:"Bob Smith",     text:"commented on your photo", time:"15m ago", read:false },
  { id:3, type:"follow",  user:"Charlie Brown", text:"started following you",   time:"1h ago",  read:false },
  { id:4, type:"like",    user:"Diana Prince",  text:"liked your photo",        time:"3h ago",  read:true  },
];

const INITIAL_POSTS = [
  {
    id:1001, user:"Chamath Awantha", initials:"CA",
    text:"Beautiful sunset! 🌅 #sunset #photography #srilanka",
    image:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    time:"2h ago", likes:123, liked:false, reactions:{}, comments:[{ user:"Alice Johnson", text:"Stunning shot! 😍" }],
    saved:false, reposts:5, poll:null
  },
  {
    id:1002, user:"alice_j", initials:"AJ",
    text:"Morning coffee vibes ☕ starting the day right! #coffee #morning",
    image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    time:"4h ago", likes:56, liked:false, reactions:{}, comments:[],
    saved:false, reposts:2, poll:null
  },
  {
    id:1003, user:"charlie_b", initials:"CB",
    text:"What's your favourite travel destination? 🌍",
    image:null, time:"6h ago", likes:34, liked:false, reactions:{}, comments:[],
    saved:false, reposts:0,
    poll:{ question:"Where would you go?", options:[{text:"🏖️ Beach",votes:12},{text:"🏔️ Mountains",votes:18},{text:"🏙️ City",votes:8}], myVote:null }
  },
  {
    id:1004, user:"ethan_h", initials:"EH",
    text:"Weekend hiking trip 🏔️ nature is the best therapy. #travel #hiking #nature",
    image:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    time:"Yesterday", likes:89, liked:false, reactions:{}, comments:[{ user:"Bob Smith", text:"Where is this? Looks amazing!" }],
    saved:false, reposts:7, poll:null
  },
];

// ── Storage helpers ──
function loadPosts()         { const s=localStorage.getItem("sa_posts_v3");   return s?JSON.parse(s):(savePosts(INITIAL_POSTS),INITIAL_POSTS); }
function savePosts(p)        { localStorage.setItem("sa_posts_v3",JSON.stringify(p)); }
function loadNotifications() { const s=localStorage.getItem("sa_notifs");     return s?JSON.parse(s):(saveNotifications(INITIAL_NOTIFICATIONS),INITIAL_NOTIFICATIONS); }
function saveNotifications(n){ localStorage.setItem("sa_notifs",JSON.stringify(n)); }
function loadConvos()        { const s=localStorage.getItem("sa_convos");     return s?JSON.parse(s):(saveConvos(INITIAL_CONVOS),INITIAL_CONVOS); }
function saveConvos(c)       { localStorage.setItem("sa_convos",JSON.stringify(c)); }
function loadStories()       { const s=localStorage.getItem("sa_stories");    return s?JSON.parse(s):(saveStories(STORIES_DATA),STORIES_DATA); }
function saveStories(st)     { localStorage.setItem("sa_stories",JSON.stringify(st)); }

// ── Theme ──
function applyTheme() {
  const t=localStorage.getItem("sa_theme")||"light";
  document.documentElement.setAttribute("data-theme",t);
  const i=document.getElementById("themeIcon");
  if(i) i.className=t==="dark"?"fa-solid fa-sun":"fa-solid fa-moon";
}
function toggleTheme() {
  const cur=document.documentElement.getAttribute("data-theme");
  const nxt=cur==="dark"?"light":"dark";
  document.documentElement.setAttribute("data-theme",nxt);
  localStorage.setItem("sa_theme",nxt);
  const i=document.getElementById("themeIcon");
  if(i) i.className=nxt==="dark"?"fa-solid fa-sun":"fa-solid fa-moon";
}
applyTheme();
