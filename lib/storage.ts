export type StorageBucket =
  | "avatars"
  | "diario-fotos"
  | "notas-fiscais"
  | "comprovantes";

export function buildStoragePath(
  userId: string,
  obraId: string,
  entryId: string,
  filename: string
): string {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${userId}/${obraId}/${entryId}/${safeName}`;
}

export function buildAvatarPath(userId: string, filename: string): string {
  const ext = filename.split(".").pop() ?? "jpg";
  return `${userId}/avatar.${ext}`;
}
