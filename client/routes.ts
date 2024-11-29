export const EMAIL_VERIFY_ROUTE: string = "/verify-email";
export const COMPLETE_PROFILE_ROUTE: string = "/last-step";

export const apiAuthPrefix: string = "/api";
export const DEFAULT_LOGIN_REDIRECT: string = "/profile";
export const DEFAULT_LOGOUT_REDIRECT: string = "/signin";

export const authRoutes: RegExp = /^\/(signin|signup|recover)$/;
export const middleRoutes: RegExp = /^\/(verify-email|last-step)$/;

const userRoutes: RegExp = /^\/(profile|security|sessions)$/;
const postsRoutes: RegExp = /^\/manager\/posts(\/create|.+\/edit)?$/;
const productsRoutes: RegExp = /^\/manager\/products(\/create|.+\/edit)?$/;
const usersRoutes: RegExp = /^\/manager\/users(\/create|.+\/edit)?$/;

export const privateRegexRoutes = [
  userRoutes,
  postsRoutes,
  productsRoutes,
  usersRoutes,
  middleRoutes,
];

// export const privateRegExpRoutes = [
//   BaseRoutes,
//   PostRoutes,
//   ProductRoutes,
//   UsersRoutes,
//   /^\/manager$/,
// ];

// export const roleAccessRoutes: Record<User["role"], RegExp[]> = {
//   CUSTOMER: [BaseRoutes],
//   BUSINESS_PARTNER: [BaseRoutes, PostRoutes],
//   ADMIN: [BaseRoutes, PostRoutes, ProductRoutes],
//   SUPER_ADMIN: privateRegExpRoutes,
// };