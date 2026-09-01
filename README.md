# Global Time Tracker

A tiny always-on-top desktop widget for Windows that shows the current time
in whatever cities/timezones you add — so you always know what "6pm AEST"
means for someone joining from Boston, London, Tokyo, etc.

## Features
- Dark gradient theme with a card per city, each with a simple original
  landmark icon (Harbour Bridge, Big Ben, Eiffel Tower, skyline, torii gate, etc.)
- Comes pre-loaded with **New York, Sydney, London, Paris, and Dubai**
- Add/remove any city or IANA timezone
- Shows time, date, and UTC offset for each entry
- Remembers your list between runs
- Updates live, every second
- Always-on-top toggle

## Quick start (run with Python)
1. Install Python 3.9+ from https://python.org (check "Add python.exe to PATH").
2. Open a terminal in this folder and run:
   ```
   pip install tzdata
   python global_time_tracker.py
   ```
   (If `python` isn't recognized, use `py` instead: `py -m pip install tzdata` then `py global_time_tracker.py`)

## Turning it into a standalone .exe (no Python needed to run it later)
Easiest way — just double-click **build_exe.bat** in this folder (on Windows).
It will install PyInstaller and produce `dist\GlobalTimeTracker.exe`.

Or manually:
```
pip install pyinstaller tzdata
pyinstaller --onefile --noconsole --name "GlobalTimeTracker" global_time_tracker.py
```
The finished app will be at `dist\GlobalTimeTracker.exe` — copy it anywhere
(e.g. Desktop) and double-click to run. No Python install needed on the
machine that runs it.

To make it start automatically with Windows:
1. Press `Win + R`, type `shell:startup`, hit Enter.
2. Copy a shortcut to `GlobalTimeTracker.exe` into that folder.

## Distributing it to other people / "app store" options
A couple of important realities about distribution, so you can pick the
right path:

- **A real listing on the Microsoft Store** requires packaging the app as
  an MSIX package and registering as a Microsoft developer (one-time fee,
  ~US$19 for individuals), then going through Store certification review.
  It's very doable for an app this simple, but it's a separate process from
  building the .exe itself — Microsoft's own tool for this is the
  MSIX Packaging Tool (learn.microsoft.com/windows/msix/packaging-tool/tool-overview).
- **Simplest path to "share it with people"**: build the `.exe` as above,
  then upload it somewhere people can download from directly — GitHub
  Releases (free, and it's the standard way small utility apps like this
  get distributed), a shared Google Drive/OneDrive link, or your own
  website. Most users just download the `.exe` and run it directly —
  no store needed.
- **If you specifically want Store distribution**, the realistic next
  steps are: (1) get a Microsoft Partner Center developer account, (2) use
  the MSIX Packaging Tool or `pyinstaller` + a manual MSIX wrapper, (3)
  submit for certification. Happy to help you generate the MSIX manifest
  when you're ready for that step — it's a bit more involved than the
  .exe build.

For now, the `.exe` from `build_exe.bat` is the fastest way to get this
running as a proper Windows app, shareable via a simple download link.

## Using it day to day
- **Add a timezone**: click "+ Add", type a city name, give it a short label.
- **Remove a timezone**: click on the row to select it (it highlights purple),
  then click "Remove".
- **Keep it on top of everything**: it's on-top by default; click the button
  to toggle it off.
- **Move it**: just drag the window like any normal Windows app.

## Notes
- Your list of timezones is saved to `.global_time_tracker.json` in your
  home folder, so it persists across restarts.
- The city list built into "+ Add" covers common cities, but you can always
  type any valid IANA timezone name directly (e.g. `Europe/Warsaw`).
- Icons are simple original vector drawings (not photos or trademarked
  logos), so there are no copyright concerns distributing the app.
