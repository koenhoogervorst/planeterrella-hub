@echo off
REM ============================================================
REM  Planeterrella Projecthub starten
REM  Dubbelklik dit bestand. De hub opent vanzelf in je browser.
REM  Sluit dit zwarte venster als je klaar bent.
REM ============================================================
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js is niet gevonden.
  echo  Installeer het eenmalig via https://nodejs.org en probeer opnieuw.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo.
  echo  Eenmalig installeren, dit duurt even...
  echo.
  call npm install --no-fund --no-audit
  if errorlevel 1 goto mislukt
)

if not exist "dist\index.html" (
  echo.
  echo  Klaarmaken voor gebruik...
  echo.
  call npm run build
  if errorlevel 1 goto mislukt
)

echo.
echo  De projecthub opent nu in je browser op http://localhost:5184
echo  Laat dit venster openstaan zolang je de hub gebruikt.
echo.
call npm run preview
goto einde

:mislukt
echo.
echo  Er ging iets mis. Lees de melding hierboven.
echo.
pause

:einde
endlocal
