# Guia de Deploy - O Pioneiro do Mondego

Este guia contém instruções para fazer o deploy do site em diferentes plataformas de hospedagem gratuita.

---

## 📋 Índice
1. [GitHub Pages (Recomendado)](#github-pages)
2. [Netlify](#netlify)
3. [Vercel](#vercel)
4. [Configurações Necessárias](#configurações)

---

## 🚀 GitHub Pages (Recomendado)

### Passo 1: Preparar o Repositório
1. Faça commit de todas as mudanças:
   ```bash
   git add .
   git commit -m "Preparando site para deploy"
   git push origin dev
   ```

### Passo 2: Ativar GitHub Pages
1. Acesse seu repositório no GitHub: `https://github.com/Prouj/Pioneiro`
2. Vá em **Settings** > **Pages**
3. Em **Source**, selecione:
   - **Source**: GitHub Actions
4. O arquivo `.github/workflows/deploy.yml` já está configurado!

### Passo 3: Fazer Deploy
1. Faça push para a branch `main` (ou mude o arquivo deploy.yml para usar 'dev'):
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```

2. Aguarde alguns minutos e acesse:
   - **URL**: `https://prouj.github.io/Pioneiro/Home/home.html`

### ⚠️ Ajuste necessário nos caminhos
Como o site estará em um subdiretório, pode ser necessário ajustar os caminhos das imagens e links.

**Opção A - Criar arquivo na raiz:**
Crie um `index.html` na raiz que redireciona:
```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=Home/home.html">
</head>
<body>
    <p>Redirecionando...</p>
</body>
</html>
```

**Opção B - Ajustar caminhos:**
Mudar caminhos relativos de `../` para `/Pioneiro/` onde necessário.

---

## 🌐 Netlify

### Vantagens:
- ✅ Deploy automático do Git
- ✅ HTTPS gratuito
- ✅ Domínio customizado grátis: `seusite.netlify.app`
- ✅ Formulários funcionam sem backend

### Como fazer:
1. Acesse [netlify.com](https://netlify.com)
2. Clique em **"Add new site"** > **"Import an existing project"**
3. Conecte com GitHub e selecione o repositório `Pioneiro`
4. Configurações:
   - **Branch to deploy**: `dev` ou `main`
   - **Build command**: (deixe vazio)
   - **Publish directory**: `.` (ponto)
5. Clique em **Deploy site**

🎉 Seu site estará disponível em: `https://random-name-123.netlify.app`

### Domínio customizado:
- Vá em **Site settings** > **Domain management**
- Altere para um nome como: `pioneiro-mondego.netlify.app`

---

## ⚡ Vercel

### Vantagens:
- ✅ Deploy super rápido
- ✅ Preview automático de cada PR
- ✅ Analytics gratuito

### Como fazer:
1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New"** > **"Project"**
3. Conecte com GitHub e selecione `Pioneiro`
4. Configurações:
   - **Framework Preset**: Other
   - **Root Directory**: `.`
   - **Build Command**: (deixe vazio)
   - **Output Directory**: `.`
5. Clique em **Deploy**

🎉 Seu site estará disponível em: `https://pioneiro.vercel.app`

---

## 🔧 Configurações Necessárias

### 1. Criar index.html na raiz (Recomendado)

Crie um arquivo `index.html` na raiz do projeto que redireciona para a home:

```html
<!DOCTYPE html>
<html lang="pt-PT">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>O Pioneiro do Mondego - Redirecionando...</title>
    <meta http-equiv="refresh" content="0; url=Home/home.html">
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .loader {
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="loader">
        <h1>O Pioneiro do Mondego</h1>
        <p>Redirecionando...</p>
    </div>
    <script>
        window.location.href = 'Home/home.html';
    </script>
</body>
</html>
```

### 2. Verificar Formulários

Para os formulários funcionarem, você precisará:

**Opção A - Netlify Forms:**
Adicione `netlify` ao atributo do form:
```html
<form name="contact" method="POST" data-netlify="true">
```

**Opção B - Formspree:**
1. Crie conta em [formspree.io](https://formspree.io)
2. Substitua o action do form:
```html
<form action="https://formspree.io/f/SEU_ID" method="POST">
```

**Opção C - EmailJS (Já configurado?):**
Se já usa EmailJS, apenas verifique as credenciais.

### 3. Testar localmente antes do deploy

Instale um servidor local simples:
```bash
# Com Python 3
python3 -m http.server 8000

# Com Node.js
npx serve .

# Com PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000/Home/home.html`

---

## 📝 Checklist antes do Deploy

- [ ] Todas as imagens estão na pasta correta
- [ ] Caminhos relativos funcionam (testar localmente)
- [ ] Traduções carregam corretamente
- [ ] Links internos funcionam
- [ ] Formulário de contato configurado
- [ ] Formulário de reservas configurado
- [ ] Todos os arquivos commitados no Git

---

## 🐛 Problemas Comuns

### Imagens não aparecem
- Verifique se os caminhos são relativos: `../Images/...`
- Certifique-se que os nomes dos arquivos têm a capitalização correta

### CSS não carrega
- Verifique os caminhos nos `<link>` do HTML
- Use caminhos relativos, não absolutos

### Traduções não funcionam
- Verifique se os arquivos JSON estão na pasta `Strings/`
- Confirme que o script `i18n.js` está carregando

### Links quebrados
- Use caminhos relativos entre páginas
- Exemplo: `../Book/book.html` em vez de `/Book/book.html`

---

## 🎯 Recomendação Final

Para seu caso, recomendo usar **Netlify** porque:
1. É super simples
2. Os formulários funcionam nativamente
3. Você pode ter um domínio customizado gratuito
4. Deploy automático a cada push

**Tempo estimado de setup: 5 minutos!**

---

## 📞 Suporte

Se tiver problemas, consulte:
- [Documentação GitHub Pages](https://docs.github.com/pages)
- [Documentação Netlify](https://docs.netlify.com)
- [Documentação Vercel](https://vercel.com/docs)
