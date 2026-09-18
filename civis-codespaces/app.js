(function () {
  'use strict';

  const app = document.getElementById('app');
  const KEY = 'civisDataV2';
  const defaultData = {
    logged: false,
    user: null,
    screen: 'dashboard',
    addresses: [
      { id: 1, name: 'Casa', address: 'Rua Avelino Pereira de Oliveira, Nº 454' },
      { id: 2, name: 'Trabalho', address: 'Rua Jorge Mercador Nº 31' }
    ],
    notices: [
      { id: 1, type: 'Alagamento', address: 'Vila Velha', text: 'Alagamento registrado', status: 'Aberto', date: new Date().toLocaleDateString('pt-BR') }
    ]
  };

  function load() {
    try { return { ...defaultData, ...(JSON.parse(localStorage.getItem(KEY) || '{}')) }; }
    catch (_) { return { ...defaultData }; }
  }
  let state = load();
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }

  function brand() { return `<div class="brand"><img class="brand-logo" src="logo-civis.png" alt="CIVIS — Inteligência Urbana"><div class="brand-copy"><div class="brand-name">CIVIS</div><div class="brand-sub">INTELIGÊNCIA URBANA</div></div></div>`; }

  function login() {
    app.innerHTML = `<main class="login-page"><section class="login-card">${brand()}<h1>Entrar</h1><p>Acesse sua conta CIVIS</p>
      <form id="loginForm"><div class="field"><label>E-mail</label><input id="email" type="email" placeholder="seu@email.com" required></div>
      <div class="field"><label>Senha</label><input id="password" type="password" minlength="3" placeholder="••••••••" required></div>
      <button class="primary" type="submit">Entrar</button></form>
      <div class="login-links"><button type="button" data-action="recover">Recuperar Conta</button><button type="button" data-action="register">Cadastrar Usuário</button></div>
      <div class="demo-note">Modo demonstração: use qualquer e-mail e senha.</div></section></main>`;
    document.getElementById('loginForm').addEventListener('submit', e => {
      e.preventDefault(); state.logged = true; state.user = document.getElementById('email').value.trim(); save(); render();
    });
    document.querySelector('[data-action="recover"]').onclick = () => alert('Demonstração: informe seu e-mail para receber um link de recuperação.');
    document.querySelector('[data-action="register"]').onclick = () => alert('Demonstração: o cadastro será conectado a um banco de dados na próxima etapa.');
  }

  function shell() {
    app.innerHTML = `<div class="app-shell"><aside class="sidebar">${brand()}<nav class="nav">
      <button data-nav="dashboard">⌂ <span>Visão Geral</span></button><button data-nav="notices">◉ <span>Demandas</span></button>
      <button data-nav="location">⌖ <span>GeoAlert</span></button><button data-nav="addresses">▣ <span>Mapa / Endereços</span></button>
      <button data-nav="reports">▤ <span>Relatórios</span></button><button data-nav="users">♙ <span>Usuário</span></button>
      </nav><nav class="nav sidebar-bottom"><button class="logout" id="logoutBtn">↪ <span>Sair</span></button></nav></aside>
      <main class="main"><header class="topbar"><div class="page-title">CIVIS • Painel do Usuário</div><div class="user-mini"><span>${esc(state.user || 'Usuário')}</span><div class="avatar">${esc((state.user || 'U')[0].toUpperCase())}</div></div></header><section id="screen"></section></main></div>`;
    document.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => {
      state.screen = b.dataset.nav;
      save();
      document.querySelectorAll('[data-nav]').forEach(x => x.classList.toggle('active', x.dataset.nav === state.screen));
      renderScreen();
    });
    document.querySelectorAll('[data-nav]').forEach(x => x.classList.toggle('active', x.dataset.nav === state.screen));
    document.getElementById('logoutBtn').onclick = logout;
    renderScreen();
  }

  function dashboard() {
    const open = state.notices.filter(n => n.status === 'Aberto').length;
    return `<div class="content"><div class="greeting"><div><h1>Bom dia, ${esc((state.user || 'Usuário').split('@')[0])}</h1><p>Aqui está o panorama geral da cidade Vila Velha hoje.</p></div><small>Monitoramento CIVIS</small></div>
      <div class="alert"><div class="alert-icon">!</div><div><strong>ALERTA</strong><span>Consulte as demandas registradas e acompanhe os atendimentos.</span></div><button id="alertBtn">Ver demandas</button></div>
      <div class="metrics"><div class="metric"><div class="metric-top"><span>Demandas abertas</span><span>◉</span></div><div class="metric-value">${open}</div><div class="metric-note">Atualizado agora</div></div>
      <div class="metric"><div class="metric-top"><span>Endereços salvos</span><span>⌖</span></div><div class="metric-value">${state.addresses.length}</div><div class="metric-note">Seus locais</div></div>
      <div class="metric"><div class="metric-top"><span>Total de avisos</span><span>◷</span></div><div class="metric-value">${state.notices.length}</div><div class="metric-note">Registrados no dispositivo</div></div></div>
      <div class="dashboard-grid"><article class="card"><div class="card-head"><h2>Mapa de Vila Velha</h2><small>Áreas monitoradas</small></div><div class="fake-map"><div class="map-road r1"></div><div class="map-road r2"></div><div class="map-dot d1">${Math.max(open,1)}</div><div class="map-dot d2">3</div><div class="map-dot d3">5</div><div class="legend"><b>Legenda</b><br>🔴 Demandas abertas<br>🟠 Alertas<br>🔵 Monitoramento</div></div></article>
      <article class="card"><div class="card-head"><h2>Últimos avisos</h2><button class="small-btn" id="newNotice">+ Novo aviso</button></div><div class="simple-list">${state.notices.length ? state.notices.slice(-5).reverse().map(n => `<div class="list-row"><span><b>${esc(n.type)}</b><br><small>${esc(n.text)}</small></span><b>${esc(n.status)}</b></div>`).join('') : '<p>Nenhum aviso registrado.</p>'}</div></article></div></div>`;
    document.getElementById('alertBtn').onclick = () => { state.screen='notices'; save(); renderScreen(); };
    document.getElementById('newNotice').onclick = () => { state.screen='notices'; save(); renderScreen(); };
  }

  function addresses() {
    return `<div class="mobile-page"><header class="mobile-header"><button class="back" id="backDash">‹</button><h1>Endereços Salvos</h1><button class="small-btn" id="addAddress">+ Adicionar</button></header><div class="mobile-body"><div class="civis-big">CIVIS</div>
      <div id="addressList">${state.addresses.map(x => `<div class="address-card"><div class="address-top"><div class="address-icon">⌖</div><div><div class="address-name">${esc(x.name)}</div><div class="address-text">${esc(x.address)}</div></div></div><div class="address-actions"><button class="edit" data-edit="${x.id}">✎ Editar</button><button class="delete" data-delete="${x.id}">▮ Excluir</button></div></div>`).join('') || '<p>Nenhum endereço salvo.</p>'}</div></div>${bottom('addresses')}</div>`;
  }

  function addressForm(id) {
    const old = id ? state.addresses.find(a => a.id === id) : null;
    return `<div class="mobile-page"><header class="mobile-header"><button class="back" id="backAddresses">‹</button><h1>${old ? 'Editar endereço' : 'Novo endereço'}</h1></header><div class="mobile-body"><form id="addressForm"><div class="field"><label>Nome</label><input id="addressName" required maxlength="30" value="${esc(old?.name || '')}" placeholder="Casa, Trabalho..."/></div><div class="field"><label>Endereço</label><input id="addressText" required maxlength="150" value="${esc(old?.address || '')}" placeholder="Rua, número, bairro..."/></div><button class="mobile-primary" type="submit">${old ? 'Salvar alterações' : 'Salvar endereço'}</button></form></div></div>`;
  }

  function location() {
    return `<div class="mobile-page"><header class="mobile-header"><button class="back" id="backLocation">‹</button><h1>GeoAlert</h1></header><div class="location-map"><div class="pin"></div><div class="map-label">Vila Velha • localização demonstrativa</div></div><div class="location-sheet"><h2>Selecionar Localização</h2><div class="small-label">Endereço</div><input id="locAddress" class="address-input" placeholder="Digite um endereço"/><div class="save-label">Salvar como</div><div class="save-options"><button data-save="Casa">🏠 Casa</button><button data-save="Trabalho">▣ Trabalho</button><button data-save="Outro">● Outro</button></div></div>${bottom('location')}</div>`;
  }

  function notices() {
    return `<div class="mobile-page notice-page"><header class="mobile-header"><button class="back" id="backNotice">‹</button><h1>Demandas / Avisos</h1></header><div class="mobile-body"><form id="noticeForm"><div class="field"><label>Endereço (Opcional)</label><input id="noticeAddress" maxlength="150" placeholder="Digite ou selecione um endereço"></div><div class="field"><label>Tipo de aviso</label><select id="noticeType"><option value="">Selecionar tipo</option><option>Iluminação pública</option><option>Buraco na via</option><option>Alagamento</option><option>Segurança viária</option><option>Outro</option></select></div><div class="field"><label>Seu aviso</label><textarea id="noticeText" maxlength="200" required placeholder="Descreva o problema..."></textarea></div><button class="mobile-primary" type="submit">Enviar Aviso</button></form><div class="tips"><strong>💡 Dicas úteis</strong><ul><li>Seja claro e objetivo</li><li>Informe detalhes importantes</li><li>Você poderá acompanhar o aviso abaixo</li></ul></div><h2>Meus avisos</h2><div class="simple-list">${state.notices.slice().reverse().map(n => `<div class="list-row"><span><b>${esc(n.type)}</b><br>${esc(n.text)}<br><small>${esc(n.address || 'Sem endereço')} • ${esc(n.date)}</small></span><button class="delete" data-notice-delete="${n.id}">Excluir</button></div>`).join('')}</div></div>${bottom('notices')}</div>`;
  }

  function reports() { return `<div class="content"><div class="card section"><h2>Relatórios</h2><p>Resumo gerado com os dados salvos neste navegador.</p><div class="metrics"><div class="metric"><span>Total de avisos</span><div class="metric-value">${state.notices.length}</div></div><div class="metric"><span>Abertos</span><div class="metric-value">${state.notices.filter(n=>n.status==='Aberto').length}</div></div><div class="metric"><span>Endereços</span><div class="metric-value">${state.addresses.length}</div></div></div><button class="primary" id="exportBtn">Exportar dados</button></div></div>`; }
  function users() { return `<div class="content"><div class="card section"><h2>Meu usuário</h2><p><b>E-mail:</b> ${esc(state.user || 'Não informado')}</p><p>Esta é uma conta de demonstração local.</p><button class="primary" id="clearBtn">Limpar dados locais</button></div></div>`; }

  function bottom(active) { return `<nav class="bottom-nav"><button class="${active==='dashboard'?'active':''}" data-bottom="dashboard">🏠<span>Início</span></button><button class="${active==='addresses'?'active':''}" data-bottom="addresses">⌖<span>Endereços</span></button><button class="${active==='notices'?'active':''}" data-bottom="notices">＋<span>Avisos</span></button><button data-bottom="users">◉<span>Perfil</span></button></nav>`; }

  function renderScreen() {
    const screen = document.getElementById('screen'); if (!screen) return;
    if (state.screen==='addresses') screen.innerHTML=addresses();
    else if (state.screen==='addressForm') screen.innerHTML=addressForm(state.editId);
    else if (state.screen==='location') screen.innerHTML=location();
    else if (state.screen==='notices') screen.innerHTML=notices();
    else if (state.screen==='reports') screen.innerHTML=reports();
    else if (state.screen==='users') screen.innerHTML=users();
    else screen.innerHTML=dashboard();
    bindScreen();
  }

  function bindScreen() {
    document.querySelectorAll('[data-bottom]').forEach(b=>b.onclick=()=>{state.screen=b.dataset.bottom;save();renderScreen();});
    const backDash=document.getElementById('backDash'); if(backDash) backDash.onclick=()=>{state.screen='dashboard';renderScreen();};
    const backAddresses=document.getElementById('backAddresses'); if(backAddresses) backAddresses.onclick=()=>{state.screen='addresses';renderScreen();};
    const backLocation=document.getElementById('backLocation'); if(backLocation) backLocation.onclick=()=>{state.screen='dashboard';renderScreen();};
    const backNotice=document.getElementById('backNotice'); if(backNotice) backNotice.onclick=()=>{state.screen='dashboard';renderScreen();};
    const add=document.getElementById('addAddress'); if(add) add.onclick=()=>{state.screen='addressForm';state.editId=null;renderScreen();};
    document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{state.editId=Number(b.dataset.edit);state.screen='addressForm';renderScreen();});
    document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{if(confirm('Excluir este endereço?')){state.addresses=state.addresses.filter(a=>a.id!==Number(b.dataset.delete));save();renderScreen();}});
    const af=document.getElementById('addressForm'); if(af) af.onsubmit=e=>{e.preventDefault();const name=document.getElementById('addressName').value.trim(), address=document.getElementById('addressText').value.trim();if(!name||!address)return; if(state.editId){const a=state.addresses.find(x=>x.id===state.editId);a.name=name;a.address=address;}else state.addresses.push({id:Date.now(),name,address});state.screen='addresses';save();renderScreen();};
    document.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>{const address=document.getElementById('locAddress').value.trim();if(!address){alert('Digite um endereço primeiro.');return;}state.addresses.push({id:Date.now(),name:b.dataset.save,address});save();alert('Endereço salvo com sucesso.');state.screen='addresses';renderScreen();});
    const nf=document.getElementById('noticeForm'); if(nf) nf.onsubmit=e=>{e.preventDefault();const type=document.getElementById('noticeType').value||'Outro', text=document.getElementById('noticeText').value.trim(), address=document.getElementById('noticeAddress').value.trim();if(!text)return;state.notices.push({id:Date.now(),type,text,address,status:'Aberto',date:new Date().toLocaleDateString('pt-BR')});save();renderScreen();alert('Aviso enviado com sucesso!');};
    document.querySelectorAll('[data-notice-delete]').forEach(b=>b.onclick=()=>{state.notices=state.notices.filter(n=>n.id!==Number(b.dataset.noticeDelete));save();renderScreen();});
    const ex=document.getElementById('exportBtn'); if(ex) ex.onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}), url=URL.createObjectURL(blob), a=document.createElement('a');a.href=url;a.download='civis-dados.json';a.click();URL.revokeObjectURL(url);};
    const cl=document.getElementById('clearBtn'); if(cl) cl.onclick=()=>{if(confirm('Apagar todos os dados locais e sair?')){localStorage.removeItem(KEY);state={...defaultData};render();}};
  }
  function logout(){state.logged=false;save();render();}
  function render(){state.logged?shell():login();}
  render();
})();
