import re

def clean_spacing(text):
    # If the text has high frequency of space-between-characters
    # we can use this aggressive regex to join single characters.
    # Pattern: a word of one letter followed by a space followed by another word of one letter.
    # repeat until stable
    prev = ""
    while prev != text:
        prev = text
        text = re.sub(r'\b(\w)\s+(\w)\b', r'\1\2', text)
    return text

test_text = "C o u n t t h e n u m b e r o f n o d e s t h a t w i l l b e p r u n e d"
print(f"INPUT:  {test_text}")
print(f"OUTPUT: {clean_spacing(test_text)}")

test_text_2 = "u s i n g a – b p r u n i n g"
print(f"INPUT:  {test_text_2}")
print(f"OUTPUT: {clean_spacing(test_text_2)}")
