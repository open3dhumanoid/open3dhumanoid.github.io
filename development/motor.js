/* motor.js — hovering or focusing a diagram pin highlights the matching table rows */
(function () {
  const rows = document.querySelectorAll("[data-ref]");
  document.querySelectorAll(".pin").forEach(pin => {
    const ref = pin.dataset.ref;
    const set = on => {
      rows.forEach(r => r.classList.toggle("is-hot", on && r.dataset.ref === ref));
      document.querySelectorAll('.pin[data-ref="' + ref + '"]').forEach(p => p.classList.toggle("is-hot", on));
    };
    ["mouseenter", "focus"].forEach(e => pin.addEventListener(e, () => set(true)));
    ["mouseleave", "blur"].forEach(e => pin.addEventListener(e, () => set(false)));
  });
})();
