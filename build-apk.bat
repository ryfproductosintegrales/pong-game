@echo off
color 0A
echo.
echo 🎮 ============================================
echo    GENERADOR AUTOMATICO DE APK - PONG GAME
echo ============================================
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado
    echo Descárgalo de: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si Cordova está instalado
where cordova >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚙️  Instalando Cordova globalmente...
    call npm install -g cordova
)

REM Crear proyecto
set PROJECT_NAME=PongGame_APK
echo.
echo 📁 Creando proyecto: %PROJECT_NAME%
call cordova create %PROJECT_NAME% com.pongame.app "Pong Game"
cd /d %PROJECT_NAME%

REM Agregar plataforma Android
echo.
echo 🤖 Agregando plataforma Android...
echo (Esto puede tardar 1-2 minutos)
call cordova platform add android

REM Descargar index.html
echo.
echo ⬇️  Descargando juego desde GitHub...
powershell -Command "(New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/ryfproductosintegrales/pong-game/main/index.html', 'www/index.html')"

REM Compilar APK
echo.
echo ⚙️  Compilando APK...
echo (Esto puede tardar 3-5 minutos, sé paciente...)
call cordova build android

echo.
echo ✅ ============================================
echo    ¡APK GENERADO CORRECTAMENTE!
echo ============================================
echo.
echo 📱 Tu APK está en:
echo    %CD%\platforms\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 📥 Para instalar en tu Android:
echo    1. Copia el archivo .apk a tu teléfono
echo    2. Abre Ajustes ^> Seguridad ^> Desconocer orígenes (ON)
echo    3. Abre el archivo .apk y presiona INSTALAR
echo.
echo 🎉 ¡Disfruta tu Pong Game!
echo.
pause
