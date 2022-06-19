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
    console.warn(
      '\x1b[33m' +
        'WARNING: following packages might be out of date' +
        '\x1b[0m'
    );
    mismatchList.forEach((mismatch) => {
      console.log(
        mismatch.module +
          ': \t' +
          '\x1b[31m' +
          mismatch.current +
          '\x1b[0m' +
          ' => ' +
          mismatch.target
      );
    });
  }
} catch (error) {
  console.log(error);
  console.log('Have you run ' + '\x1b[34m' + 'npm install' + '\x1b[0m' + '?');
  process.exit(1);
}
