-- Création de la table des revenus
CREATE TABLE IF NOT EXISTS revenus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  organisme TEXT NOT NULL,
  type_revenu TEXT NOT NULL CHECK (type_revenu IN ('salaire', 'auto_entrepreneur_bic', 'auto_entrepreneur_bnc', 'chomage')),
  montant DECIMAL(10,2) NOT NULL CHECK (montant >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des dons
CREATE TABLE IF NOT EXISTS dons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  organisme TEXT NOT NULL,
  montant DECIMAL(10,2) NOT NULL CHECK (montant >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes par date
CREATE INDEX IF NOT EXISTS idx_revenus_date ON revenus(date);
CREATE INDEX IF NOT EXISTS idx_dons_date ON dons(date);

-- Index pour les requêtes par type de revenu
CREATE INDEX IF NOT EXISTS idx_revenus_type ON revenus(type_revenu);

-- Politique RLS (Row Level Security) - pour l'instant ouverte, à ajuster selon les besoins
ALTER TABLE revenus ENABLE ROW LEVEL SECURITY;
ALTER TABLE dons ENABLE ROW LEVEL SECURITY;

-- Politique permettant toutes les opérations (à ajuster pour la sécurité)
CREATE POLICY "Allow all operations on revenus" ON revenus FOR ALL USING (true);
CREATE POLICY "Allow all operations on dons" ON dons FOR ALL USING (true);