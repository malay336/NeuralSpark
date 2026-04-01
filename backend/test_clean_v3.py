import re

def clean_spacing_v3(text):
    if not text: return text
    
    # regex to find sequences like "C o u n t "
    # We look for a pattern of (single letter + space) repeated 2+ times, 
    # followed by another single letter.
    def join_match(m):
        return m.group(0).replace(' ', '')

    # Try to find sequences of single characters separated by single spaces
    # and join them. We use a lookahead to keep the last letter for the next match if needed
    # but simpler is just to join the whole block.
    # Pattern: \b\w\s\w(\s\w)*\b
    # This matches "C o u n t" but not "Count the" (if Count is already joined)
    # However, "Count t h e" -> matches "t h e"
    
    # Let's use a while loop with a more specific regex
    prev = ""
    while prev != text:
        prev = text
        # Join words that are split by single spaces: "C o u n t"
        # We only join if both are single characters.
        text = re.sub(r'\b([a-zA-ZxX0-9])\s([a-zA-ZxX0-9])\b', r'\1\2', text)
        
    return text

test_text = "C o u n t   t h e   n u m b e r   o f   n o d e s"
# If there are double/triple spaces, it works.
print(f"INPUT 1 (multi-space): {test_text}")
print(f"OUTPUT 1: {clean_spacing_v3(test_text)}")

test_text_2 = "C o u n t t h e n u m b e r o f n o d e s"
# If there are ONLY single spaces, it joins everything.
print(f"INPUT 2 (single-space): {test_text_2}")
print(f"OUTPUT 2: {clean_spacing_v3(test_text_2)}")
