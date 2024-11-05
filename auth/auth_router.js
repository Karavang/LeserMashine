const router = require("../router");
const registration = require("./create");
const login = require("./login");

router.post("registration", registration);
router.post("login", auth, login);
// router.get("logout", logout);
// router.delete("deleteUser", auth, deleteUser);
