// setup.ts
import { execSync } from "child_process";

export async function setup() {
  execSync("npm run build:test", { stdio: "inherit" }); // Replace 'npm run build' with your build command
}

export async function teardown() {
  execSync("npm run clean:test", { stdio: "inherit" }); // Replace 'npm run clean' with your clean command
}