"""
COMPARAISON DE RENDUS RÉSEAU pour le recto des cartes de visite.
Génère 3 PDF (recto seul) correspondant aux 3 combinaisons proposées :
  - synapses.pdf   : constellation dense + halos multi-couches + lignes néon
  - circuit.pdf    : maillage régulier + noeuds-hubs lumineux
  - nebuleuse.pdf  : ciel étoilé + particules dégradé radial, lignes très discrètes
"""

import os
import math
import random

from reportlab.pdfgen import canvas
from reportlab.lib.units import mm

from cartes_build import (
    INDIGO, VIOLET, CYAN, MAGENTA, WHITE, SLATE,
    CARD_W, CARD_H, BLEED, PAGE_W, PAGE_H, OX, OY,
    draw_logo_badge, add_crop_marks,
)


# ---------- helpers communs ----------

def _fill_background(c):
    c.setFillColor(INDIGO)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)


def _draw_gradient_band(c):
    grad_x = PAGE_W - 5 * mm - BLEED
    grad_w = 2.5 * mm
    n_steps = 30
    step_h = CARD_H / n_steps
    for i in range(n_steps):
        t = i / (n_steps - 1)
        r = int(0x7C + (0x06 - 0x7C) * t)
        g = int(0x3A + (0xB6 - 0x3A) * t)
        b = int(0xED + (0xD4 - 0xED) * t)
        c.setFillColorRGB(r / 255, g / 255, b / 255)
        c.rect(grad_x, OY + i * step_h, grad_w, step_h + 0.1, stroke=0, fill=1)


def _draw_text_layer(c):
    """Logo + nom + fonction + tag (identique pour les 3 variantes)."""
    draw_logo_badge(c, OX + 5 * mm, OY + CARD_H - 9 * mm, dark=True, size=4 * mm)
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(WHITE)
    c.drawString(OX + 10.5 * mm, OY + CARD_H - 7.5 * mm, "prénom.nom")

    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(WHITE)
    c.drawString(OX + 5 * mm, OY + 22 * mm, "Prénom NOM")

    c.setStrokeColor(CYAN)
    c.setLineWidth(0.5)
    c.line(OX + 5 * mm, OY + 19 * mm, OX + 13 * mm, OY + 19 * mm)

    c.setFont("Helvetica", 7.5)
    c.setFillColor(SLATE)
    c.drawString(OX + 5 * mm, OY + 15.5 * mm, "Consultante IA & Agentique")
    c.drawString(OX + 5 * mm, OY + 12.5 * mm, "PhD en Neurosciences")

    c.setFont("Courier-Bold", 5)
    c.setFillColor(CYAN)
    c.drawString(OX + 5 * mm, OY + 5 * mm, "// FORMATION  ATELIER  ACCOMPAGNEMENT")


def _text_safe_zone(x_mm, y_mm):
    """Renvoie True si (x,y) en mm est DANS une zone occupée par texte/logo/dégradé.
    On évite ces zones lors du placement des noeuds."""
    # Bandeau dégradé droit
    if x_mm > 78:
        return True
    # Zone du logo + 'prénom.nom' (haut gauche)
    if x_mm < 35 and y_mm > 44:
        return True
    # Zone du grand nom + fonction (bas gauche/milieu)
    if x_mm < 45 and 10 < y_mm < 26:
        return True
    # Zone du tag courier en bas
    if x_mm < 70 and y_mm < 8:
        return True
    return False


# ---------- VARIANTE 1 : SYNAPSES ----------
# Constellation dense (~55 noeuds), connexions par seuil de distance, halos multi-couches,
# lignes néon (épaisse faible opacité + fine forte opacité).

def network_synapses(c):
    random.seed(7)
    colors = [VIOLET, CYAN, MAGENTA]

    # Génération des noeuds en évitant les zones de texte
    nodes = []
    target = 55
    attempts = 0
    while len(nodes) < target and attempts < 2000:
        attempts += 1
        x_mm = random.uniform(2, 83)
        y_mm = random.uniform(2, 53)
        if _text_safe_zone(x_mm, y_mm):
            continue
        # Petite vérification d'espacement minimum
        too_close = False
        for nx, ny, _, _ in nodes:
            if math.hypot(nx - x_mm, ny - y_mm) < 3.2:
                too_close = True
                break
        if too_close:
            continue
        col = random.choice(colors)
        radius = random.uniform(0.25, 0.55)  # mm
        nodes.append((x_mm, y_mm, col, radius))

    abs_nodes = [(OX + n[0] * mm, OY + n[1] * mm, n[2], n[3]) for n in nodes]

    # Connexions par seuil de distance
    threshold = 11.0  # mm
    edges = []
    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            d = math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1])
            if d < threshold:
                edges.append((i, j, d))

    # Lignes néon : passe 1 = halo épais faible opacité, passe 2 = trait fin opaque
    for i, j, d in edges:
        x1, y1, _, _ = abs_nodes[i]
        x2, y2, _, _ = abs_nodes[j]
        # plus la distance est grande, plus la ligne s'estompe
        fade = max(0.0, 1.0 - d / threshold)
        line_color = CYAN if (i + j) % 2 == 0 else VIOLET
        c.setStrokeColor(line_color)
        c.setLineWidth(0.9)
        c.setStrokeAlpha(0.10 * fade)
        c.line(x1, y1, x2, y2)
        c.setLineWidth(0.25)
        c.setStrokeAlpha(0.55 * fade)
        c.line(x1, y1, x2, y2)

    c.setStrokeAlpha(1)

    # Noeuds avec halo multi-couches (effet LED)
    for x, y, color, radius in abs_nodes:
        c.setFillColor(color)
        for mult, alpha in [(3.2, 0.06), (2.2, 0.12), (1.5, 0.30), (1.0, 0.95)]:
            c.setFillAlpha(alpha)
            c.circle(x, y, radius * mm * mult, stroke=0, fill=1)
    c.setFillAlpha(1)


# ---------- VARIANTE 2 : CIRCUIT ----------
# Grille (quasi-)régulière jitterée, connexions vers voisins de grille,
# quelques noeuds-hubs gros et lumineux.

def network_circuit(c):
    random.seed(11)
    colors = [VIOLET, CYAN, MAGENTA]

    cols, rows = 9, 6
    margin_x, margin_y = 4, 4
    step_x = (CARD_W / mm - 2 * margin_x) / (cols - 1)
    step_y = (CARD_H / mm - 2 * margin_y) / (rows - 1)

    grid = {}
    for cx in range(cols):
        for ry in range(rows):
            x_mm = margin_x + cx * step_x + random.uniform(-1.0, 1.0)
            y_mm = margin_y + ry * step_y + random.uniform(-1.0, 1.0)
            if _text_safe_zone(x_mm, y_mm):
                continue
            grid[(cx, ry)] = (x_mm, y_mm, random.choice(colors))

    # Désigner ~6 hubs (noeuds plus gros et plus lumineux)
    keys = list(grid.keys())
    random.shuffle(keys)
    hubs = set(keys[:6])

    # Connexions : vers voisins droite et haut (grille)
    edges = []
    for (cx, ry), (x_mm, y_mm, _) in grid.items():
        for dx, dy in [(1, 0), (0, 1), (1, 1), (1, -1)]:
            nb = (cx + dx, ry + dy)
            if nb in grid:
                edges.append(((cx, ry), nb))

    # Lignes : trait propre cyan/violet, opacité moyenne
    for a, b in edges:
        x1, y1, _ = grid[a]
        x2, y2, _ = grid[b]
        line_color = CYAN if (a[0] + a[1] + b[0] + b[1]) % 2 == 0 else VIOLET
        c.setStrokeColor(line_color)
        c.setLineWidth(0.35)
        c.setStrokeAlpha(0.55)
        c.line(OX + x1 * mm, OY + y1 * mm, OX + x2 * mm, OY + y2 * mm)
    c.setStrokeAlpha(1)

    # Noeuds standards
    for k, (x_mm, y_mm, color) in grid.items():
        x = OX + x_mm * mm
        y = OY + y_mm * mm
        if k in hubs:
            radius = 0.9
            # Hub = halo large + coeur lumineux
            c.setFillColor(color)
            for mult, alpha in [(3.5, 0.08), (2.3, 0.18), (1.5, 0.40), (1.0, 1.0)]:
                c.setFillAlpha(alpha)
                c.circle(x, y, radius * mm * mult, stroke=0, fill=1)
            # Petit point blanc central pour effet "LED allumée"
            c.setFillColor(WHITE)
            c.setFillAlpha(0.9)
            c.circle(x, y, 0.18 * mm, stroke=0, fill=1)
        else:
            radius = 0.35
            c.setFillColor(color)
            c.setFillAlpha(0.30)
            c.circle(x, y, radius * mm * 1.8, stroke=0, fill=1)
            c.setFillAlpha(0.9)
            c.circle(x, y, radius * mm, stroke=0, fill=1)
    c.setFillAlpha(1)


# ---------- VARIANTE 3 : NÉBULEUSE ----------
# Beaucoup de petites particules (~80) avec dégradé radial simulé,
# lignes très discrètes uniquement entre noeuds proches.

def network_nebuleuse(c):
    random.seed(23)
    colors = [VIOLET, CYAN, MAGENTA]

    nodes = []
    target = 80
    attempts = 0
    while len(nodes) < target and attempts < 3000:
        attempts += 1
        x_mm = random.uniform(2, 83)
        y_mm = random.uniform(2, 53)
        if _text_safe_zone(x_mm, y_mm):
            continue
        too_close = False
        for nx, ny, _, _ in nodes:
            if math.hypot(nx - x_mm, ny - y_mm) < 2.2:
                too_close = True
                break
        if too_close:
            continue
        col = random.choice(colors)
        # Distribution : beaucoup de petites particules, quelques grosses
        if random.random() < 0.12:
            radius = random.uniform(0.55, 0.85)
        else:
            radius = random.uniform(0.18, 0.35)
        nodes.append((x_mm, y_mm, col, radius))

    abs_nodes = [(OX + n[0] * mm, OY + n[1] * mm, n[2], n[3]) for n in nodes]

    # Lignes très discrètes : seulement les paires les plus proches
    threshold = 6.5
    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            d = math.hypot(nodes[i][0] - nodes[j][0], nodes[i][1] - nodes[j][1])
            if d < threshold:
                x1, y1, _, _ = abs_nodes[i]
                x2, y2, _, _ = abs_nodes[j]
                c.setStrokeColor(CYAN)
                c.setLineWidth(0.18)
                c.setStrokeAlpha(0.18 * (1 - d / threshold))
                c.line(x1, y1, x2, y2)
    c.setStrokeAlpha(1)

    # Particules avec dégradé radial simulé (6 cercles concentriques)
    for x, y, color, radius in abs_nodes:
        c.setFillColor(color)
        layers = [
            (4.0, 0.04),
            (3.0, 0.07),
            (2.2, 0.12),
            (1.6, 0.22),
            (1.2, 0.45),
            (1.0, 0.95),
        ]
        for mult, alpha in layers:
            c.setFillAlpha(alpha)
            c.circle(x, y, radius * mm * mult, stroke=0, fill=1)
    c.setFillAlpha(1)


# ---------- assemblage ----------

VARIANTS = [
    ("synapses",   "Synapses (A2 + B1 + B3)",   network_synapses),
    ("circuit",    "Circuit (A1 + B2)",         network_circuit),
    ("nebuleuse",  "Nébuleuse (A2 + B4)",       network_nebuleuse),
]


def build_variant(filename, network_func, label):
    c = canvas.Canvas(filename, pagesize=(PAGE_W, PAGE_H))
    c.setTitle(f"Comparaison réseau — {label}")
    _fill_background(c)
    network_func(c)
    _draw_gradient_band(c)
    _draw_text_layer(c)
    add_crop_marks(c)
    c.showPage()
    c.save()


if __name__ == "__main__":
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "compare_reseaux")
    os.makedirs(out_dir, exist_ok=True)
    for slug, label, func in VARIANTS:
        path = os.path.join(out_dir, f"recto_{slug}.pdf")
        build_variant(path, func, label)
        print(f"  [OK] {path}")
    print("Termine.")
