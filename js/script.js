/* ================================================================
   ANIMATIONS & INTERACTIONS — NEURO-TECH
   Toggle thème, compteurs animés, fade-in scroll, menu mobile
   ================================================================ */


/* ====================== INITIALISATION DES ICÔNES LUCIDE ====================== */
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }
});


/* ====================== TOGGLE MODE CLAIR / SOMBRE ====================== */
// Le thème est stocké dans localStorage pour être conservé entre les visites.
// Au chargement initial, le script inline dans <head> a déjà appliqué
// le bon thème pour éviter le flash blanc/noir.

const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Applique le nouveau thème
        html.setAttribute('data-theme', newTheme);

        // Sauvegarde la préférence
        localStorage.setItem('theme', newTheme);
    });
}

// Suit les changements du thème système si l'utilisateur n'a pas
// encore fait de choix manuel
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
    }
});


/* ====================== COMPTEURS ANIMÉS ====================== */
function animateCounter(element) {
    const target = parseInt(element.dataset.count, 10);
    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing "ease-out" : ralentit à la fin pour un effet naturel
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(target * eased);

        element.textContent = prefix + currentValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = prefix + target + suffix;
        }
    }

    requestAnimationFrame(update);
}


/* ====================== INTERSECTION OBSERVER ====================== */
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Lance le compteur si c'est un chiffre clé
            if (entry.target.classList.contains('stat-number')) {
                animateCounter(entry.target);
            }

            // Révèle l'élément avec fade-in
            if (entry.target.classList.contains('fade-in')) {
                entry.target.classList.add('is-visible');
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number').forEach(el => {
    observer.observe(el);
});

document.querySelectorAll('.module, .section-title, .section-intro, .cta-title').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});


/* ====================== APPARITION ÉCHELONNÉE DES MODULES ====================== */
document.querySelectorAll('.module').forEach((module, index) => {
    module.style.transitionDelay = `${index * 100}ms`;
});


/* ====================== MENU MOBILE ====================== */
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('is-open');
        const isOpen = nav.classList.contains('is-open');

        // Bascule l'icône menu/croix
        menuToggle.innerHTML = isOpen
            ? '<i data-lucide="x"></i>'
            : '<i data-lucide="menu"></i>';
        lucide.createIcons();
    });

    // Ferme le menu quand on clique sur un lien
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            menuToggle.innerHTML = '<i data-lucide="menu"></i>';
            lucide.createIcons();
        });
    });
}


/* ====================== DROPDOWN NAV (Expertises) ====================== */
const navDropdowns = document.querySelectorAll('.nav-dropdown');

navDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        // Ferme les autres dropdowns
        navDropdowns.forEach(other => {
            if (other !== dropdown) {
                other.classList.remove('is-open');
                const t = other.querySelector('.nav-dropdown-toggle');
                if (t) t.setAttribute('aria-expanded', 'false');
            }
        });
    });
});

// Ferme tous les dropdowns en cliquant ailleurs ou avec Échap
document.addEventListener('click', (e) => {
    navDropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('is-open');
            const t = dropdown.querySelector('.nav-dropdown-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navDropdowns.forEach(dropdown => {
            dropdown.classList.remove('is-open');
            const t = dropdown.querySelector('.nav-dropdown-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
        });
    }
});


/* ====================== EFFET PARALLAXE LÉGER SUR LE HERO ====================== */
const heroBg = document.querySelector('.hero-bg');

if (heroBg) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }, { passive: true });
}


/* ====================== SCROLL DOUX SUR LES ANCRES INTERNES ====================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


/* ====================== RÉSEAU NEURONAL ANIMÉ (CANVAS) ====================== */
(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const NODE_COUNT = 75;
    const MAX_DIST = 170;
    const PULSE_COUNT = 10;
    const COLORS = ['#7C3AED', '#06B6D4', '#EC4899'];

    let nodes = [], edges = [], pulses = [];
    let w, h;

    function resize() {
        w = canvas.offsetWidth;
        h = canvas.offsetHeight;
        canvas.width = w;
        canvas.height = h;
        build();
    }

    function build() {
        nodes = Array.from({ length: NODE_COUNT }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.2 + 1.2,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            neighbors: []
        }));

        edges = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MAX_DIST) {
                    edges.push({ a: i, b: j, alpha: 0.18 * (1 - dist / MAX_DIST) + 0.04 });
                    nodes[i].neighbors.push(j);
                    nodes[j].neighbors.push(i);
                }
            }
        }

        pulses = Array.from({ length: PULSE_COUNT }, () => spawnPulse());
    }

    function spawnPulse() {
        const candidates = nodes.filter(n => n.neighbors.length > 0);
        if (!candidates.length) return null;
        const from = nodes.indexOf(candidates[Math.floor(Math.random() * candidates.length)]);
        const to = nodes[from].neighbors[Math.floor(Math.random() * nodes[from].neighbors.length)];
        return {
            from, to,
            progress: Math.random(),
            speed: Math.random() * 0.007 + 0.004,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: Math.random() * 1.5 + 2
        };
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        // Arêtes
        edges.forEach(e => {
            const a = nodes[e.a], b = nodes[e.b];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(100, 80, 220, ${e.alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
        });

        // Noeuds
        nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = n.color + 'CC';
            ctx.fill();
        });

        // Pulses lumineux
        pulses.forEach(p => {
            if (!p) return;
            const a = nodes[p.from], b = nodes[p.to];
            const x = a.x + (b.x - a.x) * p.progress;
            const y = a.y + (b.y - a.y) * p.progress;

            // Halo diffus
            const halo = ctx.createRadialGradient(x, y, 0, x, y, p.size * 5);
            halo.addColorStop(0, p.color + 'CC');
            halo.addColorStop(0.5, p.color + '44');
            halo.addColorStop(1, p.color + '00');
            ctx.beginPath();
            ctx.arc(x, y, p.size * 5, 0, Math.PI * 2);
            ctx.fillStyle = halo;
            ctx.fill();

            // Point blanc central
            ctx.beginPath();
            ctx.arc(x, y, p.size * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
        });
    }

    function update() {
        pulses.forEach((p, i) => {
            if (!p) { pulses[i] = spawnPulse(); return; }
            p.progress += p.speed;
            if (p.progress >= 1) {
                const arrived = nodes[p.to];
                const opts = arrived.neighbors.filter(n => n !== p.from);
                const next = (opts.length ? opts : arrived.neighbors)[
                    Math.floor(Math.random() * (opts.length || arrived.neighbors.length))
                ];
                p.from = p.to;
                p.to = next;
                p.progress = 0;
            }
        });
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    loop();
})();
