import 'dotenv/config.js';
import mongoose from 'mongoose';
import Content from './models/Content.js';
import Skill from './models/Skill.js';
import Project from './models/Project.js';
import Post from './models/Post.js';
import Service from './models/Service.js';

async function seedDatabase() {
  const uri = process.env.DATABASE_URI;
  if (!uri) {
    console.error('DATABASE_URI is not defined in portfolio-backend/.env');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB: ${uri.replace(/:([^@]+)@/, ':****@')}`);
  await mongoose.connect(uri);
  console.log('Connected to MongoDB successfully!');

  // ================= 1. CONTENT =================
  const contentPayload = {
    name: "Rajashekar Chelimala",
    designation: "Java Full Stack Developer",
    organization: "Centre for Good Governance (CGG)",
    location: "Hyderabad, Telangana",
    degree: "B.Tech in Computer Science Engineering (CGPA: 8.4 / 10.0)",
    education: "Rajiv Gandhi University of Knowledge Technologies (RGUKT), Basar",
    languages: "English, Telugu, Hindi",
    footerText: "Crafted with precision & passion by Rajashekar Chelimala. © 2026",
    introduction: "<p>Java Full Stack Developer with <strong>3+ years of experience</strong> building large-scale enterprise and financial applications using <strong>Java, Spring Boot, Spring MVC, React.js, Hibernate, PostgreSQL, and AWS</strong>.</p><p>Experienced in developing REST APIs, transactional workflows, role-based access control (RBAC), approval hierarchies, and database-driven applications. Contributed to financial management platforms supporting <strong>160+ municipal offices</strong> and enterprise HR systems supporting <strong>100,000+ users</strong>. Skilled in legacy modernization, performance optimization, cloud deployment, and Agile development.</p>",
    imageLink: "/my-image.png",
    resumeLink: "https://drive.google.com/file/d/sample-resume/preview",
    typeWriterText: "Java Full Stack Developer,Spring Boot & Microservices Specialist,React.js Frontend Engineer,AWS Cloud Solutions Architect,High-Scale Enterprise Systems Engineer",
    hobbies: "Enterprise Architecture, Distributed Microservices, Open Source, AI & Voice Agents, Performance Optimization",
    instagram: "https://instagram.com/RajashekarChelimala",
    twitter: "https://twitter.com/RajashekarChelimala",
    linkedin: "https://www.linkedin.com/in/rajashekar-chelimala",
    github: "https://github.com/RajashekarChelimala"
  };

  const existingContent = await Content.findOne();
  if (existingContent) {
    await Content.findByIdAndUpdate(existingContent._id, contentPayload);
    console.log('Profile Content updated in database.');
  } else {
    await Content.create(contentPayload);
    console.log('Profile Content created in database.');
  }

  // ================= 2. SKILLS =================
  // Clear and re-populate skills with verified resume data
  await Skill.deleteMany({});
  const skillDocs = await Skill.insertMany([
    // Languages
    { name: "Java", type: "Languages", priorityOrder: "1", experience: "3+ Years", organizationName: "CGG", icon: "java-icon" },
    { name: "JavaScript (ES6+)", type: "Languages", priorityOrder: "2", experience: "3+ Years", organizationName: "CGG & Freelance", icon: "js-icon" },
    { name: "SQL", type: "Languages", priorityOrder: "3", experience: "3+ Years", organizationName: "CGG", icon: "mysql-icon" },

    // Backend
    { name: "Spring Boot", type: "Backend", priorityOrder: "4", experience: "3+ Years", organizationName: "CGG", icon: "java-icon" },
    { name: "Spring Security & RBAC", type: "Backend", priorityOrder: "5", experience: "3+ Years", organizationName: "CGG", icon: "java-icon" },
    { name: "Spring Data JPA & Hibernate", type: "Backend", priorityOrder: "6", experience: "3+ Years", organizationName: "CGG", icon: "java-icon" },
    { name: "Spring MVC & JSP", type: "Backend", priorityOrder: "7", experience: "2+ Years", organizationName: "CGG", icon: "java-icon" },
    { name: "Node.js & Express.js", type: "Backend", priorityOrder: "8", experience: "2+ Years", organizationName: "Freelance AI Platform", icon: "node-icon" },
    { name: "REST APIs & Microservices", type: "Backend", priorityOrder: "9", experience: "3+ Years", organizationName: "CGG & Freelance", icon: "api-icon" },

    // Frontend
    { name: "React.js", type: "Frontend", priorityOrder: "10", experience: "3+ Years", organizationName: "CGG & Freelance", icon: "react-icon" },
    { name: "HTML5 & CSS3", type: "Frontend", priorityOrder: "11", experience: "3+ Years", organizationName: "CGG", icon: "html-icon" },
    { name: "Material-UI (MUI)", type: "Frontend", priorityOrder: "12", experience: "2+ Years", organizationName: "CGG", icon: "css-icon" },
    { name: "Bootstrap 5", type: "Frontend", priorityOrder: "13", experience: "3+ Years", organizationName: "CGG", icon: "bootstrap-icon" },

    // Databases
    { name: "PostgreSQL", type: "Database", priorityOrder: "14", experience: "3+ Years", organizationName: "CGG", icon: "mysql-icon" },
    { name: "MongoDB", type: "Database", priorityOrder: "15", experience: "2+ Years", organizationName: "Freelance AI Platform", icon: "mysql-icon" },

    // Cloud & DevOps
    { name: "AWS (EC2, S3, Lambda, Route53, SES)", type: "Cloud & DevOps", priorityOrder: "16", experience: "2+ Years", organizationName: "CGG & Freelance", icon: "docker-icon" },
    { name: "Docker", type: "Cloud & DevOps", priorityOrder: "17", experience: "2+ Years", organizationName: "CGG & Freelance", icon: "docker-icon" },
    { name: "Git, GitHub & GitLab CI/CD", type: "Cloud & DevOps", priorityOrder: "18", experience: "3+ Years", organizationName: "CGG", icon: "github-icon" },
  ]);
  console.log(`Seeded ${skillDocs.length} technical skills.`);

  const skillMap = {};
  skillDocs.forEach(s => {
    skillMap[s.name] = s._id;
  });

  // Helper to safely map skill IDs
  const getSkillIds = (names) => {
    return names
      .map(name => skillMap[name] || Object.entries(skillMap).find(([k]) => k.includes(name))?.[1])
      .filter(Boolean);
  };

  // ================= 3. PROJECTS =================
  // Clear and re-populate verified production projects from Resume
  await Project.deleteMany({});
  await Project.insertMany([
    {
      projectName: "Telangana Police HRMS",
      organizationName: "Centre for Good Governance (CGG)",
      projectLink: "https://tgpolice.cgg.gov.in",
      fromDate: new Date("2023-06-01"),
      toDate: new Date(),
      currentlyWorking: true,
      description: "Large-scale Human Resource Management System supporting 100,000+ police personnel with a multi-level organizational hierarchy across the Telangana Police department. Implemented employee leave management, grievance handling, transfer allotment workflows, and multi-level approval processes with role-based access control (RBAC). Integrated Amazon S3 for secure document uploads, Amazon SES for email notifications, and supported deployment on AWS EC2 while optimizing SQL queries and maintaining Spring MVC/JSP modules.",
      skills: getSkillIds(["Spring Boot", "Spring MVC & JSP", "PostgreSQL", "React.js", "AWS (EC2, S3, Lambda, Route53, SES)"])
    },
    {
      projectName: "Municipal Administration Financial Management System",
      organizationName: "Centre for Good Governance (CGG)",
      projectLink: "https://tgerplive.cgg.gov.in",
      fromDate: new Date("2023-06-01"),
      toDate: new Date(),
      currentlyWorking: true,
      description: "Centralized double-entry accounting web application serving 160+ municipal offices across Telangana, supporting end-to-end accounting, budgeting, treasury, and financial reporting operations. Engineered complex work order workflows with 100+ dynamic fields, conditional validations, approval hierarchies, and secure document management capabilities.",
      skills: getSkillIds(["Spring Boot", "Spring Data JPA & Hibernate", "PostgreSQL", "React.js", "REST APIs & Microservices"])
    },
    {
      projectName: "Agricultural University Financial System",
      organizationName: "Centre for Good Governance (CGG)",
      projectLink: "https://pjtaufms.telangana.gov.in",
      fromDate: new Date("2023-08-01"),
      toDate: new Date("2024-06-30"),
      currentlyWorking: false,
      description: "Centralized financial platform serving 10+ constituent colleges with configurable approval workflows, user roles, and permission structures. Implemented robust two-factor authentication (2FA) through Email and SMS OTP, securing access for 500+ active faculty and administrative users.",
      skills: getSkillIds(["Spring Boot", "Spring Security & RBAC", "PostgreSQL", "React.js", "Bootstrap 5"])
    },
    {
      projectName: "Housing Corporation Financial Portal",
      organizationName: "Centre for Good Governance (CGG)",
      projectLink: "https://tghclfms.cgg.gov.in",
      fromDate: new Date("2023-06-01"),
      toDate: new Date("2024-02-28"),
      currentlyWorking: false,
      description: "Modernized a legacy Struts/JSP financial system to Spring Boot and React.js, improving application performance, responsiveness, and reducing technical debt across 60+ critical accounting screens.",
      skills: getSkillIds(["Spring Boot", "React.js", "PostgreSQL", "Spring Data JPA & Hibernate"])
    },
    {
      projectName: "AI-Powered Candidate Screening Platform",
      organizationName: "Independent (Remote)",
      projectLink: "https://github.com/RajashekarChelimala",
      fromDate: new Date("2024-12-01"),
      toDate: new Date("2025-12-31"),
      currentlyWorking: false,
      description: "Built an AI-powered candidate screening platform using React.js, Node.js, Express.js, and MongoDB, supporting AI-based interview evaluation, transcript analysis, and role-based workflows. Architected microservices with Python FastAPI services for Speech-to-Text (STT using whisper.cpp), TTS, and Qwen-based question and candidate feedback generation communicating via REST APIs. Deployed on AWS EC2, S3, IAM, CloudWatch, and MongoDB.",
      skills: getSkillIds(["React.js", "Node.js & Express.js", "MongoDB", "AWS (EC2, S3, Lambda, Route53, SES)", "Docker"])
    }
  ]);
  console.log('Seeded 5 verified production projects.');

  // ================= 4. SERVICES =================
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
    console.log('Seeded services.');
  }

  // ================= 5. ARTICLES / POSTS =================
  const postCount = await Post.countDocuments();
  if (postCount === 0) {
    await Post.create({
      headline: "Architecting Large-Scale Enterprise Systems with Spring Boot & Microservices",
      content: "<p>Building software for 100,000+ users and 160+ municipal offices requires deep architectural discipline. From double-entry accounting to multi-level approval hierarchies, transactional consistency and role-based access control (RBAC) are paramount.</p><p>By combining Spring Boot, PostgreSQL query optimization, and modern React.js frontend interfaces, legacy Struts systems can be successfully modernized into high-performance, maintainable platforms with zero data loss.</p>",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      likes: 54,
      engagementCount: 92
    });
    console.log('Sample engineering article seeded.');
  }

  console.log('\n===========================================');
  console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('===========================================');
  process.exit(0);
}

seedDatabase().catch(err => {
  console.error('Seeding Error:', err);
  process.exit(1);
});
