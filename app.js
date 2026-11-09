// Config: cuando el local entregue su número real, ponerlo aquí (formato 58424XXXXXXX)
const WA_NUMBER = '';
const WA_LINK = 'https://wa.link/oua7ji';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Reveal on scroll (con escalonado) ---------- */
document.querySelectorAll('.flyers .flyer').forEach((el, i) => { el.style.transitionDelay = `${i * 0.12}s`; });
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* ---------- Nav sólido + copa que se llena con el scroll ---------- */
const nav = document.querySelector('.nav');
const sip = document.querySelector('.sip');
let ticking = false;
function onScroll() {
  nav.classList.toggle('is-solid', window.scrollY > 40);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  sip.style.setProperty('--p', p.toFixed(3));
  sip.classList.toggle('full', p > 0.985);
  if (!reduce) parallax();
  ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

/* ---------- Parallax suave en el mosaico ---------- */
const figs = [...document.querySelectorAll('.mosaic figure')];
const depths = [0.9, -0.6, 0.5, -0.9];
function parallax() {
  const vh = window.innerHeight;
  figs.forEach((f, i) => {
    const r = f.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) return;
    const d = (r.top + r.height / 2 - vh / 2) / vh;
    f.style.setProperty('--py', `${(d * 26 * depths[i % depths.length]).toFixed(1)}px`);
  });
}
onScroll();

/* ---------- Bolita de karaoke ---------- */
const kar = document.getElementById('karaoke');
if (kar && !reduce) {
  const words = [...kar.querySelectorAll('.k')];
  const ball = kar.querySelector('.ball');
  let cur = 0;
  const place = (i) => {
    const w = words[i];
    ball.style.transform = `translate(${w.offsetLeft + w.offsetWidth / 2}px, ${w.offsetTop}px)`;
  };
  const step = () => {
    if (cur >= words.length) {
      cur = 0;
      setTimeout(() => { words.forEach((w) => w.classList.remove('sung')); place(0); setTimeout(step, 500); }, 1700);
      return;
    }
    place(cur);
    setTimeout(() => { words[cur].classList.add('sung'); cur += 1; setTimeout(step, 520); }, 380);
  };
  const startDelay = document.documentElement.classList.contains('seen') ? 1300 : 2500;
  place(0);
  setTimeout(step, startDelay);
  window.addEventListener('resize', () => place(Math.min(cur, words.length - 1)));
} else if (kar) {
  kar.querySelectorAll('.k').forEach((w) => w.classList.add('sung'));
}

/* ---------- Reflector: sigue el mouse, o se pasea solo en el celular ---------- */
const hero = document.querySelector('.hero');
const spot = document.getElementById('spot');
if (hero && spot && !reduce) {
  if (finePointer) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
      spot.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  } else {
    let visible = true;
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(hero);
    const loop = (t) => {
      if (visible) {
        spot.style.setProperty('--mx', `${50 + 32 * Math.sin(t / 2300)}%`);
        spot.style.setProperty('--my', `${46 + 14 * Math.sin(t / 1500 + 1)}%`);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

/* ---------- Tilt 3D en los flyers (solo con mouse) ---------- */
if (finePointer && !reduce) {
  document.querySelectorAll('.flyer').forEach((card) => {
    const img = card.querySelector('img');
    card.addEventListener('pointermove', (e) => {
      const r = img.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      img.style.transition = 'transform .08s linear';
      img.style.transform = `rotateY(${(px * 14).toFixed(2)}deg) rotateX(${(-py * 14).toFixed(2)}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => {
      img.style.transition = '';
      img.style.transform = '';
    });
  });
}

/* ---------- Estado "abierto ahora" (hora de Caracas) ---------- */
const live = document.getElementById('live');
if (live) {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Caracas' }));
  const day = now.getDay();
  const h = now.getHours();
  const label = live.querySelector('span');
  if (day >= 1 && day <= 6 && h >= 16) {
    label.textContent = 'Abierto ahora';
  } else if (day >= 1 && day <= 6 && h >= 4) {
    label.textContent = 'Hoy abrimos a las 4 PM';
    live.classList.add('is-closed');
  } else if (day === 0 && h >= 4) {
    label.textContent = 'Hoy descansamos · mañana desde las 4 PM';
    live.classList.add('is-closed');
  }
}

/* ---------- Despechómetro ---------- */
const VIBES = {
  visto: { v: 'bolero', t: 'Sin respuesta, con dignidad: ponle un bolero bien dramático y que el salón te acompañe en el coro.' },
  otro: { v: 'ranchera', t: 'Te cambiaron por otro. Hora de una ranchera a pecho abierto y brindar por lo que viene.' },
  extra: { v: 'balada', t: 'Todavía lo extrañas: una balada romántica a todo pulmón, y mañana lo vemos.' },
  listo: { v: 'salsa', t: 'Ya lo superaste. Salsa, baile y una ronda para los que cantan de pie.' }
};
const out = document.getElementById('meterOut');
document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach((c) => c.classList.remove('on'));
    chip.classList.add('on');
    const d = VIBES[chip.dataset.k];
    out.querySelector('.meter__vibe').textContent = d.v;
    out.querySelector('.meter__txt').textContent = d.t;
    if (!reduce) hearts(chip);
  });
});
function hearts(from) {
  const r = from.getBoundingClientRect();
  for (let i = 0; i < 7; i++) {
    const h = document.createElement('span');
    h.className = 'heart';
    h.textContent = i % 2 ? '♥' : '✦';
    h.style.left = `${r.left + Math.random() * r.width}px`;
    h.style.top = `${r.top + r.height / 2}px`;
    h.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
    h.style.animationDelay = `${i * 0.05}s`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1600);
  }
}

/* ---------- Reservas -> WhatsApp ---------- */
const form = document.getElementById('bookForm');
const msg = document.getElementById('formMsg');
form.fecha.min = new Date().toISOString().split('T')[0];
form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const f = new FormData(form);
  if (!f.get('nombre').trim() || !f.get('fecha')) { msg.textContent = 'Completa tu nombre y la fecha.'; return; }
  const [y, m, d] = f.get('fecha').split('-');
  const text = `Hola Entre Copas! Quiero reservar una mesa.\nNombre: ${f.get('nombre')}\nPersonas: ${f.get('personas')}\nFecha: ${d}/${m}/${y}\nOcasión: ${f.get('ocasion')}`;
  if (WA_NUMBER) {
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    msg.textContent = 'Abriendo WhatsApp…';
  } else {
    try { await navigator.clipboard.writeText(text); msg.textContent = 'Mensaje copiado. Pégalo en el chat de WhatsApp que se abre.'; }
    catch (e) { msg.textContent = 'Abriendo WhatsApp…'; }
    window.open(WA_LINK, '_blank', 'noopener');
  }
});
