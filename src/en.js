// English content for /en/, same structure as the French data in main.js
export const en = ({ TEL, mail, VAT }) => {
  const BCE = 'https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?lang=en&nummer=0804170184&actionLu=Search'
  return {
    ui: {
      opening: 'Your email app will open so you can send the request.',
      subject: 'Request from the Fasetech website',
      sending: 'Sending…',
      sent: 'Thank you, your request has been sent.',
      failed: 'Sending failed. Please call <a href="tel:+32494990657">0494 99 06 57</a>.',
      menuOpen: 'Open the menu',
      menuClose: 'Close the menu',
    },
    services: [
      { img: '/img/foot.webp', code: 'Declared activity · NACE 43.211', title: 'Electrical installation', text: 'The core of Fasetech’s work: general electrotechnical installation, with a professional competence registered since July 2023.', list: ['New installations and extensions', 'Fitting or replacing a fuse board', 'Circuits, sockets and lighting'], cta: 'Describe my project', href: '#demande' },
      { img: '/img/cta.webp', code: 'Declared activity · NACE 33.140', title: 'Repairs and maintenance', text: 'A circuit that fails, a breaker that keeps tripping, equipment to put right: we look for the cause before replacing anything.', list: ['Tracing the cause of a fault', 'Repair of electrical equipment', 'Maintenance of electrical equipment'], cta: 'Call about a fault', href: TEL },
      { img: '/img/s2.webp', code: 'Declared activity · NACE 43.212', title: 'Industry', text: 'Electrotechnical installation for industrial premises is a declared activity in its own right, as are the repair and maintenance of their equipment.', list: ['Installation for industrial premises', 'Distribution and cable trays', 'Equipment repair and maintenance'], cta: 'Tell us about my site', href: mail('Electrical installation for my industrial site') },
      { img: '/img/s1.webp', code: 'Declared activity · NACE 43.211', title: 'Homes', text: 'A room to renovate, an installation to bring up to standard or an inspection report to deal with: start from your real situation, not a package.', list: ['Room-by-room electrical renovation', 'Corrections after an inspection report', 'Sockets, lighting and new circuits'], cta: 'Send my inspection report', href: mail('My electrical inspection report') },
      { img: '/img/day.webp', code: 'Competence registered on 22/09/2023', title: 'General contracting', text: 'Beyond electrical work, Fasetech holds the general contractor competence and has declared site preparation (NACE 43.120). Useful for homeowners and project managers.', list: ['General contractor activities', 'Site preparation', 'The electrical package on your projects'], cta: 'Talk about my project', href: TEL },
    ],
    faq: {
      confiance: [
        { q: 'I can’t find any reviews of Fasetech. Why should I trust you?', a: 'Because the essentials can be checked without taking our word for it: the company number, its standing and its professional competences are public in the Crossroads Bank for Enterprises. Fasetech is new to the web, not to the job: the company has been active since 2023.', cta: 'View the official record', href: BCE },
        { q: 'Is he really qualified to touch my installation?', a: 'The professional competence in electrotechnical activities has been registered since 20 July 2023, and the general contractor competence since 22 September 2023. These are official dates, not a sales pitch.', cta: 'See the proof', href: '#verifier' },
        { q: 'Will I end up at a call centre?', a: 'No. 0494 99 06 57 is the company’s number as registered with the Crossroads Bank for Enterprises. You explain your problem directly to Fasetech.', cta: 'Call Fasetech', href: TEL },
        { q: 'Do you work alone or with staff?', a: 'Fasetech has been registered as an employer with the ONSS since June 2025. Just ask who will come to your site: it’s a normal question.', cta: 'Ask the question', href: mail('Who would work on my site?') },
      ],
      prix: [
        { q: 'How much will my installation cost?', a: 'No serious price without knowing the job: it depends on the floor area, the state of the existing installation and access to walls and conduits. Include these three details in your request to save time.', cta: 'Describe my project', href: '#demande' },
        { q: 'Will I pay 21% or 6% VAT?', a: 'For the renovation of a private home at least 10 years old, a 6% rate can apply under certain conditions, including invoicing directly to the final consumer. Mention the year of first occupation in your request.', cta: 'Read the FPS Finance rules (in French)', href: VAT },
        { q: 'I’m selling my house: what happens with the electrics?', a: 'The installation is inspected by an approved body, independent of the electrician doing the work. If you already have the report, send it: you’ll find out which points need attention.', cta: 'Send my report', href: mail('Inspection report: selling my house') },
        { q: 'My inspection report says “non-compliant”. What now?', a: 'Inspection reports provide for a new visit no later than 18 months after the deed of sale, and the buyer can choose the body that carries it out. The defects need correcting before that visit.', cta: 'Get the corrections priced', href: mail('Corrections after a non-compliant report') },
      ],
      chantiers: [
        { q: 'A fault this evening: can you come?', a: 'No promises without knowing the situation. Call and describe the fault: you’ll know straight away whether a visit is possible. Burning smell, or a breaker that keeps tripping? Switch off the affected circuit and leave it alone.', cta: 'Call now', href: TEL },
        { q: 'I’m a project manager: can you take on the electrical package?', a: 'Electrotechnical installation is among the declared activities, and the general contractor competence is registered. Send the plans and schedule: that’s the fastest way to find out if it’s feasible.', cta: 'Send my plans', href: mail('Electrical package: plans and schedule') },
        { q: 'What about an industrial building?', a: 'Electrotechnical installation for industrial premises is declared as such (NACE 43.212), as are the repair and maintenance of electrical equipment.', cta: 'Tell us about my site', href: mail('Electrical work for my industrial building') },
        { q: 'Do you come to my area?', a: 'Fasetech is based in Flémalle (Awirs) and works across the Liège region. Enter your municipality in the form to get a clear answer.', cta: 'Enter my municipality', href: '#demande' },
        { q: 'Can I get an invoice in my company’s name?', a: 'Fasetech has been VAT registered since 1 September 2023 (BE 0804.170.184). Include your company’s VAT number in your request.', cta: 'Request an offer', href: mail('Request for an offer for my company') },
      ],
    },
  }
}
