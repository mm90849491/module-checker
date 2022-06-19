import FS from 'fs';

export const loadJSON = (path: FS.PathLike) => {
  const jsonString = FS.readFileSync(path, 'utf8');
  return JSON.parse(jsonString);
};
