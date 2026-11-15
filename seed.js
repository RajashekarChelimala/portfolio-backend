import 'dotenv/config.js';
import mongoose from 'mongoose';
import Content from './models/Content.js';
import Skill from './models/Skill.js';
import Project from './models/Project.js';
import Post from './models/Post.js';
import Service from './models/Service.js';

async function seed() {
  await mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost:27017/Portfolio');
  console.log('Connected to MongoDB for seeding');

  // 1. Content
  let existingContent = await Content.findOne();
  if (!existingContent) {
    await Content.create({
      name: "Rajashekar Chelimala",
      hobbies: "System Design, Open Source, Technical Writing, Photography",
      organization: "Software Development",
      designation: "Full Stack Engineer",
      location: "Hyderabad, India",
      degree: "B.Tech in Computer Science & Engineering",
      education: "Jawaharlal Nehru Technological University",
      languages: "English, Telugu, Hindi",
      footerText: "Crafted with precision & passion by Rajashekar Chelimala. © 2026",
      introduction: "<p>Hello! I am a passionate Full Stack Software Engineer specializing in building scalable web architectures, resilient microservices, and sleek modern user experiences. Proficient across the MERN stack, Java Spring Boot, and cloud environments.</p>",
      imageLink: "/my-image.png",
      resumeLink: "https://drive.google.com/file/d/sample-resume/preview",
      typeWriterText: "Full Stack Developer,React & Next.js Specialist,Java & Spring Boot Engineer,Cloud Solutions Architect",
      instagram: "https://instagram.com/RajashekarChelimala",
      twitter: "https://twitter.com/RajashekarChelimala",
      linkedin: "https://linkedin.com/in/rajashekarchelimala",
      github: "https://github.com/RajashekarChelimala"
    });
    console.log('Default content seeded.');
  } else {
    console.log('Content already exists.');
  }

  // 2. Skills
  let skills = await Skill.find();
  if (skills.length === 0) {
    skills = await Skill.insertMany([
      { name: "React.js", type: "Frontend", priorityOrder: "1", experience: "3+ Years", organizationName: "Industry Experience", icon: "react-icon" },
      { name: "JavaScript (ES6+)", type: "Frontend", priorityOrder: "2", experience: "4+ Years", organizationName: "Industry Experience", icon: "js-icon" },
      { name: "TypeScript", type: "Languages", priorityOrder: "3", experience: "2+ Years", organizationName: "Industry Experience", icon: "typescript-icon" },
      { name: "Node.js & Express", type: "Backend", priorityOrder: "4", experience: "3+ Years", organizationName: "Industry Experience", icon: "node-icon" },
      { name: "Java & Spring Boot", type: "Backend", priorityOrder: "5", experience: "2+ Years", organizationName: "Industry Experience", icon: "java-icon" },
      { name: "MongoDB & Mongoose", type: "Database", priorityOrder: "6", experience: "3+ Years", organizationName: "Industry Experience", icon: "mysql-icon" },
      { name: "HTML5 / CSS3 / SASS", type: "Frontend", priorityOrder: "7", experience: "4+ Years", organizationName: "Industry Experience", icon: "html-icon" },
      { name: "REST APIs & WebSockets", type: "Architecture", priorityOrder: "8", experience: "3+ Years", organizationName: "Industry Experience", icon: "bootstrap-icon" }
    ]);
    console.log('Skills seeded.');
  }

  const skillIds = skills.map(s => s._id);

  // 3. Projects
  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
    await Project.insertMany([
      {
        projectName: "Enterprise MERN CMS & Dynamic Portfolio",
        organizationName: "Personal Initiative",
        fromDate: new Date("2024-01-01"),
        toDate: new Date(),
        currentlyWorking: true,
        description: "Full-stack portfolio and real-time content management system featuring JWT role-based security, WebSockets for live alerts, rich text editing, and dynamic portfolio content sync.",
        projectLink: "https://github.com/RajashekarChelimala/portfolio-admin",
        skills: skillIds.slice(0, 4)
      },
      {
        projectName: "Cloud Microservices Backend Platform",
        organizationName: "Engineering Project",
        fromDate: new Date("2023-06-01"),
        toDate: new Date("2023-12-31"),
        currentlyWorking: false,
        description: "Scalable backend architecture featuring distributed authentication, rate limiting, MongoDB aggregation pipelines, and automated email dispatching with nodemailer.",
        projectLink: "https://github.com/RajashekarChelimala/portfolio-backend",
        skills: skillIds.slice(3, 7)
      },
      {
        projectName: "Real-time Collaboration & Analytics Hub",
        organizationName: "FinTech Innovation",
        fromDate: new Date("2023-01-01"),
        toDate: new Date("2023-05-31"),
        currentlyWorking: false,
        description: "Interactive dashboard featuring real-time collaborative task tracking, socket synchronization, analytics charts, and comprehensive audit logs.",
        projectLink: "https://github.com/RajashekarChelimala",
        skills: [skillIds[0], skillIds[4], skillIds[6]]
      }
    ]);
    console.log('Projects seeded.');
  }

  // 4. Services
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      { serviceName: "Home", iconName: "fa-home", targetUrl: "/", displayOrder: 1, isActive: true },
      { serviceName: "About", iconName: "fa-user", targetUrl: "/about", displayOrder: 2, isActive: true },
      { serviceName: "Projects", iconName: "fa-project-diagram", targetUrl: "/projects", displayOrder: 3, isActive: true },
      { serviceName: "Posts", iconName: "fa-newspaper", targetUrl: "/posts", displayOrder: 4, isActive: true },
      { serviceName: "Contact", iconName: "fa-envelope", targetUrl: "/contact", displayOrder: 5, isActive: true },
      { serviceName: "Resume", iconName: "fa-file-alt", targetUrl: "/resume", displayOrder: 6, isActive: true }
    ]);
    console.log('Services seeded.');
  }

  // 5. Sample Post
  const postCount = await Post.countDocuments();
  if (postCount === 0) {
    await Post.create({
      headline: "Building Scalable Modern Web Applications with MERN & WebSockets",
      content: "<p>Modern web engineering requires responsiveness, low latency, and modular architecture. In this article, we explore how combining React, Node.js, and Socket.IO creates engaging real-time user experiences with seamless synchronization.</p><p>Key principles include state isolation, optimistic updates, and robust error boundaries to guarantee 99.9% client uptime even during flaky connections.</p>",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      likes: 42,
      engagementCount: 78
    });
    console.log('Sample post seeded.');
  }

  console.log('All seeding completed successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
