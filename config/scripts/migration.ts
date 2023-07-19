import { MIGRATION_SRC } from './../constants/index';
import { exec } from 'child_process';

function run() {
  const command = `npm run typeorm migration:generate ./${MIGRATION_SRC}/${process.argv[2]}`;
  exec(command, (error, stdout, stderr) => {
    if (error !== null) {
      console.error(stderr);
    }
    console.log(stdout);
  });
}
run();
