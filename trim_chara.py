from PIL import Image
import os

def trim_image(filepath, padding=2):
    img = Image.open(filepath)
    rgba = img.convert('RGBA')
    alpha = rgba.getchannel('A')
    bbox = alpha.getbbox()
    if bbox is None:
        return False
    w, h = img.size
    x0 = max(0, bbox[0] - padding)
    y0 = max(0, bbox[1] - padding)
    x1 = min(w, bbox[2] + padding)
    y1 = min(h, bbox[3] + padding)
    if (x0, y0, x1, y1) == (0, 0, w, h):
        return False
    img.crop((x0, y0, x1, y1)).save(filepath)
    return True

dirs = [
    r"E:\claude\kukuCome\public\chara",
    r"E:\claude\kukuCome\chara",
]

total = trimmed = errors = 0
for d in dirs:
    for root, _, files in os.walk(d):
        for f in files:
            if not f.lower().endswith('.png'):
                continue
            path = os.path.join(root, f)
            total += 1
            try:
                if trim_image(path):
                    trimmed += 1
            except Exception as e:
                errors += 1
                print(f"ERROR: {path}: {e}")

print(f"完了: {trimmed}/{total} 枚トリム, {errors} エラー")
