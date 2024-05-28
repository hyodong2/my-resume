import jwt from "jsonwebtoken";
import { prisma } from "../utils/prisma.util.js";

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: "인증 정보가 없습니다." });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "지원하지 않는 인증 방식입니다." });
    }
    
    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
        const user = await prisma.users.findUnique({ where: { userId: decoded.id } });
        
        if (!user) {
            return res.status(401).json({ message: "인증 정보와 일치하는 사용자가 없습니다." });
        }
        
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "인증 정보가 만료되었습니다." });
        }
        return res.status(401).json({ message: "인증 정보가 유효하지 않습니다." });
    }
};

export default authMiddleware;
