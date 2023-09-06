import { stringAsync } from '../../string/stringAsync';
import { string } from '../../string';

import { objectAsync } from './objectAsync';

objectAsync<{ name: string; h: number; k: string }>({
  name: stringAsync(async () => undefined),
  h: async () => undefined,
  k: string(),
});
