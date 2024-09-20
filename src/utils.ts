export function convertBigIntToFloat(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(item => convertBigIntToFloat(item));
    } else if (obj !== null && typeof obj === 'object') {
        const newObj: Record<string, any> = {};
        for (const key in obj) {
            if (typeof obj[key] === 'bigint') {
                newObj[key] = Number(obj[key]); // Convert bigint to float
            } else if (obj[key] instanceof Date) {
                newObj[key] = obj[key]; // Preserve Date objects
            } else {
                newObj[key] = convertBigIntToFloat(obj[key]); // Recursively process other properties
            }
        }
        return newObj;
    }
    return obj; // Return the value as is if it's not an object or array
}
