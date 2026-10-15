#!/usr/bin/env python3
"""Typography codemod for Evently_Mobile_Frontend.

Pass 1: every style object that sets text props -> typography token spread.
Pass 2: EventlyText -> AppText, legacy variants -> new variants, and the JSX
        variant synced to the token its style resolves to.
Writes a JSON report to argv[2].
"""
import json, os, re, sys, colorsys
from collections import defaultdict

ROOT = sys.argv[1]
SRC = os.path.join(ROOT, 'src')
REPORT = {'styles': [], 'skipped': [], 'colors': defaultdict(int), 'files': set()}

EXCLUDE = {
    'src/theme/typography.ts', 'src/theme/fonts.ts', 'src/theme/textColors.ts',
    'src/theme/index.ts', 'src/theme/colors.ts', 'src/theme/brand.ts',
    'src/Components/AppText.tsx', 'src/Components/EventlyText.tsx',
    # user-selectable invitation cover faces: content, not UI typography
    'src/modules/Invitation/constants.ts',
}

def files():
    for d, _, fs in os.walk(SRC):
        for f in fs:
            if f.endswith(('.ts', '.tsx')):
                p = os.path.join(d, f)
                rel = os.path.relpath(p, ROOT)
                if rel not in EXCLUDE:
                    yield p, rel

# ---------------------------------------------------------------- scanning
def scan_objects(s):
    """Yield (open, close) of every {...} span, skipping strings/comments/templates."""
    stack, out, i, n = [], [], 0, len(s)
    while i < n:
        c = s[i]
        if c in '"\'':
            j = i + 1
            while j < n and s[j] != c:
                j += 2 if s[j] == '\\' else 1
            i = j + 1; continue
        if c == '`':
            j = i + 1
            while j < n and s[j] != '`':
                j += 2 if s[j] == '\\' else 1
            i = j + 1; continue
        if s.startswith('//', i):
            j = s.find('\n', i); i = n if j < 0 else j; continue
        if s.startswith('/*', i):
            j = s.find('*/', i); i = n if j < 0 else j + 2; continue
        if c == '{': stack.append(i)
        elif c == '}' and stack:
            out.append((stack.pop(), i))
        i += 1
    return out

def split_props(s, a, b):
    """Top-level comma-separated members of the object body s[a+1:b]: list of (start,end,text)."""
    props, depth, i, start = [], 0, a + 1, a + 1
    while i < b:
        c = s[i]
        if c in '"\'`':
            q = c; j = i + 1
            while j < b and s[j] != q:
                j += 2 if s[j] == '\\' else 1
            i = j + 1; continue
        if s.startswith('//', i):
            j = s.find('\n', i); i = j; continue
        if s.startswith('/*', i):
            j = s.find('*/', i); i = j + 2; continue
        if c in '([{': depth += 1
        elif c in ')]}': depth -= 1
        elif c == ',' and depth == 0:
            props.append((start, i)); start = i + 1
        i += 1
    props.append((start, b))
    res = []
    for st, en in props:
        txt = s[st:en]
        # strip leading whitespace/comments for the key, keep span
        m = re.match(r'(\s*(?:(?://[^\n]*\n)|(?:/\*.*?\*/))?\s*)*', txt, re.S)
        lead = m.end() if m else 0
        body = txt[lead:].rstrip()
        if body:
            res.append((st + lead, st + lead + len(body), body))
    return res

def key_before(s, a):
    m = re.search(r'([A-Za-z_$][\w$]*)\s*[:=]\s*(?:\(\s*)?$', s[max(0, a - 120):a])
    return m.group(1) if m else ''

# ---------------------------------------------------------------- colours
CONSTS = {}
def collect_consts():
    for p, rel in files():
        s = open(p).read()
        for m in re.finditer(r"(?:export\s+)?const\s+([A-Z_][\w]*)\s*=\s*'(#[0-9a-fA-F]{3,8})'", s):
            CONSTS[m.group(1)] = m.group(2)
        for m in re.finditer(r"(?:export\s+)?const\s+([A-Za-z_][\w]*)\s*=\s*\{([^{}]*)\}", s):
            for mm in re.finditer(r"([A-Za-z_]\w*)\s*:\s*'(#[0-9a-fA-F]{3,8})'", m.group(2)):
                CONSTS[m.group(1) + '.' + mm.group(1)] = mm.group(2)
    for f in ('colors', 'brand'):
        s = open(os.path.join(SRC, 'theme', f + '.ts')).read()
        for mm in re.finditer(r"([A-Za-z_]\w*)\s*:\s*'(#[0-9a-fA-F]{3,8})'", s):
            CONSTS[f + '.' + mm.group(1)] = mm.group(2)

def hex_rgb(h):
    h = h.lstrip('#')
    if len(h) == 3: h = ''.join(c * 2 for c in h)
    if len(h) != 6: return None
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))

def classify(expr):
    e = expr.strip()
    hx = e.strip("'\"") if re.fullmatch(r"'#[0-9a-fA-F]{3,8}'", e) else CONSTS.get(e)
    if not hx: return None
    rgb = hex_rgb(hx)
    if not rgb: return None
    h, l, sat = colorsys.rgb_to_hls(*rgb)
    if l >= 0.97: return 'textOnPrimary'
    if l <= 0.22: return 'textPrimary'
    if sat <= 0.25 and l < 0.55: return 'textSecondary'
    if sat <= 0.25 and l < 0.80: return 'textDisabled'
    if hx.lower() == '#4f46e5': return 'textLink'
    return None

# ---------------------------------------------------------------- variants
OLD_TOKENS = {  # old typography tokens -> (size, weight)
    'display': (28, 700), 'screenTitle': (20, 700), 'sectionTitle': (18, 700),
    'cardTitle': (16, 600), 'body': (15, 400), 'bodyMedium': (15, 500),
    'label': (13, 500), 'small': (12, 400), 'caption': (11, 400),
    'button': (15, 600), 'input': (15, 400), 'placeholder': (14, 400),
    'h1': (20, 700), 'h2': (18, 700), 'subtitle': (15, 500),
}
HEADINGS = {'display', 'h1', 'h2', 'h3', 'button', 'buttonSmall', 'label', 'overline'}

def wname(w):
    if w is None: return None
    if w >= 600: return 'semibold'
    if w == 500: return 'medium'
    return None

def pick(size, weight, key, upper):
    k = key.lower()
    words = [x.lower() for x in re.findall(r'[a-z]+|[A-Z][a-z]*|[A-Z]+(?![a-z])', key)]
    def has(*ws): return any(x in words for x in ws)
    w = weight or 400
    if 'tabbarlabel' in k: return ('TAB', None)
    if 'headertitle' in k: return ('h3', None)
    if 'input' in k or 'placeholder' in k:
        return ('bodyLarge' if size >= 15 else 'body', None)
    if has('btn', 'button', 'cta'):
        return ('button' if size >= 15 else 'buttonSmall', None)
    if has('link') and size <= 15:
        return ('buttonSmall', None)
    if has('chip', 'chips', 'tag', 'tags', 'badge', 'pill', 'status', 'tab', 'tabs', 'eyebrow', 'kicker', 'overline') and size <= 13:
        return ('overline' if upper else 'label', None)
    if words and words[-1] == 'label' and size <= 14:
        return ('overline' if upper else 'label', None)
    if size >= 30: return ('display', None)
    if size >= 24: return ('h1', None)
    if size >= 19: return ('h2', None)
    if size >= 17: return ('h3', None)
    if size >= 16:
        return ('h3', None) if w >= 600 else ('bodyLarge', wname(w))
    if size >= 15:
        return ('h3', None) if w >= 600 else ('bodyLarge', wname(w))
    if size >= 14: return ('body', wname(w))
    if size >= 13: return ('bodySmall', wname(w))
    if size >= 12:
        if upper and w >= 600: return ('overline', None)
        return ('label', None) if w >= 500 else ('caption', None)
    # 11 and below
    if upper: return ('overline', None)
    return ('label', None) if w >= 500 else ('caption', None)

NUM = re.compile(r'^-?\d+(?:\.\d+)?$')

def process_file(p, rel, keymap):
    s = open(p).read()
    edits = []  # (start, end, replacement)
    used = set()
    for a, b in scan_objects(s):
        props = split_props(s, a, b)
        names = {}
        for st, en, txt in props:
            m = re.match(r'([A-Za-z_]\w*)\s*:\s*(.*)$', txt, re.S)
            if m: names.setdefault(m.group(1), []).append((st, en, m.group(2).strip()))
            elif txt.startswith('...'):
                names.setdefault('...', []).append((st, en, txt[3:].strip()))
        spreads = names.get('...', [])
        typo_spreads = [x for x in spreads if re.match(r'(displayType\(|EYEBROW$|typography\.\w+$|typographyTokens\.\w+$)', x[2])]
        has_font = any(n in names for n in ('fontSize', 'fontWeight', 'fontFamily')) or typo_spreads
        key = key_before(s, a)
        textish = re.search(r'(Text|Title|Label|Caption|Name|Subtitle|Meta|Hint|Value|Desc|Heading|Copy|Body|Eyebrow|Kicker|Price|Amount|Count|Number|Stat|Time|Date|Error|Message|Note|Sub|Line)\d*$', key or '')
        if not has_font and not ('color' in names and textish):
            continue
        # bail-outs
        if any(n in names for n in ('fontStyleSkip',)): continue
        ff = names.get('fontFamily', [])
        if ff and re.search(r'cursive|Snell', ff[0][2]):
            REPORT['skipped'].append(f'{rel}:{key} decorative script face kept'); continue
        if 'stroke' in names or 'fill' in names:  # svg props
            continue
        size = weight = None
        upper = 'textTransform' in names and 'uppercase' in names['textTransform'][0][2]
        ok = True
        if 'fontSize' in names:
            v = names['fontSize'][0][2]
            if NUM.match(v): size = float(v)
            else: ok = False
        if 'fontWeight' in names:
            v = names['fontWeight'][0][2].strip("'\"")
            if v.isdigit(): weight = int(v)
            elif v == 'bold': weight = 700
            elif v == 'normal': weight = 400
            else: ok = False
        for st, en, ex in typo_spreads:
            m = re.match(r'displayType\(([\d.]+)\)', ex)
            if m: size = size or float(m.group(1)); weight = weight or 700
            elif ex == 'EYEBROW': size = size or 10.5; weight = weight or 600; upper = True
            else:
                tk = ex.split('.')[1]
                if tk in OLD_TOKENS:
                    size = size or OLD_TOKENS[tk][0]; weight = weight or OLD_TOKENS[tk][1]
        if ff and not size and weight is None:
            m = re.search(r"fontFor\('(\d+)'\)|fontFamilies\.(\w+)", ff[0][2])
            if m:
                weight = int(m.group(1)) if m.group(1) else {'regular': 400, 'medium': 500, 'semibold': 600, 'bold': 700, 'extrabold': 800}.get(m.group(2), 400)
        if not ok:
            REPORT['skipped'].append(f'{rel}:{key} computed font size/weight, left as is'); continue
        removals = []
        replacement = None
        if has_font:
            if size is None:
                # weight-only (or family-only) override: keep its size, swap weight for a face
                wn = wname(weight) if weight else None
                if weight and weight >= 700: wn = 'bold'
                replacement = f'...fontWeights.{wn or "regular"}'
                used.add('fontWeights')
                variant = None
            else:
                variant, wn = pick(size, weight, key, upper)
                if variant == 'TAB':
                    replacement = '...tabBarLabel'; used.add('tabBarLabel')
                else:
                    replacement = f'...typography.{variant}'; used.add('typography')
                    if wn and variant not in HEADINGS:
                        replacement += f', ...fontWeights.{wn}'; used.add('fontWeights')
                if key: keymap[key] = variant if variant != 'TAB' else None
                REPORT['styles'].append((rel, key, size, weight, variant, wn))
            for n in ('fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'letterSpacing'):
                for st, en, _ in names.get(n, []):
                    removals.append((st, en))
            if upper and replacement and 'overline' in replacement:
                for st, en, _ in names.get('textTransform', []): removals.append((st, en))
            for st, en, _ in typo_spreads: removals.append((st, en))
        # colour
        for st, en, v in names.get('color', []):
            tok = classify(v)
            if tok:
                REPORT['colors'][f'{v} -> {tok}'] += 1
                used.add('textColor')
                edits.append((st, en, f'color: textColor.{tok}'))
        if replacement and removals:
            removals.sort()
            first = removals[0]
            edits.append((first[0], first[1], replacement))
            for st, en in removals[1:]:
                edits.append((st, en, None))
    if not edits:
        return False
    # apply bottom-up; a None replacement deletes the member and its comma
    edits.sort(key=lambda e: e[0], reverse=True)
    seen = set()
    for st, en, rep in edits:
        if (st, en) in seen: continue
        seen.add((st, en))
        if rep is None:
            m = re.match(r'\s*,', s[en:])
            e2 = en + (m.end() if m else 0)
            # also swallow the indentation/newline before the member
            st2 = st
            while st2 > 0 and s[st2 - 1] in ' \t': st2 -= 1
            if st2 > 0 and s[st2 - 1] == '\n' and m:
                st2 -= 1
            elif not m:
                # last member: remove preceding comma instead
                mm = re.search(r',\s*$', s[:st2])
                if mm: st2 = mm.start()
            s = s[:st2] + s[e2:]
        else:
            s = s[:st] + rep + s[en:]
    s = add_theme_import(s, p, used)
    open(p, 'w').write(s)
    REPORT['files'].add(rel)
    return True

def theme_spec(p):
    r = os.path.relpath(os.path.join(SRC, 'theme'), os.path.dirname(p))
    return r if r.startswith('.') else './' + r

def add_theme_import(s, p, names):
    if not names: return s
    spec = theme_spec(p)
    pat = re.compile(r"import\s*(type\s*)?\{([^}]*)\}\s*from\s*'" + re.escape(spec) + r"';")
    for m in pat.finditer(s):
        if m.group(1): continue
        have = [x.strip() for x in m.group(2).split(',') if x.strip()]
        new = have + [n for n in sorted(names) if n not in have]
        return s[:m.start()] + "import { " + ', '.join(new) + " } from '" + spec + "';" + s[m.end():]
    line = "import { " + ', '.join(sorted(names)) + " } from '" + spec + "';\n"
    # after the last import
    last = None
    for m in re.finditer(r"^import[\s\S]*?from\s*'[^']+';\s*$", s, re.M):
        last = m
    if last:
        return s[:last.end()] + '\n' + line.rstrip('\n') + s[last.end():]
    return line + s

def prune_imports(s):
    """Drop now-unused names from imports of theme, Home design and fonts."""
    def fix(m):
        names = [x.strip() for x in m.group(2).split(',') if x.strip()]
        keep = []
        body = s[:m.start()] + s[m.end():]
        for n in names:
            local = n.split(' as ')[-1].strip().replace('type ', '')
            if re.search(r'\b' + re.escape(local) + r'\b', body): keep.append(n)
        if not keep: return ''
        return m.group(1) + '{ ' + ', '.join(keep) + ' }' + m.group(3)
    return re.sub(r"(import\s*(?:type\s*)?)\{([^}]*)\}(\s*from\s*'[^']*(?:/theme|/design|/fonts|/typography)';)", fix, s)

# ---------------------------------------------------------------- JSX pass
LEGACY = {
    'caption': ('caption', None), 'body': ('body', None), 'subtitle': ('body', 'medium'),
    'small': ('bodySmall', None), 'label': ('label', None), 'sectionTitle': ('h2', None),
    'cardTitle': ('h3', None), 'screenTitle': ('h1', None), 'button': ('button', None),
    'bodyMedium': ('body', 'medium'), 'h1': ('h2', None), 'h2': ('h2', None),
}

def style_modules(s, p):
    """identifier -> absolute module path (or 'self') for style objects."""
    out = {}
    for m in re.finditer(r"const\s+(\w+)\s*=\s*StyleSheet\.create", s):
        out[m.group(1)] = p
    for m in re.finditer(r"import\s*\{([^}]*)\}\s*from\s*'(\.[^']*)';", s):
        mod = os.path.normpath(os.path.join(os.path.dirname(p), m.group(2)))
        for n in m.group(1).split(','):
            n = n.strip()
            if not n or n.startswith('type '): continue
            orig, _, alias = n.partition(' as ')
            out[(alias or orig).strip()] = mod
    for m in re.finditer(r"import\s+(\w+)\s+from\s*'(\.[^']*)';", s):
        out[m.group(1)] = os.path.normpath(os.path.join(os.path.dirname(p), m.group(2)))
    return out

def opening_tags(s, name):
    for m in re.finditer(r'<' + name + r'\b', s):
        i, depth, n = m.end(), 0, len(s)
        while i < n:
            c = s[i]
            if c == '{': depth += 1
            elif c == '}': depth -= 1
            elif c in '"\'' and depth == 0:
                i = s.index(c, i + 1)
            elif c == '>' and depth == 0 and s[i - 1] != '=':
                break
            i += 1
        yield m.start(), i + 1

def jsx_pass(p, rel, keymaps):
    s = open(p).read()
    orig = s
    s = re.sub(r'\bEventlyText\b(?!Input|Variant|Props)', 'AppText', s)
    s = re.sub(r"(from\s*'[^']*)/EventlyText'", r"\1/AppText'", s)
    mods = style_modules(s, p)
    out, last = [], 0
    for a, b in opening_tags(s, 'AppText'):
        tag = s[a:b]
        new = tag
        # legacy variant names
        m = re.search(r'\svariant="(\w+)"', new)
        weight = None
        if m and m.group(1) in LEGACY:
            v, weight = LEGACY[m.group(1)]
            new = new[:m.start()] + f' variant="{v}"' + new[m.end():]
        # sync to the style's token
        sm = re.search(r'\sstyle=\{', new)
        synced = None
        if sm:
            # take the style expression
            i, depth = sm.end(), 1
            while depth and i < len(new):
                depth += {'{': 1, '}': -1}.get(new[i], 0); i += 1
            expr = new[sm.end():i - 1]
            for mm in re.finditer(r'\b(\w+)\.(\w+)\b', expr):
                ident, k = mm.group(1), mm.group(2)
                before = expr[:mm.start()].rstrip()
                if before.endswith(('&&', '?', ':', '||')): continue  # conditional
                mod = mods.get(ident)
                if not mod: continue
                km = keymaps.get(mod) or keymaps.get(mod + '.ts') or keymaps.get(mod + '.tsx') or keymaps.get(os.path.join(mod, 'index.ts')) or {}
                if km.get(k): synced = km[k]
        if synced:
            weight = None
            if re.search(r'\svariant="\w+"', new):
                new = re.sub(r'\svariant="\w+"', f' variant="{synced}"', new, count=1)
            else:
                new = new.replace('<AppText', f'<AppText variant="{synced}"', 1)
        if weight and ' weight=' not in new:
            new = re.sub(r'(\svariant="\w+")', r'\1 weight="' + weight + '"', new, count=1)
        if new != tag:
            out.append(s[last:a]); out.append(new); last = b
    out.append(s[last:])
    s = ''.join(out)
    if s != orig:
        open(p, 'w').write(s)
        REPORT['files'].add(rel)

def main():
    collect_consts()
    keymaps = {}
    for p, rel in files():
        km = {}
        process_file(p, rel, km)
        keymaps[p] = km
    for p, rel in files():
        s = open(p).read()
        t = prune_imports(s)
        # Home design: SERIF no longer used for UI copy
        if t != s:
            open(p, 'w').write(t)
    for p, rel in files():
        if p.endswith('.tsx'):
            jsx_pass(p, rel, keymaps)
    rep = {
        'files': sorted(REPORT['files']),
        'styles': REPORT['styles'],
        'skipped': REPORT['skipped'],
        'colors': dict(REPORT['colors']),
    }
    json.dump(rep, open(sys.argv[2], 'w'), indent=1)
    print(len(rep['files']), 'files;', len(rep['styles']), 'styles;', len(rep['skipped']), 'skipped')

main()
