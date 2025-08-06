// 🚀 GITHUB VEHICLE DASHBOARD - GOOGLE SHEETS API INTEGRATION
// Connects directly to your live Google Sheets data

class VehicleDashboard {
    constructor() {
        this.apiKey = '';
        this.sheetId = '';
        this.ranges = [];
        this.cache = {};
        this.charts = {};
        this.loadStartTime = Date.now();
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Vehicle Dashboard...');
        this.loadConfig();
        this.setupEventListeners();
        this.updateSpeed('Initializing...');
        
        if (this.apiKey && this.sheetId) {
            this.hideConfigModal();
            this.startLoading();
        } else {
            this.showConfigModal();
        }
    }
    
    // =================== CONFIGURATION ===================
    
    loadConfig() {
        const config = localStorage.getItem('vehicleDashboardConfig');
        if (config) {
            const parsed = JSON.parse(config);
            this.apiKey = parsed.apiKey || '';
            this.sheetId = parsed.sheetId || '1eN1ftt0ONgvKgBXc6ei7WY4Jpm6-boRf5sEehujr_hg';
            this.ranges = parsed.ranges || ['Sheet1!A:J', 'Sheet2!A:J', 'Sheet3!A:J'];
            
            // Update form fields
            document.getElementById('apiKey').value = this.apiKey;
            document.getElementById('sheetId').value = this.sheetId;
            document.getElementById('ranges').value = this.ranges.join(',');
        }
    }
    
    saveConfig() {
        const apiKey = document.getElementById('apiKey').value.trim();
        const sheetId = document.getElementById('sheetId').value.trim();
        const ranges = document.getElementById('ranges').value.trim().split(',').map(r => r.trim());
        
        if (!apiKey || !sheetId) {
            this.showError('Please enter both API Key and Sheet ID');
            return;
        }
        
        this.apiKey = apiKey;
        this.sheetId = sheetId;
        this.ranges = ranges;
        
        const config = {
            apiKey: this.apiKey,
            sheetId: this.sheetId,
            ranges: this.ranges
        };
        
        localStorage.setItem('vehicleDashboardConfig', JSON.stringify(config));
        
        this.hideConfigModal();
        this.startLoading();
    }
    
    showConfigModal() {
        document.getElementById('configModal').style.display = 'flex';
    }
    
    hideConfigModal() {
        document.getElementById('configModal').style.display = 'none';
    }
    
    // =================== GOOGLE SHEETS API ===================
    
    async fetchSheetData() {
        if (!this.apiKey || !this.sheetId) {
            throw new Error('API Key and Sheet ID are required');
        }
        
        try {
            this.updateLoadingStatus('Connecting to Google Sheets...');
            
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values:batchGet?ranges=${this.ranges.join('&ranges=')}&key=${this.apiKey}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Google Sheets API Error: ${errorData.error?.message || response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Google Sheets data fetched successfully');
            
            return this.processSheetData(data);
            
        } catch (error) {
            console.error('❌ Error fetching sheet data:', error);
            throw error;
        }
    }
    
    processSheetData(apiResponse) {
        this.updateLoadingStatus('Processing vehicle data...');
        
        const allVehicles = [];
        const monthlyData = {};
        const clientAnalysis = {};
        const locationAnalysis = {};
        let latestDate = '';
        let latestDateSortKey = '';
        
        // Column mapping (same as original script)
        const COLUMNS = {
            date: 0,        // Column A
            location: 1,    // Column B  
            vehicle: 2,     // Column C
            client: 3,      // Column D
            type: 4,        // Column E
            installation: 5, // Column F
            status: 6,      // Column G (Working Status)
            recording: 7,   // Column H
            alignment: 8,   // Column I (Alignment Status)
            remarks: 9      // Column J
        };
        
        // Utility functions (same as original script)
        const cleanText = (text) => {
            if (!text) return '';
            return text.toString()
                .replace(/\*\*/g, '')
                .replace(/^\s+|\s+$/g, '')
                .replace(/\s+/g, ' ');
        };
        
        const formatDate = (dateInput) => {
            try {
                const dateStr = dateInput.toString();
                
                if (dateStr.includes('-')) {
                    const parts = dateStr.split('-');
                    if (parts.length >= 2) {
                        return parts[0] + ' ' + parts[1];
                    }
                }
                
                if (dateInput instanceof Date) {
                    const day = dateInput.getDate();
                    const month = dateInput.toLocaleString('en-US', { month: 'long' });
                    return day + ' ' + month;
                }
                
                const dayMatch = dateStr.match(/\d+/);
                const monthMatch = dateStr.match(/january|february|march|april|may|june|july|august|september|october|november|december/i);
                
                if (dayMatch && monthMatch) {
                    return dayMatch[0] + ' ' + monthMatch[0];
                }
                
                return dateStr.replace(/[^\w\s]/g, '').trim();
                
            } catch (error) {
                return dateInput.toString();
            }
        };
        
        const getDateSortKey = (dateStr) => {
            try {
                const parts = dateStr.split(' ');
                if (parts.length >= 2) {
                    const day = parseInt(parts[0]) || 0;
                    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                                       'July', 'August', 'September', 'October', 'November', 'December'];
                    const monthIndex = monthNames.indexOf(parts[1]) + 1 || 0;
                    return monthIndex.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
                }
                return dateStr;
            } catch (error) {
                return dateStr;
            }
        };
        
        const getMonth = (sheetName, dateStr) => {
            const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                           'july', 'august', 'september', 'october', 'november', 'december'];
            
            const tabLower = sheetName.toLowerCase();
            const dateLower = dateStr.toLowerCase();
            
            for (let month of months) {
                if (tabLower.includes(month) || dateLower.includes(month)) {
                    return month.charAt(0).toUpperCase() + month.slice(1);
                }
            }
            
            // Numeric detection
            if (dateLower.includes('06') || dateLower.includes('6')) return 'June';
            if (dateLower.includes('07') || dateLower.includes('7')) return 'July';
            if (dateLower.includes('08') || dateLower.includes('8')) return 'August';
            if (dateLower.includes('09') || dateLower.includes('9')) return 'September';
            
            return 'Unknown';
        };
        
        // First pass: Find latest date
        apiResponse.valueRanges.forEach((range, sheetIndex) => {
            if (!range.values || range.values.length < 2) return;
            
            for (let i = 1; i < range.values.length; i++) {
                const row = range.values[i];
                const date = row[COLUMNS.date];
                
                if (date) {
                    const formattedDate = formatDate(date);
                    const sortKey = getDateSortKey(formattedDate);
                    if (sortKey > latestDateSortKey) {
                        latestDateSortKey = sortKey;
                        latestDate = formattedDate;
                    }
                }
            }
        });
        
        console.log(`📅 Latest date found: ${latestDate}`);
        
        // Second pass: Process all data
        apiResponse.valueRanges.forEach((range, sheetIndex) => {
            if (!range.values || range.values.length < 2) return;
            
            const sheetName = `Sheet${sheetIndex + 1}`;
            console.log(`🔄 Processing ${sheetName}...`);
            
            for (let i = 1; i < range.values.length; i++) {
                const row = range.values[i];
                
                const date = row[COLUMNS.date];
                const vehicleNumber = cleanText(row[COLUMNS.vehicle]);
                const workingStatus = row[COLUMNS.status];
                const alignmentStatus = row[COLUMNS.alignment];
                const clientName = cleanText(row[COLUMNS.client]);
                const location = cleanText(row[COLUMNS.location]);
                const vehicleType = cleanText(row[COLUMNS.type]) || 'Bus';
                const installationDate = row[COLUMNS.installation];
                const recording = cleanText(row[COLUMNS.recording]);
                const remarks = cleanText(row[COLUMNS.remarks]);
                
                if (!date || !vehicleNumber || !workingStatus) continue;
                
                // Skip header-like rows
                const vehicleLower = vehicleNumber.toLowerCase();
                if (vehicleLower.includes('vehicle') || 
                    vehicleLower.includes('chassis') ||
                    vehicleLower.includes('number') ||
                    vehicleNumber === '' ||
                    vehicleNumber.length < 3) {
                    continue;
                }
                
                const formattedDate = formatDate(date);
                const month = getMonth(sheetName, date.toString());
                
                if (month === 'Unknown') continue;
                
                // Create vehicle object
                const vehicleObj = {
                    vehicle: vehicleNumber,
                    client: clientName || 'Unknown',
                    location: location || 'Unknown',
                    workingStatus: workingStatus || 'Unknown',
                    alignmentStatus: alignmentStatus || 'Unknown',
                    vehicleType: vehicleType,
                    installationDate: installationDate ? formatDate(installationDate) : 'Unknown',
                    recording: recording || 'Unknown',
                    date: formattedDate,
                    remarks: remarks || '',
                    month: month,
                    sheetName: sheetName
                };
                
                allVehicles.push(vehicleObj);
                
                // Track monthly data
                if (!monthlyData[month]) {
                    monthlyData[month] = [];
                }
                monthlyData[month].push(vehicleObj);
                
                // Process client & location analysis for latest date only
                const isLatestDate = (formattedDate === latestDate) || 
                                   (getDateSortKey(formattedDate) === latestDateSortKey);
                
                if (isLatestDate) {
                    // Client analysis
                    if (clientName && 
                        clientName.length > 0 && 
                        clientName !== '#N/A' && 
                        clientName !== 'NA' &&
                        !clientName.toLowerCase().includes('client name')) {
                        
                        if (!clientAnalysis[clientName]) {
                            clientAnalysis[clientName] = [];
                        }
                        
                        // Avoid duplicates
                        const exists = clientAnalysis[clientName].find(v => v.vehicle === vehicleNumber);
                        if (!exists) {
                            clientAnalysis[clientName].push(vehicleObj);
                        }
                    }
                    
                    // Location analysis
                    if (location && 
                        location.length > 0 && 
                        location !== '#N/A' && 
                        location !== 'NA' &&
                        !location.toLowerCase().includes('location')) {
                        
                        if (!locationAnalysis[location]) {
                            locationAnalysis[location] = [];
                        }
                        
                        // Avoid duplicates
                        const exists = locationAnalysis[location].find(v => v.vehicle === vehicleNumber);
                        if (!exists) {
                            locationAnalysis[location].push(vehicleObj);
                        }
                    }
                }
            }
        });
        
        // Calculate statistics
        const stats = {
            totalVehicles: allVehicles.length,
            activeVehicles: allVehicles.filter(v => v.workingStatus === 'Active').length,
            offlineVehicles: allVehicles.filter(v => v.workingStatus.includes('Offlline') || v.workingStatus.includes('Offline')).length,
            alignedVehicles: allVehicles.filter(v => v.alignmentStatus === 'Alligned').length,
            misalignedVehicles: allVehicles.filter(v => v.alignmentStatus === 'Misalligned').length,
            totalClients: Object.keys(clientAnalysis).length,
            totalLocations: Object.keys(locationAnalysis).length
        };
        
        stats.healthScore = Math.round(((stats.activeVehicles + stats.alignedVehicles) / (stats.totalVehicles * 2)) * 100) || 0;
        
        console.log('📊 Processing completed:', stats);
        
        return {
            stats,
            allVehicles,
            monthlyData,
            clientAnalysis,
            locationAnalysis,
            latestDate,
            lastUpdated: new Date().toLocaleString()
        };
    }
    
    // =================== UI MANAGEMENT ===================
    
    startLoading() {
        this.showLoadingOverlay();
        this.fetchAndRenderData();
    }
    
    showLoadingOverlay() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }
    
    hideLoadingOverlay() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
    
    updateLoadingStatus(status) {
        const element = document.getElementById('loadingStatus');
        if (element) {
            element.textContent = status;
        }
    }
    
    updateSpeed(status) {
        const indicator = document.getElementById('speedIndicator');
        const elapsed = (Date.now() - this.loadStartTime) / 1000;
        indicator.innerHTML = `⚡ ${status} (${elapsed.toFixed(1)}s)`;
        
        if (status.includes('Complete')) {
            indicator.style.background = 'var(--success)';
            indicator.style.animation = 'none';
            setTimeout(() => {
                indicator.style.display = 'none';
            }, 2000);
        }
    }
    
    showError(message) {
        const errorHtml = `
            <div class="error-container">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="dashboard.showConfigModal()" style="margin-top: 15px; padding: 10px 20px; background: white; color: #ef4444; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Update Configuration
                </button>
            </div>
        `;
        
        document.getElementById('statsGrid').innerHTML = errorHtml;
        this.hideLoadingOverlay();
    }
    
    // =================== DATA FETCHING & RENDERING ===================
    
    async fetchAndRenderData() {
        try {
            this.loadStartTime = Date.now();
            this.updateSpeed('Loading...');
            
            const data = await this.fetchSheetData();
            this.cache.mainData = data;
            
            this.hideLoadingOverlay();
            this.renderDashboard(data);
            this.updateSpeed('Complete');
            
        } catch (error) {
            console.error('❌ Failed to load data:', error);
            this.hideLoadingOverlay();
            this.showError(error.message);
            this.updateSpeed('Error');
        }
    }
    
    renderDashboard(data) {
        this.renderStats(data.stats);
        this.renderClientList(data.clientAnalysis);
        this.renderLocationList(data.locationAnalysis);
        this.renderCharts(data);
        this.updateLastUpdated(data.lastUpdated);
    }
    
    renderStats(stats) {
        document.getElementById('statsGrid').innerHTML = `
            <div class="stat-card total" onclick="dashboard.showVehicleDetails('total')">
                <div class="stat-icon"><i class="fas fa-cars"></i></div>
                <div class="stat-value">${stats.totalVehicles || 0}</div>
                <div class="stat-label">Total Vehicles</div>
            </div>
            <div class="stat-card active" onclick="dashboard.showVehicleDetails('active')">
                <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                <div class="stat-value">${stats.activeVehicles || 0}</div>
                <div class="stat-label">Active Vehicles</div>
            </div>
            <div class="stat-card aligned" onclick="dashboard.showVehicleDetails('aligned')">
                <div class="stat-icon"><i class="fas fa-align-center"></i></div>
                <div class="stat-value">${stats.alignedVehicles || 0}</div>
                <div class="stat-label">Aligned Vehicles</div>
            </div>
            <div class="stat-card misaligned" onclick="dashboard.showVehicleDetails('misaligned')">
                <div class="stat-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="stat-value">${stats.misalignedVehicles || 0}</div>
                <div class="stat-label">Misaligned Vehicles</div>
            </div>
            <div class="stat-card offline" onclick="dashboard.showVehicleDetails('offline')">
                <div class="stat-icon"><i class="fas fa-wifi-slash"></i></div>
                <div class="stat-value">${stats.offlineVehicles || 0}</div>
                <div class="stat-label">Offline 24+ hrs</div>
            </div>
            <div class="stat-card health">
                <div class="stat-icon"><i class="fas fa-heart-pulse"></i></div>
                <div class="stat-value">${stats.healthScore || 0}%</div>
                <div class="stat-label">Health Score</div>
            </div>
        `;
    }
    
    renderClientList(clientAnalysis) {
        const clients = Object.keys(clientAnalysis).sort().slice(0, 15);
        const html = clients.map(clientName => {
            const vehicles = clientAnalysis[clientName];
            const problemCount = vehicles.filter(v => 
                v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned'
            ).length;
            
            const hasProblems = problemCount > 0;
            const problemText = hasProblems ? ` (${problemCount} issues)` : '';
            const classString = hasProblems ? 'list-item has-issues' : 'list-item';
            
            return `
                <div class="${classString}" onclick="dashboard.showClientDetails('${clientName}')">
                    <span class="item-name">
                        <i class="fas ${hasProblems ? 'fa-exclamation-triangle' : 'fa-building'}"></i> 
                        ${clientName}${problemText}
                    </span>
                    <span class="item-count">${vehicles.length}</span>
                </div>
            `;
        }).join('');
        
        document.getElementById('clientList').innerHTML = html;
    }
    
    renderLocationList(locationAnalysis) {
        const locations = Object.keys(locationAnalysis).sort().slice(0, 15);
        const html = locations.map(locationName => {
            const vehicles = locationAnalysis[locationName];
            const problemCount = vehicles.filter(v => 
                v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned'
            ).length;
            
            const hasProblems = problemCount > 0;
            const problemText = hasProblems ? ` (${problemCount} issues)` : '';
            const classString = hasProblems ? 'list-item has-issues' : 'list-item';
            
            return `
                <div class="${classString}" onclick="dashboard.showLocationDetails('${locationName}')">
                    <span class="item-name">
                        <i class="fas ${hasProblems ? 'fa-exclamation-triangle' : 'fa-map-marker-alt'}"></i> 
                        ${locationName}${problemText}
                    </span>
                    <span class="item-count">${vehicles.length}</span>
                </div>
            `;
        }).join('');
        
        document.getElementById('locationList').innerHTML = html;
    }
    
    renderCharts(data) {
        this.renderMonthlyChart(data.monthlyData);
        this.renderStatusChart(data.stats);
    }
    
    renderMonthlyChart(monthlyData) {
        const ctx = document.getElementById('monthlyChart');
        if (!ctx) return;
        
        if (this.charts.monthly) this.charts.monthly.destroy();
        
        const months = Object.keys(monthlyData).sort();
        const datasets = [
            {
                label: 'Total',
                data: months.map(month => monthlyData[month].length),
                backgroundColor: '#667eea',
                borderColor: '#667eea',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Active',
                data: months.map(month => monthlyData[month].filter(v => v.workingStatus === 'Active').length),
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                borderWidth: 2,
                fill: false
            },
            {
                label: 'Issues',
                data: months.map(month => monthlyData[month].filter(v => 
                    v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned'
                ).length),
                backgroundColor: '#ef4444',
                borderColor: '#ef4444',
                borderWidth: 2,
                fill: false
            }
        ];
        
        this.charts.monthly = new Chart(ctx, {
            type: 'line',
            data: { labels: months, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { 
                            font: { size: 12, weight: 'bold' },
                            color: '#e2e8f0',
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1
                    }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#94a3b8' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#94a3b8' }
                    }
                },
                animation: { duration: 800, easing: 'easeOutQuart' }
            }
        });
    }
    
    renderStatusChart(stats) {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;
        
        if (this.charts.status) this.charts.status.destroy();
        
        const data = [stats.activeVehicles, stats.offlineVehicles, stats.alignedVehicles, stats.misalignedVehicles];
        const labels = ['Active', 'Offline', 'Aligned', 'Misaligned'];
        const colors = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];
        
        this.charts.status = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            font: { size: 12, weight: 'bold' },
                            color: '#e2e8f0',
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: '#667eea',
                        borderWidth: 1
                    }
                },
                animation: { duration: 1000, easing: 'easeOutQuart' }
            }
        });
    }
    
    updateLastUpdated(lastUpdated) {
        const element = document.getElementById('lastUpdated');
        if (element) {
            element.innerHTML = `<i class="fas fa-clock"></i> ${lastUpdated}`;
        }
    }
    
    // =================== MODAL FUNCTIONS ===================
    
    showVehicleDetails(category) {
        if (!this.cache.mainData) return;
        
        const data = this.cache.mainData;
        let vehicles = [];
        let title = '';
        
        switch (category) {
            case 'total':
                vehicles = data.allVehicles;
                title = `All Vehicles (${vehicles.length})`;
                break;
            case 'active':
                vehicles = data.allVehicles.filter(v => v.workingStatus === 'Active');
                title = `Active Vehicles (${vehicles.length})`;
                break;
            case 'offline':
                vehicles = data.allVehicles.filter(v => v.workingStatus.includes('Offlline') || v.workingStatus.includes('Offline'));
                title = `Offline Vehicles (${vehicles.length})`;
                break;
            case 'aligned':
                vehicles = data.allVehicles.filter(v => v.alignmentStatus === 'Alligned');
                title = `Aligned Vehicles (${vehicles.length})`;
                break;
            case 'misaligned':
                vehicles = data.allVehicles.filter(v => v.alignmentStatus === 'Misalligned');
                title = `Misaligned Vehicles (${vehicles.length})`;
                break;
        }
        
        this.showVehicleModal(title, vehicles);
    }
    
    showClientDetails(clientName) {
        if (!this.cache.mainData || !this.cache.mainData.clientAnalysis[clientName]) return;
        
        const vehicles = this.cache.mainData.clientAnalysis[clientName];
        const title = `Client: ${clientName} (${vehicles.length} vehicles)`;
        
        this.showVehicleModal(title, vehicles);
    }
    
    showLocationDetails(locationName) {
        if (!this.cache.mainData || !this.cache.mainData.locationAnalysis[locationName]) return;
        
        const vehicles = this.cache.mainData.locationAnalysis[locationName];
        const title = `Location: ${locationName} (${vehicles.length} vehicles)`;
        
        this.showVehicleModal(title, vehicles);
    }
    
    showVehicleModal(title, vehicles) {
        if (!vehicles.length) {
            this.showModal(title, '<p style="color: var(--text-primary);">No vehicles found.</p>');
            return;
        }
        
        const html = `
            <div style="margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 15px 0;">
                    <div style="background: var(--status-active-bg); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 800; color: white;">${vehicles.filter(v => v.workingStatus === 'Active').length}</div>
                        <div style="font-size: 0.85rem; color: white; font-weight: 600;">Active</div>
                    </div>
                    <div style="background: var(--status-offline-bg); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 800; color: white;">${vehicles.filter(v => v.workingStatus.includes('Offlline')).length}</div>
                        <div style="font-size: 0.85rem; color: white; font-weight: 600;">Offline</div>
                    </div>
                    <div style="background: var(--status-aligned-bg); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 800; color: white;">${vehicles.filter(v => v.alignmentStatus === 'Alligned').length}</div>
                        <div style="font-size: 0.85rem; color: white; font-weight: 600;">Aligned</div>
                    </div>
                    <div style="background: var(--status-misaligned-bg); padding: 15px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 1.5rem; font-weight: 800; color: white;">${vehicles.filter(v => v.alignmentStatus === 'Misalligned').length}</div>
                        <div style="font-size: 0.85rem; color: white; font-weight: 600;">Misaligned</div>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Vehicle</th><th>Client</th><th>Location</th>
                        <th>Status</th><th>Alignment</th><th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${vehicles.map(vehicle => {
                        const workingStatusClass = vehicle.workingStatus === 'Active' ? 'status-active' : 'status-offline';
                        const alignmentStatusClass = vehicle.alignmentStatus === 'Alligned' ? 'status-aligned' : 'status-misaligned';
                        
                        return `
                            <tr>
                                <td style="color: var(--text-primary); font-weight: 600;">${vehicle.vehicle}</td>
                                <td style="color: var(--text-primary);">${vehicle.client}</td>
                                <td style="color: var(--text-primary);">${vehicle.location}</td>
                                <td><span class="${workingStatusClass}">${vehicle.workingStatus}</span></td>
                                <td><span class="${alignmentStatusClass}">${vehicle.alignmentStatus}</span></td>
                                <td style="color: var(--text-primary);">${vehicle.date}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
        
        this.showModal(title, html);
    }
    
    showModal(title, content) {
        document.getElementById('modalTitle').innerHTML = title;
        document.getElementById('modalContent').innerHTML = content;
        document.getElementById('detailModal').style.display = 'block';
    }
    
    closeModal() {
        document.getElementById('detailModal').style.display = 'none';
    }
    
    // =================== UTILITY FUNCTIONS ===================
    
    setupEventListeners() {
        // Close modal on outside click
        window.onclick = (event) => {
            const modal = document.getElementById('detailModal');
            if (event.target === modal) {
                this.closeModal();
            }
        };
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.refreshData();
            }
        });
    }
    
    refreshData() {
        console.log('🔄 Refreshing data...');
        this.cache = {};
        this.startLoading();
    }
    
    toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        
        const button = document.querySelector('.theme-toggle');
        button.innerHTML = newTheme === 'dark' ? 
            '<i class="fas fa-sun"></i> Light Mode' : 
            '<i class="fas fa-moon"></i> Dark Mode';
        
        // Update charts for new theme
        setTimeout(() => {
            Object.values(this.charts).forEach(chart => {
                if (chart && chart.update) chart.update();
            });
        }, 100);
    }
    
    switchTab(tabIndex) {
        // Update tab buttons
        document.querySelectorAll('.tab').forEach((tab, index) => {
            tab.classList.toggle('active', index === tabIndex);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach((content, index) => {
            content.classList.toggle('active', index === tabIndex);
        });
        
        // Load tab-specific data if needed
        if (tabIndex > 0) {
            this.loadTabData(tabIndex);
        }
    }
    
    loadTabData(tabIndex) {
        // Implementation for other tabs can be added here
        console.log(`Loading data for tab ${tabIndex}`);
    }
}

// =================== GLOBAL FUNCTIONS ===================

// Initialize dashboard when page loads
let dashboard;

document.addEventListener('DOMContentLoaded', () => {
    dashboard = new VehicleDashboard();
});

// Global functions for HTML onclick handlers
function saveAPIConfig() {
    dashboard.saveConfig();
}

function showConfig() {
    dashboard.showConfigModal();
}

function refreshData() {
    dashboard.refreshData();
}

function toggleTheme() {
    dashboard.toggleTheme();
}

function switchTab(tabIndex) {
    dashboard.switchTab(tabIndex);
}

function closeModal() {
    dashboard.closeModal();
}

console.log('🚀 Vehicle Dashboard JavaScript Loaded!');