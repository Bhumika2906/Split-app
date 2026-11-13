import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../../lib/db";
import { signToken, requireAuth, AuthedRequest } from "../../lib/auth";

const router = Router();

const publicUser = (u: {
  id: string;
  name: string;
  email: string;
  readoutLang: string;
}) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  readoutLang: u.readoutLang,
});

const signupSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
  readoutLang: z.enum(["english", "hindi", "hinglish"]).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: "Invalid input", details: parsed.error.flatten() });
  }
  const { name, email, password, readoutLang } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // Create the user, their "Personal" group, and themselves as a member.
  const user = await prisma.$transaction(async (tx) => {
    const u = await tx.user.create({
      data: {
        name,
        email,
        passwordHash,
        readoutLang: readoutLang ?? "hinglish",
      },
    });
    const g = await tx.group.create({
      data: { name: "Personal", isPersonal: true, createdById: u.id },
    });
    await tx.member.create({
      data: {
        groupId: g.id,
        displayName: u.name,
        userId: u.id,
        aliases: ["me", "main", "mai"],
      },
    });
    return u;
  });

  return res
    .status(201)
    .json({ token: signToken(user.id), user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!user || !ok) {
    return res.status(401).json({ error: "Wrong email or password" });
  }

  return res.json({ token: signToken(user.id), user: publicUser(user) });
});

router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json({ user: publicUser(user) });
});

export default router;
