import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
function service(generate) {
    generate
      .command('service <name>')
      .alias('s')
      .description('Generate a new service')
      .action((name) => {
        generateService(name);
      });
  }
  
function generateService(name) {
    const serviceDirectory = process.cwd();
    
    const serviceTemplate = `class ${name}Service {
        // Implement your service logic here
    }
    
    export default ${name}Service;
    `;
    
    name = name.toLowerCase(); // dir name in lowercase
    fs.writeFileSync(path.join(serviceDirectory, `${name}.js`), serviceTemplate);
    console.log(`Service ${chalk.bold.green(name)} has been created.`);
  }
  
export default service;
