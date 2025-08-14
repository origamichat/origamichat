export const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/;

export function isValidULID(ulid: string): boolean {
  return ULID_REGEX.test(ulid);
}
