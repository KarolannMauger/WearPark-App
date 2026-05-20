/**
 * Transforme une Date ou string en ISO UTC pour le backend
 * Exemple : 2000-01-01T00:00:00Z
 */
export const formatDateForAPI = (date?: Date | string): string | undefined => {
  if (!date) return undefined;
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return undefined;

  // ISO string sans millisecondes
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
};

/**
 * Transforme une Date ou string en format lisible pour l'UI
 * Exemple : 01/01/2000
 */
export const formatDateForApp = (date?: Date | string): string => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString() : 'N/A';

/**
 * Formate la date de génération d'un rapport pour l'affichage UI.
 * Exemple : "03 avril 2026"
 */
export const formatReportDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
};