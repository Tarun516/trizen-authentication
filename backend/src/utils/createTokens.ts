import jwt from "jsonwebtoken";

export const createTokens = (user: any) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return { accessToken };
};
