import zipfile, xml.etree.ElementTree as ET, os

with zipfile.ZipFile('new_Sample Project report.docx') as z:
    rels_xml = z.read('word/_rels/document.xml.rels')
    rels_tree = ET.fromstring(rels_xml)
    rel_map = {}
    for rel in rels_tree:
        r_id = rel.attrib.get('Id')
        target = rel.attrib.get('Target')
        rel_map[r_id] = target
        
    doc_xml = z.read('word/document.xml')
    doc_tree = ET.fromstring(doc_xml)
    
    for i, p in enumerate(doc_tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p')):
        p_text = ''.join(t.text for t in p.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t') if t.text).strip()
        blips = p.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/main}blip')
        if blips:
            embed_ids = [b.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed') for b in blips]
            targets = [rel_map.get(e) for e in embed_ids]
            print(f'Para {i}: "{p_text[:60]}" -> Images: {targets}')
