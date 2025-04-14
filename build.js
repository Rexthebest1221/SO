import { mkdir, copyFile, readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function build() {
    try {
        // Create dist directory
        await mkdir('dist', { recursive: true });

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
            'server.js',
            '.env',
            '.gitignore',
            'package.json',
            'package-lock.json'
        ];

        // Copy files to dist directory
        for (const file of filesToCopy) {
            try {
                await copyFile(join(__dirname, file), join(__dirname, 'dist', file));
                console.log(`Copied ${file} to dist/`);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    console.error(`Error copying ${file}:`, err);
                }
            }
        }

        // Create node_modules directory in dist
        await mkdir(join(__dirname, 'dist', 'node_modules'), { recursive: true });

        console.log('Build completed successfully!');
    } catch (err) {
        console.error('Build failed:', err);
        process.exit(1);
    }
}

build(); 