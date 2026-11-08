import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getFreelancers = async (_req: Request, res: Response) => {
  try {
    const freelancers = await prisma.user.findMany({
      where: {
        role: "FREELANCER",
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      freelancers,
    });
  } catch (error) {
    console.error("Error fetching freelancers:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch freelancers.",
    });
  }
};