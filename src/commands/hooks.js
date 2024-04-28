import fs from 'fs';
import path from 'path';
function hooks(generate) {
    generate
      .command('hook <name>')
      .alias('h')
      .description('Generate a new custom hook')
      .action((name) => {
        generateHook(name);
      });
  }
  
function generateHook(name) {
    name = name.toLowerCase(); // dir name in lowercase
    // const hookDirectory = path.join(process.cwd(), 'hooks');
    // if (!fs.existsSync(hookDirectory)) {
    //   fs.mkdirSync(hookDirectory);
    // }
  
    const hookTemplate = `import { useEffect, useState } from 'react';
  
  function use${capitalize(name)}() {
    // Hook logic here
  }
  
  export default use${capitalize(name)};
  `;
  
    fs.writeFileSync(path.join(hookDirectory, `${name}.js`), hookTemplate);
    console.log(`Custom hook  ${chalk.bold.green(name)} has been created.`);
  }
  
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
export default hooks;
  