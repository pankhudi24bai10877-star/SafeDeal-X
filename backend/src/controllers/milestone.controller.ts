
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// CREATE MILESTONE
export const createMilestone = async (req: Request, res: Response) => {
  try {
    const { title, description, amount, dueDate } = req.body;
    const projectId = String(req.params.projectId);

    if (!title || !description || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title, description and amount are required"
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

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a positive number"
      });
    }

    let parsedDueDate: Date | undefined;

    if (dueDate !== undefined && dueDate !== null) {
      parsedDueDate = new Date(dueDate);

      if (Number.isNaN(parsedDueDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid due date"
        });
      }
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
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
        message: "Only the project client can create milestones"
      });
    }

    if (!["DRAFT", "ACTIVE"].includes(project.status)) {
      return res.status(400).json({
        success: false,
        message: "Milestones cannot be added to this project"
      });
    }

    const existingMilestones = await prisma.milestone.aggregate({
      where: { projectId },
      _sum: { amount: true }
    });

    const currentTotal = Number(existingMilestones._sum.amount ?? 0);
    const projectBudget = Number(project.budget);

    if (currentTotal + numericAmount > projectBudget) {
      return res.status(400).json({
        success: false,
        message: "Milestone amount exceeds the remaining project budget",
        remainingBudget: projectBudget - currentTotal
      });
    }

    const milestone = await prisma.milestone.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        amount: numericAmount,
        dueDate: parsedDueDate,
        projectId
      }
    });

    return res.status(201).json({
      success: true,
      message: "Milestone created successfully",
      milestone
    });

  } catch (error) {
    console.error("Create milestone error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not create milestone"
    });
  }
};


// GET ALL MILESTONES FOR A PROJECT
export const getProjectMilestones = async (
  req: Request,
  res: Response
) => {
  try {
    const projectId = String(req.params.projectId);

    const project = await prisma.project.findUnique({
      where: { id: projectId }
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
        message: "You are not authorized to view these milestones"
      });
    }

    const milestones = await prisma.milestone.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" }
    });

    return res.json({
      success: true,
      totalMilestones: milestones.length,
      milestones
    });

  } catch (error) {
    console.error("Get milestones error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch milestones"
    });
  }
};


// UPDATE MILESTONE
export const updateMilestone = async (
  req: Request,
  res: Response
) => {
  try {
    const milestoneId = String(req.params.milestoneId);
    const { title, description, amount, dueDate } = req.body;

    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { project: true }
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found"
      });
    }

    if (milestone.project.clientId !== req.user!.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the project client can update milestones"
      });
    }

    if (milestone.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending milestones can be updated"
      });
    }

    const data: {
      title?: string;
      description?: string;
      amount?: number;
      dueDate?: Date | null;
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

    if (amount !== undefined) {
      const numericAmount = Number(amount);

      if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Amount must be a positive number"
        });
      }

      const totals = await prisma.milestone.aggregate({
        where: { projectId: milestone.projectId },
        _sum: { amount: true }
      });

      const currentTotal = Number(totals._sum.amount ?? 0);
      const updatedTotal = currentTotal -
        Number(milestone.amount) + numericAmount;

      if (updatedTotal > Number(milestone.project.budget)) {
        return res.status(400).json({
          success: false,
          message: "Updated amount exceeds the project budget",
          remainingBudget: Number(milestone.project.budget) -
            (currentTotal - Number(milestone.amount))
        });
      }

      data.amount = numericAmount;
    }

    if (dueDate !== undefined) {
      if (dueDate === null) {
        data.dueDate = null;
      } else {
        const parsedDate = new Date(dueDate);

        if (Number.isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid due date"
          });
        }

        data.dueDate = parsedDate;
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update"
      });
    }

    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data
    });

    return res.json({
      success: true,
      message: "Milestone updated successfully",
      milestone: updatedMilestone
    });

  } catch (error) {
    console.error("Update milestone error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not update milestone"
    });
  }
};
