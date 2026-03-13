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
    '#0B1F3B': '#001D39',
    '#2563EB': '#0A4174',
    '#64748B': '#49769F',
    '#14B8A6': '#4E8EA2',
    '#F8FAFC': '#BDD8E9',
    '#F1F5F9': '#BDD8E9',
    '#E2E8F0': '#7BBDE8',
    '#cbd5e1': '#6EA2B3',
    '#94A3B8': '#6EA2B3',
    '#1D4ED8': '#001D39',
    '#1E3A5F': '#001D39',
    '#EF4444': '#EF4444', # Keep danger
}

font_map = [
    (r'\bfont-inter\b', 'font-body'),
    (r'\bfont-mono\b', 'font-mono'),
    (r'text-\[12px\] font-medium uppercase', 'font-display text-[14px] font-semibold uppercase'),
    (r'text-xs font-bold uppercase', 'font-display text-[14px] font-semibold uppercase'),
    (r'text-xl', 'text-[28px] font-display font-bold'),
    (r'text-5xl', 'text-[48px] font-display font-extrabold'),
    (r'text-\[11px\]', 'font-body text-[12px]'),
    (r'\btext-xs\b', 'font-body text-[12px]'),
    (r'\btext-sm\b', 'font-body text-[14px]'),
    (r'\btext-base\b', 'font-body text-[16px]'),
    (r'\btext-lg\b', 'font-display text-[18px]'),
    (r'\bfont-bold\b', 'font-display font-bold'),
    (r'\bfont-semibold\b', 'font-display font-semibold'),
    (r'\bfont-medium\b', 'font-body font-normal'),
]

artifact_lines = []

def process_file_content(content, lang, with_comments=False):
    lines = content.split('\n')
    new_lines = []
    
    for line in lines:
        original_line = line
        line_comment = []
        
        # Colors
        for old_c, new_c in color_map.items():
            if old_c in line:
                line = line.replace(old_c, new_c)
                if with_comments:
                    line_comment.append(f"COLOR: {old_c} -> {new_c}")
                    
        # Fonts
        if lang in ["javascript", "css", "html"]:
            for regex, new_f in font_map:
                if re.search(regex, line):
                    line = re.sub(regex, new_f, line)
                    if with_comments:
                        line_comment.append(f"FONT: {regex.replace(r'\b', '').replace(r'\\', '')} -> {new_f}")
        
        if with_comments and line_comment:
            comment_str = " | ".join(line_comment)
            # Add comment based on language (avoiding breaking JSX syntax if possible)
            if '{' in line and '}' not in line:
                line += f" // {comment_str}"
            else:
                line += f" // {comment_str}"
                
        new_lines.append(line)
        
    return '\n'.join(new_lines)


for filepath, lang in files_to_update + [(s, "xml") for s in svg_files]:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        continue
        
    # Generate clean content for disk
    clean_content = process_file_content(content, lang, with_comments=False)
    
    # Generate commented content for artifact
    commented_content = process_file_content(content, lang, with_comments=True)
    
    # Save clean to disk
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(clean_content)
        
    # Append to artifact
    artifact_lines.append(f"// {filepath}")
    artifact_lines.append(f"```{lang}")
    artifact_lines.append(commented_content)
    artifact_lines.append("```")
    artifact_lines.append("---")
    
# Specifically handle Google Fonts in index.html
with open('dashboard/index.html', 'r', encoding='utf-8') as f:
    html = f.read()
if '<link href="https://fonts.googleapis.com/css2?family=Outfit' not in html:
    new_link = '<link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">'
    html = html.replace('</title>', f'</title>\n    {new_link}')
    with open('dashboard/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

artifact_path = r"C:\Users\dhana\.gemini\antigravity\brain\a3ee79e1-9f61-404f-8268-55eed2e41e10\design_system_update.md"
with open(artifact_path, "w", encoding="utf-8") as f:
    f.write("\n".join(artifact_lines))
    
print(f"Artifact successfully written to {artifact_path}")
