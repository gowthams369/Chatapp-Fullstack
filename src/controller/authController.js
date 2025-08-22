import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import cloudinary from "../lib/cloudinary.js";

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

export const logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json("User logout sucessfully");
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user.id;
    if (!profilePic) {
      res.status(400).json({ message: "Profile pic is missing" });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: { profilePic: uploadResponse.secure_url },
    });
    res.status(200).json(updateUser);
  } catch (error) {
    console.log("Erroor updating", error);
    res.status(500).json("Internal Server error");
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log({ error });
    res.status(500).json("internal server error ");
  }
};
