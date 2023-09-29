import { readFileSync } from 'fs';
import { resolve } from 'path';

import * as _ from 'lodash';

const regexStartNest = /.+\{$/;
const regexStartArrayNest = /.+\[$/;
const regexKeyValue = / ?= ?/;
const regexNumber = /^\d+$/;
const regexEnvValue = /":"\$\{/g;

export class Configuration {
  private path: string;
  private object: any;

  constructor(filename: string) {
    this.path = resolve(filename);
    const data = readFileSync(this.path, 'utf8');
    this.object = this.parseConfig(data);
  }

  public get(key: string, isEnvironmental: boolean = false): any {
    const envKey = this.appendEnvToLastSegment(key);
    const envResult = _.get(this.object, envKey);
    const nonEnvResult = _.get(this.object, key);

    if ((isEnvironmental && envResult) || (!isEnvironmental && !nonEnvResult && envResult)) {
      return envResult;
    } else if (!isEnvironmental && nonEnvResult) {
      return nonEnvResult;
    } else if (isEnvironmental && !envResult && nonEnvResult) {
      throw new Error(`Path '${key}' exists without environment duplicity. Remove the 'env' parameter.`);
    } else {
      throw new Error(`No value exists for path: '${key}'.`);
    }
  }

  public has(key: string, isEnvironmental: boolean = false): boolean {
    const envKey = this.appendEnvToLastSegment(key);
    const hasEnvResult = _.has(this.object, envKey);
    const hasNonEnvResult = _.has(this.object, key);

    if ((isEnvironmental && hasEnvResult) || (!isEnvironmental && !hasNonEnvResult && hasEnvResult)) {
      return true;
    } else if (!isEnvironmental && hasNonEnvResult) {
      return true;
    } else if (isEnvironmental && !hasEnvResult && hasNonEnvResult) {
      throw new Error(`Path '${key}' exists without environment duplicity. Remove the 'env' parameter.`);
    } else {
      return false;
    }
  }

  private parseConfig(data: string) {
    const lines = this.getFilteredLines(data);
    const procesedLinesArray = this.processLines(lines);
    const mergedLines = this.createStringFormatForJson(procesedLinesArray);
    const replacedEnvValues = this.appendEnvToKey(mergedLines);
    return JSON.parse(replacedEnvValues);
  }

  private getFilteredLines(data: string): string[] {
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

  private processLines(lines: string[]): string[] {
    const procesedLines = [];
    for (let i = 0; i < lines.length; i++) {
      const currentLine = lines[i];
      const previousLine = lines[i - 1];
      if (regexStartNest.test(currentLine)) {
        if (previousLine === '}' || previousLine === '[' || regexKeyValue.test(previousLine)) {
          procesedLines.push(currentLine.replace(/^/, ',"').replace(' {', '":{'));
        } else {
          procesedLines.push(currentLine.replace(/^/, '"').replace(' {', '":{'));
        }
      } else if (regexKeyValue.test(currentLine)) {
        const object = this.getKeyValue(currentLine);
        if (previousLine === '}' || previousLine === ']' || regexKeyValue.test(previousLine)) {
          procesedLines.push(`,"${object.key}":${this.formatValue(object.value)}`);
        } else {
          procesedLines.push(`"${object.key}":${this.formatValue(object.value)}`);
        }
      } else if (regexStartArrayNest.test(currentLine)) {
        procesedLines.push(currentLine.replace(/^/, '"').replace('=[', '":['));
      } else if (currentLine === '{' && previousLine === '}') {
        procesedLines.push(`,${currentLine}`);
      } else {
        procesedLines.push(currentLine);
      }
    }
    return procesedLines;
  }

  private createStringFormatForJson(formatedLines: string[]): string {
    return formatedLines.join('');
  }

  private getKeyValue(line: string): Record<string, any> {
    const parts = line.split('=');
    return {
      key: parts[0].trim(),
      value: parts.slice(1).join('=').trim(),
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

  private appendEnvToLastSegment(input: string): string {
    const parts: string[] = input.split('.');
    parts[parts.length - 1] = `${parts[parts.length - 1]}_env`;
    return parts.join('.');
  }

  private appendEnvToKey(input: string): string {
    const replacement = '_env":"${';
    return input.replace(regexEnvValue, replacement);
  }
}
