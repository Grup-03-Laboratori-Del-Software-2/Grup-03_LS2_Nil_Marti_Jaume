import { createDefaultPreset } from 'ts-jest';

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/src/test/styleMock.ts',
    '\\.(svg|png|jpg|jpeg|gif|webp|avif)$': '<rootDir>/src/test/fileMock.ts',
    '(^.+/Env$|^Env$)': '<rootDir>/src/test/Env.mock.ts',
  },
  // ✅ Solo medimos los ficheros con tests ahora mismo
  collectCoverageFrom: [
    'src/components/VideoGrid.tsx',
    'src/pages/Home.tsx',
    'src/utils/useAllVideos.ts',
    // excluye lo obvio
    '!src/**/__tests__/**',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  coverageThreshold: {
    global: {
      branches: 51,
      functions: 51,
      lines: 51,
      statements: 51,
    },
  },
};
