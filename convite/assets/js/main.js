/* Convite Vaneza & Adilson — 18.12.2026 */
const WHATSAPP_NUMBER = '244911795226'; // TROCAR pelo número real dos noivos (código do país + número, sem +)
const EVENT = {
  title: 'Casamento Vaneza & Adilson',
  desc: 'Celebração do casamento de Vaneza & Adilson.',
  place: 'Luanda, Angola',
  start: '20261218T173000Z', // 17h30 em Luanda (UTC+1)
  end: '20261218T230000Z'
};
const $ = (id) => document.getElementById(id);

function toast(msg) {
  let t = $('toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

/* Envelope: abre com um toque e arranca a música (gesto do utilizador) */
function initEnvelope() {
  const env = $('envelope');
  env.addEventListener('click', () => {
    env.classList.add('open');
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
    try { if (window.weddingAudio && !window.weddingAudio.isPlaying) window.weddingAudio.togglePlay(); } catch (e) {}
    setTimeout(() => env.remove(), 3000);
  });
}

/* Contagem decrescente — 18/12/2026 17h00 */
function initCountdown() {
  const target = new Date('2026-12-18T15:00:00+01:00').getTime();
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    const d = target - Date.now();
    if (d <= 0) { $('count').innerHTML = '<div class="today">Hoje é o grande dia!</div>'; clearInterval(timer); return; }
    $('cd-d').textContent = pad(Math.floor(d / 864e5));
    $('cd-h').textContent = pad(Math.floor(d % 864e5 / 36e5));
    $('cd-m').textContent = pad(Math.floor(d % 36e5 / 6e4));
    $('cd-s').textContent = pad(Math.floor(d % 6e4 / 1e3));
  };
  const timer = setInterval(tick, 1000); tick();
}

/* Modais */
function initModals() {
  document.querySelectorAll('.modal').forEach((m) => {
    m.addEventListener('click', (e) => { if (e.target === m || e.target.hasAttribute('data-close')) m.classList.remove('on'); });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.modal.on').forEach((m) => m.classList.remove('on')); });
}

/* Agenda */
function initCalendar() {
  $('open-cal').addEventListener('click', () => $('cal-modal').classList.add('on'));
  $('cal-google').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(EVENT.title) +
    '&dates=' + EVENT.start + '/' + EVENT.end + '&details=' + encodeURIComponent(EVENT.desc) + '&location=' + encodeURIComponent(EVENT.place);
  $('cal-ics').addEventListener('click', () => {
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Convite Vaneza e Adilson//PT', 'BEGIN:VEVENT',
      'UID:casamento-vaneza-adilson-2026@convite', 'DTSTAMP:20261005T000000Z',
      'SUMMARY:' + EVENT.title, 'DESCRIPTION:' + EVENT.desc, 'LOCATION:' + EVENT.place,
      'DTSTART:' + EVENT.start, 'DTEND:' + EVENT.end, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    a.download = 'Casamento-Vaneza-Adilson.ics';
    document.body.appendChild(a); a.click(); a.remove();
    toast('Evento guardado na sua agenda');
  });
}

/* RSVP → WhatsApp */
function initRSVP() {
  const form = $('rsvp-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('name').value.trim(), phone = $('phone').value.trim(), msg = $('msg').value.trim();
    const yes = document.querySelector('input[name="presence"]:checked').value === 'sim';

    let t = '*CONFIRMAÇÃO DE PRESENÇA*\nVaneza & Adilson | 18.12.2026\n\n';
    t += 'Nome: ' + name + '\nTelefone: ' + phone + '\n';
    t += 'Presença: ' + (yes ? 'Sim, estarei presente' : 'Infelizmente não poderei comparecer') + '\n';
    if (msg) t += '\nMensagem: "' + msg + '"\n';

    $('ok-title').textContent = 'Obrigado, ' + name.split(' ')[0] + '!';
    $('ok-text').textContent = yes ? 'A sua presença está confirmada. Mal podemos esperar para celebrar consigo.' : 'Agradecemos o carinho. Sentiremos a sua falta.';
    $('ok-wa').href = 'https://api.whatsapp.com/send?phone=' + WHATSAPP_NUMBER + '&text=' + encodeURIComponent(t);
    $('ok-modal').classList.add('on');
    try { localStorage.setItem('rsvp', JSON.stringify({ name, yes, at: Date.now() })); } catch (err) {}
    if (yes && typeof confetti === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches)
      confetti({ particleCount: 90, spread: 70, origin: { y: .6 }, colors: ['#D4AF37', '#C5A880', '#E3D2B0', '#FFFFFF'] });
  });
}

/* Pétalas suaves */
function initPetals() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = $('petals');
  setInterval(() => {
    if (document.hidden) return;
    const p = document.createElement('div'), s = 9 + Math.random() * 12, d = 7 + Math.random() * 7;
    p.className = 'petal';
    p.style.cssText = 'left:' + Math.random() * 100 + 'vw;width:' + s + 'px;height:' + s * 1.3 + 'px;animation-duration:' + d + 's';
    box.appendChild(p); setTimeout(() => p.remove(), d * 1000);
  }, 1800);
}

document.addEventListener('DOMContentLoaded', () => {
  const g = new URLSearchParams(location.search).get('convidado');
  if (g && $('guest')) $('guest').textContent = g;
  initEnvelope(); initCountdown(); initModals(); initCalendar(); initRSVP(); initPetals();
});
