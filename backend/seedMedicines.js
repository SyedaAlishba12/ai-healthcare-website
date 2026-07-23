// backend/seedMedicines.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Medicine from './models/Medicine.js'; // '.js' extension zaroori hai

// for loading Environment variables 
dotenv.config();

const dummyMedicines = [
  {
    "name": "Panadol (Paracetamol)",
    "category": "Tablets",
    "price": 40,
    "image": "/images/panadol.jpg",
    "description": "Used to treat mild to moderate pain (from headaches, menstrual periods, toothaches, backaches, osteoarthritis, or cold/flu aches) and to reduce fever.",
    "dosage": "1-2 tablets three to four times a day as prescribed, not exceeding 8 tablets in 24 hours.",
    "manufacturer": "GlaxoSmithKline (GSK)",
    "stock": true
  },
  {
    "name": "Nuberol (Orphenadrine + Paracetamol)",
    "category": "Tablets",
    "price": 120,
    "image": "/images/nuberol.jpg",
    "description": "Specifically formulated muscle relaxant and analgesic combination. Used for acute, painful musculoskeletal conditions, muscle spasms, tension headaches, and traumatic muscle injuries.",
    "dosage": "1 tablet twice daily or as directed by a healthcare professional.",
    "manufacturer": "Searle Pakistan",
    "stock": true
  },
  {
    "name": "Risek Capsule (Omeprazole)",
    "category": "Tablets",
    "price": 380,
    "image": "/images/risek.jpg",
    "description": "Proton pump inhibitor (PPI) designed to treat Gastro-Esophageal Reflux Disease (GERD), gastric and duodenal ulcers, and acid hypersecretion syndromes.",
    "dosage": "Take 1 capsule (20mg/40mg) daily 30 minutes before breakfast with a glass of water.",
    "manufacturer": "Getz Pharma",
    "stock": true
  },
  {
    "name": "Amoxil Capsule (Amoxicillin)",
    "category": "Tablets",
    "price": 290,
    "image": "/images/amoxil.jpg",
    "description": "Broad-spectrum penicillin antibiotic used to cure bacterial infections of the middle ear, tonsils, throat, respiratory tract, urinary tract, and skin.",
    "dosage": "1 capsule three times daily for 5 to 7 days. Complete the entire course even if symptoms disappear.",
    "manufacturer": "GlaxoSmithKline (GSK)",
    "stock": true
  },
  {
    "name": "Brufen Syrup (Ibuprofen)",
    "category": "Syrups",
    "price": 110,
    "image": "/images/brufen.jpg",
    "description": "Non-steroidal anti-inflammatory drug (NSAID) in liquid form. Used to lower fever, soothe toothaches, teething pain, minor body aches, and swelling in children.",
    "dosage": "Children (over 3 months): Dosage is determined based on age/weight, typically 5ml three times a day after milk or food.",
    "manufacturer": "Abbott Laboratories",
    "stock": true
  },
  {
    "name": "Hydryllin Syrup (Aminophylline + Diphenhydramine)",
    "category": "Syrups",
    "price": 95,
    "image": "/images/hydryllin.jpg",
    "description": "Bronchodilator and antihistamine liquid. Provides relief from irritating dry coughs, chest congestion, throat spasms, allergic irritation, and respiratory tightness.",
    "dosage": "Adults: 2 teaspoons (10ml) three to four times daily. May cause mild drowsiness.",
    "manufacturer": "Searle Pakistan",
    "stock": true
  },
  {
    "name": "Myrin P Forte (Antituberculosis Therapy)",
    "category": "Tablets",
    "price": 420,
    "image": "/images/myrin.jpg",
    "description": "Four-drug combination antituberculous therapy containing Ethambutol, Rifampicin, Isoniazid, and Pyrazinamide. Critical for treatment of active pulmonary and extra-pulmonary tuberculosis.",
    "dosage": "Strictly as prescribed by your pulmonologist based on overall body weight, taken on an empty stomach.",
    "manufacturer": "Pfizer Pakistan",
    "stock": true
  },
  {
    "name": "Vita 6 Tablet (Vitamin B6 / Pyridoxine)",
    "category": "Tablets",
    "price": 89,
    "image": "/images/vita6.jpg",
    "description": "Essential water-soluble B-complex vitamin. Prescribed to treat Vitamin B6 deficiencies, metabolic disorders, peripheral neuropathy induced by specific drugs, and certain types of anemia.",
    "dosage": "1 tablet daily after a meal or as customized by your consulting physician.",
    "manufacturer": "Chasa Mendoza",
    "stock": true
  },
  {
    "name": "Ventolin Inhaler (Salbutamol)",
    "category": "Inhalers",
    "price": 280,
    "image": "/images/ventolin.jpg",
    "description": "Fast-acting rescue bronchodilator. Relieves sudden asthma attacks, wheezing, shortness of breath, and exercise-induced bronchospasms by opening the respiratory airway immediately.",
    "dosage": "1 or 2 puffs inhaled deeply as a rescue medicine when experiencing breathing trouble.",
    "manufacturer": "GlaxoSmithKline (GSK)",
    "stock": true
  },
  {
    "name": "Symbicort Inhaler (Budesonide + Formoterol)",
    "category": "Inhalers",
    "price": 1150,
    "image": "/images/symbicort.jpg",
    "description": "Long-term controller/preventer aerosol. Combines a corticosteroid and a long-acting beta-agonist (LABA) to keep chronic asthma and COPD under daily maintenance control.",
    "dosage": "1 to 2 inhalations twice daily (morning and evening). Rinse mouth thoroughly with water after each use.",
    "manufacturer": "AstraZeneca",
    "stock": true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔌 Connected to MongoDB Cloud for seeding...");

    await Medicine.deleteMany();
    console.log("🧼 Old medicine records cleared!");

    await Medicine.insertMany(dummyMedicines);
    console.log("🎉 Successfully seeded medicines into your cloud database with local image paths!");

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();