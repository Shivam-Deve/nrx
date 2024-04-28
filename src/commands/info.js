// import packageJson from '../../package.json';
import chalk from 'chalk';

function showInfo() {
  const title = chalk.bold.blue('nrx CLI Tool');
    //   const version = chalk.green(`Version: ${packageJson.version}`);
    const version = '1.0.0';
  const description = 'Description: Empowers the initialization of React projects with predefined templates, facilitating the generation of hooks, components, and services.';
  const author = `${chalk.bold.green('Author')}: ${chalk.green('Neha')}`;

  const divider = chalk.gray('-'.repeat(Math.max(title.length, version.length, description.length)));

  console.log(divider);
  console.log(title);
  console.log(divider);
  console.log(version);
  console.log(description);
  console.log(divider);
  console.log(author);
  console.log(divider);
}

export default showInfo;
