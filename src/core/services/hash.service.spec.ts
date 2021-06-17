import { HashService } from './hash.service';

describe('HashService', () => {
  const service = new HashService();

  it('should hash a plain string', async () => {
    expect(await service.hash('plain')).toEqual(expect.stringContaining('$argon2id$'));
  });

  it('should verify a hashed string', async () => {
    expect(
      await service.verify(
        '$argon2id$v=19$m=15360,t=2,p=1$xQwYKuRb7ixz9xCLGY7uxw$4cEhZaDIBhXFBN/sZL15SgRA9vqYd8119NiC3L9e3n4',
        'plain',
      ),
    ).toBe(true);
  });
});
