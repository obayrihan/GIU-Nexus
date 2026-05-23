require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Application = require("../models/application");
const JobPost = require("../models/jobpost");
const User = require("../models/user");

const ADMIN_PASSWORD = process.env.DEMO_ADMIN_PASSWORD || "Admin123";
const USER_PASSWORD = process.env.DEMO_USER_PASSWORD || "Password123";

const recruiters = [
  ["NileTech Careers", "careers@niletech.demo"],
  ["Cairo Cloud Labs", "talent@cairocloud.demo"],
  ["Delta Data Systems", "recruiting@deltadata.demo"],
  ["Alexandria AI Studio", "jobs@alexai.demo"],
  ["Red Sea DevOps", "people@redseadevops.demo"],
  ["Giza Product House", "hr@gizaproduct.demo"],
  ["Sinai Security Works", "team@sinaisecurity.demo"],
  ["Smart Village Ventures", "hiring@smartvillage.demo"],
];

const seekers = [
  ["Mariam Hassan", "mariam.hassan@student.demo", ["React", "JavaScript", "CSS", "Frontend"]],
  ["Omar Khaled", "omar.khaled@student.demo", ["Node.js", "Express", "MongoDB", "Backend"]],
  ["Laila Samir", "laila.samir@student.demo", ["Python", "Machine Learning", "TensorFlow", "AI"]],
  ["Youssef Adel", "youssef.adel@student.demo", ["Docker", "AWS", "CI/CD", "DevOps"]],
  ["Farida Nasser", "farida.nasser@student.demo", ["SQL", "ETL", "Spark", "Data Engineering"]],
  ["Karim Mostafa", "karim.mostafa@student.demo", ["Java", "Spring", "Backend", "APIs"]],
  ["Nour Ahmed", "nour.ahmed@student.demo", ["React", "UX", "HTML", "CSS"]],
  ["Hana Tarek", "hana.tarek@student.demo", ["Python", "NLP", "Data", "AI/ML"]],
  ["Ziad Fathy", "ziad.fathy@student.demo", ["Kubernetes", "Linux", "Docker", "Cloud"]],
  ["Salma Yasser", "salma.yasser@student.demo", ["Product", "Analytics", "SQL", "Research"]],
  ["Ali Maher", "ali.maher@student.demo", ["MongoDB", "Node.js", "Backend", "Git"]],
  ["Jana Sherif", "jana.sherif@student.demo", ["Frontend", "React", "TypeScript", "Testing"]],
];

const jobBlueprints = [
  {
    category: "Frontend",
    titles: ["Frontend Intern", "React Developer", "UI Engineer", "Web Experience Associate", "Frontend Platform Trainee"],
    requirements: ["React", "JavaScript", "HTML", "CSS", "Git"],
    descriptions: [
      "Build responsive user interfaces and collaborate with product designers on reusable components.",
      "Improve web performance, accessibility, and user-facing workflows for a modern product team.",
    ],
  },
  {
    category: "Backend",
    titles: ["Backend Intern", "Node.js Developer", "API Engineer", "Server-Side Associate", "Backend Platform Trainee"],
    requirements: ["Node.js", "Express", "MongoDB", "REST APIs", "Git"],
    descriptions: [
      "Design REST APIs, model data, and support backend services for high-traffic workflows.",
      "Work on authentication, authorization, and service reliability across product APIs.",
    ],
  },
  {
    category: "AI/ML",
    titles: ["AI Intern", "Machine Learning Engineer", "NLP Research Assistant", "Computer Vision Associate", "ML Platform Trainee"],
    requirements: ["Python", "Machine Learning", "TensorFlow", "NLP", "Data"],
    descriptions: [
      "Prototype machine learning models and evaluate model quality using real product datasets.",
      "Build AI-powered features for search, recommendations, and information extraction.",
    ],
  },
  {
    category: "DevOps",
    titles: ["DevOps Intern", "Cloud Engineer", "Platform Reliability Associate", "CI/CD Engineer", "Infrastructure Trainee"],
    requirements: ["Docker", "AWS", "Linux", "Kubernetes", "CI/CD"],
    descriptions: [
      "Automate deployments, improve observability, and support secure cloud infrastructure.",
      "Maintain pipelines, container workflows, and production-readiness checks for engineering teams.",
    ],
  },
  {
    category: "Data Engineering",
    titles: ["Data Engineering Intern", "ETL Developer", "Analytics Engineer", "Data Platform Associate", "SQL Data Trainee"],
    requirements: ["SQL", "ETL", "Spark", "Python", "Data Warehousing"],
    descriptions: [
      "Build data pipelines, clean raw data, and prepare datasets for analytics and AI teams.",
      "Support dashboards, warehouse models, and reliable data delivery across the company.",
    ],
  },
  {
    category: "Other",
    titles: ["Product Operations Intern", "Technical Support Associate", "QA Tester", "Business Systems Trainee", "Implementation Associate"],
    requirements: ["Communication", "Problem Solving", "Testing", "Documentation", "Analytics"],
    descriptions: [
      "Coordinate technical projects, document workflows, and support cross-functional delivery.",
      "Work with customers, engineers, and operations teams to improve product quality.",
    ],
  },
];

const locations = ["Cairo", "Giza", "New Cairo", "Alexandria", "6th of October", "Smart Village", "Remote", "Hybrid Cairo"];
const types = ["internship", "full-time", "part-time"];

function pick(list, index) {
  return list[index % list.length];
}

function seededEmail(prefix, index) {
  return `${prefix}${index}@demo.giu-nexus.local`;
}

async function upsertUser(user) {
  return User.findOneAndUpdate(
    { email: user.email },
    {
      ...user,
      password: await bcrypt.hash(user.password, 10),
    },
    { new: true, upsert: true, runValidators: true },
  );
}

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from .env");
  }

  const reset = process.argv.includes("--reset") || process.env.DEMO_SEED_RESET === "true";
  const jobCountArg = process.argv.find((arg) => arg.startsWith("--jobs="));
  const jobCount = jobCountArg ? Number(jobCountArg.split("=")[1]) : Number(process.env.DEMO_JOB_COUNT || 96);

  await mongoose.connect(process.env.MONGO_URI);

  if (reset) {
    const seededUsers = [
      "admin@giu-nexus.demo",
      ...recruiters.map(([, email]) => email),
      ...seekers.map(([, email]) => email),
    ];
    await Application.deleteMany({});
    await JobPost.deleteMany({
      $or: [
        { company: { $in: recruiters.map(([name]) => name) } },
        { title: { $regex: "Demo", $options: "i" } },
      ],
    });
    await User.deleteMany({ email: { $in: seededUsers } });
  }

  const admin = await upsertUser({
    name: process.env.DEMO_ADMIN_NAME || "Demo Admin",
    email: (process.env.DEMO_ADMIN_EMAIL || "admin@giu-nexus.demo").toLowerCase(),
    password: ADMIN_PASSWORD,
    role: "admin",
    status: "approved",
    bio: "Admin account for managing the GIU Nexus demo.",
  });

  const recruiterUsers = [];
  for (const [index, [name, email]] of recruiters.entries()) {
    recruiterUsers.push(await upsertUser({
      name,
      email,
      password: USER_PASSWORD,
      role: "recruiter",
      status: index === recruiters.length - 1 ? "pending" : "approved",
      bio: `${name} recruits technical talent for internships and early-career roles.`,
    }));
  }

  const seekerUsers = [];
  for (const [name, email, skills] of seekers) {
    seekerUsers.push(await upsertUser({
      name,
      email,
      password: USER_PASSWORD,
      role: "jobSeeker",
      status: "approved",
      bio: `${name} is building experience with ${skills.join(", ")} through GIU Nexus opportunities.`,
      skills,
      profilePicture: "",
    }));
  }

  const jobs = [];
  for (let index = 0; index < jobCount; index += 1) {
    const blueprint = pick(jobBlueprints, index);
    const recruiter = pick(recruiterUsers, index);
    const company = pick(recruiters, index)[0];
    const title = `${pick(blueprint.titles, index)} ${index + 1}`;

    jobs.push({
      updateOne: {
        filter: { title, company },
        update: {
          $set: {
            title,
            company,
            description: `${pick(blueprint.descriptions, index)} Demo role #${index + 1}.`,
            requirements: blueprint.requirements,
            location: pick(locations, index),
            type: pick(types, index),
            salary: 7000 + (index % 24) * 750,
            totalSlots: 1 + (index % 5),
            category: blueprint.category,
            status: index % 11 === 0 ? "closed" : "open",
            createdBy: recruiter._id,
          },
        },
        upsert: true,
      },
    });
  }

  if (jobs.length) {
    await JobPost.bulkWrite(jobs);
  }

  const allJobs = await JobPost.find({ company: { $in: recruiters.map(([name]) => name) } }).sort({ createdAt: -1 });

  for (const [seekerIndex, seeker] of seekerUsers.entries()) {
    const savedJobs = allJobs
      .filter((job, jobIndex) => job.status === "open" && (jobIndex + seekerIndex) % 4 === 0)
      .slice(0, 12)
      .map((job) => job._id);

    await User.findByIdAndUpdate(seeker._id, { savedJobs });

    const applicationJobs = allJobs
      .filter((job, jobIndex) => job.status === "open" && (jobIndex + seekerIndex) % 7 === 0)
      .slice(0, 8);

    for (const [applicationIndex, job] of applicationJobs.entries()) {
      await Application.findOneAndUpdate(
        { user: seeker._id, job: job._id },
        {
          user: seeker._id,
          job: job._id,
          coverLetter: `I am interested in ${job.title} because it matches my skills and career goals.`,
          status: pick(["pending", "shortlisted", "rejected"], applicationIndex + seekerIndex),
          appliedAt: new Date(Date.now() - (applicationIndex + seekerIndex + 1) * 86400000),
        },
        { upsert: true, new: true, runValidators: true },
      );
    }
  }

  const userCount = await User.countDocuments();
  const totalJobs = await JobPost.countDocuments();
  const applicationCount = await Application.countDocuments();

  console.log("Demo database is ready.");
  console.log(`Admin: ${admin.email} / ${ADMIN_PASSWORD}`);
  console.log(`Demo user password: ${USER_PASSWORD}`);
  console.log(`Users: ${userCount}`);
  console.log(`Jobs: ${totalJobs}`);
  console.log(`Applications: ${applicationCount}`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
