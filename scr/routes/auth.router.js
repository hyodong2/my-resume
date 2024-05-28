import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;

function createAccessToken(userId) {
  return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET_KEY, { expiresIn: '12h' });
}

// 회원가입 API
router.post('/sign-up', async (req, res, next) => {
  try {
    const { email, password, repassword, name } = req.body;

    if (!email || !password || !repassword || !name) {
      return res.status(400).json({ message: "모든 정보를 입력해주세요." });
    }

    const existEmail = await prisma.users.findFirst({ where: { email } });
    if (existEmail) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "비밀번호는 6자리 이상이여야합니다." });
    }

    if (password !== repassword) {
      return res.status(409).json({ message: "두 비밀번호가 다릅니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({ data: { email, password: hashedPassword } });
    const userinfo = await prisma.userInfos.create({ data: { UserId: user.userId, name, role: 'APPLICANT' } });

    return res.status(201).json({
      message: "회원가입이 완료되었습니다.",
      data: {
        id: user.userId,
        email: user.email,
        name: userinfo.name,
        role: userinfo.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (err) {
    next(err);
  }
});

// 로그인 API
router.post('/sign-in', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "이메일을 입력해주세요." });
    }

    if (!password) {
      return res.status(400).json({ message: "비밀번호를 입력해주세요." });
    }

    const user = await prisma.users.findFirst({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const AccessToken = createAccessToken(user.userId);
    res.cookie('authorization', `Bearer ${AccessToken}`);
    return res.status(200).json({
      message: "로그인에 성공하였습니다.",
      data: { AccessToken },
    });
  } catch (err) {
    next(err);
  }
});

// 사용자 정보 조회 API (인증 필요)
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    return res.status(200).json({
      userId: user.userId,
      email: user.email,
      name: user.UserInfos.name,
      role: user.UserInfos.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
