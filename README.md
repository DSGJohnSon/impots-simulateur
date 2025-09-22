# Simulateur d'Impôts 2025

Une application Next.js pour simuler et calculer vos impôts sur le revenu pour l'année 2025.

## 🚀 Fonctionnalités

- **Dashboard** : Vue d'ensemble de vos revenus et impôts estimés
- **Gestion des revenus** : Ajout et suivi de tous vos types de revenus
- **Vue mensuelle** : Détail de vos revenus mois par mois
- **Calculs détaillés** : Analyse complète de votre situation fiscale
- **Explications** : Guide complet sur le fonctionnement des calculs

## 💰 Types de revenus supportés

- **Salaires** : Revenus de vos emplois salariés
- **Auto-entrepreneur BIC** : Prestations de services commerciales (abattement 50%)
- **Auto-entrepreneur BNC** : Prestations de services libérales (abattement 34%)
- **Indemnités chômage** : Allocations France Travail
- **Dons** : Réduction d'impôt de 66% (limite 20% du revenu imposable)

## 🛠️ Technologies utilisées

- **Next.js 15** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **Supabase** pour la base de données
- **Heroicons** pour les icônes

## 📋 Prérequis

Avant de commencer, vous devez :

1. **Configurer Supabase** :
   - Créer un projet sur [supabase.com](https://supabase.com)
   - Exécuter le script SQL fourni (`supabase-schema.sql`) dans l'éditeur SQL de Supabase
   - Récupérer l'URL du projet et la clé API publique

2. **Installer pnpm** (si ce n'est pas déjà fait) :
   ```bash
   npm install -g pnpm
   ```

## 🚀 Installation et démarrage

1. **Cloner le projet** :
   ```bash
   git clone <url-du-repo>
   cd impots-simulator
   ```

2. **Installer les dépendances** :
   ```bash
   pnpm install
   ```

3. **Configurer les variables d'environnement** :
   Créer un fichier `.env.local` avec :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_api_supabase
   ```

4. **Configurer la base de données** :
   - Aller dans votre projet Supabase
   - Ouvrir l'éditeur SQL
   - Copier et exécuter le contenu du fichier `supabase-schema.sql`

5. **Démarrer l'application** :
   ```bash
   pnpm dev
   ```

6. **Ouvrir l'application** :
   Aller sur [http://localhost:3000](http://localhost:3000)

## 📊 Structure de la base de données

### Table `revenus`
- `id` : UUID (clé primaire)
- `date` : Date du revenu
- `organisme` : Nom de l'organisme payeur
- `type_revenu` : Type de revenu (salaire, auto_entrepreneur_bic, auto_entrepreneur_bnc, chomage)
- `montant` : Montant en euros
- `created_at` : Date de création

### Table `dons`
- `id` : UUID (clé primaire)
- `date` : Date du don
- `organisme` : Organisme bénéficiaire
- `montant` : Montant en euros
- `created_at` : Date de création

## 🧮 Calculs fiscaux

L'application utilise :
- **Barèmes 2024** comme estimation pour 2025
- **Abattements auto-entrepreneur** : 50% pour BIC, 34% pour BNC
- **Réduction dons** : 66% dans la limite de 20% du revenu imposable
- **Barème progressif** français avec 5 tranches d'imposition

## 📱 Pages de l'application

1. **Dashboard (/)** : Vue d'ensemble avec métriques principales
2. **Ajouter un revenu (/add-revenue)** : Formulaires pour revenus et dons
3. **Vue mensuelle (/monthly)** : Détail des revenus par mois
4. **Calculs détaillés (/calculations)** : Analyse fiscale complète
5. **Explications (/explanations)** : Guide des calculs fiscaux

## ⚠️ Avertissements

- Cette application fournit une **estimation** basée sur les barèmes 2024
- Les calculs ne remplacent pas votre déclaration officielle
- Les barèmes définitifs 2025 peuvent différer
- Consultez un professionnel pour des situations complexes

## 🔧 Développement

### Scripts disponibles

```bash
# Démarrage en mode développement
pnpm dev

# Build de production
pnpm build

# Démarrage en production
pnpm start

# Linting
pnpm lint
```

### Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Dashboard
│   ├── add-revenue/       # Ajout de revenus
│   ├── monthly/           # Vue mensuelle
│   ├── calculations/      # Calculs détaillés
│   └── explanations/      # Explications
├── components/
│   ├── layout/            # Composants de layout
│   └── ui/                # Composants UI réutilisables
└── lib/
    ├── supabase.ts        # Configuration Supabase
    └── tax-calculator.ts  # Logique de calcul fiscal
```

## 📄 Licence

Ce projet est sous licence MIT.
