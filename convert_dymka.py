"""
Конвертирует dymka.webm → dymka.mov (HEVC с альфа-каналом для Safari/iOS).

Использование:
    python convert_dymka.py

Входной файл:  frontend/public/images/dymka.webm
Выходной файл: frontend/public/images/dymka.mov
"""

import subprocess
import sys
from pathlib import Path

INPUT  = Path("frontend/public/images/dymka.webm")
OUTPUT = Path("frontend/public/images/dymka.mov")

def main():
    if not INPUT.exists():
        print(f"[ERROR] Файл не найден: {INPUT}")
        sys.exit(1)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    cmd = [
        "ffmpeg",
        "-y",                      # перезаписать без вопросов
        "-i", str(INPUT),
        "-c:v", "libx265",         # HEVC
        "-tag:v", "hvc1",          # тег, который понимает Safari
        "-pix_fmt", "yuva420p",    # альфа-канал
        "-crf", "20",              # качество (0=лучше, 51=хуже; 18-24 оптимально)
        "-preset", "slow",         # медленнее = меньше файл
        "-movflags", "+faststart", # метаданные в начало (быстрый старт)
        "-an",                     # без аудио (у видео его нет)
        str(OUTPUT),
    ]

    print(f"Запуск: {' '.join(cmd)}\n")

    result = subprocess.run(cmd, text=True, stderr=subprocess.PIPE)

    if result.returncode != 0:
        print("[ERROR] FFmpeg завершился с ошибкой:\n")
        print(result.stderr)
        sys.exit(1)

    size_mb = OUTPUT.stat().st_size / 1_048_576
    print(f"\n[OK] Готово: {OUTPUT}  ({size_mb:.1f} МБ)")

if __name__ == "__main__":
    main()
