from pathlib import Path
import shutil

ROOT = Path("modules/workplace")   # 若是 nursing 就改 modules/nursing
COVER = Path("cover.jpg")

def main():
    if not ROOT.exists():
        print("找不到 modules/workplace")
        return
        
    if not COVER.exists():
        print("找不到 cover.jpg (請放在同一層)")
        return

    total = 0

    for unit in ROOT.glob("Unit*"):
        mobile = unit / "mobile"
        
        if not mobile.exists():
            continue

        for img in mobile.glob("*.jpg"):
            shutil.copyfile(COVER, img)
            total += 1
            print(f"已覆蓋 {img}")

    print(f"\n完成，共覆蓋 {total} 張圖片")

if __name__ == "__main__":
    main()
    input("\n完成，按 Enter 結束")