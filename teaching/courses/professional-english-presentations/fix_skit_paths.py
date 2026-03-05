import re
from pathlib import Path

# ✅ 這支程式要放在「有 modules/ 的那一層」執行
# 例：professional-english-presentations/
#       ├─ fix_skit_paths.py
#       └─ modules/
#           └─ workplace/Unit1...

ROOT = Path("modules/workplace")  # 如果你要修 nursing，就改成 Path("modules/nursing")

# ✅ 可能出現的本機路徑（多種寫法都抓）
# 這裡用 regex，比較不會漏掉
PATTERNS = [
    r"C:\\Users\\[^\\]+\\Desktop\\skit\\skit\.html",          # C:\Users\tonylee\Desktop\skit\skit.html
    r"C:/Users/[^/]+/Desktop/skit/skit\.html",                # C:/Users/tonylee/Desktop/skit/skit.html
    r"file:///C:/Users/[^/]+/Desktop/skit/skit\.html",        # file:///C:/Users/tonylee/Desktop/skit/skit.html
    r"file:///?C:/Users/[^/]+/Desktop/skit/skit\.html",       # file://C:/Users/... 或 file:///C:/Users/...
]

TARGET_FILE_EXTS = {".html", ".htm", ".js", ".json", ".xml", ".txt"}

def find_webobject_skit(unit_dir: Path):
    """
    在 unit 下找 story_content/WebObjects/*/skit.html
    找到第一個就回傳「相對於 unit 的路徑」(用 / )
    """
    candidates = list(unit_dir.glob("story_content/WebObjects/*/skit.html"))
    if not candidates:
        return None

    # 通常只有一個；若多個，取路徑字串最短的那個
    candidates.sort(key=lambda p: len(str(p)))
    return candidates[0].relative_to(unit_dir).as_posix()

def replace_in_file(fp: Path, repl: str):
    """
    將檔案內任何本機 skit.html 路徑，替換成 unit 內正確的相對路徑 repl
    回傳替換次數
    """
    try:
        text = fp.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return 0

    new = text
    total = 0

    for pat in PATTERNS:
        new2, n = re.subn(pat, repl, new)
        if n:
            new = new2
            total += n

    if new != text:
        fp.write_text(new, encoding="utf-8")

    return total

def main():
    if not ROOT.exists():
        print(f"[ERROR] 找不到資料夾：{ROOT}")
        print("👉 請確認 fix_skit_paths.py 放在『有 modules/ 的那一層』")
        return

    unit_dirs = [p for p in ROOT.iterdir() if p.is_dir() and p.name.lower().startswith("unit")]
    if not unit_dirs:
        print(f"[WARN] 在 {ROOT} 找不到 Unit 資料夾")
        return

    grand_total = 0

    for unit in sorted(unit_dirs, key=lambda p: p.name.lower()):
        repl = find_webobject_skit(unit)
        if not repl:
            print(f"[SKIP] {unit.name}: 找不到 story_content/WebObjects/*/skit.html")
            continue

        changed = 0
        for fp in unit.rglob("*"):
            if fp.is_file() and fp.suffix.lower() in TARGET_FILE_EXTS:
                changed += replace_in_file(fp, repl)

        if changed:
            print(f"[OK] {unit.name}: 已替換 {changed} 處 → {repl}")
        else:
            print(f"[INFO] {unit.name}: 沒找到要替換的本機路徑（但 skit 在：{repl}）")

        grand_total += changed

    print(f"\n[DONE] 全部 Unit 合計替換：{grand_total} 處")
    print("👉 如果你畫面仍顯示 C:\\Users...，那通常是『縮圖圖片』，不是文字，需改縮圖。")

if __name__ == "__main__":
    main()
    input("\n完成。按 Enter 關閉視窗...")