#!/bin/bash
# Script automático para generar APK con Cordova
# Para Windows: Usa Git Bash o WSL
# Para Mac/Linux: Ejecuta directamente

echo "🎮 ============================================"
echo "   GENERADOR AUTOMÁTICO DE APK - PONG GAME"
echo "============================================"

# Verificar si Cordova está instalado
if ! command -v cordova &> /dev/null; then
    echo "❌ Cordova no está instalado"
    echo "Instalando Cordova..."
    npm install -g cordova
fi

# Crear carpeta temporal
PROJECT_NAME="PongGame_APK"
echo ""
echo "📁 Creando proyecto: $PROJECT_NAME"
cordova create $PROJECT_NAME com.pongame.app "Pong Game"
cd $PROJECT_NAME

# Agregar plataforma Android
echo ""
echo "🤖 Agregando plataforma Android..."
cordova platform add android

# Descargar index.html desde GitHub
echo ""
echo "⬇️  Descargando juego desde GitHub..."
curl -o www/index.html https://raw.githubusercontent.com/ryfproductosintegrales/pong-game/main/index.html

# Compilar APK
echo ""
echo "⚙️  Compilando APK (esto puede tardar 2-5 minutos)..."
cordova build android

echo ""
echo "✅ ============================================"
echo "   ¡APK GENERADO CORRECTAMENTE!"
echo "============================================"
echo ""
echo "📱 Tu APK está en:"
echo "   $PROJECT_NAME/platforms/android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "📥 Para instalar en tu Android:"
echo "   1. Copia el archivo .apk a tu teléfono"
echo "   2. Abre Ajustes > Seguridad > Desconocer orígenes (ON)"
echo "   3. Abre el archivo .apk y presiona INSTALAR"
echo ""
echo "🎉 ¡Disfruta tu Pong Game!"
