// AquaTrack Pro - Main Application Logic

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initApp();
});

// Global variables
let currentPage = 'dashboard';
let growthChart = null;
let mortalityChart = null;
let productionChart = null;

// Initialize the application
function initApp() {
    // Set current date
    updateCurrentDate();

    // Setup navigation
    setupNavigation();

    // Setup event listeners for buttons and forms
    setupEventListeners();

    // Initialize modals with dynamic data
    initializeModals();

    // Load dashboard data
    loadDashboard();

    // Update data count
    updateDataCount();

    // Initialize charts
    initCharts();

    // Load initial data for all pages
    loadStockPage();
    loadFeedPage();
    loadHealthPage();
    loadInventoryPage();
    loadReportsPage();
    loadSettingsPage();
}

// Update current date display
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
}

// Setup navigation between pages
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.getAttribute('data-page');

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Switch to selected page
            switchPage(pageId);
        });
    });
}

// Switch between pages
function switchPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;

        // Refresh page data
        refreshPageData(pageId);
    }
}

// Refresh data for the current page
function refreshPageData(pageId) {
    switch (pageId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'stock':
            loadStockPage();
            break;
        case 'feed':
            loadFeedPage();
            break;
        case 'health':
            loadHealthPage();
            break;
        case 'inventory':
            loadInventoryPage();
            break;
        case 'reports':
            loadReportsPage();
            break;
        case 'settings':
            loadSettingsPage();
            break;
    }
}

// Initialize modals with dynamic data
function initializeModals() {
    // Populate pond dropdowns
    populatePondDropdowns();

    // Populate feed type dropdowns
    populateFeedTypeDropdowns();

    // Set default dates to today
    setDefaultDates();
}

// Populate pond dropdowns in all modals
function populatePondDropdowns() {
    const ponds = dataManager.getData(DATA_KEYS.PONDS);

    // Stock Management modal
    const stockPondSelect = document.getElementById('stockPond');
    if (stockPondSelect) {
        stockPondSelect.innerHTML = '<option value="">Select Pond</option>';
        ponds.forEach(pond => {
            if (pond.status === 'empty') {
                const option = document.createElement('option');
                option.value = pond.id.substring(1); // Remove 'P' prefix
                option.textContent = `${pond.name} (${pond.type}, ${pond.volume}m³)`;
                stockPondSelect.appendChild(option);
            }
        });
    }

    // Other modals (feeding, water test, etc.)
    const modalSelects = [
        'feedingPond', 'waterTestPond', 'healthIssuePond', 'mortalityPond'
    ];

    modalSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Select Pond</option>';
            ponds.forEach(pond => {
                if (pond.status === 'active') {
                    const option = document.createElement('option');
                    option.value = pond.id.substring(1);
                    option.textContent = `${pond.name} (${pond.species})`;
                    select.appendChild(option);
                }
            });
        }
    });

    // Report pond filter
    const reportPondSelect = document.getElementById('reportPond');
    if (reportPondSelect) {
        reportPondSelect.innerHTML = '<option value="all">All Ponds</option>';
        ponds.forEach(pond => {
            const option = document.createElement('option');
            option.value = pond.id.substring(1);
            option.textContent = pond.name;
            reportPondSelect.appendChild(option);
        });
    }
}

// Populate feed type dropdowns
function populateFeedTypeDropdowns() {
    const feedTypes = dataManager.getFeedTypes();
    const feedingFeedTypeSelect = document.getElementById('feedingFeedType');

    if (feedingFeedTypeSelect) {
        feedingFeedTypeSelect.innerHTML = '<option value="">Select Feed</option>';
        feedTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            feedingFeedTypeSelect.appendChild(option);
        });
    }
}

// Set default dates to today
function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];

    const dateInputs = [
        'stockDate', 'targetHarvestDate', 'feedPurchaseDate', 'feedingDate',
        'waterTestDate', 'healthIssueDate', 'mortalityDate', 'inventoryRestockDate',
        'harvestDate'
    ];

    dateInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = today;
        }
    });

    // Set time inputs to current time
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0');

    const timeInputs = ['feedingTime', 'waterTestTime'];
    timeInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = timeString;
        }
    });
}

// Setup event listeners for buttons and forms
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('addStockBtn')?.addEventListener('click', () => {
        openModal('addStockModal');
        populatePondDropdowns(); // Refresh available ponds
    });

    document.getElementById('addFeedBtn')?.addEventListener('click', () => {
        openModal('addFeedModal');
    });

    document.getElementById('logFeedingBtn')?.addEventListener('click', () => {
        openModal('logFeedingModal');
        setDefaultDates();
    });

    document.getElementById('logWaterBtn')?.addEventListener('click', () => {
        openModal('logWaterTestModal');
        setDefaultDates();
    });

    document.getElementById('logHealthBtn')?.addEventListener('click', () => {
        openModal('logHealthIssueModal');
        setDefaultDates();
    });

    document.getElementById('logMortalityBtn')?.addEventListener('click', () => {
        openModal('logMortalityModal');
        setDefaultDates();
    });

    document.getElementById('addInventoryBtn')?.addEventListener('click', () => {
        openModal('addInventoryModal');
    });

    document.getElementById('addUserBtn')?.addEventListener('click', () => {
        openModal('addUserModal');
    });

    // Form submissions
    document.getElementById('addStockForm')?.addEventListener('submit', handleAddStock);
    document.getElementById('addFeedForm')?.addEventListener('submit', handleAddFeed);
    document.getElementById('logFeedingForm')?.addEventListener('submit', handleLogFeeding);
    document.getElementById('logWaterTestForm')?.addEventListener('submit', handleLogWaterTest);
    document.getElementById('logHealthIssueForm')?.addEventListener('submit', handleLogHealthIssue);
    document.getElementById('logMortalityForm')?.addEventListener('submit', handleLogMortality);
    document.getElementById('addInventoryForm')?.addEventListener('submit', handleAddInventory);
    document.getElementById('addUserForm')?.addEventListener('submit', handleAddUser);
    document.getElementById('saveFarmConfig')?.addEventListener('click', handleSaveFarmConfig);

    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAllModals();
            }
        });
    });

    // Search and filter
    document.getElementById('stockSearch')?.addEventListener('input', filterStockTable);
    document.getElementById('stockFilter')?.addEventListener('change', filterPonds);
    document.getElementById('inventorySearch')?.addEventListener('input', filterInventoryTable);
    document.getElementById('inventoryFilter')?.addEventListener('change', filterInventoryTable);

    // Report functionality
    document.querySelectorAll('.report-type').forEach(type => {
        type.addEventListener('click', handleReportTypeClick);
    });

    document.getElementById('generateReportBtn')?.addEventListener('click', generateReport);
    document.getElementById('exportDataBtn')?.addEventListener('click', exportData);
    document.getElementById('printReportBtn')?.addEventListener('click', printReport);

    // Data management
    document.getElementById('backupDataBtn')?.addEventListener('click', backupData);
    document.getElementById('restoreDataBtn')?.addEventListener('click', restoreData);
    document.getElementById('clearDataBtn')?.addEventListener('click', clearData);

    // Refresh buttons
    document.getElementById('refreshFeedBtn')?.addEventListener('click', () => loadFeedPage());
    document.getElementById('refreshHealthBtn')?.addEventListener('click', () => loadHealthPage());
    document.getElementById('refreshWaterBtn')?.addEventListener('click', () => loadHealthPage());
    document.getElementById('refreshMortalityBtn')?.addEventListener('click', () => loadHealthPage());
}

// Open a modal by ID
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close all modals
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// Update data count display
function updateDataCount() {
    const count = dataManager.getDataCount();
    document.getElementById('dataCount').textContent = count;
    document.getElementById('totalRecords').textContent = count;

    // Update storage usage
    const storageUsed = dataManager.getStorageUsage();
    document.getElementById('storageUsed').textContent = dataManager.formatStorageUsage(storageUsed);
}

// Initialize charts
function initCharts() {
    // Growth chart
    const growthCtx = document.getElementById('growthChart')?.getContext('2d');
    if (growthCtx) {
        const stock = dataManager.getActiveStock();
        const labels = [];
        const data = [];

        // Generate sample growth data
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i * 30);
            labels.push(date.toLocaleDateString('en-US', { month: 'short' }));

            // Simulate growth data
            const base = 1000;
            const growth = Math.random() * 200 + 50;
            data.push(base + (growth * (6 - i)));
        }

        growthChart = new Chart(growthCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Biomass (kg)',
                    data: data,
                    borderColor: '#2c7da0',
                    backgroundColor: 'rgba(44, 125, 160, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Biomass (kg)'
                        }
                    }
                }
            }
        });
    }

    // Mortality chart
    const mortalityCtx = document.getElementById('mortalityChart')?.getContext('2d');
    if (mortalityCtx) {
        const mortalityByCause = dataManager.getMortalityByCause(30);
        const causes = Object.keys(mortalityByCause);
        const counts = Object.values(mortalityByCause);

        mortalityChart = new Chart(mortalityCtx, {
            type: 'bar',
            data: {
                labels: causes.map(cause => {
                    const labels = {
                        'disease': 'Disease',
                        'handling': 'Handling',
                        'predation': 'Predation',
                        'water_quality': 'Water Quality',
                        'unknown': 'Unknown'
                    };
                    return labels[cause] || cause;
                }),
                datasets: [{
                    label: 'Mortality by Cause (Last 30 days)',
                    data: counts,
                    backgroundColor: [
                        'rgba(231, 76, 60, 0.7)',
                        'rgba(243, 156, 18, 0.7)',
                        'rgba(155, 89, 182, 0.7)',
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(149, 165, 166, 0.7)'
                    ],
                    borderColor: [
                        '#e74c3c',
                        '#f39c12',
                        '#9b59b6',
                        '#3498db',
                        '#95a5a6'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Mortality Count'
                        }
                    }
                }
            }
        });
    }

    // Production chart for reports
    const productionCtx = document.getElementById('productionChart')?.getContext('2d');
    if (productionCtx) {
        productionChart = new Chart(productionCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Stock Biomass (kg)',
                        data: [1200, 1900, 3000, 5000, 7200, 8900, 10200, 9500, 8200, 6500, 4200, 2800],
                        borderColor: '#2c7da0',
                        backgroundColor: 'rgba(44, 125, 160, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Feed Consumption (kg)',
                        data: [800, 950, 1200, 1800, 2200, 2500, 2800, 2600, 2100, 1700, 1200, 900],
                        borderColor: '#4c956c',
                        backgroundColor: 'rgba(76, 149, 108, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                stacked: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Biomass (kg)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Feed (kg)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }
}

// Load dashboard data
function loadDashboard() {
    const stats = dataManager.getFarmStats();
    const activity = dataManager.getRecentActivity(5);

    // Update metric cards
    document.getElementById('totalStock').textContent = stats.totalStock.toLocaleString();
    document.getElementById('totalBiomass').textContent = stats.totalBiomass;
    document.getElementById('weeklyFeed').textContent = stats.weeklyFeed;
    document.getElementById('survivalRate').textContent = `${stats.avgSurvivalRate}%`;
    document.getElementById('upcomingHarvests').textContent = stats.upcomingHarvests;

    // Update KPI values
    document.getElementById('adgValue').textContent = '2.1 g/day'; // Sample value
    document.getElementById('fcrValue').textContent = stats.avgFCR;
    document.getElementById('waterTemp').textContent = `${stats.avgTemp}°C`;
    document.getElementById('dissolvedOxygen').textContent = `${stats.avgDO} mg/L`;

    // Update next harvest date
    if (stats.nextHarvestDate) {
        const nextHarvestDate = new Date(stats.nextHarvestDate);
        document.getElementById('nextHarvestDate').textContent = nextHarvestDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
        document.getElementById('nextHarvestDate').textContent = '-';
    }

    // Update last update time
    const now = new Date();
    document.getElementById('lastUpdateTime').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Update activity list
    const activityList = document.getElementById('activityList');
    if (activityList && activity.length > 0) {
        activityList.innerHTML = '';

        activity.forEach(item => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';

            let iconClass = 'fas fa-info-circle';
            let iconColor = 'stock';

            switch (item.type) {
                case 'feeding':
                    iconClass = 'fas fa-utensils';
                    iconColor = 'feed';
                    break;
                case 'water_test':
                    iconClass = 'fas fa-vial';
                    iconColor = 'health';
                    break;
                case 'health_issues':
                    iconClass = 'fas fa-heartbeat';
                    iconColor = 'health';
                    break;
                case 'mortality':
                    iconClass = 'fas fa-skull-crossbones';
                    iconColor = 'health';
                    break;
                case 'stock':
                    iconClass = 'fas fa-fish';
                    iconColor = 'stock';
                    break;
            }

            activityItem.innerHTML = `
                <i class="${iconClass} activity-icon ${iconColor}"></i>
                <div class="activity-details">
                    <div class="activity-title">${item.description}</div>
                    <div class="activity-time">${item.date} at ${item.time}</div>
                </div>
            `;
            activityList.appendChild(activityItem);
        });
    }

    // Update charts with real data
    if (growthChart) {
        // Update growth chart data here if needed
    }
}

// Load stock page data
function loadStockPage() {
    const ponds = dataManager.getData(DATA_KEYS.PONDS);
    const stock = dataManager.getData(DATA_KEYS.STOCK);

    // Render pond cards
    renderPondCards(ponds);

    // Render stock table
    renderStockTable(stock);
}

// Render pond cards
function renderPondCards(ponds) {
    const container = document.getElementById('pondsContainer');
    if (!container) return;

    container.innerHTML = '';

    ponds.forEach(pond => {
        const stats = dataManager.getPondStats(pond.id);
        const pondStock = dataManager.getStockByPondId(pond.id);

        const pondCard = document.createElement('div');
        pondCard.className = `pond-card ${pond.status}`;

        let detailsHtml = '';
        if (pond.status === 'active' && pondStock.length > 0) {
            const stock = pondStock[0];
            detailsHtml = `
                <div class="pond-detail">
                    <span class="detail-label">Species:</span>
                    <span class="detail-value">${stock.species}</span>
                </div>
                <div class="pond-detail">
                    <span class="detail-label">Stock Count:</span>
                    <span class="detail-value">${stock.currentCount.toLocaleString()}</span>
                </div>
                <div class="pond-detail">
                    <span class="detail-label">Avg. Weight:</span>
                    <span class="detail-value">${stock.currentWeight}g</span>
                </div>
                ${stats ? `
                <div class="pond-detail">
                    <span class="detail-label">Estimated Biomass:</span>
                    <span class="detail-value">${stats.biomass} kg</span>
                </div>
                <div class="pond-detail">
                    <span class="detail-label">Days Stocked:</span>
                    <span class="detail-value">${stats.daysStocked}</span>
                </div>
                ` : ''}
            `;
        } else {
            detailsHtml = `
                <div class="pond-detail">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${pond.status === 'empty' ? 'Empty' : 'Resting'}</span>
                </div>
                <div class="pond-detail">
                    <span class="detail-label">Volume:</span>
                    <span class="detail-value">${pond.volume} m³</span>
                </div>
                <div class="pond-detail">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${pond.type}</span>
                </div>
                <div class="pond-detail">
                    <span class="detail-label">Dimensions:</span>
                    <span class="detail-value">${pond.dimensions}</span>
                </div>
            `;
        }

        pondCard.innerHTML = `
            <div class="pond-header">
                <div class="pond-name">${pond.name}</div>
                <div class="pond-status ${pond.status}">${pond.status}</div>
            </div>
            <div class="pond-details">
                ${detailsHtml}
            </div>
        `;

        container.appendChild(pondCard);
    });
}

// Render stock table
function renderStockTable(stock) {
    const tbody = document.getElementById('stockTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    stock.forEach(item => {
        const pond = dataManager.getPondById(item.pondId);
        const daysStocked = dataManager.getDaysBetweenDates(item.stockedDate, new Date().toISOString().split('T')[0]);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.species}</td>
            <td>${pond?.name || item.pondId}</td>
            <td>${item.initialCount.toLocaleString()}</td>
            <td>${item.currentCount.toLocaleString()}</td>
            <td>${item.currentWeight}g</td>
            <td>${daysStocked}</td>
            <td><span class="status-badge ${item.status}">${item.status}</span></td>
            <td class="action-buttons">
                <button class="btn-icon edit-stock" data-id="${item.id}" title="Edit Stock">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon harvest-stock" data-id="${item.id}" title="Record Harvest">
                    <i class="fas fa-sickle"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.edit-stock').forEach(button => {
        button.addEventListener('click', (e) => {
            const stockId = e.target.closest('button').getAttribute('data-id');
            openEditStockModal(stockId);
        });
    });

    document.querySelectorAll('.harvest-stock').forEach(button => {
        button.addEventListener('click', (e) => {
            const stockId = e.target.closest('button').getAttribute('data-id');
            openHarvestModal(stockId);
        });
    });
}

// Open edit stock modal
function openEditStockModal(stockId) {
    const stock = dataManager.getData(DATA_KEYS.STOCK).find(s => s.id === stockId);
    if (stock) {
        document.getElementById('editStockId').value = stockId;
        document.getElementById('editCurrentCount').value = stock.currentCount;
        document.getElementById('editCurrentWeight').value = stock.currentWeight;
        document.getElementById('editStockNotes').value = stock.notes || '';

        openModal('editStockModal');
    }
}

// Open harvest modal
function openHarvestModal(stockId) {
    const stock = dataManager.getData(DATA_KEYS.STOCK).find(s => s.id === stockId);
    if (stock) {
        const harvestStockSelect = document.getElementById('harvestStockId');
        if (harvestStockSelect) {
            harvestStockSelect.innerHTML = '';
            const option = document.createElement('option');
            option.value = stockId;
            option.textContent = `${stock.id} - ${stock.species} in Pond ${stock.pondId}`;
            harvestStockSelect.appendChild(option);
        }

        openModal('harvestModal');
    }
}

// Filter stock table
function filterStockTable() {
    const searchTerm = document.getElementById('stockSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#stockTableBody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Filter ponds by status
function filterPonds() {
    const status = document.getElementById('stockFilter').value;
    const cards = document.querySelectorAll('.pond-card');

    cards.forEach(card => {
        if (status === 'all') {
            card.style.display = '';
        } else {
            card.style.display = card.classList.contains(status) ? '' : 'none';
        }
    });
}

// Handle add stock form submission
function handleAddStock(e) {
    e.preventDefault();

    const species = document.getElementById('stockSpecies').value;
    const pondId = 'P' + document.getElementById('stockPond').value;
    const initialCount = parseInt(document.getElementById('initialCount').value);
    const initialWeight = parseFloat(document.getElementById('initialWeight').value);
    const stockDate = document.getElementById('stockDate').value;
    const targetHarvestDate = document.getElementById('targetHarvestDate').value;
    const source = document.getElementById('stockSource').value;
    const notes = document.getElementById('stockNotes').value;

    // Create stock object
    const newStock = {
        pondId,
        species,
        initialCount,
        currentCount: initialCount,
        initialWeight,
        currentWeight: initialWeight,
        stockedDate: stockDate,
        targetHarvestDate: targetHarvestDate || null,
        source,
        notes,
        status: 'active'
    };

    // Save to data manager
    const savedStock = dataManager.addItem(DATA_KEYS.STOCK, newStock);

    // Update pond status
    const pond = dataManager.getPondById(pondId);
    if (pond) {
        dataManager.updateItem(DATA_KEYS.PONDS, pondId, {
            ...pond,
            status: 'active',
            species,
            stockedDate: stockDate
        });
    }

    // Show success message
    showToast('New stock added successfully!', 'success');

    // Close modal
    closeAllModals();

    // Refresh stock page
    if (currentPage === 'stock') {
        loadStockPage();
    }

    // Refresh dashboard
    loadDashboard();

    // Update data count
    updateDataCount();

    // Reset form
    document.getElementById('addStockForm').reset();
}

// Load feed page data
function loadFeedPage() {
    const feedInventory = dataManager.getData(DATA_KEYS.FEED_INVENTORY);
    const feedingLogs = dataManager.getData(DATA_KEYS.FEEDING_LOGS);

    // Update metrics
    const totalBags = feedInventory.reduce((sum, item) => sum + item.bags, 0);
    document.getElementById('totalFeedBags').textContent = totalBags;

    // Weekly consumption
    const weeklyConsumption = feedingLogs
        .filter(log => {
            const logDate = new Date(log.date);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return logDate >= oneWeekAgo;
        })
        .reduce((sum, log) => sum + log.quantity, 0);
    document.getElementById('weeklyConsumption').textContent = weeklyConsumption.toFixed(1);

    // Average FCR
    const stats = dataManager.getFarmStats();
    document.getElementById('avgFCR').textContent = stats.avgFCR;

    // Low stock alerts
    const lowStockAlerts = feedInventory.filter(item => item.status === 'low').length;
    document.getElementById('lowStockAlerts').textContent = lowStockAlerts;

    // Render feed inventory table
    renderFeedInventoryTable(feedInventory);

    // Render feeding logs table
    renderFeedingLogsTable(feedingLogs);
}

// Render feed inventory table
function renderFeedInventoryTable(feedInventory) {
    const tbody = document.getElementById('feedInventoryBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    feedInventory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.type}</td>
            <td>${item.protein}%</td>
            <td>${item.bags}</td>
            <td>${item.totalWeight} kg</td>
            <td>${new Date(item.lastPurchase).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td><span class="status-badge ${item.status}">${item.status === 'good' ? 'Good' : 'Low Stock'}</span></td>
            <td class="action-buttons">
                <button class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" title="Use Feed">
                    <i class="fas fa-hand-holding"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render feeding logs table
function renderFeedingLogsTable(feedingLogs) {
    const tbody = document.getElementById('feedingLogsBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Sort by date (most recent first)
    feedingLogs.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

    feedingLogs.forEach(log => {
        const pond = dataManager.getPondById(log.pondId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
            <td>${pond?.name || log.pondId}</td>
            <td>${log.feedType}</td>
            <td>${log.quantity}</td>
            <td>${log.time}</td>
            <td>${log.notes || '-'}</td>
            <td class="action-buttons">
                <button class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Handle add feed form submission
function handleAddFeed(e) {
    e.preventDefault();

    const feedType = document.getElementById('feedType').value;
    const protein = parseInt(document.getElementById('feedProtein').value);
    const bags = parseInt(document.getElementById('feedBags').value);
    const bagWeight = parseInt(document.getElementById('feedBagWeight').value);
    const lastPurchase = document.getElementById('feedPurchaseDate').value;

    const newFeed = {
        type: feedType,
        protein: protein,
        bags: bags,
        bagWeight: bagWeight,
        totalWeight: bags * bagWeight,
        lastPurchase: lastPurchase,
        status: bags > 10 ? 'good' : 'low'
    };

    dataManager.addItem(DATA_KEYS.FEED_INVENTORY, newFeed);

    showToast('Feed added to inventory successfully!', 'success');
    closeAllModals();

    if (currentPage === 'feed') {
        loadFeedPage();
    }

    document.getElementById('addFeedForm').reset();
}

// Handle log feeding form submission
function handleLogFeeding(e) {
    e.preventDefault();

    const pondId = 'P' + document.getElementById('feedingPond').value;
    const feedType = document.getElementById('feedingFeedType').value;
    const quantity = parseFloat(document.getElementById('feedingQuantity').value);
    const date = document.getElementById('feedingDate').value;
    const time = document.getElementById('feedingTime').value;
    const notes = document.getElementById('feedingNotes').value;

    const newFeedingLog = {
        pondId: pondId,
        feedType: feedType,
        quantity: quantity,
        date: date,
        time: time,
        notes: notes
    };

    dataManager.addItem(DATA_KEYS.FEEDING_LOGS, newFeedingLog);

    showToast('Feeding logged successfully!', 'success');
    closeAllModals();

    if (currentPage === 'feed') {
        loadFeedPage();
    }

    document.getElementById('logFeedingForm').reset();
}

// Load health page data
function loadHealthPage() {
    const waterTests = dataManager.getData(DATA_KEYS.WATER_TESTS);
    const healthIssues = dataManager.getData(DATA_KEYS.HEALTH_ISSUES);
    const mortality = dataManager.getData(DATA_KEYS.MORTALITY);

    // Update current water parameters (use most recent test)
    if (waterTests.length > 0) {
        const latestTest = waterTests[waterTests.length - 1];
        document.getElementById('tempValue').textContent = latestTest.temp;
        document.getElementById('doValue').textContent = latestTest.do;
        document.getElementById('phValue').textContent = latestTest.ph;
        document.getElementById('ammoniaValue').textContent = latestTest.ammonia;
    }

    // Update mortality statistics
    const today = new Date().toISOString().split('T')[0];
    const todayMortality = mortality
        .filter(m => m.date === today)
        .reduce((sum, m) => sum + m.count, 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekMortality = mortality
        .filter(m => new Date(m.date) >= oneWeekAgo)
        .reduce((sum, m) => sum + m.count, 0);

    const thisMonth = new Date().getMonth();
    const monthMortality = mortality
        .filter(m => new Date(m.date).getMonth() === thisMonth)
        .reduce((sum, m) => sum + m.count, 0);

    document.getElementById('todayMortality').textContent = todayMortality;
    document.getElementById('weekMortality').textContent = weekMortality;
    document.getElementById('monthMortality').textContent = monthMortality;

    // Render health issues table
    renderHealthIssuesTable(healthIssues);

    // Render water tests table
    renderWaterTestsTable(waterTests);

    // Render mortality table
    renderMortalityTable(mortality);
}

// Render health issues table
function renderHealthIssuesTable(healthIssues) {
    const tbody = document.getElementById('healthIssuesBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Sort by date (most recent first)
    healthIssues.sort((a, b) => new Date(b.date) - new Date(a.date));

    healthIssues.forEach(issue => {
        const pond = dataManager.getPondById(issue.pondId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(issue.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
            <td>${pond?.name || issue.pondId}</td>
            <td>${issue.issue}</td>
            <td>${issue.affectedCount}</td>
            <td>${issue.treatment}</td>
            <td><span class="status-badge ${issue.status}">${issue.status}</span></td>
            <td class="action-buttons">
                <button class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render water tests table
function renderWaterTestsTable(waterTests) {
    const tbody = document.getElementById('waterTestsBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Sort by date (most recent first)
    waterTests.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

    waterTests.forEach(test => {
        const pond = dataManager.getPondById(test.pondId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
            <td>${pond?.name || test.pondId}</td>
            <td>${test.temp}°C</td>
            <td>${test.do} mg/L</td>
            <td>${test.ph}</td>
            <td>${test.ammonia} ppm</td>
            <td>${test.recordedBy}</td>
            <td class="action-buttons">
                <button class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render mortality table
function renderMortalityTable(mortality) {
    const tbody = document.getElementById('mortalityTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Sort by date (most recent first)
    mortality.sort((a, b) => new Date(b.date) - new Date(a.date));

    mortality.forEach(record => {
        const pond = dataManager.getPondById(record.pondId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
            <td>${pond?.name || record.pondId}</td>
            <td>${record.count}</td>
            <td>${record.cause}</td>
            <td>${record.notes || '-'}</td>
            <td class="action-buttons">
                <button class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Handle log water test form submission
function handleLogWaterTest(e) {
    e.preventDefault();

    const pondId = 'P' + document.getElementById('waterTestPond').value;
    const date = document.getElementById('waterTestDate').value;
    const time = document.getElementById('waterTestTime').value;
    const temp = parseFloat(document.getElementById('waterTemp').value);
    const doValue = parseFloat(document.getElementById('waterDO').value);
    const ph = parseFloat(document.getElementById('waterPH').value);
    const ammonia = parseFloat(document.getElementById('waterAmmonia').value);
    const recordedBy = document.getElementById('waterTestRecordedBy').value;

    const newWaterTest = {
        pondId: pondId,
        date: date,
        time: time,
        temp: temp,
        do: doValue,
        ph: ph,
        ammonia: ammonia,
        recordedBy: recordedBy
    };

    dataManager.addItem(DATA_KEYS.WATER_TESTS, newWaterTest);

    showToast('Water test logged successfully!', 'success');
    closeAllModals();

    if (currentPage === 'health') {
        loadHealthPage();
    }

    document.getElementById('logWaterTestForm').reset();
}

// Handle log health issue form submission
function handleLogHealthIssue(e) {
    e.preventDefault();

    const pondId = 'P' + document.getElementById('healthIssuePond').value;
    const date = document.getElementById('healthIssueDate').value;
    const issue = document.getElementById('healthIssue').value;
    const affectedCount = parseInt(document.getElementById('affectedCount').value);
    const symptoms = document.getElementById('healthSymptoms').value;
    const treatment = document.getElementById('healthTreatment').value;
    const status = document.getElementById('healthStatus').value;
    const notes = document.getElementById('healthIssueNotes').value;

    const newHealthIssue = {
        pondId: pondId,
        date: date,
        issue: issue,
        symptoms: symptoms,
        affectedCount: affectedCount,
        treatment: treatment,
        status: status,
        notes: notes
    };

    dataManager.addItem(DATA_KEYS.HEALTH_ISSUES, newHealthIssue);

    showToast('Health issue logged successfully!', 'success');
    closeAllModals();

    if (currentPage === 'health') {
        loadHealthPage();
    }

    document.getElementById('logHealthIssueForm').reset();
}

// Handle log mortality form submission
function handleLogMortality(e) {
    e.preventDefault();

    const pondId = 'P' + document.getElementById('mortalityPond').value;
    const date = document.getElementById('mortalityDate').value;
    const count = parseInt(document.getElementById('mortalityCount').value);
    const cause = document.getElementById('mortalityCause').value;
    const notes = document.getElementById('mortalityNotes').value;

    const newMortality = {
        pondId: pondId,
        date: date,
        count: count,
        cause: cause,
        notes: notes
    };

    dataManager.addItem(DATA_KEYS.MORTALITY, newMortality);

    // Update stock count for the pond
    const stock = dataManager.getStockByPondId(pondId);
    if (stock.length > 0) {
        const currentStock = stock[0];
        dataManager.updateItem(DATA_KEYS.STOCK, currentStock.id, {
            ...currentStock,
            currentCount: currentStock.currentCount - count
        });
    }

    showToast('Mortality logged successfully!', 'success');
    closeAllModals();

    if (currentPage === 'health') {
        loadHealthPage();
    }
    if (currentPage === 'stock') {
        loadStockPage();
    }

    document.getElementById('logMortalityForm').reset();
}

// Load inventory page data
function loadInventoryPage() {
    const inventory = dataManager.getData(DATA_KEYS.INVENTORY);
    const inventoryStatus = dataManager.getInventoryStatus();

    // Update metrics
    document.getElementById('totalItems').textContent = inventoryStatus.totalItems;
    document.getElementById('lowStockItems').textContent = inventoryStatus.lowStockItems;
    document.getElementById('inventoryValue').textContent = `$${inventoryStatus.inventoryValue}`;

    // Recently used (items used in last 7 days)
    const recentlyUsed = 12; // Sample value
    document.getElementById('recentlyUsed').textContent = recentlyUsed;

    // Render inventory table
    renderInventoryTable(inventory);
}

// Render inventory table
function renderInventoryTable(inventory) {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    inventory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${new Date(item.lastRestock).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
            <td>${item.minStock}</td>
            <td><span class="status-badge ${item.status}">${item.status === 'good' ? 'Good' : 'Low'}</span></td>
            <td class="action-buttons">
                <button class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" title="Use Item">
                    <i class="fas fa-hand-holding"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filter inventory table
function filterInventoryTable() {
    const searchTerm = document.getElementById('inventorySearch').value.toLowerCase();
    const category = document.getElementById('inventoryFilter').value;
    const rows = document.querySelectorAll('#inventoryTableBody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const rowCategory = row.cells[1].textContent.toLowerCase();

        const matchesSearch = !searchTerm || text.includes(searchTerm);
        const matchesCategory = category === 'all' || rowCategory === category;

        row.style.display = matchesSearch && matchesCategory ? '' : 'none';
    });
}

// Handle add inventory form submission
function handleAddInventory(e) {
    e.preventDefault();

    const name = document.getElementById('inventoryName').value;
    const category = document.getElementById('inventoryCategory').value;
    const quantity = parseInt(document.getElementById('inventoryQuantity').value);
    const unit = document.getElementById('inventoryUnit').value;
    const minStock = parseInt(document.getElementById('inventoryMinStock').value);
    const lastRestock = document.getElementById('inventoryRestockDate').value;

    const newInventoryItem = {
        name: name,
        category: category,
        quantity: quantity,
        unit: unit,
        minStock: minStock,
        lastRestock: lastRestock,
        status: quantity > minStock ? 'good' : 'low'
    };

    dataManager.addItem(DATA_KEYS.INVENTORY, newInventoryItem);

    showToast('Inventory item added successfully!', 'success');
    closeAllModals();

    if (currentPage === 'inventory') {
        loadInventoryPage();
    }

    document.getElementById('addInventoryForm').reset();
}

// Load reports page data
function loadReportsPage() {
    // Populate report pond filter
    populateReportPondFilter();
}

// Populate report pond filter
function populateReportPondFilter() {
    const ponds = dataManager.getData(DATA_KEYS.PONDS);
    const reportPondSelect = document.getElementById('reportPond');

    if (reportPondSelect) {
        reportPondSelect.innerHTML = '<option value="all">All Ponds</option>';
        ponds.forEach(pond => {
            const option = document.createElement('option');
            option.value = pond.id.substring(1);
            option.textContent = pond.name;
            reportPondSelect.appendChild(option);
        });
    }
}

// Handle report type click
function handleReportTypeClick(e) {
    const reportType = e.currentTarget;

    // Update active report type
    document.querySelectorAll('.report-type').forEach(t => t.classList.remove('active'));
    reportType.classList.add('active');
}

// Generate report
function generateReport() {
    const reportType = document.querySelector('.report-type.active')?.getAttribute('data-report') || 'production';
    const period = document.getElementById('reportPeriod').value;
    const pond = document.getElementById('reportPond').value;
    const species = document.getElementById('reportSpecies').value;

    let reportHtml = '';

    switch (reportType) {
        case 'production':
            reportHtml = generateProductionReport(period, pond, species);
            break;
        case 'financial':
            reportHtml = generateFinancialReport(period, pond, species);
            break;
        case 'performance':
            reportHtml = generatePerformanceReport(period, pond, species);
            break;
        case 'inventory':
            reportHtml = generateInventoryReport(period);
            break;
        default:
            reportHtml = generateProductionReport(period, pond, species);
    }

    document.getElementById('reportContent').innerHTML = reportHtml;

    showToast('Report generated successfully!', 'success');
}

// Generate production report
function generateProductionReport(period, pond, species) {
    const stock = dataManager.getActiveStock();
    const filteredStock = stock.filter(s => {
        return (pond === 'all' || s.pondId === `P${pond}`) &&
            (species === 'all' || s.species.toLowerCase() === species);
    });

    const totalInitial = filteredStock.reduce((sum, s) => sum + s.initialCount, 0);
    const totalCurrent = filteredStock.reduce((sum, s) => sum + s.currentCount, 0);
    const totalBiomass = filteredStock.reduce((sum, s) => sum + (s.currentCount * s.currentWeight), 0) / 1000;
    const avgSurvival = filteredStock.length > 0
        ? (filteredStock.reduce((sum, s) => sum + (s.currentCount / s.initialCount * 100), 0) / filteredStock.length).toFixed(1)
        : 0;

    return `
        <div class="report-preview-content">
            <h4>Production Summary Report</h4>
            <p><strong>Period:</strong> ${getPeriodText(period)}</p>
            <p><strong>Filter:</strong> ${pond !== 'all' ? `Pond ${pond}, ` : ''}${species !== 'all' ? species : 'All Species'}</p>
            
            <div class="report-metrics">
                <div class="report-metric">
                    <div class="metric-label">Total Stock Count</div>
                    <div class="metric-value">${totalCurrent.toLocaleString()}</div>
                </div>
                <div class="report-metric">
                    <div class="metric-label">Estimated Biomass</div>
                    <div class="metric-value">${totalBiomass.toFixed(2)} kg</div>
                </div>
                <div class="report-metric">
                    <div class="metric-label">Average Survival Rate</div>
                    <div class="metric-value">${avgSurvival}%</div>
                </div>
                <div class="report-metric">
                    <div class="metric-label">Number of Batches</div>
                    <div class="metric-value">${filteredStock.length}</div>
                </div>
            </div>
            
            <h5>Batch Details</h5>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Batch ID</th>
                        <th>Species</th>
                        <th>Pond</th>
                        <th>Initial Count</th>
                        <th>Current Count</th>
                        <th>Survival Rate</th>
                        <th>Avg. Weight</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredStock.map(s => {
        const pond = dataManager.getPondById(s.pondId);
        return `
                            <tr>
                                <td>${s.id}</td>
                                <td>${s.species}</td>
                                <td>${pond?.name || s.pondId}</td>
                                <td>${s.initialCount.toLocaleString()}</td>
                                <td>${s.currentCount.toLocaleString()}</td>
                                <td>${((s.currentCount / s.initialCount) * 100).toFixed(1)}%</td>
                                <td>${s.currentWeight}g</td>
                            </tr>
                        `;
    }).join('')}
                </tbody>
            </table>
            
            <div class="report-footer">
                <p>Report generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
    `;
}

// Generate financial report
function generateFinancialReport(period, pond, species) {
    // Calculate financial metrics
    const feedInventory = dataManager.getData(DATA_KEYS.FEED_INVENTORY);
    const stock = dataManager.getActiveStock();
    const inventory = dataManager.getData(DATA_KEYS.INVENTORY);
    const harvests = dataManager.getHarvestHistory();

    const totalFeedCost = feedInventory.reduce((sum, item) => {
        const price = item.pricePerBag || 0;
        return sum + (item.bags * price);
    }, 0);

    const totalInventoryValue = inventory.reduce((sum, item) => {
        const price = item.pricePerUnit || 0;
        return sum + (item.quantity * price);
    }, 0);

    const totalHarvestValue = harvests.reduce((sum, harvest) => sum + (harvest.totalValue || 0), 0);

    const estimatedRevenue = totalHarvestValue * 1.5; // Estimate 50% growth

    const profit = estimatedRevenue - totalFeedCost - totalInventoryValue;
    const profitMargin = estimatedRevenue > 0 ? (profit / estimatedRevenue * 100) : 0;

    return `
        <div class="report-preview-content">
            <h4>Financial Overview Report</h4>
            <p><strong>Period:</strong> ${getPeriodText(period)}</p>
            
            <div class="report-metrics">
                <div class="report-metric">
                    <div class="metric-label">Total Feed Cost</div>
                    <div class="metric-value">$${totalFeedCost.toFixed(2)}</div>
                </div>
                <div class="report-metric">
                    <div class="metric-label">Inventory Value</div>
                    <div class="metric-value">$${totalInventoryValue.toFixed(2)}</div>
                </div>
                <div class="report-metric">
                    <div class="metric-label">Estimated Revenue</div>
                    <div class="metric-value">$${estimatedRevenue.toFixed(2)}</div>
                </div>
                <div class="report-metric">
                    <div class="metric-label">Projected Profit</div>
                    <div class="metric-value">$${profit.toFixed(2)}</div>
                </div>
            </div>
            
            <h5>Cost Breakdown</h5>
            <div class="chart-placeholder">
                <div class="placeholder-text">Cost distribution chart would appear here</div>
            </div>
            
            <h5>Profitability Analysis</h5>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total Cost of Production</td>
                        <td>$${(totalFeedCost + totalInventoryValue).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Estimated Revenue</td>
                        <td>$${estimatedRevenue.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Gross Profit</td>
                        <td>$${profit.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td>Profit Margin</td>
                        <td>${profitMargin.toFixed(1)}%</td>
                    </tr>
                    <tr>
                        <td>Return on Investment</td>
                        <td>${(profitMargin * 1.5).toFixed(1)}%</td>
                    </tr>
                </tbody>
            </table>
            
            <div class="report-footer">
                <p>Report generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
    `;
}

// Generate performance report
function generatePerformanceReport(period, pond, species) {
    const stock = dataManager.getActiveStock();
    const filteredStock = pond === 'all' ? stock : stock.filter(s => s.pondId === `P${pond}`);

    let performanceData = [];

    filteredStock.forEach(s => {
        const pond = dataManager.getPondById(s.pondId);
        const stats = dataManager.getPondStats(s.pondId);

        if (stats) {
            performanceData.push({
                pond: pond?.name || s.pondId,
                species: s.species,
                fcr: parseFloat(stats.avgFCR) || 1.5,
                survivalRate: parseFloat(stats.survivalRate) || 95,
                adg: parseFloat(stats.adg) || 2.0,
                biomassGain: parseFloat(stats.biomass) || 500
            });
        }
    });

    return `
        <div class="report-preview-content">
            <h4>Performance Comparison Report</h4>
            <p><strong>Period:</strong> ${getPeriodText(period)}</p>
            <p><strong>Filter:</strong> ${pond !== 'all' ? `Pond ${pond}, ` : ''}${species !== 'all' ? species : 'All Species'}</p>
            
            <h5>Key Performance Indicators Comparison</h5>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Pond</th>
                        <th>Species</th>
                        <th>FCR</th>
                        <th>Survival Rate</th>
                        <th>ADG (g/day)</th>
                        <th>Biomass (kg)</th>
                    </tr>
                </thead>
                <tbody>
                    ${performanceData.map(data => `
                        <tr>
                            <td>${data.pond}</td>
                            <td>${data.species}</td>
                            <td>${data.fcr.toFixed(2)}</td>
                            <td>${data.survivalRate.toFixed(1)}%</td>
                            <td>${data.adg.toFixed(2)}</td>
                            <td>${data.biomassGain.toFixed(1)}</td>
                        </tr>
                    `).join('')}
                    ${performanceData.length > 1 ? `
                    <tr>
                        <td><strong>Average</strong></td>
                        <td></td>
                        <td><strong>${(performanceData.reduce((sum, d) => sum + d.fcr, 0) / performanceData.length).toFixed(2)}</strong></td>
                        <td><strong>${(performanceData.reduce((sum, d) => sum + d.survivalRate, 0) / performanceData.length).toFixed(1)}%</strong></td>
                        <td><strong>${(performanceData.reduce((sum, d) => sum + d.adg, 0) / performanceData.length).toFixed(2)}</strong></td>
                        <td><strong>${(performanceData.reduce((sum, d) => sum + d.biomassGain, 0) / performanceData.length).toFixed(1)}</strong></td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>
            
            <h5>Performance Trends</h5>
            <div class="chart-placeholder">
                <div class="placeholder-text">Performance trend chart would appear here</div>
            </div>
            
            <h5>Recommendations</h5>
            <ul class="recommendations">
                <li>Monitor ponds with FCR above 1.5 for potential feed efficiency improvements</li>
                <li>Focus on ponds with survival rates below 95% for health management</li>
                <li>Consider adjusting feeding schedules based on ADG performance</li>
            </ul>
            
            <div class="report-footer">
                <p>Report generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
    `;
}

// Generate inventory report
function generateInventoryReport(period) {
    const inventory = dataManager.getData(DATA_KEYS.INVENTORY);
    const lowStockItems = inventory.filter(item => item.quantity <= item.minStock);
    const inventoryStatus = dataManager.getInventoryStatus();

    // Group by category
    const byCategory = {};
    inventory.forEach(item => {
        if (!byCategory[item.category]) {
            byCategory[item.category] = {
                count: 0,
                quantity: 0,
                lowStock: 0
            };
        }
        byCategory[item.category].count++;
        byCategory[item.category].quantity += item.quantity;
        if (item.quantity <= item.minStock) {
            byCategory[item.category].lowStock++;
        }
    });

    return `
        <div class="report-preview-content">
            <h4>Inventory Report</h4>
            <p><strong>Period:</strong> ${getPeriodText(period)}</p>
            
            <div class="report-metrics">
                <div class="report-metric">
                    <div class="metric-label">Total Items</div>
                    <div class="metric-value">${inventoryStatus.totalItems}</div>
                </div>
                <div class="report-metric">
                    <div class="metric-label">Low Stock Items</div>
                    <div class="metric-value">${inventoryStatus.lowStockItems}</div>
                </div>
                <div class="report-metric">
                    <div class="metric-label">Total Value</div>
                    <div class="metric-value">$${inventoryStatus.inventoryValue}</div>
                </div>
            </div>
            
            <h5>Low Stock Items (Need Reordering)</h5>
            ${lowStockItems.length > 0 ? `
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Current Stock</th>
                        <th>Minimum Stock</th>
                        <th>Last Restock</th>
                        <th>Urgency</th>
                    </tr>
                </thead>
                <tbody>
                    ${lowStockItems.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.category}</td>
                            <td>${item.quantity} ${item.unit}</td>
                            <td>${item.minStock}</td>
                            <td>${new Date(item.lastRestock).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                            <td><span class="urgency-high">High</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<p>No items are currently below minimum stock levels.</p>'}
            
            <h5>Inventory by Category</h5>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Item Count</th>
                        <th>Total Quantity</th>
                        <th>Low Stock Items</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(byCategory).map(([category, data]) => `
                        <tr>
                            <td>${category}</td>
                            <td>${data.count}</td>
                            <td>${data.quantity}</td>
                            <td>${data.lowStock}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="report-footer">
                <p>Report generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
        </div>
    `;
}

// Get period text for reports
function getPeriodText(period) {
    const periods = {
        'last-month': 'Last Month',
        'last-quarter': 'Last Quarter',
        'last-year': 'Last Year',
        'all-time': 'All Time'
    };
    return periods[period] || period;
}

// Export data
function exportData() {
    const data = dataManager.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquatrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Data exported successfully!', 'success');
}

// Print report
function printReport() {
    window.print();
}

// Backup data (same as export)
function backupData() {
    exportData();
}

// Restore data
function restoreData() {
    // Create file input for restore
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const success = dataManager.importData(event.target.result);
            if (success) {
                showToast('Data restored successfully!', 'success');
                // Reload all data
                refreshPageData(currentPage);
                loadDashboard();
                updateDataCount();
                initializeModals();
            } else {
                showToast('Error restoring data. Please check file format.', 'error');
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// Clear all data
function clearData() {
    if (confirm('Are you sure you want to clear all data? This will reload sample data and cannot be undone.')) {
        dataManager.clearAllData();
        showToast('All data cleared and sample data reloaded', 'success');
        // Reload all data
        refreshPageData(currentPage);
        loadDashboard();
        updateDataCount();
        initializeModals();
    }
}

// Load settings page data
function loadSettingsPage() {
    const settings = dataManager.getData(DATA_KEYS.SETTINGS);
    const users = dataManager.getData(DATA_KEYS.USERS);

    // Load settings into form
    if (settings) {
        document.getElementById('farmName').value = settings.farmName || 'BlueFin Aquaculture';
        document.getElementById('farmLocation').value = settings.farmLocation || 'Lakeside, Aqua District';
        document.getElementById('totalPonds').value = settings.totalPonds || 8;
        document.getElementById('mainSpecies').value = settings.mainSpecies || 'tilapia';

        // Update farm name display
        document.getElementById('farmNameDisplay').textContent = settings.farmName;
    }

    // Update backup date
    if (settings && settings.backupDate) {
        const backupDate = new Date(settings.backupDate);
        document.getElementById('lastBackup').textContent = backupDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } else {
        document.getElementById('lastBackup').textContent = 'Never';
    }

    // Render user list
    renderUserList(users);
}

// Render user list
function renderUserList(users) {
    const userList = document.getElementById('userList');
    if (!userList) return;

    userList.innerHTML = '';

    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';

        const roleText = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never';

        userItem.innerHTML = `
            <div class="user-info-small">
                <div class="user-avatar-small">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-details-small">
                    <div class="user-name">${user.name}</div>
                    <div class="user-role">${roleText}</div>
                    <div class="user-email">${user.email}</div>
                    <div class="user-last-login">Last login: ${lastLogin}</div>
                </div>
            </div>
            <div class="user-actions">
                <button class="btn-icon" title="Edit User">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" title="Remove User">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        userList.appendChild(userItem);
    });
}

// Handle add user form submission
function handleAddUser(e) {
    e.preventDefault();

    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const role = document.getElementById('userRole').value;
    const password = document.getElementById('userPassword').value;
    const confirmPassword = document.getElementById('userConfirmPassword').value;

    // Validate passwords match
    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address!', 'error');
        return;
    }

    // Check if user already exists
    const users = dataManager.getData(DATA_KEYS.USERS);
    if (users.some(user => user.email === email)) {
        showToast('User with this email already exists!', 'error');
        return;
    }

    // Create user object
    const newUser = {
        name: name,
        email: email,
        role: role,
        lastLogin: null,
        createdAt: new Date().toISOString().split('T')[0]
    };

    // In a real app, you would hash the password before storing
    // For this demo, we'll store it (not recommended for production)
    if (password) {
        newUser.password = password;
    }

    dataManager.addItem(DATA_KEYS.USERS, newUser);

    showToast('User added successfully!', 'success');
    closeAllModals();

    if (currentPage === 'settings') {
        loadSettingsPage();
    }

    document.getElementById('addUserForm').reset();
}

// Handle save farm configuration
function handleSaveFarmConfig() {
    const farmName = document.getElementById('farmName').value;
    const farmLocation = document.getElementById('farmLocation').value;
    const totalPonds = parseInt(document.getElementById('totalPonds').value);
    const mainSpecies = document.getElementById('mainSpecies').value;

    const settings = {
        farmName,
        farmLocation,
        totalPonds,
        mainSpecies,
        currency: 'USD',
        lowStockThreshold: 10,
        backupDate: new Date().toISOString()
    };

    dataManager.saveData(DATA_KEYS.SETTINGS, settings);

    // Update farm name in header
    document.getElementById('farmNameDisplay').textContent = farmName;

    showToast('Farm configuration saved successfully!', 'success');
}

// Show toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${getToastIcon(type)}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${getToastTitle(type)}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">&times;</button>
    `;

    container.appendChild(toast);

    // Add close button event
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

// Get toast icon based on type
function getToastIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Get toast title based on type
function getToastTitle(type) {
    switch (type) {
        case 'success': return 'Success';
        case 'error': return 'Error';
        case 'warning': return 'Warning';
        default: return 'Information';
    }
}