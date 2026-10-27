import * as migration_20260911_204751_initial from './20260911_204751_initial';
import * as migration_20260918_200635_remove_seo_keywords from './20260918_200635_remove_seo_keywords';
import * as migration_20261027_182719_payload_3_92_upgrade from './20261027_182719_payload_3_92_upgrade';

export const migrations = [
  {
    up: migration_20260911_204751_initial.up,
    down: migration_20260911_204751_initial.down,
    name: '20260911_204751_initial',
  },
  {
    up: migration_20260918_200635_remove_seo_keywords.up,
    down: migration_20260918_200635_remove_seo_keywords.down,
    name: '20260918_200635_remove_seo_keywords',
  },
  {
    up: migration_20261027_182719_payload_3_92_upgrade.up,
    down: migration_20261027_182719_payload_3_92_upgrade.down,
    name: '20261027_182719_payload_3_92_upgrade'
  },
];
