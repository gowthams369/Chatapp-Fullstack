import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log("REQ BODY:", req.body);

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: passwordHash,
      },
    });

    res.status(201).send("User createdscucessfully");
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ message: "Error in signup", error: error.message });
  }
};
