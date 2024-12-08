import MCR from 'monocart-coverage-reports';
import coverageOptions from './mcr.config';
import { type FullConfig } from '@playwright/test';
import { shutdown } from './httpServer';

async function globalTeardown(config: FullConfig) {
    await shutdown();
    const mcr = MCR(coverageOptions);
    await mcr.generate();
}

export default globalTeardown;