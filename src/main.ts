#!/usr/bin/env node

import { argv } from 'node:process';
import { loadJSON } from './loader';
import { parsePackage, parsePackageLock } from './parser';

const [_node, _script, path1, path2] = argv;
const pathPackageJSON = path1 || 'package.json';
const pathLockJSON = path2 || 'package-lock.json';

try {
  const packageObj = loadJSON(pathPackageJSON);
  const targetModules = parsePackage(packageObj);

  const lockObj = loadJSON(pathLockJSON);
  const currentModules = parsePackageLock(lockObj);
  const mismatchList: {
    module: string;
    target: string;
    current: string;
  }[] = [];
  Object.entries(targetModules).forEach(([module, targetVersion]) => {
    if (module in currentModules) {
      const currentVersion = currentModules[module];
      if (currentVersion !== targetVersion) {
        mismatchList.push({
          module,
          target: targetVersion,
          current: currentVersion,
        });
      }
    } else {
      mismatchList.push({
        module,
        target: targetVersion,
        current: 'missing',
      });
    }
  });
  if (mismatchList.length > 0) {
    console.warn('WARNING: following packages might be out of date');
    mismatchList.forEach((mismatch) => {
      console.log(
        mismatch.module + ': \t' + mismatch.current + ' => ' + mismatch.target
      );
    });
  }
} catch (error) {
  console.log(error);
  console.log('Have you run npm install?');
  process.exit(1);
}
