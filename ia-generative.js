/**
 * ia-generative.js — Comportements de la page IA générative & agentique
 *
 * - Accordéon (un seul panneau ouvert à la fois)
 * - Flip cards (section Vocabulaire)
 * - Barre de progression de scroll
 * - Sommaire sticky vertical (apparition après le hero, surlignage de la section ouverte)
 * - Liens du sommaire (hero + sticky) : ouvre l'accordéon cible et scroll dessus
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initAccordions();
        initFlipCards();
        initScrollProgress();
        initStickyToc();
        initTocLinks();

        // Si l'URL contient un hash, on ouvre la section correspondante
        if (window.location.hash) {
            const id = window.location.hash.slice(1);
            const target = document.getElementById(id);
            if (target && target.classList.contains('ia-section')) {
                openSection(id, false);
            }
        }
    });

    /* ════════════════════════════════════════
       ACCORDÉON
    ════════════════════════════════════════ */

    function initAccordions() {
        const sections = document.querySelectorAll('.ia-section[id]');
        sections.forEach(section => {
            const trigger = section.querySelector('.accordion-trigger');
            if (!trigger) return;

            trigger.addEventListener('click', () => {
                const isOpen = section.classList.contains('is-open');
                if (isOpen) {
                    closeSection(section);
                } else {
                    openSection(section.id, true);
                }
            });
        });
    }

    /**
     * Ouvre la section ciblée et ferme toutes les autres.
     * @param {string} id - id de la section à ouvrir
     * @param {boolean} scroll - faut-il scroller jusqu'à elle ?
     */
    function openSection(id, scroll) {
        const sections = document.querySelectorAll('.ia-section[id]');
        sections.forEach(s => {
            const trigger = s.querySelector('.accordion-trigger');
            if (s.id === id) {
                s.classList.add('is-open');
                if (trigger) trigger.setAttribute('aria-expanded', 'true');
            } else {
                s.classList.remove('is-open');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
                // Ferme aussi les flip cards des sections fermées
                s.querySelectorAll('.flip-card.is-flipped').forEach(c => c.classList.remove('is-flipped'));
            }
        });

        syncStickyToc();

        if (scroll) {
            const target = document.getElementById(id);
            if (target) {
                // Décalage pour le header fixe
                const headerOffset = 72;
                const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    }

    function closeSection(section) {
        section.classList.remove('is-open');
        const trigger = section.querySelector('.accordion-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        // Reset flip cards à l'intérieur
        section.querySelectorAll('.flip-card.is-flipped').forEach(c => c.classList.remove('is-flipped'));
        syncStickyToc();
    }


    /* ════════════════════════════════════════
       FLIP CARDS
    ════════════════════════════════════════ */

    function initFlipCards() {
        const cards = document.querySelectorAll('.flip-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('is-flipped');
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.classList.toggle('is-flipped');
                }
            });
        });
    }


    /* ════════════════════════════════════════
       BARRE DE PROGRESSION DE SCROLL
    ════════════════════════════════════════ */

    function initScrollProgress() {
        const fill = document.querySelector('.scroll-progress-fill');
        if (!fill) return;

        let ticking = false;
        const update = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
            fill.style.width = pct + '%';
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });

        update();
    }


    /* ════════════════════════════════════════
       SOMMAIRE STICKY VERTICAL
       Apparaît une fois passé le hero
    ════════════════════════════════════════ */

    function initStickyToc() {
        const stickyToc = document.querySelector('.sticky-toc');
        const hero = document.querySelector('.ia-hero');
        if (!stickyToc || !hero) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Quand le hero sort de la vue → on affiche le sommaire
                if (entry.isIntersecting) {
                    stickyToc.classList.remove('is-visible');
                } else {
                    stickyToc.classList.add('is-visible');
                }
            });
        }, { threshold: 0, rootMargin: '-80px 0px 0px 0px' });

        observer.observe(hero);
    }

    /**
     * Met à jour quel lien du sommaire est actif (= section ouverte).
     */
    function syncStickyToc() {
        const open = document.querySelector('.ia-section.is-open');
        const id = open ? open.id : null;

        document.querySelectorAll('.sticky-toc-list a, .ia-toc .toc-link').forEach(link => {
            const target = link.dataset.target;
            link.classList.toggle('is-active', target && target === id);
        });
    }


    /* ════════════════════════════════════════
       LIENS DU SOMMAIRE (hero + sticky)
       Ouvrent la section visée + scrollent
    ════════════════════════════════════════ */

    function initTocLinks() {
        document.querySelectorAll('a[data-target]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const id = link.dataset.target;
                if (!id) return;
                openSection(id, true);
                history.replaceState(null, '', '#' + id);
            });
        });
    }

})();
