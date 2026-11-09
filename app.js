// Config: cuando el local entregue su número real, ponerlo aquí (formato 58424XXXXXXX)
const WA_NUMBER = '';
const WA_LINK = 'https://wa.link/oua7ji';

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Despechómetro
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
  });
});

// Reservas -> WhatsApp
const form = document.getElementById('bookForm');
const msg = document.getElementById('formMsg');
const today = new Date().toISOString().split('T')[0];
form.fecha.min = today;
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
