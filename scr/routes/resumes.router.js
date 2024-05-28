import express from "express";
import { prisma } from "../utils/prisma.util.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const sortQuery = req.query.sort?.toLowerCase() === "asc" ? "asc" : "desc";

        const resumes = await prisma.resumes.findMany({
            where: { userId },
            orderBy: {
                createdAt: sortQuery,
            },
            select: {
                resumeId: true,
                title: true,
                introduction: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                User: {
                    select: {
                        UserInfos: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        const result = resumes.map(resume => ({
            resumeId: resume.resumeId,
            name: resume.User.UserInfos[0].name,
            title: resume.title,
            introduction: resume.introduction,
            status: resume.status,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
        }));

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

import express from "express";
import { prisma } from "../utils/prisma.util.js";
import authMiddleware from "../middlewares/auth.middleware.js";

// 이력서 목록 조회 API
router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const sortQuery = req.query.sort?.toLowerCase() === "asc" ? "asc" : "desc";

        const resumes = await prisma.resumes.findMany({
            where: { userId },
            orderBy: {
                createdAt: sortQuery,
            },
            select: {
                resumeId: true,
                title: true,
                introduction: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                User: {
                    select: {
                        UserInfos: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        const result = resumes.map(resume => ({
            resumeId: resume.resumeId,
            name: resume.User.UserInfos[0].name,
            title: resume.title,
            introduction: resume.introduction,
            status: resume.status,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
        }));

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// 이력서 상세 조회 API
router.get("/:resumeId", authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const resumeId = parseInt(req.params.resumeId, 10);

        const resume = await prisma.resumes.findFirst({
            where: {
                resumeId,
                userId
            },
            select: {
                resumeId: true,
                title: true,
                introduction: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                User: {
                    select: {
                        UserInfos: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!resume) {
            return res.status(404).json({ message: "이력서가 존재하지 않습니다." });
        }

        const result = {
            resumeId: resume.resumeId,
            name: resume.User.UserInfos[0].name,
            title: resume.title,
            introduction: resume.introduction,
            status: resume.status,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
        };

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});



import express from "express";
import { prisma } from "../utils/prisma.util.js";
import authMiddleware from "../middlewares/auth.middleware.js";

// 이력서 목록 조회 API
router.get("/", authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const sortQuery = req.query.sort?.toLowerCase() === "asc" ? "asc" : "desc";

        const resumes = await prisma.resume.findMany({
            where: { UserId: userId },
            orderBy: {
                createdAt: sortQuery,
            },
            select: {
                resumeId: true,
                title: true,
                introduction: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                User: {
                    select: {
                        UserInfos: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        const result = resumes.map(resume => ({
            resumeId: resume.resumeId,
            name: resume.User.UserInfos[0].name,
            title: resume.title,
            introduction: resume.introduction,
            status: resume.status,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
        }));

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// 이력서 상세 조회 API
router.get("/:resumeId", authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const resumeId = parseInt(req.params.resumeId, 10);

        const resume = await prisma.resume.findFirst({
            where: {
                resumeId,
                UserId: userId
            },
            select: {
                resumeId: true,
                title: true,
                introduction: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                User: {
                    select: {
                        UserInfos: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!resume) {
            return res.status(404).json({ message: "이력서가 존재하지 않습니다." });
        }

        const result = {
            resumeId: resume.resumeId,
            name: resume.User.UserInfos[0].name,
            title: resume.title,
            introduction: resume.introduction,
            status: resume.status,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
        };

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});


import express from "express";
import { prisma } from "../utils/prisma.util.js";
import authMiddleware from "../middlewares/auth.middleware.js";

// 이력서 수정 API
router.put("/:resumeId", authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const resumeId = parseInt(req.params.resumeId, 10);
        const { title, introduction } = req.body;

        // 요청 바디에 제목 또는 자기소개가 없는 경우
        if (!title && !introduction) {
            return res.status(400).json({ message: "수정 할 정보를 입력해 주세요." });
        }

        // 이력서 조회
        const resume = await prisma.resume.findFirst({
            where: {
                resumeId,
                UserId: userId
            },
        });

        // 이력서가 존재하지 않는 경우
        if (!resume) {
            return res.status(404).json({ message: "이력서가 존재하지 않습니다." });
        }

        // 이력서 정보 수정
        const updatedResume = await prisma.resume.update({
            where: { resumeId },
            data: {
                title: title || resume.title, // 제목이 요청에 없으면 기존 제목 유지
                introduction: introduction || resume.introduction, // 자기소개가 요청에 없으면 기존 자기소개 유지
                updatedAt: new Date(), // 수정 시간 업데이트
            },
            select: {
                resumeId: true,
                UserId: true,
                title: true,
                introduction: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(200).json(updatedResume);
    } catch (error) {
        next(error);
    }
});



import express from "express";
import { prisma } from "../utils/prisma.util.js";
import authMiddleware from "../middlewares/auth.middleware.js";

// 이력서 삭제 API
router.delete("/:resumeId", authMiddleware, async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const resumeId = parseInt(req.params.resumeId, 10);

        // 이력서 조회
        const resume = await prisma.resume.findFirst({
            where: {
                resumeId,
                UserId: userId
            },
        });

        // 이력서가 존재하지 않는 경우
        if (!resume) {
            return res.status(404).json({ message: "이력서가 존재하지 않습니다." });
        }

        // 이력서 삭제
        await prisma.resume.delete({
            where: { resumeId },
        });

        return res.status(200).json({ message: "이력서가 성공적으로 삭제되었습니다.", deletedResumeId: resumeId });
    } catch (error) {
        next(error);
    }
});


export default router;
