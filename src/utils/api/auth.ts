export const isAuthenticated = () => {
  const token = localStorage.getItem("UserLoginTokenApt");
  return !!token;
};
