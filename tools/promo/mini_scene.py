"""The cast and set for the miniature course-promo film.

Five beats follow the client's timeline: the problem, building the skill, the
breakthrough, the launch, the climax + CTA. Each beat is a function of time
that appends to a Scene, so the camera can move freely through them.
"""
from __future__ import annotations

import math

import mini3d as M
from mini3d import Scene, norm, vadd, vmul

# --- set -----------------------------------------------------------------
DESK_Y = -1.6
DESK_TOP = 0.0
LAPTOP_LID_ANGLE = -0.32          # radians, leaning back


def ease_out(x):
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def ease_in_out(x):
    x = max(0.0, min(1.0, x))
    return 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2


def seg(t, a, b):
    if b <= a:
        return 1.0 if t >= b else 0.0
    return max(0.0, min(1.0, (t - a) / (b - a)))


# ---------------------------------------------------------------------------
# props
# ---------------------------------------------------------------------------
def figurine(s: Scene, pos, rot=0.0, arms="down", suit=M.ORANGE,
             helmet=M.HARDHAT, scale=1.0, lean=0.0):
    """A chunky toy worker: big helmet, capsule body, stubby legs."""
    x, y, z = pos
    k = scale
    cr, sr = math.cos(rot), math.sin(rot)

    def R(dx, dy, dz):
        return (x + (dx * cr - dz * sr) * k, y + dy * k, z + (dx * sr + dz * cr) * k)

    # boots + legs
    for side in (-1, 1):
        s.box(R(side * 0.26, 0.10, 0.02), (0.34 * k, 0.20 * k, 0.62 * k), M.DARK)
        s.box(R(side * 0.26, 0.42, 0.0), (0.30 * k, 0.52 * k, 0.30 * k), suit)
    # torso (slightly barrel-shaped: two stacked boxes)
    s.box(R(0, 0.86, 0), (0.92 * k, 0.62 * k, 0.56 * k), suit)
    s.box(R(0, 1.18, 0), (0.86 * k, 0.30 * k, 0.54 * k), suit)
    # hi-vis stripe
    s.box(R(0, 0.90, 0.29), (0.80 * k, 0.12 * k, 0.04 * k), M.GOLD)
    # arms
    if arms == "down":
        for side in (-1, 1):
            s.box(R(side * 0.60, 0.92, 0), (0.22 * k, 0.66 * k, 0.24 * k), suit)
            s.sphere(R(side * 0.60, 0.56, 0), 0.13 * k, M.SKIN, seg=8, rings=5)
    elif arms == "up":
        for side in (-1, 1):
            s.box(R(side * 0.62, 1.28, 0), (0.20 * k, 0.70 * k, 0.22 * k), suit)
            s.sphere(R(side * 0.62, 1.64, 0), 0.13 * k, M.SKIN, seg=8, rings=5)
    elif arms == "work":
        for side in (-1, 1):
            s.box(R(side * 0.52, 1.06, 0.26), (0.20 * k, 0.22 * k, 0.54 * k), suit)
            s.sphere(R(side * 0.44, 1.06, 0.56), 0.13 * k, M.SKIN, seg=8, rings=5)
    elif arms == "tool":
        s.box(R(-0.52, 1.12, 0.20), (0.20 * k, 0.24 * k, 0.52 * k), suit)
        s.box(R(0.56, 0.86, 0.16), (0.20 * k, 0.60 * k, 0.22 * k), suit)
        s.sphere(R(0.42, 1.12, 0.30), 0.13 * k, M.SKIN, seg=8, rings=5)
    # head + helmet
    s.sphere(R(0, 1.56, 0), 0.34 * k, M.SKIN, seg=10, rings=6)
    s.sphere(R(0, 1.68, 0), 0.40 * k, helmet, seg=10, rings=5, squish=0.78)
    s.cylinder(R(0, 1.62, 0), 0.42 * k, 0.10 * k, helmet, seg=14)
    # face dots
    s.sphere(R(-0.11, 1.55, 0.31), 0.045 * k, M.DARK, seg=6, rings=4)
    s.sphere(R(0.11, 1.55, 0.31), 0.045 * k, M.DARK, seg=6, rings=4)


def laptop(s: Scene, pos, open_amt=1.0, screen_glow=0.0, scale=1.0,
           locked=0.0):
    x, y, z = pos
    # base — sits on top of the mat
    y = y + 0.14
    s.box((x, y + 0.35, z), (18.0, 0.70, 12.0), M.LAPTOP)
    s.box((x, y + 0.72, z), (17.2, 0.06, 11.2), M.LAPTOP_DARK)
    # trackpad
    s.box((x, y + 0.76, z + 2.7), (5.2, 0.05, 3.0), M.KEY)
    # keyboard well
    for i in range(-7, 8):
        for j in range(-4, 1):
            s.box((x + i * 1.06, y + 0.78, z + j * 1.06 - 0.8),
                  (0.86, 0.20, 0.86), M.KEY)
    # lid, hinged at the back edge
    ang = -LAPTOP_LID_ANGLE * open_amt
    hl = 11.0
    cy = y + 0.35 + math.cos(ang) * hl / 2
    cz = z - 4.5 - math.sin(ang) * hl / 2
    s.box((x, cy, cz), (18.0, hl, 0.55), M.LAPTOP, rot=0.0)
    # screen face
    sz = cz + 0.32 * math.cos(ang)
    s.box((x, cy, sz), (16.8, hl - 1.2, 0.06), M.SCREEN)
    if screen_glow > 0:
        s.box((x, cy, sz + 0.05), (15.8, hl - 2.2, 0.05), (44, 58, 132),
              emissive=screen_glow * 0.85)
        # a grid of locked modules when the screen is "stuck"
        if locked > 0:
            for i in range(-3, 4):
                for j in range(-4, 4):
                    s.box((x + i * 2.1, cy + j * 1.5, sz + 0.10),
                          (1.65, 1.15, 0.04), (70, 84, 150), emissive=0.45)


def desk(s: Scene):
    # thick slab, big enough to fill frame from an overhead macro angle
    s.box((0, DESK_Y / 2, 0), (220, -DESK_Y, 170), M.WOOD)
    s.box((0, 0.01, 0), (221, 0.05, 171), M.WOOD_DARK)
    # a mat the laptop sits on (desk top is y=0, slab top is y=0.01..0.03)
    s.box((0, -0.02, 0), (34, 0.04, 24), M.DESK_MAT)


def mug(s: Scene, pos, col=(240, 96, 96)):
    x, y, z = pos
    s.cylinder((x, y + 0.7, z), 1.1, 1.4, col, seg=16)
    s.cylinder((x, y + 1.42, z), 1.0, 0.1, (250, 240, 230), seg=16)


def book(s: Scene, pos, col=(90, 140, 220), rot=0.0):
    x, y, z = pos
    s.box((x, y + 0.28, z), (5.4, 0.55, 7.2), col, rot=rot)
    s.box((x, y + 0.58, z), (5.0, 0.06, 6.8), (250, 248, 244), rot=rot)


def chalkboard(s: Scene, pos, rot=0.0):
    x, y, z = pos
    cr, sr = math.cos(rot), math.sin(rot)

    def R(dx, dy, dz):
        return (x + dx * cr - dz * sr, y + dy, z + dx * sr + dz * cr)

    s.box(R(0, 1.5, 0), (4.2, 3.0, 0.24), (58, 44, 36), rot=rot)
    s.box(R(0, 1.5, 0.14), (3.8, 2.6, 0.06), (46, 74, 60), rot=rot)
    # squiggles of confusion
    for i, dy in enumerate((2.2, 1.7, 1.2, 0.7)):
        w = 2.6 - i * 0.3
        s.box(R(0, dy, 0.18), (w, 0.10, 0.02), (222, 232, 226), rot=rot)


# ---------------------------------------------------------------------------
# the five beats
# ---------------------------------------------------------------------------
def build(t, beats=None, scene=None) -> Scene:
    """Assemble the set for absolute time `t`, driven by the real beat clock.

    `beats` is [(start, end_or_None), ...] for the five sections, so every
    action happens inside its own beat instead of on a hard-coded 10 s loop.
    """
    s = scene or Scene()
    s.faces.clear()
    desc = lambda: (0, 0, 0, 0)
    desk(s)

    if beats is None:
        cuts = [0.0, 12.9, 31.5, 52.3, 63.6]
    else:
        cuts = [b[0] for b in beats]
        while len(cuts) < 5:
            cuts.append(cuts[-1] + 2.0)
    end_t = beats[4][1] if (beats and beats[4][1]) else 90.0
    b1, b2, b3, b4 = cuts[1], cuts[2], cuts[3], cuts[4]

    # props that stay put for the whole film
    mug(s, (-11.5, 0.05, -7.2))
    book(s, (10.4, 0.02, -6.4), (96, 148, 226), rot=0.28)
    book(s, (11.2, 0.02, -5.0), (250, 196, 92), rot=-0.14)

    # ---- beat 1: the problem -------------------------------------------------
    in_b1 = t < b2
    laptop(s, (0, 0.0, -1.0), open_amt=1.0,
           screen_glow=1.0 if in_b1 else 0.0,
           locked=1.0 if in_b1 else 0.0)
    if in_b1:
        # a padlock icon sits on the locked screen
        pk = ease_out(seg(t, 1.2, 1.4))
        if pk > 0:
            s.cylinder((0.0, 7.4 + 12 * (1 - pk), 1.9), 1.15, 0.42, M.STEEL,
                       seg=16, axis="z")
            s.box((0.0, 5.6 + 12 * (1 - pk), 1.9), (2.3, 2.3, 0.5), M.GOLD)
            s.box((0.0, 5.6 + 12 * (1 - pk), 2.2), (0.5, 1.0, 0.2), M.DARK)
        # keep the beat alive: the student slumps, the board gets wheeled in
        bob = 0.09 * math.sin(t * 3.4) - 0.10 * ease_in_out(seg(t, 3.0, 6.0))
        figurine(s, (1.9, 1.02 + bob, 3.9), rot=-0.15, arms="down",
                 suit=(96, 132, 214), helmet=(120, 156, 232), scale=1.15)
        chalkboard(s, (-5.8, 1.0, 3.4), rot=0.62)
        # a worker rolls the confusing chalkboard in
        roll = ease_out(seg(t, b1 * 0.25, 1.6))
        figurine(s, (-5.8 + 4.0 * (1 - roll), 1.55, 5.2), rot=0.9,
                 arms="work", scale=1.0)

    # ---- beat 2: building the skill -----------------------------------------
    if b2 <= t < b3:
        k = ease_in_out(seg(t, b2 + 0.3, b3 - b2 - 1.0))
        tiles = brain_tiles(k, t)
        cx, cy, cz = 0.0, 3.0, -0.2
        for (px, py, pz, col, sc) in tiles:
            s.sphere((cx + px, cy + py, cz + pz), 0.30 * sc, col,
                     seg=7, rings=5, emissive=1.0)
        # crane lowers one glowing piece, then retracts
        ck = seg(t, b2 + 0.2, 3.2)
        if ck < 0.92:
            s.box((-5.4, 6.6, -0.6), (0.24, 7.0, 0.24), M.STEEL)
            s.box((-2.6, 10.0, -0.6), (6.0, 0.26, 0.26), M.STEEL)
            hy = 8.4 - 4.4 * ease_out(ck)
            s.box((-0.4, hy, -0.6), (0.07, 1.8, 0.07), M.STEEL)
            s.sphere((-0.4, hy - 1.0, -0.6), 0.36, M.CYAN, seg=8, rings=6,
                     emissive=1.0)
        figurine(s, (-7.0, 1.55, 3.2), rot=0.55, arms="work", scale=1.25)
        figurine(s, (6.8, 1.55, 3.3), rot=-0.7, arms="tool", scale=1.25)
        # a few early pieces already landed stay glowing
        for (px, py, pz, col, sc) in brain_tiles(1.0, t)[:8]:
            s.sphere((cx + px, cy + py, cz + pz), 0.26 * sc, col,
                     seg=6, rings=4, emissive=0.55)

    # ---- beat 3: the breakthrough -------------------------------------------
    if b3 <= t < b4:
        bkk = seg(t, b3 + 0.4, (b4 - b3) * 0.62)
        # the finished brain stays lit on the screen
        for (px, py, pz, col, sc) in brain_tiles(1.0, t):
            s.sphere((px * 0.86, 3.0 + py, -0.2 + pz * 0.7), 0.28 * sc, col,
                     seg=7, rings=5, emissive=1.0)
        if bkk < 0.62:
            s.box((0.0, 2.4, 1.8), (2.8, 2.4, 1.0), M.GOLD, rot=0.12)
            s.cylinder((0.0, 3.8, 1.8), 0.66, 0.24, M.STEEL, seg=14, axis="z")
            s.box((0.0, 3.8, 1.8), (0.95, 0.95, 0.26), M.DARK)
            sw = math.sin(min(1.0, bkk / 0.62) * math.pi) * 0.95
            s.box((2.2 - sw * 1.4, 3.0 + sw * 2.0, 1.8),
                  (0.24, 0.24, 2.6), M.STEEL, rot=sw * 0.5)
            s.box((2.6 - sw * 1.4, 3.0 + sw * 2.0, 3.0), (1.0, 1.0, 1.1), M.STEEL)
        else:
            age = t - (b3 + 0.4 + (b4 - b3) * 0.62)
            for i in range(20):
                ph = i * 2.399
                r = age * 4.0
                s.sphere((math.cos(ph) * r, 2.6 + math.sin(ph * 1.7) * r * 0.7,
                          1.8 + math.sin(ph) * r),
                         0.14 * max(0.04, 1.3 - age * 0.9),
                         M.GOLD if i % 2 else M.CYAN, seg=5, rings=4, emissive=1.0)
        figurine(s, (-6.6, 1.55, 3.4), rot=0.7, arms="tool", scale=1.25)

    # ---- beat 4: the launch --------------------------------------------------
    if b4 <= t < end_t:
        # caps keep rocketing for the first half of the beat
        lk = seg(t, b4 + 0.1, (end_t - b4) * 0.55)
        if lk < 1.0:
            for i in range(14):
                off = (t - b4) * 3.0 - i * 0.18
                if off < 0:
                    continue
                y = 1.4 + off * 9.5
                x = (i - 6.5) * 0.5
                cap(s, (x, y, 1.2 + math.sin(i * 1.3) * 0.6), 0.46,
                    M.GOLD if i % 3 else M.CYAN, emissive=0.6)
        figurine(s, (-6.4, 1.55, 3.6), rot=0.45, arms="up", scale=1.2)
        figurine(s, (6.2, 1.55, 3.6), rot=-0.45, arms="up", scale=1.2)
        # the CTA button is stamped on at the very end
        st_k = seg(t, end_t - 3.4, 1.5)
        if st_k > 0:
            drop = (1 - ease_out(st_k)) * 7.5
            by = 1.5 - drop
            s.box((0.0, by, 4.2), (7.2, 1.30, 2.3), M.MAGENTA, emissive=0.55)
            s.box((0.0, by, 5.38), (5.4, 0.52, 0.06), (255, 255, 255),
                  emissive=0.9)

    return s


def brain_tiles(k: float, t: float):
    """Puzzle tiles that fly into a brain shape as `k` goes 0 → 1."""
    out = []
    n = 22
    for i in range(n):
        ph = i * 2.399
        # target inside a squashed sphere (brain-ish: two lobes)
        th = (i / n) * math.pi
        rad = 1.5 * math.sin(th) + 0.4
        tx = math.cos(ph) * rad * 1.15
        ty = math.cos(th) * 1.35
        tz = math.sin(ph) * rad * 0.85
        if tx > 0:
            tx += 0.35
        else:
            tx -= 0.35
        # start scattered
        sx = math.cos(ph * 2.1) * 6.0
        sy = 5.0 + math.sin(ph) * 3.0
        sz = math.sin(ph * 1.7) * 4.0
        e = ease_out(min(1.0, k * 1.25 - (i / n) * 0.25))
        px = sx + (tx - sx) * e
        py = sy + (ty - sy) * e
        pz = sz + (tz - sz) * e
        col = (M.CYAN, M.MAGENTA, M.LIME, M.GOLD)[i % 4]
        sc = 0.55 + 0.45 * e
        out.append((px, py + 2.6, pz, col, sc))
    return out


def cap(s: Scene, pos, size, colour, emissive=0.0):
    """A graduation cap: flat board + a stubby crown."""
    x, y, z = pos
    s.box((x, y, z), (size * 1.5, size * 0.16, size * 1.5), (34, 40, 58), rot=0.5)
    s.box((x, y - size * 0.24, z), (size * 0.95, size * 0.42, size * 0.95),
          (34, 40, 58))
    s.box((x, y + size * 0.10, z), (size * 0.18, size * 0.5, size * 0.18),
          colour, emissive=emissive)
