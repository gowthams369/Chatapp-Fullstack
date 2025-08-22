import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(403).json("token missing");
    }
    const decodedMesage = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decodedMesage;
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
