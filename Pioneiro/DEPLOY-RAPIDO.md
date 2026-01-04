# 🚀 Deploy Rápido - 5 Minutos

## Opção Mais Simples: Netlify

### Passo 1: Preparar o Git
```bash
# No terminal, dentro da pasta do projeto
cd /Users/paulouchoa/Desktop/Pioneiro/Pioneiro

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Adiciona traduções e prepara para deploy"

# Fazer push
git push origin dev
```

### Passo 2: Deploy no Netlify

1. **Acesse:** https://netlify.com
2. **Login** com GitHub
3. Clique em **"Add new site"** → **"Import an existing project"**
4. Escolha **GitHub**
5. Selecione o repositório **"Pioneiro"**
6. Configurações:
   - Branch: `dev`
   - Build command: (deixe vazio)
   - Publish directory: `.` (apenas um ponto)
7. Clique em **"Deploy site"**

### ✅ Pronto!

Seu site estará online em 2-3 minutos em uma URL tipo:
`https://random-name-123.netlify.app`

### Customizar o domínio (Opcional)

1. No painel do Netlify, vá em **"Site settings"**
2. Clique em **"Change site name"**
3. Escolha algo como: `pioneiro-mondego`
4. Agora sua URL será: `https://pioneiro-mondego.netlify.app`

---

## 🎯 Alternativa: GitHub Pages

Se preferir usar GitHub Pages:

### Passo 1: Mesclar na branch main
```bash
git checkout main
git merge dev
git push origin main
```

### Passo 2: Ativar no GitHub
1. Acesse: https://github.com/Prouj/Pioneiro/settings/pages
2. Em **"Source"**, selecione: **"GitHub Actions"**
3. Aguarde o deploy (2-5 minutos)

### ✅ Pronto!
Acesse: `https://prouj.github.io/Pioneiro/`

---

## 📱 Testar antes do deploy

Para testar localmente primeiro:

```bash
# Com Python 3 (se já tiver instalado)
python3 -m http.server 8000

# OU com Node.js
npx serve .
```

Depois acesse: `http://localhost:8000`

---

## 🔥 Minha Recomendação: NETLIFY

**Porque?**
- ✅ Mais simples e rápido (5 minutos)
- ✅ Domínio customizado gratuito
- ✅ HTTPS automático
- ✅ Deploy automático a cada push
- ✅ Formulários funcionam nativamente (basta adicionar `data-netlify="true"`)

---

## 📞 Precisa de ajuda?

Veja o arquivo `DEPLOY.md` para instruções detalhadas!
