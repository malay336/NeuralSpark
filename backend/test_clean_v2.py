def clean_spacing_v2(text):
    if not text: return text
    # Heuristic: If we have many 'a b c' patterns
    if text.count(' ') > len(text) / 4:
        # Assume double spaces (or more) are real spaces, single spaces are noise
        # 1. Protect double spaces
        text = text.replace('   ', '  ') # normalize
        text = text.replace('  ', '____REAL_SPACE____')
        # 2. Remove single spaces
        text = text.replace(' ', '')
        # 3. Restore real spaces
        text = text.replace('____REAL_SPACE____', ' ')
    return text

test_text = "C o u n t   t h e   n u m b e r   o f   n o d e s   t h a t   w i l l   b e   p r u n e d"
print(f"INPUT:  {test_text}")
print(f"OUTPUT: {clean_spacing_v2(test_text)}")

test_text_2 = "u s i n g   a – b   p r u n i n g"
print(f"INPUT:  {test_text_2}")
print(f"OUTPUT: {clean_spacing_v2(test_text_2)}")
