import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User created', user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id; // from middleware
    const { name, email, password } = req.body;

    const updateData: any = { name, email };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({
      message: 'Profile updated',
      user: {
        id: updatedUser?._id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        role: updatedUser?.role,
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Error updating profile' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).user; // added via middleware
  
      res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      console.error('Get profile error:', err);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  };
  