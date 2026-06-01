/* ============================================================
   ECOS DE XÀTIVA — Chatbot local "Pregúntale a NH"
   ------------------------------------------------------------
   100% cliente, sin API externa. Catálogo FAQ con matching
   por similitud TF-IDF + tokenización con stemming castellano
   simplificado. Inyecta su propio CSS y HTML al cargar.
============================================================ */
(function() {
  'use strict';

  /* ──────────────────────────────────────────────────────────
     CATÁLOGO DE PREGUNTAS Y RESPUESTAS
     ────────────────────────────────────────────────────────── */
  const FAQ = [
    /* ===== GENERAL / SINOPSIS ===== */
    {
      tags: ["proyecto", "ecos", "xativa", "que es", "que trata", "sinopsis", "resumen", "sobre"],
      q: "¿Qué es Ecos de Xàtiva?",
      a: "Ecos de Xàtiva es una experiencia interactiva en realidad virtual desarrollada como Trabajo Fin de Grado en la UCV. Recrea el Castillo de Xàtiva con siete sistemas de interacción originales —espada con corte procedural, arco con tensado físico, ballesta, cañón con destrucción Chaos, audioguía narrada, palancas y atriles— para Meta Quest 3 en modo standalone."
    },
    {
      tags: ["objetivo", "proposito", "para que sirve", "por que", "finalidad"],
      q: "¿Cuál es el objetivo del proyecto?",
      a: "Transformar la visita museística de un acto contemplativo en una experiencia participativa. En lugar de mirar las piezas tras una vitrina, el usuario puede usarlas: tensar el arco, encender la mecha del cañón, examinar la daga nazarí. El objetivo es demostrar que la VR puede ser una herramienta real para el patrimonio cultural, no un gadget."
    },
    {
      tags: ["genero", "tipo", "categoria", "clasificacion"],
      q: "¿Qué tipo de juego es?",
      a: "No es exactamente un juego: es una experiencia inmersiva educativa con mecánicas de videojuego. Se sitúa entre el museo virtual, el simulador histórico y la experiencia narrativa interactiva. Tiene cinco niveles diferenciados que el usuario recorre en 15-20 minutos."
    },
    {
      tags: ["original", "originalidad", "diferente", "innovador", "que aporta", "valor"],
      q: "¿Qué tiene de original el proyecto?",
      a: "Mientras la mayoría de experiencias VR culturales son recorridos pasivos con puntos de información, Ecos de Xàtiva incorpora físicas reales, corte procedural de mallas en C++, destrucción Chaos, audio espacial diegético y un sistema de audioguía con persistencia entre niveles. No es una visita enriquecida con VR; es una experiencia de videojuego construida desde el rigor histórico."
    },
    {
      tags: ["historia", "narrativa", "guion", "trama", "historia del juego"],
      q: "¿Tiene historia / narrativa?",
      a: "La narrativa es ambiental e instruccional, no cinematográfica clásica. No hay personajes con arco dramático, conflicto y resolución. El usuario es siempre el protagonista activo. Hay dos voces que estructuran la información: un narrador no diegético (audioguía institucional) y un guía NPC diegético (instrucciones de uso)."
    },
    {
      tags: ["duracion", "tiempo", "minutos", "cuanto dura", "longitud"],
      q: "¿Cuánto dura la experiencia?",
      a: "Entre 15 y 20 minutos. Se ha optimizado deliberadamente a esa franja porque en VR standalone una duración mayor genera fatiga ocular y postural, y una menor no deja espacio para profundizar en el contenido histórico."
    },

    /* ===== EQUIPO Y AUTORES ===== */
    {
      tags: ["quien", "quienes", "autores", "creadores", "equipo", "estudio", "nh", "nacho", "hugo"],
      q: "¿Quién ha hecho Ecos de Xàtiva?",
      a: "Hugo Ferrer Plaza e Ignacio Carrascosa Brotons, dos estudiantes del Grado en Diseño y Narración de Animación y Videojuegos de la Universidad Católica de Valencia. Firman como Nacho & Hugo VR Experiences, su estudio creativo. Su tutor es Adrián Mantilla Pousa."
    },
    {
      tags: ["roles", "reparto", "tareas", "quien hace que", "responsabilidades"],
      q: "¿Quién hace qué en el equipo?",
      a: "Hugo Ferrer Plaza lidera el lado más visual: modelado 3D, dirección de arte y diseño de niveles. Ignacio Carrascosa Brotons lidera el lado más técnico: programación en Unreal Engine, sistemas interactivos y sonorización. La división nunca es rígida porque en VR cualquier decisión visual tiene implicaciones técnicas y viceversa."
    },
    {
      tags: ["universidad", "ucv", "grado", "estudios", "facultad"],
      q: "¿En qué universidad se desarrolla?",
      a: "Universidad Católica de Valencia, Grado en Diseño y Narración de Animación y Videojuegos (DNAV). El proyecto es el Trabajo Fin de Grado del curso 2025-2026."
    },
    {
      tags: ["tutor", "supervisor", "director"],
      q: "¿Quién es el tutor del TFG?",
      a: "Adrián Mantilla Pousa, profesor del Grado en Diseño y Narración de Animación y Videojuegos de la UCV."
    },

    /* ===== TECNOLOGÍA Y PLATAFORMA ===== */
    {
      tags: ["unreal", "ue5", "motor", "engine", "tecnologia"],
      q: "¿Qué motor gráfico utilizáis?",
      a: "Unreal Engine 5.4. La programación combina Blueprints (visual scripting) para la mayoría de sistemas y C++ para los que necesitan rendimiento crítico, como el corte procedural de la espada."
    },
    {
      tags: ["quest", "meta", "hardware", "dispositivo", "plataforma", "gafas"],
      q: "¿En qué plataforma funciona?",
      a: "Meta Quest 3 en modo standalone, sin necesidad de PC ni cables. Esta decisión fue clave desde el principio: un dispositivo que requiere ordenador de alto rendimiento es una barrera logística que muchos museos no pueden asumir. El standalone hace el proyecto realmente desplegable."
    },
    {
      tags: ["standalone", "sin pc", "sin cables", "autonomo"],
      q: "¿Por qué standalone y no PCVR?",
      a: "Por viabilidad real. Una experiencia que necesita un PC potente conectado por cable es inviable en un museo: requiere espacio dedicado, técnico cualificado y mantenimiento. El standalone elimina todos esos problemas. A cambio, condiciona el rendimiento y obliga a optimizar agresivamente, que es lo que hicimos durante todo mayo."
    },
    {
      tags: ["lumen", "iluminacion", "lightmaps", "luz", "global illumination", "gi"],
      q: "¿Usáis Lumen para la iluminación?",
      a: "No, usamos lightmaps precomputados (baked lighting). Lumen es el sistema de iluminación global dinámica de Unreal Engine 5, pero su coste de cálculo en tiempo real es incompatible con el presupuesto de rendimiento del hardware standalone de Quest 3. Descartamos Lumen conscientemente y elegimos baking, que permite escenas estables a 72 fps."
    },
    {
      tags: ["chaos", "destruccion", "fractura", "destruction", "fragmentos"],
      q: "¿Cómo funciona la destrucción del muro?",
      a: "Usamos Chaos Destruction de Unreal Engine 5 sobre Geometry Collections. Cuando la bala del cañón impacta el muro, un Strain Field con magnitud calibrada (alrededor de 500) fractura la geometría en clusters. El radio del campo se ajustó para que la fractura afectara solo a la zona de impacto y no derrumbara toda la estructura de golpe."
    },
    {
      tags: ["c++", "cpp", "lenguaje", "codigo", "programacion"],
      q: "¿Por qué C++ en algunos sistemas?",
      a: "Solo el sistema de corte procedural de la espada está en C++. La razón es técnica y directa: requiere acceder en cada frame a las posiciones de los vértices del ProceduralMeshComponent, calcular un plano de corte mediante producto vectorial y ejecutar SliceProceduralMesh. Esas operaciones son sensibles al rendimiento y a la precisión. En Blueprints habría generado overhead innecesario. El resto del proyecto (más de 95%) está en Blueprints."
    },
    {
      tags: ["fps", "rendimiento", "performance", "frames", "72fps"],
      q: "¿A cuántos FPS corre el juego?",
      a: "72 fps estables en todos los niveles. Es el mínimo recomendado en Meta Quest 3 para una experiencia cómoda. Por debajo de 72 fps el cerebro detecta inconsistencia entre el sistema visual y el vestibular, lo que provoca mareo (VR sickness). Cero VR sickness en playtesting."
    },
    {
      tags: ["optimizacion", "optimizar", "rendimiento"],
      q: "¿Cómo optimizasteis para Quest 3?",
      a: "Reducción agresiva de carga triangular con la herramienta Reduce de Unreal, configuración de LODs (Level of Detail), compresión selectiva de texturas de 4K a 1024 px en motor, lightmaps precomputados en lugar de Lumen, occlusion culling agresivo, y Static Mesh en lugar de Nanite (que no soporta Quest 3 standalone)."
    },
    {
      tags: ["tamano", "peso", "apk", "gb", "tamaño"],
      q: "¿Cuánto pesa el juego?",
      a: "El APK pesa aproximadamente 1.1 GB para Android arm64. Es lo normal para un juego VR con assets de alta calidad. El acceso al APK se gestiona bajo solicitud directa al equipo."
    },
    {
      tags: ["blueprints", "visual scripting"],
      q: "¿Qué son los Blueprints?",
      a: "Blueprints es el sistema de visual scripting de Unreal Engine 5. Permite programar lógica conectando nodos visualmente en lugar de escribir código en C++. Más del 95% del proyecto está hecho con Blueprints, lo que facilitó la iteración rápida durante el prototipado."
    },

    /* ===== SISTEMAS TÉCNICOS ===== */
    {
      tags: ["espada", "corte", "slice", "procedural"],
      q: "¿Cómo funciona el sistema de la espada?",
      a: "La espada detecta su velocidad y dirección de movimiento en cada frame mediante un sweep esférico entre dos componentes (BladeBase y BladeTip). Cuando supera el umbral MinCutSpeed, calcula la normal del plano de corte como producto vectorial entre el vector de la hoja y el vector de movimiento, y ejecuta SliceProceduralMesh dividiendo objetos cortables (cilindros de bambú) en dos piezas con físicas activas. Multi-corte habilitado: los fragmentos resultantes pueden volver a cortarse."
    },
    {
      tags: ["arco", "tensado", "cuerda", "spline", "flecha"],
      q: "¿Cómo funciona el arco?",
      a: "La cuerda no está animada de forma predefinida: su posición se actualiza en tiempo real siguiendo el movimiento de la mano del jugador a través de un temporizador cada 0.01s y un SplineComponent. La distancia de tensado, almacenada en la variable PullBack, se calcula como la distancia entre la posición actual de la mano y la posición de reposo, limitada entre 0 y 50 cm con un Clamp. Ese valor se convierte en velocidad inicial del proyectil: un disparo suave produce flecha lenta con trayectoria parabólica; un disparo potente produce flecha rápida con trayectoria tensa. El pitch del audio de tensión aumenta progresivamente."
    },
    {
      tags: ["ballesta", "crossbow"],
      q: "¿Cómo funciona la ballesta?",
      a: "La ballesta es una adaptación del VR Gun Template de Unreal Engine. A diferencia del arco, usa disparo digital con potencia fija. Comprueba mediante GetHeldByHand qué mano sostiene el arma y rechaza el input si no coincide con la mano que ha pulsado el gatillo (evita disparos accidentales). Reusa el sistema GrabComponentSnap del template original. Disparo, retroalimentación háptica y audio espacializado desde la posición del arma."
    },
    {
      tags: ["canon", "cañon", "cannon", "artilleria"],
      q: "¿Cómo funciona el cañón?",
      a: "El más complejo del proyecto: coordina cinco Blueprints (BP_Cannon, BP_CannonBall, BP_Antorcha, BP_MuroChaos, BP_MasterField_Cannon). El ciclo es: una bala aparece automáticamente en la recámara, el jugador coge una antorcha y la acerca a la mecha. El sistema valida la antorcha por etiqueta, lanza una cuenta atrás sonora (FuseTime ~5s) y dispara la bala con trayectoria balística. Al impactar el muro, un Strain Field de Chaos Destruction fractura la Geometry Collection."
    },
    {
      tags: ["audioguia", "audio guia", "narracion", "guia museo", "narrador"],
      q: "¿Cómo funciona la audioguía?",
      a: "Mediante una Game Instance personalizada (GI_AudioGuia) que persiste entre niveles. Almacena un Set de Names (AudiosGuiaReproducidos) que actúa como registro global de qué narraciones ya han sonado. Cada nivel comprueba el Set: si el ID de su audio no está, lo reproduce y lo añade; si ya está, lo omite. Evolución de diseño: empezó como booleano único pero fallaba con múltiples escenarios; pasarlo a Set fue la solución escalable."
    },
    {
      tags: ["palanca", "puerta", "lever", "door"],
      q: "¿Cómo funciona la palanca?",
      a: "No usa física del motor sino cálculo manual de rotación. En Event Tick, cuando está agarrada, obtiene la posición del Motion Controller y del LeverPivot, calcula el vector dirección, lo convierte en rotación con MakeRotFromX, extrae el ángulo de Roll y aplica un Clamp entre MinRoll y MaxRoll. Resultado: la malla nunca simula físicas propias, se mueve solo por código, evitando temblores. Cuando alcanza la zona inferior, un BoxCollision (DownTrigger) detecta el evento y llama a OpenDoor en la puerta."
    },
    {
      tags: ["atril", "menu", "selecccion", "sendero", "campo entrenamiento", "modo"],
      q: "¿Cómo se elige entre Sendero y Campo de Entrenamiento?",
      a: "Mediante dos atriles físicos en el menú inicial, cada uno con una ilustración del destino y un botón tallado JUGAR. El usuario apoya físicamente la mano sobre el botón (no apunta desde lejos). Cada atril contiene un BoxCollision que detecta solo objetos con etiqueta VRHand asignada a las manos del Motion Controller —se rechaza el cuerpo, objetos sueltos o el propio atril. Sendero de los Reyes carga la experiencia completa; Campo de Entrenamiento salta directo al patio de armas."
    },
    {
      tags: ["objetos interactivos", "objetos museo", "agarrar", "iluminar", "highlight"],
      q: "¿Cómo se gestionan los objetos del museo?",
      a: "Mediante un Blueprint padre (BP_ObjetoInteractivo_Padre) que centraliza toda la lógica de agarrar, iluminar (emissive highlight por proximidad), reproducir audio y restaurar estado. Cada objeto del museo es un Blueprint hijo que solo define malla y audio específicos. El resaltado guarda todos los materiales originales en un array antes de sustituirlos, y los restaura cuando termina la interacción. Soporta objetos con cualquier número de slots de material."
    },
    {
      tags: ["teletransporte", "teleport", "fade", "cambio nivel"],
      q: "¿Cómo se cambia entre escenarios?",
      a: "Mediante teletransporte con fade a negro. Una BoxCollision invisible detecta cuando el VRPawn entra en zona, ejecuta StartCameraFade de transparente a negro durante FadeDuration, espera con un Delay, reubica al Pawn con Set Actor Location and Rotation (o carga otro nivel con Open Level) y finalmente revierte el fade. Ocultar el momento del cambio de posición evita la contradicción perceptiva que generaría mareo cinemático."
    },
    {
      tags: ["opening", "intro", "inicio", "logo"],
      q: "¿Cómo es la apertura del juego?",
      a: "BP_OpeningVR muestra una esfera oscura con el logo del proyecto que aparece progresivamente. Usa Dynamic Material Instances (no modifica el material base) controladas por una Timeline con dos canales independientes: AlfaEsfera y Alfalogo. Cada Update inyecta los valores en SetScalarParameterValue de los parámetros OpacidadFade y OpacidadLogo. Da tiempo al sistema a estabilizar el tracking de las gafas antes de presentar el contenido."
    },

    /* ===== ARTE Y MODELADO ===== */
    {
      tags: ["estilo", "low poly", "estetica", "arte", "visual"],
      q: "¿Qué estilo visual tiene el juego?",
      a: "Low poly estilizado. Es una decisión estética y técnica: en VR standalone el fotorrealismo es inviable por presupuesto de rendimiento. El estilo low poly esquiva además el Uncanny Valley en los personajes y permite una identidad visual coherente. Las referencias incluyen World of Warcraft, Fable Anniversary y Torchlight III, especialmente en simplificación de formas y claridad."
    },
    {
      tags: ["modular", "modulos", "piezas", "kit", "arquitectura"],
      q: "¿Cómo se construyen los escenarios?",
      a: "Con arte modular: 13 piezas tipológicas reutilizables que cubren todos los elementos arquitectónicos. Módulo base de 4 metros de lado (400 unidades de Unreal). El conjunto incluye paredes lisas, paredes con puerta ojival, paredes con ventana gótica, columnas en dos alturas, bóvedas, ladrillos de transición, escaleras y antorchas de pared. Pipeline Maya → Substance Painter → Unreal."
    },
    {
      tags: ["maya", "modelado 3d", "topology"],
      q: "¿Con qué software modeláis?",
      a: "Las mallas se desarrollaron en Autodesk Maya sin plugins adicionales, priorizando topología limpia con mínimo número de polígonos. El texturizado se hizo en Substance Painter con workflow PBR estándar (Albedo, Roughness, Metallic, Normal). Para los assets históricos se usó adicionalmente Tencent 3D (reconstrucción 3D con IA a partir de fotografías de referencia)."
    },
    {
      tags: ["tencent", "ia", "fotogrametria", "ai", "inteligencia artificial"],
      q: "¿Usáis IA para generar modelos?",
      a: "Sí, los props históricos del museo (espada, ballesta, daga nazarí, cota de malla, etc.) se generaron con Tencent 3D, una herramienta de reconstrucción 3D mediante IA a partir de referencias fotográficas. Es funcionalmente equivalente a la fotogrametría tradicional. Decisión consciente para optimizar tiempo de producción dentro del marco TFG. Los modelos generados se limpiaron, redujeron y optimizaron manualmente."
    },
    {
      tags: ["texturas", "pbr", "resolucion", "1024"],
      q: "¿A qué resolución están las texturas?",
      a: "Se crean a 4K originalmente en Substance Painter y se reducen a 1024×1024 al importarlas a Unreal Engine. A la distancia de visualización típica en VR la diferencia perceptiva entre 4K y 1K es prácticamente inapreciable, pero el impacto en memoria de GPU es cuatro veces mayor con la textura original. Iniciar el flujo en 4K garantiza máxima información durante creación; reducir en motor garantiza rendimiento en hardware móvil."
    },

    /* ===== NIVELES Y DISEÑO ===== */
    {
      tags: ["niveles", "escenarios", "fases", "zonas", "espacios"],
      q: "¿Cuántos niveles tiene?",
      a: "Cinco: Opening (presentación con logo), Sala de Inicio (atriles de elección), Pasillo Subterráneo (tutorial), Museo Principal (contenido histórico) y Campo de Entrenamiento (acción libre con armas). El usuario los recorre de forma secuencial salvo si elige Campo de Entrenamiento directamente desde el menú."
    },
    {
      tags: ["museo", "sala", "piezas", "exposicion"],
      q: "¿Qué hay en el museo?",
      a: "Recreaciones digitales de las colecciones reales del Museu de l'Almodí y el castillo: ballesta medieval, arco de guerra, espada jineta nazarí con decoración en relieve, daga nazarí con filigranas, cota de malla con escudo heráldico, vestimenta nobiliaria valenciana de seda, maqueta a escala del castillo, almacén histórico con cerámica y ánforas, y el icónico cuadro de Felipe V invertido."
    },
    {
      tags: ["felipe v", "cuadro", "invertido"],
      q: "¿Por qué está el cuadro de Felipe V boca abajo?",
      a: "Reproduce el gesto del museo real de Xàtiva: el cuadro de Felipe V cuelga invertido como acto de protesta simbólica por la quema de la ciudad en 1707 durante la Guerra de Sucesión. Es probablemente la pieza con mayor carga simbólica del museo, y su recreación en VR mantiene ese mismo gesto histórico-político."
    },
    {
      tags: ["campo entrenamiento", "armas", "patio", "tiro", "accion"],
      q: "¿Qué hay en el Campo de Entrenamiento?",
      a: "Espacio exterior delimitado por formaciones rocosas naturales (sin muros invisibles que rompan inmersión). Distribuido en estaciones independientes: zona de tiro con arco y ballesta hacia dianas, zona de corte con soportes de bambú y espada, y batería de cañones con muro destructible al fondo. Cada estación tiene cartelería diegética con iconografía de los controles."
    },
    {
      tags: ["funneling", "tutorial", "subterraneo", "pasillo"],
      q: "¿Cómo es el tutorial?",
      a: "El Pasillo Subterráneo es la zona de tutorial. Aplica conscientemente la técnica de funneling: la geometría del espacio (un corredor con una sola dirección posible de avance) guía al jugador hacia el NPC guía sin necesidad de marcadores artificiales. Una mesa con cálices permite practicar las mecánicas de agarre en contexto sin consecuencias. Al final hay una palanca que abre la puerta al museo."
    },

    /* ===== AUDIO Y SONIDO ===== */
    {
      tags: ["sonido", "audio", "musica", "score", "banda sonora"],
      q: "¿Cómo es el diseño de sonido?",
      a: "El audio es una capa estructural, no ornamental. Distingue audio diegético (con fuente en el mundo virtual, como la voz del guía NPC o el rumor de la puerta abriéndose) y no diegético (banda sonora medieval, narrador institucional). Música compuesta para los momentos clave: opening con tono contemplativo, museo con cuerda y percusión de época, campo de entrenamiento más enérgico."
    },
    {
      tags: ["voces", "narrador", "guia", "elevenlabs", "tts"],
      q: "¿Cómo se generaron las voces?",
      a: "Mediante síntesis de voz con IA usando ElevenLabs y su modelo Eleven v3. Permite anotar el guion con etiquetas de control emocional y prosódico directamente en el texto. El narrador (no diegético, audioguía institucional) tiene registro neutro y reposado. El guía (diegético, NPC en escena) tiene tratamiento más dinámico con variaciones de energía según el momento."
    },
    {
      tags: ["espacial", "3d audio", "binaural", "atenuacion"],
      q: "¿El audio es espacial 3D?",
      a: "Sí, el audio diegético es espacial tridimensional. La voz del guía NPC viene de la posición concreta del personaje en el espacio: el usuario puede girar la cabeza y localizarlo por sonido antes de verlo. Los efectos del entorno (puerta abriéndose, cañón disparando, golpes de espada) tienen atenuación 3D para que se perciban como provenientes de su fuente real."
    },

    /* ===== PROCESO Y CRONOLOGÍA ===== */
    {
      tags: ["cuando", "cronologia", "fechas", "duracion proyecto", "desarrollo"],
      q: "¿Cuánto ha durado el desarrollo?",
      a: "Nueve meses, desde septiembre de 2025 hasta finales de mayo de 2026. El curso académico se dividió en fases: concepción (sept-nov 2025), planificación remota (dic 2025), visita al castillo e inicio del arte (ene-feb 2026), bootcamp con las mecánicas (mar-abr 2026), optimización y branding (may 2026), y entregables finales (finales may 2026)."
    },
    {
      tags: ["bootcamp", "intensivo", "casa", "nacho"],
      q: "¿Qué fue el bootcamp?",
      a: "Una semana de desarrollo intensivo en casa de Nacho durante marzo-abril 2026. Fue el avance más significativo del proyecto: en esa estancia presencial se implementaron casi todas las mecánicas de interacción física (espada, arco, ballesta, cañón), todas resueltas sin agarre asistido para maximizar la sensación de presencia."
    },
    {
      tags: ["remoto", "distancia", "guadalajara", "mexico", "intercambio"],
      q: "¿Cómo coordinasteis a distancia al principio?",
      a: "Durante diciembre 2025 Hugo estaba en programa de intercambio en Guadalajara (México) y Nacho en Valencia. Las reuniones fueron íntegramente remotas: sesiones periódicas de brainstorming para asentar las bases conceptuales. Esa fase fija el alcance, el tono y la orientación didáctica del proyecto antes de empezar producción real."
    },
    {
      tags: ["testers", "playtest", "pruebas", "usuarios"],
      q: "¿Hicisteis playtesting?",
      a: "Sí, con tutor, familiares y amigos a lo largo del curso. Decisiones reales de UX salieron de esas sesiones: ajustar la altura de los objetos del museo, suavizar el fade del teletransporte, simplificar el ciclo de carga del cañón cuando vimos que alguien sin experiencia VR se atascaba al acercar la antorcha. Lo que no llegamos a organizar fue un playtesting estructurado con público objetivo real del museo, que es el siguiente paso natural del proyecto."
    },
    {
      tags: ["repositorio", "github", "git", "version", "control"],
      q: "¿Usáis control de versiones?",
      a: "Sí, repositorio Git en GitHub desde el inicio del desarrollo. Asegura el trabajo remoto entre los dos integrantes, sirve como sistema de copias de seguridad y permite mantener un historial trazable de cambios. Es la primera vez que el equipo trabajaba con Git en un proyecto de este tamaño."
    },

    /* ===== MERCADO Y FUTURO ===== */
    {
      tags: ["mercado", "negocio", "comercial", "viabilidad", "modelo"],
      q: "¿Es un proyecto comercializable?",
      a: "Sí, fue una premisa desde el principio. La decisión de standalone Quest 3 elimina la barrera logística para museos. El modelo contempla: entradas combinadas que incluyan visita física + sesión VR, subvenciones para proyectos de innovación en patrimonio cultural, patrocinios institucionales y licencia de la experiencia a otros espacios culturales valencianos."
    },
    {
      tags: ["futuro", "siguiente", "expansion", "ampliar"],
      q: "¿Qué planes hay para el futuro?",
      a: "El proyecto está pensado como plataforma escalable, no producto cerrado. La arquitectura modular permite añadir nuevos objetos al museo, nuevas zonas del castillo o nuevas narraciones sin rehacer el proyecto desde cero. A largo plazo, construir un catálogo de experiencias VR vinculadas a espacios históricos de la Comunidad Valenciana."
    },
    {
      tags: ["ayuntamiento", "instituciones", "xativa", "museu", "almodi"],
      q: "¿Hay contacto con el Ayuntamiento de Xàtiva?",
      a: "El Ayuntamiento de Xàtiva facilitó el acceso al castillo y la documentación histórica que ha hecho posible la fidelidad del proyecto. Son uno de los socios estratégicos naturales junto con el Museu de l'Almodí. Tras la defensa del TFG, el plan es presentarles formalmente la propuesta como piloto subvencionable."
    },
    {
      tags: ["precio", "coste", "cuanto vale", "inversion"],
      q: "¿Cuánto costaría implementarlo en un museo?",
      a: "El coste principal de implementación sería el equipamiento: unidades Meta Quest 3 (alrededor de 550€ por unidad) más mantenimiento. El software no genera coste recurrente (Unreal Engine es gratuito para este tipo de proyectos). El modelo sería sostenible mediante entradas combinadas o subvenciones culturales."
    },

    /* ===== HISTORIA / CONTEXTO DEL CASTILLO ===== */
    {
      tags: ["castillo xativa", "historia", "fortaleza", "patrimonio"],
      q: "¿Qué importancia tiene el Castillo de Xàtiva?",
      a: "Es uno de los espacios históricos más relevantes de la Comunidad Valenciana. Su historia abarca siglos de ocupación humana, desde época ibérica hasta la Edad Moderna. Sus colecciones reúnen piezas de armamento medieval, cerámica andalusí, vestimenta nobiliaria y documentos que testimonian episodios clave de la historia valenciana."
    },
    {
      tags: ["epoca", "siglo", "edad media", "medieval"],
      q: "¿En qué época está ambientado el juego?",
      a: "Principalmente entre los siglos XIV y XV, la Edad Media tardía valenciana. Es el periodo de mayor riqueza arquitectónica y militar del castillo, con presencia tanto de la cultura andalusí —reflejada en piezas como la daga nazarí— como de la castellana posterior. El cuadro de Felipe V conecta con un episodio posterior (1707, Guerra de Sucesión)."
    },
    {
      tags: ["nazari", "andalusi", "moro", "arabe"],
      q: "¿Por qué referencias andalusíes?",
      a: "Porque Xàtiva fue uno de los principales núcleos andalusíes de la zona, con una guarnición mora importante. La espada jineta y la daga nazarí del museo reflejan ese armamento característico del periodo. El proyecto recoge esa pluralidad cultural histórica sin simplificarla a un único relato."
    },

    /* ===== DETALLES CURIOSOS Y MISC ===== */
    {
      tags: ["nombre", "ecos", "por que llamar"],
      q: "¿Por qué se llama Ecos de Xàtiva?",
      a: "Ecos sugiere algo más que reconstrucción literal: la idea de que el pasado resuena en el presente cuando se reactiva con interacción. El castillo físico es un lugar donde la historia ha dejado huellas; la experiencia VR permite que esas huellas vuelvan a hacer ruido —que el visitante oiga, toque, use lo que antes solo podía contemplar."
    },
    {
      tags: ["nh", "marca", "logo", "branding"],
      q: "¿Qué significa NH?",
      a: "NH es la marca provisional del estudio: Nacho & Hugo VR Experiences. Se implementó durante mayo 2026 para dar al proyecto un acabado profesional inmediato, dejando abierta la puerta a un rediseño completo de identidad si se confirma la viabilidad comercial con el Ayuntamiento de Xàtiva."
    },
    {
      tags: ["accesibilidad", "principiantes", "primera vez"],
      q: "¿Sirve para gente que nunca ha usado VR?",
      a: "Sí, está diseñado precisamente con esa premisa. La experiencia debe funcionar para alguien que nunca ha cogido un mando VR exactamente igual que para alguien que juega habitualmente. De ahí el tutorial guiado del pasillo subterráneo, la tutorialización diegética mediante cartelería en el entorno y la opción de saltar directo al Campo de Entrenamiento para usuarios más ágiles."
    },
    {
      tags: ["valle inquietante", "uncanny", "personajes"],
      q: "¿Por qué los personajes no son fotorrealistas?",
      a: "Para evitar el efecto Uncanny Valley. En VR, un personaje humano fotorrealista a pocos centímetros del usuario requiere animaciones faciales de altísima calidad para no generar rechazo inconsciente. Un diseño estilizado esquiva ese problema por completo, genera mayor empatía y tiene un coste de producción mucho menor. El guía NPC es estilizado, con expresión amable y proporciones suaves."
    },
    {
      tags: ["cuerpo", "avatar", "manos", "ik"],
      q: "¿El avatar tiene cuerpo completo?",
      a: "No, solo manos en primera persona equipadas con guantes tácticos. Es una elección técnica y experiencial. Calcular cinemática inversa de un cuerpo completo a partir de solo tres puntos de tracking (visor y dos controladores) produce posturas antinaturales que rompen la inmersión. Las manos flotantes mantienen intacto el embodiment."
    },
    {
      tags: ["bibliografia", "referencias", "fuentes", "citas"],
      q: "¿En qué fuentes os apoyáis?",
      a: "17 referencias académicas en APA 7: Champion sobre heritage role playing, Kilteni sobre embodiment, Jerald sobre diseño VR, Mori sobre Uncanny Valley, Totten sobre nivel design, Slater sobre presencia, Wilson sobre embodied cognition, LaViola sobre cybersickness, Norman sobre affordances, Gee sobre game-based learning, Bekele sobre VR cultural heritage, entre otras."
    },
    {
      tags: ["snap", "agarre", "fisico", "presencia"],
      q: "¿Por qué no usáis snap-grab para las armas?",
      a: "Para maximizar la sensación de presencia. El agarre asistido (snap), típico en muchas experiencias VR comerciales, fija las armas en una postura predefinida y resta naturalidad. Todas las mecánicas de armas del proyecto se resuelven con agarre físico real: el usuario tiene que coger la espada, el arco o la antorcha como las cogería en la realidad."
    },
    {
      tags: ["renderizado", "renders", "screenshots", "imagenes"],
      q: "¿De dónde son los renders del juego?",
      a: "Son capturas reales del juego en el Unreal Editor (HighresScreenshot a alta resolución), no maquetas ni mockups. Lo que se ve en la web, en el press kit y en la memoria es exactamente lo que se ve dentro del Quest 3 cuando alguien juega."
    },
    {
      tags: ["repositorio web", "codigo web", "github web"],
      q: "¿Dónde está el código de la web?",
      a: "En github.com/hugoUCV/ecos-de-xativa. La web está hospedada en GitHub Pages, es estática (HTML, CSS, JS) y todo el código es público. El proyecto del juego en sí (Unreal) no está en ese repositorio; solo la web, los modelos .glb del visor y los documentos asociados."
    }
  ];

  /* Preguntas sugeridas al abrir el chat */
  const SUGGESTIONS = [
    "¿Qué es Ecos de Xàtiva?",
    "¿Quién ha hecho el proyecto?",
    "¿Qué motor gráfico usáis?",
    "¿Cómo funciona el sistema de la espada?",
    "¿Por qué no usáis Lumen?",
    "¿En qué plataforma funciona?",
    "¿Cuánto dura la experiencia?",
    "¿Por qué se llama Ecos de Xàtiva?"
  ];

  /* ──────────────────────────────────────────────────────────
     MOTOR DE BÚSQUEDA — TF-IDF simplificado
     ────────────────────────────────────────────────────────── */
  const STOPWORDS = new Set([
    'a','al','algo','algunos','ante','antes','aqui','asi','aunque','bien',
    'cada','como','con','contra','cual','cuales','cuando','cuantos','de',
    'del','desde','donde','dos','el','ella','ellas','ellos','en','entre',
    'era','eran','es','esa','esas','ese','eso','esos','esta','estaba',
    'estan','estar','estas','este','esto','estos','fue','fueron','ha',
    'han','hay','la','las','le','les','lo','los','mas','me','mi','mis',
    'mucho','muy','ni','no','nos','o','os','otra','otro','para','pero',
    'por','porque','que','qué','se','sea','si','sin','sobre','solo','son',
    'su','sus','tambien','también','te','ti','tiene','un','una','uno',
    'unos','y','ya','yo'
  ]);

  function normalize(s) {
    return s.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')  /* quita tildes */
      .replace(/[^a-z0-9ñç\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize(s) {
    return normalize(s).split(' ').filter(t => t && t.length > 1 && !STOPWORDS.has(t));
  }

  /* Pre-procesar FAQ: tokenizar tags + question una vez */
  FAQ.forEach(item => {
    const all = item.tags.concat(item.q.split(/\s+/));
    item._tokens = tokenize(all.join(' '));
    item._tokenSet = new Set(item._tokens);
  });

  /* IDF aproximado: peso inversamente proporcional a la frecuencia global */
  const DF = {};
  FAQ.forEach(item => {
    item._tokenSet.forEach(t => { DF[t] = (DF[t] || 0) + 1; });
  });
  const N = FAQ.length;
  function idf(term) {
    return Math.log(1 + N / (1 + (DF[term] || 0)));
  }

  /* Score por similitud sobre tokens */
  function scoreItem(item, queryTokens) {
    let score = 0;
    const seen = new Set();
    queryTokens.forEach(qt => {
      if (seen.has(qt)) return;
      seen.add(qt);
      if (item._tokenSet.has(qt)) {
        score += idf(qt);
      } else {
        /* match parcial: prefijo o sufijo */
        for (const t of item._tokenSet) {
          if (t.length >= 4 && qt.length >= 4 &&
              (t.startsWith(qt) || qt.startsWith(t) ||
               t.endsWith(qt)   || qt.endsWith(t))) {
            score += idf(qt) * 0.5;
            break;
          }
        }
      }
    });
    return score;
  }

  function findBest(query, limit = 3) {
    const tokens = tokenize(query);
    if (!tokens.length) return [];
    const scored = FAQ.map(item => ({ item, score: scoreItem(item, tokens) }));
    scored.sort((a, b) => b.score - a.score);
    return scored.filter(s => s.score > 0).slice(0, limit);
  }

  /* Detector de intenciones simples (saludo, despedida, etc.) */
  function detectIntent(query) {
    const q = normalize(query);
    if (/^(hola|hey|buenas|saludos|qué tal|que tal|hi|hello|hola hola)$/i.test(q.trim())) return 'greeting';
    if (/(gracias|muchas gracias|thanks|thx|merci)/i.test(q)) return 'thanks';
    if (/(adios|chao|bye|hasta luego|hasta pronto)/i.test(q)) return 'goodbye';
    if (/^(eres|sois|quien eres|qué eres|que eres)/i.test(q)) return 'who-are-you';
    if (/(broma|chiste|joke|gracioso)/i.test(q)) return 'joke';
    return null;
  }

  const INTENT_REPLIES = {
    'greeting':   '¡Hola! 👋 Soy el asistente de Ecos de Xàtiva. Pregúntame lo que quieras sobre el proyecto, el equipo, las tecnologías o el castillo. Si no sabes por dónde empezar, prueba con una de las sugerencias.',
    'thanks':     '¡Un placer! Si tienes más preguntas, aquí estoy.',
    'goodbye':    '¡Hasta luego! Gracias por interesarte por Ecos de Xàtiva.',
    'who-are-you':'Soy un asistente local entrenado con la memoria del TFG Ecos de Xàtiva. No uso ninguna API externa — funciono al 100% en tu navegador con un catálogo de preguntas pre-redactadas por el equipo. Si tu pregunta no está cubierta, puedo sugerirte una similar.',
    'joke':       'Mi humor es bastante limitado, pero te puedo contar que el cuadro de Felipe V del museo cuelga boca abajo. No es chiste — es protesta histórica desde 1707. 🙃'
  };

  /* ──────────────────────────────────────────────────────────
     INYECTAR CSS
     ────────────────────────────────────────────────────────── */
  const css = `
    #nh-chat-fab {
      position: fixed; bottom: 22px; right: 22px; z-index: 9000;
      width: 60px; height: 60px;
      background: linear-gradient(135deg, #E8B53A 0%, #C7951F 100%);
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 50%;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 10px 28px rgba(0,0,0,0.4),
                  0 0 0 1px rgba(232,181,58,0.3),
                  0 0 22px rgba(232,181,58,0.4);
      transition: all .35s cubic-bezier(.16,1,.3,1);
    }
    #nh-chat-fab:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 14px 36px rgba(0,0,0,0.5),
                  0 0 0 1px rgba(232,181,58,0.4),
                  0 0 32px rgba(232,181,58,0.6);
    }
    #nh-chat-fab svg { width: 28px; height: 28px; fill: #1F1410; }
    #nh-chat-fab .nh-pulse {
      position: absolute; inset: -4px;
      border-radius: 50%; border: 2px solid #E8B53A;
      animation: nh-pulse 2s ease-out infinite;
      pointer-events: none;
    }
    @keyframes nh-pulse {
      0%   { opacity: 0.6; transform: scale(1); }
      100% { opacity: 0; transform: scale(1.4); }
    }
    #nh-chat-fab.open { transform: rotate(45deg) scale(0.9); }
    #nh-chat-fab.open .nh-pulse { display: none; }

    #nh-chat-window {
      position: fixed; bottom: 96px; right: 22px; z-index: 9000;
      width: 380px; max-width: calc(100vw - 32px);
      height: 560px; max-height: calc(100vh - 130px);
      background: linear-gradient(180deg, #2A1C14 0%, #1F1410 100%);
      border: 1px solid rgba(232,181,58,0.35);
      border-radius: 12px;
      box-shadow: 0 24px 64px rgba(0,0,0,0.65),
                  0 0 0 1px rgba(232,181,58,0.08);
      display: flex; flex-direction: column;
      overflow: hidden;
      opacity: 0; transform: translateY(20px) scale(0.96);
      pointer-events: none;
      transition: all .35s cubic-bezier(.16,1,.3,1);
      font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;
      color: #F4E8D0;
    }
    #nh-chat-window.show {
      opacity: 1; transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .nh-chat-header {
      padding: 16px 18px;
      background: linear-gradient(180deg, rgba(232,181,58,0.10) 0%, transparent 100%);
      border-bottom: 1px solid rgba(232,181,58,0.18);
      display: flex; align-items: center; gap: 12px;
    }
    .nh-chat-avatar {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, #E8B53A 0%, #C7951F 100%);
      display: flex; align-items: center; justify-content: center;
      color: #1F1410;
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 700; font-size: 14px;
      box-shadow: 0 0 14px rgba(232,181,58,0.35);
    }
    .nh-chat-titles { flex: 1; min-width: 0; }
    .nh-chat-title {
      font-family: 'Cinzel', Georgia, serif;
      font-weight: 600; font-size: 14px;
      color: #F2D27A; margin: 0;
    }
    .nh-chat-status {
      font-size: 10px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #C9B998;
      display: flex; align-items: center; gap: 6px;
    }
    .nh-status-dot {
      width: 6px; height: 6px;
      background: #6FCF8A; border-radius: 50%;
      box-shadow: 0 0 6px rgba(111,207,138,0.7);
      animation: nh-blink 2.4s ease-in-out infinite;
    }
    @keyframes nh-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
    .nh-chat-close {
      background: transparent; border: 1px solid rgba(232,181,58,0.3);
      color: #C9B998;
      width: 28px; height: 28px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all .2s ease;
      flex-shrink: 0;
    }
    .nh-chat-close:hover { background: rgba(232,181,58,0.1); color: #E8B53A; border-color: #E8B53A; }
    .nh-chat-close svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2; }

    .nh-chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 18px 16px;
      display: flex; flex-direction: column; gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: rgba(232,181,58,0.35) transparent;
    }
    .nh-chat-body::-webkit-scrollbar { width: 6px; }
    .nh-chat-body::-webkit-scrollbar-thumb {
      background: rgba(232,181,58,0.35); border-radius: 3px;
    }

    .nh-msg {
      max-width: 86%;
      padding: 11px 14px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.55;
      animation: nh-msg-in .3s ease both;
    }
    @keyframes nh-msg-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .nh-msg.bot {
      align-self: flex-start;
      background: rgba(62,42,28,0.6);
      border: 1px solid rgba(232,181,58,0.15);
      color: #F4E8D0;
      border-bottom-left-radius: 4px;
    }
    .nh-msg.user {
      align-self: flex-end;
      background: linear-gradient(135deg, #E8B53A 0%, #C7951F 100%);
      color: #1F1410;
      border-bottom-right-radius: 4px;
      font-weight: 500;
    }
    .nh-msg.bot strong { color: #F2D27A; }

    .nh-msg-typing {
      display: inline-flex; gap: 4px; padding: 6px 0;
    }
    .nh-msg-typing span {
      width: 6px; height: 6px;
      background: #E8B53A; border-radius: 50%;
      animation: nh-dot 1.2s ease-in-out infinite;
    }
    .nh-msg-typing span:nth-child(2) { animation-delay: 0.18s; }
    .nh-msg-typing span:nth-child(3) { animation-delay: 0.36s; }
    @keyframes nh-dot {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50%      { opacity: 1; transform: scale(1.2); }
    }

    .nh-suggestions {
      display: flex; flex-wrap: wrap; gap: 6px;
      margin-top: 4px;
    }
    .nh-sugg-chip {
      background: rgba(232,181,58,0.08);
      border: 1px solid rgba(232,181,58,0.35);
      color: #F2D27A;
      font-size: 12px;
      font-family: inherit;
      padding: 6px 11px;
      border-radius: 12px;
      cursor: pointer;
      transition: all .2s ease;
      line-height: 1.3;
    }
    .nh-sugg-chip:hover {
      background: rgba(232,181,58,0.18);
      border-color: #E8B53A;
      color: #F4E8D0;
    }

    .nh-chat-input-wrap {
      padding: 12px 14px 14px;
      border-top: 1px solid rgba(232,181,58,0.18);
      background: rgba(15,14,13,0.4);
    }
    .nh-chat-input-row {
      display: flex; gap: 8px;
      background: rgba(31,20,16,0.7);
      border: 1px solid rgba(232,181,58,0.25);
      border-radius: 22px;
      padding: 4px 4px 4px 14px;
      transition: border-color .2s ease;
    }
    .nh-chat-input-row:focus-within {
      border-color: #E8B53A;
      box-shadow: 0 0 0 3px rgba(232,181,58,0.12);
    }
    .nh-chat-input {
      flex: 1; min-width: 0;
      background: transparent; border: 0; outline: 0;
      color: #F4E8D0;
      font-family: inherit; font-size: 13.5px;
      padding: 8px 0;
    }
    .nh-chat-input::placeholder { color: rgba(244,232,208,0.45); }
    .nh-chat-send {
      width: 34px; height: 34px;
      background: linear-gradient(135deg, #E8B53A 0%, #C7951F 100%);
      border: 0; border-radius: 50%;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all .25s ease;
      flex-shrink: 0;
    }
    .nh-chat-send:hover {
      transform: scale(1.08);
      box-shadow: 0 0 14px rgba(232,181,58,0.5);
    }
    .nh-chat-send svg { width: 15px; height: 15px; fill: #1F1410; }
    .nh-chat-disclaimer {
      font-size: 10px;
      color: rgba(201,185,152,0.5);
      text-align: center;
      margin-top: 8px;
      letter-spacing: 0.04em;
    }

    /* ── RESPONSIVE — móvil ── */
    @media (max-width: 480px) {
      #nh-chat-fab { bottom: 16px; right: 16px; width: 54px; height: 54px; }
      #nh-chat-fab svg { width: 24px; height: 24px; }
      #nh-chat-window {
        bottom: 80px;
        right: 12px; left: 12px;
        width: auto;
        height: calc(100vh - 110px);
        max-height: 100dvh;
      }
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ──────────────────────────────────────────────────────────
     INYECTAR HTML (FAB + ventana)
     ────────────────────────────────────────────────────────── */
  const fab = document.createElement('button');
  fab.id = 'nh-chat-fab';
  fab.setAttribute('aria-label', 'Abrir chat de preguntas');
  fab.innerHTML = `
    <span class="nh-pulse" aria-hidden="true"></span>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  `;
  document.body.appendChild(fab);

  const win = document.createElement('div');
  win.id = 'nh-chat-window';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', 'Chat con asistente de Ecos de Xàtiva');
  win.innerHTML = `
    <div class="nh-chat-header">
      <div class="nh-chat-avatar">NH</div>
      <div class="nh-chat-titles">
        <p class="nh-chat-title">Pregúntale a NH</p>
        <p class="nh-chat-status">
          <span class="nh-status-dot"></span>
          Asistente del TFG · Local
        </p>
      </div>
      <button class="nh-chat-close" aria-label="Cerrar chat">
        <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div class="nh-chat-body" id="nh-chat-body" role="log" aria-live="polite"></div>
    <div class="nh-chat-input-wrap">
      <form class="nh-chat-input-row" id="nh-chat-form" autocomplete="off">
        <input
          type="text"
          class="nh-chat-input"
          id="nh-chat-input"
          placeholder="Pregunta sobre el proyecto..."
          aria-label="Escribe tu pregunta"
        />
        <button type="submit" class="nh-chat-send" aria-label="Enviar pregunta">
          <svg viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" fill="none" stroke="#1F1410" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </form>
      <p class="nh-chat-disclaimer">100% local · sin envío de datos · catálogo cerrado</p>
    </div>
  `;
  document.body.appendChild(win);

  const body = document.getElementById('nh-chat-body');
  const input = document.getElementById('nh-chat-input');
  const form = document.getElementById('nh-chat-form');
  const closeBtn = win.querySelector('.nh-chat-close');

  /* ──────────────────────────────────────────────────────────
     LÓGICA DE LA UI
     ────────────────────────────────────────────────────────── */
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function addMsg(type, htmlContent) {
    const msg = document.createElement('div');
    msg.className = 'nh-msg ' + type;
    msg.innerHTML = htmlContent;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
    return msg;
  }

  function addSuggestions(items) {
    const wrap = document.createElement('div');
    wrap.className = 'nh-suggestions';
    items.forEach(text => {
      const chip = document.createElement('button');
      chip.className = 'nh-sugg-chip';
      chip.textContent = text;
      chip.type = 'button';
      chip.addEventListener('click', () => handleQuery(text));
      wrap.appendChild(chip);
    });
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
  }

  async function showTyping(duration = 600) {
    const m = addMsg('bot', '<span class="nh-msg-typing"><span></span><span></span><span></span></span>');
    await new Promise(r => setTimeout(r, duration));
    m.remove();
  }

  async function handleQuery(rawQuery) {
    const query = rawQuery.trim();
    if (!query) return;
    addMsg('user', escapeHtml(query));
    input.value = '';

    /* Detectar intención simple */
    const intent = detectIntent(query);
    if (intent && INTENT_REPLIES[intent]) {
      await showTyping(450);
      addMsg('bot', escapeHtml(INTENT_REPLIES[intent]));
      if (intent === 'greeting' || intent === 'who-are-you') {
        addSuggestions(SUGGESTIONS.slice(0, 4));
      }
      return;
    }

    await showTyping(700 + Math.random() * 400);
    const matches = findBest(query, 3);

    if (!matches.length || matches[0].score < 0.6) {
      addMsg('bot',
        'No tengo una respuesta exacta a esa pregunta en mi catálogo. ' +
        'Pero puedo cubrir todo lo relacionado con el proyecto, el equipo, ' +
        'las tecnologías y el castillo. Prueba con una de estas preguntas:'
      );
      addSuggestions(SUGGESTIONS.slice(0, 5));
      return;
    }

    const best = matches[0];
    addMsg('bot', '<strong>' + escapeHtml(best.item.q) + '</strong><br><br>' + escapeHtml(best.item.a));

    /* Si hay otras coincidencias relevantes, ofrécelas */
    const others = matches.slice(1).filter(m => m.score >= best.score * 0.45);
    if (others.length) {
      const tipMsg = document.createElement('p');
      tipMsg.style.cssText = 'font-size:10px;color:rgba(201,185,152,0.6);letter-spacing:0.16em;text-transform:uppercase;margin:4px 0 -2px;text-align:left;';
      tipMsg.textContent = '¿Quizás también te interese?';
      body.appendChild(tipMsg);
      addSuggestions(others.map(o => o.item.q));
    }
  }

  /* Bienvenida al abrir el chat por primera vez */
  let firstOpen = true;
  function openChat() {
    win.classList.add('show');
    fab.classList.add('open');
    if (firstOpen) {
      firstOpen = false;
      setTimeout(() => {
        addMsg('bot',
          '¡Hola! Soy el asistente local de <strong>Ecos de Xàtiva</strong>. ' +
          'Pregúntame lo que quieras sobre el TFG: el proyecto, el equipo, las tecnologías, ' +
          'los sistemas del juego o el Castillo de Xàtiva.'
        );
        addMsg('bot', 'O elige una de estas preguntas frecuentes:');
        addSuggestions(SUGGESTIONS);
      }, 200);
    }
    setTimeout(() => input.focus(), 380);
  }
  function closeChat() {
    win.classList.remove('show');
    fab.classList.remove('open');
  }

  fab.addEventListener('click', () => {
    if (win.classList.contains('show')) closeChat();
    else openChat();
  });
  closeBtn.addEventListener('click', closeChat);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleQuery(input.value);
  });

  /* Esc cierra */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && win.classList.contains('show')) closeChat();
  });

  /* Exponer para depuración/expansión */
  window.NHChat = { FAQ, findBest, open: openChat, close: closeChat };
})();
