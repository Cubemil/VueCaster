import MCR from 'monocart-coverage-reports';
import coverageOptions from './mcr.config';
import { type FullConfig } from '@playwright/test';
import { startup } from './httpServer';

async function globalSetup(config: FullConfig) {
    await startup();
    const mcr = MCR(coverageOptions);
    await mcr.cleanCache();
}

export default globalSetup;