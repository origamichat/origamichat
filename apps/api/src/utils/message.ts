import type {
	MentionEntityType,
	MentionsIndexItem,
} from "@cossistant/types/enums";

function idxKey(x: { type: string; id: string }) {
	return `${x.type}:${x.id}`;
}

export function diffMentions(
	oldI: MentionsIndexItem[],
	newI: MentionsIndexItem[]
) {
	const oldSet = new Set(oldI.map(idxKey));
	const newSet = new Set(newI.map(idxKey));
	const added = [...newSet].filter((k) => !oldSet.has(k));
	const removed = [...oldSet].filter((k) => !newSet.has(k));

	return { added, removed };
}

const TYPE_RE = "(user|agent|tool)";
const ID_RE = "([a-zA-Z0-9_.:\\-]{1,64})";
const LABEL_RE = "([^\\]]{1,64})";
const MENTION_LINK_RE = new RegExp(
	String.raw`\[${LABEL_RE}\]\(mention:${TYPE_RE}:${ID_RE}\)`,
	"g"
);

export function parseMentionsWithPositions(bodyMd: string) {
	const out: Array<{
		label: string;
		type: MentionEntityType;
		id: string;
	}> = [];
	let m: RegExpExecArray | null;
	// biome-ignore lint/suspicious/noAssignInExpressions: ok here
	while ((m = MENTION_LINK_RE.exec(bodyMd))) {
		const [_, label, type, id] = m;
		out.push({
			label,
			type: type as MentionEntityType,
			id,
		});
	}
	return out;
}

export function buildMentionsIndex(bodyMd: string): MentionsIndexItem[] {
	const positions = parseMentionsWithPositions(bodyMd);
	const map = new Map<string, MentionsIndexItem>();
	for (const p of positions) {
		const key = `${p.type}:${p.id}`;
		const prev = map.get(key);
		if (prev) {
			prev.count += 1;
		} else {
			map.set(key, { type: p.type, id: p.id, count: 1 });
		}
	}
	return [...map.values()];
}

export function prepareMessageForInsert(bodyMd: string) {
	const normalized = bodyMd.normalize("NFC");
	const mentionsIndex = buildMentionsIndex(normalized);

	return { bodyMd: normalized, mentionsIndex };
}

/** Helper for inserting a mention into the editor */
export function mentionToken(e: {
	type: MentionEntityType;
	id: string;
	label: string;
}) {
	const safeLabel = e.label.replace(/[[\]\n]/g, " ").slice(0, 64);
	return `[${safeLabel}](mention:${e.type}:${e.id})`;
}
