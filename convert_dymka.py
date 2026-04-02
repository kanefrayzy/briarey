"""
Конвертирует final.gif (с прозрачностью) в:
  dymka.webm  — VP9 с альфа-каналом   (Chrome, Firefox, Safari 14.1+)
  dymka.mov   — ProRes 4444 с альфа   (все версии Safari / iOS)

Использование:
    python convert_dymka.py

Входной файл:  frontend/public/images/final.gif
"""

import subprocess
import sys
from pathlib import Path

IMAGES = Path("frontend/public/images")
INPUT  = IMAGES / "final.gif"


def run(cmd: list[str]) -> None:
    print(f"\nЗапуск: {' '.join(cmd)}\n")
    result = subprocess.run(cmd, text=True, stderr=subprocess.PIPE)
    if result.returncode != 0:
        print("[ERROR] FFmpeg завершился с ошибкой:\n")
        print(result.stderr)
        sys.exit(1)


def main():
    if not INPUT.exists():
        print(f"[ERROR] Файл не найден: {INPUT}")
        sys.exit(1)

    IMAGES.mkdir(parents=True, exist_ok=True)

    # ── 1. WebM VP9 с альфа-каналом (Chrome, Firefox, Safari 14.1+) ──
    webm = IMAGES / "dymka.webm"
    run([
        "ffmpeg", "-y",
        "-i", str(INPUT),
        "-c:v", "libvpx-vp9",
        "-pix_fmt", "yuva420p",    # альфа-канал
        "-b:v", "0",               # режим CRF (auto bitrate)
        "-crf", "20",              # качество (0=лучше, 63=хуже)
        "-cpu-used", "2",          # скорость/качество (0-5)
        "-auto-alt-ref", "0",      # обязательно 0 при yuva420p
        "-an",
        str(webm),
    ])
    print(f"[OK] {webm}  ({webm.stat().st_size / 1_048_576:.1f} МБ)")

    # ── 2. MOV ProRes 4444 с альфа-каналом (все Safari / iOS) ──
    mov = IMAGES / "dymka.mov"
    run([
        "ffmpeg", "-y",
        "-i", str(INPUT),
        "-c:v", "prores_ks",
        "-profile:v", "4",         # ProRes 4444 (поддерживает альфа)
        "-pix_fmt", "yuva444p10le",# 10-бит с альфа-каналом
        "-movflags", "+faststart",
        "-an",
        str(mov),
    ])
    print(f"[OK] {mov}  ({mov.stat().st_size / 1_048_576:.1f} МБ)")


if __name__ == "__main__":
    main()
