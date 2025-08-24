export function prepareMessageForInsert(bodyMd: string) {
  const normalized = bodyMd.normalize("NFC");

  return { bodyMd: normalized };
}
