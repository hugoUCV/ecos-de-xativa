# -*- coding: utf-8 -*-
"""Genera el PDF del Guion de Defensa + Preguntas del Tribunal para Ecos de Xàtiva."""

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.pdfgen import canvas as pdfcanvas
from reportlab.platypus.flowables import Flowable
from pathlib import Path

OUT = Path(r"E:\ProyectoWebTFG\Guion_Defensa_EcosXativa.pdf")

# ── PALETA ──────────────────────────────────────────────────────────────
BG_DARK   = colors.HexColor("#1A1008")
BG_MED    = colors.HexColor("#251508")
BG_CARD   = colors.HexColor("#3A2210")
CREAM     = colors.HexColor("#F5EDE0")
TAN       = colors.HexColor("#C8B49A")
MID       = colors.HexColor("#8C7A66")
GOLD      = colors.HexColor("#E8B53A")
GOLD_L    = colors.HexColor("#F2D27A")
CRIM      = colors.HexColor("#B9242C")
CRIM_L    = colors.HexColor("#E15862")
TEAL      = colors.HexColor("#5DBE9E")
WHITE     = colors.white
BLACK     = colors.black

# ── ESTILOS ──────────────────────────────────────────────────────────────
def mk_styles():
    return {
        "h_slide":    ParagraphStyle("h_slide",    fontName="Helvetica-Bold", fontSize=9,
                                     textColor=CRIM,   spaceAfter=2,  letterSpacing=2,
                                     leading=13),
        "body":       ParagraphStyle("body",        fontName="Helvetica",     fontSize=9,
                                     textColor=TAN,    spaceAfter=6,  leading=14,
                                     alignment=TA_JUSTIFY),
        "time":       ParagraphStyle("time",        fontName="Helvetica",     fontSize=7.5,
                                     textColor=MID,    spaceAfter=0,  letterSpacing=1),
        "q_label":    ParagraphStyle("q_label",     fontName="Helvetica-Bold",fontSize=7.5,
                                     textColor=GOLD,   spaceAfter=2,  letterSpacing=1.5,
                                     leading=11),
        "q_text":     ParagraphStyle("q_text",      fontName="Helvetica-BoldOblique", fontSize=9,
                                     textColor=CREAM,  spaceAfter=4,  leading=13),
        "a_text":     ParagraphStyle("a_text",      fontName="Helvetica",     fontSize=8.5,
                                     textColor=TAN,    spaceAfter=10, leading=13,
                                     leftIndent=12, alignment=TA_JUSTIFY),
        "section":    ParagraphStyle("section",     fontName="Helvetica-Bold",fontSize=12,
                                     textColor=GOLD,   spaceAfter=6,  leading=16,
                                     letterSpacing=1),
        "subsection": ParagraphStyle("subsection",  fontName="Helvetica-Bold",fontSize=9.5,
                                     textColor=CRIM_L, spaceAfter=4,  leading=13,
                                     letterSpacing=1),
        "note":       ParagraphStyle("note",        fontName="Helvetica-Oblique", fontSize=7.5,
                                     textColor=MID,    spaceAfter=4,  leading=11),
        "total":      ParagraphStyle("total",       fontName="Helvetica-Bold",fontSize=10,
                                     textColor=GOLD_L, spaceAfter=4,  leading=14,
                                     alignment=TA_CENTER),
    }

S = mk_styles()

# ── PAGE TEMPLATE ────────────────────────────────────────────────────────
class PageTpl:
    def __init__(self, doc):
        self.doc = doc

    def onPage(self, c, doc):
        W, H = A4
        # Header bar
        c.setFillColor(BG_DARK)
        c.rect(0, H - 22*mm, W, 22*mm, fill=1, stroke=0)
        # Header gold line
        c.setFillColor(GOLD)
        c.rect(0, H - 23.5*mm, W, 1.5*mm, fill=1, stroke=0)
        # Header text
        c.setFillColor(TAN)
        c.setFont("Helvetica", 7.5)
        c.drawString(18*mm, H - 14*mm, "GUION DE DEFENSA · ECOS DE XÀTIVA · UCV 2025–2026")
        c.setFillColor(GOLD)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawRightString(W - 18*mm, H - 14*mm, "NHVR Experiences")
        # Footer
        c.setFillColor(BG_DARK)
        c.rect(0, 0, W, 12*mm, fill=1, stroke=0)
        c.setFillColor(CRIM)
        c.rect(0, 12*mm, W, 0.8*mm, fill=1, stroke=0)
        c.setFillColor(MID)
        c.setFont("Helvetica", 7)
        c.drawCentredString(W/2, 5*mm, f"Página {doc.page}")

def cover_page(c, doc):
    W, H = A4
    # Full dark background
    c.setFillColor(BG_DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # Side accent bars
    c.setFillColor(CRIM)
    c.rect(0, 0, 4*mm, H, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(W - 4*mm, 0, 4*mm, H, fill=1, stroke=0)
    # Horizontal accent
    c.setFillColor(GOLD)
    c.rect(0, H * 0.5 - 1*mm, W, 2*mm, fill=1, stroke=0)
    # Title area
    c.setFillColor(CREAM)
    c.setFont("Helvetica-Bold", 42)
    c.drawCentredString(W/2, H * 0.62, "ECOS DE XÀTIVA")
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(W/2, H * 0.56, "GUION DE DEFENSA + PREGUNTAS DEL TRIBUNAL")
    # Subtitle
    c.setFillColor(TAN)
    c.setFont("Helvetica", 10)
    c.drawCentredString(W/2, H * 0.51, "TFG · Diseño y Narración de Animación y Videojuegos · UCV · 2025–2026")
    # Authors
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(W/2, H * 0.42, "Hugo Ferrer Plaza  ·  Ignacio Carrascosa Brotons")
    c.setFillColor(MID)
    c.setFont("Helvetica", 9)
    c.drawCentredString(W/2, H * 0.38, "NHVR Experiences")
    # Info boxes
    boxes = [
        ("DURACIÓN OBJETIVO", "14–15 minutos"),
        ("DIAPOSITIVAS", "11 slides"),
        ("ENFOQUE TRIBUNAL", "Programación + Modelado"),
    ]
    bw = (W - 36*mm) / len(boxes)
    bx = 18*mm
    for label, val in boxes:
        c.setFillColor(BG_MED)
        c.roundRect(bx, H * 0.25, bw - 6*mm, 22*mm, 3*mm, fill=1, stroke=0)
        c.setFillColor(CRIM)
        c.setFont("Helvetica-Bold", 6.5)
        c.drawCentredString(bx + (bw-6*mm)/2, H * 0.25 + 14*mm, label)
        c.setFillColor(CREAM)
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(bx + (bw-6*mm)/2, H * 0.25 + 6*mm, val)
        bx += bw
    # Bottom
    c.setFillColor(MID)
    c.setFont("Helvetica", 7.5)
    c.drawCentredString(W/2, 18*mm, "Documento de uso interno · No distribuir")

# ── DIVIDER ──────────────────────────────────────────────────────────────
class ColorHR(Flowable):
    def __init__(self, color, thickness=0.5, width_pct=1.0, space_before=4, space_after=4):
        super().__init__()
        self.color = color
        self.thickness = thickness
        self.width_pct = width_pct
        self.space_before = space_before
        self.space_after = space_after
        self.height = thickness + space_before + space_after

    def draw(self):
        self.canv.setFillColor(self.color)
        w = self.canv._pagesize[0] * self.width_pct
        self.canv.rect(0, self.space_after, w, self.thickness, fill=1, stroke=0)

def slide_block(title, time_str, lines):
    """Renders one guion slide block."""
    items = []
    items.append(Spacer(1, 3*mm))
    # Title row as a table
    title_data = [[
        Paragraph(title.upper(), S["h_slide"]),
        Paragraph(f"⏱ {time_str}", S["time"])
    ]]
    t = Table(title_data, colWidths=["80%", "20%"])
    t.setStyle(TableStyle([
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("ALIGN", (1,0), (1,0), "RIGHT"),
    ]))
    items.append(t)
    items.append(ColorHR(CRIM, thickness=0.5, space_before=1, space_after=3))
    for line in lines:
        if line.startswith("[") and line.endswith("]"):
            items.append(Paragraph(line, S["note"]))
        else:
            items.append(Paragraph(line, S["body"]))
    return KeepTogether(items)

def question_block(q_num, label_color, category, question, answer, tip=None):
    """Renders one tribunal question block."""
    items = []
    # Number badge + category
    cat_data = [[
        Paragraph(f"<b>{q_num:02d}</b>", ParagraphStyle("qn", fontName="Helvetica-Bold",
                  fontSize=10, textColor=label_color, leading=13)),
        Paragraph(f"[ {category} ]", ParagraphStyle("qcat", fontName="Helvetica",
                  fontSize=7, textColor=label_color, leading=10, letterSpacing=1.5))
    ]]
    t = Table(cat_data, colWidths=["10%", "90%"])
    t.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "MIDDLE")]))
    items.append(t)
    items.append(Paragraph(question, S["q_text"]))
    items.append(Paragraph(answer, S["a_text"]))
    if tip:
        items.append(Paragraph(f"<i>Consejo: {tip}</i>", S["note"]))
    items.append(ColorHR(colors.HexColor("#3A2210"), thickness=0.4))
    return KeepTogether(items)

def section_header(title, subtitle=None, color=GOLD):
    items = [
        Spacer(1, 5*mm),
        Paragraph(title, S["section"]),
    ]
    if subtitle:
        items.append(Paragraph(subtitle, S["note"]))
    items.append(ColorHR(color, thickness=1.5, space_before=2, space_after=4))
    return items

# ── CONTENIDO ────────────────────────────────────────────────────────────
def build_content():
    story = []

    # Page 1 is the cover (drawn by onFirstPage callback) — push content to page 2
    story.append(PageBreak())

    # ── SECCIÓN 1: GUION ─────────────────────────────────────────────────
    story += section_header("GUION POR DIAPOSITIVA",
                             "Tiempo total objetivo: 14–15 min · Con margen para transiciones")

    SLIDES = [
        ("01 · PORTADA", "~45 seg", [
            "Buenos días / tardes. Somos Hugo Ferrer Plaza e Ignacio Carrascosa Brotons, y este es "
            "<b>Ecos de Xàtiva</b>: un prototipo de realidad virtual standalone para Meta Quest 3 "
            "que recrea el Castillo de Xàtiva.",
            "Lo que vais a ver es un videojuego educativo real, funcional y jugable sobre el hardware "
            "real, desarrollado en nueve meses como Trabajo Fin de Grado del Grado en Diseño y "
            "Narración de Animación y Videojuegos de la UCV.",
        ]),
        ("02 · LA PROPUESTA", "~1 min 15 seg", [
            "El problema que nos propusimos resolver: los museos son pasivos. El visitante observa, "
            "nunca actúa. Hay una barrera invisible entre el patrimonio y la persona.",
            "Nuestra solución: eliminar esa barrera con VR. El visitante no visita el castillo, "
            "<b>lo habita</b>. Dispara un arco, corta con una espada medieval, activa el cañón. Aprende haciendo.",
            "Meta Quest 3 standalone —sin cables ni PC—, cuatro niveles jugables, siete mecánicas "
            "originales, nueve meses de producción y 72 fps estables.",
        ]),
        ("03 · POR QUÉ VR + LO QUE NO HICIMOS", "~1 min 30 seg", [
            "Esta experiencia no es capricho tecnológico: tiene base científica. Mel Slater (2009) "
            "demostró que el cerebro acepta el entorno virtual cuando los estímulos son coherentes. "
            "Wilson añadió que el conocimiento se consolida cuando el cuerpo participa. "
            "Gee (2003): las mecánicas de videojuego son el sistema de aprendizaje más eficiente que existe.",
            "Y las decisiones incluyen lo que NO hicimos. Sin PCVR: un museo no opera con un PC de "
            "2.000€ por unidad. Sin Lumen: no corre en Quest 3 a 72 fps. Sin Nanite: incompatible "
            "con Android. Sin IK corporal: genera posturas antinaturales que rompen la inmersión.",
        ]),
        ("04 · ANÁLISIS DAFO", "~55 seg", [
            "Más de 800 museos en España con presencia digital activa. El Castillo de Xàtiva recibe "
            "más de 90.000 visitantes al año. El mercado de VR educativa crece al 19% anual (2024–2029).",
            "La debilidad principal: el alcance natural de un TFG de dos personas. La amenaza más "
            "real: el coste actual del hardware VR para el usuario final.",
        ]),
        ("05 · MECÁNICAS ORIGINALES PARA VR", "~2 min 30 seg", [
            "[Clic en cada tarjeta — se abre modal con fotos]",
            "<b>ARCO:</b> SplineComponent que se deforma en tiempo real. Pitch variable del audio: "
            "a mayor tensión, tono más agudo. Fuerza de disparo calculada del delta de estiramiento.",
            "<b>ESPADA:</b> Lo más complejo. C++ ASwordActor, SweepTrace cada tick, SliceProceduralMesh "
            "con el plano de la trayectoria. Fragmentos físicos independientes. Límite de 8 fragmentos "
            "activos para mantener 72 fps.",
            "<b>CAÑÓN:</b> 7 fases entre 5 Blueprints. Carga pólvora → proyectil → apuntado → mecha "
            "→ disparo cámara lenta → Chaos Destruction (pared se fragmenta) → reset.",
            "[Ballesta, Objetos Museo, Audioguía, Teletransporte — resumir en 20 seg]",
            "<b>SONORIZACIÓN:</b> Música medieval original, MetaSounds procedurales, Reverb por sala, narración ElevenLabs.",
        ]),
        ("06 · DIRECCIÓN DE ARTE", "~1 min 20 seg", [
            "Referencias: World of Warcraft para escala épica y cartoon estilizado, "
            "Fable Anniversary para tono whimsical, Torchlight III para paleta vibrante.",
            "Pipeline modular: módulo base de 4 m como unidad constructiva. 13 piezas tipológicas. "
            "[Arrastrar slider para ver wireframe / clic para ampliar]",
            "Ventaja del sistema modular: construir el castillo entero con coherencia visual "
            "sin duplicar trabajo artístico.",
        ]),
        ("07 · LOS CUATRO NIVELES", "~55 seg", [
            "[Clic en cada nivel — imágenes avanzan solas]",
            "<b>Menú de Inicio:</b> bifurcación narrativa Sendero / Campo.",
            "<b>Pasillo Subterráneo:</b> embudo de tutorial. Anchura variable guía la atención.",
            "<b>Museo Principal:</b> 8m de altura, bóvedas góticas, retrato Felipe V invertido "
            "(Xàtiva lo mantiene así hoy como acto de resistencia histórica).",
            "<b>Campo de Entrenamiento:</b> exterior libre, 3 estaciones de combate.",
        ]),
        ("08 · ASSETS 3D", "~55 seg", [
            "Flujo: fotogrametría IA Tencent Huayan → retopología Maya → Substance Painter PBR "
            "→ Reduction + LOD en Unreal Engine.",
            "[Señalar los 5 modelos interactivos] Podéis rotar e inspeccionar cada arma en tiempo real.",
        ]),
        ("09 · FLUJO DE TRABAJO", "~45 seg", [
            "Sep–Nov 2025: elegimos VR sobre animación. Dic: coordinación remota desde México.",
            "Ene–Feb 2026: visita al castillo + pipeline modular completo.",
            "Mar–Abr: bootcamp intensivo — los 7 sistemas en 10 días.",
            "Mayo: optimización 72 fps. Finales mayo: esta defensa.",
        ]),
        ("10 · CONCLUSIONES", "~1 min 20 seg", [
            "1. El pipeline modular de 4 m fue la mejor decisión — multiplicó velocidad y coherencia.",
            "2. La VR requiere diseño desde cero: escala, tempo y confort son completamente distintos.",
            "3. C++ es imprescindible para mecánicas físicas complejas a 72 fps en standalone.",
            "4. Estilización > fotorrealismo: mayor impacto artístico con menor coste en Quest 3.",
            "Roadmap: multijugador asistido con guías del museo, NPC con IA conversacional, "
            "expansión a Torre del Homenaje y Sala del Trono.",
        ]),
        ("11 · CRÉDITOS", "~25 seg", [
            "Ecos de Xàtiva demuestra que el patrimonio histórico y la tecnología VR pueden convivir "
            "para crear experiencias educativas únicas.",
            "<b>El castillo no se visita. Se habita.</b>",
            "Quedamos a vuestra disposición para las preguntas. Muchas gracias.",
        ]),
    ]

    for slide_title, time_str, lines in SLIDES:
        story.append(slide_block(slide_title, time_str, lines))

    # Time total
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph("Tiempo total estimado: 12 min 40 seg – 13 min 20 seg "
                            "(margen para transiciones y respuestas breves del tribunal)", S["total"]))
    story.append(Spacer(1, 4*mm))
    story.append(ColorHR(GOLD, thickness=1.5))

    story.append(PageBreak())

    # ── SECCIÓN 2: PREGUNTAS — PROGRAMACIÓN ──────────────────────────────
    story += section_header("PREGUNTAS DEL TRIBUNAL — PROGRAMACIÓN",
                             "Área de mayor interés · Preparad respuestas técnicas precisas", CRIM)

    prog_questions = [
        (CRIM_L, "PROGRAMACIÓN · C++",
         "¿Por qué eligieron C++ para el sistema de espada y no solo Blueprints?",
         "SliceProceduralMesh necesita acceder directamente a la API de "
         "ProceduralMeshComponent, cuyo rendimiento es crítico por tick. Blueprints "
         "no garantizan la ejecución de SweepTrace cada tick a 72 fps sin introducir "
         "stutter. C++ permite inlining, acceso directo a memoria y control del GC.",
         "Usad la frase 'rendimiento crítico por tick' — demuestra que entendéis el motor"),

        (CRIM_L, "PROGRAMACIÓN · C++",
         "Explicad exactamente cómo funciona el corte de la espada a nivel de código.",
         "ASwordActor extiende AActor. En Tick(), calcula el plano de corte a partir "
         "de la posición anterior y actual de la hoja (PreviousLocation → CurrentLocation). "
         "Si el SweepTrace detecta un AProceduralCuttableActor, llama a "
         "UKismetProceduralMeshLibrary::SliceProceduralMesh() pasando ese plano. "
         "Los fragmentos reciben USimpleElementVertex con física activada y se destruyen "
         "tras un FTimerHandle de 4 segundos. Límite: 8 fragmentos activos, máx. 3 cortes "
         "simultáneos para evitar memory leaks acumulados.",
         "Mencionad el TWeakObjectPtr y el pool de geometría — demuestra gestión avanzada"),

        (CRIM_L, "PROGRAMACIÓN · FÍSICAS",
         "¿Qué es Chaos Destruction y cómo lo usaron en el cañón?",
         "Chaos Destruction es el sistema de simulación de física de fractura en tiempo "
         "real de UE5. Funciona con Geometry Collections: meshes pre-fracturadas "
         "(en nuestro caso con teselas Voronoi) que al recibir un campo de fuerza (Radial "
         "Field Impulse) se separan en cuerpos físicos independientes. La pared del "
         "castillo se prefraturó en editor; al impactar el proyectil del cañón, "
         "el Chaos Solver activa los fragmentos y los simula con física completa.",
         "Tened una imagen mental clara del proceso: pre-fractura en editor → Impulse en runtime"),

        (CRIM_L, "PROGRAMACIÓN · VR",
         "¿Cómo lograron mantener 72 fps estables en Quest 3 standalone?",
         "Múltiples pasadas de optimización: (1) lightmaps precomputados en lugar de Lumen "
         "(cero coste de iluminación en runtime), (2) LODs manuales con reducción del 50% "
         "cada nivel a partir de 2 metros, (3) occlusion culling agresivo configurado por "
         "nivel, (4) presupuesto Niagara por nivel para partículas VFX, "
         "(5) texturas a 1024px con compresión ASTC para Android, "
         "(6) Static Mesh en lugar de Nanite (incompatible con renderer Android).",
         "Citar la cifra: 40–45 fps sin optimizar → 72 fps tras lightmaps + LODs"),

        (CRIM_L, "PROGRAMACIÓN · UE5",
         "¿Qué es el Game Instance y por qué fue la solución para la audioguía?",
         "El Game Instance es un objeto singleton en UE5 que persiste durante toda la "
         "sesión de juego, incluyendo transiciones entre niveles. Almacenamos un "
         "TSet<FName> de IDs de audios ya reproducidos. Cuando un BoxTrigger dispara, "
         "consulta el Set: si el ID no existe, reproduce la narración y lo añade. "
         "Para una experiencia lineal de 15–20 minutos, esto resuelve la persistencia "
         "sin necesitar un sistema completo de Game Save.",
         "Explicad la alternativa descartada: Game Save habría requerido serialización"),

        (CRIM_L, "PROGRAMACIÓN · BLUEPRINTS",
         "¿Cómo funciona el SplineComponent del arco?",
         "La cuerda del arco es un SplineComponent con puntos de control anclados a "
         "los puntos de agarre del arco. Cuando el controlador izquierdo agarra la "
         "cuerda en el punto central, su posición world drive el tangente del SplineComponent. "
         "La distancia desde la posición de reposo natural calcula el draw_distance. "
         "La fuerza del proyectil = f(draw_distance). "
         "El pitch del UAudioComponent se mapea linealmente: 0% tensión = pitch 1.0, "
         "100% tensión = pitch 1.8.",
         "Mencionad que el pitch variable fue feedback directo de los testers"),

        (CRIM_L, "PROGRAMACIÓN · VR SICKNESS",
         "¿Cómo implementaron el teletransporte para evitar el VR sickness?",
         "El VR sickness ocurre cuando el movimiento visual no coincide con el input "
         "vestibular. Solución: CameraFade a negro en 100ms → SetWorldLocation del VRPawn "
         "al destino → Find Look At Rotation hacia el punto de interés más cercano → "
         "CameraFade desde negro en 100ms. Total: la locomoción se oculta completamente "
         "al usuario en ~200ms. El Widget 3D de preview en cada punto de destino fue "
         "un UX extra para que el usuario decida antes de comprometerse.",
         "Citad el estándar: 72 fps es el umbral médico para VR sickness (referencia Oculus)"),

        (CRIM_L, "PROGRAMACIÓN · ARQUITECTURA",
         "¿Cuántos Blueprints aproximadamente tiene el proyecto y cómo los organizaron?",
         "El cañón solo usa 5 Blueprints coordinados (máquina de estados de 7 fases). "
         "Los objetos del museo usan herencia de BP_MuseoObjectBase. En total el proyecto "
         "ronda los 30–40 Blueprint actors. La organización siguió principios de herencia "
         "para objetos de museo y composición para el cañón (Blueprints especializados "
         "coordinados por un Manager Blueprint).",
         "Mostrad que entendéis la diferencia entre herencia y composición en BPs"),

        (CRIM_L, "PROGRAMACIÓN · MEMORIA",
         "¿Cómo resolvieron el memory leak del sistema de corte?",
         "El problema inicial: SliceProceduralMesh con cortes rápidos generaba geometría "
         "nueva sin destruir la anterior, acumulando allocations que el GC de UE5 no "
         "recogía a tiempo, causando microstutters. Solución: pool de geometría (objetos "
         "pre-allocados que se reutilizan), límite hard de 8 fragmentos activos simultáneos, "
         "FTimerHandle de destrucción a 4 segundos, máximo 3 cortes simultáneos por malla.",
         "Este es el desafío más técnico — preparad la respuesta fluida, demuestra madurez"),
    ]

    for i, (color, cat, q, a, tip) in enumerate(prog_questions, 1):
        story.append(question_block(i, color, cat, q, a, tip))

    story.append(PageBreak())

    # ── SECCIÓN 3: PREGUNTAS — MODELADO ──────────────────────────────────
    story += section_header("PREGUNTAS DEL TRIBUNAL — MODELADO Y ARTE",
                             "Segunda área prioritaria · Pipeline técnico y decisiones artísticas", GOLD)

    model_questions = [
        (GOLD, "MODELADO · FOTOGRAMETRÍA",
         "¿Qué es la fotogrametría con IA de Tencent Huayan y cómo la usaron?",
         "Tencent Huayan es una plataforma de fotogrametría que usa deep learning para "
         "reconstrucción 3D. El proceso: fotografiar el objeto desde 30–100 ángulos distintos, "
         "subir a la plataforma, la IA genera malla densa con deep-learning en lugar de "
         "correlación fotogramétrica clásica (como Agisoft Metashape). Resultado: geometría "
         "más limpia en superficies de bajo contraste. El output es una malla de alta "
         "resolución que luego retopologizamos manualmente en Maya para obtener un game-ready mesh.",
         "Diferenciads Huayan (deep learning) de fotogrametría clásica (correlación de píxeles)"),

        (GOLD, "MODELADO · OPTIMIZACIÓN",
         "¿Cuántos polígonos tienen vuestros modelos? ¿Qué LODs implementaron?",
         "Las armas oscilan entre 2.000 y 5.000 triángulos en LOD0. Los módulos "
         "arquitectónicos entre 500 y 2.000 tris en LOD0. Cada LOD reduce "
         "aproximadamente un 50%: LOD1 ~1.000–2.500, LOD2 ~500–1.000. Usamos "
         "generación automática de LODs de Unreal Engine combinada con optimización "
         "manual en Maya para la geometría crítica (armas que el jugador sostiene).",
         "Recordad: en VR los modelos están muy cerca del ojo — el LOD0 es fundamental"),

        (GOLD, "MODELADO · PIPELINE MODULAR",
         "¿Por qué 4 metros como módulo base y exactamente qué piezas tiene el sistema?",
         "El módulo de 4 metros deriva de las medidas arquitectónicas reales del castillo "
         "(ancho del corredor principal). Usar una sola medida base garantiza que cualquier "
         "combinación de piezas encaje sin ajustes manuales de UVs. Las 13 piezas "
         "tipológicas son: bóveda, columna, pared lisa, pared con puerta, pared con ventana, "
         "pared con antorcha, escaleras, refuerzo de bóveda, suelo de piedra, suelo de "
         "ladrillo, pared exterior, cornisa y detalle de arco. Como piezas de LEGO: "
         "cualquier combinación genera un espacio internamente coherente.",
         "Sabed de memoria las 13 piezas — pueden preguntar cuáles son"),

        (GOLD, "MODELADO · TEXTURIZADO",
         "¿Qué es PBR y cómo lo aplicaron en Substance Painter?",
         "PBR (Physically Based Rendering) es un modelo de shading donde las propiedades "
         "del material corresponden a la física real. Los canales principales: "
         "Albedo (color base), Roughness (variación de microfacetas de la superficie), "
         "Metallic (conductividad eléctrica del material), Normal (detalle geométrico "
         "sin geometría real). En Substance Painter usamos Smart Materials y Generators "
         "para conseguir un look consistente entre las 13 piezas con atlas de texturas "
         "compartidos. Todos a 1024px para equilibrar calidad y memoria GPU en Quest 3.",
         "Explicad la diferencia entre Roughness y Metallic con un ejemplo concreto"),

        (GOLD, "MODELADO · DECISIÓN ARTÍSTICA",
         "¿Por qué eligieron estilización en lugar de fotorrealismo?",
         "Tres razones: (1) Técnica: el arte estilizado reduce la complejidad visual "
         "—menos micro-detalle en texturas significa shaders más simples y menor "
         "coste GPU en Quest 3 standalone. (2) Artística: el arte estilizado envejece "
         "mejor, da más control expresivo al equipo y tiene personalidad propia. "
         "(3) Referencias de la industria: WoW, Fable, Torchlight III demuestran que "
         "lo estilizado puede generar tanto impacto emocional como el fotorrealismo, "
         "y en muchos casos más.",
         "Argumentad la decisión con confianza — fue la elección correcta"),

        (GOLD, "MODELADO · SEAMS",
         "¿Cómo evitaron las costuras (seams) entre los módulos?",
         "Tres técnicas combinadas: (1) Atlas de texturas compartidos entre piezas "
         "para las zonas de tiling —las juntas de encuentro usan el mismo espacio UV. "
         "(2) Vertex painting en las juntas para blending de materiales de borde. "
         "(3) Random Tiling en los shaders de UE5 para romper la repetición visible "
         "en planos de gran superficie. La clave fue diseñar los UVs pensando en la "
         "junta desde el primer día del modelado.",
         "Este es un problema real de producción — demuestra experiencia práctica"),

        (GOLD, "MODELADO · PIPELINE",
         "¿Por qué Maya y no Blender? ¿Cuál es vuestra opinión sobre ambos?",
         "Elegimos Maya por la curva de aprendizaje ya trabajada durante el grado y "
         "porque es el estándar de la industria en estudios AAA. Ambos son herramientas "
         "completamente válidas para este pipeline. Blender habría funcionado igual de "
         "bien para el modelado y texturizado; la diferencia real en nuestro caso fue "
         "la familiaridad del equipo. En proyectos futuros estaríamos abiertos a Blender "
         "dado su avance en los últimos años.",
         "No seáis defensivos sobre Maya — mostrad criterio profesional maduro"),

        (GOLD, "MODELADO · ILUMINACIÓN",
         "Explicad la diferencia entre Lumen y lightmaps y por qué eligieron lightmaps.",
         "Lumen es el sistema de iluminación global dinámica de UE5: traza rayos en "
         "tiempo real cada frame para calcular rebotes de luz y oclusión ambiental. "
         "Hermoso visualmente pero consume GPU constantemente. Los lightmaps precalculan "
         "esos cálculos de iluminación una vez en build time y los guardan en texturas. "
         "En runtime: cero coste de iluminación, solo una muestra de textura. "
         "En Quest 3 standalone, Lumen llevaba la experiencia a 40–45 fps. "
         "Con lightmaps: 72 fps estables. La calidad visual final es equivalente "
         "para entornos principalmente estáticos como el nuestro.",
         "Usad el argumento: 'entorno estático = lightmaps son la solución óptima'"),
    ]

    for i, (color, cat, q, a, tip) in enumerate(model_questions, 1):
        story.append(question_block(i, color, cat, q, a, tip))

    story.append(PageBreak())

    # ── SECCIÓN 4: PREGUNTAS GENERALES / OTRAS ────────────────────────────
    story += section_header("PREGUNTAS GENERALES Y DE CONTEXTO",
                             "Proyecto, metodología, reflexión crítica", TEAL)

    general_questions = [
        (TEAL, "GENERAL · DIFICULTAD",
         "¿Cuál fue el mayor desafío técnico del proyecto?",
         "Sin duda el sistema de corte de la espada. La gestión de memoria con "
         "SliceProceduralMesh es frágil: la implementación inicial acumulaba memory leaks "
         "con cortes rápidos que el GC de UE5 no recogía a tiempo, generando microstutters "
         "visibles. La solución requirió investigar la gestión de memoria de UE5 en "
         "profundidad: pool de objetos, límites hard de fragmentos activos, timers "
         "de destrucción. Fue el problema que más horas consumió y el que más "
         "aprendizaje generó.", None),

        (TEAL, "GENERAL · VR SICKNESS",
         "¿Cómo validaron que la experiencia no causa mareo (VR sickness)?",
         "Mediante playtesting sistemático con el SSQ (Simulator Sickness Questionnaire) "
         "de forma informal con tutor, familiares y amigos. Las mitigaciones principales: "
         "locomoción por teletransporte (sin movimiento continuo artificial), "
         "72 fps sostenidos (el umbral médico documentado es 72 fps para Quest), "
         "CameraFade en transiciones, combate estacionario sin movimiento artificial "
         "del cuerpo. Ningún tester reportó malestar después de las optimizaciones.", None),

        (TEAL, "GENERAL · METODOLOGÍA",
         "¿Cómo organizaron el trabajo entre dos personas durante nueve meses?",
         "División por especialidad: Hugo responsable principal de arte 3D (Maya, "
         "Substance, pipeline modular) y programación de sistemas; Nacho responsable "
         "de programación de lógica de juego (Blueprints, estructura de niveles) y "
         "sonorización. Trabajo colaborativo vía GitHub para versioning del proyecto "
         "UE5 (con filtrado de binarios en .gitignore). El bootcamp de Marzo–Abril "
         "fue presencial intensivo para los sistemas de interacción más complejos.", None),

        (TEAL, "GENERAL · AUTOCRÍTICA",
         "Si tuvierais más tiempo, ¿qué mejoraríais primero y por qué?",
         "El playtesting formal con público real del museo. Nuestros testers fueron "
         "personas cercanas, no el público objetivo (visitantes culturales, turistas, "
         "grupos escolares). Un test con 20–30 usuarios del perfil real nos habría "
         "dado datos sobre onboarding, nivel de dificultad de las mecánicas y "
         "tiempo de juego real. Técnicamente: el modo multijugador asistido —"
         "un guía real del museo conectado remotamente— es el feature de mayor "
         "valor para la viabilidad comercial.", None),

        (TEAL, "GENERAL · VIABILIDAD",
         "¿Cómo se monetizaría o desplegaría esto en un museo real?",
         "Modelo de licencia por institución: el museo adquiere los headsets Quest 3 "
         "(aproximadamente 500€/unidad) más una licencia anual de la experiencia. "
         "El standalone elimina la necesidad de PCs dedicados, lo que reduce "
         "drásticamente el coste de operación. Alternativamente: venta en Meta Quest "
         "Store con modelo de compra única. El Ayuntamiento de Xàtiva y la Conselleria "
         "de Cultura son los interlocutores naturales para un piloto inicial. "
         "Las bases del Business Model Canvas ya están en la diapo 4.", None),
    ]

    for i, (color, cat, q, a, tip) in enumerate(general_questions, 1):
        story.append(question_block(i, color, cat, q, a, tip))

    # ── NOTAS FINALES ──────────────────────────────────────────────────────
    story.append(Spacer(1, 6*mm))
    story += section_header("NOTAS DE PRESENTACIÓN", color=MID)
    notas = [
        "Tened los Meta Quest 3 cargados y con la experiencia lista antes de entrar. "
        "Si el tribunal quiere probar in situ, hacedlo AL FINAL, después de las preguntas.",
        "Las tarjetas de mecánicas (diapo 5) son clickables: se abre un modal con fotos "
        "que avanzan solas. Cerrar con ESC o clic fuera.",
        "Los sliders de diapo 6 son ampliables con clic directo. La foto de props también.",
        "Las imágenes de niveles (diapo 7) avanzan solas al abrir cada lightbox.",
        "Si os quedáis sin tiempo: recortad diapo 3 (−30 seg) y diapo 9 (−20 seg).",
        "Si el tribunal hace preguntas durante la presentación: responded brevemente "
        "y avisad que ampliaréis en el turno de preguntas.",
    ]
    for nota in notas:
        story.append(Paragraph(f"• {nota}", S["note"]))

    return story

# ── MAIN ─────────────────────────────────────────────────────────────────
def main():
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=18*mm, rightMargin=18*mm,
        topMargin=28*mm,  bottomMargin=18*mm,
        title="Guion de Defensa - Ecos de Xàtiva",
        author="NHVR Experiences",
        subject="TFG UCV 2025-2026",
    )

    tpl = PageTpl(doc)

    # Build with cover on page 1
    def onFirstPage(c, doc):
        cover_page(c, doc)

    def onLaterPages(c, doc):
        tpl.onPage(c, doc)

    story = build_content()

    doc.build(
        story,
        onFirstPage=onFirstPage,
        onLaterPages=onLaterPages,
    )
    size_kb = OUT.stat().st_size / 1024
    print(f"PDF generado: {OUT}")
    print(f"Tamaño: {size_kb:.0f} KB")

if __name__ == "__main__":
    main()
