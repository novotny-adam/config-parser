import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';

import * as _ from 'lodash';

const regexStartNest = /.+\{$/;
const regexStartArrayNest = /.+\[$/;
const regexKeyValue = /=+/;
const regexNumber = /^\d+$/;

export class Configuration {
  private path: string;
  private object: any;
  private directory: string;

  constructor(filename: string) {
    this.path = resolve(filename);
    const data = readFileSync(this.path, 'utf8');

    this.directory = dirname(this.path);

    // Holds the configuration values
    this.object = this.parseConfig(data);
  }

  public get(key: string): any {
    return _.get(this.object, key);
  }

  private parseConfig(data: string) {
    const lines = this.getFilteredLines(data);
    const procesedLinesArray = this.processLines(lines);
    return this.createJson(procesedLinesArray);
  }
  private getFilteredLines(data: string): Array<string> {
    let lines = data.split('\n');
    lines.unshift('{');
    // remove whitespaces from the lines
    lines = lines.map((line) => line.trim());
    // remove empty lines
    lines = lines.filter((line) => line !== '');
    // remove comment lines
    lines = lines.filter((line) => !line.match(/^#/));
    // remove comments from rows with values
    lines = lines.map((line) => line.split('#')[0]);
    lines.push('}');
    return lines;
  }
  private processLines(lines: Array<string>): Array<string> {
    const newJson = [];
    for (let i = 0; i < lines.length; i++) {
      let currentLine = lines[i];
      let previousLine = lines[i - 1];
      if (regexStartNest.test(currentLine)) {
        if (previousLine === '}' || previousLine === '[' || regexKeyValue.test(previousLine)) {
          newJson.push(currentLine.replace(/^/, ',"').replace(' {', '":{'));
        } else {
          newJson.push(currentLine.replace(/^/, '"').replace(' {', '":{'));
        }
      } else if (regexKeyValue.test(currentLine)) {
        let object = this.getKeyValue(currentLine);
        if (previousLine === '}' || previousLine === ']' || regexKeyValue.test(previousLine)) {
          newJson.push(`,"${object.key}":${this.formatValue(object.value)}`);
        } else {
          newJson.push(`"${object.key}":${this.formatValue(object.value)}`);
        }
      } else if (regexStartArrayNest.test(currentLine)) {
        newJson.push(currentLine.replace(/^/, '"').replace('=[', '":['));
      } else if (currentLine === '{' && previousLine === '}') {
        newJson.push(`,${currentLine}`);
      } else {
        newJson.push(currentLine);
      }
    }
    return newJson;
  }
  private createJson(formatedLines: Array<string>): Record<string, any> {
    return JSON.parse(formatedLines.join(''));
  }
  private getKeyValue(line: string): Record<string, any> {
    return {
      key: line.split('=')[0].trim(),
      value: line.split('=')[1].trim(),
    };
  }
  private formatValue(value: string): string {
    if (!(value.startsWith('"') || value.startsWith('['))) {
      if (!(regexNumber.test(value) || value === 'true' || value === 'false' || value === 'null')) {
        return `"${value}"`;
      }
    }
    return value;
  }
}
