import bcrypt from "bcryptjs";

// Hash a plain text password
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

// Compare plain password with hashed password
export const comparePassword = async (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed);
};
