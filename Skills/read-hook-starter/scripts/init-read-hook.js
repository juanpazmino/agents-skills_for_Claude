import fs from "fs";
import path from "path";

const pwd = process.cwd();
const templatePath = path.join(".claude", "settings.example.json");
const outputPath   = path.join(".claude", "settings.local.json");

try {
  const templateContent  = fs.readFileSync(templatePath, "utf8");
  const processedContent = templateContent.replace(/\$PWD/g, pwd);

  JSON.parse(processedContent); // validate

  const claudeDir = path.dirname(outputPath);
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, processedContent, "utf8");
  console.log(`✅ Successfully created ${outputPath}`);
  console.log(`   Replaced $PWD with: ${pwd}`);
} catch (error) {
  if (error.code === "ENOENT") {
    console.error(`❌ Error: Could not find ${templatePath}`);
    console.error("   Make sure you run this script from the project root directory.");
  } else if (error instanceof SyntaxError) {
    console.error("❌ Error: Invalid JSON after processing");
    console.error(error.message);
  } else {
    console.error("❌ Error:", error.message);
  }
  process.exit(1);
}
