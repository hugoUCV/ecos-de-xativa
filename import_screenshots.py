# -*- coding: utf-8 -*-
"""
Importa las capturas UE5 organizadas por carpeta → Imagenes/ con nombres limpios,
redimensiona a máx 1920px ancho y convierte a JPEG optimizado.
Luego actualiza los arrays SYSTEMS y LEVELS en presentacion.html.
"""
import re
import shutil
from pathlib import Path
from PIL import Image

SRC = Path(r"C:\Users\zizek\Documents\Unreal Projects\FINALTFG\Saved\Screenshots\WindowsEditor")
DST = Path(r"E:\ProyectoWebTFG\Imagenes")
HTML = Path(r"E:\ProyectoWebTFG\presentacion.html")

MAX_W  = 1920
MAX_H  = 1080
QUALITY = 85

def copy_img(src: Path, dst: Path):
    """Resize + convert to JPG."""
    dst.parent.mkdir(parents=True, exist_ok=True)
    try:
        img = Image.open(src).convert("RGB")
        img.thumbnail((MAX_W, MAX_H), Image.LANCZOS)
        img.save(dst, "JPEG", quality=QUALITY, optimize=True)
        orig_kb = src.stat().st_size // 1024
        new_kb  = dst.stat().st_size // 1024
        print(f"  OK {dst.name:40s}  {orig_kb:>5} KB -> {new_kb:>4} KB")
    except Exception as e:
        print(f"  ERR {src.name}: {e}")

def sorted_pngs(folder_name: str) -> list[Path]:
    folder = SRC / folder_name
    return sorted(folder.glob("*.png")) + sorted(folder.glob("*.PNG"))

# ── MAPA DE IMPORTACIÓN ──────────────────────────────────────────────────
#  (nombre_salida, carpeta_fuente, lista_indices_0based o None=todos, max_count)
# ─── SISTEMAS ───────────────────────────────────────────────────────────
# Arco → las 5 primeras de "Fotos Campo Entrenamiento" (zona de tiro archery)
arco_all  = sorted_pngs("Fotos Campo Entrenamiento")

IMPORT_MAP = {
    # prefix : (source_folder, file_indices_or_None, max_N)
    "sys_arco"     : ("Fotos Campo Entrenamiento", [0,1,2,3,4],    5),
    "sys_ballesta" : ("Fotos Ballesta",            None,           3),
    "sys_espada"   : ("Fotos Espada",              None,           7),
    "sys_canon"    : ("Fotos Cañon",               None,          10),
    "sys_objeto"   : ("Fotos Objeto Interactuable",None,           6),
    "sys_guia"     : ("Fotos Guia",                None,           7),
    # Teletransporte → 3 de Inicio + 2 de Museo para mostrar distintos destinos
    "sys_tp"       : ("Fotos Inicio",              [0,1,2],        3),

    # NIVELES
    "lvl_inicio"   : ("Fotos Inicio",              None,           8),
    "lvl_sub"      : ("Fotos Subterraneo",         None,           5),
    "lvl_museo"    : ("Fotos Museo Interior",      None,          16),
    # Campo: usar el segundo bloque para no repetir los que van a arco
    "lvl_campo"    : ("Fotos Campo Entrenamiento", list(range(8,22)), 14),

    # MODELADO / ARTE
    "model"        : ("Fotos Modelado",            None,          25),

    # HISTORICAS (para placeholder del S02bc si se quieren añadir)
    "hist"         : ("Fotos Historicas",          None,          12),
}

# ── EJECUCIÓN ────────────────────────────────────────────────────────────
generated: dict[str, list[str]] = {}  # prefix → [./Imagenes/xxx.jpg, ...]

for prefix, (folder, indices, max_n) in IMPORT_MAP.items():
    files = sorted_pngs(folder)
    if indices is not None:
        files = [files[i] for i in indices if i < len(files)]
    files = files[:max_n]

    print(f"\n-- {prefix} ({len(files)} imgs) --")
    paths = []
    for n, f in enumerate(files, 1):
        out_name = f"{prefix}_{n}.jpg"
        out_path = DST / out_name
        copy_img(f, out_path)
        paths.append(f"./Imagenes/{out_name}")
    generated[prefix] = paths

# ── ACTUALIZAR presentacion.html ─────────────────────────────────────────
html = HTML.read_text(encoding="utf-8")

def arr(lst):
    return "['" + "','".join(lst) + "']"

# — SYSTEMS array —
def sys_entry(id_, tag, title, tech, desc, imgs):
    return (
        f"  {id_}: {{ tag:'{tag}', title:'{title}', tech:'{tech}', "
        f"desc:'{desc}', "
        f"images:{arr(imgs)} }}"
    )

systems_new = "const SYSTEMS = {\n"
systems_new += sys_entry(
    1, "Blueprint", "Arco",
    "SplineComponent · AudioComponent · ProjectileMovement",
    "La cuerda es un SplineComponent que se deforma en tiempo real según la posición del controlador. Pitch variable: a mayor tensión, tono más agudo. La fuerza de disparo se calcula del delta de estiramiento y se aplica como impulso al proyectil.",
    generated["sys_arco"]
) + ",\n"
systems_new += sys_entry(
    2, "Blueprint", "Ballesta",
    "VR Gun Template · ProjectileMovementComponent · LineTrace",
    "Perno con trayectoria parabólica (ProjectileMovementComponent). Recarga háptica: el jugador tira de la cuerda manualmente. LineTrace detecta impacto con feedback visual y sonoro en el punto de colisión.",
    generated["sys_ballesta"]
) + ",\n"
systems_new += sys_entry(
    3, "C++", "Espada",
    "ASwordActor · AProceduralCuttableActor · SliceProceduralMesh",
    "ASwordActor (C++) registra SweepTrace en cada tick. Si detecta colisión con AProceduralCuttableActor, invoca SliceProceduralMesh con el plano de la trayectoria. Fragmentos con física independiente, timer de destrucción a 4s, máx. 3 cortes simultáneos.",
    generated["sys_espada"]
) + ",\n"
systems_new += sys_entry(
    4, "Blueprint", "Cañón",
    "5 Blueprints · Chaos Destruction · 7 Fases de activación",
    "7 fases coordinadas: carga de pólvora, inserción del proyectil, apuntado, encendido de mecha, disparo con cámara lenta, impacto con Chaos Destruction (fragmentos físicos independientes) y reset del estado completo.",
    generated["sys_canon"]
) + ",\n"
systems_new += sys_entry(
    5, "Blueprint", "Objetos Museo",
    "BP Inheritance · Emissive Material · Widget 3D",
    "BP_MuseoObjectBase define la interfaz de pickup e info display. Cada objeto hereda y sobrescribe sus datos históricos. Al acercarse el jugador se activa emissive glow en el material y aparece un Widget 3D flotante con información contextual del artefacto.",
    generated["sys_objeto"]
) + ",\n"
systems_new += sys_entry(
    6, "Blueprint", "Audioguía",
    "Game Instance · Set<Name> · BoxTrigger · UAudioComponent",
    "Game Instance mantiene un Set<Name> de audios ya reproducidos. Al entrar en un BoxTrigger, consulta si el ID fue reproducido: si no, narra y añade al Set. Persiste entre cambios de nivel sin Game Save.",
    generated["sys_guia"]
) + ",\n"
systems_new += sys_entry(
    7, "Blueprint", "Teletransporte",
    "Camera Fade · Widget 3D · Find Look At Rotation · VRPawn",
    "Diseñado para minimizar VR sickness. CameraFade negro in/out, VRPawn teleporta a destino, Find Look At Rotation orienta automáticamente al jugador hacia el punto de interés. Widget 3D en destino muestra preview del área antes de confirmar.",
    generated["sys_tp"] + generated["lvl_museo"][:2]
) + "\n"
systems_new += "};"

# — LEVELS array —
def lvl_entry(tag, name, desc, detail, imgs):
    return (
        f"  {{ tag:'{tag}', name:'{name}', "
        f"desc:'{desc}', "
        f"detail:'{detail}', "
        f"images:{arr(imgs)} }}"
    )

levels_new = "const LEVELS = [\n"
levels_new += lvl_entry(
    "Nivel 01", "Menú de Inicio",
    "Sala pequeña con dos atriles y un cuadro de controles. El narrador presenta la bifurcación entre los dos modos de la experiencia.",
    "Bifurcación: Sendero de los Reyes (experiencia completa) vs Campo de Entrenamiento (acceso directo a armas).",
    generated["lvl_inicio"]
) + ",\n"
levels_new += lvl_entry(
    "Nivel 02", "Pasillo Subterráneo",
    "Corredor lineal diseñado como embudo de tutorial. El NPC guía acompaña al jugador e introduce mecánicas gradualmente en una secuencia pautada.",
    "Técnica de funneling: anchura variable que guía la atención. Única ruta posible para garantizar aprendizaje de todas las mecánicas.",
    generated["lvl_sub"]
) + ",\n"
levels_new += lvl_entry(
    "Nivel 03", "Museo Principal",
    "8 metros de altura. Bóvedas góticas de módulos prefabricados. Incluye el retrato de Felipe V invertido y los objetos con audioguía contextual.",
    "Diseño abierto con 3 salas diferenciadas. Punto culminante de la narrativa histórica de la experiencia.",
    generated["lvl_museo"]
) + ",\n"
levels_new += lvl_entry(
    "Nivel 04", "Campo de Entrenamiento",
    "Exterior con cielo abierto. Tres estaciones de combate para practicar los 4 sistemas de armas. Accesible directamente desde el Menú de Inicio.",
    "Estaciones: arco/ballesta en zona de tiro, espada en zona cuerpo a cuerpo, cañón en artillería. Arena abierta para libertad de movimiento.",
    generated["lvl_campo"]
) + "\n"
levels_new += "];"

# Replace in HTML
html_new = re.sub(r"const LEVELS = \[[\s\S]*?\];", levels_new, html)
html_new = re.sub(r"const SYSTEMS = \{[\s\S]*?\};", systems_new, html_new)

HTML.write_text(html_new, encoding="utf-8")
print(f"\n✓ presentacion.html actualizado")

# Summary
total_files = sum(len(v) for v in generated.values())
print(f"✓ {total_files} imágenes importadas")
for p, lst in generated.items():
    print(f"  {p}: {len(lst)} imgs")
