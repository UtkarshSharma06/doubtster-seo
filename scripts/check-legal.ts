import fs from 'fs';
import path from 'path';
import { pricing } from '../src/content/pricing';

const mdPath = path.join(__dirname, '../src/content/doubtster-terms.md');
const md = fs.readFileSync(mdPath, 'utf-8');

const refundMdPath = path.join(__dirname, '../src/content/doubtster-refund-policy.md');
const refundMd = fs.readFileSync(refundMdPath, 'utf-8');

const combinedMd = md + '\n' + refundMd;


let hasError = false;

// a) list placeholders and comments
console.log('--- Checking for Placeholders & Notes ---');
const placeholders = combinedMd.match(/\[[A-Z\s]+\]/g) || [];
const uniquePlaceholders = [...new Set(placeholders)];
if (uniquePlaceholders.length > 0) {
  console.log(`Found placeholders: ${uniquePlaceholders.join(', ')}`);
}

const ownerNotes = combinedMd.match(/<!-- OWNER DECISION:.*?-->/gs) || [];
if (ownerNotes.length > 0) {
  console.log(`Found OWNER DECISION notes: ${ownerNotes.length}`);
}

const lawyerNotes = combinedMd.match(/<!-- LAWYER:.*?-->/gs) || [];
if (lawyerNotes.length > 0) {
  console.log(`Found LAWYER notes: ${lawyerNotes.length}`);
}

// b) Verify $ amounts
console.log('\n--- Checking Pricing Amounts ---');
const amountsInText = [...combinedMd.matchAll(/\$(\d+\.\d+|\d+)/g)].map(m => parseFloat(m[1]));
const uniqueAmounts = [...new Set(amountsInText)];
const expectedAmounts = [
  pricing.trial.price,
  pricing.monthly.price,
  pricing.annual.price,
  pricing.topups[0].price,
  pricing.topups[1].price
];

for (const amount of uniqueAmounts) {
  if (!expectedAmounts.includes(amount)) {
    console.error(`ERROR: Amount $${amount} found in text but not in pricing.ts`);
    hasError = true;
  }
}

// c) Check section IDs and cross-references
console.log('\n--- Checking Section IDs and Cross-references ---');
const checkSections = (content: string, filename: string) => {
  const sectionIds = new Set();
  const sectionNumbers = new Set();
  const sectionMatches = content.matchAll(/^## (\d+)\. (.*?) \{#(.*?)\}$/gm);
  for (const match of sectionMatches) {
    const num = match[1];
    const id = match[3];
    if (sectionIds.has(id)) {
      console.error(`ERROR: Duplicate section id in ${filename}: ${id}`);
      hasError = true;
    }
    sectionIds.add(id);
    sectionNumbers.add(num);
  }

  const refMatches = content.matchAll(/section (\d+)/g);
  for (const match of refMatches) {
    const num = match[1];
    if (!sectionNumbers.has(num)) {
      console.error(`ERROR: Cross-reference to non-existent section in ${filename}: ${num}`);
      hasError = true;
    }
  }
};

checkSections(md, 'doubtster-terms.md');
checkSections(refundMd, 'doubtster-refund-policy.md');



console.log('\n--- Checking Policy Links ---');
if (!md.includes('Cancellation and Refund Policy')) {
  console.error(`ERROR: Phrase "Cancellation and Refund Policy" not found in doubtster-terms.md`);
  hasError = true;
}


if (hasError) {
  console.error('\nLegal checks FAILED.');
  process.exit(1);
} else {
  console.log('\nLegal checks PASSED.');
  process.exit(0);
}
