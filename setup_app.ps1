
$ErrorActionPreference = "Stop"

Write-Host "Starting VAYA Setup..."

# 0. Force Environment Refresh
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 1. Setup Backend
$backendDir = Join-Path $PSScriptRoot "backend"
Write-Host "Switching to $backendDir"
Set-Location -LiteralPath $backendDir

# 2. Create Venv
$python = "python"
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..."
    & $python -m venv venv
}

# 3. Define Venv Python Path
$venvPython = ".\venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    Write-Error "Virtual environment python not found at $venvPython"
}

# 4. Install Dependencies
Write-Host "Installing backend dependencies..."
& $venvPython -m pip install --upgrade pip
& $venvPython -m pip install -r requirements.txt

# 5. Seed Database
Write-Host "Seeding Database..."
$env:PYTHONPATH = $backendDir
try {
    & $venvPython -m app.data.seed_db
    Write-Host "Database seeded successfully!"
} catch {
    Write-Warning "Seeding failed. Details: $_"
}

# 6. Start Server
Write-Host "Starting Backend Server..."
Write-Host "Frontend is running separately. Go to http://localhost:3000"

& $venvPython -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
