import { auth } from '@clerk/nextjs/server';

export const getOptionalUserId = async () => {
  try {
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
};
