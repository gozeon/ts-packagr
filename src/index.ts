import { a } from './a';

/**
 * @Note must have a default, format umd、iife can return default to bind name
 */
export default class Goze {
  static say(n: string) {
    a(n);
  }
}
