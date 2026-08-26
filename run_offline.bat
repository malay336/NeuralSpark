@echo off
setlocal enabledelayedexpansion
title NeuralSpark Offline Suite
color 0b

:: Change working directory to repository root
cd /d "%~dp0"

echo ===============================================================================
echo                NEURALSPARK OFFLINE PLATFORM LAUNCHER
echo          Empowering Rural & Offline Classrooms with AI Education
echo ===============================================================================
echo.

:: 1. Check Python & Virtual Environment
echo [1/4] Verifying Python Backend Environment...
if not exist "backend\venv\Scripts\python.exe" (
    echo [INFO] Python virtual environment not found at backend\venv.
    echo Creating virtual environment now...
    python -m venv backend\venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create python virtualenv. Please ensure Python is installed and added to PATH.
        pause
        exit /b 1
    )
    echo Installing backend dependencies from requirements.txt...
    call backend\venv\Scripts\activate.bat
    pip install -r backend\requirements.txt
) else (
    echo [OK] Python virtual environment detected.
)

:: 2. Run Database Migrations & Ensure Superuser
echo.
echo [2/4] Synchronizing Local SQLite Database and Admin User...
cd backend
call venv\Scripts\activate.bat
python manage.py migrate --noinput
python scripts\create_superuser.py
cd ..
echo [OK] Database schema up-to-date and superuser verified.

:: 3. Check Frontend Dependencies
echo.
echo [3/4] Verifying Next.js Frontend Environment...
if not exist "frontend\node_modules" (
    echo [INFO] Frontend node_modules not found. Running npm install...
    cd frontend
    call npm install
    cd ..
) else (
    echo [OK] Frontend node_modules detected.
)

:: 4. Start Backend Server in Background Window
echo.
echo [4/4] Starting NeuralSpark Services...
echo -^> Launching Django Backend Server on http://localhost:8000 ...
start "NeuralSpark Backend (Django API :8000)" cmd /k "title NeuralSpark Backend (Django API :8000) && color 0b && cd /d "%~dp0backend" && call venv\Scripts\activate.bat && python manage.py runserver 0.0.0.0:8000"

:: Wait 3 seconds for backend initialization
timeout /t 3 /nobreak > nul

:: Start Frontend Server in Background Window
echo -^> Launching Next.js Frontend Server on http://localhost:3000 ...
start "NeuralSpark Frontend (Next.js :3000)" cmd /k "title NeuralSpark Frontend (Next.js :3000) && color 0d && cd /d "%~dp0frontend" && npm run dev"

:: Wait 4 seconds for frontend initialization
timeout /t 4 /nobreak > nul

:: Open Browser Automatically
echo -^> Opening NeuralSpark in your default browser...
start http://localhost:3000

:MENU
cls
color 0a
echo ===============================================================================
echo                   NEURALSPARK OFFLINE PLATFORM RUNNING
echo ===============================================================================
echo.
echo   [ACTIVE SERVICES & ENDPOINTS]
echo   -----------------------------------------------------------------------------
echo   [1] Web Application:       http://localhost:3000
echo   [2] Django Admin CMS:       http://localhost:8000/admin (User: admin / admin123)
echo   [3] Content Upload Portal:  http://localhost:3000/upload
echo   [4] Practice & PYQ Section: http://localhost:3000/learning/pyqs
echo   [5] Theory Notes & Guides:  http://localhost:3000/learning/theory
echo   [6] Interactive Quizzes:    http://localhost:3000/learning/quizzes
echo   [7] Video Lectures:         http://localhost:3000/learning/lectures
echo   [8] Interactive API Docs:   http://localhost:8000/api/docs (OpenAPI/Swagger)
echo.
echo   [LOCAL AI INTEGRATION]
echo   -----------------------------------------------------------------------------
echo   - Local LLM: Ollama (mistral/llama3) at http://localhost:11434
echo   - Local Speech: Vosk (STT) ^& Piper (TTS) offline pipeline
echo.
echo ===============================================================================
echo                         QUICK LAUNCHER ACTIONS
echo ===============================================================================
echo   [1] Open Web App (localhost:3000)
echo   [2] Open Django Admin CMS (localhost:8000/admin)
echo   [3] Open Content Upload Portal (localhost:3000/upload)
echo   [4] Open Practice & PYQ Section
echo   [5] Open Theory Notes & Guides
echo   [6] Open Interactive Quizzes
echo   [7] Open Video Lectures
echo   [8] Open Interactive REST API Docs (Swagger)
echo   [S] Re-seed 8 Official Subjects (Full Educational Dataset)
echo   [C] Clear All Uploaded Questions from Database
echo   [Q] Quit Launcher Menu (Servers will continue in their separate windows)
echo.
set /p CHOICE="Enter choice [1-8, S, C, Q]: "

if /i "%CHOICE%"=="1" (
    start http://localhost:3000
    goto MENU
)
if /i "%CHOICE%"=="2" (
    start http://localhost:8000/admin
    goto MENU
)
if /i "%CHOICE%"=="3" (
    start http://localhost:3000/upload
    goto MENU
)
if /i "%CHOICE%"=="4" (
    start http://localhost:3000/learning/pyqs
    goto MENU
)
if /i "%CHOICE%"=="5" (
    start http://localhost:3000/learning/theory
    goto MENU
)
if /i "%CHOICE%"=="6" (
    start http://localhost:3000/learning/quizzes
    goto MENU
)
if /i "%CHOICE%"=="7" (
    start http://localhost:3000/learning/lectures
    goto MENU
)
if /i "%CHOICE%"=="8" (
    start http://localhost:8000/api/docs
    goto MENU
)
if /i "%CHOICE%"=="S" (
    echo.
    echo Seeding all 8 official subjects with lectures, theory, PYQs, and quizzes...
    cd /d "%~dp0backend"
    call venv\Scripts\activate.bat
    python scripts\seed_all_content_8_subjects.py
    cd /d "%~dp0"
    echo Done! Press any key to return to menu...
    pause > nul
    goto MENU
)
if /i "%CHOICE%"=="C" (
    echo.
    echo Clearing all uploaded questions from database...
    cd /d "%~dp0backend"
    call venv\Scripts\activate.bat
    python scripts\clear_all_questions.py
    cd /d "%~dp0"
    echo Done! Press any key to return to menu...
    pause > nul
    goto MENU
)
if /i "%CHOICE%"=="Q" (
    echo.
    echo Exiting launcher menu. Background servers remain active in their respective command windows.
    timeout /t 2 > nul
    exit /b 0
)

echo Invalid selection, please try again.
timeout /t 2 > nul
goto MENU
