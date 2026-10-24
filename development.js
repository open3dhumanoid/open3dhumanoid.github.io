/* development.js — load with <script defer> on development.html.
   Add articles to POSTS. Newest first is applied automatically. */

// SAMPLE ENTRIES: replace with your real articles.
// image: path to a picture ("" shows a blueprint placeholder). link: article page.
const POSTS = [
  { date: "2026-10-18", tag: "Actuators",   title: "Hip actuator: first prototype",       description: "Notes from the first printed and assembled hip joint.",                image: "", link: "#" },
  { date: "2026-10-02", tag: "Actuators",   title: "Choosing a gearbox for the knee",     description: "The options we compared and what we picked.",                         image: "", link: "#" },
  { date: "2026-09-20", tag: "Materials",   title: "Printing the leg: which filament?",   description: "Test prints and what they tell us about strength and weight.",        image: "", link: "#" },
  { date: "2026-09-05", tag: "Design",      title: "Matching the G1 joint layout",        description: "How the Unitree G1’s joints map onto our printed frame.",              image: "", link: "#" },
  { date: "2026-08-22", tag: "Simulation",  title: "Setting up the simulation model",     description: "Turning the CAD into a robot model a simulator can load.",            image: "", link: "#" },
  { date: "2026-08-04", tag: "Design",      title: "Torso frame, version 2",              description: "What changed from the first torso and why.",                          image: "", link: "#" },
  { date: "2026-07-19", tag: "Electronics", title: "Wiring harness and power budget",     description: "Planning power and signal routing before building.",                  image: "", link: "#" },
  { date: "2026-07-01", tag: "Project",     title: "Project kickoff and goals",           description: "What we’re building, who it’s for, and how we’ll work.",               image: "", link: "#" }
];

(function () {
  const track = document.querySelector("[data-dev-track]");
  if (!track) return;
  const prev = document.querySelector("[data-dev-prev]");
  const next = document.querySelector("[data-dev-next]");
  const count = document.querySelector("[data-dev-count]");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ARROW = '<svg class="arrow" width="22" height="10" viewBox="0 0 22 10" aria-hidden="true"><path d="M0 5H20M15 1L20 5L15 9"/></svg>';

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function placeholder() {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150" fill="none" stroke="#8a93a8">' +
      '<path d="M100 0V150M0 75H200" stroke-width=".6" stroke-dasharray="8 3 2 3"/>' +
      '<circle cx="100" cy="75" r="40"/><rect x="60" y="35" width="80" height="80" stroke-width=".7"/></svg>';
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  const posts = POSTS.slice().sort((a, b) => b.date.localeCompare(a.date));

  posts.forEach((p, i) => {
    const art = el("article", "card dev-item");
    const head = el("div", "card-head");
    head.append(
      el("span", "", new Date(p.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })),
      el("span", "accent", p.tag)
    );
    const img = el("img", "dev-thumb");
    img.alt = "";
    img.loading = "lazy";
    img.src = p.image || placeholder();
    img.onerror = () => { img.onerror = null; img.src = placeholder(); };

    const body = el("div", "card-body");
    const a = el("a", "link-arrow", "Read article ");
    a.href = p.link;
    a.insertAdjacentHTML("beforeend", ARROW);
    a.setAttribute("aria-label", "Read article: " + p.title);
    body.append(el("h3", "", p.title), el("p", "", p.description), a);

    art.append(head, img, body);
    track.append(art);
  });

  function step() {
    const first = track.querySelector(".dev-item");
    if (!first) return 0;
    return first.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
  }

  function update() {
    const s = step() || 1;
    const visible = Math.max(1, Math.round(track.clientWidth / s));
    const first = Math.min(posts.length, Math.round(track.scrollLeft / s) + 1);
    const last = Math.min(posts.length, first + visible - 1);
    count.textContent = "Showing " + first + "–" + last + " of " + posts.length;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
  }

  function go(dir) {
    track.scrollBy({ left: dir * step(), behavior: reduce ? "auto" : "smooth" });
  }

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));
  track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  track.addEventListener("keydown", e => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  });
  addEventListener("resize", update);
  update();
})();
