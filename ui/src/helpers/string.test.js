import {expect} from 'chai';
import { uppercaseFirst } from './string';

// tslint:disable:no-unused-expression
describe('uppercaseFirst', () => {
  it('Works with normal string', () => {
    expect(uppercaseFirst('birds')).to.eq('Birds');
  });

  it('Works with empty string', () => {
    expect(uppercaseFirst('')).to.eq('');
  });
});
