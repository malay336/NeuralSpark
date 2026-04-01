import os
import re
from fpdf import FPDF
from datetime import datetime

class ReportPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font('Arial', 'B', 10)
            self.set_text_color(150, 150, 150)
            self.cell(0, 10, 'NeuralSpark Technical Reference Summary', 0, 0, 'L')
            self.cell(0, 10, datetime.now().strftime('%Y-%m-%d'), 0, 1, 'R')
            self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'NeuralSpark Reference | Page {self.page_no()}/{{nb}}', 0, 0, 'C')

    def chapter_title(self, title):
        self.set_font('Arial', 'B', 16)
        self.set_fill_color(240, 245, 255)
        self.set_text_color(30, 60, 120)
        self.cell(0, 15, f'  {title}', 0, 1, 'L', True)
        self.ln(5)

    def chapter_body(self, body):
        img_pattern = re.compile(r'!\[.*?\]\((.*?)\)')
        last_idx = 0
        for match in img_pattern.finditer(body):
            txt = body[last_idx:match.start()].strip()
            if txt:
                self.set_font('Arial', '', 11)
                self.set_text_color(0, 0, 0)
                self.multi_cell(0, 6, txt)
                self.ln(2)
            img_path = match.group(1).strip()
            try:
                self.image(img_path, x=20, w=170)
                self.ln(5)
            except Exception as e:
                self.set_font('Arial', 'I', 8)
                self.cell(0, 5, f'[Image Error: {e}]', 0, 1)
            last_idx = match.end()
        remaining = body[last_idx:].strip()
        if remaining:
            self.set_font('Arial', '', 11)
            self.set_text_color(0, 0, 0)
            self.multi_cell(0, 6, remaining)
        self.ln(10)


def generate_summary_pdf(input_md, output_pdf):
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
    pdf.cell(0, 10, 'Technical Reference Summary', 0, 1, 'C')
    pdf.ln(10)
    pdf.set_font('Arial', '', 14)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, 'Function & Class Usage Guide | No Raw Source Code', 0, 1, 'C')
    pdf.ln(80)
    pdf.set_font('Arial', 'I', 11)
    pdf.cell(0, 10, 'Generated: ' + datetime.now().strftime('%B %d, %Y'), 0, 1, 'C')
    pdf.add_page()

    with open(input_md, 'r', encoding='utf-8') as f:
        content = f.read()

    sections = content.split('### ')
    for section in sections:
        if not section.strip():
            continue
        lines = section.split('\n')
        title = lines[0].strip()
        body = '\n'.join(lines[1:]).strip()
        body = body.replace('---', '').replace('**', '')
        body = body.replace('\u2014', '--').replace('\u2013', '-')
        body = body.replace('\u2018', "'").replace('\u2019', "'")
        body = body.replace('\u201c', '"').replace('\u201d', '"')
        body = body.replace('`', '')
        pdf.chapter_title(title)
        pdf.chapter_body(body)

    pdf.output(output_pdf)
    print('Summary PDF generated: ' + output_pdf)


if __name__ == '__main__':
    input_file = r'm:\antigravity_projects\NeuralSpark\report_summary.md'
    output_file = r'm:\antigravity_projects\NeuralSpark\NeuralSpark_Summary_Report.pdf'
    generate_summary_pdf(input_file, output_file)
