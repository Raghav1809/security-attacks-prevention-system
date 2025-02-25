document.addEventListener('DOMContentLoaded', function() {
    // Initialize counters
    let activeThreats = 0;
    let blockedAttacks = 0;
    let criticalAlerts = 0;

    // Simulated threat data
    const threats = [
        { id: 1, level: 'high', type: 'SQL Injection', source: '192.168.1.100', timestamp: new Date() },
        { id: 2, level: 'medium', type: 'Brute Force Attack', source: '192.168.1.105', timestamp: new Date() },
        { id: 3, level: 'low', type: 'Suspicious Login', source: '192.168.1.110', timestamp: new Date() }
    ];

    // Update dashboard counters
    function updateCounters() {
        document.getElementById('activeThreatCount').textContent = activeThreats;
        document.getElementById('blockedAttackCount').textContent = blockedAttacks;
        document.getElementById('criticalAlertCount').textContent = criticalAlerts;
    }

    // Display threats in the threat list
    function displayThreats() {
        const threatList = document.getElementById('threatList');
        threatList.innerHTML = '';

        threats.forEach(threat => {
            const threatElement = document.createElement('div');
            threatElement.className = `list-group-item threat-item ${threat.level}`;
            threatElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-1">${threat.type}</h5>
                        <p class="mb-1">Source IP: ${threat.source}</p>
                        <small class="threat-timestamp">${threat.timestamp.toLocaleString()}</small>
                    </div>
                    <button class="btn btn-sm btn-danger" onclick="blockThreat(${threat.id})">Block</button>
                </div>
            `;
            threatList.appendChild(threatElement);
        });
    }

    // Initialize security analytics chart
    function initializeChart() {
        const ctx = document.getElementById('securityChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Security Incidents',
                    data: [12, 19, 3, 5, 2, 3],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Simulate real-time updates
    function simulateUpdates() {
        setInterval(() => {
            activeThreats = Math.floor(Math.random() * 5);
            blockedAttacks += Math.floor(Math.random() * 3);
            criticalAlerts = Math.floor(Math.random() * 3);
            updateCounters();
        }, 5000);
    }

    // Initialize the dashboard
    updateCounters();
    displayThreats();
    initializeChart();
    simulateUpdates();
});
// Function to block threats
function blockThreat(threatId) {
    // Simulate blocking the threat
    blockedAttacks++;
    document.getElementById('blockedAttackCount').textContent = blockedAttacks;
    
    // Remove the threat from the list
    const threatElement = document.querySelector(`[data-threat-id="${threatId}"]`);
    if (threatElement) {
        threatElement.remove();
    }
}
// Add this after your existing code

// Settings Management
document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings handlers
    initializeSettings();
});

function initializeSettings() {
    // Scan frequency slider
    const scanFrequency = document.getElementById('scanFrequency');
    const scanFrequencyValue = document.getElementById('scanFrequencyValue');
    
    if(scanFrequency && scanFrequencyValue) {
        scanFrequency.addEventListener('input', (e) => {
            scanFrequencyValue.textContent = e.target.value;
            saveSettings();
        });
    }

    // Auto-save all form changes
    const forms = ['securitySettingsForm', 'notificationSettingsForm'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if(form) {
            form.addEventListener('change', saveSettings);
        }
    });

    // Backup and Restore functionality
    const backupBtn = document.getElementById('backupBtn');
    const restoreBtn = document.getElementById('restoreBtn');

    if(backupBtn) {
        backupBtn.addEventListener('click', backupSettings);
    }
    if(restoreBtn) {
        restoreBtn.addEventListener('click', restoreSettings);
    }

    // Load saved settings
    loadSettings();
}

function saveSettings() {
    const settings = {
        autoThreatBlocking: document.getElementById('autoThreatBlocking').checked,
        scanFrequency: document.getElementById('scanFrequency').value,
        alertThreshold: document.getElementById('alertThreshold').value,
        notificationEmail: document.getElementById('notificationEmail').value,
        notifications: {
            critical: document.getElementById('notifyCritical').checked,
            attempts: document.getElementById('notifyAttempts').checked,
            updates: document.getElementById('notifyUpdates').checked
        }
    };

    localStorage.setItem('securitySettings', JSON.stringify(settings));
    showToast('Settings saved successfully');
}

function loadSettings() {
    const savedSettings = localStorage.getItem('securitySettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        document.getElementById('autoThreatBlocking').checked = settings.autoThreatBlocking;
        document.getElementById('scanFrequency').value = settings.scanFrequency;
        document.getElementById('scanFrequencyValue').textContent = settings.scanFrequency;
        document.getElementById('alertThreshold').value = settings.alertThreshold;
        document.getElementById('notificationEmail').value = settings.notificationEmail;
        document.getElementById('notifyCritical').checked = settings.notifications.critical;
        document.getElementById('notifyAttempts').checked = settings.notifications.attempts;
        document.getElementById('notifyUpdates').checked = settings.notifications.updates;
    }
}

function backupSettings() {
    const settings = localStorage.getItem('securitySettings');
    const blob = new Blob([settings], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'security-settings-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function restoreSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const settings = JSON.parse(event.target.result);
                localStorage.setItem('securitySettings', JSON.stringify(settings));
                loadSettings();
                showToast('Settings restored successfully');
            } catch (error) {
                showToast('Error restoring settings', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} position-fixed bottom-0 end-0 m-3`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    document.body.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        document.body.removeChild(toast);
    });
}