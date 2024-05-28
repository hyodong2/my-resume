import express from "express";
import { prisma } from "../utils/prisma.util.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        
        const user = await prisma.users.findUnique({
            where: { userId: userId },
            include: {
                UserInfos: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
        }

        const userInfo = user.UserInfos[0];
        
        return res.status(200).json({
            userId: user.userId,
            email: user.email,
            name: userInfo.name,
            role: userInfo.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        next(error);
    }
});

export default router;
