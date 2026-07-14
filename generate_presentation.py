from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
import os

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # ----------------------------------------------------
    # DESIGN SYSTEM & PALETTE (Sleek Dark Mode Theme)
    # ----------------------------------------------------
    BG_COLOR = RGBColor(10, 25, 47)        # Deep Navy Blue
    CARD_BG = RGBColor(17, 34, 64)         # Deep Blue-Gray Card
    ACCENT_BLUE = RGBColor(100, 255, 218)   # Neon Teal / Cyan
    ACCENT_GREEN = RGBColor(16, 185, 129)  # Emerald Accent
    ACCENT_PURPLE = RGBColor(139, 92, 246) # Electric Violet Accent
    TEXT_WHITE = RGBColor(255, 255, 255)   # Crisp White
    TEXT_SLATE = RGBColor(136, 146, 176)   # Light Slate Gray
    TEXT_MUTED = RGBColor(74, 85, 104)     # Dark Slate Gray
    
    # Helper: Set dark background
    def set_dark_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    # Helper: Add Slide Header
    def add_slide_header(slide, title, category="NEURALSPARK // SYSTEM INFRASRUCTURE"):
        # Category slug (neon blue tracking)
        if category:
            cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.3))
            tf_cat = cat_box.text_frame
            tf_cat.word_wrap = True
            tf_cat.margin_left = tf_cat.margin_right = tf_cat.margin_top = tf_cat.margin_bottom = 0
            p_cat = tf_cat.paragraphs[0]
            p_cat.text = category.upper()
            p_cat.font.name = "Consolas"
            p_cat.font.size = Pt(10)
            p_cat.font.bold = True
            p_cat.font.color.rgb = ACCENT_BLUE
            
        # Main title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf = title_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Arial"
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = TEXT_WHITE

    # Helper: Draw Card Component
    def add_card(slide, left, top, width, height, title, content_lines, accent_color=ACCENT_BLUE):
        # Draw card container
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = accent_color
        card.line.width = Pt(1.5)
        
        # Draw Title
        title_box = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.2), Inches(width - 0.5), Inches(0.4))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(14)
        p_t.font.bold = True
        p_t.font.color.rgb = accent_color
        
        # Draw Content
        body_box = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.7), Inches(width - 0.5), Inches(height - 0.9))
        tf_b = body_box.text_frame
        tf_b.word_wrap = True
        tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0
        
        for i, line in enumerate(content_lines):
            p = tf_b.add_paragraph() if i > 0 else tf_b.paragraphs[0]
            p.text = "• " + line
            p.font.name = "Arial"
            p.font.size = Pt(11)
            p.font.color.rgb = TEXT_SLATE
            p.space_after = Pt(6)
            
    # ====================================================
    # SLIDE 1: Title Slide (Massive visual splash)
    # ====================================================
    slide_layout = prs.slide_layouts[6] # Blank
    slide1 = prs.slides.add_slide(slide_layout)
    set_dark_background(slide1)
    
    # Outer decorative frame
    frame = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.5), Inches(0.5), Inches(12.333), Inches(6.5))
    frame.fill.background()
    frame.line.color.rgb = ACCENT_BLUE
    frame.line.width = Pt(1)
    
    # Large Title Box
    title_box = slide1.shapes.add_textbox(Inches(1.5), Inches(2.2), Inches(10.333), Inches(2.0))
    tf1 = title_box.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "NEURALSPARK"
    p1.alignment = PP_ALIGN.CENTER
    p1.font.name = "Consolas"
    p1.font.size = Pt(64)
    p1.font.bold = True
    p1.font.color.rgb = TEXT_WHITE
    
    # Subtitle Box
    p2 = tf1.add_paragraph()
    p2.text = "Next-Generation AI-Powered E-Learning Platform & Infrastructure"
    p2.alignment = PP_ALIGN.CENTER
    p2.font.name = "Arial"
    p2.font.size = Pt(18)
    p2.font.color.rgb = ACCENT_BLUE
    p2.space_before = Pt(15)
    
    # Details Box (Bottom)
    details_box = slide1.shapes.add_textbox(Inches(1.5), Inches(4.8), Inches(10.333), Inches(1.5))
    tf_det = details_box.text_frame
    tf_det.word_wrap = True
    
    p3 = tf_det.paragraphs[0]
    p3.text = "Full-Stack System Architecture // Multimodal AI Grading Pipeline // Interactive Video Hub"
    p3.alignment = PP_ALIGN.CENTER
    p3.font.name = "Consolas"
    p3.font.size = Pt(11)
    p3.font.bold = True
    p3.font.color.rgb = TEXT_SLATE
    
    p4 = tf_det.add_paragraph()
    p4.text = "COLLEGE TECHNICAL PROJECT PRESENTATION"
    p4.alignment = PP_ALIGN.CENTER
    p4.font.name = "Arial"
    p4.font.size = Pt(12)
    p4.font.bold = True
    p4.font.color.rgb = ACCENT_GREEN
    p4.space_before = Pt(20)

    # ====================================================
    # SLIDE 2: Core Pillars (3 Cards)
    # ====================================================
    slide2 = prs.slides.add_slide(slide_layout)
    set_dark_background(slide2)
    add_slide_header(slide2, "Platform Core Pillars", "NeuralSpark // Executive Summary")
    
    add_card(slide2, 0.8, 1.8, 3.6, 4.8, "Interactive Video Hub", [
        "Sequenced chapter progression enabling structured learning syllabus.",
        "Category tagging for easy filtering and discovery of learning topics.",
        "Dynamic progress tracking linked with user profile statistics.",
        "Standardized external video link integration and responsive player."
    ], ACCENT_BLUE)
    
    add_card(slide2, 4.8, 1.8, 3.6, 4.8, "Community Q&A Forum", [
        "Discussion boards supporting structured question and answer threads.",
        "Gamified reputation tracking based on answer helpfulness & community votes.",
        "Topic tag tagging systems (ManyToMany relations) to prevent duplicate topics.",
        "Interactive upvote/downvote and nested comment mechanics."
    ], ACCENT_GREEN)
    
    add_card(slide2, 8.8, 1.8, 3.6, 4.8, "Dual-Engine AI Grader", [
        "Automated grading pipelines evaluating solutions against custom rubrics.",
        "Cloud Multimodal integration supporting rich PDF and image parsing.",
        "Local classification using custom Hugging Face sequence classifiers.",
        "Itemized criteria marking, qualitative comments, and final score outputs."
    ], ACCENT_PURPLE)

    # ====================================================
    # SLIDE 3: Platform Tech Stack (2 Columns)
    # ====================================================
    slide3 = prs.slides.add_slide(slide_layout)
    set_dark_background(slide3)
    add_slide_header(slide3, "Full-Stack Tech Stack Architecture", "NeuralSpark // Platform Architecture")
    
    add_card(slide3, 0.8, 1.8, 5.6, 4.8, "Next.js 16 Frontend App Router", [
        "Framework: Next.js 16 (App Router) + React 19 in TypeScript.",
        "Styling: Tailwind CSS 4 offering modern utility-first stylesheet compilation.",
        "Animation: Framer Motion 12 driving seamless spring physics animations.",
        "API Client: Axios 1.13.5 utilizing global JSON response parsers.",
        "Theme System: LocalStorage synced ThemeProvider (Dark / Light toggle)."
    ], ACCENT_BLUE)
    
    add_card(slide3, 6.8, 1.8, 5.6, 4.8, "Django 6 Ninja API Backend", [
        "Framework: Django 6.0.2 core leveraging robust relational ORM.",
        "API Engine: Django Ninja 1.5.3 compiling super-fast typesafe JSON routes.",
        "Data Validation: Pydantic 2.12.5 handling auto incoming / outgoing schemas.",
        "Database Layer: SQLite (local development) / PostgreSQL (production).",
        "Admin Console: Preconfigured Django admin dashboard for instant CMS."
    ], ACCENT_GREEN)

    # ====================================================
    # SLIDE 4: Platform User Flows (Horizontal Steps Layout)
    # ====================================================
    slide4 = prs.slides.add_slide(slide_layout)
    set_dark_background(slide4)
    add_slide_header(slide4, "Interactive User Experience Flows", "NeuralSpark // User Experience")
    
    steps = [
        ("1. Sequence Learn", "Syllabus Video Hub", "Students stream modular video chapters organized cleanly by category filter panels."),
        ("2. Interact Forum", "Q&A Discussion Boards", "Discuss complex problems, upvote top-tier answers, comment on details to earn reputation points."),
        ("3. AI Grade Submit", "Multimodal Evaluation", "Upload PDF drafts or pictures of written work alongside a specified question and scoring rubric."),
        ("4. Receive Feedback", "Comprehensive Scoring", "View immediate score allocations and comprehensive qualitative grading review reports.")
    ]
    
    card_w = 2.7
    card_h = 4.8
    gap = 0.3
    
    for idx, (step_num, title, desc) in enumerate(steps):
        left_pos = 0.8 + idx * (card_w + gap)
        # Draw step card
        card = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left_pos), Inches(1.8), Inches(card_w), Inches(card_h))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = ACCENT_BLUE if idx % 2 == 0 else ACCENT_GREEN
        card.line.width = Pt(1.5)
        
        # Step Number Text Box
        num_box = slide4.shapes.add_textbox(Inches(left_pos + 0.2), Inches(2.0), Inches(card_w - 0.4), Inches(0.4))
        tf_num = num_box.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.text = step_num.upper()
        p_num.font.name = "Consolas"
        p_num.font.size = Pt(12)
        p_num.font.bold = True
        p_num.font.color.rgb = ACCENT_BLUE if idx % 2 == 0 else ACCENT_GREEN
        
        # Step Title Text Box
        title_box = slide4.shapes.add_textbox(Inches(left_pos + 0.2), Inches(2.5), Inches(card_w - 0.4), Inches(0.6))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.name = "Arial"
        p_t.font.size = Pt(14)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_WHITE
        
        # Step Desc Text Box
        desc_box = slide4.shapes.add_textbox(Inches(left_pos + 0.2), Inches(3.2), Inches(card_w - 0.4), Inches(3.0))
        tf_d = desc_box.text_frame
        tf_d.word_wrap = True
        p_d = tf_d.paragraphs[0]
        p_d.text = desc
        p_d.font.name = "Arial"
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = TEXT_SLATE

    # ====================================================
    # SLIDE 5: Relational Database Models (Table Slide)
    # ====================================================
    slide5 = prs.slides.add_slide(slide_layout)
    set_dark_background(slide5)
    add_slide_header(slide5, "Database Schema & Core Entities", "NeuralSpark // Database Schema")
    
    # Add a table
    rows, cols = 7, 3
    left, top, width, height = Inches(0.8), Inches(1.8), Inches(11.733), Inches(4.8)
    table_shape = slide5.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table
    
    # Set column widths
    table.columns[0].width = Inches(2.0)
    table.columns[1].width = Inches(4.233)
    table.columns[2].width = Inches(5.5)
    
    headers = ["CORE MODEL", "RELATIONAL ASSOCIATIONS", "PRIMARY PURPOSE & ROLE"]
    db_data = [
        ("User", "Inherits AbstractUser. Linked as FK to Question/Answer.", "Handles credentials, customized bio text, and community reputation points."),
        ("Tag", "ManyToMany relationship with Questions.", "Topic cataloging mechanism preventing duplicates via a unique constraints schema."),
        ("Lecture", "ForeignKey to Category. Ordered sequencers.", "Sequenced modular video classes mapping a structured study syllabus."),
        ("Question", "ForeignKey to Category, ManyToMany to Tags.", "The community forum node recording titles, body markdown, view tallies, and votes."),
        ("Answer", "ForeignKey to Question, Boolean approval flag.", "Answers submitted under discussion threads. Requires moderator check before display."),
        ("Inquiry", "ForeignKey (nullable) to Services model.", "CRM lead tracking capturing customer email bookings for premium learning services.")
    ]
    
    # Set headers
    for col_idx, text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = CARD_BG
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.font.name = "Consolas"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = ACCENT_BLUE
        
    # Populate data
    for row_idx, row_data in enumerate(db_data):
        for col_idx, text in enumerate(row_data):
            cell = table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = BG_COLOR
            p = cell.text_frame.paragraphs[0]
            p.text = text
            p.font.name = "Arial"
            p.font.size = Pt(11)
            p.font.color.rgb = TEXT_WHITE if col_idx == 0 else TEXT_SLATE
            if col_idx == 0:
                p.font.bold = True

    # ====================================================
    # SLIDE 6: Dual AI Engines (Detailed)
    # ====================================================
    slide6 = prs.slides.add_slide(slide_layout)
    set_dark_background(slide6)
    add_slide_header(slide6, "Dual-Engine Automated Grading Systems", "NeuralSpark // AI Engines")
    
    add_card(slide6, 0.8, 1.8, 5.6, 4.8, "Cloud-Based Multimodal Grading", [
        "Inference Engine: Groq Multimodal APIs (Llama 3.2 Vision Model).",
        "Document Parser: PyPDF2 text extraction library reading multi-page drafts.",
        "Image Encoder: Base64 encoding pipeline converting pictures to data URIs.",
        "Evaluation Method: Strict prompt instructions mapping solutions directly against core criteria rubrics.",
        "Output Format: Itemized markdown feedback reports with assigned criteria scores."
    ], ACCENT_BLUE)
    
    add_card(slide6, 6.8, 1.8, 5.6, 4.8, "Local Fine-Tuned Custom Grading", [
        "Inference Engine: Fine-tuned local Transformer sequence classification model.",
        "Module Library: Python Hugging Face 'transformers' pipelines.",
        "Lazy Loader: Python memory optimizer caching active models inside a global cache upon first request.",
        "Evaluation Method: Direct sequence classification outputting absolute numeric grading metrics.",
        "Deployment Goal: 100% data privacy and offline compliance for institutions."
    ], ACCENT_GREEN)

    # ====================================================
    # SLIDE 7: AI Grader Backend Flow (Vertical Split Layout)
    # ====================================================
    slide7 = prs.slides.add_slide(slide_layout)
    set_dark_background(slide7)
    add_slide_header(slide7, "Multimodal AI Grader Pipeline Flow", "NeuralSpark // Grader Pipeline")
    
    # Left Card describing pipeline steps
    add_card(slide7, 0.8, 1.8, 5.6, 4.8, "Step-by-Step Backend Routing", [
        "1. Request Intake: REST client POSTs grading package (rubric text, question parameters, student answer files).",
        "2. Media Checking: Server splits PDF files from image uploads based on content MIME-type suffixes.",
        "3. Image Conversion: JPG/PNG bytes convert to Base64 data blocks nested directly in the LLM's prompt array.",
        "4. Text Parsing: PyPDF2 reads complex PDF page layouts, extracting pure text lines for contextual prompt insertion.",
        "5. System Prompt: Direct instructions mandate objective rubric grading with strict output schemas.",
        "6. Validation: Outgoing JSON is structured via Pydantic Schemas to guarantee clean rendering."
    ], ACCENT_BLUE)
    
    # Right Card listing the API request/response properties
    add_card(slide7, 6.8, 1.8, 5.6, 4.8, "Data Schemas & System Verification", [
        "API Endpoint: /products/ai-grader/ (Multimodal Cloud Grader)",
        "Form Parameters: Multi-part form-data body transmitting raw files alongside text strings.",
        "Pydantic Validation: Restrictive data parsing checking type boundaries before hitting the model API.",
        "Unit Coverage: Test scripts verify pipeline file parsers by supplying pre-built local mock PDFs.",
        "API Response: Serializes evaluations into a structured feedback stream for the UI player."
    ], ACCENT_GREEN)

    # ====================================================
    # SLIDE 8: Django Ninja API & Endpoints
    # ====================================================
    slide8 = prs.slides.add_slide(slide_layout)
    set_dark_background(slide8)
    add_slide_header(slide8, "RESTful API Endpoints & Ninja Schemas", "NeuralSpark // Django API Reference")
    
    # Add a table
    rows, cols = 8, 4
    left, top, width, height = Inches(0.8), Inches(1.8), Inches(11.733), Inches(4.8)
    api_table_shape = slide8.shapes.add_table(rows, cols, left, top, width, height)
    api_table = api_table_shape.table
    
    # Column widths
    api_table.columns[0].width = Inches(1.8)
    api_table.columns[1].width = Inches(3.2)
    api_table.columns[2].width = Inches(2.2)
    api_table.columns[3].width = Inches(4.533)
    
    api_headers = ["METHOD", "ENDPOINT PATH", "SCHEMA (PYDANTIC)", "SYSTEM HANDLER BEHAVIOR"]
    api_data = [
        ("GET", "/api/questions/", "QuestionOutSchema (List)", "Fetches community forum posts ordered newest first (-created_at)."),
        ("POST", "/api/questions/", "QuestionInSchema", "Saves new forum posts, deduplicating topic tags dynamically."),
        ("GET", "/api/questions/{id}/", "QuestionOutSchema", "Fetches detail card, atomically incrementing the view counter."),
        ("POST", "/api/questions/{id}/answers/", "AnswerInSchema", "Submits answer draft directly into the moderation admin queue."),
        ("POST", "/api/answers/{id}/upvote/", "AIGraderOutSchema", "Atomically increments positive votes for community grading."),
        ("POST", "/api/products/ai-grader/", "Multi-part Forms", "Cloud Vision pipeline evaluating PDFs/images via Groq SDK."),
        ("POST", "/api/inquiries/", "InquiryInSchema", "Saves premium mentoring inquiries directly into CRM leads table.")
    ]
    
    # Set headers
    for col_idx, text in enumerate(api_headers):
        cell = api_table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = CARD_BG
        p = cell.text_frame.paragraphs[0]
        p.text = text
        p.font.name = "Consolas"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = ACCENT_BLUE
        
    # Populate data
    for row_idx, row_data in enumerate(api_data):
        for col_idx, text in enumerate(row_data):
            cell = api_table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = BG_COLOR
            p = cell.text_frame.paragraphs[0]
            p.text = text
            p.font.name = "Arial"
            p.font.size = Pt(10)
            p.font.color.rgb = TEXT_WHITE if col_idx < 2 else TEXT_SLATE
            if col_idx == 0:
                p.font.bold = True
                p.font.color.rgb = ACCENT_BLUE if text == "GET" else ACCENT_GREEN

    # ====================================================
    # SLIDE 9: Frontend UX Innovations
    # ====================================================
    slide9 = prs.slides.add_slide(slide_layout)
    set_dark_background(slide9)
    add_slide_header(slide9, "Modern User Experience & UI Dynamics", "NeuralSpark // Frontend Core")
    
    add_card(slide9, 0.8, 1.8, 5.6, 4.8, "Micro-interactions & Physics", [
        "Framer Motion spring physics driving smooth spring transitions.",
        "Interactive hover animations on all navigation navbar items.",
        "Staggered grid layout entrance animations for lecture hubs.",
        "Sticky navbar with sleek blurred backdrop-filter overlay layouts.",
        "Crisp scalable vector graphics powered by Lucide React packages."
    ], ACCENT_BLUE)
    
    add_card(slide9, 6.8, 1.8, 5.6, 4.8, "State Sync & Adaptability", [
        "Custom useTheme hook reading and writing system dark variables.",
        "Theme persistence utilizing browser LocalStorage parameters.",
        "Hydration protection preventing React mismatched UI loads.",
        "Flexible Tailwind CSS 4 grids accommodating small screens & desktop layouts.",
        "Responsive media player layout fitting multiple lecture aspect ratios."
    ], ACCENT_GREEN)

    # ====================================================
    # SLIDE 10: Conclusion & Architecture Highlights
    # ====================================================
    slide10 = prs.slides.add_slide(slide_layout)
    set_dark_background(slide10)
    add_slide_header(slide10, "Summary of Technical Achievements", "NeuralSpark // Conclusion")
    
    add_card(slide10, 0.8, 1.8, 11.733, 4.8, "Platform Strengths & Innovations", [
        "Ultra-Fast API Response Times: Django Ninja REST overhead measures under 50ms, beating legacy frameworks.",
        "Intelligent Dual-Engine AI Routing: Combines rich cloud-based vision processing (Groq) with fast, private local classifications.",
        "Robust Structural Validation: Strict validation layers via Pydantic schemas eliminate bad payload database writes.",
        "High-Fidelity Interface Design: Clean styling via Tailwind 4 and Framer Motion delivers exceptional desktop and mobile UX.",
        "Production & Offline Readiness: Preconfigured offline run environment (.bat files) and built-in SQLite/Postgres configs enable effortless local & cloud deployment."
    ], ACCENT_BLUE)
    
    # Save the presentation
    output_path = r"m:\antigravity_projects\NeuralSpark\NeuralSpark_Technical_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_presentation()
