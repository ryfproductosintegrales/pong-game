# 🎮 PONG GAME - Edición Completa

El clásico juego Pong reimaginado con todas las características modernas, múltiples temas, power-ups, y un sistema completo de puntuaciones.

## ✨ Características Principales

### 🎯 Modos de Juego
- **Contra IA**: Desafía a la computadora con 4 dificultades
- **Multijugador Local**: Juega contra otro jugador en el mismo dispositivo

### 🎮 Dificultades
1. **Fácil** - IA lenta, fácil de vencer
2. **Normal** - Equilibrado y desafiante
3. **Difícil** - IA muy rápida y precisa
4. **Pesadilla** - ¡Casi imposible!

### 🎨 Sistema de Temas (6 Temas)
- 🟢 **Cyberpunk**: Colores neón verde y cian
- 🌊 **Océano**: Tonos azules y verdes agua
- 🌲 **Bosque**: Verdes naturales y tierra
- 🌅 **Atardecer**: Naranjas, dorados y rojos
- 🎮 **Retro**: Clásico estilo arcade
- 🌑 **Oscuro**: Minimalista y elegante

### 💫 Sistema de Power-ups
- **🐢 Bola Lenta**: Reduce la velocidad de la bola por 5 segundos
- **⚡ Bola Rápida**: Aumenta la velocidad de la bola por 4 segundos
- **📏 Paddle Grande**: Aumenta el tamaño del paddle por 6 segundos
- **🧲 Paddle Magnético**: Reduce el efecto spin de la bola

### 🏆 Tabla de Puntuaciones
- Registro automático de partidas
- Filtros: Global, Hoy, Esta Semana
- Estadísticas detalladas guardadas localmente
- Exportar datos a JSON

### ⚙️ Configuración Completa
- 🔊 Control de sonido y volumen
- 🎨 Efectos visuales on/off
- 🎢 Trails (rastreos) de bola activables
- ⌨️ Control por ratón o teclado
- 📊 Ajuste de velocidad de bola (0.5x a 2x)
- 💾 Resetear datos y exportar estadísticas

### 📊 Sistema de Puntuación
- **+5 puntos**: Por golpear la bola
- **+10 puntos**: Por anotar un gol
- **+20 puntos**: Por activar un power-up
- **Puntos Totales**: Suma de toda la partida

### 📈 Estadísticas Rastreadas
- Puntos del Jugador y IA
- Cantidad de golpes
- Tiempo de juego
- Power-ups usados
- Puntos totales
- Nivel alcanzado

## 🚀 Cómo Jugar

1. **Abre el archivo** `index.html` en tu navegador
2. **Selecciona modo**: Contra IA o Multijugador
3. **Elige dificultad**: Desde Fácil hasta Pesadilla
4. **Controla tu paddle**:
   - Ratón: Mueve el cursor arriba/abajo
   - Teclado: Usa ↑ y ↓ (o W/S en multijugador)
5. **Juega**: Gana 5 puntos para ganar la partida

## ⌨️ Controles

### Modo Solo (Contra IA)
- **Ratón**: Mueve arriba/abajo
- **↑/↓**: Controles alternativos
- **Pausa**: Botón "⏸ Pausar"
- **Menú**: Botón "🏠 Menú"

### Modo Multijugador
- **Jugador 1**: W/S (arriba/abajo)
- **Jugador 2**: ↑/↓ (arriba/abajo)

## 🎨 Personalización

### Cambiar Tema
1. Haz clic en "🎨 Temas" en el menú
2. Selecciona el tema deseado
3. ¡Tu preferencia se guarda automáticamente!

### Ajustar Velocidad
En Configuración → Velocidad de Bola:
- 0.5x - Muy lenta
- 1x - Normal
- 2x - Extrema

## 📱 Características Técnicas

### Tecnologías Utilizadas
- **HTML5**: Canvas 2D para renderizado
- **CSS3**: Gradientes, animaciones, temas
- **JavaScript Vanilla**: Lógica pura sin librerías
- **Web Audio API**: Síntesis de sonido
- **LocalStorage**: Persistencia de datos

### Optimizaciones
- Renderizado eficiente con Canvas
- Colisiones precisas
- Partículas optimizadas
- Trails con limite de memoria
- Responsivo a todos los tamaños

## 💾 Datos Guardados

Los siguientes datos se guardan localmente:
- Tabla de puntuaciones (top 50)
- Tema seleccionado
- Preferencias de sonido
- Estadísticas de juego

**Nota**: Los datos se almacenan solo en tu navegador. Limpiar el caché borrará los datos.

## 🔧 Configuración Avanzada

### Dificultades (Valores internos)

| Dificultad | Velocidad IA | Rango de Predicción |
|------------|--------------|-------------------|
| Fácil      | 3            | 80 píxeles        |
| Normal     | 5            | 40 píxeles        |
| Difícil    | 7            | 20 píxeles        |
| Pesadilla  | 9            | 5 píxeles         |

## 🐛 Soporte y Problemas

### El juego se ve feo
- Asegúrate de que tu navegador es moderno (Chrome, Firefox, Safari, Edge)
- Recarga la página (Ctrl+F5)
- Prueba con un tema diferente

### El sonido no funciona
- Verifica que el sonido esté activado en Configuración
- Algunos navegadores requieren interacción del usuario primero

### Lag o bajo rendimiento
- Desactiva los trails en Configuración
- Desactiva efectos visuales
- Reduce la velocidad de la bola

## 🎯 Objetivos Futuros

- [ ] Tabla de puntuaciones en línea
- [ ] Logros y badges
- [ ] Más power-ups especiales
- [ ] Modos de juego adicionales (supervivencia, etc.)
- [ ] Personalización de controles
- [ ] Animaciones de entrada mejoradas

## 📄 Licencia

Libre para usar, modificar y distribuir. Disfruta del juego 🎮

## 👨‍💻 Créditos

Desarrollado con ❤️ usando JavaScript puro.

---

**¡A jugar!** 🎮✨