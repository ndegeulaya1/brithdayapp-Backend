export const Logout = async (c: any) => {
  return c.json(
    { message: "Logged out successfully" },
    {
      headers: {
        "Set-Cookie":
          "token=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      },
    }
  );
};
