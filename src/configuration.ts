import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

export default () => {
  const test = yaml.load(
    readFileSync(join(__dirname, '../config', 'config.yml'), 'utf-8'),
  );
  console.log('test: ', test);
  return test;
};
