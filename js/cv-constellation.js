/* ================================================================
   CONSTELLATION INTERACTIVE — page CV
   Réseau de nœuds représentant le parcours.
   - Animation flottante douce
   - Lignes connectées entre nœuds proches + connexions définies
   - Clic sur un nœud → modale détaillée
   - Drag pour déplacer la vue, hover pour effet néon
   ================================================================ */

(function () {
    const canvas = document.getElementById('constellation-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const modal = document.getElementById('node-modal');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalPlace = document.getElementById('modal-place');
    const modalDesc = document.getElementById('modal-desc');
    const modalClose = document.getElementById('modal-close');

    /* --- Données du parcours --- */
    const nodesData = [
        { id: 'phd',      label: 'Doctorat',         tag: '2011 — 2015', place: 'Neurosciences cognitives', desc: "Recherche fondamentale sur l'apprentissage et la mémoire. Publications internationales et encadrement.", color: 'magenta', x: 0.18, y: 0.30, r: 14 },
        { id: 'master',   label: 'Master Neuro',     tag: '2008 — 2011', place: 'Sciences Cognitives',      desc: "Formation interdisciplinaire — biologie, psychologie cognitive, statistiques, modélisation.",         color: 'violet',  x: 0.10, y: 0.62, r: 11 },
        { id: 'rnd',      label: 'Ingénieure R&D',   tag: '2016 — 2020', place: 'Recherche appliquée',      desc: "Développement d'outils logiciels, pipelines analytiques, premiers pas dans le ML appliqué.",          color: 'cyan',    x: 0.40, y: 0.20, r: 12 },
        { id: 'qa',       label: 'Lead Qualité',     tag: '2020 — 2024', place: 'Tech / Industrie',         desc: "Pilotage qualité logicielle, tests automatisés, CI/CD, coaching d'équipes Scrum/Kanban.",            color: 'violet',  x: 0.55, y: 0.55, r: 13 },
        { id: 'agile',    label: 'Coach Agile',      tag: '2020 — 2024', place: 'Scrum / Kanban',           desc: "Animation d'équipes, rituels agiles, dynamique collective au croisement des neurosciences.",         color: 'cyan',    x: 0.42, y: 0.78, r: 11 },
        { id: 'ai',       label: 'IA Générative',    tag: '2024 — …',    place: 'Consultante',              desc: "Formations LLM, prompts avancés, RAG, intégration aux workflows métier.",                            color: 'cyan',    x: 0.78, y: 0.32, r: 14 },
        { id: 'agents',   label: 'IA Agentique',     tag: '2024 — …',    place: 'Consultante',              desc: "Conception d'agents autonomes, architectures multi-agents, MCP et outils agentiques.",              color: 'magenta', x: 0.88, y: 0.62, r: 14 },
        { id: 'training', label: 'Formations',       tag: 'En continu',  place: 'Présentiel / distanciel',  desc: "Catalogue complet — bureautique IA, prompts, agentique, neurosciences appliquées.",                  color: 'violet',  x: 0.68, y: 0.82, r: 12 },
    ];

    /* --- Connexions logiques entre étapes --- */
    const links = [
        ['master', 'phd'],
        ['phd', 'rnd'],
        ['rnd', 'qa'],
        ['qa', 'agile'],
        ['rnd', 'ai'],
        ['ai', 'agents'],
        ['agents', 'training'],
        ['agile', 'training'],
        ['phd', 'agents'],
        ['qa', 'ai'],
    ];

    const COLORS = {
        violet:  { stroke: '#7C3AED', glow: 'rgba(124, 58, 237, 0.6)' },
        cyan:    { stroke: '#06B6D4', glow: 'rgba(6, 182, 212, 0.6)' },
        magenta: { stroke: '#EC4899', glow: 'rgba(236, 72, 153, 0.6)' },
    };

    let width = 0, height = 0, dpr = 1;
    let nodes = [];
    let hoveredNode = null;
    let mouseX = 0, mouseY = 0;
    let dragging = false, dragStart = null, viewOffset = { x: 0, y: 0 };
    let animTime = 0;

    function resize() {
        const rect = canvas.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        width = rect.width;
        height = rect.height;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Position de chaque nœud (avec petit jitter pour effet flottant)
        nodes = nodesData.map(d => ({
            ...d,
            baseX: d.x * width,
            baseY: d.y * height,
            phase: Math.random() * Math.PI * 2,
        }));
    }

    function getNodeXY(node) {
        const wobble = Math.sin(animTime * 0.0008 + node.phase) * 6;
        const wobbleY = Math.cos(animTime * 0.001 + node.phase) * 5;
        return {
            x: node.baseX + wobble + viewOffset.x,
            y: node.baseY + wobbleY + viewOffset.y,
        };
    }

    function findNodeById(id) {
        return nodes.find(n => n.id === id);
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Lignes de connexion
        for (const [a, b] of links) {
            const na = findNodeById(a);
            const nb = findNodeById(b);
            if (!na || !nb) continue;

            const pa = getNodeXY(na);
            const pb = getNodeXY(nb);

            const isActive = hoveredNode && (hoveredNode.id === a || hoveredNode.id === b);

            // Dégradé violet→cyan pour la ligne
            const grad = ctx.createLinearGradient(pa.x, pa.y, pb.x, pb.y);
            grad.addColorStop(0, COLORS[na.color].stroke);
            grad.addColorStop(1, COLORS[nb.color].stroke);

            ctx.strokeStyle = grad;
            ctx.globalAlpha = isActive ? 0.85 : 0.25;
            ctx.lineWidth = isActive ? 1.4 : 0.7;
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.stroke();
        }

        ctx.globalAlpha = 1;

        // Nœuds
        for (const node of nodes) {
            const { x, y } = getNodeXY(node);
            const c = COLORS[node.color];
            const isHover = hoveredNode === node;
            const pulse = 1 + Math.sin(animTime * 0.003 + node.phase) * 0.08;
            const r = node.r * pulse * (isHover ? 1.25 : 1);

            // Halo
            const haloGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
            haloGrad.addColorStop(0, c.glow);
            haloGrad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = haloGrad;
            ctx.globalAlpha = isHover ? 0.7 : 0.35;
            ctx.beginPath();
            ctx.arc(x, y, r * 4, 0, Math.PI * 2);
            ctx.fill();

            // Cœur
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#0A0E27';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();

            // Bordure
            ctx.strokeStyle = c.stroke;
            ctx.lineWidth = isHover ? 3 : 2;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.stroke();

            // Label
            ctx.fillStyle = isHover ? '#F8FAFC' : '#94A3B8';
            ctx.font = `${isHover ? '600' : '500'} 12px 'Space Grotesk', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(node.label, x, y + r + 8);

            // Tag (date)
            ctx.fillStyle = c.stroke;
            ctx.font = "400 10px 'JetBrains Mono', monospace";
            ctx.fillText(node.tag, x, y + r + 24);
        }

        animTime += 16;
        requestAnimationFrame(draw);
    }

    function hitTest(mx, my) {
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            const { x, y } = getNodeXY(node);
            const dx = mx - x;
            const dy = my - y;
            if (dx * dx + dy * dy <= (node.r + 4) * (node.r + 4)) return node;
        }
        return null;
    }

    function onMove(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;

        if (dragging && dragStart) {
            viewOffset.x = dragStart.ox + (e.clientX - dragStart.x);
            viewOffset.y = dragStart.oy + (e.clientY - dragStart.y);
            return;
        }

        const node = hitTest(mouseX, mouseY);
        hoveredNode = node;
        canvas.style.cursor = node ? 'pointer' : 'grab';
    }

    function onDown(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const node = hitTest(mx, my);

        if (node) {
            openModal(node);
            return;
        }
        dragging = true;
        dragStart = { x: e.clientX, y: e.clientY, ox: viewOffset.x, oy: viewOffset.y };
    }

    function onUp() {
        dragging = false;
        dragStart = null;
    }

    function openModal(node) {
        modalTag.textContent = node.tag;
        modalTitle.textContent = node.label;
        modalPlace.textContent = node.place;
        modalDesc.textContent = node.desc;
        modalTag.style.color = COLORS[node.color].stroke;
        modal.querySelector('.node-modal-card').style.borderColor = COLORS[node.color].stroke;
        modal.classList.add('is-open');
    }

    function closeModal() {
        modal.classList.remove('is-open');
    }

    /* --- Init --- */
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        onDown({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: true });
    canvas.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        onMove({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: true });
    canvas.addEventListener('touchend', onUp);

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    draw();
})();
