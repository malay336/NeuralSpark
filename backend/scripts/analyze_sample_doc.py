import zipfile, xml.etree.ElementTree as ET

with zipfile.ZipFile('new_Sample Project report.docx') as z:
    doc_xml = z.read('word/document.xml')
    doc_tree = ET.fromstring(doc_xml)
    
    sections = []
    current_sec = {'title': 'START', 'paras': []}
    for p in doc_tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
        text = ''.join(t.text for t in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text).strip()
        if not text:
            continue
        if any(text.startswith(h) for h in ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5', 'Certificate', 'Acknowledgements', 'Abstract', 'Table of Contents', 'List of Tables', 'List of Figures', 'List of Algorithms', 'Bibliography', 'Conclusion']):
            sections.append(current_sec)
            current_sec = {'title': text, 'paras': []}
        else:
            current_sec['paras'].append(text)
    sections.append(current_sec)

for s in sections:
    word_count = sum(len(p.split()) for p in s['paras'])
    print(f"{s['title']} -> {len(s['paras'])} paragraphs, ~{word_count} words")
