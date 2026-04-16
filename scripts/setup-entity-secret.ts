import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { constants, publicEncrypt } from "node:crypto";
import {
  generateEntitySecret,
  registerEntitySecretCiphertext
} from "@circle-fin/developer-controlled-wallets";

function readRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value || value.startsWith("replace-with-")) {
    throw new Error(`Missing ${name}. Update .env.local first.`);
  }

  return value;
}

async function generateMode() {
  console.log("\nCircle SDK will print a brand-new Entity Secret below.");
  console.log("Copy it immediately and store it in .env.local as CIRCLE_ENTITY_SECRET.\n");
  generateEntitySecret();
}

async function registerMode() {
  const apiKey = readRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = readRequiredEnv("CIRCLE_ENTITY_SECRET");
  const recoveryDir = resolve(process.cwd(), "circle-recovery");

  await mkdir(recoveryDir, { recursive: true });

  const response = await registerEntitySecretCiphertext({
    apiKey,
    entitySecret,
    recoveryFileDownloadPath: recoveryDir
  });

  console.log("\nEntity Secret registered successfully.");
  console.log(`Recovery file directory: ${recoveryDir}`);
  console.log(
    "Save the recovery file somewhere safe. You can now use this same CIRCLE_ENTITY_SECRET in .env.local."
  );
  console.log(`Recovery file received: ${response.data?.recoveryFile ? "yes" : "no"}`);
}

async function ciphertextMode() {
  const apiKey = readRequiredEnv("CIRCLE_API_KEY");
  const entitySecret = readRequiredEnv("CIRCLE_ENTITY_SECRET");
  const response = await fetch("https://api.circle.com/v1/w3s/config/entity/publicKey", {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch entity public key: ${response.status} ${body}`);
  }

  const body = (await response.json()) as { data?: { publicKey?: string } };
  const publicKey = body.data?.publicKey;

  if (!publicKey) {
    throw new Error("Circle did not return an entity public key");
  }

  const ciphertext = publicEncrypt(
    {
      key: publicKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256"
    },
    Buffer.from(entitySecret, "hex")
  ).toString("base64");

  console.log("\nEntity Secret Ciphertext generated successfully.");
  console.log("Paste this value into Circle Console -> Dev Controlled -> Configurator.\n");
  console.log(ciphertext);
  console.log(`\nCiphertext length: ${ciphertext.length}`);
}

async function main() {
  const mode = process.argv[2];

  if (mode === "generate") {
    await generateMode();
    return;
  }

  if (mode === "ciphertext") {
    await ciphertextMode();
    return;
  }

  if (mode === "register") {
    await registerMode();
    return;
  }

  throw new Error("Usage: tsx scripts/setup-entity-secret.ts <generate|ciphertext|register>");
}

main().catch((error) => {
  console.error("\nEntity secret setup failed.");
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
