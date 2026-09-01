"""
Global Time Tracker (v2 - Beautified)
--------------------------------------
A tiny always-on-top Windows desktop widget that shows the current time
in a list of timezones you choose, with a dark gradient theme and simple
hand-drawn landmark icons per city (Big Ben, Harbour Bridge, Eiffel Tower,
etc.) so each row is easy to recognize at a glance.

Requirements:
    Python 3.9+ (uses the built-in `zoneinfo` module)
    pip install tzdata

Run:
    python global_time_tracker.py

Package into a standalone .exe:
    pip install pyinstaller tzdata
    pyinstaller --onefile --noconsole --name "GlobalTimeTracker" global_time_tracker.py
"""

import json
import os
import sys
import tkinter as tk
from tkinter import simpledialog, messagebox
from datetime import datetime

try:
    from zoneinfo import ZoneInfo, available_timezones
except ImportError:
    messagebox.showerror("Error", "This app requires Python 3.9+.")
    sys.exit(1)

CONFIG_FILE = os.path.join(os.path.expanduser("~"), ".global_time_tracker.json")

DEFAULT_ZONES = [
    {"label": "New York", "tz": "America/New_York"},
    {"label": "Sydney", "tz": "Australia/Sydney"},
    {"label": "London", "tz": "Europe/London"},
    {"label": "Paris", "tz": "Europe/Paris"},
    {"label": "Dubai", "tz": "Asia/Dubai"},
]

CITY_ALIASES = {
    "sydney": "Australia/Sydney", "melbourne": "Australia/Melbourne",
    "brisbane": "Australia/Brisbane", "perth": "Australia/Perth",
    "adelaide": "Australia/Adelaide", "auckland": "Pacific/Auckland",
    "boston": "America/New_York", "new york": "America/New_York",
    "nyc": "America/New_York", "washington": "America/New_York",
    "chicago": "America/Chicago", "dallas": "America/Chicago",
    "denver": "America/Denver", "los angeles": "America/Los_Angeles",
    "san francisco": "America/Los_Angeles", "seattle": "America/Los_Angeles",
    "toronto": "America/Toronto", "vancouver": "America/Vancouver",
    "london": "Europe/London", "dublin": "Europe/Dublin",
    "paris": "Europe/Paris", "berlin": "Europe/Berlin",
    "madrid": "Europe/Madrid", "rome": "Europe/Rome",
    "amsterdam": "Europe/Amsterdam", "zurich": "Europe/Zurich",
    "moscow": "Europe/Moscow", "dubai": "Asia/Dubai",
    "mumbai": "Asia/Kolkata", "delhi": "Asia/Kolkata",
    "bangalore": "Asia/Kolkata", "singapore": "Asia/Singapore",
    "hong kong": "Asia/Hong_Kong", "tokyo": "Asia/Tokyo",
    "seoul": "Asia/Seoul", "shanghai": "Asia/Shanghai",
    "beijing": "Asia/Shanghai", "manila": "Asia/Manila",
    "jakarta": "Asia/Jakarta", "bangkok": "Asia/Bangkok",
}

# Keywords -> which icon to draw. Matched against the lowercased label/tz.
ICON_MAP = [
    (("sydney",), "bridge"),
    (("london", "dublin"), "bigben"),
    (("paris",), "eiffel"),
    (("new york", "nyc", "boston", "chicago", "toronto", "washington",
      "dallas", "seattle", "denver", "los angeles", "san francisco",
      "vancouver"), "skyline"),
    (("tokyo", "seoul", "osaka"), "torii"),
    (("dubai",), "burj"),
    (("mumbai", "delhi", "bangalore", "india"), "gate"),
    (("singapore",), "merlion"),
    (("hong kong", "shanghai", "beijing", "china"), "pagoda"),
    (("moscow",), "onion"),
    (("berlin", "amsterdam", "zurich", "madrid", "rome", "melbourne",
      "brisbane", "perth", "adelaide", "auckland", "manila", "jakarta",
      "bangkok"), "globe"),
]


def pick_icon(label: str, tz: str) -> str:
    text = f"{label} {tz}".lower()
    for keywords, icon in ICON_MAP:
        if any(k in text for k in keywords):
            return icon
    return "globe"


def resolve_timezone(user_input: str):
    raw = user_input.strip()
    key = raw.lower()
    if key in CITY_ALIASES:
        return CITY_ALIASES[key]
    if raw in available_timezones():
        return raw
    candidates = [z for z in available_timezones() if key.replace(" ", "_") in z.lower()]
    if len(candidates) == 1:
        return candidates[0]
    if len(candidates) > 1:
        candidates.sort(key=len)
        return candidates[0]
    return None


def load_zones():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r") as f:
                data = json.load(f)
                if isinstance(data, list) and data:
                    return data
        except Exception:
            pass
    return DEFAULT_ZONES.copy()


def save_zones(zones):
    try:
        with open(CONFIG_FILE, "w") as f:
            json.dump(zones, f, indent=2)
    except Exception:
        pass


# ---------------------------------------------------------------------
# Color palette
# ---------------------------------------------------------------------
BG_TOP = "#1a1a2e"
BG_BOTTOM = "#16213e"
CARD_BG = "#0f3460"
CARD_BG_SELECTED = "#533483"
ACCENT = "#e94560"
TEXT_MAIN = "#f1f1f1"
TEXT_SUB = "#a0aec0"
ICON_COLOR = "#f1f1f1"
TIME_COLOR = "#ffd369"


def draw_gradient(canvas, width, height, top_color, bottom_color):
    canvas.delete("bg")
    steps = max(height, 1)
    r1, g1, b1 = canvas.winfo_rgb(top_color)
    r2, g2, b2 = canvas.winfo_rgb(bottom_color)
    for i in range(steps):
        ratio = i / steps
        r = int(r1 + (r2 - r1) * ratio) >> 8
        g = int(g1 + (g2 - g1) * ratio) >> 8
        b = int(b1 + (b2 - b1) * ratio) >> 8
        color = f"#{r:02x}{g:02x}{b:02x}"
        canvas.create_line(0, i, width, i, fill=color, tags="bg")
    canvas.tag_lower("bg")


def draw_icon(canvas, cx, cy, size, icon_name, color=ICON_COLOR):
    """Draw a small original landmark-style icon centered at (cx, cy)."""
    s = size
    if icon_name == "bridge":  # Sydney Harbour Bridge - simple arch
        canvas.create_arc(cx - s, cy, cx + s, cy + s, start=0, extent=180,
                           style="arc", outline=color, width=3)
        canvas.create_line(cx - s, cy + s * 0.5, cx - s, cy + s, fill=color, width=3)
        canvas.create_line(cx + s, cy + s * 0.5, cx + s, cy + s, fill=color, width=3)
        canvas.create_line(cx - s, cy + s, cx + s, cy + s, fill=color, width=3)
    elif icon_name == "bigben":  # London Big Ben - tower with clock
        canvas.create_rectangle(cx - s * 0.3, cy - s, cx + s * 0.3, cy + s,
                                 outline=color, width=2)
        canvas.create_polygon(cx - s * 0.35, cy - s, cx, cy - s * 1.5, cx + s * 0.35, cy - s,
                               outline=color, fill="", width=2)
        canvas.create_oval(cx - s * 0.18, cy - s * 0.6, cx + s * 0.18, cy - s * 0.25,
                            outline=color, width=2)
        canvas.create_line(cx, cy - s * 0.42, cx, cy - s * 0.55, fill=color, width=1)
    elif icon_name == "eiffel":  # Paris Eiffel Tower - triangle lattice
        canvas.create_line(cx, cy - s * 1.4, cx - s * 0.9, cy + s, fill=color, width=2)
        canvas.create_line(cx, cy - s * 1.4, cx + s * 0.9, cy + s, fill=color, width=2)
        canvas.create_line(cx - s * 0.5, cy + s * 0.1, cx + s * 0.5, cy + s * 0.1, fill=color, width=2)
        canvas.create_line(cx - s * 0.25, cy - s * 0.5, cx + s * 0.25, cy - s * 0.5, fill=color, width=2)
    elif icon_name == "skyline":  # generic US city skyline
        bars = [(-0.9, 0.3), (-0.5, 0.9), (-0.1, 0.5), (0.3, 1.2), (0.7, 0.6)]
        for bx, bh in bars:
            x0 = cx + bx * s
            canvas.create_rectangle(x0, cy + s - bh * s, x0 + s * 0.3, cy + s,
                                     outline=color, fill="", width=2)
    elif icon_name == "torii":  # Japan torii gate
        canvas.create_line(cx - s, cy - s * 0.6, cx + s, cy - s * 0.6, fill=color, width=4)
        canvas.create_line(cx - s * 0.85, cy - s * 0.3, cx + s * 0.85, cy - s * 0.3, fill=color, width=3)
        canvas.create_line(cx - s * 0.7, cy - s * 0.3, cx - s * 0.7, cy + s, fill=color, width=3)
        canvas.create_line(cx + s * 0.7, cy - s * 0.3, cx + s * 0.7, cy + s, fill=color, width=3)
    elif icon_name == "burj":  # Dubai Burj-like spire
        canvas.create_polygon(cx - s * 0.25, cy + s, cx + s * 0.25, cy + s,
                               cx, cy - s * 1.5, outline=color, fill="", width=2)
        canvas.create_line(cx, cy - s * 1.5, cx, cy - s * 2, fill=color, width=2)
    elif icon_name == "gate":  # India Gate style arch
        canvas.create_line(cx - s * 0.6, cy + s, cx - s * 0.6, cy - s * 0.2, fill=color, width=3)
        canvas.create_line(cx + s * 0.6, cy + s, cx + s * 0.6, cy - s * 0.2, fill=color, width=3)
        canvas.create_arc(cx - s * 0.6, cy - s * 1.1, cx + s * 0.6, cy + s * 0.2,
                           start=0, extent=180, style="arc", outline=color, width=3)
    elif icon_name == "merlion":  # Singapore - simple wave + tower
        canvas.create_arc(cx - s, cy, cx, cy + s, start=0, extent=180, style="arc",
                           outline=color, width=2)
        canvas.create_arc(cx, cy, cx + s, cy + s, start=0, extent=180, style="arc",
                           outline=color, width=2)
        canvas.create_oval(cx - s * 0.15, cy - s * 0.9, cx + s * 0.15, cy - s * 0.6,
                            outline=color, width=2)
    elif icon_name == "pagoda":  # China/HK pagoda
        for i, w in enumerate([0.9, 0.7, 0.5]):
            y = cy - s * 0.2 * i
            canvas.create_polygon(cx - s * w, y, cx + s * w, y, cx, y - s * 0.4,
                                   outline=color, fill="", width=2)
        canvas.create_line(cx, cy - s * 0.8, cx, cy - s * 1.3, fill=color, width=2)
    elif icon_name == "onion":  # Moscow onion dome
        canvas.create_oval(cx - s * 0.4, cy - s, cx + s * 0.4, cy - s * 0.2,
                            outline=color, width=2)
        canvas.create_polygon(cx - s * 0.05, cy - s * 1.3, cx + s * 0.05, cy - s * 1.3,
                               cx, cy - s * 1.6, outline=color, fill="", width=2)
        canvas.create_rectangle(cx - s * 0.3, cy - s * 0.2, cx + s * 0.3, cy + s,
                                 outline=color, width=2)
    else:  # globe fallback
        canvas.create_oval(cx - s, cy - s, cx + s, cy + s, outline=color, width=2)
        canvas.create_line(cx - s, cy, cx + s, cy, fill=color, width=1)
        canvas.create_oval(cx - s * 0.4, cy - s, cx + s * 0.4, cy + s, outline=color, width=1)


class GlobalTimeTracker(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Global Time Tracker")
        self.attributes("-topmost", True)
        self.geometry("340x460+80+80")
        self.minsize(300, 200)
        self.configure(bg=BG_TOP)

        self.zones = load_zones()
        self.selected_index = -1
        self.row_widgets = []  # list of dicts with canvas + item ids

        self._build_ui()
        self.after(50, self._tick)

    # ---------- UI ----------
    def _build_ui(self):
        header = tk.Frame(self, bg=BG_TOP)
        header.pack(fill="x", side="top")

        btn_style = dict(bg=CARD_BG, fg=TEXT_MAIN, activebackground=ACCENT,
                          activeforeground=TEXT_MAIN, relief="flat", bd=0,
                          font=("Segoe UI", 9), padx=8, pady=3, cursor="hand2")

        tk.Button(header, text="+ Add", command=self.add_zone, **btn_style).pack(
            side="left", padx=6, pady=6)
        tk.Button(header, text="Remove", command=self.remove_zone, **btn_style).pack(
            side="left", pady=6)
        self.top_btn = tk.Button(header, text="\u2299 On Top: On",
                                  command=self.toggle_topmost, **btn_style)
        self.top_btn.pack(side="right", padx=6, pady=6)

        self.bg_canvas = tk.Canvas(self, highlightthickness=0, bg=BG_TOP)
        self.bg_canvas.pack(fill="both", expand=True)
        self.bg_canvas.bind("<Configure>", self._on_resize)

        self._render_rows()

    def _on_resize(self, event):
        draw_gradient(self.bg_canvas, event.width, event.height, BG_TOP, BG_BOTTOM)
        self._layout_rows()

    def _render_rows(self):
        self.bg_canvas.delete("row")
        self.row_widgets = []
        self._layout_rows()

    def _layout_rows(self):
        self.bg_canvas.delete("row")
        self.row_widgets = []
        width = self.bg_canvas.winfo_width() or 340
        pad = 10
        row_h = 70
        y = 10
        for i, zone in enumerate(self.zones):
            selected = (i == self.selected_index)
            card_color = CARD_BG_SELECTED if selected else CARD_BG
            rect = self.bg_canvas.create_rectangle(
                pad, y, width - pad, y + row_h, fill=card_color, outline="",
                tags=("row", f"row{i}"))
            self.bg_canvas.tag_bind(rect, "<Button-1>", lambda e, idx=i: self._select(idx))

            icon_cx = pad + 32
            icon_cy = y + row_h / 2
            icon_name = pick_icon(zone["label"], zone["tz"])
            draw_icon(self.bg_canvas, icon_cx, icon_cy, 14, icon_name)
            self.bg_canvas.addtag_withtag("row", "all")

            text_x = pad + 64
            city_id = self.bg_canvas.create_text(
                text_x, y + 14, text=zone["label"], anchor="w",
                fill=TEXT_MAIN, font=("Segoe UI", 12, "bold"), tags=("row", f"row{i}"))
            time_id = self.bg_canvas.create_text(
                text_x, y + 36, text="--:--:--", anchor="w",
                fill=TIME_COLOR, font=("Segoe UI", 15, "bold"), tags=("row", f"row{i}"))
            date_id = self.bg_canvas.create_text(
                text_x, y + 56, text="", anchor="w",
                fill=TEXT_SUB, font=("Segoe UI", 8), tags=("row", f"row{i}"))
            offset_id = self.bg_canvas.create_text(
                width - pad - 10, y + 14, text="", anchor="e",
                fill=TEXT_SUB, font=("Segoe UI", 8), tags=("row", f"row{i}"))

            for item_id in (rect, city_id, time_id, date_id, offset_id):
                self.bg_canvas.tag_bind(item_id, "<Button-1>", lambda e, idx=i: self._select(idx))

            self.row_widgets.append({
                "rect": rect, "time": time_id, "date": date_id, "offset": offset_id
            })
            y += row_h + 8

    def _select(self, idx):
        self.selected_index = idx
        self._layout_rows()

    # ---------- behavior ----------
    def toggle_topmost(self):
        current = self.attributes("-topmost")
        self.attributes("-topmost", not current)
        self.top_btn.config(text=f"\u2299 On Top: {'On' if not current else 'Off'}")

    def add_zone(self):
        user_input = simpledialog.askstring(
            "Add timezone",
            "Enter a city name (e.g. Boston, Tokyo, Mumbai)\nor an IANA timezone (e.g. Asia/Kolkata):",
            parent=self,
        )
        if not user_input:
            return
        tz_name = resolve_timezone(user_input)
        if not tz_name:
            messagebox.showerror("Not found", f"Couldn't find a timezone matching '{user_input}'.")
            return
        label = simpledialog.askstring(
            "Label", "Display name for this entry:", initialvalue=user_input.title(), parent=self
        ) or user_input.title()

        self.zones.append({"label": label, "tz": tz_name})
        save_zones(self.zones)
        self._layout_rows()

    def remove_zone(self):
        idx = self.selected_index
        if idx < 0 or idx >= len(self.zones):
            messagebox.showinfo("Remove", "Click a timezone row first to select it, then Remove.")
            return
        self.zones.pop(idx)
        save_zones(self.zones)
        self.selected_index = -1
        self._layout_rows()

    def _tick(self):
        now_utc = datetime.now(ZoneInfo("UTC"))
        for zone, widgets in zip(self.zones, self.row_widgets):
            try:
                tz = ZoneInfo(zone["tz"])
            except Exception:
                continue
            local_time = now_utc.astimezone(tz)
            time_str = local_time.strftime("%I:%M:%S %p").lstrip("0")
            date_str = local_time.strftime("%a, %d %b %Y")
            offset = local_time.utcoffset()
            hours = offset.total_seconds() / 3600 if offset else 0
            sign = "+" if hours >= 0 else "-"
            offset_str = f"UTC{sign}{abs(hours):g}"

            self.bg_canvas.itemconfig(widgets["time"], text=time_str)
            self.bg_canvas.itemconfig(widgets["date"], text=date_str)
            self.bg_canvas.itemconfig(widgets["offset"], text=offset_str)

        self.after(1000, self._tick)


if __name__ == "__main__":
    app = GlobalTimeTracker()
    app.mainloop()
