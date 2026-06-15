import { z } from 'zod';
import { User } from '../models/User.js';
import { signToken } from '../utils/token.js';
import { HttpError } from '../middleware/error.js';

export const signupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(200),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateMeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  avatar: z.string().url().nullable().optional(),
});

export const forgotPasswordSchema = z.object({ email: z.string().email() });

export async function signup(req, res) {
  const { name, email, password } = req.body;
  if (await User.exists({ email })) throw new HttpError(409, 'Email already registered', 'email_taken');
  const user = new User({ name, email });
  await user.setPassword(password);
  await user.save();
  res.status(201).json({ token: signToken(user._id.toString()), user: user.toPublic() });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await user.verifyPassword(password))) {
    throw new HttpError(401, 'Invalid email or password', 'invalid_credentials');
  }
  res.json({ token: signToken(user._id.toString()), user: user.toPublic() });
}

export async function forgotPassword(_req, res) {
  // Generate token, persist, email link — placeholder.
  res.json({ ok: true });
}

export async function me(req, res) {
  res.json(req.user.toPublic());
}

export async function updateMe(req, res) {
  Object.assign(req.user, req.body);
  await req.user.save();
  res.json(req.user.toPublic());
}
