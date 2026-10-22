// StoryNest - one external JS file used by every page
// Features: 1) Dark/light mode  2) Like button  3) Show/Hide synopsis
//           4) Reading progress bar  5) Search + genre filter

function safeGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function safeSet(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }

// 1) Dark / light mode (remembered between pages)
(function () {
  var root = document.documentElement;
  var btn = document.getElementById("themeToggle");
  function apply(theme) {
    root.setAttribute("data-theme", theme);
    if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
  apply(safeGet("theme") || "light");
  if (btn) {
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      safeSet("theme", next);
    });
  }
})();

// 2) Like button (saved per story)
(function () {
  var story = document.querySelector(".story");
  var btn = document.querySelector(".like-btn");
  if (!story || !btn) return;
  var id = story.dataset.storyId;
  var count = document.querySelector(".like-count");
  var liked = safeGet("liked-" + id) === "1";
  var base = 10 + (parseInt(id, 10) * 7) % 40; // starting likes for demo
  function render() {
    btn.classList.toggle("liked", liked);
    btn.setAttribute("aria-pressed", liked);
    btn.firstChild.textContent = (liked ? "❤️" : "🤍") + " Like ";
    count.textContent = base + (liked ? 1 : 0);
  }
  btn.addEventListener("click", function () {
    liked = !liked;
    safeSet("liked-" + id, liked ? "1" : "0");
    render();
  });
  render();
})();

// 3) Show / Hide synopsis
(function () {
  var btn = document.querySelector(".toggle-synopsis");
  var syn = document.querySelector(".synopsis");
  if (!btn || !syn) return;
  btn.addEventListener("click", function () {
    var hidden = syn.classList.toggle("hidden");
    btn.textContent = hidden ? "Show Synopsis" : "Hide Synopsis";
    btn.setAttribute("aria-expanded", !hidden);
  });
})();

// 4) Reading progress bar
(function () {
  var bar = document.getElementById("progressBar");
  if (!bar) return;
  function update() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    bar.style.width = pct + "%";
  }
  window.addEventListener("scroll", update);
  update();
})();

// 5) Search + genre filter on the home page
(function () {
  var input = document.getElementById("searchInput");
  var select = document.getElementById("genreFilter");
  var cards = document.querySelectorAll(".book-card");
  if (!input || !select) return;
  var count = document.getElementById("resultCount");
  var none = document.getElementById("noResults");
  function filter() {
    var q = input.value.trim().toLowerCase();
    var g = select.value;
    var shown = 0;
    cards.forEach(function (c) {
      var match = (c.dataset.title.indexOf(q) !== -1 || c.dataset.author.indexOf(q) !== -1) &&
                  (g === "all" || c.dataset.genre === g);
      c.style.display = match ? "" : "none";
      if (match) shown++;
    });
    count.textContent = "Showing " + shown + " of " + cards.length + " stories";
    none.hidden = shown !== 0;
  }
  input.addEventListener("input", filter);
  select.addEventListener("change", filter);
  filter();
})();
