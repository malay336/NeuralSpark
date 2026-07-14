@echo off
title NeuralSpark Offline Launcher
color 0a

echo ==============================================
echo      Starting NeuralSpark Offline Environment
echo ==============================================
echo.

echo [Optional] To run Local AI integrations, make sure Ollama/Vosk/Piper are running globally.
echo.

echo [1/3] Starting Local Backend Server (Django)...
:: Start backend in a new command window so it runs independently
start "NeuralSpark Backend Server" cmd /c "title NeuralSpark Backend Server && color 0b && cd backend && call venv\Scripts\activate.bat && python manage.py runserver"

echo [2/3] Waiting for Backend to Initialize...
:: Give the backend a few seconds to boot up before hitting the frontend
timeout /t 5 /nobreak > nul

echo [3/3] Starting Local Frontend Server (Next.js)...
:: Start frontend in a new command window
start "NeuralSpark Frontend Server" cmd /c "title NeuralSpark Frontend Server && color 0d && cd frontend && npm run dev"

echo.
echo ==============================================
echo Services have been launched in separate windows!
echo.
echo -^> Django API URL: http://localhost:8000
echo -^> Web App URL:    http://localhost:3000
echo ==============================================
echo.
echo You can now minimize this window. Press any key to exit this launcher window...
pause > nul
