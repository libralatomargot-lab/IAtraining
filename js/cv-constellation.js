/* ================================================================
   CONSTELLATION INTERACTIVE — page CV
   - Nœuds principaux (postes) + sous-nœuds (rôles/casquettes)
   - Liens principaux (trait plein) + liens parent→sous-nœud (pointillés)
   - Clic nœud principal → modale avec description + réalisations datées
   - Clic sous-nœud → modale courte avec contexte du poste parent
   ================================================================ */

(function () {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const modal             = document.getElementById('node-modal');
    const modalTag          = document.getElementById('modal-tag');
    const modalTitle        = document.getElementById('modal-title');
    const modalPlace        = document.getElementById('modal-place');
    const modalDesc         = document.getElementById('modal-desc');
    const modalAchievements = document.getElementById('modal-achievements');
    const modalClose        = document.getElementById('modal-close');

    /* ----------------------------------------------------------------
       DONNÉES DU PARCOURS
       Chaque nœud principal peut avoir :
         subs[]         — sous-postes/casquettes (nœuds satellites)
         achievements[] — réalisations datées affichées dans la modale
    ---------------------------------------------------------------- */
    const nodesRaw = [
        {
            id: 'master',
            label: 'Master Neuro.',
            tag: '2015 — 2016',
            place: 'Inserm — INM, Montpellier',
            desc: "Stages longs en laboratoire avant la thèse : modélisation des cellules sensorielles auditives (M2) et étude des lymphocytes T CD8+ dans la SLA (M1). Neurosciences comportementales & computationnelles.",
            color: 'magenta', x: 0.10, y: 0.60, r: 11,
            subs: [],
            achievements: [
                { year: '2016', label: "2ᵉ prix du concours « Flash Project »" },
                { year: '2016', label: "Bourse ministérielle (MRET) — école doctorale CBS2" },
                { year: '2016', label: "Bourse d'excellence doctorale Labex EpiGenMed" },
                { year: '2019', label: "Publication PNAS — Cytotoxic CD8⁺ T lymphocytes expressing ALS-causing SOD1 mutant…" },
            ]
        },
        {
            id: 'doctorat',
            label: 'Doctorat',
            tag: 'OCT. 2016 — DÉC. 2019',
            place: 'Inserm — INM, Montpellier',
            desc: "Développement d'une IA prédictive de l'activité des cellules sensorielles auditives. Électrophysiologie patch-clamp, modélisation Matlab par descente de gradient. Publications internationales.",
            color: 'magenta', x: 0.20, y: 0.28, r: 14,
            subs: [],
            achievements: [
                { year: '2018', label: "1ᵉʳ prix « Du doctorat à l'entrepreneuriat en Occitanie » (SATT AxLR)" },
                { year: '2018', label: "1ᵉʳ prix de présentation orale — Patch Club Montpellier" },
                { year: '2019', label: "Thèse — From action potential to a receptor potential: a computational model of the Inner Hair Cell" },
                { year: '2019', label: "Publication PNAS — Cytotoxic CD8⁺ T lymphocytes expressing ALS-causing SOD1 mutant…" },
                { year: '2019', label: "Programme Pépite — Statut National Étudiant-Entrepreneur" },
            ]
        },
        {
            id: 'netri',
            label: 'Post-doc R&D',
            tag: 'FÉVR. — AOÛT 2021',
            place: 'Deeptech NETRI — Lyon',
            desc: "Post-doctorat R&D sur les Organs-on-Chips appliqués aux neurosciences : architectures neuronales complexes ex-vivo. Développement d'algorithmes d'analyse de données expérimentales en production.",
            color: 'cyan', x: 0.40, y: 0.18, r: 12,
            subs: [],
            achievements: [
                { year: '2021', label: "ISTQB® Foundation Level (CTFL)" },
                { year: '2021', label: "Publication JoVE — Co-culture de neurones glutamatergiques et de cellules de gliome pédiatrique dans des dispositifs microfluidiques. DOI : 10.3791/62748-v" },
            ]
        },
        {
            id: 'sogeti-ba',
            label: 'BA & QE Sogeti',
            tag: 'OCT. 2021 — SEPT. 2025',
            place: 'Sogeti, Capgemini — Lyon',
            desc: "Évolution de Testeur QA (tests de performance, stratégies de test, CI/CD) vers Business Analyst (analyse des besoins, spécifications fonctionnelles, lien métier/technique).",
            color: 'violet', x: 0.54, y: 0.52, r: 13,
            subs: [
                { id: 'sub-qa',  label: 'Testeur QA Perf.',              tag: 'Oct. 2021 → Sept. 2024', color: 'violet',
                  desc: "Stratégies de test, tests de charge et de performance, automatisation, CI/CD." },
                { id: 'sub-ba',  label: 'Business Analyst',              tag: 'Oct. 2024 → Sept. 2025', color: 'violet',
                  desc: "Analyse des besoins, spécifications fonctionnelles, lien métier/technique." },
                { id: 'sub-cqe', label: 'Animatrice Communauté QE Région', tag: 'Juin 2022 → …',        color: 'violet',
                  desc: "Animation et partage de pratiques au sein de la communauté Quality Engineering Rhône-Alpes." },
            ],
            achievements: [
                { year: '2022', label: "ISTQB® Performance Testing (CT-PT)" },
                { year: '2022', label: "Animatrice Communauté QE Rhône-Alpes (depuis Juin 2022)" },
                { year: '2023', label: "TMAP® Quality for Cross-Functional Teams" },
                { year: '2024', label: "ISTQB® Agile Tester (CTFL-AT)" },
            ]
        },
        {
            id: 'neuro-ag',
            label: 'Neuro-agilité',
            subtitle: 'Conseil aux entreprises',
            tag: 'AVRIL 2024 — …',
            place: 'Conseil aux entreprises · Indépendante',
            desc: "Formations sur les biais cognitifs, la prévention de l'erreur humaine, les neurosciences de l'apprentissage et de la motivation, appliquées à l'agilité et au leadership. Ateliers Problem Solving divergent/convergent.",
            color: 'magenta', x: 0.40, y: 0.76, r: 11,
            subs: [
                { id: 'sub-changement', label: 'Conduite du changement',       tag: 'Formation', color: 'magenta',
                  desc: "Mécanismes biologiques et culturels de la résistance au changement, étapes à éprouver et leviers des neurosciences pour l'accélérer." },
                { id: 'sub-biais',      label: 'Biais cognitif & erreur',      tag: 'Formation', color: 'magenta',
                  desc: "Comprendre les biais cognitifs pour s'en prémunir et les mécanismes de l'erreur individuelle et collective pour la prévenir." },
                { id: 'sub-ie',         label: 'Intelligence émotionnelle',    tag: 'Formation', color: 'magenta',
                  desc: "Intelligence émotionnelle pour améliorer les relations interpersonnelles, favoriser la collaboration et renforcer la performance des équipes." },
            ],
            achievements: [
                { year: '2018', label: "Techniques théâtrales en communication" },
                { year: '2024', label: "ISTQB® Agile Tester (CTFL-AT)" },
            ]
        },
        {
            id: 'ai-lead',
            label: 'Agentic AI Lead',
            tag: 'SEPT. 2025 — …',
            place: 'Sogeti, Capgemini — Lyon',
            desc: "Agentic AI & Quality Engineering Lead : déploiement de processus de test intégrant l'IA agentique, développement d'agents customs autonomes, optimisation des stratégies de test. Champion IA Capgemini, mentorat équipes, conduite du changement.",
            color: 'cyan', x: 0.78, y: 0.33, r: 14,
            subs: [
                { id: 'sub-animatrice-ia', label: 'Animatrice IA',  tag: 'Sept. 2025 → …', color: 'cyan',
                  desc: "Animation de la communauté IA régionale et France. Partage de bonnes pratiques IA agentique au sein des équipes Capgemini." },
                { id: 'sub-scrum',         label: 'Scrum Master',  tag: 'Avril 2024 → …', color: 'cyan',
                  desc: "Animation des rituels agiles, facilitation, amélioration continue." },
                { id: 'sub-champion',      label: 'Champion IA',   tag: 'Sept. 2025 → …', color: 'cyan',
                  desc: "Accompagnement d'équipes BA et Test pour la mise en place de solutions IA Agentique. Partage de bonnes pratiques IA au sein de la communauté régionale et France." },
                { id: 'sub-mentor',        label: 'Mentor IA',     tag: 'Sept. 2025 → …', color: 'cyan',
                  desc: "Mentorat et montée en compétence de profils juniors sur les sujets IA agentique, automatisation intelligente et stratégies de test." },
            ],
            achievements: [
                { year: '2025', label: "Accessibilité numérique by design & audit RGAA" },
                { year: '2026', label: "Emerging Leader Program (Capgemini)" },
            ]
        },
    ];

    /* --- Connexions entre nœuds principaux --- */
    const mainLinks = [
        ['master',    'doctorat'],
        ['doctorat',  'netri'],
        ['netri',     'sogeti-ba'],
        ['sogeti-ba', 'neuro-ag'],
        ['sogeti-ba', 'ai-lead'],
        ['neuro-ag',  'ai-lead'],
        ['doctorat',  'ai-lead'],
        ['netri',     'ai-lead'],
    ];

    const COLORS = {
        violet:  { stroke: '#7C3AED', glow: 'rgba(124,58,237,0.6)' },
        cyan:    { stroke: '#06B6D4', glow: 'rgba(6,182,212,0.6)'  },
        magenta: { stroke: '#EC4899', glow: 'rgba(236,72,153,0.6)' },
    };

    let width = 0, height = 0, dpr = 1;
    let nodes = [];       // liste plate de tous les nœuds (principaux + sous)
    let mainNodes = [];   // référence aux nœuds principaux seuls
    let hoveredNode = null;
    let dragging = false, dragStart = null, viewOffset = { x: 0, y: 0 };
    let animTime = 0;

    /* ---------------------------------------------------------------- RESIZE */
    function resize() {
        const rect = canvas.getBoundingClientRect();
        dpr    = window.devicePixelRatio || 1;
        width  = rect.width;
        height = rect.height;
        canvas.width  = width  * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        nodes     = [];
        mainNodes = [];

        for (const raw of nodesRaw) {
            const node = {
                ...raw,
                baseX: raw.x * width,
                baseY: raw.y * height,
                phase: Math.random() * Math.PI * 2,
                isSub: false,
            };
            nodes.push(node);
            mainNodes.push(node);

            /* Positionnement des sous-nœuds en éventail autour du parent */
            const count = (raw.subs || []).length;
            if (count === 0) continue;

            const orbitR = node.r * 3.5 + 30;
            // Direction : vers l'extérieur par rapport au centre du canvas
            const awayAngle = Math.atan2(node.baseY - height * 0.5, node.baseX - width * 0.5);
            const spread = Math.PI * 0.65; // éventail ~117°

            raw.subs.forEach((sub, i) => {
                const angle = count === 1
                    ? awayAngle
                    : awayAngle - spread / 2 + (spread / (count - 1)) * i;
                const subNode = {
                    ...sub,
                    parentId: raw.id,
                    baseX: node.baseX + Math.cos(angle) * orbitR,
                    baseY: node.baseY + Math.sin(angle) * orbitR,
                    phase: Math.random() * Math.PI * 2,
                    isSub: true,
                    r: 7,
                };
                nodes.push(subNode);
            });
        }
    }

    /* ---------------------------------------------------------------- ANIMATION */
    function getNodeXY(node) {
        const amp = node.isSub ? 3 : 6;
        return {
            x: node.baseX + Math.sin(animTime * 0.0008 + node.phase) * amp       + viewOffset.x,
            y: node.baseY + Math.cos(animTime * 0.001  + node.phase) * (amp - 1) + viewOffset.y,
        };
    }

    function findById(id) { return nodes.find(n => n.id === id); }

    /* ---------------------------------------------------------------- DRAW */
    function draw() {
        ctx.clearRect(0, 0, width, height);

        /* 1 — Liens principaux (trait plein, dégradé de couleur) */
        for (const [a, b] of mainLinks) {
            const na = findById(a), nb = findById(b);
            if (!na || !nb) continue;
            const pa = getNodeXY(na), pb = getNodeXY(nb);
            const active = hoveredNode && !hoveredNode.isSub &&
                           (hoveredNode.id === a || hoveredNode.id === b);

            const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
            grad.addColorStop(0, COLORS[na.color].stroke);
            grad.addColorStop(1, COLORS[nb.color].stroke);

            ctx.strokeStyle  = grad;
            ctx.globalAlpha  = active ? 0.85 : 0.22;
            ctx.lineWidth    = active ? 1.5  : 0.7;
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
        }

        /* 2 — Liens parent → sous-nœuds (pointillés fins) */
        for (const sub of nodes.filter(n => n.isSub)) {
            const parent = findById(sub.parentId);
            if (!parent) continue;
            const pp = getNodeXY(parent), ps = getNodeXY(sub);
            const active = hoveredNode === sub || hoveredNode === parent;

            ctx.strokeStyle = COLORS[sub.color].stroke;
            ctx.globalAlpha = active ? 0.65 : 0.18;
            ctx.lineWidth   = active ? 1.2  : 0.6;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(pp.x, pp.y);
            ctx.lineTo(ps.x, ps.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.globalAlpha = 1;

        /* 3 — Nœuds principaux */
        for (const node of mainNodes) drawMainNode(node);

        /* 4 — Sous-nœuds */
        for (const node of nodes.filter(n => n.isSub)) drawSubNode(node);

        animTime += 16;
        requestAnimationFrame(draw);
    }

    function drawMainNode(node) {
        const { x, y } = getNodeXY(node);
        const c = COLORS[node.color];
        const isHover = hoveredNode === node;
        const pulse = 1 + Math.sin(animTime * 0.003 + node.phase) * 0.08;
        const r = node.r * pulse * (isHover ? 1.25 : 1);

        // Halo
        const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
        halo.addColorStop(0, c.glow);
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle   = halo;
        ctx.globalAlpha = isHover ? 0.7 : 0.35;
        ctx.beginPath(); ctx.arc(x, y, r * 4, 0, Math.PI * 2); ctx.fill();

        // Cœur
        ctx.globalAlpha = 1;
        ctx.fillStyle   = '#0A0E27';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();

        // Bordure
        ctx.strokeStyle = c.stroke;
        ctx.lineWidth   = isHover ? 3 : 2;
        ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();

        // Label
        ctx.fillStyle     = isHover ? '#F8FAFC' : '#94A3B8';
        ctx.font          = `${isHover ? '600' : '500'} 12px 'Space Grotesk', sans-serif`;
        ctx.textAlign     = 'center';
        ctx.textBaseline  = 'top';
        ctx.fillText(node.label, x, y + r + 8);

        // Date
        ctx.fillStyle = c.stroke;
        ctx.font      = "400 10px 'JetBrains Mono', monospace";
        ctx.fillText(node.tag, x, y + r + 22);

        // Sous-titre optionnel (ex: "Conseil aux entreprises")
        if (node.subtitle) {
            ctx.fillStyle   = isHover ? '#CBD5E1' : '#475569';
            ctx.font        = "italic 9px 'Space Grotesk', sans-serif";
            ctx.fillText(node.subtitle, x, y + r + 35);
        }
    }

    function drawSubNode(node) {
        const { x, y } = getNodeXY(node);
        const c = COLORS[node.color];
        const isHover = hoveredNode === node;
        const r = node.r * (isHover ? 1.35 : 1);

        // Petit halo
        const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 3.5);
        halo.addColorStop(0, c.glow.replace('0.6', '0.25'));
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle   = halo;
        ctx.globalAlpha = isHover ? 0.5 : 0.18;
        ctx.beginPath(); ctx.arc(x, y, r * 3.5, 0, Math.PI * 2); ctx.fill();

        // Cœur
        ctx.globalAlpha = isHover ? 1 : 0.75;
        ctx.fillStyle   = '#0A0E27';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();

        // Bordure pointillée
        ctx.strokeStyle = c.stroke;
        ctx.lineWidth   = isHover ? 2 : 1.2;
        ctx.setLineDash([3, 3]);
        ctx.globalAlpha = isHover ? 1 : 0.55;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.globalAlpha  = isHover ? 1 : 0.65;
        ctx.fillStyle    = isHover ? '#F8FAFC' : '#64748B';
        ctx.font         = `${isHover ? '600' : '400'} 10px 'Space Grotesk', sans-serif`;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.label, x, y + r + 5);

        ctx.globalAlpha = 1;
    }

    /* ---------------------------------------------------------------- HIT TEST */
    function hitTest(mx, my) {
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            const { x, y } = getNodeXY(node);
            const dx = mx - x, dy = my - y;
            if (dx * dx + dy * dy <= (node.r + 6) * (node.r + 6)) return node;
        }
        return null;
    }

    /* ---------------------------------------------------------------- MODALE */
    function openModal(node) {
        const c = COLORS[node.color];

        modalTag.textContent   = node.tag;
        modalTitle.textContent = node.label;
        modalTag.style.color   = c.stroke;
        modal.querySelector('.node-modal-card').style.borderColor = c.stroke;

        if (node.isSub) {
            const parent = findById(node.parentId);
            modalPlace.textContent = parent ? `↳ ${parent.label} — ${parent.place}` : '';
            modalDesc.textContent  = node.desc;
            modalAchievements.hidden   = true;
            modalAchievements.innerHTML = '';
        } else {
            modalPlace.textContent = node.place;
            modalDesc.textContent  = node.desc;

            const items = node.achievements || [];
            if (items.length > 0) {
                modalAchievements.hidden = false;
                modalAchievements.innerHTML =
                    `<p class="modal-achievements-title">// Réalisations</p>` +
                    items.map(a =>
                        `<div class="modal-achievement-item">` +
                        `<span class="modal-achievement-year" style="color:${c.stroke}">${a.year}</span>` +
                        `<span>${a.label}</span>` +
                        `</div>`
                    ).join('');
            } else {
                modalAchievements.hidden = true;
                modalAchievements.innerHTML = '';
            }
        }

        modal.classList.add('is-open');
    }

    function closeModal() { modal.classList.remove('is-open'); }

    /* ---------------------------------------------------------------- EVENTS */
    function onMove(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;

        if (dragging && dragStart) {
            viewOffset.x = dragStart.ox + (e.clientX - dragStart.x);
            viewOffset.y = dragStart.oy + (e.clientY - dragStart.y);
            return;
        }
        hoveredNode = hitTest(mx, my);
        canvas.style.cursor = hoveredNode ? 'pointer' : 'grab';
    }

    function onDown(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        const node = hitTest(mx, my);
        if (node) { openModal(node); return; }
        dragging  = true;
        dragStart = { x: e.clientX, y: e.clientY, ox: viewOffset.x, oy: viewOffset.y };
    }

    function onUp() { dragging = false; dragStart = null; }

    /* ---------------------------------------------------------------- INIT */
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', e => {
        const t = e.touches[0];
        onDown({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: true });
    canvas.addEventListener('touchmove', e => {
        const t = e.touches[0];
        onMove({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: true });
    canvas.addEventListener('touchend', onUp);

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    draw();
})();
