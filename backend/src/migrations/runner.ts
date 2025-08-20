import 'reflect-metadata';
import { connectionSource } from '../config/typeorm';
import { Migration } from 'typeorm';

type Command = 'run' | 'revert';

async function main() {
  const cmd = (process.argv[2] as Command) || 'run';
  await connectionSource.initialize();
  try {
    if (cmd === 'run') {
      const migrations = await connectionSource.runMigrations();
      console.log(
        `Migrations executed: ${migrations.map((m) => m.name).join(', ')}`,
      );
    } else if (cmd === 'revert') {
      await connectionSource.undoLastMigration();
      console.log(
        `Migration reverted. now run "npm run migration:show" to see the current migrations`,
      );
    } else {
      console.error('Unknown command');
      process.exit(1);
    }
  } finally {
    await connectionSource.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
