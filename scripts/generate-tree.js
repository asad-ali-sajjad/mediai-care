const fs = require('fs');
const { execSync } = require('child_process');


// Folders to ignore in project tree
const ignoreList = "node_modules|.next|.git|coverage|build|.vercel|__pycache__|.venv|venv";

try {
  const treeText = execSync(`npx tree-node-cli -I "${ignoreList}"`).toString();
  const content = `<!-- AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY. Run 'npm run tree' to update. -->\n\n# Project Structure\n\n\`\`\`text\n${treeText.trim()}\n\`\`\`\n`;

  fs.writeFileSync('STRUCTURE.md', content);
  console.log('✅ STRUCTURE.md successfully updated!');
} catch (error) {
  console.error('❌ Error generating tree:', error.message);
}