import User from '@models/user.model';
import { NextFunction, Request, Response } from 'express';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DuplicateError, handleError, NotFoundError, ValidationError } from '@utils/error-handlers';

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash');

    if (!users || users.length === 0) {
      throw new NotFoundError('No users found');
    }

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    handleError(error, res);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
      throw new NotFoundError('No users found');
    }

    res.status(200).send({ data: user });
  } catch (error) {
    handleError(error, res);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    // Check if user data is provided
    if (!userData || !userData.email || !userData.password) {
      throw new ValidationError('Required user data is missing', {
        missingFields: ['email', 'password'],
      });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new DuplicateError('A user with this email already exists');
    }

    // Create the new user
    const user = await User.create({
      name: userData.name,
      email: userData.email,
      passwordHash: bcrypt.hashSync(userData.password, 10),
      phone: userData.phone,
      isAdmin: userData.isAdmin || false,
      street: userData.street,
      apartment: userData.apartment,
      zip: userData.zip,
      city: userData.city,
      country: userData.country,
    });

    // Check if user creation was successful
    if (!user) {
      throw new Error('User creation failed due to an unknown error');
    }

    // Send the response
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    handleError(error, res);
  }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ValidationError('Email and password are required', {
        missingFields: ['email', 'password'],
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError('User not found!');
    }

    // Check password
    const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ValidationError('Invalid email or password');
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET!, { expiresIn: '1d' });

    // Respond with token and user details
    res.status(200).json({ success: true, user: { email: user.email }, token });
  } catch (error) {
    handleError(error, res);
    next(error); // Pass unexpected errors to the Express error handler
  }
};
