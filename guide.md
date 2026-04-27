This document serves as the **Master Architectural Specification** for the **SHAPE UP** Fitness Studio platform. It is designed to guide **Antigravity** through every logical, visual, and structural requirement of the project, ensuring the transition from a "messy" brief to a professional, deployment-ready product.

---

# 🏗️ SHAPE UP: MASTER TECHNICAL SPECIFICATION & ARCHITECTURAL GUIDE

## 1. PROJECT VISION & BRAND IDENTITY
[cite_start]**SHAPE UP** (formerly Gym Fit) is a premium, high-energy fitness studio that prioritizes a "posh," minimalist, and classy aesthetic[cite: 13, 18]. [cite_start]The user interface must feel "lively" and "vibrant" while maintaining a sophisticated edge[cite: 19, 28].

* [cite_start]**Primary Palette**: Bright Yellow and Black[cite: 29].
* **Typography System**:
    * [cite_start]**Headings**: Bebas Neue[cite: 28].
    * [cite_start]**Body/UI**: Montserrat[cite: 28].
    * [cite_start]**Accents/Stats**: Sui Generis[cite: 28].
* [cite_start]**Core Vibe**: High-energy storytelling with "massive" typography and smooth, professional micro-interactions[cite: 13, 18].

---

## 2. TECHNOLOGY STACK
The platform must be modular, scalable, and deployment-ready.

### **Frontend: Next.js (React Framework)**
* **Framework**: Next.js (App Router) for optimized performance and SEO.
* **Styling**: Vanilla CSS for maximum flexibility, focusing on dark mode with glassmorphism.
* **Animations**: 
    * [cite_start]**GSAP**: For complex scroll-triggered storytelling and hero transitions[cite: 13].
    * [cite_start]**Framer Motion**: For micro-animations and smooth "pop-up" effects on hover[cite: 18, 33].
* [cite_start]**Interactivity**: Integrated WhatsApp deep-linking for bookings and enquiry buttons[cite: 30, 33].

### **Backend: FastAPI (Python)**
* **API Framework**: FastAPI for high-speed, asynchronous request handling.
* **Database**: PostgreSQL or SQLite for storing dynamic content (prices, reviews, trainer info).
* [cite_start]**Security**: Custom authentication for the Admin module[cite: 29].
* [cite_start]**File Storage**: Cloud-based (e.g., S3 or Cloudinary) to allow the admin to upload/change images without editing code[cite: 19, 33].

---

## 3. FILE DIRECTORY STRUCTURE
**Antigravity** must organize the codebase as follows to ensure modularity:

```text
/shape-up-project
├── /backend
│   ├── main.py                # Entry point for FastAPI
│   ├── /models                # Database schemas (Trainers, Reviews, Packages)
│   ├── /api                   # Endpoint logic for Admin and Public
│   ├── /auth                  # Login/Password logic (sambuddhaganguly45@gmail.com)
│   └── requirements.txt       # Dependencies
├── /frontend
│   ├── /app                   # Next.js App Router (Layouts and Pages)
│   ├── /components            # Reusable UI (PricingBox, StatsCounter, Marquee)
│   ├── /public                # Logos and high-res static assets
│   ├── /styles                # Global CSS (Brand-wide Yellow/Black theme)
│   └── /utils                 # Communication helpers (WhatsApp/Dialer logic)
└── .agent/workflows           # Antigravity deployment and build scripts
```

---

## 4. DESIGN REQUIREMENTS & UI COMPONENTS
The interface must WOW the user with premium visual excellence.

### **A. Global Styling Rules**
* [cite_start]**Hover Effects**: Every package box, trainer image, and button must "pop up smoothly" on hover[cite: 18, 25, 33].
* [cite_start]**Outer Text Glow**: Apply a vibrant yellow glow to package amounts, headings, and subheadings[cite: 18, 19].
* [cite_start]**Image Handling**: All images (gallery, trainers, owner) must be adjustable before upload and viewable in full-screen pop-ups without cuts[cite: 38, 40].

### **B. Storytelling Sections**
* [cite_start]**Hero Section**: Flanking images with energetic copy: "Your transformation starts here..."[cite: 13, 27].
* **Stats Counter**: 
    * [cite_start]"1500+ Active Members"[cite: 15, 19].
    * [cite_start]"25+ Years Running" (since 2001)[cite: 15, 18, 19].
    * [cite_start]"15+ Expert Trainers"[cite: 18, 19].
    * [cite_start]"2000 sq. ft. Training Space"[cite: 15, 19].
* [cite_start]**Meet the Owner**: High-resolution box-shaped image of **Debashish Dutta** with editable description[cite: 25, 44, 46].
* [cite_start]**The Marquee**: A scrolling marquee of 15 round-shaped trainer images with a speed of "30"[cite: 25, 43].

---

## 5. MEMBERSHIP & PRICING ARCHITECTURE (The 6-Table System)
[cite_start]This section must be "elegantly arranged" with specific notice placement[cite: 4, 13].

### **Notice Preceding Tables**
> **TITLE: ADMISSION CHARGES (Non-refundable)**
> * Single Person: ₹600
> * Group of 2: ₹500 per person
> [cite_start]* Group of 3+: ₹400 per person (must join together)[cite: 4].

### **Table 1: Gym Hours**
* [cite_start]**Morning**: 6:30 AM – 12:00 PM[cite: 6].
* [cite_start]**Afternoon (Ladies Only)**: 12:00 PM – 5:00 PM (Highlight Brightly!)[cite: 7, 34].
* [cite_start]**Evening**: 5:00 PM – 11:00 PM[cite: 7].
* [cite_start]**Closure**: Sunday Evenings and Monday Mornings[cite: 7].

### **Table 2: Gym Membership Charges (Non-refundable)**
* [cite_start]1 Month: ₹899[cite: 8].
* [cite_start]3 Months: ₹2,399[cite: 8].
* [cite_start]6 Months: ₹4,199 (includes ₹300 admission fee)[cite: 8].
* [cite_start]12 Months: ₹7,799 (No admission charges)[cite: 8].
* [cite_start]24 Months: ₹11,999 (No admission charges)[cite: 8].

### **Table 3: Personal Training (PT)**
* [cite_start]Single Class: ₹250 (Head Trainer: ₹300)[cite: 9].
* [cite_start]1 Month (12 classes): ₹2,499 (Head Trainer: ₹3,000)[cite: 9].
* [cite_start]3 Months (36 classes): ₹2,299/month[cite: 9].
* [cite_start]6 Months (72 classes): ₹2,199/month[cite: 9].
* [cite_start]12 Months (144 classes): ₹1,999/month[cite: 9].

### **Table 4: Group Personal Training (12 Classes)**
* [cite_start]Group of 2: ₹4,399[cite: 10].
* [cite_start]Group of 3: ₹5,999[cite: 11].

### **Table 5: Special Weight Loss**
* [cite_start]12 Classes: ₹2,999 (Valid for 1 month)[cite: 11].

### **Table 6: Add-Ons**
* [cite_start]Locker: ₹300[cite: 12].
* [cite_start]Massage (45-60 min): ₹600[cite: 12].
* [cite_start]Steam Bath (15-20 min): ₹250[cite: 12].
* [cite_start]Per Day Session: ₹200[cite: 12].

---

## 6. ADMIN SYSTEM & PERMISSIONS
Only the Admin can modify the live content.

* **Credentials**: Email `sambuddhaganguly45@gmail.com` | [cite_start]Password `gublu&2009`[cite: 28, 29].
* **Editable Elements**:
    * [cite_start]**Media**: Add/Remove photos/videos in the gallery (Empty by default until admin posts)[cite: 33, 41].
    * [cite_start]**Staff**: Change trainer photos, names, and marquee status[cite: 33, 34, 36].
    * [cite_start]**Pricing**: Update all costs and package descriptions[cite: 33, 34].
    * [cite_start]**Logos**: Replace site logos via upload[cite: 34].
    * [cite_start]**Moderation**: Delete any user-submitted review[cite: 32, 34].

---

## 7. LOCATION & BRANCHES
[cite_start]The location section must be center-aligned and link to Google Maps[cite: 17, 30, 31].

1.  [cite_start]**KASBA**: Rajkrishna Chatterjee Rd, Bosepukur[cite: 31].
2.  [cite_start]**TRIBORNO**: near Triborno Club, Sarat Park[cite: 31].
3.  [cite_start]**BALLYGUNGE**: near South Point High School[cite: 31].
4.  [cite_start]**NANDIBAGAN**: Neli Nagar, Haltu[cite: 31].

---

## 8. COMMUNICATION SYSTEM
* [cite_start]**Phone Call**: Opening the default dialer with numbers pre-copied: `+91 92397 56202`, `+91 82407 83965`, `+91 62894 95581`, `+91 93302 49933`[cite: 14, 30].
* [cite_start]**Email**: Opens default mail app addressed to `deb2dutta1983@gmail.com`[cite: 14, 16].
* [cite_start]**WhatsApp**: Clicking "Book Now" opens WhatsApp (`+91 92397 56202`) with the package details and user's name pre-filled[cite: 30, 33].

---

## 9. FINAL COMPLIANCE CHECKLIST
* [cite_start][ ] Remove all "Gym Fit" branding; use **SHAPE UP** exclusively[cite: 18].
* [cite_start][ ] Remove "Made with Emergent" button[cite: 45].
* [cite_start][ ] Highlight Ladies-Only sessions in a high-energy yellow accent[cite: 34].
* [cite_start][ ] Ensure site is open 7 days a week but closed during specific shifts[cite: 7, 18].
* [cite_start][ ] Verify the rating system (1-5 stars) is interactive and displays comments[cite: 23].

**Antigravity**, you are authorized to begin execution following this roadmap. Build for results. Build for the transformation.