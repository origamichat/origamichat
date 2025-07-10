export function enumToPgEnum<T extends Record<string, string | number>>(
	myEnum: T
): [T[keyof T], ...T[keyof T][]] {
	const values = Object.values(myEnum);
	return [values[0], ...values.slice(1)] as [T[keyof T], ...T[keyof T][]];
}

export function slugify(text: string) {
	return text
		.toLowerCase()
		.replace(/ /g, "-")
		.replace(/[^\w\s-]/g, "");
}
