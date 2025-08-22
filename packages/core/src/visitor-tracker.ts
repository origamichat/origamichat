/**
 * Visitor tracking utilities for managing visitor IDs in localStorage
 */

import { isValidULID } from "./utils";

const STORAGE_KEY_PREFIX = "cossistant_visitor";

/**
 * Get the localStorage key for a specific website
 */
function getStorageKey(websiteId: string): string {
  return `${STORAGE_KEY_PREFIX}_${websiteId}`;
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__cossistant_test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get visitor ID from localStorage for a specific website
 */
export function getVisitorId(websiteId: string): string | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const data = localStorage.getItem(getStorageKey(websiteId));
    if (!data) {
      return null;
    }

    const parsed = JSON.parse(data);
    // Validate that the visitor ID is a valid ULID (26 characters)
    if (parsed.visitorId && isValidULID(parsed.visitorId)) {
      return parsed.visitorId;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Set visitor ID in localStorage for a specific website
 */
export function setVisitorId(websiteId: string, visitorId: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const data = {
      visitorId,
      timestamp: Date.now(),
      websiteId,
    };
    const key = getStorageKey(websiteId);
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Silently fail - visitor tracking is not critical
  }
}

/**
 * Clear visitor ID for a specific website
 */
export function clearVisitorId(websiteId: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(getStorageKey(websiteId));
  } catch {
    // Silently fail - visitor tracking is not critical
  }
}

/**
 * Clear all visitor IDs
 */
export function clearAllVisitorIds(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith(STORAGE_KEY_PREFIX)
    );
    for (const key of keys) {
      localStorage.removeItem(key);
    }
  } catch {
    // Silently fail - visitor tracking is not critical
  }
}

/**
 * Get any existing visitor ID from localStorage by matching the public key
 * This is useful when we don't yet know the website ID but need to check for existing visitors
 */
export function getExistingVisitorId(
  publicKey: string
): { websiteId: string; visitorId: string } | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    // Find all visitor keys in localStorage
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith(STORAGE_KEY_PREFIX)
    );

    // Check each one to see if we have a valid visitor ID
    for (const key of keys) {
      const data = localStorage.getItem(key);
      if (!data) {
        continue;
      }

      try {
        const parsed = JSON.parse(data);
        // Validate that the visitor ID is a valid ULID
        if (
          parsed.visitorId &&
          isValidULID(parsed.visitorId) &&
          parsed.websiteId
        ) {
          // We found a valid visitor ID - return it
          // Note: In a multi-website scenario, you might want to match by public key
          // For now, we'll return the first valid one found
          return {
            websiteId: parsed.websiteId,
            visitorId: parsed.visitorId,
          };
        }
      } catch {}
    }

    return null;
  } catch {
    return null;
  }
}
