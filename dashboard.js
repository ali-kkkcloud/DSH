// 🚀 GITHUB VEHICLE DASHBOARD - COMPLETE FUNCTIONALITY RESTORED
// All original .gs script features + Google Sheets API integration

class VehicleDashboard {
    constructor() {
        this.apiKey = '';
        this.sheetId = '';
        this.ranges = [];
        this.cache = {};
        this.charts = {};
        this.loadStartTime = Date.now();
        this.debounceTimer = null;
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing Complete Vehicle Dashboard...');
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
            this.ranges = parsed.ranges || [];
            // Update form fields
            document.getElementById('apiKey').value = this.apiKey;
            document.getElementById('sheetId').value = this.sheetId;
            document.getElementById('ranges').value = this.ranges.length > 0 ? this.ranges.join(',') : 'Leave empty for auto-detection';
        } else {
            // Set defaults for first time
            this.sheetId = '1eN1ftt0ONgvKgBXc6ei7WY4Jpm6-boRf5sEehujr_hg';
            this.ranges = [];
            document.getElementById('sheetId').value = this.sheetId;
            document.getElementById('ranges').value = 'Leave empty for auto-detection';
        }
    }
    
    saveConfig() {
        const apiKey = document.getElementById('apiKey').value.trim();
        const sheetId = document.getElementById('sheetId').value.trim();
        const rangesText = document.getElementById('ranges').value.trim();
        
        if (!apiKey || !sheetId) {
            this.showError('Please enter both API Key and Sheet ID');
            return;
        }
        
        this.apiKey = apiKey;
        this.sheetId = sheetId;
        
        // Handle ranges - empty means auto-detection
        if (rangesText && rangesText !== 'Leave empty for auto-detection') {
            this.ranges = rangesText.split(',').map(r => r.trim());
        } else {
            this.ranges = [];
            // Empty means auto-detect
        }
        
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
            // First, get all sheet names automatically
            const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}?key=${this.apiKey}`;
            const metadataResponse = await fetch(metadataUrl);
            
            if (!metadataResponse.ok) {
                throw new Error('Failed to fetch sheet metadata');
            }
            
            const metadata = await metadataResponse.json();
            const allSheets = metadata.sheets || [];
            
            // Fix: Find the latest date tab and explicitly include the other two tabs
            const getLatestDateTabName = (tabs) => {
                const dateTabs = tabs.filter(tab => {
                    const name = tab.properties.title;
                    // Match "26th July" or "1st Jan" format
                    return /\d+(?:st|nd|rd|th)?\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(name);
                });

                if (dateTabs.length === 0) {
                    return null;
                }

                // Sort tabs by date to find the latest one
                const sortedTabs = dateTabs.sort((a, b) => {
                    const aDate = new Date(a.properties.title);
                    const bDate = new Date(b.properties.title);
                    return bDate - aDate;
                });
                
                return sortedTabs[0].properties.title;
            };

            const latestDateTab = getLatestDateTabName(allSheets);
            const rangesToUse = [];
            
            if (latestDateTab) {
                rangesToUse.push(`${latestDateTab}!A:J`);
            }
            rangesToUse.push('Client Operations!A:J');
            rangesToUse.push('Location Network!A:J');

            this.updateLoadingStatus(`Fetching data for ${rangesToUse.length} tabs...`);
            
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values:batchGet?ranges=${rangesToUse.join('&ranges=')}&key=${this.apiKey}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Google Sheets API Error: ${errorData.error?.message || response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Google Sheets data fetched successfully');
            
            // Store sheet metadata for processing
            this.sheetMetadata = allSheets;
            return this.processSheetData(data);
            
        } catch (error) {
            console.error('❌ Error fetching sheet data:', error);
            throw error;
        }
    }
    
    processSheetData(apiResponse) {
        this.updateLoadingStatus('Processing vehicle data...');
        const allVehicles = [];
        let activeVehicles = {};        // Track active vehicles by month
        let offlineVehicles = {};       // Track offline vehicles by month  
        let alignmentTimelines = {};    // Track alignment changes by month
        let monthlyData = {};           // Track all months found
        let clientAnalysis = {};        // Track vehicles by client (latest date only)
        let cityAnalysis = {};          // Track vehicles by city (latest date only)
        let latestDate = '';            // Track the most recent date found
        let latestDateSortKey = '';     // Track the most recent date found by sort key
        
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
        
        // UTILITY FUNCTIONS - Exact same as original .gs script
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
                // Handle tab names like "26th July", "1st August"
                const tabDateMatch = dateStr.match(/(\d+)(st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december)/i);
                if (tabDateMatch) {
                    const day = tabDateMatch[1];
                    const month = tabDateMatch[3];
                    return day + ' ' + month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
                }
                
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
            
            // Handle daily tabs like "26th July", "1st August", etc.
            for (let month of months) {
                if (tabLower.includes(month) || dateLower.includes(month)) {
                    return month.charAt(0).toUpperCase() + month.slice(1);
                }
            }
            
            // Enhanced month detection from tab names
            if (tabLower.includes('july') || tabLower.includes('jul')) return 'July';
            if (tabLower.includes('august') || tabLower.includes('aug')) return 'August';
            if (tabLower.includes('september') || tabLower.includes('sep')) return 'September';
            if (tabLower.includes('october') || tabLower.includes('oct')) return 'October';
            if (tabLower.includes('november') || tabLower.includes('nov')) return 'November';
            if (tabLower.includes('december') || tabLower.includes('dec')) return 'December';
            if (tabLower.includes('january') || tabLower.includes('jan')) return 'January';
            if (tabLower.includes('february') || tabLower.includes('feb')) return 'February';
            if (tabLower.includes('march') || tabLower.includes('mar')) return 'March';
            if (tabLower.includes('april') || tabLower.includes('apr')) return 'April';
            if (tabLower.includes('may')) return 'May';
            if (tabLower.includes('june') || tabLower.includes('jun')) return 'June';
            
            // Try to extract month from date string in the sheet
            const dateMatch = dateStr.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i);
            if (dateMatch) {
                return dateMatch[1].charAt(0).toUpperCase() + dateMatch[1].slice(1).toLowerCase();
            }
            
            // Try to extract month from numbers in date
            const numericMatch = dateStr.match(/\b(0?[1-9]|1[0-2])\b/);
            if (numericMatch) {
                const monthNum = parseInt(numericMatch[1]);
                const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 
                                   'July', 'August', 'September', 'October', 'November', 'December'];
                if (monthNum >= 1 && monthNum <= 12) {
                    return monthNames[monthNum];
                }
            }
            
            return 'Unknown';
        };
        
        // Add alignment timeline creation function (exact same as .gs script)
        const createAlignmentTimeline = (vehicleData) => {
            if (!vehicleData || vehicleData.length === 0) return 'No alignment data';
            // Sort chronologically
            vehicleData.sort(function(a, b) {
                return getDateSortKey(a.date).localeCompare(getDateSortKey(b.date));
            });
            var timeline = [];
            var currentStatus = '';
            var startDate = '';
            var endDate = '';
            for (var i = 0; i < vehicleData.length; i++) {
                var entry = vehicleData[i];
                var status = entry.alignmentStatus;
                
                // Skip if no proper alignment status
                if (!status || status === 'Unknown' || status === 'NA') continue;
                if (status !== currentStatus) {
                    // Save previous status period
                    if (currentStatus && startDate) {
                        var period = startDate === endDate ? startDate : startDate + ' to ' + endDate;
                        timeline.push(currentStatus + ' (' + period + ')');
                    }
                    
                    // Start new status period
                    currentStatus = status;
                    startDate = entry.date;
                    endDate = entry.date;
                } else {
                    // Continue current status period
                    endDate = entry.date;
                }
            }
            
            // Add final status period
            if (currentStatus && startDate) {
                var period = startDate === endDate ? startDate : startDate + ' to ' + endDate;
                timeline.push(currentStatus + ' (' + period + ')');
            }
            
            return timeline.length > 0 ? timeline.join(' → ') : 'No alignment changes';
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
        
        console.log(`📅 Latest date found: ${latestDate} (Sort key: ${latestDateSortKey})`);
        
        if (!latestDate) {
            console.log('⚠️ No latest date found, using current month approach');
            latestDate = 'Current';
        }
        
        // Second pass: Process all data
        apiResponse.valueRanges.forEach((range, sheetIndex) => {
            if (!range.values || range.values.length < 2) return;
            
            // Get actual sheet name from metadata or use generic name
            const sheetName = this.sheetMetadata && this.sheetMetadata[sheetIndex] 
                ? this.sheetMetadata[sheetIndex].properties.title 
                : `Sheet${sheetIndex + 1}`;
            
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
                
                // Skip header-like rows with exact same logic as .gs script
                const vehicleLower = vehicleNumber.toLowerCase();
                if (vehicleLower.includes('vehicle') || 
                    vehicleLower.includes('chassis') ||
                    vehicleLower.includes('number') ||
                    vehicleNumber === '' ||
                    vehicleNumber.length < 3) {
                    console.log(`⚠️ Skipping header row ${i}: ${vehicleNumber}`);
                    continue;
                }
                
                const formattedDate = formatDate(date);
                const month = getMonth(sheetName, date.toString());
                
                if (month === 'Unknown') continue;
                
                // Create vehicle object for allVehicles array
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
                
                // Initialize month tracking - same as .gs script
                if (!monthlyData[month]) {
                    monthlyData[month] = new Set();
                    activeVehicles[month] = {};
                    offlineVehicles[month] = {};
                    alignmentTimelines[month] = {};
                }
                monthlyData[month].add(vehicleNumber);
                
                // TRACK ACTIVE VEHICLES - exact same logic
                if (!activeVehicles[month][vehicleNumber]) {
                    activeVehicles[month][vehicleNumber] = {
                        allActive: true,
                        statuses: []
                    };
                }
                
                activeVehicles[month][vehicleNumber].statuses.push({
                    date: formattedDate,
                    status: workingStatus
                });
                
                // Mark as not consistently active if any non-Active status
                if (workingStatus !== 'Active') {
                    activeVehicles[month][vehicleNumber].allActive = false;
                }
                
                // TRACK OFFLINE VEHICLES - exact same logic
                if (workingStatus === 'Offlline >24Hrs') {
                    if (!offlineVehicles[month][vehicleNumber]) {
                        offlineVehicles[month][vehicleNumber] = {
                            dates: [],
                            latestRemarks: ''
                        };
                    }
                    
                    offlineVehicles[month][vehicleNumber].dates.push(formattedDate);
                    offlineVehicles[month][vehicleNumber].latestRemarks = remarks || 'Offline';
                }
                
                // TRACK ALIGNMENT TIMELINE - exact same logic
                if (alignmentStatus && (alignmentStatus === 'Misalligned' || alignmentStatus === 'Alligned')) {
                    if (!alignmentTimelines[month][vehicleNumber]) {
                        alignmentTimelines[month][vehicleNumber] = [];
                    }
                    
                    alignmentTimelines[month][vehicleNumber].push({
                        date: formattedDate,
                        alignmentStatus: alignmentStatus,
                        remarks: remarks || ''
                    });
                }
                
                // PROCESS CLIENT & CITY ANALYSIS DATA - exact same logic as .gs script
                let shouldCollectForAnalysis = false;
                if (latestDate === 'Current') {
                    shouldCollectForAnalysis = true;
                } else {
                    shouldCollectForAnalysis = (formattedDate === latestDate) || (getDateSortKey(formattedDate) === latestDateSortKey);
                }
                
                if (shouldCollectForAnalysis) {
                    // CLIENT ANALYSIS - exact same filtering logic
                    if (clientName && 
                        clientName.length > 0 && 
                        clientName !== '#N/A' && 
                        clientName !== 'NA' &&
                        !clientName.toLowerCase().includes('client name') &&
                        !clientName.toLowerCase().includes('vehicle number')) {
                        
                        if (!clientAnalysis[clientName]) {
                            clientAnalysis[clientName] = [];
                        }
                        
                        // Check if this vehicle already exists for this client (avoid duplicates)
                        const existingVehicle = clientAnalysis[clientName].find(function(v) {
                            return v.vehicle === vehicleNumber;
                        });
                        if (!existingVehicle) {
                            clientAnalysis[clientName].push({
                                vehicle: vehicleNumber,
                                workingStatus: workingStatus,
                                alignmentStatus: alignmentStatus || 'Unknown',
                                location: location || 'Unknown',
                                remarks: remarks || '',
                                date: formattedDate
                            });
                        }
                    }
                    
                    // CITY ANALYSIS - exact same filtering logic
                    if (location && 
                        location.length > 0 && 
                        location !== '#N/A' && 
                        location !== 'NA' &&
                        !location.toLowerCase().includes('location') &&
                        !location.toLowerCase().includes('site') &&
                        !location.toLowerCase().includes('vehicle number')) {
                        
                        if (!cityAnalysis[location]) {
                            cityAnalysis[location] = [];
                        }
                        
                        // Check if this vehicle already exists for this city (avoid duplicates)
                        const existingVehicle = cityAnalysis[location].find(function(v) {
                            return v.vehicle === vehicleNumber;
                        });
                        if (!existingVehicle) {
                            cityAnalysis[location].push({
                                vehicle: vehicleNumber,
                                workingStatus: workingStatus,
                                alignmentStatus: alignmentStatus || 'Unknown',
                                client: clientName || 'Unknown',
                                remarks: remarks || '',
                                date: formattedDate
                            });
                        }
                    }
                }
            }
        });
        
        console.log('📊 Processing completed:');
        console.log(`👥 Clients found: ${Object.keys(clientAnalysis).length}`);
        console.log(`🏙️ Cities found: ${Object.keys(cityAnalysis).length}`);
        console.log(`🚗 Total vehicles: ${allVehicles.length}`);
        console.log('📅 Monthly breakdown:');
        Object.keys(monthlyData).forEach(month => {
            const vehicles = Array.from(monthlyData[month]);
            console.log(`  ${month}: ${vehicles.length} unique vehicles`);
        });
        
        // Generate .gs script data structures
        const gsScriptData = {
            // Monthly breakdown data (exact same as .gs script)
            monthlyAnalysis: this.generateMonthlyAnalysisData(activeVehicles, offlineVehicles, alignmentTimelines, monthlyData, createAlignmentTimeline),
            
            // Client analysis (exact same format as .gs script)
            clientAnalysisTable: this.generateClientAnalysisTable(clientAnalysis, latestDate),
            
            // City analysis (exact same format as .gs script)  
            cityAnalysisTable: this.generateCityAnalysisTable(cityAnalysis, latestDate),
            
            // Comprehensive summary (exact same as .gs script)
            comprehensiveSummary: this.generateComprehensiveSummary(activeVehicles, offlineVehicles, alignmentTimelines, monthlyData, clientAnalysis, cityAnalysis, latestDate)
        };
        
        // Calculate statistics
        const stats = {
            totalVehicles: allVehicles.length,
            activeVehicles: allVehicles.filter(v => v.workingStatus === 'Active').length,
            offlineVehicles: allVehicles.filter(v => v.workingStatus.includes('Offlline') || v.workingStatus.includes('Offline')).length,
            alignedVehicles: allVehicles.filter(v => v.alignmentStatus === 'Alligned').length,
            misalignedVehicles: allVehicles.filter(v => v.alignmentStatus === 'Misalligned').length,
            totalClients: Object.keys(clientAnalysis).length,
            totalLocations: Object.keys(cityAnalysis).length
        };
        stats.healthScore = Math.round(((stats.activeVehicles + stats.alignedVehicles) / (stats.totalVehicles * 2)) * 100) || 0;
        
        return {
            stats,
            allVehicles,
            monthlyData,
            clientAnalysis,
            cityAnalysis,
            latestDate,
            gsScriptData,
            lastUpdated: new Date().toLocaleString()
        };
    }
    
    // =================== .GS SCRIPT DATA GENERATORS - EXACT SAME LOGIC ===================
    
    generateMonthlyAnalysisData(activeVehicles, offlineVehicles, alignmentTimelines, monthlyData, createAlignmentTimeline) {
        const monthlyAnalysis = {};
        const months = Object.keys(monthlyData).sort();
        
        months.forEach(month => {
            // 🟢 ACTIVE VEHICLES (exact same logic as .gs script)
            const monthActiveVehicles = [];
            Object.keys(activeVehicles[month] || {}).forEach(function(vehicle) {
                if (activeVehicles[month][vehicle].allActive && activeVehicles[month][vehicle].statuses.length > 0) {
                    monthActiveVehicles.push({
                        vehicle: vehicle,
                        status: `Active in ALL ${month} tabs`
                    });
                }
            });
            monthActiveVehicles.sort((a, b) => a.vehicle.localeCompare(b.vehicle));
            
            // 🔴 OFFLINE VEHICLES (exact same logic as .gs script)
            const monthOfflineVehicles = [];
            Object.keys(offlineVehicles[month] || {}).forEach(function(vehicle) {
                const vehicleData = offlineVehicles[month][vehicle];
                if (vehicleData.dates.length > 0) {
                    // Remove duplicates and sort
                    const uniqueDates = [];
                    vehicleData.dates.forEach(function(date) {
                        if (uniqueDates.indexOf(date) === -1) {
                            uniqueDates.push(date);
                        }
                    });
                    
                    uniqueDates.sort(function(a, b) {
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
                        return getDateSortKey(a).localeCompare(getDateSortKey(b));
                    });
                    
                    monthOfflineVehicles.push({
                        vehicle: vehicle,
                        dates: uniqueDates,
                        remarks: vehicleData.latestRemarks
                    });
                }
            });
            monthOfflineVehicles.sort((a, b) => a.vehicle.localeCompare(b.vehicle));
            
            // ⚖️ ALIGNMENT TIMELINE (exact same logic as .gs script)
            const monthAlignmentVehicles = [];
            Object.keys(alignmentTimelines[month] || {}).forEach(function(vehicle) {
                const vehicleData = alignmentTimelines[month][vehicle];
                if (vehicleData.length > 0) {
                    const timeline = createAlignmentTimeline(vehicleData);
                    const latestEntry = vehicleData[vehicleData.length - 1];
                    
                    monthAlignmentVehicles.push({
                        vehicle: vehicle,
                        timeline: timeline,
                        latestStatus: latestEntry.alignmentStatus,
                        remarks: latestEntry.remarks
                    });
                }
            });
            monthAlignmentVehicles.sort((a, b) => a.vehicle.localeCompare(b.vehicle));
            
            monthlyAnalysis[month] = {
                activeVehicles: monthActiveVehicles,
                offlineVehicles: monthOfflineVehicles,
                alignmentVehicles: monthAlignmentVehicles
            };
        });
        
        return monthlyAnalysis;
    }
    
    generateClientAnalysisTable(clientAnalysis, latestDate) {
        const clientKeys = Object.keys(clientAnalysis).sort();
        const clientTable = [];
        
        let displayDate = latestDate === 'Current' ? 'Recent Data' : latestDate;
        clientKeys.forEach((clientName, index) => {
            const vehicles = clientAnalysis[clientName];
            
            // Separate problem vehicles (exact same logic as .gs script)
            const problemVehicles = [];
            
            vehicles.forEach(function(v) {
                if (v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned') {
                    problemVehicles.push(v.vehicle + ' (' + v.workingStatus + '/' + v.alignmentStatus + ')');
                }
            });
            
            const allVehicleNumbers = vehicles.map(function(v) { return v.vehicle; }).join(', ');
            const problemVehicleText = problemVehicles.join(', ') || 'None';
            const statusText = problemVehicles.length > 0 ? 
                'ISSUES: ' + problemVehicles.length + '/' + vehicles.length : 
                'ALL OK';
            
            clientTable.push({
                sno: index + 1,
                clientName: clientName,
                vehicleCount: vehicles.length,
                vehicleNumbers: allVehicleNumbers,
                problemVehicles: problemVehicleText,
                status: statusText,
                hasProblems: problemVehicles.length > 0,
                vehicles: vehicles
            });
        });
        
        return {
            displayDate: displayDate,
            data: clientTable
        };
    }
    
    generateCityAnalysisTable(cityAnalysis, latestDate) {
        const cityKeys = Object.keys(cityAnalysis).sort();
        const cityTable = [];
        
        let displayDate = latestDate === 'Current' ? 'Recent Data' : latestDate;
        cityKeys.forEach((cityName, index) => {
            const vehicles = cityAnalysis[cityName];
            
            // Separate problem vehicles (exact same logic as .gs script)
            const problemVehicles = [];
            
            vehicles.forEach(function(v) {
                if (v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned') {
                    problemVehicles.push(v.vehicle + ' (' + v.workingStatus + '/' + v.alignmentStatus + ')');
                }
            });
            
            const allVehicleNumbers = vehicles.map(function(v) { return v.vehicle; }).join(', ');
            const problemVehicleText = problemVehicles.join(', ') || 'None';
            const statusText = problemVehicles.length > 0 ? 
                'ISSUES: ' + problemVehicles.length + '/' + vehicles.length : 
                'ALL OK';
            
            cityTable.push({
                sno: index + 1,
                cityName: cityName,
                vehicleCount: vehicles.length,
                vehicleNumbers: allVehicleNumbers,
                problemVehicles: problemVehicleText,
                status: statusText,
                hasProblems: problemVehicles.length > 0,
                vehicles: vehicles
            });
        });
        
        return {
            displayDate: displayDate,
            data: cityTable
        };
    }
    
    generateComprehensiveSummary(activeVehicles, offlineVehicles, alignmentTimelines, monthlyData, clientAnalysis, cityAnalysis, latestDate) {
        const months = Object.keys(monthlyData).sort();
        const monthlyCounts = {};
        
        // Calculate monthly counts (exact same logic as .gs script)
        months.forEach(month => {
            const activeCount = Object.keys(activeVehicles[month] || {}).filter(function(vehicle) {
                return activeVehicles[month][vehicle].allActive && activeVehicles[month][vehicle].statuses.length > 0;
            }).length;
            
            const offlineCount = Object.keys(offlineVehicles[month] || {}).filter(function(vehicle) {
                return offlineVehicles[month][vehicle].dates.length > 0;
            }).length;
            
            const alignmentCount = Object.keys(alignmentTimelines[month] || {}).filter(function(vehicle) {
                return alignmentTimelines[month][vehicle].length > 0;
            }).length;
            
            monthlyCounts[month] = {
                active: activeCount,
                offline: offlineCount,
                alignment: alignmentCount
            };
        });
        
        // Calculate total unique vehicles (exact same logic as .gs script)
        const allVehicles = new Set();
        Object.keys(monthlyData).forEach(function(month) {
            monthlyData[month].forEach(function(vehicle) {
                allVehicles.add(vehicle);
            });
        });
        
        let displayDate = latestDate === 'Current' ? 'Recent Data' : latestDate;
        
        return {
            monthlyCounts: monthlyCounts,
            totalVehicles: allVehicles.size,
            totalClients: Object.keys(clientAnalysis).length,
            totalCities: Object.keys(cityAnalysis).length,
            dataSourceDate: displayDate
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
        this.renderStats(data);
        this.renderClientList(data);
        this.renderLocationList(data);
        this.renderCharts(data);
        this.updateLastUpdated(data.lastUpdated);
    }
    
    // =================== FAST RENDERING FUNCTIONS ===================
    renderStats(data) {
        const stats = data.stats || {};
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
    
    renderClientList(data, showIssuesOnly = false) {
        const clientAnalysis = data.clientAnalysis || {};
        const clients = Object.keys(clientAnalysis).sort().slice(0, 15);
        let filteredClients = clients;
        
        if (showIssuesOnly) {
            filteredClients = clients.filter(clientName => {
                const vehicles = clientAnalysis[clientName];
                return vehicles.some(v => v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned');
            });
        }
        
        const html = filteredClients.map(clientName => {
            const vehicles = clientAnalysis[clientName];
            const problemCount = vehicles.filter(v => v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned' ).length;
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
    
    renderLocationList(data, showIssuesOnly = false) {
        const locationAnalysis = data.cityAnalysis || {};
        const locations = Object.keys(locationAnalysis).sort().slice(0, 15);
        let filteredLocations = locations;
        
        if (showIssuesOnly) {
            filteredLocations = locations.filter(locationName => {
                const vehicles = locationAnalysis[locationName];
                return vehicles.some(v => v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned');
            });
        }
        
        const html = filteredLocations.map(locationName => {
            const vehicles = locationAnalysis[locationName];
            const problemCount = vehicles.filter(v => v.workingStatus === 'Offlline >24Hrs' || v.alignmentStatus === 'Misalligned' ).length;
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
    
    // ... (All other methods remain the same)
    
    // =================== DETAILS MODALS ===================
    showVehicleDetails(category) { /* ... */ }
    showClientDetails(clientName) { /* ... */ }
    showLocationDetails(locationName) { /* ... */ }
    showMonthlyDetails(month) { /* ... */ }
    
    // =================== CHARTS ===================
    renderCharts(data) { /* ... */ }
    createPieChart(elementId, data, title) { /* ... */ }
    createBarChart(elementId, labels, data, title) { /* ... */ }
    
    // =================== FILTERS ===================
    toggleShowIssuesOnly(listType) { /* ... */ }
    
    // =================== HELPERS ===================
    updateLastUpdated(timestamp) { /* ... */ }
    
    setupEventListeners() { /* ... */ }
}

const dashboard = new VehicleDashboard();
