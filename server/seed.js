const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Seed PortfolioConfig (singleton)
    await prisma.portfolioConfig.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            heroLabel: "Portfolio — 2026",
            heroName1: "Enzo",
            heroName2: "Daniela.",
            heroTagline: "IT Graduate & Web Developer based in Caloocan City, Philippines. Building systems with Node.js, Express, MySQL, Supabase & Docker.",
            aboutTitle: "Backend-first developer who actually cares about how the data moves.",
            aboutText1: "BS Information Technology graduate with hands-on experience in web development through internship, academic, and personal projects. Focused on building robust server-side logic, RESTful APIs, and database operations.",
            aboutText2: "Comfortable working on both solo and team-based projects. Uses AI-assisted tools like Claude and GitHub Copilot to accelerate development and support frontend implementation.",
            profileImg: "./image/new_formal-removebg-preview.png",
            badgeText: "BSIT Graduate",
            school: "STI College Fairview",
            course: "BS Information Technology",
            graduated: "July 17, 2026",
            location: "Caloocan City, PH",
            contactText: "I am currently looking for full-time roles in web development. Feel free to reach out if you think we'd be a good fit!",
            email: "parane.enzo@gmail.com",
        }
    });

    // Seed Projects
    const projects = [
        {
            title: "Gym Management System",
            description: "Full-stack gym management with POS, inventory tracking, and member check-ins.",
            imageUrl: "image/landing.png",
            liveUrl: "https://fitworxgymph.web.app/",
            tags: "Express.js,MySQL,Firebase,Node.js",
            category: "node database",
            badge: "Capstone",
            featured: true,
            sortOrder: 1
        },
        {
            title: "Grade Calculator",
            description: "STI grading system with local storage.",
            imageUrl: "image/STI GRADE CALCULATOR.png",
            liveUrl: "https://grade-calculator-xi.vercel.app/",
            tags: "JavaScript,CSS3,HTML5",
            category: "vanilla",
            badge: "",
            featured: false,
            sortOrder: 2
        },
        {
            title: "Attendance System",
            description: "QR-based logging, 95% tracking accuracy.",
            imageUrl: "image/Screenshot 2026-05-13 081804.png",
            liveUrl: "https://attendance-tracker-asean.vercel.app/",
            tags: "React,Node.js,Supabase",
            category: "react node database",
            badge: "IBP",
            featured: false,
            sortOrder: 3
        },
        {
            title: "Ticketing System",
            description: "Facility issue management & workflows.",
            imageUrl: "",
            liveUrl: "",
            tags: "TypeScript,React,Tailwind",
            category: "react",
            badge: "IBP",
            featured: false,
            sortOrder: 4
        }
    ];

    for (const proj of projects) {
        await prisma.project.create({ data: proj });
    }

    // Seed Experiences
    const experiences = [
        {
            role: "Web Developer Intern | IT Support",
            company: "Integrated Bar of the Philippines (IBP)",
            period: "March 2026 — May 2026",
            description: "",
            bullets: JSON.stringify([
                "Contributed to the development of a Human Resource Information System (HRIS)",
                "Contributed to the development of an Attendance Monitoring System (AMS)",
                "Assisted in building a Ticketing Management System for internal operations",
                "Streamlined employee and administrative workflows",
                "Provided technical support and system maintenance"
            ]),
            logoUrl: "image/ibp logo.png",
            sortOrder: 1
        },
        {
            role: "Backend Developer & Team Lead",
            company: "Online Gym Facility Management System (Capstone)",
            period: "Aug 2025 — Dec 2025",
            description: "",
            bullets: JSON.stringify([
                "Developed and structured 20+ backend route modules implementing RESTful APIs for membership management, ecommerce, and payment processing.",
                "Implemented secure equipment tracking, reservations, and customer inquiries using Node.js & Express.js."
            ]),
            logoUrl: "",
            sortOrder: 2
        },
        {
            role: "Bachelor of Science in Information Technology (BSIT)",
            company: "STI College Fairview",
            period: "July 2026",
            description: "",
            bullets: JSON.stringify([
                "Graduated on July 17, 2026, with an emphasis on web development, database management systems, and systems integration.",
                "Completed a 4-year BSIT curriculum focusing on practical application development and software design methodologies."
            ]),
            logoUrl: "image/STI.png",
            sortOrder: 3
        }
    ];

    for (const exp of experiences) {
        await prisma.experience.create({ data: exp });
    }

    console.log('Database seeded successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
