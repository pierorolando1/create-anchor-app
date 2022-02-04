import chalk from 'chalk'
import { execSync, exec } from 'child_process'

import { program } from 'commander'
import { prompt } from 'inquirer'

import packageJson from './package.json'

const log = console.log



const verifyInstallPrograms = () => {


  const checkAnchor = () => {
    try {
      execSync("anchor -V")
      return true
    } catch (error) {
      log(chalk.bold("\nYou need to install anchor, try running "), chalk.black.italic.bgCyan(" npm i -g @project-serum/anchor-cli \n"))
      return false
    }
  }

  const checkRust = () => {
    try {
      execSync("rustc -V")
      execSync("cargo -V")
      return true
    } catch (error) {
      log(chalk.bold("\nYou need to install Rust tools, run "), chalk.black.italic.bgCyan(" curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh \n"))
      return false
    }
  }

  const checkSolana = () => {
    try {
      execSync("solana -V")

      return true
    } catch (error) {
      log(chalk.bold("\nYou need to install Solana tools, check "), chalk.black.italic.bgCyan(" https://project-serum.github.io/anchor/getting-started/installation.html#install-solana \n"))
      return false
    }
  }

  return checkRust() && checkSolana() && checkAnchor()

}

program.version(packageJson.version).description(packageJson.description)

program.argument("[name]").action(async (_name) => {

  if (verifyInstallPrograms()) {
    //execSync("anchor init " + name)

    const initialQuestion = [
      {
        type: "input",
        name: "name",
        message: "Project name ",
        default: _name
      },
      {
        type: "list",
        name: "frontend",
        message: "What type of frontend you want to use?",
        choices: ["None", "vite", "create-react-app"]
      }
    ]

    const res = await prompt(initialQuestion)

    log(res)
    manageFrontendChoice(res.name, res.frontend)


  }

})

const manageFrontendChoice = async (projectName: string, name: string) => {
  switch (name) {
    case "vite":
      const VITE_OPTIONS = ["vanilla", "vanilla-ts", "react", "react-ts", "vue", "vue-ts", "preact", "preact-ts", "lit", "lit-ts", "svelte", "svelte-ts"]
      const a = await prompt([{
        type: "list",
        name: "vite_framework",
        message: "Select a framework to work whit vite",
        choices: VITE_OPTIONS
      }])

      execSync("npm init vite@latest " + projectName + "--" + "--template" + a.vite_framework)
      break
    case "create-react-app":
      break
    default:
      break;
  }
}

program.parse(process.argv)
