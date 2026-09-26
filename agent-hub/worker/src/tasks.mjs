export const TASK_STATES = Object.freeze([
  "queued",
  "claimed",
  "running",
  "completed",
  "failed",
  "cancelled",
]);

export const LEASE_MS = 60_000;
export const MAX_ATTEMPTS = 3;
export const MAX_ACTIVE_TASKS = 500;
export const CREATE_LIMIT = 10;
export const CREATE_WINDOW_MS = 10 * 60 * 1_000;
export const TERMINAL_RETENTION_MS = 30 * 24 * 60 * 60 * 1_000;

export function canTransition(from, to) {
  return (
    (from === "queued" && to === "claimed") ||
    (from === "claimed" && (to === "running" || to === "queued" || to === "failed")) ||
    (from === "running" && (to === "completed" || to === "failed" || to === "queued")) ||
    ((from === "queued" || from === "claimed" || from === "running") && to === "cancelled")
  );
}

export function newTask(input, { id, owner, now }) {
  return {
    id,
    projectId: input.projectId,
    owner,
    command: input.command,
    transcript: input.transcript,
    images: input.images,
    metadata: input.metadata,
    state: "queued",
    createdAt: now,
    updatedAt: now,
    attempt: 0,
  };
}

export function validateCreateBody(value, allowedProjects) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "invalid_body";
  if (typeof value.projectId !== "string" || !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(value.projectId)) {
    return "invalid_project_id";
  }
  if (!allowedProjects.includes(value.projectId)) return "project_forbidden";
  if (typeof value.command !== "string" || value.command.trim().length < 1 || value.command.length > 8_000) {
    return "invalid_command";
  }
  if (value.transcript !== undefined && (typeof value.transcript !== "string" || value.transcript.length > 8_000)) {
    return "invalid_transcript";
  }
  if (value.images !== undefined) {
    if (!Array.isArray(value.images) || value.images.length > 5) return "invalid_images";
    for (const image of value.images) {
      if (!image || typeof image !== "object" || Array.isArray(image)) return "invalid_image_reference";
      if (Object.keys(image).some((key) => !["url", "contentType"].includes(key))) return "invalid_image_reference";
      if (typeof image.url !== "string" || image.url.length > 2_048) {
        return "invalid_image_reference";
      }
      try {
        const reference = new URL(image.url);
        if (reference.protocol !== "https:" || reference.username || reference.password) return "invalid_image_reference";
      } catch { return "invalid_image_reference"; }
      if (image.contentType !== undefined && (typeof image.contentType !== "string" || !/^image\/[a-z0-9.+-]{1,40}$/i.test(image.contentType))) {
        return "invalid_image_reference";
      }
    }
  }
  if (value.metadata !== undefined && (!value.metadata || typeof value.metadata !== "object" || Array.isArray(value.metadata))) {
    return "invalid_metadata";
  }
  if (JSON.stringify(value.metadata ?? {}).length > 2_000) return "metadata_too_large";
  return undefined;
}
