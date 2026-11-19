// Deterministic hero backdrop: a checkerboard of rounded squares, some of them joined by
// edge-aligned bridges so they read as continuous "circuit" shapes. Same output on server & client.
//
// The SVG draws every shape with a stroke and then the same shapes again as a solid fill on top,
// so only the OUTER outline of each merged group stays visible.

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = (v) => Math.round(v * 10) / 10;

function roundedRect(x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  return (
    `M${n(x + rr)} ${n(y)}h${n(w - 2 * rr)}a${rr} ${rr} 0 0 1 ${rr} ${rr}v${n(h - 2 * rr)}` +
    `a${rr} ${rr} 0 0 1 -${rr} ${rr}h-${n(w - 2 * rr)}a${rr} ${rr} 0 0 1 -${rr} -${rr}` +
    `v-${n(h - 2 * rr)}a${rr} ${rr} 0 0 1 ${rr} -${rr}z`
  );
}

export function buildGridPath({
  width = 1920,
  height = 1080,
  pitch = 60, // half-step of the checkerboard
  size = 56, // square size
  radius = 13,
  bar = 20, // bridge thickness
  seed = 11,
} = {}) {
  const rand = mulberry32(seed);
  const cols = Math.ceil(width / pitch) + 1;
  const rows = Math.ceil(height / pitch) + 1;
  const pad = (pitch * 2 - size) / 2 - pitch / 2; // centre squares in their slot
  const on = new Set();
  const key = (c, r) => `${c}:${r}`;

  // 1. Checkerboard squares — sparse on the left, dense towards the right.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((c + r) % 2) continue;
      const x = c / cols;
      const y = r / rows;
      const density = Math.min(0.9, 0.04 + x * 0.95 + Math.sin(y * Math.PI) * 0.1);
      if (rand() < density) on.add(key(c, r));
    }
  }

  let d = '';
  const px = (c) => c * pitch + pad;
  const py = (r) => r * pitch + pad;

  // Each square joins at most one neighbour, so shapes stay short "U / S" pieces instead of long rails.
  const linked = new Set();
  const link = (a, b) => {
    if (linked.has(a) || linked.has(b)) return false;
    linked.add(a);
    linked.add(b);
    return true;
  };

  on.forEach((k) => {
    const [c, r] = k.split(':').map(Number);
    d += roundedRect(px(c), py(r), size, size, radius);

    // 2. Horizontal bridge to the square two slots right (aligned to top or bottom edge).
    if (on.has(key(c + 2, r)) && rand() < 0.3 && link(k, key(c + 2, r))) {
      const top = rand() < 0.5;
      d += roundedRect(px(c) + size - radius, top ? py(r) : py(r) + size - bar, pitch * 2 - size + radius * 2, bar, 2);
    }
    // 3. Vertical bridge to the square two slots below (aligned to left or right edge).
    else if (on.has(key(c, r + 2)) && rand() < 0.3 && link(k, key(c, r + 2))) {
      const left = rand() < 0.5;
      d += roundedRect(left ? px(c) : px(c) + size - bar, py(r) + size - radius, bar, pitch * 2 - size + radius * 2, 2);
    }
  });

  return d;
}
