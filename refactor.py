import os
import re

files_to_update = [
    ("dashboard/index.html", "html"),
    ("dashboard/tailwind.config.js", "javascript"),
    ("dashboard/src/index.css", "css"),
    ("dashboard/src/pages/LoginPage.jsx", "javascript"),
    ("dashboard/src/pages/admin/AdminDashboard.jsx", "javascript"),
    ("dashboard/src/pages/admin/CreateExamPage.jsx", "javascript"),
    ("dashboard/src/pages/admin/AdminReportsPage.jsx", "javascript"),
    ("dashboard/src/pages/student/StudentWaitingRoom.jsx", "javascript"),
    ("dashboard/src/pages/student/ExamRoomPage.jsx", "javascript"),
    ("dashboard/src/pages/student/ExamSubmittedPage.jsx", "javascript"),
    ("browser-extension/content.js", "javascript")
]

svg_files = [
    "dashboard/src/assets/logo/Cognivigil_logo_full_dark.svg",
    "dashboard/src/assets/logo/Cognivigil_logo_full_light.svg",
    "dashboard/src/assets/logo/Cognivigil_icon_dark.svg",
    "dashboard/src/assets/logo/Cognivigil_icon_light.svg"
]

color_map = {
    '#0B1F3B': ('#001D39', 'old-value -> new-value'),
    '#2563EB': ('#0A4174', 'old-value -> new-value'),
    '#64748B': ('#49769F', 'old-value -> new-value'),
    '#14B8A6': ('#4E8EA2', 'old-value -> new-value'),
    '#F8FAFC': ('#BDD8E9', 'old-value -> new-value'),
    '#F1F5F9': ('#BDD8E9', 'old-value -> new-value'),
    '#E2E8F0': ('#7BBDE8', 'old-value -> new-value'),
    '#cbd5e1': ('#6EA2B3', 'old-value -> new-value'),
    '#94A3B8': ('#6EA2B3', 'old-value -> new-value'),
    '#1D4ED8': ('#001D39', 'old-value -> new-value'),
    '#1E3A5F': ('#001D39', 'old-value -> new-value'),
}

font_map = [
    # Regex, replacement, comment
    (r'font-inter', 'font-body', 'font-inter -> font-body'),
    (r'font-sans', 'font-body', 'font-sans -> font-body'),
    (r'font-mono', 'font-mono', 'default-mono -> font-mono'),
    (r"text-\[12px\] font-medium uppercase", "font-display text-[14px] font-semibold uppercase", "UI -> Outfit"),
    (r"text-xs font-bold uppercase", "font-display text-[14px] font-semibold uppercase", "Inter -> Outfit"),
    (r"text-xl", "text-[28px] font-display font-bold", "UI -> Outfit"),
    (r"text-5xl", "text-[48px] font-display font-extrabold", "UI -> Outfit"),
    (r"text-[11px]", "font-body text-[12px]", "Inter -> DM Sans"),
    (r"text-xs", "font-body text-[12px]", "Inter -> DM Sans"),
    (r"text-sm", "font-body text-[14px]", "Inter -> DM Sans"),
    (r"text-base", "font-body text-[16px]", "Inter -> DM Sans"),
    (r"text-lg", "font-display text-[18px]", "Outfit"),
    (r"font-bold", "font-display font-bold", "UI -> Outfit"),
    (r"font-semibold", "font-display font-semibold", "UI -> Outfit"),
    (r"font-medium", "font-body font-normal", "UI -> DM Sans")
]

output_md = []

for filepath, lang in files_to_update + [(s, "xml") for s in svg_files]:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        continue

    # Process colors
    for old_color, (new_color, comment) in color_map.items():
        if lang in ["javascript", "css", "html"]:
            # For JSX/JS we add inline comments if possible, but simplest is to replace and add comment
            if old_color in content:
                content = content.replace(old_color, f"{new_color}/* COLOR: {old_color} -> {new_color} */")
        else:
            # For SVG, standard replacement, try to insert comment near end of line or omit comment if strict xml
            if old_color in content:
                content = content.replace(old_color, new_color)

    # Process fonts
    if lang in ["javascript", "css", "html"]:
        for regex, new_font, comment in font_map:
            content = re.sub(regex, lambda m: f"{new_font}/* FONT: {comment} */", content)

    # Append to markdown
    output_md.append(f"// {filepath}")
    output_md.append(f"```{lang}")
    output_md.append(content)
    output_md.append("```")
    output_md.append("---")
    
    # Save back to disk
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

with open("output.md", "w", encoding="utf-8") as f:
    f.write("\n".join(output_md))
