import * as yup from "yup";

export const yupValidate = async (schema, value) => {
  try {
    const data = await schema.validate(value);
    return { values: data };
  } catch (error) {
    if (error) {
      return { error: error.message };
    } else {
      return { error: error.message };
    }
  }
};

export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!])[A-Za-z\d@#!]{8,}$/;

yup.addMethod(yup.string, "email", function validateEmail(message) {
  return this.matches(emailRegex, {
    message,
    name: "email",
    excludeEmptyString: true,
  });
});

const nameAndEmailValidation = {
  email: yup.string().email("Invalid email").required("Email is missing"),
  password: yup
    .string()
    .required("Password is missing")
    .min(8, "Password should be at least 8 chars long!")
    .matches(passwordRegex, "Password is too simple."),
};

export const newUserSchema = yup.object({
  username: yup.string().required("Username is missing"),
  ...nameAndEmailValidation,
});

export const signInSchema = yup.object({
  ...nameAndEmailValidation,
});
