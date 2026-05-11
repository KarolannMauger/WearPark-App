export function validateEmail(email: string): string | null {
  if (!email) return "L’email est requis.";
  if (email.length < 4) return "L’email est trop court.";

  const regex =
    /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

  if (!regex.test(email)) return "Format d’email invalide.";

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Le mot de passe est requis.";
  if (password.length < 8)
    return "Le mot de passe doit contenir au moins 8 caractères.";
  if (!/[a-z]/.test(password))
    return "Le mot de passe doit contenir au moins une lettre minuscule.";
  if (!/[A-Z]/.test(password))
    return "Le mot de passe doit contenir au moins une lettre majuscule.";
  if (!/[0-9]/.test(password))
    return "Le mot de passe doit contenir au moins un chiffre.";
  if (!/[!@#$%?&*()\-\+="':;\[\]{}]/.test(password))
    return "Le mot de passe doit contenir au moins un caractère spécial.";

  return null;
}