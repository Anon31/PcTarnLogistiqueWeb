#!/bin/bash

# Configuration des variables pour discuter avec le Vault local
export VAULT_ADDR="http://127.0.0.1:8200"
export VAULT_TOKEN="mon-token-root"

echo "⏳ Initialisation de Vault en mode Dev..."

# 1. Création des secrets
vault kv put secret/pctarn/staging/backend POSTGRES_PASSWORD="PasswordStaging123" DATABASE_URL="postgresql://admin:PasswordStaging123@db-staging:5432/pc_stock_db?schema=public" JWT_SECRET="Cle_Secrete_Staging_Logistique" > /dev/null
vault kv put secret/pctarn/production/backend POSTGRES_PASSWORD="VraiMotDePasseProd" DATABASE_URL="postgresql://admin:VraiMotDePasseProd@db-prod:5432/pc_stock_db?schema=public" JWT_SECRET="Vraie_Cle_Secrete_De_Production_Tres_Longue!" > /dev/null

# 2. Injection des Policies
vault policy write pctarn-staging-policy policy-staging.hcl > /dev/null
vault policy write pctarn-production-policy policy-production.hcl > /dev/null

# 3. Activation de l'AppRole (ignore l'erreur s'il est déjà activé)
vault auth enable approle 2>/dev/null || true

# 4. Création des rôles
vault write auth/approle/role/pctarn-staging-role secret_id_ttl=0 token_num_uses=0 token_ttl=1h token_max_ttl=4h policies="pctarn-staging-policy" > /dev/null
vault write auth/approle/role/pctarn-production-role secret_id_ttl=0 token_num_uses=0 token_ttl=1h token_max_ttl=4h policies="pctarn-production-policy" > /dev/null

echo "✅ Vault est initialisé !"
echo "-----------------------------------"
echo "🔐 IDENTIFIANTS POUR LE STAGING : "
vault read auth/approle/role/pctarn-staging-role/role-id
vault write -f auth/approle/role/pctarn-staging-role/secret-id
echo "-----------------------------------"