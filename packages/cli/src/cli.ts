#!/usr/bin/env node

import { program } from "commander";
import { initCommand } from "./commands/init";
import { version } from "./utils/version";

async function main() {
  program
    .name("origamichat")
    .description("CLI for OrigamiChat - AI-human support integration")
    .version(version);

  program
    .command("init")
    .description("Initialize OrigamiChat in your project")
    .action(initCommand);

  await program.parseAsync();
}

main().catch(console.error);
