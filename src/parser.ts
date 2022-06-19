export const parsePackage = (raw: {
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
}) => {
  const { dependencies, devDependencies } = raw;
  return { ...dependencies, ...devDependencies };
};

export const parsePackageLock = (raw: {
  packages: {
    '': {
      devDependencies?: Record<string, string>;
      dependencies?: Record<string, string>;
    };
  };
}) => {
  const { dependencies, devDependencies } = raw.packages[''];
  return { ...dependencies, ...devDependencies };
};
