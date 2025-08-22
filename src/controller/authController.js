import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      res.status(401).json("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json("invalid credentials");
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.send(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
