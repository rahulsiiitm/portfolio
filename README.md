# Personal Portfolio

This is a **responsive personal portfolio website** built with **React, Vite, and Tailwind CSS**. I have designed it to showcase my **skills, projects, and experience** in a clean, modern, and interactive way.

---

## Features

* **Responsive Design** – Works seamlessly across desktops, tablets, and mobile devices.
* **Interactive UI** – Smooth animations and transitions for an engaging experience.
* **Component-Based Architecture** – Built with reusable and modular React components.
* **Project Showcase** – Display of projects with GitHub links and live demos.
* **Downloadable Resume** – One-click resume download option.
* **Contact Section** – Includes contact details and social media links.
* **Skills Display** – Visually highlights technical expertise.

---

## Tech Stack

**Frontend:**

* React
* Vite
* Tailwind CSS
* Framer Motion (animations)
* React Intersection Observer (scroll animations)

**Icons:**

* Lucide React
* React Icons

**Particles:**

* React TSParticles
* TSParticles

**Linting & Formatting:**

* ESLint

---

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have **Node.js** and **npm** installed.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-repository.git

# Navigate to the project folder
cd your-repository

# Install dependencies
npm install
```

---

## Available Scripts

In the project directory, you can run:

```bash
npm run dev      # Runs the app in development mode at http://localhost:5173
npm run lint     # Lints and fixes code issues
npm run preview  # Serves the production build locally
```

---

## Project Structure

```
portfolio/
├── public/                # Static assets (images, fonts, resume, etc.)
├── src/
│   ├── assets/            # Image assets
│   ├── components/        # React components
│   │   ├── AboutMeIntro.jsx
│   │   ├── ContactSection.jsx
│   │   ├── ExperienceSection.jsx
│   │   ├── HeroSection.jsx
│   │   ├── MobileSidebar.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── RightSidebar.jsx
│   │   └── SkillsSection.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── README.md
└── ... (config files)
```

---

## Customization

To personalize the portfolio, update the following files:

* `src/components/HeroSection.jsx` → Add your **name, title, and bio**
* `src/components/AboutMeIntro.jsx` → Update the **About Me** section and replace `My_photo2.jpg` in `/public` with your photo
* `src/components/ProjectsSection.jsx` → Add your **projects and images**
* `src/components/SkillsSection.jsx` → Customize your **skills**
* `src/components/ExperienceSection.jsx` → Update with your **work experience**
* `src/components/ContactSection.jsx` → Update with your **contact info**
* `public/Rahul_Resume (1).pdf` → Replace with your resume and update the link in `HeroSection.jsx`

---

## Author

**Rahul Sharma**

* GitHub: [@rahulsiiitm](https://github.com/rahulsiiitm)
* LinkedIn: [@rahulsharma2k4](https://www.linkedin.com/in/rahulsharma2k4/)
