import chalk from 'chalk'
import shell from 'shelljs'
import deepKeys from 'deep-keys'
import inquirer from 'inquirer'
import merge from 'lodash/merge.js'
import fsExtra from 'fs-extra'

const { accessSync, constants, outputFileSync, readFileSync } = fsExtra
const { prompt } = inquirer

// project structures

const projectStructures = [
  {
    name: 'Basic Structure',
    value: 'basic'
  },
  {
    name: 'Full-featured Structure',
    value: 'full-featured'
  },
  {
    name: 'Enterprise Structure',
    value: 'enterprise'
  }
]

// Generate React Config file questions.

// --- project level questions.

const projectLevelQuestions = [
  // {
  //   type: 'list',
  //   name: 'structure',
  //   message: 'Choose your project structure:',
  //   choices: projectStructures
  // },
  {
    type: 'confirm',
    name: 'usesTypeScript',
    message: 'Does this project use TypeScript?'
  },
  {
    type: 'confirm',
    name: 'usesStyledComponents',
    message: 'Does this project use styled-components?'
  },
  {
    type: 'confirm',
    when: answers => !answers['usesStyledComponents'],
    name: 'usesCssModule',
    message: 'Does this project use CSS modules?'
  },
  {
    type: 'list',
    name: 'cssPreprocessor',
    when: answers => !answers['usesStyledComponents'],
    message: 'Does this project use a CSS Preprocessor?',
    choices: ['css', 'scss', 'less', 'styl']
  },
  {
    type: 'list',
    name: 'testLibrary',
    message: 'What testing library does your project use?',
    choices: ['Testing Library', 'Enzyme', 'None']
  }
]

// --- component level questions.

export const componentLevelQuestions = [
  {
    type: 'input',
    name: 'component.default.path',
    message:
      'Set the default path directory to where your components will be generated in?',
    default: () => 'src/components'
  },
  {
    type: 'confirm',
    name: 'component.default.withStyle',
    message:
      'Would you like to create a corresponding stylesheet file with each component you generate?'
  },
  {
    type: 'confirm',
    name: 'component.default.withTest',
    message:
      'Would you like to create a corresponding test file with each component you generate?'
  },
  {
    type: 'confirm',
    name: 'component.default.withStory',
    message:
      'Would you like to create a corresponding story with each component you generate?'
  },
  {
    type: 'confirm',
    name: 'component.default.withLazy',
    message:
      'Would you like to create a corresponding lazy file (a file that lazy-loads your component out of the box and enables code splitting: https://reactjs.org/docs/code-splitting.html#code-splitting) with each component you generate?'
  }
]

// --- merge all questions together.

const grcConfigQuestions = [
  ...projectLevelQuestions,
  ...componentLevelQuestions
]

export async function createCLIConfigFile () {
  try {
    console.log()
    console.log(
      chalk.cyan(
        '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'
      )
    )
    console.log(
      chalk.cyan(
        "It looks like this is the first time that you're running nrxConf.json within this project."
      )
    )
    console.log()
    console.log(
      chalk.cyan(
        'Answer a few questions to customize nrxConf.json for your project needs (this will create a "nrxConf.json" config file on the root level of this project).'
      )
    )
    console.log(
      chalk.cyan(
        '--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------'
      )
    )
    console.log()

    const answers = await prompt(grcConfigQuestions)

    // if (shell.exec(`npx create-react-app ${appName}`).code !== 0) {
    //   console.error(chalk.red('Error: React app creation failed'))
    //   shell.exit(1)
    // }

    // // Navigate into the app directory
    // shell.cd(appName)

    // const { structure } = answers

    // // Customize the project structure based on user selection
    // customizeProjectStructure(structure)

    // console.log(
    //   chalk.green('Custom React app structure created successfully.')
    // )

    outputFileSync('nrxConf.json', JSON.stringify(answers, null, 2))

    console.log()
    console.log(
      chalk.cyan(
        'The "nrxConf.json" config file has been successfully created.'
      )
    )

    console.log('')
    console.log(chalk.cyan('You can always go back and update it as needed.'))
    console.log('')
    console.log(chalk.cyan('Happy Hacking!'))
    console.log('')
    console.log('')

    return answers
  } catch (e) {
    console.error(
      chalk.red.bold(
        'ERROR: Could not create a "nrxConf.json" config file.'
      )
    )
    return e
  }
}

async function updateCLIConfigFile (missingConfigQuestions, currentConfigFile) {
  try {
    console.log('')
    console.log(
      chalk.cyan(
        '------------------------------------------------------------------------------------------------------------------------------'
      )
    )
    console.log(
      chalk.cyan(
        'Generate React CLI has been updated and has a few new features from the last time you ran it within this project.'
      )
    )
    console.log('')
    console.log(
      chalk.cyan(
        'Please answer a few questions to update the "nrxConf.json" config file.'
      )
    )
    console.log(
      chalk.cyan(
        '------------------------------------------------------------------------------------------------------------------------------'
      )
    )
    console.log('')

    const answers = await prompt(missingConfigQuestions)
    const updatedAnswers = merge({}, currentConfigFile, answers)

    outputFileSync(
      'nrxConf.json',
      JSON.stringify(updatedAnswers, null, 2)
    )

    console.log()
    console.log(
      chalk.cyan(
        'The ("nrxConf.json") has successfully updated for this project.'
      )
    )

    console.log()
    console.log(
      chalk.cyan('You can always go back and manually update it as needed.')
    )
    console.log()
    console.log(chalk.cyan('Happy Hacking!'))
    console.log()
    console.log()

    return updatedAnswers
  } catch (e) {
    console.error(
      chalk.red.bold(
        'ERROR: Could not update the "nrxConf.json" config file.'
      )
    )
    return e
  }
}

export async function getCLIConfigFile (appName) {
  try {
    accessSync('./nrxConf.json', constants.R_OK)
    const currentConfigFile = JSON.parse(
      readFileSync('./nrxConf.json')
    )

    /**
       *  Check to see if there's a difference between grcConfigQuestions and the currentConfigFile.
       *  If there is, update the currentConfigFile with the missingConfigQuestions.
       */

    const missingConfigQuestions = grcConfigQuestions.filter(
      question =>
        !deepKeys(currentConfigFile).includes(question.name) &&
        (question.when ? question.when(currentConfigFile) : true)
    )

    if (missingConfigQuestions.length) {
      return await updateCLIConfigFile(
        missingConfigQuestions,
        currentConfigFile
      )
    }

    return currentConfigFile
  } catch (e) {
    return await createCLIConfigFile(appName)
  }
}

const customizeProjectStructure = structure => {
  // Basic structure setup
  if (structure === 'basic') {
    // Example: setup basic folders
    shell.mkdir('src/components')
  } else if (structure === 'full-featured') {
    // Full-featured structure setup
    // Example: setup additional folders and install Redux, React Router
    shell.mkdir('-p', ['src/components', 'src/redux', 'src/routes'])
    shell.exec(
      'npm install redux react-redux @reduxjs/toolkit react-router-dom'
    )
  } else if (structure === 'enterprise') {
    // Enterprise structure setup
    // Example: setup for enterprise (TypeScript, Jest, etc.)
    shell.mkdir('-p', [
      'src/components',
      'src/redux',
      'src/routes',
      'src/services',
      'src/utils',
      'src/hooks'
    ])
    shell.exec(
      'npm install redux react-redux @reduxjs/toolkit react-router-dom typescript @types/react @types/react-dom @types/jest'
    )
    shell.exec('npm install --save-dev jest react-testing-library')
  }

  // Add more customization as needed
}
