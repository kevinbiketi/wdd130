// AquaTrack Pro - Data Management
// This file handles all data operations for the fish farm management system

// Initialize localStorage keys
const DATA_KEYS = {
    STOCK: 'aquatrack_stock',
    PONDS: 'aquatrack_ponds',
    FEED_INVENTORY: 'aquatrack_feed_inventory',
    FEEDING_LOGS: 'aquatrack_feeding_logs',
    WATER_TESTS: 'aquatrack_water_tests',
    HEALTH_ISSUES: 'aquatrack_health_issues',
    MORTALITY: 'aquatrack_mortality',
    INVENTORY: 'aquatrack_inventory',
    USERS: 'aquatrack_users',
    SETTINGS: 'aquatrack_settings',
    HARVESTS: 'aquatrack_harvests',
    ACTIVITY_LOGS: 'aquatrack_activity_logs'
};

// Helper function to get date strings
function getDateString(daysOffset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
}

// Get current time string
function getTimeString() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' +
        now.getMinutes().toString().padStart(2, '0');
}

// Sample data for initial setup
const SAMPLE_DATA = {
    ponds: [
        {
            id: 'P001',
            name: 'Pond A1',
            type: 'Earthen',
            volume: 500,
            dimensions: '20m x 25m',
            status: 'active',
            species: 'Tilapia',
            stockedDate: getDateString(-90),
            notes: 'Main production pond, good sunlight exposure',
            createdAt: getDateString(-100),
            updatedAt: getDateString(-1)
        },
        {
            id: 'P002',
            name: 'Pond A2',
            type: 'Earthen',
            volume: 500,
            dimensions: '20m x 25m',
            status: 'active',
            species: 'Tilapia',
            stockedDate: getDateString(-75),
            notes: 'Good water circulation, recently renovated',
            createdAt: getDateString(-95),
            updatedAt: getDateString(-2)
        },
        {
            id: 'P003',
            name: 'Pond B1',
            type: 'Concrete',
            volume: 300,
            dimensions: '10m x 30m',
            status: 'active',
            species: 'Trout',
            stockedDate: getDateString(-60),
            notes: 'Requires cold water supply, shade provided',
            createdAt: getDateString(-70),
            updatedAt: getDateString(-3)
        },
        {
            id: 'P004',
            name: 'Pond B2',
            type: 'Concrete',
            volume: 300,
            dimensions: '10m x 30m',
            status: 'active',
            species: 'Trout',
            stockedDate: getDateString(-45),
            notes: 'New concrete lining, excellent condition',
            createdAt: getDateString(-55),
            updatedAt: getDateString(-4)
        },
        {
            id: 'P005',
            name: 'Pond C1',
            type: 'Earthen',
            volume: 600,
            dimensions: '25m x 24m',
            status: 'resting',
            species: null,
            stockedDate: null,
            notes: 'Being treated with lime, will rest for 2 weeks',
            createdAt: getDateString(-120),
            updatedAt: getDateString(-10)
        },
        {
            id: 'P006',
            name: 'Pond C2',
            type: 'Earthen',
            volume: 600,
            dimensions: '25m x 24m',
            status: 'empty',
            species: null,
            stockedDate: null,
            notes: 'Ready for next stocking, cleaned and prepared',
            createdAt: getDateString(-110),
            updatedAt: getDateString(-5)
        },
        {
            id: 'P007',
            name: 'Pond D1',
            type: 'Concrete',
            volume: 400,
            dimensions: '15m x 27m',
            status: 'active',
            species: 'Tilapia',
            stockedDate: getDateString(-30),
            notes: 'Fast growing batch, good water quality',
            createdAt: getDateString(-35),
            updatedAt: getDateString(-1)
        },
        {
            id: 'P008',
            name: 'Pond D2',
            type: 'Concrete',
            volume: 400,
            dimensions: '15m x 27m',
            status: 'active',
            species: 'Catfish',
            stockedDate: getDateString(-15),
            notes: 'Bottom feeder species, separate feeding schedule',
            createdAt: getDateString(-20),
            updatedAt: getDateString(0)
        }
    ],

    stock: [
        {
            id: 'S001',
            pondId: 'P001',
            species: 'Tilapia',
            initialCount: 5000,
            currentCount: 4850,
            initialWeight: 25,
            currentWeight: 180,
            stockedDate: getDateString(-90),
            source: 'Blue Hatchery',
            status: 'active',
            notes: 'Fast growing batch, good survival rate, uniform size',
            lastSamplingDate: getDateString(-5),
            targetHarvestDate: getDateString(30),
            createdAt: getDateString(-90),
            updatedAt: getDateString(-5)
        },
        {
            id: 'S002',
            pondId: 'P002',
            species: 'Tilapia',
            initialCount: 5000,
            currentCount: 4920,
            initialWeight: 20,
            currentWeight: 120,
            stockedDate: getDateString(-75),
            source: 'Aqua Farms',
            status: 'active',
            notes: 'Good appetite, uniform growth, minimal mortality',
            lastSamplingDate: getDateString(-7),
            targetHarvestDate: getDateString(45),
            createdAt: getDateString(-75),
            updatedAt: getDateString(-7)
        },
        {
            id: 'S003',
            pondId: 'P003',
            species: 'Trout',
            initialCount: 3000,
            currentCount: 2950,
            initialWeight: 50,
            currentWeight: 250,
            stockedDate: getDateString(-60),
            source: 'Mountain Hatchery',
            status: 'active',
            notes: 'Requires cold water, good condition, growing well',
            lastSamplingDate: getDateString(-10),
            targetHarvestDate: getDateString(60),
            createdAt: getDateString(-60),
            updatedAt: getDateString(-10)
        },
        {
            id: 'S004',
            pondId: 'P004',
            species: 'Trout',
            initialCount: 3000,
            currentCount: 2970,
            initialWeight: 45,
            currentWeight: 180,
            stockedDate: getDateString(-45),
            source: 'Mountain Hatchery',
            status: 'active',
            notes: 'Excellent survival rate, good feed conversion',
            lastSamplingDate: getDateString(-8),
            targetHarvestDate: getDateString(75),
            createdAt: getDateString(-45),
            updatedAt: getDateString(-8)
        },
        {
            id: 'S005',
            pondId: 'P007',
            species: 'Tilapia',
            initialCount: 4000,
            currentCount: 3980,
            initialWeight: 30,
            currentWeight: 90,
            stockedDate: getDateString(-30),
            source: 'Blue Hatchery',
            status: 'active',
            notes: 'Recently stocked, adapting well, good appetite',
            lastSamplingDate: getDateString(-3),
            targetHarvestDate: getDateString(90),
            createdAt: getDateString(-30),
            updatedAt: getDateString(-3)
        },
        {
            id: 'S006',
            pondId: 'P008',
            species: 'Catfish',
            initialCount: 3500,
            currentCount: 3480,
            initialWeight: 40,
            currentWeight: 110,
            stockedDate: getDateString(-15),
            source: 'River Hatchery',
            status: 'active',
            notes: 'Good growth so far, bottom feeding, nocturnal',
            lastSamplingDate: getDateString(-2),
            targetHarvestDate: getDateString(105),
            createdAt: getDateString(-15),
            updatedAt: getDateString(-2)
        }
    ],

    feedInventory: [
        {
            id: 'F001',
            type: 'Tilapia Grower',
            protein: 32,
            bags: 45,
            bagWeight: 25,
            totalWeight: 1125,
            lastPurchase: getDateString(-20),
            status: 'good',
            supplier: 'AquaFeed Inc.',
            pricePerBag: 45.50,
            minStock: 10,
            notes: 'Main feed for tilapia, good acceptance',
            createdAt: getDateString(-100),
            updatedAt: getDateString(-20)
        },
        {
            id: 'F002',
            type: 'Trout Feed',
            protein: 38,
            bags: 28,
            bagWeight: 20,
            totalWeight: 560,
            lastPurchase: getDateString(-25),
            status: 'low',
            supplier: 'Mountain Feeds',
            pricePerBag: 52.75,
            minStock: 15,
            notes: 'High protein feed for trout, needs reorder soon',
            createdAt: getDateString(-80),
            updatedAt: getDateString(-25)
        },
        {
            id: 'F003',
            type: 'Catfish Feed',
            protein: 30,
            bags: 35,
            bagWeight: 25,
            totalWeight: 875,
            lastPurchase: getDateString(-18),
            status: 'good',
            supplier: 'River Feeds',
            pricePerBag: 42.30,
            minStock: 10,
            notes: 'Sinking pellets for catfish',
            createdAt: getDateString(-70),
            updatedAt: getDateString(-18)
        },
        {
            id: 'F004',
            type: 'Starter Feed',
            protein: 40,
            bags: 15,
            bagWeight: 10,
            totalWeight: 150,
            lastPurchase: getDateString(-32),
            status: 'good',
            supplier: 'AquaFeed Inc.',
            pricePerBag: 38.90,
            minStock: 5,
            notes: 'For fry and fingerlings',
            createdAt: getDateString(-60),
            updatedAt: getDateString(-32)
        }
    ],

    feedingLogs: [
        {
            id: 'FL001',
            pondId: 'P001',
            feedType: 'Tilapia Grower',
            quantity: 12,
            date: getDateString(-2),
            time: '09:00',
            notes: 'Good appetite, consumed all feed quickly',
            recordedBy: 'John Doe',
            createdAt: getDateString(-2) + 'T09:00:00',
            updatedAt: getDateString(-2) + 'T09:00:00'
        },
        {
            id: 'FL002',
            pondId: 'P002',
            feedType: 'Tilapia Grower',
            quantity: 10,
            date: getDateString(-2),
            time: '09:15',
            notes: 'Normal feeding, no issues observed',
            recordedBy: 'John Doe',
            createdAt: getDateString(-2) + 'T09:15:00',
            updatedAt: getDateString(-2) + 'T09:15:00'
        },
        {
            id: 'FL003',
            pondId: 'P003',
            feedType: 'Trout Feed',
            quantity: 8,
            date: getDateString(-2),
            time: '10:00',
            notes: 'Reduced feeding due to low water temperature (16°C)',
            recordedBy: 'John Doe',
            createdAt: getDateString(-2) + 'T10:00:00',
            updatedAt: getDateString(-2) + 'T10:00:00'
        },
        {
            id: 'FL004',
            pondId: 'P001',
            feedType: 'Tilapia Grower',
            quantity: 10,
            date: getDateString(-1),
            time: '09:00',
            notes: 'Regular feeding schedule, good consumption',
            recordedBy: 'Sarah Smith',
            createdAt: getDateString(-1) + 'T09:00:00',
            updatedAt: getDateString(-1) + 'T09:00:00'
        },
        {
            id: 'FL005',
            pondId: 'P004',
            feedType: 'Trout Feed',
            quantity: 7,
            date: getDateString(-1),
            time: '10:00',
            notes: 'Normal appetite, all feed consumed',
            recordedBy: 'Sarah Smith',
            createdAt: getDateString(-1) + 'T10:00:00',
            updatedAt: getDateString(-1) + 'T10:00:00'
        },
        {
            id: 'FL006',
            pondId: 'P007',
            feedType: 'Tilapia Grower',
            quantity: 6,
            date: getDateString(-1),
            time: '09:30',
            notes: 'Good response to feeding, active fish',
            recordedBy: 'Sarah Smith',
            createdAt: getDateString(-1) + 'T09:30:00',
            updatedAt: getDateString(-1) + 'T09:30:00'
        },
        {
            id: 'FL007',
            pondId: 'P008',
            feedType: 'Catfish Feed',
            quantity: 5,
            date: getDateString(0),
            time: '14:00',
            notes: 'Night feeding for catfish, good consumption',
            recordedBy: 'John Doe',
            createdAt: getDateString(0) + 'T14:00:00',
            updatedAt: getDateString(0) + 'T14:00:00'
        }
    ],

    waterTests: [
        {
            id: 'WT001',
            pondId: 'P001',
            date: getDateString(0),
            time: '08:00',
            temp: 28.5,
            do: 6.2,
            ph: 7.4,
            ammonia: 0.2,
            nitrite: 0.1,
            nitrate: 5.2,
            recordedBy: 'John Doe',
            notes: 'Optimal conditions for tilapia growth',
            createdAt: getDateString(0) + 'T08:00:00',
            updatedAt: getDateString(0) + 'T08:00:00'
        },
        {
            id: 'WT002',
            pondId: 'P002',
            date: getDateString(0),
            time: '08:15',
            temp: 28.2,
            do: 6.0,
            ph: 7.5,
            ammonia: 0.3,
            nitrite: 0.1,
            nitrate: 5.5,
            recordedBy: 'John Doe',
            notes: 'Slightly high pH, will monitor',
            createdAt: getDateString(0) + 'T08:15:00',
            updatedAt: getDateString(0) + 'T08:15:00'
        },
        {
            id: 'WT003',
            pondId: 'P003',
            date: getDateString(0),
            time: '08:30',
            temp: 16.5,
            do: 7.8,
            ph: 7.0,
            ammonia: 0.1,
            nitrite: 0.05,
            nitrate: 3.2,
            recordedBy: 'John Doe',
            notes: 'Good conditions for trout, cold water maintained',
            createdAt: getDateString(0) + 'T08:30:00',
            updatedAt: getDateString(0) + 'T08:30:00'
        },
        {
            id: 'WT004',
            pondId: 'P001',
            date: getDateString(-1),
            time: '08:00',
            temp: 28.0,
            do: 6.5,
            ph: 7.3,
            ammonia: 0.2,
            nitrite: 0.1,
            nitrate: 5.0,
            recordedBy: 'Sarah Smith',
            notes: 'Stable conditions, no issues',
            createdAt: getDateString(-1) + 'T08:00:00',
            updatedAt: getDateString(-1) + 'T08:00:00'
        },
        {
            id: 'WT005',
            pondId: 'P004',
            date: getDateString(-1),
            time: '08:30',
            temp: 16.8,
            do: 7.5,
            ph: 7.1,
            ammonia: 0.2,
            nitrite: 0.1,
            nitrate: 3.5,
            recordedBy: 'Sarah Smith',
            notes: 'Normal parameters for trout pond',
            createdAt: getDateString(-1) + 'T08:30:00',
            updatedAt: getDateString(-1) + 'T08:30:00'
        }
    ],

    healthIssues: [
        {
            id: 'HI001',
            pondId: 'P001',
            date: getDateString(-5),
            issue: 'Fin rot',
            symptoms: 'Frayed fins, white edges, lethargy, reduced appetite',
            affectedCount: 50,
            treatment: 'Antibiotic bath (Oxytetracycline)',
            dosage: '20mg/L for 1 hour daily',
            duration: '5 days',
            withdrawalPeriod: 21,
            status: 'resolved',
            notes: 'Treated for 5 days, full recovery observed, no new cases',
            recordedBy: 'John Doe',
            createdAt: getDateString(-5),
            updatedAt: getDateString(-1)
        },
        {
            id: 'HI002',
            pondId: 'P003',
            date: getDateString(-3),
            issue: 'Fungus (Saprolegnia)',
            symptoms: 'White cotton-like growth on skin and gills, lethargy',
            affectedCount: 25,
            treatment: 'Salt bath',
            dosage: '3% solution for 5 minutes',
            duration: '3 days',
            withdrawalPeriod: 0,
            status: 'improving',
            notes: 'Continue treatment for 3 more days, fish showing improvement',
            recordedBy: 'Sarah Smith',
            createdAt: getDateString(-3),
            updatedAt: getDateString(0)
        },
        {
            id: 'HI003',
            pondId: 'P002',
            date: getDateString(-10),
            issue: 'Parasites (Ichthyophthirius - Ich)',
            symptoms: 'White spots on body and fins, flashing, rubbing against surfaces',
            affectedCount: 80,
            treatment: 'Formalin dip',
            dosage: '250 ppm for 1 hour',
            duration: '3 treatments',
            withdrawalPeriod: 14,
            status: 'resolved',
            notes: 'Full recovery observed after treatment, water quality improved',
            recordedBy: 'John Doe',
            createdAt: getDateString(-10),
            updatedAt: getDateString(-5)
        }
    ],

    mortality: [
        {
            id: 'M001',
            pondId: 'P001',
            date: getDateString(0),
            count: 5,
            cause: 'handling',
            notes: 'During sampling procedure, stress related',
            weight: 180,
            recordedBy: 'John Doe',
            createdAt: getDateString(0),
            updatedAt: getDateString(0)
        },
        {
            id: 'M002',
            pondId: 'P003',
            date: getDateString(-1),
            count: 3,
            cause: 'disease',
            notes: 'Fungal infection complications',
            weight: 250,
            recordedBy: 'Sarah Smith',
            createdAt: getDateString(-1),
            updatedAt: getDateString(-1)
        },
        {
            id: 'M003',
            pondId: 'P002',
            date: getDateString(-2),
            count: 2,
            cause: 'predation',
            notes: 'Bird attack during feeding time',
            weight: 120,
            recordedBy: 'John Doe',
            createdAt: getDateString(-2),
            updatedAt: getDateString(-2)
        },
        {
            id: 'M004',
            pondId: 'P004',
            date: getDateString(-3),
            count: 1,
            cause: 'unknown',
            notes: 'Found dead during routine check, no visible symptoms',
            weight: 180,
            recordedBy: 'Sarah Smith',
            createdAt: getDateString(-3),
            updatedAt: getDateString(-3)
        },
        {
            id: 'M005',
            pondId: 'P001',
            date: getDateString(-4),
            count: 4,
            cause: 'disease',
            notes: 'Fin rot complication before treatment',
            weight: 175,
            recordedBy: 'John Doe',
            createdAt: getDateString(-4),
            updatedAt: getDateString(-4)
        }
    ],

    inventory: [
        {
            id: 'I001',
            name: 'Formalin',
            category: 'chemicals',
            quantity: 8,
            unit: 'L',
            minStock: 5,
            lastRestock: getDateString(-20),
            status: 'good',
            supplier: 'ChemSupply Inc.',
            pricePerUnit: 25.50,
            location: 'Storage Room A',
            notes: 'For parasite treatment, handle with care',
            createdAt: getDateString(-100),
            updatedAt: getDateString(-20)
        },
        {
            id: 'I002',
            name: 'Salt',
            category: 'chemicals',
            quantity: 200,
            unit: 'kg',
            minStock: 100,
            lastRestock: getDateString(-25),
            status: 'good',
            supplier: 'Salt Co.',
            pricePerUnit: 0.85,
            location: 'Storage Room B',
            notes: 'For salt baths and general use',
            createdAt: getDateString(-90),
            updatedAt: getDateString(-25)
        },
        {
            id: 'I003',
            name: 'Oxygen Meter',
            category: 'equipment',
            quantity: 2,
            unit: 'pcs',
            minStock: 1,
            lastRestock: getDateString(-75),
            status: 'good',
            supplier: 'Lab Equipment Ltd.',
            pricePerUnit: 350.00,
            location: 'Equipment Room',
            notes: 'Digital DO meter, calibrated monthly',
            createdAt: getDateString(-80),
            updatedAt: getDateString(-75)
        },
        {
            id: 'I004',
            name: 'pH Test Strips',
            category: 'supplies',
            quantity: 5,
            unit: 'packs',
            minStock: 10,
            lastRestock: getDateString(-40),
            status: 'low',
            supplier: 'Test Supplies Co.',
            pricePerUnit: 12.75,
            location: 'Lab Supplies',
            notes: 'Need to reorder soon, running low',
            createdAt: getDateString(-70),
            updatedAt: getDateString(-40)
        },
        {
            id: 'I005',
            name: 'Antibiotic (Oxytetracycline)',
            category: 'medication',
            quantity: 12,
            unit: 'packs',
            minStock: 15,
            lastRestock: getDateString(-50),
            status: 'low',
            supplier: 'VetPharma',
            pricePerUnit: 45.30,
            location: 'Medication Storage',
            notes: 'Broad-spectrum antibiotic, check expiration',
            createdAt: getDateString(-60),
            updatedAt: getDateString(-50)
        },
        {
            id: 'I006',
            name: 'Nets',
            category: 'equipment',
            quantity: 10,
            unit: 'pcs',
            minStock: 5,
            lastRestock: getDateString(-18),
            status: 'good',
            supplier: 'Fishing Gear Inc.',
            pricePerUnit: 28.50,
            location: 'Equipment Room',
            notes: 'Various sizes for different purposes',
            createdAt: getDateString(-50),
            updatedAt: getDateString(-18)
        },
        {
            id: 'I007',
            name: 'Probiotics',
            category: 'supplies',
            quantity: 25,
            unit: 'kg',
            minStock: 20,
            lastRestock: getDateString(-22),
            status: 'good',
            supplier: 'AquaHealth',
            pricePerUnit: 18.90,
            location: 'Storage Room A',
            notes: 'For water quality management and gut health',
            createdAt: getDateString(-40),
            updatedAt: getDateString(-22)
        }
    ],

    users: [
        {
            id: 'U001',
            name: 'Admin User',
            role: 'admin',
            email: 'admin@bluefin.com',
            lastLogin: getDateString(0),
            createdAt: '2023-01-15',
            active: true,
            permissions: ['all'],
            notes: 'System administrator'
        },
        {
            id: 'U002',
            name: 'Farm Manager',
            role: 'manager',
            email: 'manager@bluefin.com',
            lastLogin: getDateString(-1),
            createdAt: '2023-02-20',
            active: true,
            permissions: ['view_all', 'edit_all', 'reports'],
            notes: 'Farm operations manager'
        },
        {
            id: 'U003',
            name: 'John Doe',
            role: 'worker',
            email: 'john@bluefin.com',
            lastLogin: getDateString(0),
            createdAt: '2023-03-10',
            active: true,
            permissions: ['data_entry', 'view_assigned'],
            notes: 'Pond technician, assigned to ponds A1, A2, B1'
        },
        {
            id: 'U004',
            name: 'Sarah Smith',
            role: 'worker',
            email: 'sarah@bluefin.com',
            lastLogin: getDateString(-2),
            createdAt: '2023-04-05',
            active: true,
            permissions: ['data_entry', 'view_assigned'],
            notes: 'Pond technician, assigned to ponds B2, C1, C2'
        }
    ],

    harvests: [
        {
            id: 'H001',
            stockId: 'S000',
            pondId: 'P005',
            species: 'Tilapia',
            date: '2023-07-20',
            finalCount: 4800,
            avgWeight: 450,
            totalWeight: 2160,
            pricePerKg: 4.50,
            totalValue: 9720,
            destination: 'live_sale',
            buyer: 'Local Market Co.',
            buyerContact: 'contact@localmarket.com',
            notes: 'Successful harvest, good prices, minimal stress on fish',
            recordedBy: 'Admin User',
            createdAt: '2023-07-20',
            updatedAt: '2023-07-20'
        }
    ],

    settings: {
        farmName: 'BlueFin Aquaculture',
        farmLocation: 'Lakeside, Aqua District',
        totalPonds: 8,
        mainSpecies: 'tilapia',
        currency: 'USD',
        lowStockThreshold: 10,
        backupDate: null,
        waterQualityAlerts: {
            tempMin: 20,
            tempMax: 30,
            doMin: 5,
            phMin: 6.5,
            phMax: 8.5,
            ammoniaMax: 0.5
        },
        feedSchedule: {
            morning: '09:00',
            afternoon: '14:00',
            evening: '17:00'
        },
        createdAt: '2023-01-01',
        updatedAt: getDateString(0)
    },

    activityLogs: []
};

// Data Management Functions
class DataManager {
    constructor() {
        this.initData();
    }

    // Initialize data in localStorage
    initData() {
        // Check if data already exists
        const dataExists = localStorage.getItem(DATA_KEYS.PONDS) !== null;

        if (!dataExists) {
            // Load sample data
            this.saveAllData(SAMPLE_DATA);
            console.log('Sample data loaded successfully');
        }

        // Initialize activity logs if empty
        const activityLogs = this.getData(DATA_KEYS.ACTIVITY_LOGS);
        if (activityLogs.length === 0) {
            this.initializeActivityLogs();
        }
    }

    // Initialize activity logs from existing data
    initializeActivityLogs() {
        const logs = [];

        // Add logs from existing data
        const feedingLogs = this.getData(DATA_KEYS.FEEDING_LOGS);
        const waterTests = this.getData(DATA_KEYS.WATER_TESTS);
        const healthIssues = this.getData(DATA_KEYS.HEALTH_ISSUES);
        const mortality = this.getData(DATA_KEYS.MORTALITY);

        // Convert feeding logs to activity logs
        feedingLogs.forEach(log => {
            const pond = this.getPondById(log.pondId);
            logs.push({
                id: `ACT${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                type: 'feeding',
                description: `${log.quantity}kg of ${log.feedType} fed to ${pond?.name || log.pondId}`,
                details: log.notes,
                date: log.date,
                time: log.time,
                userId: log.recordedBy === 'John Doe' ? 'U003' : 'U004',
                entityId: log.id,
                entityType: 'feeding_log'
            });
        });

        // Convert water tests to activity logs
        waterTests.forEach(test => {
            const pond = this.getPondById(test.pondId);
            logs.push({
                id: `ACT${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                type: 'water_test',
                description: `Water test completed for ${pond?.name || test.pondId}`,
                details: `Temp: ${test.temp}°C, DO: ${test.do} mg/L, pH: ${test.ph}`,
                date: test.date,
                time: test.time,
                userId: test.recordedBy === 'John Doe' ? 'U003' : 'U004',
                entityId: test.id,
                entityType: 'water_test'
            });
        });

        // Convert health issues to activity logs
        healthIssues.forEach(issue => {
            const pond = this.getPondById(issue.pondId);
            logs.push({
                id: `ACT${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                type: 'health_issue',
                description: `Health issue reported in ${pond?.name || issue.pondId}: ${issue.issue}`,
                details: `${issue.affectedCount} fish affected. Treatment: ${issue.treatment}`,
                date: issue.date,
                time: '12:00',
                userId: issue.recordedBy === 'John Doe' ? 'U003' : 'U004',
                entityId: issue.id,
                entityType: 'health_issue'
            });
        });

        // Convert mortality records to activity logs
        mortality.forEach(record => {
            const pond = this.getPondById(record.pondId);
            logs.push({
                id: `ACT${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                type: 'mortality',
                description: `${record.count} fish mortality in ${pond?.name || record.pondId}`,
                details: `Cause: ${record.cause}. ${record.notes}`,
                date: record.date,
                time: '12:00',
                userId: record.recordedBy === 'John Doe' ? 'U003' : 'U004',
                entityId: record.id,
                entityType: 'mortality'
            });
        });

        // Sort by date and time (most recent first)
        logs.sort((a, b) => {
            const dateA = new Date(a.date + 'T' + (a.time || '00:00'));
            const dateB = new Date(b.date + 'T' + (b.time || '00:00'));
            return dateB - dateA;
        });

        this.saveData(DATA_KEYS.ACTIVITY_LOGS, logs);
    }

    // Save all sample data to localStorage
    saveAllData(data) {
        for (const key in data) {
            const storageKey = DATA_KEYS[key.toUpperCase()];
            if (storageKey) {
                localStorage.setItem(storageKey, JSON.stringify(data[key]));
            }
        }
    }

    // Get data by key
    getData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    // Save data by key
    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Add new item to data array
    addItem(key, item) {
        const data = this.getData(key);

        // Generate ID if not provided
        if (!item.id) {
            item.id = this.generateId(key);
        }

        // Add timestamps
        const now = new Date();
        const nowISO = now.toISOString();
        const nowDate = nowISO.split('T')[0];
        const nowTime = now.toTimeString().split(' ')[0].substring(0, 5);

        if (!item.createdAt) {
            item.createdAt = nowISO;
        }
        item.updatedAt = nowISO;

        // Add date and time if not present
        if (!item.date) {
            item.date = nowDate;
        }
        if (!item.time && key !== DATA_KEYS.SETTINGS) {
            item.time = nowTime;
        }

        data.push(item);
        this.saveData(key, data);

        // Log activity if applicable
        this.logActivity(item, key, 'create');

        return item;
    }

    // Update existing item
    updateItem(key, id, updates) {
        const data = this.getData(key);
        const index = data.findIndex(item => item.id === id);

        if (index !== -1) {
            // Preserve original ID and createdAt
            updates.id = id;
            updates.createdAt = data[index].createdAt;
            updates.updatedAt = new Date().toISOString();
            data[index] = { ...data[index], ...updates };
            this.saveData(key, data);

            // Log activity if applicable
            this.logActivity(data[index], key, 'update');

            return data[index];
        }
        return null;
    }

    // Delete item
    deleteItem(key, id) {
        const data = this.getData(key);
        const itemToDelete = data.find(item => item.id === id);
        const filteredData = data.filter(item => item.id !== id);
        this.saveData(key, filteredData);

        // Log activity if applicable
        if (filteredData.length !== data.length && itemToDelete) {
            this.logActivity(itemToDelete, key, 'delete');
        }

        return filteredData.length !== data.length;
    }

    // Log activity
    logActivity(item, key, action = 'create') {
        const activityLogs = this.getData(DATA_KEYS.ACTIVITY_LOGS);
        let description = '';
        let details = '';
        const now = new Date();
        const nowDate = now.toISOString().split('T')[0];
        const nowTime = now.toTimeString().split(' ')[0].substring(0, 5);

        switch (key) {
            case DATA_KEYS.STOCK:
                if (action === 'create') {
                    description = `New stock batch added: ${item.species}`;
                    details = `${item.initialCount} fish stocked in Pond ${item.pondId} at ${item.initialWeight}g average weight`;
                } else if (action === 'update') {
                    description = `Stock batch updated: ${item.species} in Pond ${item.pondId}`;
                    details = `Current count: ${item.currentCount}, Avg weight: ${item.currentWeight}g`;
                } else if (action === 'delete') {
                    description = `Stock batch deleted: ${item.id}`;
                }
                break;

            case DATA_KEYS.FEED_INVENTORY:
                if (action === 'create') {
                    description = `Feed inventory added: ${item.type}`;
                    details = `${item.bags} bags (${item.totalWeight}kg)`;
                }
                break;

            case DATA_KEYS.FEEDING_LOGS:
                if (action === 'create') {
                    const pond = this.getPondById(item.pondId);
                    description = `Feeding recorded for ${pond?.name || item.pondId}`;
                    details = `${item.quantity}kg of ${item.feedType}`;
                }
                break;

            case DATA_KEYS.WATER_TESTS:
                if (action === 'create') {
                    const pond = this.getPondById(item.pondId);
                    description = `Water test completed for ${pond?.name || item.pondId}`;
                    details = `Temp: ${item.temp}°C, DO: ${item.do} mg/L, pH: ${item.ph}`;
                }
                break;

            case DATA_KEYS.HEALTH_ISSUES:
                if (action === 'create') {
                    const pond = this.getPondById(item.pondId);
                    description = `Health issue reported: ${item.issue}`;
                    details = `${item.affectedCount} fish affected in ${pond?.name || item.pondId}. Treatment: ${item.treatment}`;
                }
                break;

            case DATA_KEYS.MORTALITY:
                if (action === 'create') {
                    const pond = this.getPondById(item.pondId);
                    description = `Mortality recorded in ${pond?.name || item.pondId}`;
                    details = `${item.count} fish, Cause: ${item.cause}`;
                }
                break;

            case DATA_KEYS.INVENTORY:
                if (action === 'create') {
                    description = `Inventory item added: ${item.name}`;
                    details = `${item.quantity} ${item.unit} (Category: ${item.category})`;
                }
                break;

            case DATA_KEYS.USERS:
                if (action === 'create') {
                    description = `New user added: ${item.name}`;
                    details = `Role: ${item.role}, Email: ${item.email}`;
                }
                break;

            case DATA_KEYS.HARVESTS:
                if (action === 'create') {
                    description = `Harvest recorded`;
                    details = `${item.finalCount} ${item.species}, Total weight: ${item.totalWeight}kg`;
                }
                break;
        }

        if (description) {
            const activity = {
                id: `ACT${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
                type: action === 'delete' ? 'delete' : key.replace('aquatrack_', ''),
                action: action,
                description: description,
                details: details,
                date: nowDate,
                time: nowTime,
                userId: 'U001', // Default to admin
                entityId: item.id,
                entityType: key.replace('aquatrack_', '')
            };

            activityLogs.unshift(activity); // Add to beginning

            // Keep only last 100 activity logs
            if (activityLogs.length > 100) {
                activityLogs.splice(100);
            }

            this.saveData(DATA_KEYS.ACTIVITY_LOGS, activityLogs);
        }
    }

    // Generate a unique ID based on key prefix
    generateId(key) {
        const prefixMap = {
            [DATA_KEYS.PONDS]: 'P',
            [DATA_KEYS.STOCK]: 'S',
            [DATA_KEYS.FEED_INVENTORY]: 'F',
            [DATA_KEYS.FEEDING_LOGS]: 'FL',
            [DATA_KEYS.WATER_TESTS]: 'WT',
            [DATA_KEYS.HEALTH_ISSUES]: 'HI',
            [DATA_KEYS.MORTALITY]: 'M',
            [DATA_KEYS.INVENTORY]: 'I',
            [DATA_KEYS.USERS]: 'U',
            [DATA_KEYS.HARVESTS]: 'H',
            [DATA_KEYS.ACTIVITY_LOGS]: 'ACT'
        };

        const prefix = prefixMap[key] || 'ITM';
        const data = this.getData(key);

        // Find the highest numeric ID
        let maxNum = 0;
        data.forEach(item => {
            if (item.id && item.id.startsWith(prefix)) {
                const numPart = item.id.substring(prefix.length);
                const num = parseInt(numPart) || 0;
                if (num > maxNum) {
                    maxNum = num;
                }
            }
        });

        return `${prefix}${(maxNum + 1).toString().padStart(3, '0')}`;
    }

    // Get pond by ID
    getPondById(id) {
        const ponds = this.getData(DATA_KEYS.PONDS);
        return ponds.find(pond => pond.id === id);
    }

    // Get stock by pond ID
    getStockByPondId(pondId) {
        const stock = this.getData(DATA_KEYS.STOCK);
        return stock.filter(item => item.pondId === pondId && item.status === 'active');
    }

    // Get active stock
    getActiveStock() {
        const stock = this.getData(DATA_KEYS.STOCK);
        return stock.filter(item => item.status === 'active');
    }

    // Get empty ponds
    getEmptyPonds() {
        const ponds = this.getData(DATA_KEYS.PONDS);
        return ponds.filter(pond => pond.status === 'empty');
    }

    // Get active ponds
    getActivePonds() {
        const ponds = this.getData(DATA_KEYS.PONDS);
        return ponds.filter(pond => pond.status === 'active');
    }

    // Get feed types
    getFeedTypes() {
        const feedInventory = this.getData(DATA_KEYS.FEED_INVENTORY);
        return [...new Set(feedInventory.map(item => item.type))];
    }

    // Calculate pond statistics
    getPondStats(pondId) {
        const stock = this.getStockByPondId(pondId);
        if (stock.length === 0) return null;

        const currentStock = stock[0];
        const daysStocked = this.getDaysBetweenDates(currentStock.stockedDate, new Date().toISOString().split('T')[0]);

        // Calculate biomass (kg)
        const biomass = (currentStock.currentCount * currentStock.currentWeight) / 1000;

        // Calculate ADG (Average Daily Growth in grams)
        const adg = daysStocked > 0 ? (currentStock.currentWeight - currentStock.initialWeight) / daysStocked : 0;

        // Calculate weekly feed consumption
        const feedingLogs = this.getData(DATA_KEYS.FEEDING_LOGS);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const weeklyFeed = feedingLogs
            .filter(log => log.pondId === pondId && new Date(log.date) >= sevenDaysAgo)
            .reduce((sum, log) => sum + log.quantity, 0);

        // Calculate survival rate
        const survivalRate = currentStock.initialCount > 0 ?
            (currentStock.currentCount / currentStock.initialCount) * 100 : 0;

        // Calculate FCR if we have harvest data
        let fcr = null;
        const harvests = this.getData(DATA_KEYS.HARVESTS);
        const pondHarvest = harvests.find(h => h.pondId === pondId);

        if (pondHarvest) {
            const totalFeed = feedingLogs
                .filter(log => log.pondId === pondId)
                .reduce((sum, log) => sum + log.quantity, 0);

            if (totalFeed > 0 && pondHarvest.totalWeight > 0) {
                fcr = totalFeed / pondHarvest.totalWeight;
            }
        }

        return {
            biomass: biomass.toFixed(2),
            adg: adg.toFixed(2),
            weeklyFeed: weeklyFeed.toFixed(1),
            daysStocked,
            survivalRate: survivalRate.toFixed(1),
            fcr: fcr ? fcr.toFixed(2) : 'N/A'
        };
    }

    // Calculate farm-wide statistics for dashboard
    getFarmStats() {
        const stock = this.getActiveStock();
        const ponds = this.getData(DATA_KEYS.PONDS);
        const feedingLogs = this.getData(DATA_KEYS.FEEDING_LOGS);
        const waterTests = this.getData(DATA_KEYS.WATER_TESTS);
        const mortality = this.getData(DATA_KEYS.MORTALITY);
        const harvests = this.getData(DATA_KEYS.HARVESTS);
        const now = new Date();

        // Total active stock
        const totalStock = stock.reduce((sum, s) => sum + s.currentCount, 0);

        // Total estimated biomass (kg)
        const totalBiomass = stock.reduce((sum, s) => sum + (s.currentCount * s.currentWeight), 0) / 1000;

        // Weekly feed consumption (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const weeklyFeed = feedingLogs
            .filter(log => new Date(log.date) >= oneWeekAgo)
            .reduce((sum, log) => sum + log.quantity, 0);

        // Average survival rate (all active batches)
        const avgSurvivalRate = stock.length > 0
            ? stock.reduce((sum, s) => sum + (s.currentCount / s.initialCount * 100), 0) / stock.length
            : 0;

        // Upcoming harvests (within next 30 days)
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        const upcomingHarvests = stock.filter(s => {
            if (!s.targetHarvestDate) return false;
            const harvestDate = new Date(s.targetHarvestDate);
            return harvestDate >= now && harvestDate <= thirtyDaysFromNow;
        }).length;

        // Next harvest date
        const nextHarvest = stock
            .filter(s => s.targetHarvestDate)
            .map(s => new Date(s.targetHarvestDate))
            .sort((a, b) => a - b)[0];

        // Average water parameters (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentWaterTests = waterTests.filter(test => new Date(test.date) >= sevenDaysAgo);

        const avgTemp = recentWaterTests.length > 0
            ? recentWaterTests.reduce((sum, test) => sum + test.temp, 0) / recentWaterTests.length
            : 0;

        const avgDO = recentWaterTests.length > 0
            ? recentWaterTests.reduce((sum, test) => sum + test.do, 0) / recentWaterTests.length
            : 0;

        const avgPH = recentWaterTests.length > 0
            ? recentWaterTests.reduce((sum, test) => sum + test.ph, 0) / recentWaterTests.length
            : 0;

        // Mortality this month
        const thisMonthMortality = mortality
            .filter(m => {
                const logDate = new Date(m.date);
                return logDate.getMonth() === now.getMonth() &&
                    logDate.getFullYear() === now.getFullYear();
            })
            .reduce((sum, m) => sum + m.count, 0);

        // Calculate average FCR for harvested batches
        const harvestedStockIds = harvests.map(h => h.stockId);
        const harvestedStock = this.getData(DATA_KEYS.STOCK).filter(s => harvestedStockIds.includes(s.id));

        let totalFCR = 0;
        let fcrCount = 0;

        harvestedStock.forEach(s => {
            const harvest = harvests.find(h => h.stockId === s.id);
            if (harvest) {
                const totalFeed = feedingLogs
                    .filter(f => f.pondId === s.pondId)
                    .reduce((sum, f) => sum + f.quantity, 0);

                if (totalFeed > 0 && harvest.totalWeight > 0) {
                    const fcr = totalFeed / harvest.totalWeight;
                    totalFCR += fcr;
                    fcrCount++;
                }
            }
        });

        const avgFCR = fcrCount > 0 ? totalFCR / fcrCount : 1.5; // Default if no harvests

        return {
            totalStock,
            totalBiomass: totalBiomass.toFixed(2),
            weeklyFeed: weeklyFeed.toFixed(1),
            avgSurvivalRate: avgSurvivalRate.toFixed(1),
            upcomingHarvests,
            nextHarvestDate: nextHarvest ? nextHarvest.toISOString().split('T')[0] : null,
            avgTemp: avgTemp.toFixed(1),
            avgDO: avgDO.toFixed(1),
            avgPH: avgPH.toFixed(1),
            thisMonthMortality,
            avgFCR: avgFCR.toFixed(2)
        };
    }

    // Calculate days between two dates
    getDaysBetweenDates(date1, date2) {
        if (!date1 || !date2) return 0;
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diffTime = Math.abs(d2 - d1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Get recent activity (for dashboard)
    getRecentActivity(limit = 5) {
        const activityLogs = this.getData(DATA_KEYS.ACTIVITY_LOGS);
        return activityLogs.slice(0, limit);
    }

    // Get feed consumption by pond
    getFeedConsumptionByPond(pondId, days = 7) {
        const feedingLogs = this.getData(DATA_KEYS.FEEDING_LOGS);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return feedingLogs
            .filter(log => log.pondId === pondId && new Date(log.date) >= cutoffDate)
            .reduce((sum, log) => sum + log.quantity, 0);
    }

    // Get water quality trends
    getWaterQualityTrends(pondId, days = 30) {
        const waterTests = this.getData(DATA_KEYS.WATER_TESTS);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return waterTests
            .filter(test => test.pondId === pondId && new Date(test.date) >= cutoffDate)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Get mortality by cause
    getMortalityByCause(days = 30) {
        const mortality = this.getData(DATA_KEYS.MORTALITY);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const filtered = mortality.filter(m => new Date(m.date) >= cutoffDate);
        const byCause = {};

        filtered.forEach(m => {
            if (!byCause[m.cause]) {
                byCause[m.cause] = 0;
            }
            byCause[m.cause] += m.count;
        });

        return byCause;
    }

    // Get inventory status
    getInventoryStatus() {
        const inventory = this.getData(DATA_KEYS.INVENTORY);
        const totalItems = inventory.length;
        const lowStockItems = inventory.filter(item => item.quantity <= item.minStock).length;

        // Calculate inventory value
        const inventoryValue = inventory.reduce((sum, item) => {
            const price = item.pricePerUnit || 0;
            return sum + (item.quantity * price);
        }, 0);

        // Count recently used items (used in last 7 days)
        const feedingLogs = this.getData(DATA_KEYS.FEEDING_LOGS);
        const healthIssues = this.getData(DATA_KEYS.HEALTH_ISSUES);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const feedUsed = feedingLogs
            .filter(log => new Date(log.date) >= sevenDaysAgo)
            .length > 0;

        const treatmentsUsed = healthIssues
            .filter(issue => new Date(issue.date) >= sevenDaysAgo)
            .length > 0;

        const recentlyUsed = (feedUsed ? 1 : 0) + (treatmentsUsed ? 1 : 0);

        return {
            totalItems,
            lowStockItems,
            inventoryValue: inventoryValue.toFixed(2),
            recentlyUsed
        };
    }

    // Record harvest
    recordHarvest(harvestData) {
        // Add harvest record
        const harvest = this.addItem(DATA_KEYS.HARVESTS, harvestData);

        // Update stock status to harvested
        if (harvestData.stockId) {
            const stock = this.getData(DATA_KEYS.STOCK);
            const stockIndex = stock.findIndex(s => s.id === harvestData.stockId);
            if (stockIndex !== -1) {
                stock[stockIndex].status = 'harvested';
                stock[stockIndex].updatedAt = new Date().toISOString();
                this.saveData(DATA_KEYS.STOCK, stock);

                // Update pond status
                const pondId = stock[stockIndex].pondId;
                const pond = this.getPondById(pondId);
                if (pond) {
                    this.updateItem(DATA_KEYS.PONDS, pondId, {
                        ...pond,
                        status: 'empty',
                        species: null,
                        stockedDate: null,
                        notes: pond.notes ? pond.notes + '\nHarvested on ' + harvestData.date : 'Harvested on ' + harvestData.date
                    });
                }
            }
        }

        return harvest;
    }

    // Get harvest history
    getHarvestHistory() {
        const harvests = this.getData(DATA_KEYS.HARVESTS);
        return harvests.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Get water test summary for a pond
    getWaterTestSummary(pondId) {
        const waterTests = this.getData(DATA_KEYS.WATER_TESTS)
            .filter(test => test.pondId === pondId)
            .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

        if (waterTests.length === 0) return null;

        const latestTest = waterTests[0];
        const previousTests = waterTests.slice(1, 4); // Get 3 previous tests

        // Calculate trends
        const tempTrend = previousTests.length > 0 ?
            (latestTest.temp - previousTests[0].temp).toFixed(1) : '0.0';

        const doTrend = previousTests.length > 0 ?
            (latestTest.do - previousTests[0].do).toFixed(1) : '0.0';

        const pHTrend = previousTests.length > 0 ?
            (latestTest.ph - previousTests[0].ph).toFixed(1) : '0.0';

        return {
            latest: latestTest,
            trends: {
                temp: tempTrend,
                do: doTrend,
                ph: pHTrend
            },
            history: waterTests.slice(0, 10) // Last 10 tests
        };
    }

    // Export all data as JSON
    exportData() {
        const data = {};
        for (const key in DATA_KEYS) {
            const storageKey = DATA_KEYS[key];
            data[storageKey] = this.getData(storageKey);
        }

        // Add export metadata
        data.metadata = {
            exportedAt: new Date().toISOString(),
            appVersion: '1.0.0',
            recordCount: this.getDataCount()
        };

        return JSON.stringify(data, null, 2);
    }

    // Import data from JSON
    importData(jsonString) {
        try {
            const importedData = JSON.parse(jsonString);

            // Validate the data structure
            let isValid = true;
            for (const key in DATA_KEYS) {
                const storageKey = DATA_KEYS[key];
                if (!importedData[storageKey]) {
                    console.warn(`Missing data for key: ${storageKey}`);
                }
            }

            if (isValid) {
                // Save all data
                for (const key in DATA_KEYS) {
                    const storageKey = DATA_KEYS[key];
                    if (importedData[storageKey]) {
                        localStorage.setItem(storageKey, JSON.stringify(importedData[storageKey]));
                    }
                }

                // Update backup date in settings
                const settings = this.getData(DATA_KEYS.SETTINGS);
                if (settings) {
                    settings.backupDate = new Date().toISOString();
                    this.saveData(DATA_KEYS.SETTINGS, settings);
                }

                // Reinitialize activity logs
                this.initializeActivityLogs();

                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Clear all data and reload sample data
    clearAllData() {
        for (const key in DATA_KEYS) {
            localStorage.removeItem(DATA_KEYS[key]);
        }
        // Reload sample data
        this.saveAllData(SAMPLE_DATA);
        this.initializeActivityLogs();
    }

    // Get data count for display
    getDataCount() {
        let total = 0;
        for (const key in DATA_KEYS) {
            const data = this.getData(DATA_KEYS[key]);
            total += Array.isArray(data) ? data.length : 1;
        }
        return total;
    }

    // Get storage usage (approximate)
    getStorageUsage() {
        let totalBytes = 0;
        for (const key in DATA_KEYS) {
            const data = localStorage.getItem(DATA_KEYS[key]);
            if (data) {
                // Each character is approximately 2 bytes in UTF-16
                totalBytes += data.length * 2;
            }
        }
        return totalBytes;
    }

    // Format storage usage for display
    formatStorageUsage(bytes) {
        if (bytes < 1024) {
            return bytes + ' B';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + ' KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }
    }

    // Get user by ID
    getUserById(userId) {
        const users = this.getData(DATA_KEYS.USERS);
        return users.find(user => user.id === userId);
    }

    // Get user by email
    getUserByEmail(email) {
        const users = this.getData(DATA_KEYS.USERS);
        return users.find(user => user.email === email);
    }

    // Authenticate user
    authenticateUser(email, password) {
        const user = this.getUserByEmail(email);
        if (user && user.password === password) { // In real app, use hashed passwords
            // Update last login
            this.updateItem(DATA_KEYS.USERS, user.id, {
                ...user,
                lastLogin: new Date().toISOString().split('T')[0]
            });
            return user;
        }
        return null;
    }

    // Check if user has permission
    hasPermission(userId, permission) {
        const user = this.getUserById(userId);
        if (!user) return false;

        // Admin has all permissions
        if (user.role === 'admin') return true;

        // Check specific permissions
        if (user.permissions && user.permissions.includes('all')) return true;
        if (user.permissions && user.permissions.includes(permission)) return true;

        // Role-based permissions
        const rolePermissions = {
            'manager': ['view_all', 'edit_all', 'reports', 'data_entry'],
            'worker': ['data_entry', 'view_assigned']
        };

        return rolePermissions[user.role]?.includes(permission) || false;
    }
}

// Create global data manager instance
const dataManager = new DataManager();