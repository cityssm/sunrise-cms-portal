import path from 'node:path';
const _dirname = '.';
export const serviceConfig = {
    name: 'Sunrise CMS Portal',
    description: 'A portal for funeral homes and the general public to interface with the Sunrise CMS (Cemetery Management System).',
    script: path.join(_dirname, 'index.js')
};
