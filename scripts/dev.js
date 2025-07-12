#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🚀 Starting Whisper Web Development Environment...\n');

// Check if backend dependencies are installed
import { existsSync } from 'fs';
const backendNodeModules = join(rootDir, 'backend', 'node_modules');

if (!existsSync(backendNodeModules)) {
  console.log('📦 Installing backend dependencies...');
  const installBackend = spawn('npm', ['install'], {
    cwd: join(rootDir, 'backend'),
    stdio: 'inherit',
    shell: true
  });
  
  installBackend.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Backend dependencies installed successfully');
      startServers();
    } else {
      console.error('❌ Failed to install backend dependencies');
      process.exit(1);
    }
  });
} else {
  startServers();
}

function startServers() {
  console.log('🌐 Starting Frontend (Vite)...');
  console.log('🔧 Starting Backend (Express)...\n');
  
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  });
  
  const backend = spawn('npm', ['run', 'dev'], {
    cwd: join(rootDir, 'backend'),
    stdio: 'inherit',
    shell: true
  });
  
  // Handle process termination
  const cleanup = () => {
    console.log('\n🛑 Shutting down servers...');
    frontend.kill();
    backend.kill();
    process.exit(0);
  };
  
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  
  // Handle process errors
  frontend.on('error', (err) => {
    console.error('❌ Frontend error:', err);
  });
  
  backend.on('error', (err) => {
    console.error('❌ Backend error:', err);
  });
  
  frontend.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Frontend exited with code ${code}`);
    }
  });
  
  backend.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Backend exited with code ${code}`);
    }
  });
} 