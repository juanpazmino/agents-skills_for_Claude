const SENSITIVE_PATTERNS = [
  /\.env(rc|\.|$)/i,                        // .env, .envrc, .env.local, etc.
  /\.(pem|key|p12|pfx|crt|cer|der)(\b|$)/i, // private keys / certs
  /(^|\/)id_(rsa|ecdsa|ed25519|dsa)(\b|$)/,  // SSH private keys
  /\.aws[/\\]credentials(\b|$)/i,            // AWS credentials
  /\.ssh[/\\]/i,                             // anything in .ssh/
  /(secret|credential|password|private[_-]?key).*\.(json|yaml|yml|toml|ini|conf)$/i,
];

function isSensitive(str) {
  if (!str) return false;
  return SENSITIVE_PATTERNS.some((re) => re.test(str));
}

async function main() {
  let toolArgs;
  try {
    const chunks = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    toolArgs = JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    process.exit(0);
  }

  const toolName = toolArgs.tool_name || "";

  if (toolName === "Bash") {
    // For Bash, check the command string itself for sensitive file references
    const command = toolArgs.tool_input?.command || "";
    if (isSensitive(command)) {
      console.error("Blocked: command references a sensitive file path");
      process.exit(2);
    }
  } else {
    // For Read, Grep, etc. check the file path
    const readPath =
      toolArgs.tool_input?.file_path || toolArgs.tool_input?.path || "";
    if (isSensitive(readPath)) {
      console.error("Blocked: cannot read sensitive file");
      process.exit(2);
    }
  }
}

main();
