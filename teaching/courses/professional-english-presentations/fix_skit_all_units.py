from pathlib import Path
import shutil

ROOT = Path("modules/workplace")

def main():
    total = 0

    for unit in ROOT.glob("Unit*"):
        webobj = unit / "story_content" / "WebObjects"

        if not webobj.exists():
            continue

        # 找 skit.html
        skits = list(webobj.glob("*/skit.html"))

        if not skits:
            print(f"{unit.name}: no skit.html found")
            continue

        src = skits[0]

        mobile = unit / "mobile"
        mobile.mkdir(exist_ok=True)

        dst = mobile / "skit.html"

        shutil.copy(src, dst)

        print(f"{unit.name}: copied -> mobile/skit.html")

        total += 1

    print(f"\nFinished. {total} units fixed.")

if __name__ == "__main__":
    main()