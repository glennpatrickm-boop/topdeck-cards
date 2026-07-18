# Regenerates Glenn's freelance resume PDF with the current Accenture role.
# Output: docs/Glenn_Mariano_Freelance_Resume.pdf (same path the application links to).
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

ACCENT = HexColor("#4b3a8f")
MUTED = HexColor("#555555")

styles = getSampleStyleSheet()
s_name = ParagraphStyle("name", parent=styles["Title"], fontSize=20, leading=24,
                        alignment=TA_CENTER, spaceAfter=2)
s_role = ParagraphStyle("role", parent=styles["Normal"], fontSize=10.5, leading=13,
                        alignment=TA_CENTER, textColor=ACCENT, spaceAfter=2)
s_contact = ParagraphStyle("contact", parent=styles["Normal"], fontSize=8.5, leading=11,
                           alignment=TA_CENTER, textColor=MUTED, spaceAfter=6)
s_h = ParagraphStyle("h", parent=styles["Heading2"], fontSize=11, leading=13,
                     textColor=ACCENT, spaceBefore=10, spaceAfter=3)
s_body = ParagraphStyle("body", parent=styles["Normal"], fontSize=9, leading=12.2)
s_bullet = ParagraphStyle("bullet", parent=s_body, leftIndent=12, bulletIndent=2,
                          spaceAfter=1.5)
s_job = ParagraphStyle("job", parent=styles["Normal"], fontSize=10, leading=13,
                       spaceBefore=6)
s_jobmeta = ParagraphStyle("jobmeta", parent=styles["Normal"], fontSize=8.5,
                           leading=11, textColor=MUTED, spaceAfter=2)

def h(text):
    return [Paragraph(text, s_h),
            HRFlowable(width="100%", thickness=0.7, color=ACCENT, spaceAfter=4)]

def bullets(items):
    return [Paragraph(t, s_bullet, bulletText="•") for t in items]

def job(title, org, meta, items):
    block = [Paragraph(f"<b>{title}</b> — {org}", s_job),
             Paragraph(meta, s_jobmeta)] + bullets(items)
    return KeepTogether(block)

story = []
story.append(Paragraph("Glenn Patrick C. Mariano", s_name))
story.append(Paragraph(
    "Full-Stack Web Developer | React · Java/Spring Boot · Shopify · Node.js · REST APIs", s_role))
story.append(Paragraph(
    "glennpatrickm@gmail.com &nbsp;|&nbsp; Baguio City, Philippines &nbsp;|&nbsp; "
    "+63 945 437 6835 &nbsp;|&nbsp; linkedin.com/in/Glenn-Patrick-Mariano &nbsp;|&nbsp; "
    "github.com/glennpatrickm-boop", s_contact))

story += h("PROFESSIONAL SUMMARY")
story.append(Paragraph(
    "Full-Stack Web Developer with 3+ years of experience delivering scalable, production-ready web "
    "applications and APIs. I specialize in React front-ends, Java/Spring Boot back-ends, and CI/CD "
    "automation — handling the full development lifecycle from architecture to deployment. I currently "
    "co-develop an enterprise ticketing platform and build Oracle APEX applications with integrated AI "
    "assistants, and previously built and maintained mission-critical Java systems for a global semiconductor "
    "leader. Available for freelance and contract projects worldwide, with a strong focus on clean code, "
    "on-time delivery, and transparent communication.", s_body))

story += h("WHAT I CAN BUILD FOR YOU")
story += bullets([
    "<b>E-Commerce Storefronts</b> — Shopify (custom Liquid sections, theme work, Admin GraphQL API) and "
    "custom-coded Next.js/React shops, conversion-focused and mobile-first",
    "<b>Full-Stack Web Applications</b> — React UI + Java/Spring Boot or Node.js API + database integration, end-to-end",
    "<b>REST APIs &amp; Microservices</b> — Scalable, well-documented API design using Spring Boot and Zuul Proxy",
    "<b>Legacy System Modernization</b> — Upgrade outdated stacks with minimal disruption to existing operations",
    "<b>CI/CD Pipeline Setup</b> — Jenkins, Docker, Jib, Bitbucket Pipelines, and Artifactory for automated deployments",
    "<b>Front-End Development</b> — Responsive, user-friendly UIs with React, JavaScript (ES6+), HTML5, and CSS3",
])

story += h("TECH STACK")
rows = [
    ("Front-End", "React, Next.js, JavaScript (ES6+), TypeScript, HTML5, CSS3, Tailwind CSS"),
    ("E-Commerce", "Shopify (Liquid, theme customization, Admin GraphQL API), Vercel deployments"),
    ("Back-End", "Java 8–21, Spring Boot, Node.js, Python, REST API, Microservices, Zuul Proxy"),
    ("Low-Code / DB", "Oracle APEX, Oracle Database, PL/SQL"),
    ("DevOps &amp; Tools", "Docker, Jib, Jenkins, Bitbucket, GitHub, Artifactory, CI/CD Pipelines, OCI, JIRA, Confluence"),
    ("Infrastructure", "Linux, UNIX, Windows, Apache HTTP Server"),
]
for k, v in rows:
    story.append(Paragraph(f"<b>{k}:</b> {v}", s_bullet))

story += h("WORK EXPERIENCE")
story.append(job(
    "App Dev Senior Analyst", "Accenture",
    "02/2026 – Present | Full-Time",
    [
        "Co-develop an enterprise ticketing/SLA management platform — Vite + React SPA front end with a "
        "Java 21 / Spring Boot 3.5 backend on Oracle Database, modernizing a legacy stack via a strangler-fig migration",
        "Built the platform's CI/CD pipeline: push-to-deploy container builds with Jib published to Oracle "
        "Cloud Infrastructure Registry (OCIR)",
        "Develop and extend enterprise Oracle APEX applications for large-scale data migration — PL/SQL "
        "packages, page components, dynamic actions, and custom JavaScript/CSS UI",
        "Integrated an LLM-powered AI chat assistant (tool-calling agent with streaming responses) directly "
        "into the APEX front end, re-platforming the chatbot backend onto a modern LLM API",
    ]))
story.append(job(
    "Quality & Testing Engineer", "Texas Instruments Philippines, Inc.",
    "04/2024 – 02/2025 | Full-Time",
    [
        "Applied engineering discipline to semiconductor device testing — validated functionality, performance, "
        "and reliability against production quality standards",
        "Bridged engineering and production planning teams, gathering requirements and ensuring clean technical handoffs",
    ]))
story.append(job(
    "Application Developer", "Texas Instruments Philippines, Inc.",
    "09/2022 – 04/2024 | Full-Time",
    [
        "Built and maintained 3 mission-critical Java applications supporting global semiconductor manufacturing operations",
        "Delivered full CI/CD infrastructure using Bitbucket, Jenkins, Artifactory, and Docker — enabling automated, "
        "zero-downtime deployments for web apps, APIs, and microservices",
        "Led React/Node.js front-end development to modernize a legacy equipment monitoring system, upgrading from "
        "outdated JDK and JMS to the latest stack with no production disruption",
        "Improved application features, resolved bugs, and optimized performance, reliability, and scalability across the full stack",
        "Executed end-to-end migration of Java applications and Oracle databases to upgraded systems, ensuring smooth transitions",
    ]))

story += h("INTERNSHIP EXPERIENCE")
story.append(job(
    "Application Developer Intern", "Accenture", "06/2021 – 08/2021",
    [
        "Built Oracle Digital Assistant chatbot solutions under Oracle Cloud CX, integrated with custom ReactJS "
        "front-end forms to enhance user engagement",
        "Worked in an Agile team and delivered functional chatbot flows within a 3-month cycle",
    ]))
story.append(job(
    "QA Tester Intern", "Medisource Healthcare Systems Inc.", "12/2017 – 01/2018",
    [
        "Tested and validated portal functionality and UX for a healthcare web platform; identified and resolved "
        "issues to improve reliability",
    ]))

story += h("EDUCATION")
story.append(Paragraph("<b>Bachelor of Science in Computer Science</b> — Saint Louis University, Baguio City", s_job))
story.append(Paragraph("08/2018 – 06/2022", s_jobmeta))

story += h("CERTIFICATIONS")
story += bullets([
    "Oracle APEX Developer Professional (2025) — Oracle University",
    "OCI Generative AI Professional (2025) — Oracle University",
    "OCI AI Foundations Associate (2025) — Oracle University",
    "React — The Complete Guide (Hooks, React Router, Redux) — Udemy",
    "Spring Boot 2.0 Essential Training — LinkedIn Learning",
])

story += h("REFERENCES")
story += bullets([
    "Hazel Chloe Tumbaga — Senior Java Developer, DysruptIT — hazeltumbaga14@gmail.com | +1 647 802 8035",
    "Johann Sebastian R. Servas — Software Engineer, Texas Instruments — johannservas14@gmail.com | +63 917 500 7330",
])

doc = SimpleDocTemplate(
    "docs/Glenn_Mariano_Freelance_Resume.pdf", pagesize=letter,
    leftMargin=0.7 * inch, rightMargin=0.7 * inch,
    topMargin=0.55 * inch, bottomMargin=0.55 * inch,
    title="Glenn Patrick C. Mariano — Resume",
    author="Glenn Patrick C. Mariano",
)
doc.build(story)
print("resume written")
