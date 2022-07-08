const validationSession = require("../util/validation-session");
const validation = require("../util/validation");
const User = require("../models/user");

function getSignup(req, res) {
  const sessionErrorData = validationSession.getSessionErrorData(req, {
    email: "",
    confirmEmail: "",
    password: "",
  });

  res.render("signup", {
    inputData: sessionErrorData,
  });
}
function getLogin(req, res) {
  const sessionErrorData = validationSession.getSessionErrorData(req, {
    email: "",
    password: "",
  });
  res.render("login", {
    inputData: sessionErrorData,
  });
}

async function signup(req, res) {
  const userData = req.body;
  const enteredEmail = userData.email; // userData['email']
  const enteredConfirmEmail = userData["confirm-email"];
  const enteredPassword = userData.password;

  if (
    !validation.userCredentialsAreValid(
      enteredEmail,
      enteredConfirmEmail,
      enteredPassword
    )
  ) {
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        email: enteredEmail,
        confirmEmail: enteredConfirmEmail,
        password: enteredPassword,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const newUser = new User(enteredEmail, enteredPassword);
  const userExistsAlready = await newUser.existAlready();

  if (userExistsAlready) {
    validationSession.flashErrorsToSession(
      req,
      {
        message: "User exists already!",
        email: enteredEmail,
        confirmEmail: enteredConfirmEmail,
        password: enteredPassword,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }
  await newUser.signup();

  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup
};
