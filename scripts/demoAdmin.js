require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/user");

const admin = {
  name: process.env.DEMO_ADMIN_NAME || "Demo Admin",
  email: (process.env.DEMO_ADMIN_EMAIL || "admin@giu-nexus.demo").toLowerCase(),
  password: process.env.DEMO_ADMIN_PASSWORD || "Admin123",
};

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from .env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const password = await bcrypt.hash(admin.password, 10);
  const user = await User.findOneAndUpdate(
    { email: admin.email },
    {
      name: admin.name,
      email: admin.email,
      password,
      role: "admin",
      status: "approved",
    },
    { new: true, upsert: true, runValidators: true },
  ).select("-password");

  console.log("Demo admin is ready:");
  console.log(`Email: ${user.email}`);
  console.log(`Password: ${admin.password}`);
  console.log("Use these credentials at /login, then open /admin/users.");
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
