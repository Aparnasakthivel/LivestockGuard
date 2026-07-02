CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS farms (
  farm_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id),
  farm_name TEXT NOT NULL,
  location TEXT,
  registration_number TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS animals (
  animal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID NOT NULL REFERENCES farms(farm_id),
  species TEXT NOT NULL,
  breed TEXT,
  age INTEGER,
  weight NUMERIC,
  gender TEXT,
  qr_code TEXT,
  rfid_tag TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS veterinarians (
  vet_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  license_number TEXT UNIQUE NOT NULL,
  specialization TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS treatments (
  treatment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID NOT NULL REFERENCES animals(animal_id),
  disease TEXT NOT NULL,
  drug_name TEXT NOT NULL,
  dosage TEXT,
  administration_method TEXT,
  start_date DATE,
  end_date DATE,
  veterinarian_id UUID REFERENCES veterinarians(vet_id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prescriptions (
  prescription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  treatment_id UUID NOT NULL REFERENCES treatments(treatment_id),
  prescription_file TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS withdrawalperiods (
  withdrawal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drug_name TEXT NOT NULL,
  days_required INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS compliancereports (
  report_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(farm_id),
  compliance_score INTEGER,
  generated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blockchainlogs (
  transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_number INTEGER,
  timestamp TIMESTAMP DEFAULT NOW(),
  animal_id UUID REFERENCES animals(animal_id),
  details JSONB
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qrverification (
  verification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  animal_id UUID REFERENCES animals(animal_id),
  product_name TEXT,
  verified BOOLEAN DEFAULT FALSE,
  scanned_at TIMESTAMP
);
