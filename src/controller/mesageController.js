import { PrismaClient } from "@prisma/client";
import cloudinary from "../lib/cloudinary.js";
const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
  try {
    const loggedInUsers = req.user.id;
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: loggedInUsers,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePic: true,
        createdAt: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { reciverId } = req.params;
    const myId = req.user.id;

    const message = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, reciverId: parseInt(reciverId) },
          { senderId: parseInt(reciverId), reciverId: myId },
        ],
      },
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
};

//to do : realtime socket.io

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { reciverId } = req.params;
    const senderId = req.user.id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await prisma.message.create({
      data: {
        sender: { connect: { id: senderId } },
        reciver: { connect: { id: parseInt(reciverId) } },
        text,
        image: imageUrl,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
        reciver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePic: true,
          },
        },
      },
    });

    res
      .status(200)
      .json({ message: "mesage send sucessfuly", data: newMessage });
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error", error);
  }
};
