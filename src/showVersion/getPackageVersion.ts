import * as fs from 'fs';
import * as path from 'path';

const getPackageVersion = (): string => {
  const packageJsonFilePath = path.resolve(__dirname, '../../package.json');
  const packageJsonFileContent = fs.readFileSync(packageJsonFilePath, 'utf-8');

  const { version } = JSON.parse(packageJsonFileContent);

  return version;
};

export default getPackageVersion;
