import {
  changeEmail,
  changePassword,
  createMFA,
  currentUser,
  deleteSessionById,
  disableMFA,
  disactivate,
  enableMFA,
  getSessionOfUser,
  initPassword,
  replaceEmail,
  resendVerifyEmail,
  signOut,
  updateEmailByOTP,
  updateProfile,
} from "@/controllers/user";
import {
  rateLimitChangeEmail,
  rateLimitEmail,
  rateLimitUserId,
} from "@/middlewares/rateLimit";
import { authMiddleware } from "@/middlewares/requiredAuth";
import validateResource from "@/middlewares/validateResource";
import {
  changePasswordSchema,
  enableMFASchema,
  initPasswordSchema,
  changeEmailSchema,
  setupMFASchema,
  updateUserProfileSchema,
  updateEmailSchema,
  replaceEmailSchema,
} from "@/schemas/user";
import express, { type Router } from "express";

const router: Router = express.Router();
function userRouter(): Router {
  router.get(
    "/users/me",
    authMiddleware({ emailVerified: false }),
    currentUser
  );
  router.get("/users/sessions", authMiddleware(), getSessionOfUser);

  router.get(
    "/users/verify-email",
    rateLimitUserId,
    authMiddleware({ emailVerified: false }),
    resendVerifyEmail
  );

  router.post(
    "/users/change-email",
    authMiddleware(),
    validateResource(changeEmailSchema),
    rateLimitChangeEmail,
    changeEmail
  );

  router.post(
    "/users/mfa",
    authMiddleware(),
    validateResource(setupMFASchema),
    createMFA
  );

  router.put(
    "/users/mfa",
    authMiddleware(),
    validateResource(enableMFASchema),
    enableMFA
  );

  router.put(
    "/users",
    authMiddleware(),
    validateResource(updateUserProfileSchema),
    updateProfile
  );

  router.patch(
    "/users/password/change",
    authMiddleware(),
    validateResource(changePasswordSchema),
    changePassword
  );

  router.patch(
    "/users/password/init",
    authMiddleware(),
    validateResource(initPasswordSchema),
    initPassword
  );

  router.patch(
    "/users/email",
    authMiddleware(),
    validateResource(updateEmailSchema),
    updateEmailByOTP
  );

  router.patch(
    "/users/email/replace",
    authMiddleware({ emailVerified: false }),
    validateResource(replaceEmailSchema),
    replaceEmail
  );

  router.delete("/users/mfa", authMiddleware(), disableMFA);
  router.delete("/users/signout", signOut);
  router.delete(
    "/users/disactivate",
    authMiddleware({ emailVerified: false }),
    disactivate
  );
  router.delete(
    "/users/sessions/:sessionId",
    authMiddleware(),
    deleteSessionById
  );

  return router;
}

export default userRouter();
