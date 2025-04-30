interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
}

export const loginFields: FormField[] = [
  {
    name: "loginOrEmail",
    label: "Email",
    type: "text",
    placeholder: "Enter your email",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter password",
    autoComplete: "current-password",
  },
];

export const signupFields: FormField[] = [
  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "Enter your email",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Create a password",
    autoComplete: "new-password",
  },
];
