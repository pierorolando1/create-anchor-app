"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const commander_1 = require("commander");
const inquirer_1 = require("inquirer");
const package_json_1 = __importDefault(require("./package.json"));
const log = console.log;
/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
const execShellCommand = (cmd) => {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
};
const verifyInstallPrograms = () => {
    const checkAnchor = () => {
        try {
            (0, child_process_1.execSync)("anchor -V");
            return true;
        }
        catch (error) {
            log(chalk_1.default.bold("\nYou need to install anchor, try running "), chalk_1.default.black.italic.bgCyan(" npm i -g @project-serum/anchor-cli \n"));
            return false;
        }
    };
    const checkRust = () => {
        try {
            (0, child_process_1.execSync)("rustc -V");
            (0, child_process_1.execSync)("cargo -V");
            return true;
        }
        catch (error) {
            log(chalk_1.default.bold("\nYou need to install Rust tools, run "), chalk_1.default.black.italic.bgCyan(" curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh \n"));
            return false;
        }
    };
    const checkSolana = () => {
        try {
            (0, child_process_1.execSync)("solana -V");
            return true;
        }
        catch (error) {
            log(chalk_1.default.bold("\nYou need to install Solana tools, check "), chalk_1.default.black.italic.bgCyan(" https://project-serum.github.io/anchor/getting-started/installation.html#install-solana \n"));
            return false;
        }
    };
    return checkRust() && checkSolana() && checkAnchor();
};
commander_1.program.version(package_json_1.default.version).description(package_json_1.default.description);
commander_1.program.argument("[name]").action((_name) => __awaiter(void 0, void 0, void 0, function* () {
    if (verifyInstallPrograms()) {
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
        ];
        const res = yield (0, inquirer_1.prompt)(initialQuestion);
        log(chalk_1.default.bold.blueBright("Creating your app..."));
        yield execShellCommand("anchor init " + res.name);
        log(res);
        manageFrontendChoice(res.name, res.frontend);
    }
}));
const manageFrontendChoice = (projectName, name) => __awaiter(void 0, void 0, void 0, function* () {
    switch (name) {
        case "vite":
            const VITE_OPTIONS = ["vanilla", "vanilla-ts", "react", "react-ts", "vue", "vue-ts", "preact", "preact-ts", "lit", "lit-ts", "svelte", "svelte-ts"];
            const a = yield (0, inquirer_1.prompt)([{
                    type: "list",
                    name: "vite_framework",
                    message: "Select a framework to work whit vite",
                    choices: VITE_OPTIONS
                }]);
            (0, child_process_1.exec)("npm init vite@latest " + projectName + "/app -- " + "--template " + a.vite_framework);
            break;
        case "create-react-app":
            break;
        default:
            break;
    }
});
commander_1.program.parse(process.argv);
