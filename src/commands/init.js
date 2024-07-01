import shell from 'shelljs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createCLIConfigFile } from "../utils/grcConfigUtils.js"

const projectStructures = [
  {
    name: 'Basic Structure',
    value: 'basic',
  },
  {
    name: 'Full-featured Structure',
    value: 'full-featured',
  },
  {
    name: 'Enterprise Structure',
    value: 'enterprise',
  },
];

const createReactApp = async (appName) => {
  // Ask the user for the preferred project structure
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'structure',
      message: 'Choose your project structure:',
      choices: projectStructures,
    },
  ]);

  const { structure } = answers;

  // Create the React app
  if (shell.exec(`npx create-react-app ${appName}`).code !== 0) {
    console.error(chalk.red('Error: React app creation failed'));
    shell.exit(1);
  }
  
  // Navigate into the app directory
  shell.cd(appName);

  // create nrxConf.json
  await createCLIConfigFile();

  // Customize the project structure based on user selection
  customizeProjectStructure(structure);

  console.log(chalk.green('Custom React app structure created successfully.'));
};

const customizeProjectStructure = (structure) => {
  // Basic structure setup
  if (structure === 'basic') {
    // Example: setup basic folders
    shell.mkdir('src/components');
  }

  // Full-featured structure setup
  else if (structure === 'full-featured') {
    // Example: setup additional folders and install Redux, React Router
    shell.mkdir('-p', ['src/components', 'src/redux', 'src/routes']);
    shell.exec('npm install redux react-redux @reduxjs/toolkit react-router-dom');
  }

  // Enterprise structure setup
  else if (structure === 'enterprise') {
    // Example: setup for enterprise (TypeScript, Jest, etc.)
    shell.mkdir('-p', ['src/components', 'src/redux', 'src/routes', 'src/services', 'src/utils', 'src/hooks']);
    shell.exec('npm install redux react-redux @reduxjs/toolkit react-router-dom typescript @types/react @types/react-dom @types/jest');
    shell.exec('npm install --save-dev jest react-testing-library');
  }

  // Add more customization as needed
};

export default createReactApp;
