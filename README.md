# Global Time Tracker

A tiny always-on-top desktop widget for Windows that shows the current time
in whatever cities/timezones you add — so you always know what "6pm AEST"
means for someone joining from Boston, London, Tokyo, etc.

## Features
- Dark gradient theme with a card per city, each with a simple original
  landmark icon (Harbour Bridge, Big Ben, Eiffel Tower, skyline, torii gate, etc.)
- Comes pre-loaded with **New York, Sydney, London, Paris, and Dubai**
- 130+ cities recognized by name when adding a new one
- Add/remove any city or IANA timezone
- Shows time, date, and UTC offset for each entry
- Remembers your list between runs
- Updates live, every second
- Always-on-top toggle

## Download
Grab `GlobalTimeTracker.exe` from the [Releases](../../releases) page —
no installation or Python required. Just double-click it to run.

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
- The city list built into "+ Add" covers 130+ common cities, but you can
  always type any valid IANA timezone name directly (e.g. `Europe/Warsaw`).
- Icons are simple original vector drawings (not photos or trademarked
  logos), so there are no copyright concerns distributing the app.
