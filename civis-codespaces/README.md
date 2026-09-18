# CIVIS — Protótipo para GitHub Codespaces

Protótipo responsivo inspirado nas telas fornecidas.

## O que já está funcionando

- Tela inicial de login.
- Login demonstrativo: qualquer e-mail e senha válidos entram no sistema.
- Dashboard CIVIS para computador.
- Layout responsivo para celular.
- Endereços salvos: Casa, Trabalho e Outro.
- Tela de seleção de localização.
- Tela de adição de avisos.
- Navegação entre telas.
- Logout.
- Exclusão visual de endereço.
- `localStorage` para manter o estado de login.

## Rodar no GitHub Codespaces

Este projeto usa apenas HTML, CSS e JavaScript, então não precisa instalar Node.js.

No terminal do Codespaces:

```bash
python3 -m http.server 5500
```

Depois abra a porta **5500** no navegador do Codespaces.

## Estrutura

- `index.html` — entrada da aplicação
- `style.css` — todo o visual e responsividade
- `app.js` — navegação e comportamento

## Próximas etapas sugeridas

Para transformar o protótipo em um sistema real, pode-se adicionar:

1. Supabase para usuários e banco de dados.
2. Login real com autenticação.
3. Google Maps/OpenStreetMap para localização.
4. Cadastro persistente de avisos.
5. Upload de fotos nos avisos.
6. Painel administrativo separado.
7. API para clima e alertas.
