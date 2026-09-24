export function getFormattedDate(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function slice(obj: Record<string, any>, count: number): Record<string, any> {
    const result: Record<string, any> = {};
    const keys = Object.keys(obj);

    // Decide start and end indices based on whether count is positive or negative
    const start = count >= 0 ? 0 : Math.max(0, keys.length + count);
    const end = count >= 0 ? Math.min(keys.length, count) : keys.length;

    for (let i = start; i < end; i++) {
        const key = keys[i];
        result[key] = obj[key];
    }

    return result;
}