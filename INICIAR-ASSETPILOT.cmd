@echo off
title AssetPilot - Gestao de Ativos
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0iniciar-assetpilot.ps1"
if errorlevel 1 (
  echo.
  echo O AssetPilot nao foi iniciado. Confira a mensagem acima.
  pause
)
