import { jwtVerify } from "jose";

export const verifyToken = async (token: string, secret: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
