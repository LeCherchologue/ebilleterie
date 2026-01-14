# eBilleterie

Plateforme de billetterie en ligne moderne pour événements (concerts, cinéma, théâtre, sport, expositions).

## 🚀 Fonctionnalités

- **Page d'accueil** avec sections pour différents types d'événements
- **Navigation** complète avec filtres (Populaires/Récents)
- **Détails d'événements** avec possibilité d'achat de tickets
- **Gestion des tickets** pour les utilisateurs
- **Page contact** avec formulaire
- **Espace créateurs d'événements** pour la création et gestion d'événements
- **Design moderne** avec thème sombre et accents verts
- **Bouton WhatsApp** flottant pour le support

## 🛠️ Technologies utilisées

- Vue 3 avec Composition API
- TypeScript
- Vue Router 4
- Vuex 4
- SCSS pour le styling
- PWA ready

## 📦 Installation

```bash
npm install
```

## 🏃 Développement

```bash
npm run serve
```

L'application sera accessible sur `http://localhost:8080`

## 🏗️ Build pour production

```bash
npm run build
```

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Header.vue
│   ├── HeroSection.vue
│   ├── EventCard.vue
│   ├── EventSection.vue
│   └── WhatsAppButton.vue
├── views/              # Pages de l'application
│   ├── HomeView.vue
│   ├── EvenementsView.vue
│   ├── EvenementDetailView.vue
│   ├── MesTicketsView.vue
│   ├── ContactView.vue
│   └── CreateursView.vue
├── store/              # Store Vuex
│   └── index.ts
├── router/             # Configuration des routes
│   └── index.ts
└── types/              # Types TypeScript
    └── event.ts
```

## 🎨 Design

Le design s'inspire de plateformes modernes de billetterie avec :
- Thème sombre (#000, #1a1a1a)
- Accents verts (#00d4aa)
- Accents orange (#ff6b35)
- Interface responsive et moderne

## 📝 Notes

- Les données d'événements sont actuellement stockées dans le store Vuex (à remplacer par une API backend)
- Les fonctionnalités d'achat de tickets et d'inscription créateurs sont à implémenter avec un backend
- Le numéro WhatsApp dans le bouton flottant doit être configuré

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Identifiants API
VUE_APP_API_USERNAME=6008889
VUE_APP_API_PASSWORD=12345678

# Merchant ID (peut être le même que le username)
VUE_APP_MERCHANT_ID=6008889

# Configuration
VUE_APP_CALLBACK_URL=http://localhost:8080/payment/callback
VUE_APP_API_BASE_URL=https://devfront-bamboopay.ventis.group/api
```

**Note importante:** Si vous obtenez l'erreur "Merchant not authorized or not found", le `merchant_id` est probablement incorrect. Il peut être le même que votre `username` (6008889). Vérifiez avec l'équipe BambooPay quel est le bon `merchant_id` pour votre compte.

**Note:** Si vous rencontrez l'erreur `ERR_NAME_NOT_RESOLVED`, vérifiez que :
- Le domaine de l'API est correct et accessible
- Votre connexion internet fonctionne
- L'URL de l'API dans `.env` est correcte

**Note:** Pour la production, remplacez l'URL du callback par votre URL de production.

### Configuration WhatsApp

Pour configurer le numéro WhatsApp, modifiez le fichier `src/components/WhatsAppButton.vue` et remplacez `241XXXXXXXXX` par votre numéro.

### API de paiement

L'application utilise l'API BambooPay pour les paiements mobiles (Moov Money et Airtel Money).

**Paramètres de l'API:**
- `phone` (string, requis) - Numéro du payeur
- `amount` (string, requis) - Montant en FCFA
- `payer_name` (string, requis) - Nom du payeur
- `reference` (string, requis) - Référence unique de la transaction
- `merchant_id` (string, requis) - Identifiant du marchand
- `callback_url` (string, requis) - URL de callback pour les notifications
- `operateur` (string|null, optionnel) - "moov_money" ou "airtel_money"
