/*!
 * Global Time Tracker - Embeddable Widget
 * Drop this script into any website to show a live multi-timezone clock.
 *
 * Usage:
 *   <div id="global-time-tracker" data-cities="New York,Sydney,London,Delhi,Dubai"></div>
 *   <script src="https://YOUR-USERNAME.github.io/global-time-tracker/gtt-widget.js"></script>
 *
 * If no data-cities attribute is given, defaults to:
 *   New York, Sydney, London, Delhi, Dubai
 *
 * Multiple widgets on the same page are supported - each <div id="global-time-tracker">
 * (or any element with class="gtt-widget") gets its own independent instance.
 */
(function () {
  "use strict";

  var CITY_TZ = {
    "new york": "America/New_York", "boston": "America/New_York",
    "nyc": "America/New_York", "washington": "America/New_York",
    "miami": "America/New_York", "atlanta": "America/New_York",
    "chicago": "America/Chicago", "dallas": "America/Chicago",
    "houston": "America/Chicago", "austin": "America/Chicago",
    "denver": "America/Denver", "phoenix": "America/Phoenix",
    "los angeles": "America/Los_Angeles", "san francisco": "America/Los_Angeles",
    "san jose": "America/Los_Angeles", "seattle": "America/Los_Angeles",
    "las vegas": "America/Los_Angeles", "san diego": "America/Los_Angeles",
    "toronto": "America/Toronto", "vancouver": "America/Vancouver",
    "montreal": "America/Toronto",
    "mexico city": "America/Mexico_City", "sao paulo": "America/Sao_Paulo",
    "buenos aires": "America/Argentina/Buenos_Aires",
    "santiago": "America/Santiago", "bogota": "America/Bogota",
    "lima": "America/Lima",
    "sydney": "Australia/Sydney", "melbourne": "Australia/Melbourne",
    "brisbane": "Australia/Brisbane", "perth": "Australia/Perth",
    "adelaide": "Australia/Adelaide", "auckland": "Pacific/Auckland",
    "honolulu": "Pacific/Honolulu",
    "london": "Europe/London", "dublin": "Europe/Dublin",
    "paris": "Europe/Paris", "berlin": "Europe/Berlin",
    "madrid": "Europe/Madrid", "rome": "Europe/Rome",
    "amsterdam": "Europe/Amsterdam", "zurich": "Europe/Zurich",
    "vienna": "Europe/Vienna", "warsaw": "Europe/Warsaw",
    "lisbon": "Europe/Lisbon", "athens": "Europe/Athens",
    "stockholm": "Europe/Stockholm", "istanbul": "Europe/Istanbul",
    "moscow": "Europe/Moscow",
    "dubai": "Asia/Dubai", "abu dhabi": "Asia/Dubai",
    "doha": "Asia/Qatar", "riyadh": "Asia/Riyadh",
    "tel aviv": "Asia/Jerusalem", "cairo": "Africa/Cairo",
    "mumbai": "Asia/Kolkata", "delhi": "Asia/Kolkata",
    "bangalore": "Asia/Kolkata", "chennai": "Asia/Kolkata",
    "karachi": "Asia/Karachi", "dhaka": "Asia/Dhaka",
    "colombo": "Asia/Colombo",
    "singapore": "Asia/Singapore", "hong kong": "Asia/Hong_Kong",
    "tokyo": "Asia/Tokyo", "osaka": "Asia/Tokyo", "seoul": "Asia/Seoul",
    "shanghai": "Asia/Shanghai", "beijing": "Asia/Shanghai",
    "taipei": "Asia/Taipei", "manila": "Asia/Manila",
    "jakarta": "Asia/Jakarta", "bangkok": "Asia/Bangkok",
    "kuala lumpur": "Asia/Kuala_Lumpur",
    "johannesburg": "Africa/Johannesburg", "cape town": "Africa/Johannesburg",
    "lagos": "Africa/Lagos", "nairobi": "Africa/Nairobi"
  };

  var ICONS = {
    bridge: '<path d="M4 34 Q24 8 44 34" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M8 24 V34 M40 24 V34 M4 34 H44" stroke="currentColor" stroke-width="2.5" fill="none"/>',
    bigben: '<rect x="17" y="10" width="14" height="24" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 10 L24 3 L33 10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="19" r="5" fill="none" stroke="currentColor" stroke-width="2"/>',
    eiffel: '<path d="M24 4 L8 34 M24 4 L40 34 M13 24 H35 M18 14 H30" stroke="currentColor" stroke-width="2" fill="none"/>',
    skyline: '<rect x="4" y="24" width="7" height="12" fill="none" stroke="currentColor" stroke-width="2"/><rect x="13" y="14" width="7" height="22" fill="none" stroke="currentColor" stroke-width="2"/><rect x="22" y="20" width="7" height="16" fill="none" stroke="currentColor" stroke-width="2"/><rect x="31" y="9" width="7" height="27" fill="none" stroke="currentColor" stroke-width="2"/>',
    torii: '<path d="M6 15 H42 M9 21 H39 M13 21 V36 M35 21 V36" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>',
    burj: '<path d="M20 36 L20 12 L24 4 L28 12 L28 36 Z" fill="none" stroke="currentColor" stroke-width="2"/>',
    gate: '<path d="M12 36 V16 A12 12 0 0 1 36 16 V36" fill="none" stroke="currentColor" stroke-width="2.5"/>',
    merlion: '<path d="M4 30 Q14 20 24 30 Q34 20 44 30" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="24" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>',
    pagoda: '<path d="M12 30 H36 L24 22 Z M15 22 H33 L24 15 Z M18 15 H30 L24 9 Z M24 9 V4" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
    onion: '<ellipse cx="24" cy="14" rx="8" ry="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M22 4 H26 L24 -1 Z" stroke="currentColor" stroke-width="2" fill="none"/><rect x="17" y="20" width="14" height="16" fill="none" stroke="currentColor" stroke-width="2"/>',
    globe: '<circle cx="24" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 20 H38 M24 6 Q32 20 24 34 Q16 20 24 6" stroke="currentColor" stroke-width="2" fill="none"/>'
  };

  var ICON_RULES = [
    [["sydney"], "bridge"],
    [["london", "dublin"], "bigben"],
    [["paris"], "eiffel"],
    [["new york", "nyc", "boston", "chicago", "toronto", "washington", "dallas",
      "seattle", "denver", "los angeles", "san francisco", "san jose", "vancouver",
      "miami", "atlanta", "houston", "austin", "phoenix", "las vegas", "san diego",
      "montreal", "honolulu"], "skyline"],
    [["tokyo", "seoul", "osaka"], "torii"],
    [["dubai", "abu dhabi"], "burj"],
    [["mumbai", "delhi", "bangalore", "chennai", "karachi", "dhaka", "colombo"], "gate"],
    [["singapore"], "merlion"],
    [["hong kong", "shanghai", "beijing", "taipei"], "pagoda"],
    [["moscow"], "onion"]
  ];

  function pickIcon(label) {
    var text = label.toLowerCase();
    for (var i = 0; i < ICON_RULES.length; i++) {
      var keywords = ICON_RULES[i][0];
      for (var j = 0; j < keywords.length; j++) {
        if (text.indexOf(keywords[j]) !== -1) return ICON_RULES[i][1];
      }
    }
    return "globe";
  }

  function resolveTz(cityName) {
    var key = cityName.trim().toLowerCase();
    if (CITY_TZ[key]) return CITY_TZ[key];
    // allow passing a raw IANA name directly, e.g. "Europe/Warsaw"
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: cityName }).format(new Date());
      return cityName;
    } catch (e) {
      return null;
    }
  }

  function tzOffsetMinutes(instant, tz) {
    var dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit",
      day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    var parts = dtf.formatToParts(instant).reduce(function (acc, p) {
      acc[p.type] = p.value;
      return acc;
    }, {});
    var asUTC = Date.UTC(
      parseInt(parts.year, 10), parseInt(parts.month, 10) - 1,
      parseInt(parts.day, 10), parseInt(parts.hour, 10),
      parseInt(parts.minute, 10), parseInt(parts.second, 10)
    );
    return (asUTC - instant.getTime()) / 60000;
  }

  // Converts a wall-clock time (hh:mm) "as seen in tz, on today's date in tz"
  // into the corresponding real UTC instant (milliseconds since epoch).
  function zonedWallTimeToUtcMillis(hour, minute, tz) {
    var now = new Date();
    var todayInTz = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(now).reduce(function (acc, p) {
      acc[p.type] = p.value;
      return acc;
    }, {});
    var y = parseInt(todayInTz.year, 10);
    var m = parseInt(todayInTz.month, 10) - 1;
    var d = parseInt(todayInTz.day, 10);

    var guess = Date.UTC(y, m, d, hour, minute, 0);
    var offset = tzOffsetMinutes(new Date(guess), tz);
    var utcMillis = guess - offset * 60000;
    // one correction pass to handle DST-transition edge cases
    var offset2 = tzOffsetMinutes(new Date(utcMillis), tz);
    if (offset2 !== offset) {
      utcMillis = guess - offset2 * 60000;
    }
    return utcMillis;
  }

  var STYLE = "" +
    ":host{all:initial;}" +
    ".gtt{font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;" +
    "background:linear-gradient(180deg,#1a1a2e 0%,#16213e 100%);" +
    "border-radius:14px;padding:14px;max-width:360px;box-sizing:border-box;" +
    "box-shadow:0 8px 24px rgba(0,0,0,0.35);}" +
    ".gtt *{box-sizing:border-box;}" +
    ".gtt-controls{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;" +
    "align-items:center;}" +
    ".gtt-controls select,.gtt-controls input{" +
    "background:#0f3460;color:#f1f1f1;border:1px solid #29416b;" +
    "border-radius:6px;padding:5px 6px;font-size:11px;font-family:inherit;}" +
    ".gtt-controls select{flex:1 1 auto;min-width:0;}" +
    ".gtt-controls button{background:#e94560;color:#fff;border:none;" +
    "border-radius:6px;padding:5px 10px;font-size:11px;font-weight:600;" +
    "cursor:pointer;font-family:inherit;white-space:nowrap;}" +
    ".gtt-controls button.gtt-live-btn{background:#0f3460;color:#a0aec0;}" +
    ".gtt-controls button.gtt-live-btn.gtt-active{background:#2ecc71;color:#fff;}" +
    ".gtt-banner{color:#ffd369;font-size:10px;margin:-4px 0 10px 2px;}" +
    ".gtt-banner.gtt-hint{color:#7f9cf5;}" +
    ".gtt-card{display:flex;align-items:center;gap:12px;background:#0f3460;" +
    "border-radius:10px;padding:10px 14px;margin-bottom:8px;}" +
    ".gtt-card:last-child{margin-bottom:0;}" +
    ".gtt-icon{flex:0 0 auto;width:28px;height:28px;color:#f1f1f1;}" +
    ".gtt-info{flex:1 1 auto;min-width:0;}" +
    ".gtt-city{color:#f1f1f1;font-size:13px;font-weight:600;margin:0 0 2px 0;" +
    "white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}" +
    ".gtt-time{color:#ffd369;font-size:19px;font-weight:700;margin:0;" +
    "font-variant-numeric:tabular-nums;}" +
    ".gtt-meta{flex:0 0 auto;text-align:right;color:#a0aec0;font-size:10px;" +
    "line-height:1.4;}" +
    ".gtt-footer{margin-top:8px;text-align:center;}" +
    ".gtt-footer a{color:#a0aec0;font-size:10px;text-decoration:none;}" +
    ".gtt-footer a:hover{color:#e94560;}";

  function buildCard(shadowRoot, label, tz) {
    var card = document.createElement("div");
    card.className = "gtt-card";

    var iconWrap = document.createElement("div");
    iconWrap.className = "gtt-icon";
    iconWrap.innerHTML = '<svg viewBox="0 0 48 40" width="28" height="28" fill="none">' +
      (ICONS[pickIcon(label)] || ICONS.globe) + "</svg>";

    var info = document.createElement("div");
    info.className = "gtt-info";
    var cityEl = document.createElement("p");
    cityEl.className = "gtt-city";
    cityEl.textContent = label;
    var timeEl = document.createElement("p");
    timeEl.className = "gtt-time";
    timeEl.textContent = "--:--:--";
    info.appendChild(cityEl);
    info.appendChild(timeEl);

    var meta = document.createElement("div");
    meta.className = "gtt-meta";
    var dateEl = document.createElement("div");
    var offsetEl = document.createElement("div");
    meta.appendChild(dateEl);
    meta.appendChild(offsetEl);

    card.appendChild(iconWrap);
    card.appendChild(info);
    card.appendChild(meta);

    return { card: card, timeEl: timeEl, dateEl: dateEl, offsetEl: offsetEl, tz: tz };
  }

  function formatOffset(tz) {
    try {
      var dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: tz, timeZoneName: "shortOffset"
      });
      var parts = dtf.formatToParts(new Date());
      var tzPart = parts.find(function (p) { return p.type === "timeZoneName"; });
      return tzPart ? tzPart.value.replace("GMT", "UTC") : "";
    } catch (e) {
      return "";
    }
  }

  function initWidget(el) {
    var citiesAttr = el.getAttribute("data-cities") ||
      "New York,Sydney,London,Delhi,Dubai";
    var cityNames = citiesAttr.split(",").map(function (s) { return s.trim(); })
      .filter(Boolean);

    var shadow = el.attachShadow({ mode: "open" });
    var styleTag = document.createElement("style");
    styleTag.textContent = STYLE;
    shadow.appendChild(styleTag);

    var container = document.createElement("div");
    container.className = "gtt";
    shadow.appendChild(container);

    // ---- Source-time controls ----
    var controls = document.createElement("div");
    controls.className = "gtt-controls";

    var citySelect = document.createElement("select");
    var timeInput = document.createElement("input");
    timeInput.type = "time";
    timeInput.step = "60";

    var applyBtn = document.createElement("button");
    applyBtn.textContent = "Apply";
    applyBtn.type = "button";

    var liveBtn = document.createElement("button");
    liveBtn.textContent = "Live";
    liveBtn.type = "button";
    liveBtn.className = "gtt-live-btn gtt-active";

    controls.appendChild(citySelect);
    controls.appendChild(timeInput);
    controls.appendChild(applyBtn);
    controls.appendChild(liveBtn);
    container.appendChild(controls);

    var banner = document.createElement("div");
    banner.className = "gtt-banner gtt-hint";
    banner.textContent = "\uD83D\uDCA1 Tip: pick a city & time above, then Apply to see it converted everywhere.";
    container.appendChild(banner);

    var rows = [];
    cityNames.forEach(function (name) {
      var tz = resolveTz(name);
      if (!tz) return;
      var row = buildCard(shadow, name, tz);
      container.appendChild(row.card);
      rows.push(row);

      var opt = document.createElement("option");
      opt.value = rows.length - 1;
      opt.textContent = name;
      citySelect.appendChild(opt);
    });

    var footer = document.createElement("div");
    footer.className = "gtt-footer";
    var link = document.createElement("a");
    link.href = "https://github.com/";
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Global Time Tracker";
    footer.appendChild(link);
    container.appendChild(footer);

    // ---- State: live mode vs manual (source-time) mode ----
    var mode = "live";
    var manualFrozenInstant = null;
    var revertTimer = null;
    var AUTO_REVERT_MS = 15000;

    function currentInstant() {
      if (mode === "manual") {
        return manualFrozenInstant;
      }
      return new Date();
    }

    function tick() {
      var now = currentInstant();
      rows.forEach(function (row) {
        try {
          var timeStr = new Intl.DateTimeFormat("en-US", {
            timeZone: row.tz, hour: "numeric", minute: "2-digit",
            second: "2-digit", hour12: true
          }).format(now);
          var dateStr = new Intl.DateTimeFormat("en-US", {
            timeZone: row.tz, weekday: "short", day: "2-digit", month: "short"
          }).format(now);
          row.timeEl.textContent = timeStr;
          row.dateEl.textContent = dateStr;
          row.offsetEl.textContent = formatOffset(row.tz);
        } catch (e) { /* ignore invalid tz at runtime */ }
      });
    }

    function goLive() {
      mode = "live";
      liveBtn.classList.add("gtt-active");
      banner.className = "gtt-banner gtt-hint";
      banner.textContent = "\uD83D\uDCA1 Tip: pick a city & time above, then Apply to see it converted everywhere.";
      citySelect.selectedIndex = 0;
      timeInput.value = "";
      if (revertTimer) {
        clearTimeout(revertTimer);
        revertTimer = null;
      }
      tick();
    }

    applyBtn.addEventListener("click", function () {
      var idx = parseInt(citySelect.value, 10);
      var row = rows[idx];
      if (!row || !timeInput.value) return;
      var parts = timeInput.value.split(":");
      var hour = parseInt(parts[0], 10);
      var minute = parseInt(parts[1], 10);

      manualFrozenInstant = new Date(zonedWallTimeToUtcMillis(hour, minute, row.tz));
      mode = "manual";
      liveBtn.classList.remove("gtt-active");
      banner.className = "gtt-banner";
      banner.textContent = "Showing times based on " +
        row.card.querySelector(".gtt-city").textContent + " = " + timeInput.value +
        " (auto-returns to live in 15s)";
      tick();

      if (revertTimer) clearTimeout(revertTimer);
      revertTimer = setTimeout(goLive, AUTO_REVERT_MS);
    });

    liveBtn.addEventListener("click", goLive);

    tick();
    setInterval(function () {
      if (mode === "live") tick();
    }, 1000);
  }

  function boot() {
    var targets = document.querySelectorAll(
      "#global-time-tracker, .gtt-widget:not([data-gtt-init])"
    );
    targets.forEach(function (el) {
      if (el.getAttribute("data-gtt-init") === "true") return;
      el.setAttribute("data-gtt-init", "true");
      initWidget(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
