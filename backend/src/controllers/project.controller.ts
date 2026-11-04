
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, budget, freelancerId } = req.body;

    if (!title || !description || !budget || !freelancerId) {
      return res.status(400).json({
        success: false,
        message: "Title, description, budget and freelancerId are required"
      });
    }

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid title and description are required"
      });
    }

    const numericBudget = Number(budget);

    if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
      return res.status(400).json({
        success: false,
        message: "Budget must be a positive number"
      });
    }

    const freelancer = await prisma.user.findUnique({
      where: { id: String(freelancerId) }
    });

    if (!freelancer || freelancer.role !== "FREELANCER") {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found"
      });
    }

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        budget: numericBudget,
        clientId: req.user!.userId,
        freelancerId: freelancer.id
      },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        freelancer: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });

  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not create project"
    });
  }
};


export const getMyProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { clientId: req.user!.userId },
          { freelancerId: req.user!.userId }
        ]
      },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        freelancer: {
          select: { id: true, name: true, email: true }
        },
        milestones: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json({
      success: true,
      totalProjects: projects.length,
      projects
    });

  } catch (error) {
    console.error("Get projects error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch projects"
    });
  }
};


export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: String(req.params.id) },
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        freelancer: {
          select: { id: true, name: true, email: true }
        },
        milestones: true
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const userId = req.user!.userId;

    if (
      project.clientId !== userId &&
      project.freelancerId !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this project"
      });
    }

    return res.json({
      success: true,
      project
    });

  } catch (error) {
    console.error("Get project error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch project"
    });
  }
};


export const updateProject = async (req: Request, res: Response) => {
  try {
    const { title, description, budget } = req.body;

    const project = await prisma.project.findUnique({
      where: { id: String(req.params.id) }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    if (project.clientId !== req.user!.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the project client can update this project"
      });
    }

    if (project.status !== "DRAFT") {
      return res.status(400).json({
        success: false,
        message: "Only draft projects can be updated"
      });
    }

    const data: {
      title?: string;
      description?: string;
      budget?: number;
    } = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title must be a non-empty string"
        });
      }
      data.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== "string" || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: "Description must be a non-empty string"
        });
      }
      data.description = description.trim();
    }

    if (budget !== undefined) {
      const numericBudget = Number(budget);

      if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
        return res.status(400).json({
          success: false,
          message: "Budget must be a positive number"
        });
      }

      data.budget = numericBudget;
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update"
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id: String(req.params.id) },
      data,
      include: {
        client: {
          select: { id: true, name: true, email: true }
        },
        freelancer: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return res.json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject
    });

  } catch (error) {
    console.error("Update project error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not update project"
    });
  }
};
