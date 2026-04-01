import os
import re
from fpdf import FPDF
from datetime import datetime

class ReportPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font('Arial', 'B', 10)
            self.set_text_color(150, 150, 150)
            self.cell(0, 10, 'NeuralSpark Technical Documentation', 0, 0, 'L')
            self.cell(0, 10, datetime.now().strftime("%Y-%m-%d"), 0, 1, 'R')
            self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'NeuralSpark Confidential - Page {self.page_no()}/{{nb}}', 0, 0, 'C')

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 16)
        self.set_fill_color(240, 245, 255)
        self.set_text_color(30, 60, 120)
        self.cell(0, 15, f"  {title}", 0, 1, 'L', True)
        self.ln(5)

    def chapter_body(self, body):
        self.set_font('Arial', '', 11)
        self.set_text_color(0, 0, 0)
        
        # Pattern for images ![Alt](filename)
        img_pattern = re.compile(r'!\[.*?\]\((.*?)\)')
        # Pattern for code blocks ```language ... ```
        code_pattern = re.compile(r'```(?:[a-z]*)\n(.*?)```', re.DOTALL)
        
        last_idx = 0
        
        # Combine patterns to find both images and code blocks in order
        all_matches = []
        for m in img_pattern.finditer(body):
            all_matches.append((m.start(), m.end(), 'image', m.group(1).strip()))
        for m in code_pattern.finditer(body):
            all_matches.append((m.start(), m.end(), 'code', m.group(1).strip()))
        
        all_matches.sort()
        
        for start, end, mtype, content in all_matches:
            # Print text before
            txt = body[last_idx:start].strip()
            if txt:
                self.set_font('Arial', '', 11)
                self.multi_cell(0, 6, txt)
                self.ln(2)
            
            if mtype == 'image':
                img_path = content
                try:
                    self.image(img_path, x=20, w=170)
                    self.ln(5)
                except Exception as e:
                    self.set_font('Arial', 'I', 8)
                    self.cell(0, 5, f"[Image Load Error: {e}]", 0, 1)
            
            elif mtype == 'code':
                self.set_font('Courier', '', 9)
                self.set_fill_color(245, 245, 245)
                # Split code into lines to handle very large blocks gracefully
                lines = content.split('\n')
                for line in lines:
                    if self.get_y() > 270: # Manual page break check
                        self.add_page()
                    self.multi_cell(0, 4, line, 0, 'L', True)
                self.ln(5)
            
            last_idx = end
        
        # Final text
        remaining = body[last_idx:].strip()
        if remaining:
            self.set_font('Arial', '', 11)
            self.multi_cell(0, 6, remaining)
        self.ln(10)

def generate_pdf(input_md, output_pdf):
    pdf = ReportPDF()
    pdf.alias_nb_pages()
    pdf.add_page()
    
    # Title Page
    pdf.set_font('Arial', 'B', 32)
    pdf.set_text_color(25, 50, 100)
    pdf.ln(60)
    pdf.cell(0, 20, 'NeuralSpark', 0, 1, 'C')
    pdf.set_font('Arial', 'B', 18)
    pdf.set_text_color(50, 100, 150)
    pdf.cell(0, 10, 'AI-powered Educational Infrastructure', 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font('Arial', '', 14)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, 'Full Technical Documentation & Architectural Review', 0, 1, 'C')
    
    pdf.ln(80)
    pdf.set_font('Arial', 'I', 11)
    pdf.cell(0, 10, f'Project ID: NS-2026-X', 0, 1, 'C')
    pdf.cell(0, 10, f'Generated: {datetime.now().strftime("%B %d, %Y")}', 0, 1, 'C')
    pdf.add_page()

    if not os.path.exists(input_md):
        print(f"Error: {input_md} not found.")
        return

    with open(input_md, 'r', encoding='utf-8') as f:
        md_content = f.read()

    sections = md_content.split('### ')
    for section in sections:
        if not section.strip():
            continue
        
        lines = section.split('\n')
        title = lines[0].strip()
        body = '\n'.join(lines[1:]).strip()
        
        # Clean up Markdown (preserving logic tags)
        body = body.replace('---', '').replace('**', '')
        # Preserve ` for single word code if needed, but remove for now for simplicity
        body = body.replace('`', '')
        
        pdf.chapter_title(title)
        pdf.chapter_body(body)

    pdf.output(output_pdf)
    print(f"Final professional report generated: {output_pdf}")

if __name__ == "__main__":
    input_file = r"m:\antigravity_projects\NeuralSpark\report.md"
    output_file = r"m:\antigravity_projects\NeuralSpark\NeuralSpark_Project_Report.pdf"
    generate_pdf(input_file, output_file)
