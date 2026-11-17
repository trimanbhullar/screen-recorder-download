// Screen Recorder feature tour (styles: css/sr-tour.css). Five short chapters drawn in the app's own look:
// one click, menus and dropdowns, staying out of the shot, voice and the call, presets with no limits.
// window.SRTour(element, { reduced, track }) returns { start, stop }. Made-up content; it never records anything.
// The same file runs on orionsoft.cc and on screenrecorder.orionsoft.cc.
window.SRTour = (root, { reduced = false, track = () => {} } = {}) => {
  const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => [...el.querySelectorAll(s)];
  const ICON = {
    mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/></svg>',
    spk: '<svg viewBox="0 0 24 24"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
    demo: '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M9 20h6M12 16.5V20"/><path class="fillish" d="M12 7.5l.9 1.8 1.9.3-1.4 1.3.4 1.9-1.8-.9-1.8.9.4-1.9-1.4-1.3 1.9-.3z"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z"/></svg>',
    call: '<svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>',
  };
  const CURSOR = '<svg class="srt-cursor" viewBox="0 0 14 20"><path d="M1 1v15l4-3.7 2.8 6.2 2.6-1.2-2.8-6h5.3z"/></svg>';
  const faces = (cls = "") => `<div class="srt-faces ${cls}"><i style="--c:#7aa2ff"></i><i style="--c:#4cc38a"></i><i style="--c:#ff8a5c"></i><i style="--c:#e8b04a"></i></div>`;
  const doc = (x, y, w, ht, tools = false) => `<div class="srt-win doc" style="left:${x}px;top:${y}px;width:${w}px;height:${ht}px"><div class="srt-wbar"><i></i><i></i><i></i><span>Roadmap</span></div>
    ${tools ? '<div class="srt-tool"><u>Insert ▾</u><u>Format ▾</u><u>Share</u></div>' : ""}
    <div class="srt-doc"><b></b><span></span><span class="w7"></span><span></span><em></em><span class="w5"></span></div></div>`;
  const callWin = (x, y, w, ht) => `<div class="srt-win call" style="left:${x}px;top:${y}px;width:${w}px;height:${ht}px"><div class="srt-wbar"><i></i><i></i><i></i><span>Team call</span></div>${faces()}</div>`;
  const desk = (inner, clock = true) => `<div class="srt-desk">${inner}<div class="srt-task"><i></i><i></i><span class="srt-tray-orb"></span>${clock ? "<span>9:41</span>" : ""}</div></div>`;
  const menu = (cls, x, y, items) => `<div class="srt-menu ${cls}" style="left:${x}px;top:${y}px">${items.map((t) => `<div>${t}</div>`).join("")}</div>`;
  const miniDesk = (onlyDoc) => `<div class="mini" style="background:${onlyDoc ? "#19191b" : "radial-gradient(90% 80% at 15% 0%, rgba(122,162,255,.22), transparent 60%), #0e0f13"}">
    ${onlyDoc ? '<div class="srt-doc" style="padding:18px 22px"><b></b><span></span><span class="w7"></span><span></span><em style="height:60px"></em></div>'
      : '<div class="srt-win" style="left:12px;top:10px;width:58%;height:68%"></div><div class="srt-win" style="left:52%;top:46%;width:34%;height:40%"></div>'}</div>`;
  const tile2 = () => `<div class="srt-tiles2">
      <div class="srt-tile tog"><span class="ic">${ICON.mic}</span><span class="tt"><b>Microphone</b><small>Headset</small></span><span class="srt-bars">${"<i></i>".repeat(5)}</span></div>
      <div class="srt-tile tog"><span class="ic">${ICON.spk}</span><span class="tt"><b>Computer sound</b><small>Calls, apps, browser</small></span></div></div>`;
  const tile3 = (sel = 1) => `<div class="srt-tiles3">${[["demo", "Demo", "Sharpest"], ["share", "Share", "Balanced"], ["call", "Long call", "Smallest"]]
    .map(([ic, t, s], i) => `<div class="srt-tile pick${i === sel ? " sel" : ""}">${ICON[ic]}<b>${t}</b><small>${s}</small></div>`).join("")}</div>`;
  const app = () => `<div class="srt-app">
      <div class="a-top"><span class="a-mark"><i></i></span><span><div class="a-name">Screen Recorder</div><div class="a-ver">v1.0.0</div></span><span class="a-acts"><i></i><i></i></span></div>
      <main>
        <div class="a-prev"><div class="pv-screen">${miniDesk(false)}</div><div class="pv-win" style="opacity:0">${miniDesk(true)}</div><span class="a-chip">Screen 1</span></div>
        <div class="a-strip"><span class="a-thumb sel t-scr">${miniDesk(false)}<b>1</b></span><span class="a-sep"></span><span class="a-thumb t-doc">${miniDesk(true)}</span><span class="a-thumb t-call" style="background:#19191b">${faces()}</span></div>
        ${tile2()}${tile3(1)}
      </main>
      <div class="a-dock"><span class="a-side"><i></i>No recordings yet</span><span class="srt-rec"><i></i></span><span class="a-side">▭<br>Recordings</span></div>
      <div class="a-cap">Record</div></div>`;

  const CHAPTERS = [
    { id: "one-click", tab: "One click", cap: "<b>One click.</b> Pick a screen or any window and press the orb. The recorder tucks into the tray, and a small timer sits above the clock." },
    { id: "menus", tab: "Menus too", cap: "<b>Menus and dropdowns too.</b> Right-click menus and dropdowns land in the recording, even when you record a single window." },
    { id: "hidden", tab: "Invisible", cap: "<b>Stays out of the shot.</b> The recorder and its timer never appear in your recording, or when you share your screen on a call." },
    { id: "sound", tab: "Sound", cap: "<b>Your voice and the call.</b> Your microphone and everything you hear, mixed into one clear track with echo cancellation." },
    { id: "presets", tab: "No limits", cap: "<b>Presets, no limits.</b> Demo, Share or Long call sets the quality. Every recording is an MP4 ready to share, with no time limit and no watermark." },
  ];

  root.classList.add("srt");
  const tpl = document.createElement("template");
  tpl.innerHTML = `<div class="srt-view"><div class="srt-scale">
    <section class="srt-scene" data-ch="0">${desk(doc(20, 18, 300, 200) + callWin(36, 230, 180, 112) + '<div class="srt-frame" style="left:16px;top:14px;width:308px;height:208px"><span>REC</span></div><div class="srt-pill"><i></i><span class="tm">0:00</span><small class="mb">0.0 MB</small></div>')}
      <div style="position:absolute;left:334px;top:8px;transform:scale(.54);transform-origin:0 0">${app()}</div>${CURSOR}</section>
    <section class="srt-scene" data-ch="1">${desk(doc(20, 18, 330, 250, true) + '<div class="srt-frame on" style="left:16px;top:14px;width:338px;height:258px"><span>REC</span></div><div class="srt-pill on"><i></i><span>0:42</span><small>12 MB</small></div>'
      + menu("ctx", 150, 120, ["Copy", "Paste", "Add a comment", "Present from here"]) + menu("dd", 30, 58, ["Picture", "Chart", "Table", "Video"]))}
      <span class="srt-label red" style="left:372px;top:30px">IN YOUR RECORDING</span>
      <div class="srt-pane" style="left:370px;top:52px;width:176px;height:134px;bottom:auto"><div style="position:absolute;left:-10px;top:-9px;transform:scale(.533);transform-origin:0 0;width:330px;height:250px">
        ${doc(0, 0, 330, 250, true)}${menu("ctx", 130, 102, ["Copy", "Paste", "Add a comment", "Present from here"])}${menu("dd", 10, 40, ["Picture", "Chart", "Table", "Video"])}</div></div>
      ${CURSOR}</section>
    <section class="srt-scene" data-ch="2">
      <span class="srt-label" style="left:14px;top:34px">ON YOUR SCREEN</span><span class="srt-label red" style="left:288px;top:34px">IN THE RECORDING</span>
      <div class="srt-pane" style="left:14px;top:58px;width:258px;height:176px;bottom:auto"><div style="transform:scale(.4607);transform-origin:0 0;width:560px;height:380px;position:absolute">
        ${desk(doc(20, 18, 300, 200) + callWin(36, 230, 180, 112) + '<div class="srt-pill on"><i></i><span>0:42</span><small>12 MB</small></div>')}<div class="h-app" style="position:absolute;left:348px;top:16px;transform:scale(.5);transform-origin:0 0">${app()}</div></div></div>
      <div class="srt-pane" style="left:288px;top:58px;width:258px;height:176px;bottom:auto"><div style="transform:scale(.4607);transform-origin:0 0;width:560px;height:380px;position:absolute">
        ${desk(doc(20, 18, 300, 200) + callWin(36, 230, 180, 112) + '<div class="srt-ghost h-ghost" style="right:8px;bottom:30px;width:118px;height:24px;border-radius:99px">not recorded</div>')}<div class="srt-ghost h-ghost" style="left:348px;top:16px;width:200px;height:320px">the recorder<br>isn't in the video</div></div></div>
      <div class="srt-badges" style="top:262px;justify-content:center"><span>Hidden from your recordings</span><span>Hidden when you share your screen</span></div></section>
    <section class="srt-scene" data-ch="3">${desk(callWin(18, 16, 250, 172))}
      <div style="position:absolute;left:18px;top:202px;width:250px">${tile2().replace("srt-tiles2", "srt-tiles2 one")}</div>
      <span class="srt-tag" style="left:296px;top:24px">Your microphone</span><div class="srt-wave w-mic" style="left:296px;top:38px"></div>
      <span class="srt-tag" style="left:296px;top:90px">Computer sound</span><div class="srt-wave w-call" style="left:296px;top:104px"></div>
      <span class="srt-tag" style="left:296px;top:162px">In the MP4</span><div class="srt-wave mix w-mix" style="left:296px;top:176px"></div>
      <div class="srt-file" style="left:296px;top:240px;width:250px"><span class="pg"></span><span><b>recording.mp4</b><small>One track, every voice, echo cancelled</small></span></div></section>
    <section class="srt-scene" data-ch="4">${desk("")}
      <div style="position:absolute;left:80px;top:20px;width:400px">${tile3(0)}</div>
      <span class="srt-tag" style="left:40px;top:138px">The same recording, saved three ways</span>
      <div class="srt-size" style="top:156px">
        <div class="row" data-r="0"><span>Demo</span><span class="bar"><i style="width:100%"></i></span><span>sharpest</span></div>
        <div class="row" data-r="1"><span>Share</span><span class="bar"><i style="width:56%"></i></span><span>balanced</span></div>
        <div class="row" data-r="2"><span>Long call</span><span class="bar"><i style="width:28%"></i></span><span>smallest</span></div></div>
      <div class="srt-badges" style="top:262px"><span>MP4 that plays everywhere</span><span>No time limit</span><span>No watermark</span></div></section>
  </div></div>
  <p class="srt-cap" aria-live="polite"></p>
  <div class="srt-tabs" role="tablist" aria-label="What Screen Recorder does">${CHAPTERS.map((c, i) => `<button type="button" role="tab" aria-selected="false" data-i="${i}">${c.tab}<i></i></button>`).join("")}</div>`;
  root.append(tpl.content);

  // scale the 560 x 380 scene to whatever width it's given
  const view = $(".srt-view"), scale = $(".srt-scale");
  const fit = () => { scale.style.transform = `scale(${view.clientWidth / 560})`; };
  new ResizeObserver(fit).observe(view); fit();

  // waveforms
  for (const w of $$(".srt-wave")) w.append(...Array.from({ length: w.classList.contains("mix") ? 48 : 40 }, () => document.createElement("i")));
  const wave = (w, loud) => $$("i", w).forEach((b) => { b.style.height = `${3 + (loud ? Math.random() * 28 : Math.random() * 4)}px`; });

  // one chapter at a time; every timer belongs to the chapter and is cleared when it ends
  let ch = 0, timers = [], ticks = [], auto = true, running = false;
  const at = (ms, fn) => timers.push(setTimeout(fn, reduced ? 0 : ms));
  const every = (ms, fn) => { fn(); if (!reduced) ticks.push(setInterval(fn, ms)); };
  const clear = () => { timers.forEach(clearTimeout); ticks.forEach(clearInterval); timers = []; ticks = []; };
  const move = (sc, x, y, jump = false) => { const c = $(".srt-cursor", sc); if (!c) return; if (jump) { c.style.transition = "none"; c.style.transform = `translate(${x}px, ${y}px)`; void c.offsetWidth; c.style.transition = ""; } else c.style.transform = `translate(${x}px, ${y}px)`; };
  // the centre of an element, in scene pixels, so the cursor lands on the real thing at any size
  const spot = (sc, sel) => { const r = $(sel, sc).getBoundingClientRect(), o = scale.getBoundingClientRect(), k = view.clientWidth / 560; return [(r.left + r.width / 2 - o.left) / k, (r.top + r.height / 2 - o.top) / k]; };
  const click = (sc) => { const c = $(".srt-cursor", sc); if (!c) return; c.classList.remove("click"); void c.getBoundingClientRect(); c.classList.add("click"); };
  const DUR = [7600, 7000, 6000, 6400, 6400];

  const PLAY = [
    (sc) => { // one click: pick the window, press the orb, it tucks into the tray
      const a = $(".srt-app", sc), rec = $(".srt-rec", sc), frame = $(".srt-frame", sc), pill = $(".srt-pill", sc), tray = $(".srt-tray-orb", sc);
      a.style.transition = "none"; a.classList.remove("tucked"); a.style.transform = ""; void a.offsetWidth; a.style.transition = ""; rec.classList.remove("on"); frame.classList.remove("on"); pill.classList.remove("on"); tray.style.opacity = 0;
      $(".t-scr", sc).classList.add("sel"); $(".t-doc", sc).classList.remove("sel"); $(".pv-win", sc).style.opacity = 0; $(".a-chip", sc).textContent = "Screen 1";
      $(".tm", sc).textContent = "0:00"; $(".mb", sc).textContent = "0.0 MB";
      move(sc, 250, 300, true);
      at(500, () => move(sc, ...spot(sc, ".t-doc")));
      at(1400, () => { click(sc); $(".t-scr", sc).classList.remove("sel"); $(".t-doc", sc).classList.add("sel"); $(".pv-win", sc).style.opacity = 1; $(".a-chip", sc).textContent = "Roadmap"; });
      at(2000, () => move(sc, ...spot(sc, ".srt-rec")));
      at(2900, () => { click(sc); rec.classList.add("on"); });
      at(3300, () => { a.style.transform = "translate(360px, 660px) scale(.06)"; a.classList.add("tucked"); tray.style.opacity = 1; });
      at(3700, () => { frame.classList.add("on"); pill.classList.add("on"); move(sc, 250, 120);
        let s = 0; every(1000, () => { $(".tm", sc).textContent = `0:${String(s).padStart(2, "0")}`; $(".mb", sc).textContent = `${(s * .42).toFixed(1)} MB`; s++; }); });
    },
    (sc) => { // menus: a right-click menu, then a dropdown, both in the recording
      const ctx = $$(".ctx", sc), dd = $$(".dd", sc);
      const hi = (ms, i) => ms.forEach((m) => $$("div", m).forEach((d, n) => d.classList.toggle("hi", n === i)));
      ctx.concat(dd).forEach((m) => m.classList.remove("on"));
      move(sc, 260, 230, true);
      at(400, () => move(sc, 150, 120));
      at(1200, () => { click(sc); ctx.forEach((m) => m.classList.add("on")); hi(ctx, 0); });
      at(1700, () => { move(sc, 170, 152); hi(ctx, 2); });
      at(3000, () => ctx.forEach((m) => m.classList.remove("on")));
      at(3200, () => move(sc, 46, 52));
      at(3900, () => { click(sc); dd.forEach((m) => m.classList.add("on")); hi(dd, 0); });
      at(4400, () => { move(sc, 56, 86); hi(dd, 1); });
      at(5000, () => { move(sc, 56, 104); hi(dd, 2); });
      at(6200, () => dd.forEach((m) => m.classList.remove("on")));
    },
    (sc) => { // stays out of the shot
      const ghosts = $$(".h-ghost", sc);
      ghosts.forEach((g) => (g.style.opacity = 0));
      at(900, () => ghosts.forEach((g) => { g.style.transition = "opacity .5s"; g.style.opacity = 1; }));
    },
    (sc) => { // voice and the call
      const faces = $$(".srt-faces i", sc), bars = $$(".srt-bars i", sc);
      let n = 0;
      every(160, () => {
        const who = Math.floor(n / 9) % 4; n++;
        faces.forEach((f, i) => f.classList.toggle("talk", i === who));
        wave($(".w-mic", sc), who === 0); wave($(".w-call", sc), who !== 0); wave($(".w-mix", sc), true);
        bars.forEach((b, i) => { b.style.height = `${who === 0 ? 3 + Math.random() * 15 * (1 - i / 7) : 3}px`; });
      });
    },
    (sc) => { // presets
      let i = 0;
      every(1500, () => {
        $$(".srt-tile.pick", sc).forEach((t, n) => t.classList.toggle("sel", n === i));
        $$(".srt-size .row", sc).forEach((r, n) => r.classList.toggle("sel", n === i));
        i = (i + 1) % 3;
      });
    },
  ];

  function show(i, byUser = false) {
    clear();
    ch = i;
    $$(".srt-scene").forEach((s, n) => s.classList.toggle("on", n === i));
    $$(".srt-tabs button").forEach((b, n) => { b.setAttribute("aria-selected", n === i); b.style.setProperty("--dur", `${DUR[n]}ms`); });
    $$(".srt-tabs button i").forEach((b) => { b.style.animation = "none"; void b.offsetWidth; b.style.animation = ""; });
    $(".srt-cap").innerHTML = CHAPTERS[i].cap;
    if (byUser) { auto = false; root.classList.add("held"); track(CHAPTERS[i].id); }
    if (!running && !reduced) return;
    PLAY[i]($(`.srt-scene[data-ch="${i}"]`));
    if (reduced) return;
    // the chapter replays while it's picked, and moves on by itself until someone picks one
    at(DUR[i], () => show(auto ? (i + 1) % CHAPTERS.length : i));
  }

  $(".srt-tabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) show(+b.dataset.i, true); });
  show(0);
  return {
    start() { if (running) return; running = true; show(ch); },
    stop() { running = false; clear(); },
  };
};
