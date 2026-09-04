# Global Time Tracker

A multi-timezone clock that shows the current time in cities around the
world — so you always know what "6pm AEST" means for someone joining from
Boston, London, Tokyo, etc. Available as a **Windows desktop widget** and
as an **embeddable web widget** for any website.

---

## 🖥️ Desktop app (Windows)

A tiny always-on-top desktop widget.

**Features:**
- Dark gradient theme with a card per city, each with a simple original
  landmark icon (Harbour Bridge, Big Ben, Eiffel Tower, skyline, torii gate, etc.)
- Comes pre-loaded with **New York, Sydney, London, Paris, and Dubai**
- 130+ cities recognized by name when adding a new one
- Add/remove any city or IANA timezone
- Shows time, date, and UTC offset for each entry
- Remembers your list between runs
- Updates live, every second
- Always-on-top toggle

**Download:** Grab `GlobalTimeTracker.exe` from the [Releases](../../releases)
page — no installation or Python required. Just double-click it to run.

**Using it day to day:**
- **Add a timezone**: click "+ Add", type a city name, give it a short label.
- **Remove a timezone**: click on the row to select it (it highlights purple),
  then click "Remove".
- **Keep it on top of everything**: it's on-top by default; click the button
  to toggle it off.
- **Move it**: just drag the window like any normal Windows app.

**Notes:**
- Your list of timezones is saved to `.global_time_tracker.json` in your
  home folder, so it persists across restarts.
- The city list built into "+ Add" covers 130+ common cities, but you can
  always type any valid IANA timezone name directly (e.g. `Europe/Warsaw`).
- Icons are simple original vector drawings (not photos or trademarked
  logos), so there are no copyright concerns distributing the app.

---

## 🌐 Web widget (embeddable)

A self-contained JavaScript widget you can drop into any website — no
build tools, no dependencies, no framework required.

**Embed it:**
```html
<div id="global-time-tracker"></div>
<script src="https://bharat1835.github.io/global-time-tracker/web/gtt-widget.js"></script>
```

If GitHub Pages isn't enabled yet, this raw file URL works immediately instead:
```html
<script src="https://raw.githubusercontent.com/bharat1835/global-time-tracker/main/web/gtt-widget.js"></script>
```

**Customize which cities show:**
```html
<div class="gtt-widget" data-cities="Tokyo,Mumbai,Berlin,Sao Paulo"></div>
```
Multiple widgets can run independently on the same page.

**Features:**
- Comes pre-loaded with New York, Sydney, London, Delhi, and Dubai
- **Source-time conversion**: pick any configured city and a time, hit
  Apply, and see that time converted across every other city instantly
  (DST-aware). Auto-reverts to live time after 15 seconds.
- Original landmark-style icons per city
- Styled with Shadow DOM, so it never clashes with the host site's CSS

See `web/demo.html` for a working example — it loads the widget straight from
the live GitHub Pages URL above, so opening that file shows exactly what
embedding it on any website looks like.

---

## License / attribution
Icons throughout are simple original vector drawings (not photos or
trademarked logos), so there are no copyright concerns using or
distributing either version of this project.
