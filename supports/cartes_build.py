"""
CARTES DE VISITE — NEURO-TECH
Format français standard 85 x 55 mm + 3mm de fond perdu (bleed)
Recto sombre / Verso clair, charte cohérente avec site et PowerPoint
"""

from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, Circle, Line
from reportlab.graphics.barcode import qr
from reportlab.graphics.barcode.qrencoder import QRCode
import os
import math

# ====================== PALETTE NEURO-TECH ======================
INDIGO = HexColor("#0A0E27")
INDIGO_LIGHT = HexColor("#0F1438")
VIOLET = HexColor("#7C3AED")
CYAN = HexColor("#06B6D4")
MAGENTA = HexColor("#EC4899")
WHITE = HexColor("#F8FAFC")
LIGHT_BG = HexColor("#FAFBFF")
SLATE = HexColor("#94A3B8")
SLATE_DARK = HexColor("#64748B")
TEXT_DARK = HexColor("#0A0E27")
BORDER = HexColor("#E2E8F0")

# ====================== DIMENSIONS ======================
# Format final visible : 85 x 55 mm
# Fond perdu (bleed) : 3 mm de chaque côté → format avec bleed : 91 x 61 mm
# Zone de sécurité : 3 mm depuis le bord visible (textes et logos)

CARD_W = 85 * mm
CARD_H = 55 * mm
BLEED = 3 * mm
PAGE_W = CARD_W + 2 * BLEED   # 91 mm
PAGE_H = CARD_H + 2 * BLEED   # 61 mm

# Origine du contenu (en tenant compte du bleed)
OX = BLEED  # offset X = 3mm
OY = BLEED  # offset Y = 3mm


def add_neural_dots(c, base_x, base_y, w, h, opacity=0.4, count=15):
    """Dessine un réseau de points connectés (motif signature)."""
    import random
    random.seed(42)  # Pour avoir toujours le même motif

    points = []
    colors = [VIOLET, CYAN, MAGENTA]
    for _ in range(count):
        px = base_x + random.uniform(0, w)
        py = base_y + random.uniform(0, h)
        col = random.choice(colors)
        points.append((px, py, col))

    # Dessiner les lignes (avec une teinte de cyan transparente)
    c.setStrokeColor(CYAN)
    c.setLineWidth(0.2)
    c.setStrokeAlpha(opacity * 0.5)
    for i in range(len(points) - 1):
        x1, y1, _ = points[i]
        x2, y2, _ = points[i + 1]
        # Distance limit pour ne pas faire de longues lignes
        dist = math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        if dist < 30 * mm:
            c.line(x1, y1, x2, y2)

    # Dessiner les points
    c.setStrokeAlpha(1)
    for px, py, col in points:
        c.setFillColor(col)
        c.setFillAlpha(opacity)
        c.circle(px, py, 0.5 * mm, stroke=0, fill=1)
    c.setFillAlpha(1)


def add_recto_network(c):
    """Dessine un réseau de noeuds connectés visibles, placement contrôlé pour le recto.
    Les noeuds sont positionnés pour ne pas gêner le texte (côté droit + zones libres)."""

    # Noeuds positionnés stratégiquement (en mm depuis OX, OY)
    # Format : (x_mm, y_mm, color, radius_mm)
    # On évite la zone du texte (gauche, milieu) et la zone du dégradé (extrême droite)
    nodes = [
        # Zone haute gauche (au-dessus du logo)
        (15, 47, VIOLET, 0.6),
        (28, 51, CYAN, 0.5),

        # Zone haute droite (au-dessus du nom, vers la droite)
        (45, 50, MAGENTA, 0.6),
        (58, 47, VIOLET, 0.5),
        (68, 52, CYAN, 0.5),
        (75, 44, VIOLET, 0.6),

        # Zone droite milieu (entre le nom et le bandeau dégradé)
        (50, 35, CYAN, 0.5),
        (62, 38, VIOLET, 0.6),
        (72, 30, MAGENTA, 0.5),
        (78, 22, CYAN, 0.6),

        # Zone droite basse
        (55, 18, VIOLET, 0.5),
        (66, 12, CYAN, 0.6),
        (74, 8, MAGENTA, 0.5),

        # Zone basse gauche (sous le tag)
        (40, 6, CYAN, 0.5),
        (52, 9, VIOLET, 0.5),
    ]

    # Connexions entre noeuds (par index dans la liste ci-dessus)
    # Choisies pour former un réseau cohérent et esthétique
    connections = [
        (0, 1), (1, 2), (2, 3), (3, 4), (4, 5),  # haut : ligne brisée
        (3, 6), (4, 7), (5, 8),                   # diagonales descendantes
        (6, 7), (7, 8), (8, 9),                   # milieu droit
        (9, 12), (8, 11), (7, 10),                # vers le bas
        (10, 11), (11, 12),                       # bas droit
        (10, 14), (14, 13),                       # vers la gauche en bas
        (2, 6), (6, 10),                          # connexions verticales internes
    ]

    # Convertir les coordonnées en absolu (avec OX, OY)
    abs_nodes = [(OX + n[0] * mm, OY + n[1] * mm, n[2], n[3]) for n in nodes]

    # 1) Dessiner d'abord les lignes (pour qu'elles passent SOUS les noeuds)
    c.setLineWidth(0.3)
    for i, j in connections:
        x1, y1, _, _ = abs_nodes[i]
        x2, y2, _, _ = abs_nodes[j]

        # Couleur de ligne : alterne cyan / violet pour la variété
        line_color = CYAN if (i + j) % 2 == 0 else VIOLET
        c.setStrokeColor(line_color)
        c.setStrokeAlpha(0.55)  # Plus visible que le précédent 0.2
        c.line(x1, y1, x2, y2)

    # 2) Dessiner les noeuds par-dessus
    c.setStrokeAlpha(1)
    for x, y, color, radius in abs_nodes:
        # Halo doux autour de chaque noeud
        c.setFillColor(color)
        c.setFillAlpha(0.25)
        c.circle(x, y, radius * mm * 1.8, stroke=0, fill=1)

        # Le noeud lui-même, plus opaque
        c.setFillAlpha(0.95)
        c.circle(x, y, radius * mm, stroke=0, fill=1)

    c.setFillAlpha(1)
    c.setStrokeAlpha(1)


def draw_logo_badge(c, x, y, dark=True, size=5 * mm):
    """Dessine le monogramme : carré dégradé violet+cyan."""
    half_w = size / 2
    # Moitié violet
    c.setFillColor(VIOLET)
    c.rect(x, y, half_w, size, stroke=0, fill=1)
    # Moitié cyan
    c.setFillColor(CYAN)
    c.rect(x + half_w, y, half_w, size, stroke=0, fill=1)


def draw_recto(c):
    """RECTO — fond indigo profond, nom et fonction."""
    # Fond indigo (avec bleed)
    c.setFillColor(INDIGO)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # Réseau de noeuds connectés (motif signature)
    add_recto_network(c)

    # Bandeau dégradé vertical sur le côté droit
    # Simulation avec 3 rectangles dégradés
    grad_x = PAGE_W - 5 * mm - BLEED
    grad_w = 2.5 * mm
    n_steps = 30
    step_h = CARD_H / n_steps
    for i in range(n_steps):
        t = i / (n_steps - 1)
        # Interpolation linéaire violet → cyan
        r = int(0x7C + (0x06 - 0x7C) * t)
        g = int(0x3A + 0xB6 - 0x3A) if False else int(0x3A + (0xB6 - 0x3A) * t)
        b = int(0xED + (0xD4 - 0xED) * t)
        c.setFillColorRGB(r / 255, g / 255, b / 255)
        c.rect(grad_x, OY + i * step_h, grad_w, step_h + 0.1, stroke=0, fill=1)

    # ----- Logo en haut à gauche -----
    draw_logo_badge(c, OX + 5 * mm, OY + CARD_H - 9 * mm, dark=True, size=4 * mm)
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(WHITE)
    c.drawString(OX + 10.5 * mm, OY + CARD_H - 7.5 * mm, "prénom.nom")

    # ----- Nom (gros, en bas) -----
    c.setFont("Helvetica-Bold", 16)
    c.setFillColor(WHITE)
    c.drawString(OX + 5 * mm, OY + 22 * mm, "Prénom NOM")

    # Trait fin cyan sous le nom
    c.setStrokeColor(CYAN)
    c.setLineWidth(0.5)
    c.line(OX + 5 * mm, OY + 19 * mm, OX + 13 * mm, OY + 19 * mm)

    # ----- Fonction -----
    c.setFont("Helvetica", 7.5)
    c.setFillColor(SLATE)
    c.drawString(OX + 5 * mm, OY + 15.5 * mm, "Consultante IA & Agentique")
    c.drawString(OX + 5 * mm, OY + 12.5 * mm, "PhD en Neurosciences")

    # ----- Tag en bas -----
    c.setFont("Courier-Bold", 5)
    c.setFillColor(CYAN)
    c.drawString(OX + 5 * mm, OY + 5 * mm, "// FORMATION  ATELIER  ACCOMPAGNEMENT")


def draw_verso(c):
    """VERSO — fond clair, coordonnées + QR code."""
    # Fond clair (avec bleed)
    c.setFillColor(LIGHT_BG)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # Bandeau dégradé en haut (violet → cyan)
    n_steps = 50
    step_w = CARD_W / n_steps
    for i in range(n_steps):
        t = i / (n_steps - 1)
        r = int(0x7C + (0x06 - 0x7C) * t)
        g = int(0x3A + (0xB6 - 0x3A) * t)
        b = int(0xED + (0xD4 - 0xED) * t)
        c.setFillColorRGB(r / 255, g / 255, b / 255)
        c.rect(OX + i * step_w, OY + CARD_H - 1.2 * mm, step_w + 0.1, 1.2 * mm, stroke=0, fill=1)

    # Réseau de points discret (filigrane très léger)
    add_neural_dots(c, OX, OY, CARD_W, CARD_H, opacity=0.12, count=10)

    # ----- Logo en haut -----
    draw_logo_badge(c, OX + 5 * mm, OY + CARD_H - 10 * mm, dark=False, size=4 * mm)
    c.setFont("Helvetica-Bold", 8)
    c.setFillColor(TEXT_DARK)
    c.drawString(OX + 10.5 * mm, OY + CARD_H - 8.5 * mm, "prénom.nom")

    # ----- Coordonnées (colonne gauche) -----
    coords = [
        ("mail", "contact@prenom-nom.fr"),
        ("phone", "+33 6 00 00 00 00"),
        ("globe", "prenom-nom.fr"),
        ("linkedin", "linkedin.com/in/prenom-nom"),
    ]

    base_y = OY + 30 * mm
    line_h = 5 * mm

    for i, (icon_type, text) in enumerate(coords):
        y = base_y - i * line_h
        cx = OX + 6 * mm
        cy = y + 1 * mm
        radius = 1.8 * mm

        # Petit cercle cyan en arrière-plan
        c.setFillColor(CYAN)
        c.setFillAlpha(0.15)
        c.circle(cx, cy, radius, stroke=0, fill=1)
        c.setFillAlpha(1)

        # Dessin de l'icône (vectoriel)
        c.setStrokeColor(CYAN)
        c.setFillColor(CYAN)
        c.setLineWidth(0.4)

        if icon_type == "mail":
            # Enveloppe
            ew, eh = 1.8 * mm, 1.2 * mm
            c.rect(cx - ew/2, cy - eh/2, ew, eh, stroke=1, fill=0)
            # Le rabat (ligne en V)
            c.line(cx - ew/2, cy + eh/2, cx, cy - eh/4)
            c.line(cx, cy - eh/4, cx + ew/2, cy + eh/2)

        elif icon_type == "phone":
            # Combiné téléphone : forme arrondie en J (simplifié par 4 lignes)
            r = 0.9 * mm
            # Côté gauche (vertical)
            c.line(cx - r, cy + r * 0.7, cx - r, cy - r * 0.3)
            # Bas (oblique vers la droite)
            c.line(cx - r, cy - r * 0.3, cx - r * 0.3, cy - r)
            # Côté droit (vertical descendant)
            c.line(cx - r * 0.3, cy - r, cx + r * 0.5, cy - r * 0.4)
            # Petit trait haut pour l'écouteur
            c.line(cx - r, cy + r * 0.7, cx - r * 0.3, cy + r)

        elif icon_type == "globe":
            # Cercle + 2 lignes croisées (méridien et parallèle)
            r = 1 * mm
            c.circle(cx, cy, r, stroke=1, fill=0)
            c.line(cx - r, cy, cx + r, cy)
            # Méridien (ellipse verticale)
            c.ellipse(cx - r/2, cy - r, cx + r/2, cy + r, stroke=1, fill=0)

        elif icon_type == "linkedin":
            # Icône LinkedIn : petit carré cyan rempli avec "in" blanc dedans
            sq = 1.8 * mm
            c.setFillColor(CYAN)
            c.rect(cx - sq/2, cy - sq/2, sq, sq, stroke=0, fill=1)
            c.setFont("Helvetica-Bold", 5)
            c.setFillColor(WHITE)
            c.drawCentredString(cx, cy - 1.4, "in")

        # Texte
        c.setFont("Helvetica", 7)
        c.setFillColor(TEXT_DARK)
        c.drawString(OX + 9.5 * mm, y, text)

    # ----- QR Code (à droite) -----
    qr_size = 22 * mm
    qr_x = OX + CARD_W - qr_size - 5 * mm
    qr_y = OY + (CARD_H - qr_size) / 2 - 2 * mm

    # Cadre subtil autour du QR
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.3)
    c.rect(qr_x - 1 * mm, qr_y - 1 * mm, qr_size + 2 * mm, qr_size + 2 * mm,
           stroke=1, fill=0)

    # Génération du QR
    qr_code = qr.QrCodeWidget("https://prenom-nom.fr")
    bounds = qr_code.getBounds()
    width_qr = bounds[2] - bounds[0]
    height_qr = bounds[3] - bounds[1]
    d = Drawing(qr_size, qr_size, transform=[qr_size / width_qr, 0, 0, qr_size / height_qr, 0, 0])
    d.add(qr_code)

    from reportlab.graphics import renderPDF
    renderPDF.draw(d, c, qr_x, qr_y)

    # Légende sous le QR
    c.setFont("Courier", 5)
    c.setFillColor(SLATE_DARK)
    c.drawCentredString(qr_x + qr_size / 2, qr_y - 2.8 * mm, "→ scanner")

    # ----- Tagline en bas -----
    c.setFont("Courier-Bold", 5)
    c.setFillColor(VIOLET)
    c.drawString(OX + 5 * mm, OY + 5 * mm, "// L'IA QUI AUGMENTE VOS ÉQUIPES")


def add_crop_marks(c):
    """Ajoute des traits de coupe aux 4 coins (utile pour l'imprimeur)."""
    c.setStrokeColor(HexColor("#888888"))
    c.setLineWidth(0.25)
    mark_len = 2 * mm
    gap = 0.5 * mm

    # 4 coins, chacun avec 2 traits (horizontal + vertical)
    corners = [
        (OX, OY),                              # bas-gauche
        (OX + CARD_W, OY),                     # bas-droit
        (OX, OY + CARD_H),                     # haut-gauche
        (OX + CARD_W, OY + CARD_H),            # haut-droit
    ]

    for cx, cy in corners:
        # Trait horizontal (gauche ou droite selon le coin)
        if cx == OX:
            c.line(cx - gap - mark_len, cy, cx - gap, cy)
        else:
            c.line(cx + gap, cy, cx + gap + mark_len, cy)
        # Trait vertical (haut ou bas)
        if cy == OY:
            c.line(cx, cy - gap - mark_len, cx, cy - gap)
        else:
            c.line(cx, cy + gap, cx, cy + gap + mark_len)


def build_card(filename, draw_func, with_crop_marks=True):
    """Génère une carte (1 face)."""
    c = canvas.Canvas(filename, pagesize=(PAGE_W, PAGE_H))
    c.setTitle("Carte de visite — Prénom NOM")
    draw_func(c)
    if with_crop_marks:
        add_crop_marks(c)
    c.showPage()
    c.save()


def build_combined_pdf(filename):
    """Génère un PDF avec recto + verso (2 pages)."""
    c = canvas.Canvas(filename, pagesize=(PAGE_W, PAGE_H))
    c.setTitle("Cartes de visite — Prénom NOM")

    # Page 1 : Recto
    draw_recto(c)
    add_crop_marks(c)
    c.showPage()

    # Page 2 : Verso
    draw_verso(c)
    add_crop_marks(c)
    c.showPage()

    c.save()


# ====================== EXÉCUTION ======================
if __name__ == "__main__":
    output_dir = "/home/claude/cartes"
    os.makedirs(output_dir, exist_ok=True)

    # Fichier combiné (recto + verso) — celui à envoyer à l'imprimeur
    build_combined_pdf(os.path.join(output_dir, "cartes_visite_neuro_tech.pdf"))

    # Fichiers séparés (utile pour modifier une face seulement)
    build_card(os.path.join(output_dir, "carte_recto.pdf"), draw_recto)
    build_card(os.path.join(output_dir, "carte_verso.pdf"), draw_verso)

    print("✓ Cartes générées")
    print(f"  - cartes_visite_neuro_tech.pdf (2 pages : recto + verso)")
    print(f"  - carte_recto.pdf")
    print(f"  - carte_verso.pdf")
