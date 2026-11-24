// Appends the task key from the branch name (e.g. feature/SN-1003-entities-list -> SN-1003) to the commit message.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const commitMessageFilePath = process.argv[2];
const taskKeyPattern = /\b[A-Z][A-Z0-9]*-\d+\b/;

const branchName = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { encoding: 'utf8' }).trim();
const taskKey = branchName === 'HEAD' ? null : branchName.match(taskKeyPattern)?.[0];

if (commitMessageFilePath && taskKey) {
    const lines = readFileSync(commitMessageFilePath, 'utf8').split(/\r?\n/);

    // Drop the trailing empty element produced by the final newline.
    if (lines.at(-1) === '') {
        lines.pop();
    }

    if (!lines.some(line => line.includes(taskKey))) {
        const lastTextLineIndex = lines.findLastIndex(line => line.trim() && !line.trimStart().startsWith('#'));
        if (lastTextLineIndex === -1) {
            lines.push(taskKey);
        } else {
            lines[lastTextLineIndex] += ` ${taskKey}`;
        }
        writeFileSync(commitMessageFilePath, `${lines.join('\n')}\n`);
    }
}
