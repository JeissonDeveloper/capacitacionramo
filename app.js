// DOM utils
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => Array.from(ctx.querySelectorAll(q));

// Slides setup
const panels = $$('#slides .panel');
const pills = $('#pills');
const btnPrev = null;
const btnNext = null;
const btnComenzar = $('#btnComenzar');
const btnChecklist = null;
const btnReiniciar = $('#btnReiniciar');
const stepNum = $('#stepNum');
const stepTotal = $('#stepTotal');
const progressBar = $('#progressBar');

stepTotal.textContent = panels.length - 1; // exclude portada
let current = 0;

// Build pills
panels.forEach((panel, i)=>{
  const li = document.createElement('li');
  const b = document.createElement('button');
  b.setAttribute('data-index', i);
  b.setAttribute('data-title', panel.dataset.title || `Sección ${i+1}`);
  b.addEventListener('click', ()=> goto(i, i > current ? 'right':'left'));
  li.appendChild(b);
  pills.appendChild(li);
});

function updateUI(){
  const totalSteps = panels.length - 1;
  const showIndex = Math.max(1, current); // counter skips portada
  stepNum.textContent = Math.min(showIndex, totalSteps);
  progressBar.style.width = ((Math.min(showIndex, totalSteps) / totalSteps) * 100) + '%';
  // Pills
  const btns = $$('#pills button'); btns.forEach(b=>b.classList.remove('active'));
  if (btns[current]) btns[current].classList.add('active');
}

// Show only one panel with slide animations
function show(index, dir='right'){
  if(index === current) return;
  const out = panels[current];
  const incoming = panels[index];
  if(!incoming) return;

  // prepare outgoing
  out.classList.remove('active','slide-enter-right','slide-enter-left','slide-exit-left','slide-exit-right');
  out.classList.add(dir === 'right' ? 'slide-exit-left' : 'slide-exit-right');
  setTimeout(()=>{
    out.style.display = 'none';
    out.classList.remove('slide-exit-left','slide-exit-right');
  }, 320);

  // prepare incoming
  incoming.style.display = 'block';
  incoming.classList.add('active', 'reveal', dir === 'right' ? 'slide-enter-right' : 'slide-enter-left');
  setTimeout(()=> incoming.classList.remove('slide-enter-right','slide-enter-left'), 480);
  // remove reveal after animations complete
  setTimeout(()=> incoming.classList.remove('reveal'), 1200);

  current = index;
  updateUI();
}

function goto(index, dir='right'){
  index = Math.max(0, Math.min(index, panels.length-1));
  show(index, dir);
}

// Init: show only portada
panels.forEach((p,i)=> p.style.display = i===0 ? 'grid' : 'none');
updateUI();

// Controls
if(btnPrev){ btnPrev.addEventListener('click', ()=> goto(current-1, 'left')); }
if(btnNext){ btnNext.addEventListener('click', ()=> goto(current+1, 'right')); }
btnComenzar && btnComenzar.addEventListener('click', ()=> goto(1, 'right'));
btnReiniciar && btnReiniciar.addEventListener('click', ()=> goto(1, 'left'));

// Keyboard
document.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') goto(current+1, 'right');
  if(e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') goto(current-1, 'left');
});

// Swipe (mobile)
let sx=0, sy=0;
document.addEventListener('touchstart', (e)=>{
  const t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY;
},{passive:true});
document.addEventListener('touchend', (e)=>{
  const t = e.changedTouches[0];
  const dx = t.clientX - sx; const dy = t.clientY - sy;
  if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40){
    if(dx < 0) goto(current+1, 'right'); else goto(current-1, 'left');
  }
},{passive:true});


// Year
$('#year').textContent = new Date().getFullYear();



