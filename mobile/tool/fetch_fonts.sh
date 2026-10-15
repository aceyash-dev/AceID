#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FONT_DIR="$ROOT/assets/fonts"
mkdir -p "$FONT_DIR"

# Instrument Serif is distributed by Google Fonts under the SIL Open Font License.
curl --fail --location --retry 3 --retry-delay 2 \
  'https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/InstrumentSerif-Regular.ttf' \
  --output "$FONT_DIR/InstrumentSerif-Regular.ttf"

# Satoshi is downloaded from Fontshare at build time rather than mirrored in this public repo.
ARCHIVE="$(mktemp)"
trap 'rm -f "$ARCHIVE"' EXIT
curl --fail --location --retry 3 --retry-delay 2 \
  -H 'User-Agent: AceID-Android-Build/1.0' \
  'https://api.fontshare.com/v2/fonts/download/satoshi' \
  --output "$ARCHIVE"

python3 - "$ARCHIVE" "$FONT_DIR" <<'PY'
import pathlib
import shutil
import sys
import zipfile

archive = pathlib.Path(sys.argv[1])
out = pathlib.Path(sys.argv[2])
if not zipfile.is_zipfile(archive):
    raise SystemExit('Fontshare did not return a ZIP archive. Check the official Satoshi download endpoint.')
with zipfile.ZipFile(archive) as z:
    members = [name for name in z.namelist() if not name.endswith('/')]
    for style in ('Regular', 'Medium', 'Bold'):
        wanted = f'satoshi-{style.lower()}'
        candidates = [name for name in members if pathlib.PurePosixPath(name).suffix.lower() in ('.otf', '.ttf') and pathlib.PurePosixPath(name).stem.lower() == wanted]
        if not candidates:
            raise SystemExit(f'Official Satoshi archive is missing the {style} OTF/TTF face.')
        # Prefer OTF, then TTF; extract only the three faces the app uses.
        candidates.sort(key=lambda name: (pathlib.PurePosixPath(name).suffix.lower() != '.otf', len(name)))
        target = out / f'Satoshi-{style}.otf'
        with z.open(candidates[0]) as src, target.open('wb') as dst:
            shutil.copyfileobj(src, dst)
        print(f'Installed Satoshi {style} from Fontshare')
PY

test -s "$FONT_DIR/InstrumentSerif-Regular.ttf"
for face in Regular Medium Bold; do test -s "$FONT_DIR/Satoshi-$face.otf"; done
