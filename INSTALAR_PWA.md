# 📱 Guía FÁCIL: Instalar Pong Game como APP en Android

## ✨ OPCIÓN 1: Como APP Nativa (PWA) - Más Fácil

### ✅ Paso 1: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. Scroll hacia abajo → **Pages**
4. En "Source" selecciona: **main** (o master)
5. Click en **Save**

**Tu juego estará en:**
```
https://ryfproductosintegrales.github.io/pong-game/
```

### ✅ Paso 2: Instalar en Android

1. **Abre Chrome en tu Android** 📱
2. Ve a: `https://ryfproductosintegrales.github.io/pong-game/`
3. Espera a que cargue completamente
4. Presiona el **menú (⋮)** en la esquina superior derecha
5. Selecciona: **"Instalar aplicación"** o **"Install app"**
6. Confirma la instalación

**¡Listo!** La app aparecerá en tu pantalla de inicio como cualquier otra app.

---

## 📥 OPCIÓN 2: Descargar APK (Más Control)

### 🔧 Método A: Script Automático (Recomendado)

#### Para Windows:

1. **Descarga** `build-apk.bat` desde el repositorio
2. **Haz doble click** en el archivo
3. **Espera 5-10 minutos** (instala todo automáticamente)
4. **¡Tu APK estará listo!**

La ubicación será:
```
PongGame_APK/platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

#### Para Mac/Linux:

1. **Abre Terminal**
2. **Descarga** `build-apk.sh` desde el repositorio
3. **Ejecuta:**
   ```bash
   chmod +x build-apk.sh
   ./build-apk.sh
   ```
4. **¡Tu APK estará listo!**

### 🔧 Método B: Paso a Paso Manual (Si el script falla)

#### ✅ Requisitos:
- Node.js: [Descargar](https://nodejs.org/)
- Android SDK: Incluido en Android Studio

#### ✅ Pasos:

1. **Abre CMD/Terminal**

2. **Instala Cordova:**
   ```bash
   npm install -g cordova
   ```

3. **Crea el proyecto:**
   ```bash
   cordova create PongGame com.pongame.app "Pong Game"
   cd PongGame
   ```

4. **Descarga tu juego:**
   - Descarga `index.html` de tu repositorio
   - Colócalo en: `PongGame/www/index.html`

5. **Agrega Android:**
   ```bash
   cordova platform add android
   ```

6. **Compila el APK:**
   ```bash
   cordova build android
   ```

7. **¡Tu APK está en:**
   ```
   PongGame/platforms/android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 📱 Instalar APK en tu Android

### Paso 1: Permitir aplicaciones desconocidas
1. Ve a **Ajustes**
2. **Seguridad** (o Privacidad)
3. Activa: **"Fuentes desconocidas"** o **"Instalar apps desconocidas"**

### Paso 2: Transferir APK
1. Copia el archivo `.apk` a tu teléfono
   - Por USB
   - Por WhatsApp/email
   - Por Google Drive

### Paso 3: Instalar
1. Abre el administrador de archivos
2. Busca el archivo `.apk`
3. Presiona para abrir
4. Haz click en **"INSTALAR"**
5. ¡Listo! La app se instala 🎉

---

## 🎮 Ahora a Jugar

- ✅ Corre contra la IA
- ✅ Juega con un amigo (Multijugador)
- ✅ Cambia de tema
- ✅ Personaliza controles

---

## ❌ Solución de Problemas

### "El APK no se abre"
- Verifica que esté en formato `.apk`
- Intenta descargar desde una web (no desde email)

### "No puedo instalar aplicaciones desconocidas"
- Ve a: Ajustes → Apps → Google Play Store → Permisos → Permitir instalación de apps
- O: Ajustes → Seguridad → Activa "Fuentes desconocidas"

### "El script falla"
- Verifica tener Node.js instalado: `node --version`
- Instala Java SDK: [Descargar](https://www.oracle.com/java/)
- Intenta con el método manual

### "Chrome no me deja instalar la PWA"
- Recarga la página (Ctrl+R)
- Cierra Chrome completamente
- Abre de nuevo y espera a que cargue
- Presiona el menú nuevamente

---

## 📊 Comparativa: ¿Cuál elegir?

| Opción | Ventajas | Desventajas | Tiempo |
|--------|----------|-------------|--------|
| **PWA (GitHub Pages)** | Súper fácil, sin instalación, actualiza automático | Necesita internet | 1 min |
| **APK (Script)** | Funciona offline, control total, una sola instalación | Más tiempo de setup | 10 min |
| **APK (Manual)** | Control absoluto, aprendes más | Puede fallar | 30 min |

---

## 💡 Mi Recomendación

1. **Primero:** Prueba PWA (es lo más fácil)
2. **Si quieres offline:** Usa el script automático
3. **Si tienes problemas:** Consulta la sección de troubleshooting

---

## 📞 ¿Necesitas Ayuda?

✉️ Email: productosintegralesryf@gmail.com

🔗 Repositorio: [ryfproductosintegrales/pong-game](https://github.com/ryfproductosintegrales/pong-game)

---

**¡Disfruta jugando Pong en tu Android! 🎮🚀**
