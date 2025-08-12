import 'reflect-metadata';
import { connectionSource } from '../config/typeorm';

type Command = 'run' | 'revert';

async function main() {
  const cmd = (process.argv[2] as Command) || 'run';
  await connectionSource.initialize();
  try {
    if (cmd === 'run') {
      await connectionSource.runMigrations();
      console.log('Migrations executed');
    } else if (cmd === 'revert') {
      await connectionSource.undoLastMigration();
      console.log('Migration reverted');
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
