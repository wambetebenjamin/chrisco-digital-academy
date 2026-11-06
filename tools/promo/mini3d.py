"""A miniature 3D renderer for the tilt-shift course-promo look.

There is no Blender here, so this is a small painter's-algorithm engine: flat
shaded polygons, a hand-built cast of toy objects, a macro camera, and the two
tricks that make CGI read as a miniature — a strong tilt-shift blur and a
saturated, high-key grade.

Everything is drawn in world units where 1.0 is roughly "one laptop key".
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

from PIL import Image, ImageChops, ImageDraw, ImageFilter

W, H = 1080, 1920

# --- toy palette ---------------------------------------------------------
WOOD = (196, 132, 82)
WOOD_DARK = (162, 104, 62)
DESK_MAT = (58, 64, 86)
LAPTOP = (222, 228, 236)
LAPTOP_DARK = (150, 160, 176)
KEY = (246, 248, 252)
KEY_EDGE = (206, 214, 226)
SCREEN = (26, 32, 48)
SKIN = (232, 188, 158)
ORANGE = (255, 122, 26)
HARDHAT = (255, 196, 46)
CYAN = (41, 231, 255)
MAGENTA = (255, 63, 164)
LIME = (166, 255, 61)
GOLD = (255, 206, 74)
STEEL = (188, 198, 212)
DARK = (32, 38, 54)


# ---------------------------------------------------------------------------
# math
# ---------------------------------------------------------------------------
def vsub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def vadd(a, b):
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])


def vmul(a, k):
    return (a[0] * k, a[1] * k, a[2] * k)


def dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def cross(a, b):
    return (a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0])


def norm(a):
    m = math.sqrt(max(1e-6, dot(a, a)))
    return (a[0] / m, a[1] / m, a[2] / m)


@dataclass
class Cam:
    pos: tuple = (0.0, 7.0, 15.0)
    target: tuple = (0.0, 0.0, 0.0)
    focal: float = 1500.0
    yaw: float = 0.0
    pitch: float = -0.30

    def basis(self):
        # camera looks from pos to target, then yaw/pitch orbit around target
        d = norm(vsub(self.target, self.pos))
        cy, sy = math.cos(-self.yaw), math.sin(-self.yaw)
        d = (d[0] * cy - d[2] * sy, d[1], d[0] * sy + d[2] * cy)
        fwd = d
        right = norm(cross((0, 1, 0), fwd))
        up = cross(fwd, right)
        return right, up, fwd

    def project(self, p):
        right, up, fwd = self.basis()
        rel = vsub(p, self.pos)
        x = dot(rel, right)
        y = dot(rel, up)
        z = dot(rel, fwd)
        if z <= 0.05:
            return None
        return (W / 2 + self.focal * x / z,
                H / 2 - self.focal * y / z,
                z)


# ---------------------------------------------------------------------------
# scene
# ---------------------------------------------------------------------------
@dataclass
class Face:
    pts: list            # world-space vertices
    colour: tuple
    emissive: float = 0.0
    alpha: int = 255


@dataclass
class Scene:
    faces: list = field(default_factory=list)

    def add(self, pts, colour, emissive=0.0, alpha=255):
        self.faces.append(Face(pts, colour, emissive, alpha))

    def box(self, c, size, colour, emissive=0.0, rot=0.0, alpha=255):
        """Axis-aligned box (optionally spun about Y) centred at c."""
        sx, sy, sz = size[0] / 2, size[1] / 2, size[2] / 2
        cr, sr = math.cos(rot), math.sin(rot)

        def p(x, y, z):
            return (c[0] + x * cr - z * sr, c[1] + y, c[2] + x * sr + z * cr)

        v = [p(-sx, -sy, -sz), p(sx, -sy, -sz), p(sx, sy, -sz), p(-sx, sy, -sz),
             p(-sx, -sy, sz), p(sx, -sy, sz), p(sx, sy, sz), p(-sx, sy, sz)]
        quads = [(0, 1, 2, 3), (4, 5, 6, 7), (0, 4, 7, 3),
                 (1, 5, 6, 2), (0, 1, 5, 4), (3, 2, 6, 7)]
        for q in quads:
            self.add([v[i] for i in q], colour, emissive, alpha)

    def cylinder(self, c, r, h, colour, seg=12, axis="y", emissive=0.0, alpha=255):
        cr, sr = math.cos(math.tau / seg), math.sin(math.tau / seg)
        ring = []
        x, z = r, 0.0
        for _ in range(seg):
            ring.append((x, z))
            x, z = x * cr - z * sr, x * sr + z * cr
        def P(a, b, up):
            if axis == "y":
                return (c[0] + a, c[1] + up, c[2] + b)
            return (c[0] + a, c[1] + b, c[2] + up)
        for i in range(seg):
            a, b = ring[i], ring[(i + 1) % seg]
            self.add([P(a[0], a[1], -h / 2), P(b[0], b[1], -h / 2),
                      P(b[0], b[1], h / 2), P(a[0], a[1], h / 2)], colour,
                     emissive, alpha)
        self.add([P(a[0], a[1], h / 2) for a in ring], colour, emissive, alpha)
        self.add([P(a[0], a[1], -h / 2) for a in reversed(ring)], colour,
                 emissive, alpha)

    def sphere(self, c, r, colour, seg=10, rings=6, emissive=0.0, squish=1.0):
        pts = []
        for i in range(rings + 1):
            phi = math.pi * i / rings
            row = []
            for j in range(seg):
                th = math.tau * j / seg
                row.append((c[0] + r * math.sin(phi) * math.cos(th),
                            c[1] + r * math.cos(phi) * squish,
                            c[2] + r * math.sin(phi) * math.sin(th)))
            pts.append(row)
        for i in range(rings):
            for j in range(seg):
                a = pts[i][j]
                b = pts[i][(j + 1) % seg]
                cc = pts[i + 1][(j + 1) % seg]
                d = pts[i + 1][j]
                self.add([a, b, cc, d], colour, emissive)

    def tri(self, a, b, c, colour, emissive=0.0, alpha=255):
        self.add([a, b, c], colour, emissive, alpha)

    def quad(self, a, b, c, d, colour, emissive=0.0, alpha=255):
        self.add([a, b, c, d], colour, emissive, alpha)


# ---------------------------------------------------------------------------
# render
# ---------------------------------------------------------------------------
LIGHT = norm((0.45, 0.82, 0.36))


def backdrop() -> Image.Image:
    """Warm studio backdrop with soft bokeh: the out-of-focus world behind."""
    im = Image.new("RGB", (W, H), (255, 246, 236))
    d = ImageDraw.Draw(im, "RGBA")
    for y in range(H):
        k = y / H
        d.line([(0, y), (W, y)], fill=(int(255 - 6 * k), int(243 - 10 * k),
                                       int(232 + 6 * k)))
    for i in range(26):
        cx = int((i * 977) % W)
        cy = int((i * 613) % H)
        r = 40 + (i * 53) % 130
        d.ellipse((cx - r, cy - r, cx + r, cy + r),
                  fill=(255, 238, 214, 34))
    return im.filter(ImageFilter.GaussianBlur(16))


def render(scene: Scene, cam: Cam, bg=(255, 250, 244)) -> tuple:
    """Return (sharp RGB image, emissive RGB image) at W×H."""
    img = backdrop()
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    d = ImageDraw.Draw(img)
    gd = ImageDraw.Draw(glow)

    items = []
    for f in scene.faces:
        # Every primitive here is convex, so instead of culling by winding
        # (which is easy to get backwards per shape) flip each normal to face
        # the camera and let the painter's sort hide the far side. That keeps
        # shading correct without depending on vertex order.
        if len(f.pts) >= 3:
            u = vsub(f.pts[1], f.pts[0])
            v = vsub(f.pts[2], f.pts[0])
            n = cross(u, v)
            c = (sum(p[0] for p in f.pts) / len(f.pts),
                 sum(p[1] for p in f.pts) / len(f.pts),
                 sum(p[2] for p in f.pts) / len(f.pts))
            if dot(n, vsub(cam.pos, c)) < 0:
                n = (-n[0], -n[1], -n[2])
            items.append((f, n, c))

    proj = []
    for f, n, c in items:
        pts = []
        ok = True
        depths = []
        for p in f.pts:
            q = cam.project(p)
            if q is None:
                ok = False
                break
            pts.append((q[0], q[1]))
            depths.append(q[2])
        if not ok:
            continue
        if max(x for x, _ in pts) < -80 or min(x for x, _ in pts) > W + 80:
            continue
        if max(y for _, y in pts) < -80 or min(y for _, y in pts) > H + 80:
            continue
        proj.append((max(depths), pts, f, n))

    proj.sort(key=lambda t: -t[0])

    for _, pts, f, n in proj:
        if f.emissive > 0:
            col = f.colour
            gd.polygon(pts, fill=col)
            if f.emissive <= 1.0:
                base = tuple(int(c * (1 - f.emissive) + cc * f.emissive)
                             for c, cc in zip(_shade(f.colour, n), col))
                d.polygon(pts, fill=base)
            continue
        d.polygon(pts, fill=_shade(f.colour, n))
    return img, glow


def _shade(colour, n):
    nn = norm(n)
    lam = max(0.0, dot(nn, LIGHT))
    amb = 0.62
    k = min(1.25, amb + 0.72 * lam)
    return tuple(min(255, int(c * k)) for c in colour)


def tilt_shift(img: Image.Image, strength: int = 26,
               focus: tuple = (0.30, 0.62)) -> Image.Image:
    """Blur top and bottom, keep a horizontal band sharp: the 'toy' effect."""
    blurred = img.filter(ImageFilter.GaussianBlur(strength))
    mask = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(mask)
    y0, y1 = int(H * focus[0]), int(H * focus[1])
    for y in range(H):
        if y < y0:
            k = (y0 - y) / max(1, y0)
        elif y > y1:
            k = (y - y1) / max(1, H - y1)
        else:
            k = 0.0
        d.line([(0, y), (W, y)], fill=int(255 * min(1.0, k ** 0.75)))
    return Image.composite(blurred, img, mask)


def add_glow(img: Image.Image, glow: Image.Image, radius: int = 34,
             gain: float = 1.30) -> Image.Image:
    """Screen the blurred emissive layer back over the beauty pass."""
    g = glow.filter(ImageFilter.GaussianBlur(radius))
    g = Image.blend(g, g.filter(ImageFilter.GaussianBlur(radius * 3)), 0.55)
    g = Image.eval(g, lambda v: min(255, int(v * gain)))
    return ImageChops.screen(img.convert("RGB"), g)
