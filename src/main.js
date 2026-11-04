import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const $ = (s) => document.querySelector(s)
const $$ = (s) => gsap.utils.toArray(s)
const U = () => parseFloat(getComputedStyle(document.documentElement).fontSize) / 10
const K = () => U() * 2.31
const mobile = innerWidth <= 760

const lenis = new Lenis({ lerp: 0.09, anchors: true })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)

// Word masks
const splitWords = (text) => text.trim().split(' ').map((w) => `<span class="w"><span>${w}</span></span>`).join(' ')
$$('[data-split]').forEach((el) => {
  el.innerHTML = splitWords(el.textContent)
  el.classList.add('ok')
})

// Rolling digits
$$('[data-num]').forEach((el) => {
  const s = el.dataset.num
  el.setAttribute('role', 'img')
  el.setAttribute('aria-label', s)
  el.innerHTML = [...s].map((c) => {
    const cells = [+c + 7, +c + 8, +c + 9, +c].map((d) => d % 10)
    return `<span class="ch" aria-hidden="true"><span class="strip">${cells.map((d) => `<b>${d}</b>`).join('')}</span></span>`
  }).join('')
})

const rise = () => ({ y: 0, yPercent: 115 })
const pins = []
const pin = (trigger, length, animation, pinned = true) => {
  const st = ScrollTrigger.create({ trigger, start: 'top top', end: `+=${length}%`, pin: pinned, anticipatePin: 1, scrub: true, animation, invalidateOnRefresh: true })
  pins.push(st)
  return st
}
const entry = (trigger, start = 'top 88%', end = 'top 45%') => gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger, start, end, scrub: true, invalidateOnRefresh: true } })
const words = (tl, sel, at = 0) => tl.fromTo(`${sel} .w > span`, rise(), { yPercent: 0, stagger: 0.06, duration: 0.6 }, at)
const tighten = (tl, sel, at = 0.1) => tl
  .fromTo(`${sel} .l`, { y: (i) => U() * i * 22 }, { y: 0, duration: 0.9 }, at)
  .fromTo(`${sel} .l > span`, rise(), { yPercent: 0, stagger: 0.08, duration: 0.6 }, at)

// ---- Hero: load intro, then copy and form pull apart before the page moves
function intro() {
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .fromTo('.hero-img', { scale: 1.16 }, { scale: 1, duration: 3.2, ease: 'power2.out' }, 0)
    .fromTo('.hero-title', { y: () => U() * 90 }, { y: 0, duration: 1.15 }, 0)
    .fromTo('.hero-title .w > span', rise(), { yPercent: 0, duration: 1, stagger: 0.09 }, 0.05)
    .fromTo('.hero-sub .mask > span', rise(), { yPercent: 0, duration: 0.8 }, 0.35)
    .fromTo('.hero-cta', { y: () => U() * 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, 0.7)
    .fromTo('.req', { x: () => U() * 240 }, { x: 0, duration: 1.3 }, 0.3)
    .fromTo('.c1', { x: () => U() * 340 }, { x: 0, duration: 1.3 }, 0.45)
    .fromTo('.c2', { x: () => U() * -340, opacity: 0 }, { x: 0, opacity: 1, duration: 1.3 }, 0.55)
}
const heroVideo = $('.hero-img')
heroVideo.src = mobile ? '/video/hero-m.mp4' : '/video/hero.mp4'
// Videos only run while on screen
const videoWatch = new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? e.target.play().catch(() => {}) : e.target.pause())))
videoWatch.observe(heroVideo)
videoWatch.observe($('.foot-img video'))

pin('.hero', 70, gsap.timeline({ defaults: { ease: 'none' } })
  .to('.hero-media', { scale: 1.08, '--shade': 0, duration: 1 }, 0)
  .to('.hero-copy', { x: () => U() * -170, autoAlpha: 0, duration: 0.55 }, 0)
  .to('.hero-side', { x: () => U() * 190, autoAlpha: 0, duration: 0.55 }, 0))

// ---- About: heading masks, paragraph lines tighten
entry('.brands').fromTo('.brands li', { y: () => U() * 60, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.5 })
const aboutTl = entry('.about-grid', 'top 92%', 'top 50%')
words(aboutTl, '.about-title')
tighten(aboutTl, '.about-p')

// ---- Duo: photos slide in from opposite sides, the pill lands on the seam
entry('.duo', 'top 95%', 'top top')
  .fromTo('.d1', { x: () => U() * -520, rotation: -5 }, { x: 0, rotation: 0, duration: 1, ease: 'power2.out' }, 0)
  .fromTo('.d2', { x: () => U() * 560, rotation: 5 }, { x: 0, rotation: 0, duration: 1, ease: 'power2.out' }, 0)
pin('.duo', 50, gsap.timeline({ defaults: { ease: 'power2.out' } })
  .fromTo('.ex', { x: () => U() * 420, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, 0)
  .fromTo('.ex i', { rotation: -180 }, { rotation: 0, duration: 0.7 }, 0)
  .to({}, { duration: 0.3 }))

// ---- Services: flat stack -> tumbling cluster -> fan
const P = (x, y, rx, ry, rz, s) => ({ x, y, rx, ry, rz, s })
const STEPS = [
  [P(-100, -8, 28, -18, -12, .66), P(-40, 6, 22, -10, 8, .7), P(6, 34, 18, 6, -8, .62), P(40, -24, 24, 14, 6, .6), P(116, -2, 26, 22, 8, .62)],
  [P(-84, 22, 6, -16, 10, .6), P(-34, -8, 8, -4, 8, .68), P(26, 14, 5, 4, 10, .74), P(58, -10, 5, 6, -2, .76), P(92, 26, 4, 6, 3, .66)],
  [P(-147, 15, 0, -4, 3.6, .5), P(-73, -17, 0, 10, -1, .5), P(0, 10, 0, 0, 2.4, .5), P(72, -13, 0, 6, -2.6, .5), P(142, 18, 0, 24, -4.4, .46)],
]
const cards = $$('.card')
gsap.set(cards, { transformPerspective: 1200 })
const pose = (p) => ({ x: () => K() * p.x, y: () => K() * p.y, rotationX: p.rx, rotationY: p.ry, scale: p.s })
const fanIn = entry('.fan', 'top 72%', 'top top')
words(fanIn, '.fan-title')
fanIn.fromTo('.fan-title', { y: () => U() * 150 }, { y: 0, duration: 1 }, 0)
  .fromTo('.fan-sub', { y: () => U() * 150 }, { y: 0, duration: 1 }, 0)
  .fromTo('.fan-sub .l > span', rise(), { yPercent: 0, duration: 0.6 }, 0.25)
const fanTl = gsap.timeline({ defaults: { ease: 'power1.inOut' } })
// The inner card spins in-plane while the outer one tilts, so the stack lies flat
cards.forEach((c, i) => {
  const inner = c.firstElementChild
  fanTl.fromTo(c, pose(P(0, (i - 2) * 30, 80, 0, 0, .7)), { ...pose(STEPS[0][i]), duration: 0.28 }, 0.1)
  fanTl.fromTo(inner, { rotation: -58 }, { rotation: STEPS[0][i].rz, duration: 0.28 }, 0.1)
  fanTl.to(c, { ...pose(STEPS[1][i]), duration: 0.24 }, 0.38)
  fanTl.to(inner, { rotation: STEPS[1][i].rz, duration: 0.24 }, 0.38)
  fanTl.to(c, { ...pose(STEPS[2][i]), duration: 0.26 }, 0.62)
  fanTl.to(inner, { rotation: STEPS[2][i].rz, duration: 0.26 }, 0.62)
  fanTl.to(inner, { rotation: `+=${i % 2 ? -1.5 : 1.5}`, duration: 0.12, ease: 'none' }, 0.88)
})
fanTl.fromTo('.fan-hint', { y: () => U() * 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.08 }, 0.86)
pin('.fan', 220, fanTl)

// ---- Service rows
$$('.svc').forEach((s) => {
  entry(s, 'top 92%', 'top 42%')
    .fromTo(s.querySelector('.svc-img'), { x: () => U() * -260, rotation: -3 }, { x: 0, rotation: 0, duration: 1, ease: 'power2.out' }, 0)
    .fromTo(s.querySelectorAll('.w > span'), rise(), { yPercent: 0, stagger: 0.05, duration: 0.5 }, 0.1)
    .fromTo(s.querySelectorAll('.list li'), { y: () => U() * 46, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.5 }, 0.25)
})

// ---- Why: whip zoom from day to night, title swaps across it, then digits and pills
pin('.why', 320, gsap.timeline({ defaults: { ease: 'none' } })
  .fromTo('.col', { y: () => U() * 90, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.14 }, 0)
  .fromTo('.strip', { yPercent: 0 }, { yPercent: -75, stagger: 0.015, duration: 0.2 }, 0.02)
  .fromTo('.col:nth-child(odd) .slide', { x: () => U() * 420 }, { x: 0, duration: 0.2, ease: 'power2.out' }, 0.04)
  .fromTo('.col:nth-child(2) .slide', { x: () => U() * -420 }, { x: 0, duration: 0.2, ease: 'power2.out' }, 0.06)
  .fromTo('.day', { scale: 1 }, { scale: 1.12, duration: 0.46 }, 0)
  .to('.day', { scale: 1.8, filter: 'blur(18px) brightness(2)', duration: 0.09, ease: 'power2.in' }, 0.46)
  .set('.day', { opacity: 0 }, 0.55)
  .fromTo('.night', { scale: 0.72, filter: 'blur(18px) brightness(2)', opacity: 0 }, { scale: 1, filter: 'blur(0px) brightness(1)', opacity: 1, duration: 0.1, ease: 'power2.out' }, 0.55)
  .fromTo('.t1', { opacity: 1 }, { opacity: 0, filter: 'blur(12px)', letterSpacing: '-.08em', duration: 0.08 }, 0.47)
  .fromTo('.t2', { opacity: 0, filter: 'blur(12px)', letterSpacing: '.08em' }, { opacity: 1, filter: 'blur(0px)', letterSpacing: '-.02em', duration: 0.09 }, 0.56)
  .to({}, { duration: 0.1 }, 0.9))
entry('.why', 'top 80%', 'top top').fromTo('.why-sub', { opacity: 0, y: () => U() * 30 }, { opacity: 0.82, y: 0, duration: 1 }, 0.3)

// ---- Testimonials: cards stand up from flat, then the track runs sideways
const tstIn = entry('.tst', 'top 72%', 'top top')
words(tstIn, '.tst-title')
gsap.set('.pair', { transformPerspective: 1400 })
pin('.tst', 260, gsap.timeline({ defaults: { ease: 'none' } })
  .fromTo('.pair', { rotationX: 72, y: () => U() * 170, opacity: 0.3 }, { rotationX: 0, y: 0, opacity: 1, stagger: 0.04, duration: 0.18, ease: 'power2.out' }, 0)
  .fromTo('.track', { x: 0 }, { x: () => -($('.track').offsetWidth - innerWidth), duration: 0.78 }, 0.2)
  .fromTo('.pager i', { x: 0 }, { x: () => $('.pager').clientWidth - $('.pager i').offsetWidth - U() * 8, duration: 0.78 }, 0.2))

// ---- CTA: card grows into place
const ctaTl = entry('.cta-s', 'top 92%', 'top 12%')
ctaTl.fromTo('.cta-card', { scale: 0.84, y: () => U() * 80 }, { scale: 1, y: 0, duration: 1 }, 0)
words(ctaTl, '.cta-in', 0.25)
ctaTl.fromTo('.cta-in .body, .cta-in .cta', { y: () => U() * 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.4 }, 0.5)

// ---- Final: giant scroll-driven name with the sweeping band
const finalIn = entry('.final', 'top 92%', 'top top')
tighten(finalIn, '.final-p')
finalIn.fromTo('.foot-nav a', { y: () => U() * 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.5 }, 0.35)
  .fromTo('.foot-img', { y: () => U() * 240 }, { y: 0, duration: 1, ease: 'power2.out' }, 0)
const finalPin = pin('.final', 170, gsap.timeline({ defaults: { ease: 'none' } })
  .fromTo('.mq1', { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', duration: 0.4 }, 0)
  .fromTo('.mq2', { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', duration: 0.4 }, 0.5)
  .fromTo('.foot-img video', { yPercent: 0 }, { yPercent: -20, duration: 1 }, 0))
gsap.fromTo('.mq', { x: 0 }, {
  x: () => -($('.mq').offsetWidth - innerWidth + U() * 54), ease: 'none',
  scrollTrigger: { trigger: '.final', start: 'top 60%', end: () => finalPin.end, scrub: true, invalidateOnRefresh: true },
})

// ---- Motion blur on fast scroll between sections
const blurred = $$('.mb')
let blur = 0
let lastFilter = 'none'
gsap.ticker.add(() => {
  const target = pins.some((p) => p.isActive) ? 0 : Math.min(Math.abs(lenis.velocity) * 0.05, 3)
  blur += (target - blur) * 0.2
  const value = blur < 0.2 ? 'none' : `blur(${blur.toFixed(2)}px)`
  if (value !== lastFilter) {
    blurred.forEach((el) => { el.style.filter = value })
    lastFilter = value
  }
})

const TEL = 'tel:+32494990657'
const mail = (subject) => `mailto:afarhane00@gmail.com?subject=${encodeURIComponent(subject)}`
const BCE = 'https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?lang=fr&nummer=0804170184&actionLu=Recherche'
const VAT = 'https://fin.belgium.be/fr/particuliers/habitation/construire-renover/renover/renover-taux-de-tva'

// ---- Service sheets: the card flies open in 3D, the photo keeps moving behind the text
const SERVICES = [
  { img: '/img/foot.webp', code: 'Activité déclarée · NACE 43.211', title: 'Installation électrique', text: 'Le cœur du métier de Fasetech : les travaux généraux d’installation électrotechnique, avec une compétence professionnelle enregistrée depuis juillet 2023.', list: ['Nouvelle installation ou extension', 'Tableau électrique à poser ou à remplacer', 'Circuits, prises et éclairage'], cta: 'Décrire mon projet', href: '#demande' },
  { img: '/img/cta.webp', code: 'Activité déclarée · NACE 33.140', title: 'Réparation et entretien', text: 'Un circuit qui lâche, un disjoncteur qui saute, un équipement à remettre en état : on cherche la cause avant de changer quoi que ce soit.', list: ['Recherche de la cause de la panne', 'Réparation d’équipements électriques', 'Entretien d’équipements électriques'], cta: 'Appeler pour une panne', href: TEL },
  { img: '/img/s2.webp', code: 'Activité déclarée · NACE 43.212', title: 'Industrie', text: 'L’installation électrotechnique d’établissements industriels est une activité déclarée à part entière, tout comme la réparation et l’entretien de leurs équipements.', list: ['Installation d’établissements industriels', 'Distribution et chemins de câbles', 'Réparation et entretien d’équipements'], cta: 'Présenter mon site', href: mail('Installation électrique pour mon site industriel') },
  { img: '/img/s1.webp', code: 'Activité déclarée · NACE 43.211', title: 'Logement', text: 'Une pièce à rénover, une installation à remettre à niveau ou un rapport de contrôle à traiter : partez de votre situation réelle, pas d’un forfait.', list: ['Rénovation électrique pièce par pièce', 'Corrections après un rapport de contrôle', 'Prises, éclairage et nouveaux circuits'], cta: 'Envoyer mon rapport de contrôle', href: mail('Mon rapport de contrôle électrique') },
  { img: '/img/day.webp', code: 'Compétence enregistrée le 22/09/2023', title: 'Entreprise générale', text: 'En plus de l’électricité, Fasetech a la compétence d’entrepreneur général et a déclaré la préparation de sites (NACE 43.120). Utile pour les propriétaires et les maîtres d’œuvre.', list: ['Activités d’entrepreneur général', 'Préparation de sites', 'Lot électricité sur vos chantiers'], cta: 'Parler de mon chantier', href: TEL },
]
const sheet = $('#sheet')
const sheetPanel = $('.sheet-panel')
const sheetImg = $('.sheet-media img')
const sheetBody = $('.sheet-body')
const formSheet = $('#form-sheet')
let sheetCur = 0
let sheetTl
gsap.set(sheetPanel, { transformOrigin: '0 0', transformPerspective: 1400 })
const drift = gsap.to('.sheet-drift', { scale: 1.07, xPercent: -2, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true })
const fillSheet = (i) => {
  const s = SERVICES[i]
  sheetCur = i
  sheetImg.src = s.img
  $('.sheet-code').textContent = s.code
  $('#sheet-title').innerHTML = splitWords(s.title)
  $('.sheet-text').textContent = s.text
  $('.sheet-list').innerHTML = s.list.map((li) => `<li>${li}</li>`).join('')
  $('.sheet-cta').href = s.href
  $('.sheet-cta span').textContent = s.cta
  $('.sheet-count').textContent = `${i + 1} / ${SERVICES.length}`
  sheetBody.scrollTop = 0
}
const sheetCopyIn = () => gsap.timeline({ defaults: { ease: 'power3.out' } })
  .fromTo('#sheet-title .w > span', rise(), { yPercent: 0, duration: 0.8, stagger: 0.07 }, 0)
  .fromTo('.sheet-code, .sheet-text, .sheet-list li, .sheet-foot', { y: () => U() * 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.05 }, 0.1)
const openSheet = (i, origin) => {
  SERVICES.forEach((s) => { new Image().src = s.img })
  fillSheet(i)
  sheet.showModal()
  lenis.stop()
  drift.play()
  const a = origin.getBoundingClientRect()
  const b = sheetPanel.getBoundingClientRect()
  sheetTl = gsap.timeline()
    .fromTo(sheet, { '--bd': 0 }, { '--bd': 0.78, duration: 0.6, ease: 'none' }, 0)
    .fromTo(sheetPanel, { x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, rotationY: -22, rotationX: 14 }, { x: 0, y: 0, scaleX: 1, scaleY: 1, rotationY: 0, rotationX: 0, duration: 0.95, ease: 'power3.inOut' }, 0)
    .fromTo(sheetImg, { scale: 1.4 }, { scale: 1.1, duration: 1.4, ease: 'power3.out' }, 0.1)
    .add(sheetCopyIn(), 0.55)
}
const closeSheet = () => {
  if (!sheet.open) return
  sheetTl.eventCallback('onReverseComplete', () => {
    sheet.close()
    drift.pause()
    if (!formSheet.open) lenis.start()
  })
  sheetTl.timeScale(2.2).reverse()
}
// Same whip zoom as the day/night scene, between two services
const swapSheet = (dir) => {
  const next = (sheetCur + dir + SERVICES.length) % SERVICES.length
  gsap.timeline()
    .to(sheetImg, { scale: 1.75, filter: 'blur(16px) brightness(1.8)', duration: 0.3, ease: 'power2.in' }, 0)
    .to('.sheet-copy', { opacity: 0, y: () => U() * -40, duration: 0.25 }, 0)
    .add(() => {
      fillSheet(next)
      gsap.set('.sheet-copy', { opacity: 1, y: 0 })
      sheetCopyIn()
    })
    .fromTo(sheetImg, { scale: 0.82, filter: 'blur(16px) brightness(1.8)' }, { scale: 1.1, filter: 'blur(0px) brightness(1)', duration: 0.55, ease: 'power2.out' })
}
cards.forEach((c, i) => c.firstElementChild.addEventListener('click', (e) => openSheet(i, e.currentTarget)))
$$('.svc-more').forEach((b) => b.addEventListener('click', () => openSheet(+b.dataset.svc, b.closest('.svc').querySelector('.svc-img'))))
$('.sheet-prev').addEventListener('click', () => swapSheet(-1))
$('.sheet-next').addEventListener('click', () => swapSheet(1))
$('#sheet .sheet-close').addEventListener('click', closeSheet)
sheet.addEventListener('cancel', (e) => { e.preventDefault(); closeSheet() })
sheet.addEventListener('click', (e) => { if (e.target === sheet) closeSheet() })
sheet.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') swapSheet(-1)
  if (e.key === 'ArrowRight') swapSheet(1)
})
// Parallax: the photo and the text drift apart under the pointer or finger, and as the text scrolls
const imgX = gsap.quickTo(sheetImg, 'xPercent', { duration: 0.9, ease: 'power3' })
const imgY = gsap.quickTo(sheetImg, 'yPercent', { duration: 0.9, ease: 'power3' })
const copyX = gsap.quickTo('.sheet-copy', 'x', { duration: 0.9, ease: 'power3' })
sheetPanel.addEventListener('pointermove', (e) => {
  const r = sheetPanel.getBoundingClientRect()
  const nx = (e.clientX - r.left) / r.width - 0.5
  imgX(nx * -6)
  imgY(((e.clientY - r.top) / r.height - 0.5) * -6)
  copyX(nx * U() * 16)
}, { passive: true })
sheetBody.addEventListener('scroll', () => imgY(Math.max(sheetBody.scrollTop * -0.04, -6)), { passive: true })

// ---- FAQ: real objections, each with its own next step
const FAQ = {
  confiance: [
    { q: 'Je ne trouve pas d’avis sur Fasetech. Pourquoi vous faire confiance ?', a: 'Parce que l’essentiel se vérifie sans nous croire sur parole : numéro d’entreprise, situation et compétences professionnelles sont publics à la Banque-Carrefour des Entreprises. Fasetech débute sur le web, pas sur les chantiers : l’entreprise est active depuis 2023.', cta: 'Voir la fiche officielle', href: BCE },
    { q: 'Est-il vraiment qualifié pour toucher à mon installation ?', a: 'La compétence professionnelle en activités électrotechniques est enregistrée depuis le 20 juillet 2023, celle d’entrepreneur général depuis le 22 septembre 2023. Ce sont des dates officielles, pas un argument de vente.', cta: 'Voir les preuves', href: '#verifier' },
    { q: 'Vais-je tomber sur un centre d’appels ?', a: 'Non. Le 0494 99 06 57 est le numéro de l’entreprise enregistré à la BCE. Vous expliquez votre problème directement à Fasetech.', cta: 'Appeler Fasetech', href: TEL },
    { q: 'Travaillez-vous seul ou avec du personnel ?', a: 'Fasetech est déclarée comme employeur à l’ONSS depuis juin 2025. Demandez simplement qui viendra sur votre chantier : c’est une question normale.', cta: 'Poser la question', href: mail('Qui interviendrait sur mon chantier ?') },
  ],
  prix: [
    { q: 'Combien va coûter mon installation ?', a: 'Aucun prix sérieux sans connaître le chantier : il dépend de la surface, de l’état de l’installation existante et de l’accès aux murs et aux gaines. Donnez ces trois informations dans votre demande pour gagner du temps.', cta: 'Décrire mon chantier', href: '#demande' },
    { q: 'Vais-je payer 21 % ou 6 % de TVA ?', a: 'Pour la rénovation d’une habitation privée d’au moins 10 ans, un taux de 6 % peut s’appliquer sous conditions, notamment une facturation directe au consommateur final. Indiquez l’année de première occupation dans votre demande.', cta: 'Lire les règles du SPF Finances', href: VAT },
    { q: 'Je vends ma maison : que se passe-t-il pour l’électricité ?', a: 'L’installation est contrôlée par un organisme agréé, indépendant de l’électricien qui fait les travaux. Si vous avez déjà le rapport, envoyez-le : vous saurez quels points demandent une intervention.', cta: 'Envoyer mon rapport', href: mail('Rapport de contrôle : vente de ma maison') },
    { q: 'Mon rapport de contrôle dit « non conforme ». Et maintenant ?', a: 'Les rapports de contrôle prévoient une nouvelle visite au plus tard 18 mois après l’acte de vente, et l’acheteur peut choisir l’organisme qui la réalise. Les défauts sont à corriger avant cette visite.', cta: 'Faire chiffrer les corrections', href: mail('Corrections après un rapport non conforme') },
  ],
  chantiers: [
    { q: 'Une panne ce soir : pouvez-vous venir ?', a: 'Pas de promesse sans connaître la situation. Appelez et décrivez la panne : vous saurez tout de suite si une intervention est possible. Odeur de brûlé ou disjoncteur qui saute sans arrêt ? Coupez le circuit concerné et n’y touchez plus.', cta: 'Appeler maintenant', href: TEL },
    { q: 'Je suis maître d’œuvre : pouvez-vous prendre le lot électricité ?', a: 'L’installation électrotechnique fait partie des activités déclarées, et la compétence d’entrepreneur général est enregistrée. Envoyez les plans et le planning : c’est le plus rapide pour savoir si c’est faisable.', cta: 'Envoyer mes plans', href: mail('Lot électricité : plans et planning') },
    { q: 'Et pour un bâtiment industriel ?', a: 'L’installation électrotechnique d’établissements industriels est déclarée en tant que telle (NACE 43.212), tout comme la réparation et l’entretien d’équipements électriques.', cta: 'Présenter mon site', href: mail('Électricité pour mon bâtiment industriel') },
    { q: 'Vous venez jusque chez moi ?', a: 'Fasetech est basée à Flémalle (Awirs) et travaille en région liégeoise. Indiquez votre commune dans le formulaire pour avoir une réponse claire.', cta: 'Indiquer ma commune', href: '#demande' },
    { q: 'Puis-je avoir une facture au nom de ma société ?', a: 'Fasetech est assujettie à la TVA depuis le 1er septembre 2023 (BE 0804.170.184). Joignez le numéro de TVA de votre société à votre demande.', cta: 'Demander une offre', href: mail('Demande d’offre pour ma société') },
  ],
}
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const FADE = { opacity: 1, y: 0, duration: 0.6, ease: 'power4.out' }
const fadeFrom = () => ({ opacity: 0, y: reduceMotion ? 0 : 24 })
const faqList = $('.faq-list')
const chevron = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>'
const refreshSoon = () => setTimeout(() => ScrollTrigger.refresh(), 240)
const renderFaq = (cat) => {
  faqList.innerHTML = FAQ[cat].map((f, i) => {
    const external = f.href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''
    return `<div class="fq spot" style="--sz:260px;--int:.4"><h3><button class="fq-t" type="button" id="fq-${cat}-${i}" aria-expanded="false" aria-controls="fa-${cat}-${i}"><span>${f.q}</span><i class="fq-i">${chevron}</i></button></h3>
      <div class="fq-p" id="fa-${cat}-${i}" role="region" aria-labelledby="fq-${cat}-${i}"><div><p>${f.a}</p><a class="fq-cta" href="${f.href}"${external}>${f.cta} <span aria-hidden="true">→</span></a></div></div></div>`
  }).join('')
}
renderFaq('confiance')
gsap.fromTo('.fq', fadeFrom(), { ...FADE, stagger: 0.15, scrollTrigger: { trigger: faqList, start: 'top 85%', once: true } })
$$('[data-fade]').forEach((el) => gsap.fromTo(el, fadeFrom(), { ...FADE, delay: +el.dataset.fade, scrollTrigger: { trigger: el, start: 'top 85%', once: true } }))
gsap.fromTo('.faq-cats, .faq-card-wrap, .faq-right', fadeFrom(), { ...FADE, stagger: 0.1, scrollTrigger: { trigger: '.faq-grid', start: 'top 85%', once: true } })
$$('.faq-cat').forEach((b) => b.addEventListener('click', () => {
  $$('.faq-cat').forEach((o) => { o.classList.toggle('on', o === b); o.setAttribute('aria-pressed', o === b) })
  renderFaq(b.dataset.cat)
  gsap.fromTo('.fq', fadeFrom(), { ...FADE, stagger: 0.15 })
  refreshSoon()
}))
faqList.addEventListener('click', (e) => {
  const t = e.target.closest('.fq-t')
  if (!t) return
  const item = t.closest('.fq')
  const open = !item.classList.contains('open')
  $$('.fq').forEach((o) => { o.classList.remove('open'); o.querySelector('.fq-t').setAttribute('aria-expanded', false) })
  item.classList.toggle('open', open)
  t.setAttribute('aria-expanded', open)
  refreshSoon()
})
// Spotlight ring: follows the mouse, and orbits by itself on touch screens where there is no cursor
let faqOn = false
ScrollTrigger.create({ trigger: '.faq', start: 'top bottom', end: 'bottom top', onToggle: (s) => { faqOn = s.isActive } })
const setSpots = (x, y) => $$('.faq .spot').forEach((el) => {
  const r = el.getBoundingClientRect()
  el.style.setProperty('--spot-x', `${x - r.left}px`)
  el.style.setProperty('--spot-y', `${y - r.top}px`)
})
addEventListener('pointermove', (e) => { if (faqOn && e.pointerType === 'mouse') setSpots(e.clientX, e.clientY) }, { passive: true })
if (matchMedia('(hover: none)').matches) {
  gsap.ticker.add((t) => { if (faqOn) setSpots(innerWidth * (0.5 + 0.5 * Math.cos(t * 0.9)), innerHeight * (0.5 + 0.4 * Math.sin(t * 1.3))) })
}

// ---- Request form: posts to the form service, or opens the e-mail app until one is set
const form = $('#demande')
// A phone cannot show the form inside the pinned hero, so it opens as a sheet from every "demande" link
let formTl
if (mobile) $('.fs-panel').append(form)
const openForm = () => {
  if (!mobile) {
    lenis.scrollTo(0, { lerp: 0.1, force: true, onComplete: () => form.querySelector('input').focus({ preventScroll: true }) })
    return
  }
  formSheet.showModal()
  lenis.stop()
  formTl = gsap.timeline()
    .fromTo(formSheet, { '--bd': 0 }, { '--bd': 0.78, duration: 0.5, ease: 'none' }, 0)
    .fromTo('.fs-panel', { yPercent: 100, rotationX: 24, transformPerspective: 1200 }, { yPercent: 0, rotationX: 0, duration: 0.8, ease: 'power3.out' }, 0)
    .fromTo('.req > *', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' }, 0.2)
}
const closeForm = () => {
  if (!formSheet.open) return
  formTl.eventCallback('onReverseComplete', () => {
    formSheet.close()
    if (!sheet.open) lenis.start()
  })
  formTl.timeScale(1.6).reverse()
}
$('#form-sheet .sheet-close').addEventListener('click', closeForm)
formSheet.addEventListener('cancel', (e) => { e.preventDefault(); closeForm() })
formSheet.addEventListener('click', (e) => { if (e.target === formSheet) closeForm() })
addEventListener('click', (e) => {
  if (!e.target.closest?.('a[href="#demande"]')) return
  e.preventDefault()
  e.stopPropagation()
  closeSheet()
  openForm()
}, true)

const formMsg = $('.req-msg')
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const d = new FormData(form)
  if (d.get('_gotcha')) return
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT
  if (!endpoint) {
    const body = `${d.get('demande')}\n\n${d.get('nom')}\n${d.get('telephone')}\n${d.get('email')}\n${d.get('commune')}`
    formMsg.textContent = 'Votre application e-mail va s’ouvrir pour envoyer la demande.'
    location.href = `mailto:afarhane00@gmail.com?subject=${encodeURIComponent('Demande via le site Fasetech')}&body=${encodeURIComponent(body)}`
    return
  }
  const button = form.querySelector('button')
  button.disabled = true
  formMsg.textContent = 'Envoi en cours…'
  try {
    const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: d })
    if (!res.ok) throw new Error(res.status)
    form.reset()
    formMsg.textContent = 'Merci, votre demande a bien été envoyée.'
  } catch {
    formMsg.innerHTML = 'L’envoi a échoué. Appelez le <a href="tel:+32494990657">0494 99 06 57</a>.'
  }
  button.disabled = false
})

// ---- Mobile menu
const burger = $('.burger')
const setMenu = (open) => {
  document.body.classList.toggle('menu-open', open)
  burger.setAttribute('aria-expanded', open)
  burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu')
}
burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')))
$('#menu').addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false) })

// ---- Keyboard scrolling: presses add up, holding an arrow keeps going
const go = (d) => lenis.scrollTo(lenis.targetScroll + d, { lerp: 0.1, programmatic: false })
let arrow = 0
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false)
  if (lenis.isStopped || e.altKey || e.ctrlKey || e.metaKey || e.target.closest('input, textarea, select')) return
  const page = innerHeight * 0.85
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    arrow = e.key === 'ArrowDown' ? 1 : -1
    if (!e.repeat) go(arrow * 90)
  } else if (e.key === 'PageDown') go(page)
  else if (e.key === 'PageUp') go(-page)
  else if (e.key === ' ' && !e.target.closest('a, button')) go(e.shiftKey ? -page : page)
  else if (e.key === 'Home') lenis.scrollTo(0, { lerp: 0.1 })
  else if (e.key === 'End') lenis.scrollTo(lenis.limit, { lerp: 0.1 })
  else return
  e.preventDefault()
})
addEventListener('keyup', (e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') arrow = 0 })
addEventListener('blur', () => { arrow = 0 })
gsap.ticker.add(() => { if (arrow) go(arrow * 18) })

// ---- Boot: intro waits for the font
const boot = async () => {
  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))])
  intro()
  ScrollTrigger.refresh()
}
boot()
