(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const zl = v => v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' zł';

  /* toast */
  const toast = $('#toast'); let tt;
  const pokazToast = t => { toast.textContent = t; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 3200); };

  /* wysokość nagłówka -> pierwszy ekran kończy się równo z ekranem */
  const hdr = () => document.documentElement.style.setProperty('--hdr', $('.top').offsetHeight + 'px');
  hdr(); addEventListener('resize', hdr);

  /* menu mobilne */
  const burger = $('.burger'), menu = $('#menu-mob');
  const zamknijMenu = () => { menu.hidden = true; burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Otwórz menu'); document.body.style.overflow = ''; };
  burger.addEventListener('click', () => {
    const otw = menu.hidden;
    if (otw) { menu.style.setProperty('--mm-top', $('.top').getBoundingClientRect().bottom + 'px'); }
    menu.hidden = !otw; burger.setAttribute('aria-expanded', String(otw));
    burger.setAttribute('aria-label', otw ? 'Zamknij menu' : 'Otwórz menu');
    document.body.style.overflow = otw ? 'hidden' : '';
  });
  $$('a', menu).forEach(a => a.addEventListener('click', zamknijMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) zamknijMenu(); });

  /* dolny pasek po przewinięciu za przycisk z pierwszego ekranu */
  const pasek = $('#mob-pasek'), cta = $('#hero-cta');
  if (pasek && cta && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      const pokaz = !e.isIntersecting && e.boundingClientRect.top < 0;
      pasek.classList.toggle('widac', pokaz);
      pasek.setAttribute('aria-hidden', String(!pokaz));
      $$('a', pasek).forEach(a => a.tabIndex = pokaz ? 0 : -1);
    }).observe(cta);
  }

  /* wyszukiwarka z podpowiedziami (produkty i ceny "od" ze szkicu sklepu) */
  const P = [
    ['Wizytówki', 'Wizytówki i ulotki', 39.78], ['Wizytówki składane', 'Wizytówki i ulotki', 86.70], ['Wizytówki magnetyczne', 'Wizytówki i ulotki', 224.33],
    ['Ulotki', 'Wizytówki i ulotki', 46.96], ['Ulotki składane', 'Wizytówki i ulotki', 105.21], ['Zaproszenia', 'Wizytówki i ulotki', 88.68], ['Zaproszenia Premium', 'Wizytówki i ulotki', 178.01],
    ['Kartki i pocztówki', 'Wizytówki i ulotki', 42.00], ['Pocztówki Premium', 'Wizytówki i ulotki', 77.31],
    ['Druk cyfrowy A4, A3, SRA3', 'Druk cyfrowy', 3.00], ['Wydruki CAD A2-B0', 'Wielki format', 8.00], ['Druk wielkoformatowy A2-B0 i większe', 'Wielki format', 25.00],
    ['Plakaty', 'Wielki format', 81.70], ['Zdjęcia wielkoformatowe', 'Wielki format', 34.13], ['Fotoobrazy na płótnie', 'Wielki format', 95.00],
    ['Roll-up', 'Reklama', 255.00], ['Banery', 'Reklama', 180.00], ['Siatki mesh', 'Reklama', 180.00], ['Flagi reklamowe', 'Reklama', 188.04],
    ['Potykacze reklamowe', 'Reklama', 339.92], ['Nadruk na PVC i dibond', 'Reklama', 55.35], ['Ścianki reklamowe', 'Reklama', 1094.70], ['Reklama zewnętrzna', 'Reklama', 356.70],
    ['Reklama magnetyczna na samochód', 'Reklama', 75.00], ['Backlight do kasetonów', 'Reklama', 95.00], ['Fototapety', 'Wielki format', 686.59],
    ['Folie - wydruki reklamowe', 'Folie i naklejki', 75.00], ['Folie na witryny', 'Folie i naklejki', 85.00], ['Naklejki podłogowe', 'Folie i naklejki', 125.00],
    ['Naklejki wycinane po obrysie', 'Folie i naklejki', 12.86], ['Naklejki z folii ploterowej', 'Folie i naklejki', 86.41], ['Naklejki wielkoformatowe', 'Folie i naklejki', 75.00],
    ['Etykiety na wąskich rolkach', 'Folie i naklejki', null], ['Oznakowania BHP', 'Gotowe naklejki', 4.90], ['Naklejki motoryzacyjne', 'Gotowe naklejki', null],
    ['Papier firmowy', 'Druki firmowe', 71.65], ['Koperty z nadrukiem', 'Druki firmowe', 208.29], ['Teczki ofertowe', 'Druki firmowe', 238.95], ['Dyplomy i certyfikaty', 'Druki firmowe', 43.20],
    ['Karty menu', 'Druki firmowe', 34.19], ['Notesy', 'Druki firmowe', 240.32], ['Notesy samoprzylepne', 'Druki firmowe', 867.68], ['Segregatory z nadrukiem', 'Druki firmowe', 1264.30],
    ['Kalendarze', 'Kalendarze 2027', 63.28], ['Kalendarze trójdzielne', 'Kalendarze 2027', 226.11], ['Kalendarze biurkowe', 'Kalendarze 2027', 106.32], ['Kalendarze ścienne', 'Kalendarze 2027', 117.26], ['Kalendarze książkowe', 'Kalendarze 2027', 968.53],
    ['Katalogi i broszury', 'Wydawnictwa', 162.24], ['Katalogi klejone', 'Wydawnictwa', 321.09], ['Książki w twardej oprawie', 'Wydawnictwa', 1419.14], ['Bilety z perforacją', 'Wydawnictwa', 144.65],
    ['Zakładki do książek', 'Wydawnictwa', 71.98], ['Mapy składane', 'Wydawnictwa', 1292.36], ['Numery startowe', 'Wydawnictwa', 254.94],
    ['Koszulki z nadrukiem', 'Gadżety', 49.20], ['Torby z nadrukiem', 'Gadżety', 510.45],
    ['Oprawa prac dyplomowych', 'Strefa studenta', 25], ['Oprawa i laminowanie', 'Usługi', 3], ['Skanowanie i archiwizacja', 'Usługi', 0.35], ['Przegrywanie VHS', 'Usługi', 30]
  ];
  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l');
  const q = $('#q'), pod = $('#podpowiedzi'); let wyniki = [], akt = -1;
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const zaznacz = (t, f) => {
    const n = norm(t), i = n.indexOf(f);
    return i < 0 ? esc(t) : esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + f.length)) + '</mark>' + esc(t.slice(i + f.length));
  };
  const rysuj = () => {
    const f = norm(q.value.trim());
    if (!f) { pod.hidden = true; q.setAttribute('aria-expanded', 'false'); return; }
    wyniki = P.filter(p => norm(p[0] + ' ' + p[1]).includes(f)).slice(0, 7); akt = -1;
    pod.innerHTML = wyniki.length ? wyniki.map((p, i) =>
      `<a href="#kalkulator" role="option" id="po-${i}" aria-selected="false"><span class="p-n">${zaznacz(p[0], f)}<small>${esc(p[1])}</small></span><span class="p-c">${p[2] == null ? 'wycena' : 'od ' + zl(p[2])}</span></a>`).join('')
      : '<p class="p-brak">Nie mamy tego w kalkulatorach. Zadzwoń: 12 423 41 85, wycenimy.</p>';
    pod.hidden = false; q.setAttribute('aria-expanded', 'true');
  };
  q.addEventListener('input', rysuj);
  q.addEventListener('focus', rysuj);
  q.addEventListener('keydown', e => {
    const a = $$('a', pod); if (!a.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); akt = (akt + (e.key === 'ArrowDown' ? 1 : -1) + a.length) % a.length;
      a.forEach((x, i) => x.setAttribute('aria-selected', String(i === akt))); q.setAttribute('aria-activedescendant', 'po-' + akt);
    } else if (e.key === 'Escape') { pod.hidden = true; }
  });
  pod.addEventListener('click', e => { const a = e.target.closest('a'); if (a) { pod.hidden = true; pokazToast('W gotowym sklepie otworzy się karta produktu z kalkulatorem.'); } });
  document.addEventListener('click', e => { if (!e.target.closest('#szukaj')) pod.hidden = true; });
  $('#szukaj').addEventListener('submit', e => { e.preventDefault(); rysuj(); const a = $('a[aria-selected=true]', pod) || $('a', pod); if (a) a.click(); });

  /* galerie w kartach: palec, mysz, strzałki, kropki */
  const strz = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'}"/></svg>`;
  const galeria = g => {
    if (g.dataset.ok) { g.querySelectorAll('.g-kropki,.g-str').forEach(x => x.remove()); }
    g.dataset.ok = 1;
    const tor = $('.g-tor', g), imgs = $$('img', tor);
    tor.scrollLeft = 0;
    if (imgs.length < 2) return;
    const kropki = document.createElement('div'); kropki.className = 'g-kropki';
    kropki.innerHTML = imgs.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('');
    const l = document.createElement('button'), p = document.createElement('button');
    l.className = 'g-str l'; p.className = 'g-str p'; l.type = p.type = 'button';
    l.setAttribute('aria-label', 'Poprzednie zdjęcie'); p.setAttribute('aria-label', 'Następne zdjęcie');
    l.innerHTML = strz(0); p.innerHTML = strz(1);
    g.append(kropki, l, p);
    const idx = () => Math.round(tor.scrollLeft / tor.clientWidth);
    const idz = i => tor.scrollTo({ left: Math.max(0, Math.min(imgs.length - 1, i)) * tor.clientWidth, behavior: 'smooth' });
    l.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); idz(idx() - 1); });
    p.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); idz(idx() + 1); });
    tor.addEventListener('scroll', () => { const i = idx(); $$('i', kropki).forEach((k, j) => k.classList.toggle('on', i === j)); }, { passive: true });
    let x0 = null, s0 = 0, ruch = false;
    tor.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; x0 = e.clientX; s0 = tor.scrollLeft; ruch = false; tor.setPointerCapture(e.pointerId); tor.classList.add('ciagnie'); });
    tor.addEventListener('pointermove', e => { if (x0 === null) return; const dx = e.clientX - x0; if (Math.abs(dx) > 4) ruch = true; tor.scrollLeft = s0 - dx; });
    const koniec = e => { if (x0 === null) return; const dx = e.clientX - x0; tor.classList.remove('ciagnie'); x0 = null; const i = Math.round(s0 / tor.clientWidth) + (dx < -40 ? 1 : dx > 40 ? -1 : 0); idz(i); };
    tor.addEventListener('pointerup', koniec); tor.addEventListener('pointercancel', koniec);
    tor.addEventListener('click', e => { if (ruch) { e.preventDefault(); e.stopPropagation(); ruch = false; } }, true);
  };

  /* karta produktu z kalkulatorem (ceny z cennika w szkicu sklepu, 06.11.2026) */
  const D = {
    ulotki: {
      nazwa: 'Ulotki A5', opis: 'Od 10 sztuk. W sklepie wybierzesz też format A6-A3, DL i kwadrat, 13 papierów, folię i lakier UV wybiórczy.',
      param: ['A5, 148 × 210 mm', 'Kreda połysk 130 g', 'Dwustronne kolorowe 4+4', 'Bez uszlachetnienia'],
      img: [['wizytowki.webp', 'Ulotki i druki na kredzie'], ['wielki-format.webp', 'Katalogi i druki reklamowe']], start: 100,
      tryby: ['std', 'exp'],
      ceny: { 10: [46.96, 38.18, 54.01, 43.91], 25: [59.00, 47.97, 67.85, 55.17], 50: [82.46, 67.04, 94.83, 77.10], 100: [102.26, 83.14, 117.60, 95.61], 250: [138.24, 112.39, 158.98, 129.25], 500: [162.88, 132.42, 187.31, 152.28], 1000: [194.71, 158.30, 223.92, 182.05], 2500: [281.90, 229.19, 324.19, 263.57], 5000: [402.36, 327.12, 462.71, 376.19], 10000: [693.28, 563.64, 797.27, 648.19] }
    },
    wizytowki: {
      nazwa: 'Wizytówki 85 × 55 mm', opis: 'Od 100 sztuk. Dostępne też papiery ozdobne (perłowy, Kraft, z włóknami, z fakturą filcu), folia soft touch i zaokrąglone narożniki.',
      param: ['85 × 55 mm', 'Kreda mat 350 g', 'Dwustronne 4+4', 'Narożniki prostokątne'],
      img: [['wizytowki.webp', 'Wizytówki na kredzie i papierach ozdobnych']], start: 100,
      tryby: ['std', 'exp'],
      ceny: { 100: [39.78, 32.34, 47.73, 38.81], 250: [47.01, 38.22, 56.41, 45.86], 500: [56.96, 46.31, 68.35, 55.57], 1000: [95.83, 77.91, 115.00, 93.49], 2500: [207.02, 168.31, 248.43, 201.97], 5000: [278.67, 226.56, 334.40, 271.87] }
    },
    cad: {
      nazwa: 'Wydruki CAD A1', opis: 'Rysunki, plany i mapy w formatach A2-B0, na papierze CAD lub kalce, ze składaniem do A4. Cena za arkusz, od 10 szt. taniej o 10%, od 50 szt. o 20%.',
      param: ['A1, 59,4 × 84,1 cm', 'Papier CAD 90 g', 'Czarno-biały', 'Pokrycie do 7% (linie)'],
      img: [['cad.webp', 'Wydruk CAD rysunku architektonicznego'], ['hero-druk.webp', 'Drukarka wielkoformatowa']], start: 1,
      tryby: ['reka'],
      ceny: { 1: [8.00, 6.50], 2: [16.00, 13.01], 3: [24.00, 19.51], 5: [40.00, 32.52], 10: [72.00, 58.54], 20: [144.00, 117.07], 50: [320.00, 260.16] }
    },
    rollup: {
      nazwa: 'Roll-up standard 85 × 200 cm', opis: 'Aluminiowy stelaż, wydruk na blockoucie bez prześwitu, torba w komplecie. Są też kasety LUX, wersje dwustronne i szerokości do 150 cm.',
      param: ['85 × 200 cm', 'Blockout 230 g', 'Stelaż aluminiowy', 'Torba w komplecie'],
      img: [['wielki-format.webp', 'Roll-up i materiały reklamowe'], ['hero-druk.webp', 'Druk wielkoformatowy na ploterze']], start: 1,
      tryby: ['std', 'exp'],
      ceny: { 1: [255.00, 207.32, 331.50, 269.52], 2: [510.01, 414.64, 663.01, 539.03], 3: [765.01, 621.96, 994.51, 808.55], 5: [1275.02, 1036.60, 1657.52, 1347.58], 10: [2550.04, 2073.20, 3315.05, 2695.16] }
    }
  };
  const DNI = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'];
  const robocze = (d, n) => { const x = new Date(d); while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() && x.getDay() < 6) n--; } return x; };
  const dzis = new Date(); const poTerminie = dzis.getHours() >= 14 || !dzis.getDay() || dzis.getDay() === 6;
  const dataExp = poTerminie ? robocze(dzis, 1) : dzis, dataStd = robocze(dataExp, 1);
  const fmt = d => DNI[d.getDay()] + ' ' + String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0');
  const TRYB = {
    std: ['Standardowy', () => 'Wysyłka: ' + fmt(dataStd)],
    exp: ['Ekspresowy', () => 'Wysyłka: ' + fmt(dataExp) + (poTerminie ? '' : ', zamów do 14:00')],
    reka: ['Od ręki', () => 'Odbiór dziś, zamów do 16:00']
  };
  let prod = 'ulotki', ilosc = 100, tryb = 'std';
  const tor = $('#pr-tor'), gal = $('#pr-galeria');
  const przelicz = () => {
    const d = D[prod], c = d.ceny[ilosc], i = tryb === 'exp' ? 2 : 0;
    $('#pr-brutto').textContent = zl(c[i]);
    $('#pr-netto').textContent = zl(c[i + 1]);
    $('#pr-szt').textContent = zl(c[i + 1] / ilosc).replace(' zł', '') + ' zł';
    $$('#pr-naklady button').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.n === ilosc)));
    $$('#pr-terminy button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.t === tryb)));
  };
  const ustaw = p => {
    prod = p; const d = D[p]; ilosc = d.start; tryb = d.tryby[0];
    $$('.zakladki button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.p === p)));
    $('#pr-nazwa').textContent = d.nazwa; $('#pr-opis').textContent = d.opis;
    $('#pr-param').innerHTML = d.param.map(x => `<li>${x}</li>`).join('');
    $('#pr-naklady').innerHTML = Object.keys(d.ceny).map(n => `<button type="button" data-n="${n}" aria-pressed="false">${(+n).toLocaleString('pl-PL')}${+n < 1000 ? '<span class="szt"> szt.</span>' : ''}</button>`).join('');
    $('#pr-terminy').innerHTML = d.tryby.map(t => `<button type="button" data-t="${t}" aria-pressed="false"><b>${TRYB[t][0]}</b><span>${TRYB[t][1]()}</span></button>`).join('');
    tor.innerHTML = d.img.map(([s, a], i) => `<img src="img/${s}" alt="${a}" width="1200" height="800"${i ? ' loading="lazy"' : ''}>`).join('');
    galeria(gal);
    przelicz();
  };
  $$('.zakladki button').forEach(b => b.addEventListener('click', () => ustaw(b.dataset.p)));
  $('#pr-naklady').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { ilosc = +b.dataset.n; przelicz(); } });
  $('#pr-terminy').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { tryb = b.dataset.t; przelicz(); } });
  let wKoszyku = 0;
  $('#pr-dodaj').addEventListener('click', () => {
    wKoszyku++; $('#licznik').textContent = wKoszyku;
    $('#koszyk').setAttribute('aria-label', 'Koszyk, ' + wKoszyku + ' produktów');
    pokazToast('Dodano do koszyka (wizualizacja): ' + D[prod].nazwa + ', ' + ilosc.toLocaleString('pl-PL') + ' szt.');
  });
  ustaw('ulotki');
  $$('[data-galeria]').forEach(g => { if (g !== gal) galeria(g); });

  /* pole na pliki (pokazowe, nic nie wysyła) */
  const drop = $('#drop'), input = $('#pliki'), lista = $('#drop-lista');
  const pokazPliki = files => {
    if (!files.length) return;
    const n = [...files].slice(0, 10).map(f => f.name + ' (' + (f.size / 1048576).toFixed(1).replace('.', ',') + ' MB)');
    lista.textContent = n.join(', ');
  };
  input.addEventListener('change', () => pokazPliki(input.files));
  ['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('nad'); }));
  ['dragleave', 'drop'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove('nad'); }));
  drop.addEventListener('drop', e => pokazPliki(e.dataTransfer.files));
  $('#plik-form').addEventListener('submit', e => { e.preventDefault(); $('#form-info').hidden = false; });
})();
