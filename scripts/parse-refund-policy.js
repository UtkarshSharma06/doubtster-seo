const fs = require('fs');
const path = require('path');

const md = fs.readFileSync(path.join(__dirname, '../src/content/doubtster-refund-policy.md'), 'utf-8');

const lines = md.split('\n');

const terms = {
  meta: {
    version: '1.0',
    effectiveDate: '[EFFECTIVE DATE]',
    lastUpdated: '[LAST UPDATED DATE]'
  },
  summary: [],
  sections: []
};

let currentSection = null;
let inSummary = false;
let currentBlock = null;

const pushBlock = () => {
  if (currentBlock && currentSection) {
    currentSection.blocks.push(currentBlock);
    currentBlock = null;
  }
};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (!line) {
    pushBlock();
    continue;
  }
  
  if (line.startsWith('<!--')) {
    continue; // owner note
  }

  if (line.startsWith('## ')) {
    pushBlock();
    inSummary = false;
    const match = line.match(/^## (\d+)\. (.*?) \{#(.*?)\}$/);
    if (match) {
      currentSection = {
        id: match[3],
        number: match[1],
        title: match[2],
        blocks: []
      };
      terms.sections.push(currentSection);
    } else if (line.match(/^## (\d+)\. (.*)$/)) {
        const match2 = line.match(/^## (\d+)\. (.*)$/);
        currentSection = {
            id: match2[2].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            number: match2[1],
            title: match2[2],
            blocks: []
        };
        terms.sections.push(currentSection);
    }
    continue;
  }

  if (line.startsWith('> **In short:**')) {
    inSummary = true;
    continue;
  }

  if (inSummary) {
    if (line.startsWith('> - ')) {
      terms.summary.push(line.substring(4).trim());
    } else if (line === '>') {
      // empty
    } else if (line.startsWith('> This summary')) {
      // end summary
      inSummary = false;
    }
    continue;
  }

  if (!currentSection) continue;

  if (line.startsWith('|')) {
    // table
    if (!currentBlock || currentBlock.type !== 'table') {
      pushBlock();
      currentBlock = { type: 'table', rows: [] };
    }
    if (line.includes('---')) continue; // separator
    const cells = line.split('|').map(s => s.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    currentBlock.rows.push(cells);
    continue;
  }

  if (line.startsWith('- ')) {
    if (!currentBlock || currentBlock.type !== 'list') {
      pushBlock();
      currentBlock = { type: 'list', items: [] };
    }
    currentBlock.items.push(line.substring(2));
    continue;
  }
  
  if (line.startsWith('> **Important:**')) {
    pushBlock();
    currentBlock = { type: 'callout', title: 'Important', text: line.replace('> **Important:**', '').trim() };
    pushBlock();
    continue;
  }
  
  if (line === '[LEGAL ENTITY NAME]' || line === '[REGISTERED ADDRESS]' || line === 'Email: [SUPPORT EMAIL]') {
    if (!currentBlock || currentBlock.type !== 'address') {
      pushBlock();
      currentBlock = { type: 'address', lines: [] };
    }
    currentBlock.lines.push(line);
    continue;
  }

  // Paragraph
  if (!currentBlock) {
    let text = line;
    let leadIn = '';
    const leadMatch = text.match(/^(\*\*\d+\.\d+(?:\s[^\*]+)?\*\*)\s(.*)$/);
    if (leadMatch) {
      leadIn = leadMatch[1].replace(/\*\*/g, '');
      text = leadMatch[2];
    }
    currentBlock = { type: 'paragraph', leadIn, text };
  } else if (currentBlock.type === 'paragraph') {
    currentBlock.text += ' ' + line;
  }
}
pushBlock();

const tsCode = `export const refundPolicyData = ${JSON.stringify(terms, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, '../src/content/refund-policy.ts'), tsCode);
console.log('Parsed successfully');
