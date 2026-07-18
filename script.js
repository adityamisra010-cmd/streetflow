// watch grid categories — real Instagram highlight names
const cats = ["Dance Reels","Wedding","Teasers","Practices","Reviews","Events","Celeb Interactions","All Posts"];
const angles = [95,140,60,110,80,150,70,120];
const grid = document.querySelector('.watch-grid');
cats.forEach((c,i)=>{
  const a = document.createElement('a');
  a.href = "https://www.instagram.com/streetflowdance/";
  a.target = "_blank"; a.rel = "noopener";
  a.className = "watch-card";
  a.setAttribute('data-reveal', '');
  a.style.setProperty('--d', (i%4)*90 + 'ms');
  a.innerHTML = `
    <div class="bg" style="background:linear-gradient(${angles[i]}deg,#ec3f73,#f4a93b ${55+i*3}%,#ffd866)"></div>
    <span class="label">${c}</span>
    <span class="go">View on Instagram
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M9 7h8v8"/></svg>
    </span>`;
  grid.appendChild(a);
});

// scroll reveal
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold:0.15 });
document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));

// mobile menu
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('mobileMenu');
function setMenu(open){
  menu.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.setAttribute('aria-hidden', open ? 'false' : 'true');
  menu.inert = !open; // keep off-screen links out of the tab order + a11y tree when closed
}
setMenu(false); // start closed & inert
toggle.addEventListener('click', ()=> setMenu(!menu.classList.contains('open')));
menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=> setMenu(false)));
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && menu.classList.contains('open')){ setMenu(false); toggle.focus(); }
});
