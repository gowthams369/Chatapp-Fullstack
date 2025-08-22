import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies;
    if (!token) {
      res.status(403).json("token missing");
    }
    const decodedMesage = await jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedMesage;
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
