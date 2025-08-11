import 'reflect-metadata';
import { AppDataSource } from '../data-source';

type Command = 'run' | 'revert';

async function main() {
  const cmd = (process.argv[2] as Command) || 'run';
  await AppDataSource.initialize();
  try {
    if (cmd === 'run') {
      await AppDataSource.runMigrations();
      console.log('Migrations executed');
    } else if (cmd === 'revert') {
      await AppDataSource.undoLastMigration();
      console.log('Migration reverted');
    } else {
      console.error('Unknown command');
      process.exit(1);
    }
  } finally {
    await AppDataSource.destroy();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


