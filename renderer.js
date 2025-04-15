const fs = require('fs');
const path = require('path');

// File path for saving notes
const notesPath = path.join(__dirname, 'notes.txt');

// Load notes if available
window.onload = function() {
    if (fs.existsSync(notesPath)) {
        const notes = fs.readFileSync(notesPath, 'utf-8');
        document.getElementById('notepad').value = notes;
    }
}

// Auto-save notes to the file every 10 seconds
setInterval(() => {
    const notes = document.getElementById('notepad').value;
    fs.writeFileSync(notesPath, notes, 'utf-8');
}, 10000);
