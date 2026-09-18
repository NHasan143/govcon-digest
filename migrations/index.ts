import * as migration_20260911_204751_initial from './20260911_204751_initial';
import * as migration_20260918_200635_remove_seo_keywords from './20260918_200635_remove_seo_keywords';

export const migrations = [
  {
    up: migration_20260911_204751_initial.up,
    down: migration_20260911_204751_initial.down,
    name: '20260911_204751_initial',
  },
  {
    up: migration_20260918_200635_remove_seo_keywords.up,
    down: migration_20260918_200635_remove_seo_keywords.down,
    name: '20260918_200635_remove_seo_keywords'
  },
];
