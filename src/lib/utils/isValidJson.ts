export function isValidJson(input: string) {
	try {
		const parsed = JSON.parse(input);
		return parsed;
	} catch {
		return false;
	}
}
