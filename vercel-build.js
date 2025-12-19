const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const clientDir = path.join(__dirname, 'client');
const clientDist = path.join(clientDir, 'dist');
const publicDir = path.join(__dirname, 'public');

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    console.log('Starting build...');

    // Install Client Dependencies
    console.log('Installing client dependencies...');
    execSync('npm install --include=dev', { cwd: clientDir, stdio: 'inherit', shell: true });

    // Build Client
    console.log('Building client...');
    execSync('npm run build', { cwd: clientDir, stdio: 'inherit', shell: true });

    // Prepare public directory
    if (!fs.existsSync(clientDist)) {
        throw new Error('Client build directory (client/dist) not found!');
    }

    console.log('Moving files to public directory...');
    if (fs.existsSync(publicDir)) {
        fs.rmSync(publicDir, { recursive: true, force: true });
    }

    copyDir(clientDist, publicDir);

    console.log('Build complete! Artifacts in public/');

} catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
}
