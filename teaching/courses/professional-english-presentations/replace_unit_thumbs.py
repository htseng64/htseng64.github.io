from pathlib import Path
import shutil

ROOT = Path("modules/workplace")      # 若要做 nursing，改成 Path("modules/nursing")
COVER = Path("cover.jpg")             # 你準備的乾淨封面圖（592x333 最佳）

def is_thumb_jpg(p: Path) -> bool:
    name = p.name.lower()
    return p.suffix.lower() in {".jpg", ".jpeg"} and "width=592" in name and "height=333" in name and "light_" in name

def main():
    if not ROOT.exists():
        print(f"[ERROR] 找不到：{ROOT}")
        return
    if not COVER.exists():
        print(f"[ERROR] 找不到封面圖：{COVER}（請把 cover.jpg 放在同一層）")
        return

    total = 0
    for unit in sorted([p for p in ROOT.iterdir() if p.is_dir() and p.name.lower().startswith("unit")], key=lambda x: x.name.lower()):
        mobile = unit / "mobile"
        if not mobile.exists():
            print(f"[SKIP] {unit.name}: 沒有 mobile/ 資料夾")
            continue

        thumbs = [p for p in mobile.iterdir() if p.is_file() and is_thumb_jpg(p)]
        if not thumbs:
            # 若你的縮圖命名不含 width/height/light，可把這段改成：thumbs = [p for p in mobile.glob("*.jpg")]
            print(f"[INFO] {unit.name}: 找不到符合規則的縮圖 jpg")
            continue

        for t in thumbs:
            shutil.copyfile(COVER, t)   # 用 cover.jpg 覆蓋原本縮圖（檔名不變）
            total += 1

        print(f"[OK] {unit.name}: 已覆蓋 {len(thumbs)} 張縮圖")

    print(f"\n[DONE] 總共覆蓋：{total} 張縮圖")

if __name__ == "__main__":
    main()
    input("\n完成。按 Enter 關閉視窗...")