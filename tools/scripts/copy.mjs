import { copyFileSync } from 'fs';
const [, , from, to] = process.argv;
copyFileSync(from, to);
