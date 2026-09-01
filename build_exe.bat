@echo off
REM Build script for Global Time Tracker
REM Run this on a Windows machine with Python installed.

echo Installing build dependencies...
py -m pip install --upgrade pyinstaller tzdata

echo Building GlobalTimeTracker.exe ...
py -m PyInstaller --onefile --noconsole --name "GlobalTimeTracker" global_time_tracker.py

echo.
echo Done! Your app is at: dist\GlobalTimeTracker.exe
echo You can copy that file anywhere - e.g. your Desktop - and double-click it to run.
pause
