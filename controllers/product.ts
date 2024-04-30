import { Prisma, prisma } from '../prisma';
import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

export default {
  all: async (req: Request, res: Response) => {
    const { searchString, skip, take, orderBy } = req.query;
    const or: Prisma.ProductWhereInput = searchString
      ? {
          OR: [
            { name: { contains: searchString as string } }
          ]
        }
      : {};

    const result = await prisma.product.findMany({
      where: {
        ...or
      },
      include: { manufacturer: true },
      take: Number(take) || undefined,
      skip: Number(skip) || undefined,
      orderBy: {
        id: orderBy as Prisma.SortOrder
      }
    });

    res.json(result);
  },

  byId: async (req: Request, res: Response) => {
    const { id }: { id?: string } = req.params;

    const post = await prisma.product.findUnique({
      where: { id }
    });
    res.json(post);
  },

  create: asyncHandler(async (req: Request, res: Response) => {
    delete req.body.manufacturer
    const result = await prisma.product.create({
      data: req.body
    });
    res.json(result);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    delete req.body.id
    const post = await prisma.product.update({
      where: { id },
      data: req.body
    });
    res.json(post);
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const post = await prisma.product.delete({
      where: { id }
    });
    res.json(post);
  })
};
