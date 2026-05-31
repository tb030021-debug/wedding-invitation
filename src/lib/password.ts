import bcrypt from "bcryptjs";

const saltRounds = 12;

export function hashPassword(password: string) {
  return bcrypt.hash(password, saltRounds);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
