import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
function component(generate) {
    generate
      .command('component <name>')
      .alias('c')
      .description('Generate a new React component')
      .option('-f, --functional', 'Generate a functional component', false)
      .action((name, options) => {
        generateComponent(name, options);
      });
  }
  
  function generateComponent(name, options) {
    name = name.toLowerCase(); // dir name in lowercase
    const componentDirectory = path.join(process.cwd(), name);
    if (!fs.existsSync(componentDirectory)) {
      fs.mkdirSync(componentDirectory);
    }
    name = name[0].toUpperCase()+name.slice(1); // component name in capitalized
    const componentTemplate = `import React from 'react';
  
        const ${name} = () => {
            return <div>${name} works!</div>;
        };
        
        export default ${name};
    `;
  
    fs.writeFileSync(path.join(componentDirectory, `${name}.js`), componentTemplate);
    console.log(`Functional component ${chalk.bold.green(name)} has been created.`);
}
  
export default component;
  