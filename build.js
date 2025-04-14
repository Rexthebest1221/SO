import { mkdir, copyFile, readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function build() {
    try {
        // Create public directory
        await mkdir('public', { recursive: true });

        // Files to copy
        const filesToCopy = [
            'index.html',
            'signup.html',
            'home.html',
            'style.css',
            'app.js',
            'main.js',
            'signup.js',
            'auth.js',
            'config.js',
            '.env',
            '.gitignore',
            'vercel.json'
        ];

        // Copy files to public directory
        for (const file of filesToCopy) {
            try {
                await copyFile(join(__dirname, file), join(__dirname, 'public', file));
                console.log(`Copied ${file} to public/`);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.error(`Error copying ${file}:`, err);
                }
            }
        }

        console.log('Build completed successfully!');
    } catch (err) {
        console.error('Build failed:', err);
        process.exit(1);
    }
}

build(); 