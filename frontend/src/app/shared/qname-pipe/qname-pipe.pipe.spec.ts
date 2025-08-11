import { QNamePipe } from './qname-pipe.pipe';

describe('RolePipePipe', () => {
  it('create an instance', () => {
    const pipe = new QNamePipe();
    expect(pipe).toBeTruthy();
  });
});
