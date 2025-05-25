import express, {NextFunction, Request, RequestHandler, Response} from "express";
import {PrismaClient, Task} from '../generated/prisma';
import {TaskDTO} from "../dtos/tasks";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

router.use(async function (req: Request, res: Response, next: NextFunction) {
    const authorization = req.headers.authorization;
    const token = authorization?.split(' ')[1];

    if (!token) {
        res.sendStatus(401);
        return;
    }

    const secret = process.env.JWT_SECRET_KEY;

    try {
        const payload = jwt.verify(token, secret!) as { id: number, email: string };
        await prisma.user.findUniqueOrThrow({
            where: {
                id: payload.id,
                email: payload.email
            }
        });

        res.locals.id = payload.id;

        next();
    } catch (error) {
        res.sendStatus(403);
    }
});

router.get("/", async function (req, res: Response<TaskDTO[]>) {
    const userId = res.locals.id;
    const tasks = await prisma.task.findMany({where: {userId: userId}});

    res.status(200).json(tasks as TaskDTO[]);
});

router.post("/", async function (req: Request<{}, {}, TaskDTO>, res) {
    const task = req.body as Task;
    if (!task) {
        res.sendStatus(400);
        return;
    }

    task.userId = res.locals.id;

    const result = await prisma.task.create({
        data: {
            title: task.title,
            description: task.description,
            endsAt: task.endsAt,
            userId: task.userId,
        }
    });

    res.status(200).json(result);
});

router.put("/:id", async function (req: Request<{}, {}, TaskDTO>, res) {
    const task = req.body as Task;
    if (!task) {
        res.sendStatus(400);
        return;
    }

    task.userId = res.locals.id;

    try {
        const result = await prisma.task.update({
            data: task,
            where: {
                id: task.id,
                userId: task.userId
            }
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json(`Task with id ${task.id} doesn't exist.`);
    }
});

router.delete("/:id", async function (req, res) {
    const id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) {
        res.sendStatus(400);
        return;
    }

    const userId = res.locals.id;

    try {
        await prisma.task.delete({
            where: {
                id: id,
                userId: userId
            }
        });

        res.sendStatus(200);
    } catch (error) {
        res.status(400).json(`Task with id ${id} doesn't exist.`);
    }
});

export default router;