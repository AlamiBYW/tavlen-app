import Database from 'better-sqlite3';
import path from 'path';
import bcryptjs from 'bcryptjs';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'tavlen.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDb();
  }
  return db;
}

function initializeDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      full_desc TEXT NOT NULL DEFAULT '',
      cover_image TEXT DEFAULT '',
      gallery TEXT DEFAULT '[]',
      sector TEXT DEFAULT '',
      client TEXT DEFAULT '',
      date TEXT DEFAULT '',
      methodology TEXT DEFAULT '',
      results TEXT DEFAULT '',
      testimonial TEXT DEFAULT '',
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      full_desc TEXT NOT NULL DEFAULT '',
      cover_image TEXT DEFAULT '',
      category TEXT DEFAULT '',
      target_client TEXT DEFAULT '',
      steps TEXT DEFAULT '',
      pricing TEXT DEFAULT '',
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS formations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      full_desc TEXT NOT NULL DEFAULT '',
      cover_image TEXT DEFAULT '',
      program TEXT DEFAULT '',
      duration TEXT DEFAULT '',
      format TEXT DEFAULT '',
      target_audience TEXT DEFAULT '',
      price TEXT DEFAULT '',
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      full_desc TEXT NOT NULL DEFAULT '',
      cover_image TEXT DEFAULT '',
      gallery TEXT DEFAULT '[]',
      event_date TEXT DEFAULT '',
      location TEXT DEFAULT '',
      video_replay TEXT DEFAULT '',
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_info (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT DEFAULT '',
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      suffix TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed admin user if not exists
  const adminExists = db.prepare('SELECT id FROM admin_users LIMIT 1').get();
  if (!adminExists) {
    const hash = bcryptjs.hashSync('TavlenAdmin2024!', 10);
    db.prepare('INSERT INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)').run(
      'admin@tavlensolutions.com', hash, 'Aymane El Alami'
    );
  }

  // Seed site content if not exists
  const contentExists = db.prepare("SELECT key FROM site_content WHERE key = 'hero_title' LIMIT 1").get();
  if (!contentExists) {
    const contentEntries = [
      ['hero_title', "L'Intelligence Artificielle au service de l'Ingénierie Industrielle"],
      ['hero_subtitle', "Cabinet de conseil, services et formation en IA appliquée à l'ingénierie mécanique et industrielle"],
      ['hero_cta', 'Découvrir nos services'],
      ['about_title', 'Qui sommes-nous'],
      ['about_text', "TAVLEN Solutions est un cabinet de conseil innovant fondé par Aymane El Alami, étudiant-ingénieur en Génie Mécanique à l'École Mohammadia d'Ingénieurs (EMI) de Rabat. Notre mission : accélérer la transformation digitale de l'industrie en combinant une double expertise en ingénierie mécanique et en intelligence artificielle.\n\nNous accompagnons les entreprises industrielles dans l'intégration de solutions IA sur mesure — de l'optimisation des processus de production à la maintenance prédictive, en passant par la création de jumeaux numériques et la formation de vos équipes aux outils de demain."],
      ['about_founder', 'Aymane El Alami'],
      ['about_founder_title', 'Fondateur & Consultant IA'],
      ['about_founder_bio', "Étudiant-ingénieur en Génie Mécanique à l'EMI, passionné par l'intersection entre l'intelligence artificielle et l'ingénierie industrielle. Certifié en Machine Learning et Deep Learning, avec une expérience pratique dans l'application de l'IA aux défis industriels réels."],
      ['services_title', 'Nos Services'],
      ['services_subtitle', "Des solutions d'IA sur mesure pour chaque défi industriel"],
      ['projects_title', 'Nos Projets'],
      ['projects_subtitle', 'Des réalisations concrètes au service de la performance industrielle'],
      ['formations_title', 'Nos Formations'],
      ['formations_subtitle', "Montez en compétences sur les technologies d'avenir"],
      ['events_title', 'Événements & Workshops'],
      ['events_subtitle', "Rencontrez-nous lors de nos prochains événements"],
    ];
    const insertContent = db.prepare('INSERT OR IGNORE INTO site_content (key, value) VALUES (?, ?)');
    contentEntries.forEach(([key, value]) => insertContent.run(key, value));
  }

  // Seed contact info
  const contactExists = db.prepare("SELECT key FROM contact_info WHERE key = 'email' LIMIT 1").get();
  if (!contactExists) {
    const contactEntries = [
      ['email', 'contact@tavlensolutions.com'],
      ['phone', '+212 6 00 00 00 00'],
      ['whatsapp', '+212600000000'],
      ['linkedin', 'https://linkedin.com/company/tavlen-solutions'],
      ['address', "Rabat, Maroc — École Mohammadia d'Ingénieurs"],
    ];
    const insertContact = db.prepare('INSERT OR IGNORE INTO contact_info (key, value) VALUES (?, ?)');
    contactEntries.forEach(([key, value]) => insertContact.run(key, value));
  }

  // Seed stats
  const statsExist = db.prepare('SELECT id FROM stats LIMIT 1').get();
  if (!statsExist) {
    const statsEntries = [
      ['Projets Réalisés', '15', '+', 1],
      ['Secteurs Industriels', '5', '', 2],
      ['Formations Dispensées', '10', '+', 3],
      ['Clients Satisfaits', '98', '%', 4],
    ];
    const insertStat = db.prepare('INSERT INTO stats (label, value, suffix, sort_order) VALUES (?, ?, ?, ?)');
    statsEntries.forEach(([label, value, suffix, order]) => insertStat.run(label, value, suffix, order));
  }

  // Seed projects
  const projectsExist = db.prepare('SELECT id FROM projects LIMIT 1').get();
  if (!projectsExist) {
    const projects = [
      {
        slug: 'optimisation-ia-lignes-production',
        title: 'Optimisation IA des Lignes de Production',
        short_desc: "Déploiement d'algorithmes de Machine Learning pour optimiser les rendements d'une chaîne de production automobile, réduisant les temps d'arrêt de 35%.",
        full_desc: "Ce projet a consisté à développer et déployer un système intelligent d'optimisation des lignes de production pour un acteur majeur de l'industrie automobile au Maroc.\n\nEn combinant des capteurs IoT, du traitement de données en temps réel et des modèles de Machine Learning avancés, nous avons créé un système capable de prédire les goulots d'étranglement, d'ajuster automatiquement les paramètres de production et de réduire significativement les temps d'arrêt non planifiés.\n\nLes résultats ont dépassé les objectifs initiaux avec une réduction de 35% des temps d'arrêt et une amélioration de 20% du rendement global de la ligne.",
        cover_image: '/images/demo/project-ai-production.jpg',
        sector: 'Automobile',
        client: 'Confidentiel',
        date: '2024',
        methodology: "1. Audit des processus existants et identification des points critiques\n2. Installation de capteurs IoT sur les équipements clés\n3. Collecte et analyse de données historiques (6 mois)\n4. Développement de modèles prédictifs (Random Forest, XGBoost)\n5. Intégration en temps réel avec le système SCADA existant\n6. Formation des opérateurs à l'interprétation des alertes IA",
        results: "• Réduction de 35% des temps d'arrêt non planifiés\n• Amélioration de 20% du rendement global\n• ROI atteint en 4 mois\n• Système autonome nécessitant une maintenance minimale",
        status: 'published',
        sort_order: 1,
      },
      {
        slug: 'jumeau-numerique-turbine-eolienne',
        title: 'Jumeau Numérique — Turbine Éolienne',
        short_desc: "Création d'un jumeau numérique complet d'une turbine éolienne pour simuler les performances et anticiper les défaillances mécaniques.",
        full_desc: "Le projet de jumeau numérique pour turbine éolienne représente une avancée majeure dans la maintenance prédictive des énergies renouvelables.\n\nNous avons développé une réplique digitale complète d'une turbine éolienne de 2MW, intégrant les modèles physiques (aérodynamique, mécanique des structures, électrotechnique) avec des couches d'intelligence artificielle pour la prédiction de défaillances.\n\nLe système permet de simuler différents scénarios de charge, de prédire l'usure des composants critiques (pales, roulements, boîte de vitesses) et d'optimiser les interventions de maintenance.",
        cover_image: '/images/demo/project-digital-twin.jpg',
        sector: 'Énergie Renouvelable',
        client: 'Parc Éolien — Région Tanger-Tétouan',
        date: '2024',
        methodology: "1. Modélisation physique multi-corps de la turbine (ANSYS + Python)\n2. Intégration des données SCADA historiques (2 ans)\n3. Développement de modèles de dégradation par Deep Learning (LSTM)\n4. Création de l'interface de visualisation 3D temps réel\n5. Validation par comparaison avec les données terrain",
        results: "• Prédiction des défaillances 3 semaines à l'avance\n• Réduction de 40% des coûts de maintenance\n• Augmentation de 12% de la disponibilité\n• Interface de monitoring accessible à distance",
        status: 'published',
        sort_order: 2,
      },
      {
        slug: 'maintenance-predictive-automobile',
        title: 'Maintenance Prédictive — Industrie Automobile',
        short_desc: "Système de maintenance prédictive basé sur le Deep Learning pour anticiper les pannes des robots de soudure sur une ligne d'assemblage.",
        full_desc: "Ce projet innovant a permis de transformer radicalement l'approche de maintenance d'une ligne d'assemblage automobile en passant d'une maintenance réactive et préventive à une maintenance véritablement prédictive.\n\nEn analysant les signaux vibratoires, acoustiques et thermiques des robots de soudure à l'aide de réseaux de neurones profonds (CNN 1D + Transformers), nous avons développé un système capable d'identifier les signes précurseurs de défaillance bien avant qu'elles ne surviennent.\n\nLe système a été déployé sur 24 robots de soudure et fonctionne en continu depuis plus de 6 mois avec un taux de détection supérieur à 95%.",
        cover_image: '/images/demo/project-maintenance.jpg',
        sector: 'Automobile',
        client: 'Confidentiel',
        date: '2023',
        methodology: "1. Instrumentation des robots (accéléromètres, microphones, thermocouples)\n2. Collecte de données en conditions normales et dégradées\n3. Développement d'un pipeline de feature engineering automatisé\n4. Entraînement de modèles CNN-1D et Transformer\n5. Déploiement edge computing sur chaque poste\n6. Dashboard temps réel pour les équipes maintenance",
        results: "• Taux de détection des défaillances : 95.3%\n• Faux positifs : < 2%\n• Réduction de 50% des arrêts non planifiés\n• Économie estimée : 800K MAD/an",
        status: 'published',
        sort_order: 3,
      },
    ];

    const insertProject = db.prepare(`
      INSERT INTO projects (slug, title, short_desc, full_desc, cover_image, sector, client, date, methodology, results, status, sort_order)
      VALUES (@slug, @title, @short_desc, @full_desc, @cover_image, @sector, @client, @date, @methodology, @results, @status, @sort_order)
    `);
    projects.forEach(p => insertProject.run(p));
  }

  // Seed services
  const servicesExist = db.prepare('SELECT id FROM services LIMIT 1').get();
  if (!servicesExist) {
    const services = [
      {
        slug: 'conseil-ia-industrielle',
        title: "Conseil en IA Industrielle",
        short_desc: "Accompagnement stratégique pour identifier et implémenter les cas d'usage IA les plus impactants pour votre activité industrielle.",
        full_desc: "Notre service de conseil en IA industrielle vous accompagne de A à Z dans votre transformation digitale.\n\nNous commençons par un audit approfondi de vos processus industriels pour identifier les opportunités d'optimisation par l'IA. Nous définissons ensuite une feuille de route pragmatique, priorisant les cas d'usage à fort ROI.\n\nNotre double expertise en ingénierie mécanique et en intelligence artificielle nous permet de comprendre vos contraintes techniques réelles et de proposer des solutions véritablement adaptées à votre contexte industriel.",
        cover_image: '/images/demo/service-consulting.jpg',
        category: 'AI x Industrie',
        target_client: "PME et ETI industrielles souhaitant explorer ou accélérer leur adoption de l'IA",
        steps: "1. Audit initial & diagnostic (1-2 semaines)\n2. Identification des cas d'usage prioritaires\n3. Étude de faisabilité technique et économique\n4. Feuille de route IA personnalisée\n5. Accompagnement à la mise en œuvre\n6. Suivi post-déploiement",
        pricing: 'Sur devis — à partir de 5 000 MAD',
        status: 'published',
        sort_order: 1,
      },
      {
        slug: 'digitalisation-processus',
        title: 'Digitalisation des Processus',
        short_desc: "Transformation digitale de vos processus industriels : de la collecte de données IoT à l'automatisation intelligente des flux de travail.",
        full_desc: "La digitalisation des processus industriels est le socle indispensable de toute stratégie d'Industrie 4.0.\n\nNous vous aidons à connecter vos machines, à centraliser vos données et à automatiser vos flux de travail pour gagner en efficacité, en traçabilité et en réactivité.\n\nDe l'installation de capteurs IoT à la création de tableaux de bord temps réel, en passant par l'automatisation des rapports et la mise en place de systèmes d'alerte intelligents, nous couvrons l'ensemble de la chaîne de valeur digitale.",
        cover_image: '/images/demo/service-digital.jpg',
        category: 'Transformation Digitale',
        target_client: 'Industries manufacturières, usines de production, ateliers mécaniques',
        steps: "1. Cartographie des processus actuels\n2. Identification des points de digitalisation\n3. Sélection et installation des capteurs/outils\n4. Développement des interfaces et dashboards\n5. Formation des équipes\n6. Support et maintenance",
        pricing: 'Sur devis',
        status: 'published',
        sort_order: 2,
      },
      {
        slug: 'formation-ia-ingenieurs',
        title: 'Formation IA pour Ingénieurs',
        short_desc: "Programmes de formation sur mesure pour permettre à vos ingénieurs de maîtriser les outils d'IA appliqués à leur domaine d'expertise.",
        full_desc: "Nos formations sont conçues spécifiquement pour les ingénieurs et techniciens de l'industrie qui souhaitent acquérir des compétences en IA sans avoir à devenir data scientists.\n\nChaque programme est adapté au secteur d'activité et au niveau de vos équipes. Nous privilégions une approche pratique avec des cas d'usage réels issus de l'industrie.\n\nDe l'initiation au Machine Learning à l'implémentation de modèles de Deep Learning pour la vision industrielle, nos formations couvrent l'ensemble du spectre des compétences IA pour l'industrie.",
        cover_image: '/images/demo/service-training.jpg',
        category: 'Formation',
        target_client: 'Ingénieurs, techniciens, responsables R&D et production',
        steps: "1. Évaluation du niveau et des besoins\n2. Conception du programme sur mesure\n3. Formation théorique + ateliers pratiques\n4. Projet fil rouge sur données réelles\n5. Certification de compétences\n6. Support post-formation (3 mois)",
        pricing: 'À partir de 2 000 MAD / participant',
        status: 'published',
        sort_order: 3,
      },
    ];

    const insertService = db.prepare(`
      INSERT INTO services (slug, title, short_desc, full_desc, cover_image, category, target_client, steps, pricing, status, sort_order)
      VALUES (@slug, @title, @short_desc, @full_desc, @cover_image, @category, @target_client, @steps, @pricing, @status, @sort_order)
    `);
    services.forEach(s => insertService.run(s));
  }

  // Seed formations
  const formationsExist = db.prepare('SELECT id FROM formations LIMIT 1').get();
  if (!formationsExist) {
    const formations = [
      {
        slug: 'introduction-machine-learning-industrie',
        title: "Introduction au Machine Learning pour l'Industrie",
        short_desc: "Formation pratique de 3 jours pour comprendre et appliquer les algorithmes de Machine Learning aux problématiques industrielles réelles.",
        full_desc: "Cette formation intensive de 3 jours est conçue pour les ingénieurs et techniciens de l'industrie souhaitant acquérir les fondamentaux du Machine Learning et les appliquer immédiatement à leurs problématiques métier.\n\nÀ travers des exemples concrets issus de l'industrie (maintenance prédictive, contrôle qualité, optimisation de processus), vous apprendrez à collecter, préparer et analyser vos données, à choisir et entraîner le bon algorithme, et à évaluer les performances de vos modèles.\n\nAucun prérequis en programmation n'est nécessaire — nous vous accompagnons pas à pas.",
        cover_image: '/images/demo/formation-ml.jpg',
        program: "Jour 1 : Fondamentaux\n• Introduction à l'IA et au Machine Learning\n• Types d'apprentissage (supervisé, non supervisé)\n• Préparation et nettoyage des données industrielles\n• Premiers modèles : régression, classification\n\nJour 2 : Approfondissement\n• Algorithmes avancés : Random Forest, SVM, XGBoost\n• Feature engineering pour données industrielles\n• Validation et évaluation des modèles\n• Cas pratique : maintenance prédictive\n\nJour 3 : Mise en pratique\n• Projet sur données réelles\n• Déploiement d'un modèle simple\n• Bonnes pratiques et pièges à éviter\n• Feuille de route personnalisée",
        duration: '3 jours (21 heures)',
        format: 'Présentiel ou en ligne',
        target_audience: 'Ingénieurs, techniciens, responsables production/qualité',
        price: '3 500 MAD / participant',
        status: 'published',
        sort_order: 1,
      },
      {
        slug: 'deep-learning-vision-industrielle',
        title: 'Deep Learning Appliqué à la Vision Industrielle',
        short_desc: "Formation avancée de 5 jours sur l'utilisation des réseaux de neurones profonds pour l'inspection visuelle automatisée et le contrôle qualité.",
        full_desc: "Cette formation avancée vous plonge dans le monde du Deep Learning appliqué à la vision industrielle — l'une des applications les plus prometteuses de l'IA dans l'industrie.\n\nVous apprendrez à concevoir, entraîner et déployer des modèles de vision par ordinateur pour l'inspection automatisée, la détection de défauts, la classification de pièces et le contrôle qualité en temps réel.\n\nLa formation alterne entre théorie, démonstrations et travaux pratiques sur des jeux de données industriels réels.",
        cover_image: '/images/demo/formation-dl.jpg',
        program: "Jour 1-2 : Fondamentaux du Deep Learning\n• Réseaux de neurones : perceptron, backpropagation\n• CNN : convolutions, pooling, architectures\n• Transfer Learning et fine-tuning\n• Frameworks : PyTorch / TensorFlow\n\nJour 3-4 : Vision Industrielle\n• Détection d'objets (YOLO, SSD)\n• Segmentation d'images\n• Détection d'anomalies visuelles\n• Cas pratiques : contrôle qualité, inspection de surface\n\nJour 5 : Déploiement & Projet\n• Déploiement sur edge devices (Raspberry Pi, Jetson)\n• Optimisation des modèles (quantization, pruning)\n• Projet intégrateur sur données client\n• Perspectives et veille technologique",
        duration: '5 jours (35 heures)',
        format: 'Présentiel',
        target_audience: 'Ingénieurs avec bases en Python et ML',
        price: '6 000 MAD / participant',
        status: 'published',
        sort_order: 2,
      },
    ];

    const insertFormation = db.prepare(`
      INSERT INTO formations (slug, title, short_desc, full_desc, cover_image, program, duration, format, target_audience, price, status, sort_order)
      VALUES (@slug, @title, @short_desc, @full_desc, @cover_image, @program, @duration, @format, @target_audience, @price, @status, @sort_order)
    `);
    formations.forEach(f => insertFormation.run(f));
  }

  // Seed events
  const eventsExist = db.prepare('SELECT id FROM events LIMIT 1').get();
  if (!eventsExist) {
    const events = [
      {
        slug: 'workshop-ia-industrie-4-0-emi',
        title: "Workshop IA & Industrie 4.0 — EMI Rabat",
        short_desc: "Atelier pratique d'une journée à l'École Mohammadia d'Ingénieurs sur l'application de l'IA dans l'industrie 4.0, avec démonstrations live.",
        full_desc: "TAVLEN Solutions organise un workshop exclusif à l'EMI de Rabat, dédié à l'application concrète de l'Intelligence Artificielle dans le contexte de l'Industrie 4.0.\n\nCet événement d'une journée combinera présentations théoriques, démonstrations live de projets IA industriels et ateliers pratiques où les participants pourront manipuler des outils de Machine Learning sur des données industrielles réelles.\n\nOuvert aux étudiants ingénieurs, aux professionnels de l'industrie et à tous les passionnés de technologie.",
        cover_image: '/images/demo/event-workshop.jpg',
        event_date: '2025-03-15',
        location: "École Mohammadia d'Ingénieurs — Rabat, Maroc",
        status: 'published',
        sort_order: 1,
      },
      {
        slug: 'conference-machine-learning-maroc',
        title: 'Conférence Machine Learning Maroc',
        short_desc: "Participation de TAVLEN Solutions à la conférence nationale sur le Machine Learning, avec une présentation sur l'IA dans l'ingénierie mécanique.",
        full_desc: "TAVLEN Solutions participe à la première édition de la Conférence Machine Learning Maroc, un événement rassemblant les acteurs de l'IA au Maroc.\n\nAymane El Alami, fondateur de TAVLEN Solutions, y présentera les résultats de ses travaux sur l'application du Deep Learning à la maintenance prédictive dans l'industrie automobile marocaine.\n\nLa conférence réunira chercheurs, ingénieurs et entrepreneurs autour de tables rondes et de présentations sur l'état de l'art du Machine Learning au Maroc.",
        cover_image: '/images/demo/event-conference.jpg',
        event_date: '2025-05-20',
        location: 'Casablanca, Maroc',
        status: 'published',
        sort_order: 2,
      },
    ];

    const insertEvent = db.prepare(`
      INSERT INTO events (slug, title, short_desc, full_desc, cover_image, event_date, location, status, sort_order)
      VALUES (@slug, @title, @short_desc, @full_desc, @cover_image, @event_date, @location, @status, @sort_order)
    `);
    events.forEach(e => insertEvent.run(e));
  }
}

export default getDb;
