export const getRandomKey = <T extends {}>(obj: T) => {
	const keys = Object.keys(obj);
	return keys[Math.floor(Math.random() * keys.length)] as keyof T;
};
