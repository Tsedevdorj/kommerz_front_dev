// jwt token client side check
export function isValidJwt(jwt) {
  if (!jwt || jwt.split(".").length < 3) {
    return false;
  }
  const data = JSON.parse(atob(jwt.split(".")[1]));
  const exp = new Date(data.exp * 1000); // JS deals with dates in milliseconds since epoch
  const now = new Date();
  console.log(exp)
  console.log(now)
  return now < exp;
}

// global administrator check for getters & router
export function isAdmin(data) {
  if (data == 2 || data == 3) {
    return true;
  } else return false;
}

// global administrator check for getters & router
export function isSuperAdmin(data) {
  if (data == 3) {
    return true;
  } else return false;
}
