import express, {Request} from "express";
import {PrismaClient, User} from '../generated/prisma';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {CredentialsDTO, UserDTO} from "../dtos/auth";
import validator from "validator";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/login", async function (req: Request<{}, {}, CredentialsDTO>, res) {
    const user = await prisma.user.findUnique({where: {email: req.body.email}});
    if (!user) {
        res.status(404).json(`User ${req.body.email} not found.`);
        return;
    }

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) {
        res.status(401).json(`The password is incorrect.`);
        return;
    }

    const payload = {id: user.id, email: user.email};
    const secret = process.env.JWT_SECRET_KEY;

    const token = jwt.sign(
        payload,
        secret!,
        {expiresIn: "1d"}
    );

    res.status(200).json({token: token});
});

router.post("/register", async function (req: Request<{}, {}, CredentialsDTO>, res) {
    if (!req.body.email || !req.body.password) {
        res.status(400).json(`Email or password are empty.`);
        return;
    }

    const emailIsValid = validator.isEmail(req.body.email);
    if (!emailIsValid) {
        res.status(400).json(`Email ${req.body.email} is not valid.`);
        return;
    }

    const exists = await prisma.user.findUnique({where: {email: req.body.email}});
    if (exists) {
        res.status(409).json(`User ${req.body.email} already exists.`);
        return;
    }

    const result = await prisma.user.create({
        data: {
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 12),
        }
    });

    // TODO: Improve this return
    res.status(200).json(result.id);
});

export default router;