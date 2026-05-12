import { validateEmail, validatePassword } from "../validators";

describe("validateEmail", () => {
  it("should return error if email is empty", () => {
    expect(validateEmail("")).toBe("L’email est requis.");
  });

  it("should return error if email is too short", () => {
    expect(validateEmail("a@")).toBe("L’email est trop court.");
  });

  it("should return error if email format is invalid", () => {
    expect(validateEmail("invalid-email")).toBe("Format d’email invalide.");
  });

  it("should return null for valid email", () => {
    expect(validateEmail("test@example.com")).toBeNull();
  });
});

describe("validatePassword", () => {
  it("should return error if password is empty", () => {
    expect(validatePassword("")).toBe("Le mot de passe est requis.");
  });

  it("should return error if password is too short", () => {
    expect(validatePassword("Ab1!")).toBe(
      "Le mot de passe doit contenir au moins 8 caractères."
    );
  });

  it("should require at least one lowercase letter", () => {
    expect(validatePassword("PASSWORD1!")).toBe(
      "Le mot de passe doit contenir au moins une lettre minuscule."
    );
  });

  it("should require at least one uppercase letter", () => {
    expect(validatePassword("password1!")).toBe(
      "Le mot de passe doit contenir au moins une lettre majuscule."
    );
  });

  it("should require at least one number", () => {
    expect(validatePassword("Password!")).toBe(
      "Le mot de passe doit contenir au moins un chiffre."
    );
  });

  it("should require at least one special character", () => {
    expect(validatePassword("Password1")).toBe(
      "Le mot de passe doit contenir au moins un caractère spécial."
    );
  });

  it("should return null for valid password", () => {
    expect(validatePassword("Password1!")).toBeNull();
  });
});