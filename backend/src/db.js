const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const dataDir = path.join(__dirname, '..', 'data');
const dataFile = path.join(dataDir, 'store.json');
let pool = null;
let store = null;
let postgresReady = false;

function ensureStorage() {
  if (store) {
    return store;
  }

  if (!fs.existsSync(dataFile)) {
    fs.mkdirSync(dataDir, { recursive: true });
    const initial = createDefaultState();
    fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2));
  }

  const persisted = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  const defaults = createDefaultState();
  const merged = { ...defaults, ...persisted };

  Object.keys(defaults).forEach((key) => {
    if (!Array.isArray(persisted[key])) {
      merged[key] = defaults[key];
    }
  });

  store = merged;
  if (JSON.stringify(merged) !== JSON.stringify(persisted)) {
    saveStorage();
  }
  return store;
}

function saveStorage() {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(store, null, 2));
}

function createDefaultState() {
  const now = new Date().toISOString();
  const demoUserId = 'demo-user';
  const farmId = 'farm-001';
  const animalId = 'animal-001';
  const treatmentId = 'treatment-001';
  const vetId = 'vet-001';

  return {
    users: [
      {
        id: demoUserId,
        name: 'Demo Farmer',
        email: 'demo@livestockguard.ai',
        password: bcrypt.hashSync('demo1234', 10),
        role: 'farmer',
        verified: true,
        created_at: now,
      },
    ],
    farms: [
      {
        farm_id: farmId,
        owner_id: demoUserId,
        farm_name: 'Green Valley Farm',
        location: 'Coimbatore',
        registration_number: 'FG-1001',
        created_at: now,
      },
    ],
    animals: [
      {
        animal_id: animalId,
        farm_id: farmId,
        species: 'Cow',
        breed: 'Sahiwal',
        age: 4,
        weight: '520',
        gender: 'Female',
        qr_code: 'QRCODE001',
        rfid_tag: 'RFID-001',
        image_url: '',
        created_at: now,
      },
    ],
    veterinarians: [
      {
        vet_id: vetId,
        name: 'Dr. Anjali Sharma',
        license_number: 'VET-1001',
        specialization: 'Livestock Health',
        created_at: now,
      },
    ],
    treatments: [
      {
        treatment_id: treatmentId,
        animal_id: animalId,
        disease: 'Mastitis',
        drug_name: 'Oxytetracycline',
        dosage: '250mg',
        administration_method: 'Oral',
        start_date: '2026-06-12',
        end_date: '2026-06-18',
        veterinarian_id: vetId,
        created_at: now,
      },
    ],
    vaccinations: [
      {
        vaccination_id: 'vacc-001',
        animal_id: animalId,
        vaccine: 'FMD Vaccine',
        scheduled_date: '2026-06-25',
        status: 'Pending',
        reminder_sent: false,
        created_at: now,
      },
    ],
    diseasereports: [
      {
        report_id: 'disease-001',
        animal_id: animalId,
        disease: 'Mastitis',
        severity: 'Moderate',
        status: 'Under Review',
        assigned_vet: 'Dr. Anjali Sharma',
        created_at: now,
      },
    ],
    prescriptions: [],
    withdrawalperiods: [{ withdrawal_id: 'wd-001', drug_name: 'Oxytetracycline', days_required: 14 }],
    compliancereports: [{ report_id: 'report-001', farm_id: farmId, compliance_score: 91, generated_at: now }],
    blockchainlogs: [],
    notifications: [
      {
        notification_id: 'notif-001',
        user_id: demoUserId,
        title: 'Withdrawal window is nearing',
        message: 'Oxytetracycline withdrawal closes in 3 days.',
        status: 'pending',
        created_at: now,
      },
    ],
    qrverification: [],
  };
}

async function ensurePostgresConnection() {
  if (postgresReady || !process.env.DATABASE_URL) {
    return postgresReady;
  }

  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    await pool.query('SELECT 1');
    postgresReady = true;
    return true;
  } catch (error) {
    postgresReady = false;
    pool = null;
    return false;
  }
}

function parseValue(rawValue, params) {
  if (rawValue === undefined) return undefined;
  const value = rawValue.trim();
  if (!value) return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'NULL' || value === 'null') return null;
  if (value === 'NOW()') return new Date().toISOString();
  if (/^\$(\d+)$/.test(value)) {
    const index = Number(value.slice(1)) - 1;
    return params[index];
  }
  if (/^-?\d+$/.test(value)) return Number(value);
  if (/^'(.*)'$/.test(value)) return value.slice(1, -1);
  return value;
}

function getTableKey(tableName) {
  return tableName.toLowerCase();
}

async function query(text, params = []) {
  const usePg = await ensurePostgresConnection();
  if (usePg && pool) {
    return pool.query(text, params);
  }

  return localQuery(text, params);
}

function localQuery(text, params = []) {
  const normalized = text.trim();
  const upper = normalized.toUpperCase();
  const state = ensureStorage();

  if (upper.startsWith('CREATE TABLE')) {
    return { rows: [], rowCount: 0 };
  }

  if (upper.startsWith('INSERT INTO')) {
    const match = normalized.match(/INSERT INTO\s+(\w+)\s*\(([^)]*)\)\s*VALUES\s*\((.*)\)/i);
    if (!match) {
      throw new Error(`Unsupported insert query: ${text}`);
    }

    const [, table, columnsRaw, valuesRaw] = match;
    const columns = columnsRaw.split(',').map((item) => item.trim());
    const values = valuesRaw.split(',').map((item) => parseValue(item.trim(), params));
    const record = columns.reduce((acc, column, index) => {
      acc[column] = values[index];
      return acc;
    }, {});

    const tableKey = getTableKey(table);
    const list = state[tableKey] || [];
    list.push(record);
    state[tableKey] = list;
    saveStorage();
    return { rows: [record], rowCount: 1 };
  }

  if (upper.startsWith('SELECT')) {
    const match = normalized.match(/SELECT\s+(.*?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?$/i);
    if (!match) {
      throw new Error(`Unsupported select query: ${text}`);
    }

    const [, selectClause, table, whereClause, orderClause, limitClause] = match;
    const tableKey = getTableKey(table);
    let rows = [...(state[tableKey] || [])];

    if (whereClause) {
      const whereMatch = whereClause.match(/(\w+)\s*(=|<|>|<=|>=)\s*(.+)/i);
      if (whereMatch) {
        const [, column, operator, rawValue] = whereMatch;
        const wanted = parseValue(rawValue, params);
        rows = rows.filter((row) => {
          const actual = row[column];
          switch (operator) {
            case '=':
              return actual === wanted;
            case '<':
              return actual < wanted;
            case '>':
              return actual > wanted;
            case '<=':
              return actual <= wanted;
            case '>=':
              return actual >= wanted;
            default:
              return true;
          }
        });
      }
    }

    if (orderClause) {
      const [orderColumn, direction] = orderClause.split(/\s+/).filter(Boolean);
      rows.sort((a, b) => {
        const left = a[orderColumn];
        const right = b[orderColumn];
        if (left === right) return 0;
        const multiplier = direction && direction.toUpperCase() === 'DESC' ? -1 : 1;
        return left > right ? multiplier : -multiplier;
      });
    }

    if (limitClause) {
      rows = rows.slice(0, Number(limitClause));
    }

    if (selectClause.trim().toUpperCase() === 'COUNT(*)') {
      return { rows: [{ count: rows.length }], rowCount: rows.length };
    }

    return { rows, rowCount: rows.length };
  }

  if (upper.startsWith('UPDATE')) {
    const match = normalized.match(/UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(.+)/i);
    if (!match) {
      throw new Error(`Unsupported update query: ${text}`);
    }

    const [, table, assignmentsRaw, whereClause] = match;
    const tableKey = getTableKey(table);
    const rows = state[tableKey] || [];
    const whereMatch = whereClause.match(/(\w+)\s*(=|<|>|<=|>=)\s*(.+)/i);
    if (!whereMatch) {
      throw new Error('Unsupported where clause');
    }

    const [, column, operator, rawValue] = whereMatch;
    const wanted = parseValue(rawValue, params);
    const updates = assignmentsRaw.split(',').reduce((acc, item) => {
      const [field, raw] = item.split('=').map((part) => part.trim());
      acc[field] = parseValue(raw, params);
      return acc;
    }, {});

    const updatedRows = rows.map((row) => {
      let matchRow = false;
      switch (operator) {
        case '=':
          matchRow = row[column] === wanted;
          break;
        case '<':
          matchRow = row[column] < wanted;
          break;
        case '>':
          matchRow = row[column] > wanted;
          break;
        case '<=':
          matchRow = row[column] <= wanted;
          break;
        case '>=':
          matchRow = row[column] >= wanted;
          break;
        default:
          matchRow = false;
      }

      if (matchRow) {
        return { ...row, ...updates };
      }
      return row;
    });
    state[tableKey] = updatedRows;
    saveStorage();
    return { rows: updatedRows, rowCount: updatedRows.length };
  }

  if (upper.startsWith('DELETE FROM')) {
    const match = normalized.match(/DELETE FROM\s+(\w+)\s+WHERE\s+(.+)/i);
    if (!match) {
      throw new Error(`Unsupported delete query: ${text}`);
    }

    const [, table, whereClause] = match;
    const tableKey = getTableKey(table);
    const rows = state[tableKey] || [];
    const whereMatch = whereClause.match(/(\w+)\s*(=|<|>|<=|>=)\s*(.+)/i);
    if (!whereMatch) {
      throw new Error('Unsupported where clause');
    }

    const [, column, operator, rawValue] = whereMatch;
    const wanted = parseValue(rawValue, params);
    const remaining = rows.filter((row) => {
      switch (operator) {
        case '=':
          return row[column] !== wanted;
        case '<':
          return row[column] >= wanted;
        case '>':
          return row[column] <= wanted;
        case '<=':
          return row[column] > wanted;
        case '>=':
          return row[column] < wanted;
        default:
          return true;
      }
    });
    state[tableKey] = remaining;
    saveStorage();
    return { rows: remaining, rowCount: remaining.length };
  }

  throw new Error(`Unsupported query: ${text}`);
}

async function initDatabase() {
  const state = ensureStorage();
  const defaults = createDefaultState();
  const needsSeed = !state.users?.length || !state.animals?.length || !state.vaccinations?.length || !state.diseasereports?.length;

  if (!needsSeed) {
    return;
  }

  store = {
    ...defaults,
    ...state,
    users: state.users?.length ? state.users : defaults.users,
    farms: state.farms?.length ? state.farms : defaults.farms,
    animals: state.animals?.length ? state.animals : defaults.animals,
    veterinarians: state.veterinarians?.length ? state.veterinarians : defaults.veterinarians,
    treatments: state.treatments?.length ? state.treatments : defaults.treatments,
    vaccinations: state.vaccinations?.length ? state.vaccinations : defaults.vaccinations,
    diseasereports: state.diseasereports?.length ? state.diseasereports : defaults.diseasereports,
    prescriptions: state.prescriptions || defaults.prescriptions,
    withdrawalperiods: state.withdrawalperiods || defaults.withdrawalperiods,
    compliancereports: state.compliancereports || defaults.compliancereports,
    blockchainlogs: state.blockchainlogs || defaults.blockchainlogs,
    notifications: state.notifications || defaults.notifications,
    qrverification: state.qrverification || defaults.qrverification,
  };
  saveStorage();
}

module.exports = {
  query,
  initDatabase,
};
