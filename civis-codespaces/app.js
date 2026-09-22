(function () {

  'use strict';

  const app = document.getElementById('app');

  const KEY = 'civisDataV3';

  const defaultData = {
    logged: false,

    user: null,

    screen: 'dashboard',

    addresses: [
      {
        id: 1,
        name: 'Casa',
        address: 'Rua Avelino Pereira de Oliveira, Nº 454'
      },
      {
        id: 2,
        name: 'Trabalho',
        address: 'Rua Jorge Mercador Nº 31'
      }
    ],

    notices: [
      {
        id: 1,
        type: 'Alagamento',
        address: 'Vila Velha',
        text: 'Alagamento registrado',
        status: 'Aberto',
        date: new Date().toLocaleDateString('pt-BR')
      }
    ]
  };


  function load() {

    try {

      const saved = JSON.parse(
        localStorage.getItem(KEY) || '{}'
      );

      return {
        ...defaultData,
        ...saved
      };

    } catch (error) {

      return {
        ...defaultData
      };

    }

  }


  let state = load();


  function save() {

    localStorage.setItem(
      KEY,
      JSON.stringify(state)
    );

  }


  function esc(value) {

    return String(value ?? '').replace(
      /[&<>"']/g,
      function (character) {

        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        }[character];

      }
    );

  }


  /* =====================================================
     MARCA
  ===================================================== */

  function brand() {

    return `
      <div class="brand">

        <img
          class="brand-logo"
          src="logo-civis.png"
          alt="CIVIS"
          onerror="this.style.display='none'"
        >

        <div class="brand-copy">

          <div class="brand-name">
            CIVIS
          </div>

          <div class="brand-sub">
            INTELIGÊNCIA URBANA
          </div>

        </div>

      </div>
    `;

  }


  /* =====================================================
     LOGIN
  ===================================================== */

  function login() {

    app.innerHTML = `

      <main class="login-page">

        <section class="login-card">

          ${brand()}

          <h1>Entrar</h1>

          <p>
            Acesse sua conta CIVIS
          </p>

          <form id="loginForm">

            <div class="field">

              <label>E-mail</label>

              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
              >

            </div>


            <div class="field">

              <label>Senha</label>

              <input
                id="password"
                type="password"
                minlength="3"
                placeholder="••••••••"
                required
              >

            </div>


            <button
              class="primary"
              type="submit"
            >
              Entrar
            </button>

          </form>


          <div class="login-links">

            <button id="recoverBtn">
              Recuperar conta
            </button>

            <button id="registerBtn">
              Cadastrar usuário
            </button>

          </div>


          <div class="demo-note">

            Modo demonstração:
            use qualquer e-mail e senha.

          </div>

        </section>

      </main>
    `;


    document
      .getElementById('loginForm')
      .addEventListener('submit', function (event) {

        event.preventDefault();

        state.logged = true;

        state.user =
          document
            .getElementById('email')
            .value
            .trim();

        state.screen = 'dashboard';

        save();

        render();

      });


    document
      .getElementById('recoverBtn')
      .onclick = function () {

        alert(
          'Demonstração: informe seu e-mail para receber um link de recuperação.'
        );

      };


    document
      .getElementById('registerBtn')
      .onclick = function () {

        alert(
          'Demonstração: o cadastro será conectado ao banco de dados posteriormente.'
        );

      };

  }


  /* =====================================================
     MENU DESKTOP
  ===================================================== */

  function shell() {

    app.innerHTML = `

      <div class="app-shell">


        <aside class="sidebar">

          ${brand()}


          <nav class="nav">

            <button data-nav="dashboard">
              🏠
              <span>Visão Geral</span>
            </button>


            <button data-nav="notices">
              🔔
              <span>Avisos</span>
            </button>


            <button data-nav="location">
              📍
              <span>GeoAlert</span>
            </button>


            <button data-nav="addresses">
              🏢
              <span>Endereços</span>
            </button>


            <button data-nav="emergency">
              🚨
              <span>Emergência</span>
            </button>


            <button data-nav="reports">
              📊
              <span>Relatórios</span>
            </button>


            <button data-nav="users">
              👤
              <span>Usuário</span>
            </button>


            <button data-nav="settings">
              ⚙️
              <span>Configurações</span>
            </button>

          </nav>


          <nav class="sidebar-bottom">

            <button
              class="logout"
              id="logoutBtn"
            >
              ↪
              <span>Sair</span>
            </button>

          </nav>

        </aside>


        <main class="main">


          <header class="topbar">

            <div class="page-title">
              CIVIS • Painel do Usuário
            </div>


            <div class="user-mini">

              <span>
                ${esc(state.user || 'Usuário')}
              </span>

              <div class="avatar">

                ${esc(
                  (state.user || 'U')[0]
                    .toUpperCase()
                )}

              </div>

            </div>

          </header>


          <section id="screen"></section>


        </main>


      </div>

    `;


    document
      .querySelectorAll('[data-nav]')
      .forEach(function (button) {

        button.onclick = function () {

          state.screen =
            button.dataset.nav;

          save();

          renderScreen();

        };

      });


    document
      .getElementById('logoutBtn')
      .onclick = logout;


    updateActiveMenu();

    renderScreen();

  }


  /* =====================================================
     MENU ATIVO
  ===================================================== */

  function updateActiveMenu() {

    document
      .querySelectorAll('[data-nav]')
      .forEach(function (button) {

        button.classList.toggle(
          'active',
          button.dataset.nav === state.screen
        );

      });

  }


  /* =====================================================
     DASHBOARD
  ===================================================== */

  function dashboard() {

    const open =
      state.notices.filter(function (notice) {

        return notice.status === 'Aberto';

      }).length;


    return `

      <div class="content">


        <div class="greeting">

          <div>

            <h1>
              Bom dia,
              ${esc(
                (state.user || 'Usuário')
                  .split('@')[0]
              )}
            </h1>

            <p>
              Aqui está o panorama geral da cidade Vila Velha hoje.
            </p>

          </div>


          <small>
            Monitoramento CIVIS
          </small>

        </div>


        <div class="alert">

          <div class="alert-icon">
            !
          </div>


          <div>

            <strong>
              ALERTA
            </strong>

            <span>
              Consulte as demandas registradas
              e acompanhe os atendimentos.
            </span>

          </div>


          <button id="alertBtn">
            Ver demandas
          </button>

        </div>


        <div class="metrics">


          <div class="metric">

            <div class="metric-top">

              <span>
                Demandas abertas
              </span>

              <span>
                🔴
              </span>

            </div>

            <div class="metric-value">
              ${open}
            </div>

            <div class="metric-note">
              Atualizado agora
            </div>

          </div>


          <div class="metric">

            <div class="metric-top">

              <span>
                Endereços salvos
              </span>

              <span>
                📍
              </span>

            </div>

            <div class="metric-value">
              ${state.addresses.length}
            </div>

            <div class="metric-note">
              Seus locais
            </div>

          </div>


          <div class="metric">

            <div class="metric-top">

              <span>
                Total de avisos
              </span>

              <span>
                🔔
              </span>

            </div>

            <div class="metric-value">
              ${state.notices.length}
            </div>

            <div class="metric-note">
              Registrados no dispositivo
            </div>

          </div>


        </div>


        <div class="dashboard-grid">


          <article class="card">


            <div class="card-head">

              <h2>
                Mapa de Vila Velha
              </h2>

              <small>
                Áreas monitoradas
              </small>

            </div>


            <div class="map-container">

              <img
                src="mapa-vila-velha.png"
                alt="Mapa de Vila Velha"
                class="map-image"
                onerror="this.style.display='none'; this.parentElement.classList.add('map-fallback')"
              >


              <div class="map-marker marker-one">
                ${Math.max(open, 1)}
              </div>

              <div class="map-marker marker-two">
                3
              </div>

              <div class="map-marker marker-three">
                5
              </div>


              <div class="map-legend">

                <strong>
                  Legenda
                </strong>

                <span>
                  🔴 Demandas abertas
                </span>

                <span>
                  🟠 Alertas
                </span>

                <span>
                  🔵 Monitoramento
                </span>

              </div>

            </div>

          </article>


          <article class="card">


            <div class="card-head">

              <h2>
                Últimos avisos
              </h2>

              <button
                class="small-btn"
                id="newNotice"
              >
                + Novo aviso
              </button>

            </div>


            <div class="simple-list">

              ${
                state.notices.length

                ?

                state.notices
                  .slice(-5)
                  .reverse()
                  .map(function (notice) {

                    return `

                      <div class="list-row">

                        <span>

                          <b>
                            ${esc(notice.type)}
                          </b>

                          <br>

                          <small>
                            ${esc(notice.text)}
                          </small>

                        </span>


                        <b class="status-open">
                          ${esc(notice.status)}
                        </b>

                      </div>

                    `;

                  })
                  .join('')

                :

                '<p>Nenhum aviso registrado.</p>'
              }

            </div>

          </article>


        </div>


        <div class="quick-actions">


          <button
            class="quick-card"
            data-quick="notices"
          >

            <span class="quick-icon red">
              🚨
            </span>

            <strong>
              SOS
            </strong>

            <small>
              Registrar emergência
            </small>

          </button>


          <button
            class="quick-card"
            data-quick="location"
          >

            <span class="quick-icon blue">
              📍
            </span>

            <strong>
              Procurar localização
            </strong>

            <small>
              Encontrar e salvar local
            </small>

          </button>


          <button
            class="quick-card"
            data-quick="addresses"
          >

            <span class="quick-icon teal">
              🏠
            </span>

            <strong>
              Endereços salvos
            </strong>

            <small>
              Ver seus locais
            </small>

          </button>


          <button
            class="quick-card"
            data-quick="emergency"
          >

            <span class="quick-icon orange">
              🚑
            </span>

            <strong>
              Emergência
            </strong>

            <small>
              Contatos importantes
            </small>

          </button>


        </div>


      </div>

    `;

  }


  /* =====================================================
     ENDEREÇOS
  ===================================================== */

  function addresses() {

    return `

      <div class="mobile-page">


        <header class="mobile-header">

          <button
            class="back"
            id="backAddresses"
          >
            ‹
          </button>

          <h1>
            Endereços Salvos
          </h1>

          <button
            class="small-btn"
            id="addAddress"
          >
            + Adicionar
          </button>

        </header>


        <div class="mobile-body">


          <div class="civis-big">
            CIVIS
          </div>


          <p class="screen-description">
            Gerencie os locais que você utiliza com frequência.
          </p>


          <div id="addressList">


            ${
              state.addresses.length

              ?

              state.addresses
                .map(function (item) {

                  return `

                    <div class="address-card">


                      <div class="address-top">


                        <div class="address-icon">
                          📍
                        </div>


                        <div>

                          <div class="address-name">
                            ${esc(item.name)}
                          </div>

                          <div class="address-text">
                            ${esc(item.address)}
                          </div>

                        </div>


                      </div>


                      <div class="address-actions">

                        <button
                          class="edit"
                          data-edit="${item.id}"
                        >
                          ✎ Editar
                        </button>

                        <button
                          class="delete"
                          data-delete="${item.id}"
                        >
                          Excluir
                        </button>

                      </div>


                    </div>

                  `;

                })
                .join('')

              :

              '<p>Nenhum endereço salvo.</p>'
            }


          </div>


        </div>


        ${bottom('addresses')}

      </div>

    `;

  }


  /* =====================================================
     FORMULÁRIO ENDEREÇO
  ===================================================== */

  function addressForm(id) {

    const old =
      id
        ? state.addresses.find(
            function (address) {
              return address.id === id;
            }
          )
        : null;


    return `

      <div class="mobile-page">


        <header class="mobile-header">

          <button
            class="back"
            id="backAddressForm"
          >
            ‹
          </button>

          <h1>
            ${
              old
                ? 'Editar endereço'
                : 'Novo endereço'
            }
          </h1>

        </header>


        <div class="mobile-body">


          <div class="form-icon">
            📍
          </div>


          <h2 class="form-title">
            ${
              old
                ? 'Editar localização'
                : 'Adicionar localização'
            }
          </h2>


          <p class="screen-description">
            Salve um endereço para acessá-lo rapidamente.
          </p>


          <form id="addressForm">


            <div class="field">

              <label>
                Nome do local
              </label>

              <input
                id="addressName"
                required
                maxlength="30"
                value="${esc(old?.name || '')}"
                placeholder="Casa, Trabalho..."
              >

            </div>


            <div class="field">

              <label>
                Endereço
              </label>

              <input
                id="addressText"
                required
                maxlength="150"
                value="${esc(old?.address || '')}"
                placeholder="Rua, número, bairro..."
              >

            </div>


            <button
              class="mobile-primary"
              type="submit"
            >

              ${
                old
                  ? 'Salvar alterações'
                  : 'Salvar endereço'
              }

            </button>


          </form>


        </div>


        ${bottom('addresses')}

      </div>

    `;

  }


  /* =====================================================
     GEOALERT
  ===================================================== */

  function location() {

    return `

      <div class="mobile-page geo-page">


        <header class="mobile-header">

          <button
            class="back"
            id="backLocation"
          >
            ‹
          </button>

          <h1>
            GeoAlert
          </h1>

        </header>


        <div class="geo-map">


          <img
            src="mapa-vila-velha.png"
            alt="Mapa"
            class="geo-map-image"
            onerror="this.style.display='none'; this.parentElement.classList.add('map-fallback')"
          >


          <div class="geo-pin">
            📍
          </div>


          <div class="geo-map-label">
            Vila Velha • localização demonstrativa
          </div>


        </div>


        <div class="location-sheet">


          <h2>
            Procurar Localização
          </h2>


          <div class="small-label">
            Endereço
          </div>


          <input
            id="locAddress"
            class="address-input"
            placeholder="Digite um endereço"
          >


          <button
            class="location-search"
            id="searchLocation"
          >
            🔎 Procurar localização
          </button>


          <div
            id="locationResult"
            class="location-result"
          >
          </div>


          <div class="save-label">
            Salvar como
          </div>


          <div class="save-options">


            <button data-save="Casa">
              🏠 Casa
            </button>


            <button data-save="Trabalho">
              💼 Trabalho
            </button>


            <button data-save="Outro">
              📍 Outro
            </button>


          </div>


        </div>


        ${bottom('location')}

      </div>

    `;

  }


  /* =====================================================
     AVISOS
  ===================================================== */

  function notices() {

    return `

      <div class="mobile-page notice-page">


        <header class="mobile-header">

          <button
            class="back"
            id="backNotice"
          >
            ‹
          </button>

          <h1>
            Avisos
          </h1>

        </header>


        <div class="mobile-body">


          <div class="notice-title">

            <div class="notice-symbol">
              🔔
            </div>

            <div>

              <h2>
                Novo aviso
              </h2>

              <p>
                Informe um problema encontrado na cidade.
              </p>

            </div>

          </div>


          <form id="noticeForm">


            <div class="field">

              <label>
                Endereço
              </label>

              <input
                id="noticeAddress"
                maxlength="150"
                placeholder="Digite ou selecione um endereço"
              >

            </div>


            <div class="field">

              <label>
                Tipo de aviso
              </label>

              <select id="noticeType">

                <option value="">
                  Selecionar tipo
                </option>

                <option>
                  Iluminação pública
                </option>

                <option>
                  Buraco na via
                </option>

                <option>
                  Alagamento
                </option>

                <option>
                  Segurança viária
                </option>

                <option>
                  Outro
                </option>

              </select>

            </div>


            <div class="field">

              <label>
                Seu aviso
              </label>

              <textarea
                id="noticeText"
                maxlength="200"
                required
                placeholder="Descreva o problema..."
              ></textarea>

            </div>


            <button
              class="mobile-primary"
              type="submit"
            >
              Enviar Aviso
            </button>


          </form>


          <div class="tips">

            <strong>
              💡 Dicas úteis
            </strong>

            <ul>

              <li>
                Seja claro e objetivo
              </li>

              <li>
                Informe detalhes importantes
              </li>

              <li>
                Você poderá acompanhar o aviso
              </li>

            </ul>

          </div>


          <h2 class="section-title">
            Meus avisos
          </h2>


          <div class="simple-list">


            ${
              state.notices
                .slice()
                .reverse()
                .map(function (notice) {

                  return `

                    <div class="notice-item">

                      <div>

                        <b>
                          ${esc(notice.type)}
                        </b>

                        <p>
                          ${esc(notice.text)}
                        </p>

                        <small>
                          ${esc(notice.address || 'Sem endereço')}
                          •
                          ${esc(notice.date)}
                        </small>

                      </div>


                      <button
                        class="delete"
                        data-notice-delete="${notice.id}"
                      >
                        Excluir
                      </button>

                    </div>

                  `;

                })
                .join('')

            }


          </div>


        </div>


        ${bottom('notices')}

      </div>

    `;

  }


  /* =====================================================
     RELATÓRIOS
  ===================================================== */

  function reports() {

    const total =
      state.notices.length;

    const open =
      state.notices.filter(
        function (item) {
          return item.status === 'Aberto';
        }
      ).length;

    const closed =
      total - open;


    return `

      <div class="content">


        <div class="page-heading">

          <div>

            <h1>
              Relatórios
            </h1>

            <p>
              Resumo dos dados registrados no CIVIS.
            </p>

          </div>

        </div>


        <div class="report-grid">


          <div class="report-card">

            <span>
              Total de avisos
            </span>

            <strong>
              ${total}
            </strong>

            <small>
              Registros realizados
            </small>

          </div>


          <div class="report-card">

            <span>
              Avisos abertos
            </span>

            <strong>
              ${open}
            </strong>

            <small>
              Aguardando atendimento
            </small>

          </div>


          <div class="report-card">

            <span>
              Atendidos
            </span>

            <strong>
              ${closed}
            </strong>

            <small>
              Avisos encerrados
            </small>

          </div>


          <div class="report-card">

            <span>
              Endereços salvos
            </span>

            <strong>
              ${state.addresses.length}
            </strong>

            <small>
              Seus locais
            </small>

          </div>


        </div>


        <div class="card report-table-card">

          <div class="card-head">

            <h2>
              Histórico de avisos
            </h2>

          </div>


          <div class="report-table">


            ${
              state.notices.length

              ?

              state.notices
                .slice()
                .reverse()
                .map(function (notice) {

                  return `

                    <div class="report-row">

                      <div>

                        <strong>
                          ${esc(notice.type)}
                        </strong>

                        <small>
                          ${esc(notice.address || 'Sem endereço')}
                        </small>

                      </div>

                      <span>
                        ${esc(notice.status)}
                      </span>

                    </div>

                  `;

                })
                .join('')

              :

              '<p>Nenhum registro encontrado.</p>'
            }


          </div>


        </div>


        <button
          class="primary export-button"
          id="exportBtn"
        >
          ⬇ Exportar dados
        </button>


      </div>

    `;

  }


  /* =====================================================
     USUÁRIO
  ===================================================== */

  function users() {

    const initial =
      (state.user || 'U')[0]
        .toUpperCase();


    return `

      <div class="content">


        <div class="page-heading">

          <div>

            <h1>
              Meu usuário
            </h1>

            <p>
              Gerencie suas informações no CIVIS.
            </p>

          </div>

        </div>


        <div class="profile-card">


          <div class="profile-avatar">
            ${esc(initial)}
          </div>


          <h2>
            ${esc(state.user || 'Usuário')}
          </h2>


          <p>
            Conta de demonstração
          </p>


          <div class="profile-info">

            <div>

              <span>
                E-mail
              </span>

              <strong>
                ${esc(state.user || 'Não informado')}
              </strong>

            </div>


            <div>

              <span>
                Endereços
              </span>

              <strong>
                ${state.addresses.length}
              </strong>

            </div>


            <div>

              <span>
                Avisos
              </span>

              <strong>
                ${state.notices.length}
              </strong>

            </div>

          </div>


          <button
            class="danger-button"
            id="clearBtn"
          >
            Limpar dados locais
          </button>


        </div>


      </div>

    `;

  }


  /* =====================================================
     EMERGÊNCIA
  ===================================================== */

  function emergency() {

    return `

      <div class="content">


        <div class="page-heading">

          <div>

            <h1>
              Emergência
            </h1>

            <p>
              Acesso rápido aos contatos de emergência.
            </p>

          </div>

        </div>


        <div class="emergency-grid">


          <button
            class="emergency-card"
            data-emergency="190"
          >

            <div class="emergency-icon">
              🚓
            </div>

            <strong>
              Polícia
            </strong>

            <span>
              190
            </span>

          </button>


          <button
            class="emergency-card"
            data-emergency="192"
          >

            <div class="emergency-icon">
              🚑
            </div>

            <strong>
              SAMU
            </strong>

            <span>
              192
            </span>

          </button>


          <button
            class="emergency-card"
            data-emergency="193"
          >

            <div class="emergency-icon">
              🚒
            </div>

            <strong>
              Bombeiros
            </strong>

            <span>
              193
            </span>

          </button>


          <button
            class="emergency-card"
            data-emergency="199"
          >

            <div class="emergency-icon">
              🛟
            </div>

            <strong>
              Defesa Civil
            </strong>

            <span>
              199
            </span>

          </button>


        </div>


        <div class="sos-box">

          <strong>
            🚨 SOS CIVIS
          </strong>

          <p>
            Use esta opção para registrar rapidamente
            uma situação que precisa de atenção.
          </p>

          <button
            class="sos-button"
            id="sosBtn"
          >
            REGISTRAR SOS
          </button>

        </div>


      </div>

    `;

  }


  /* =====================================================
     CONFIGURAÇÕES
  ===================================================== */

  function settings() {

    return `

      <div class="content">


        <div class="page-heading">

          <div>

            <h1>
              Configurações
            </h1>

            <p>
              Preferências do aplicativo CIVIS.
            </p>

          </div>

        </div>


        <div class="settings-card">


          <button class="setting-row">

            <span>
              🔔
              Notificações
            </span>

            <span>
              ›
            </span>

          </button>


          <button class="setting-row">

            <span>
              📍
              Localização
            </span>

            <span>
              ›
            </span>

          </button>


          <button class="setting-row">

            <span>
              🔐
              Privacidade
            </span>

            <span>
              ›
            </span>

          </button>


          <button class="setting-row">

            <span>
              ℹ️
              Sobre o CIVIS
            </span>

            <span>
              ›
            </span>

          </button>


        </div>


      </div>

    `;

  }


  /* =====================================================
     BOTTOM NAV MOBILE
  ===================================================== */

  function bottom(active) {

    return `

      <nav class="bottom-nav">


        <button
          class="${active === 'dashboard' ? 'active' : ''}"
          data-bottom="dashboard"
        >

          <span>
            🏠
          </span>

          <small>
            Início
          </small>

        </button>


        <button
          class="${active === 'addresses' ? 'active' : ''}"
          data-bottom="addresses"
        >

          <span>
            📍
          </span>

          <small>
            Locais
          </small>

        </button>


        <button
          class="${active === 'notices' ? 'active' : ''}"
          data-bottom="notices"
        >

          <span>
            ＋
          </span>

          <small>
            Avisos
          </small>

        </button>


        <button
          class="${active === 'emergency' ? 'active' : ''}"
          data-bottom="emergency"
        >

          <span>
            🚨
          </span>

          <small>
            SOS
          </small>

        </button>


        <button
          class="${active === 'users' ? 'active' : ''}"
          data-bottom="users"
        >

          <span>
            👤
          </span>

          <small>
            Perfil
          </small>

        </button>


      </nav>

    `;

  }


  /* =====================================================
     RENDER
  ===================================================== */

  function renderScreen() {

    const screen =
      document.getElementById('screen');

    if (!screen) {
      return;
    }


    if (state.screen === 'dashboard') {

      screen.innerHTML =
        dashboard();

    }

    else if (state.screen === 'addresses') {

      screen.innerHTML =
        addresses();

    }

    else if (state.screen === 'addressForm') {

      screen.innerHTML =
        addressForm(state.editId);

    }

    else if (state.screen === 'location') {

      screen.innerHTML =
        location();

    }

    else if (state.screen === 'notices') {

      screen.innerHTML =
        notices();

    }

    else if (state.screen === 'reports') {

      screen.innerHTML =
        reports();

    }

    else if (state.screen === 'users') {

      screen.innerHTML =
        users();

    }

    else if (state.screen === 'emergency') {

      screen.innerHTML =
        emergency();

    }

    else if (state.screen === 'settings') {

      screen.innerHTML =
        settings();

    }

    else {

      state.screen = 'dashboard';

      screen.innerHTML =
        dashboard();

    }


    bindScreen();

    updateActiveMenu();

  }


  /* =====================================================
     EVENTOS
  ===================================================== */

  function bindScreen() {


    document
      .querySelectorAll('[data-bottom]')
      .forEach(function (button) {

        button.onclick = function () {

          state.screen =
            button.dataset.bottom;

          save();

          renderScreen();

        };

      });


    const alertBtn =
      document.getElementById('alertBtn');

    if (alertBtn) {

      alertBtn.onclick = function () {

        state.screen = 'notices';

        save();

        renderScreen();

      };

    }


    const newNotice =
      document.getElementById('newNotice');

    if (newNotice) {

      newNotice.onclick = function () {

        state.screen = 'notices';

        save();

        renderScreen();

      };

    }


    document
      .querySelectorAll('[data-quick]')
      .forEach(function (button) {

        button.onclick = function () {

          state.screen =
            button.dataset.quick;

          save();

          renderScreen();

        };

      });


    const backAddresses =
      document.getElementById('backAddresses');

    if (backAddresses) {

      backAddresses.onclick = function () {

        state.screen = 'dashboard';

        renderScreen();

      };

    }


    const backAddressForm =
      document.getElementById('backAddressForm');

    if (backAddressForm) {

      backAddressForm.onclick = function () {

        state.screen = 'addresses';

        renderScreen();

      };

    }


    const backLocation =
      document.getElementById('backLocation');

    if (backLocation) {

      backLocation.onclick = function () {

        state.screen = 'dashboard';

        renderScreen();

      };

    }


    const backNotice =
      document.getElementById('backNotice');

    if (backNotice) {

      backNotice.onclick = function () {

        state.screen = 'dashboard';

        renderScreen();

      };

    }


    const addAddress =
      document.getElementById('addAddress');

    if (addAddress) {

      addAddress.onclick = function () {

        state.editId = null;

        state.screen = 'addressForm';

        renderScreen();

      };

    }


    document
      .querySelectorAll('[data-edit]')
      .forEach(function (button) {

        button.onclick = function () {

          state.editId =
            Number(button.dataset.edit);

          state.screen =
            'addressForm';

          renderScreen();

        };

      });


    document
      .querySelectorAll('[data-delete]')
      .forEach(function (button) {

        button.onclick = function () {

          if (
            confirm(
              'Excluir este endereço?'
            )
          ) {

            state.addresses =
              state.addresses.filter(
                function (address) {

                  return address.id !==
                    Number(button.dataset.delete);

                }
              );

            save();

            renderScreen();

          }

        };

      });


    const addressFormElement =
      document.getElementById('addressForm');


    if (addressFormElement) {

      addressFormElement.onsubmit =
        function (event) {

          event.preventDefault();


          const name =
            document
              .getElementById('addressName')
              .value
              .trim();


          const address =
            document
              .getElementById('addressText')
              .value
              .trim();


          if (!name || !address) {
            return;
          }


          if (state.editId) {

            const item =
              state.addresses.find(
                function (addressItem) {

                  return addressItem.id ===
                    state.editId;

                }
              );


            if (item) {

              item.name = name;

              item.address = address;

            }

          }

          else {

            state.addresses.push({

              id: Date.now(),

              name: name,

              address: address

            });

          }


          state.screen = 'addresses';

          save();

          renderScreen();

        };

    }


    /* =================================================
       GEOALERT
    ================================================= */

    const searchLocation =
      document.getElementById('searchLocation');


    if (searchLocation) {

      searchLocation.onclick =
        function () {

          const address =
            document
              .getElementById('locAddress')
              .value
              .trim();


          const result =
            document.getElementById(
              'locationResult'
            );


          if (!address) {

            result.innerHTML =
              '<span class="result-error">Digite um endereço para procurar.</span>';

            return;

          }


          result.innerHTML = `

            <strong>
              📍 Localização encontrada
            </strong>

            <span>
              ${esc(address)}
            </span>

            <small>
              Localização demonstrativa do CIVIS.
            </small>

          `;

        };

    }


    document
      .querySelectorAll('[data-save]')
      .forEach(function (button) {

        button.onclick = function () {

          const input =
            document.getElementById(
              'locAddress'
            );


          const address =
            input.value.trim();


          if (!address) {

            alert(
              'Digite um endereço primeiro.'
            );

            return;

          }


          state.addresses.push({

            id: Date.now(),

            name:
              button.dataset.save,

            address:
              address

          });


          save();


          alert(
            'Endereço salvo com sucesso!'
          );


          state.screen =
            'addresses';

          renderScreen();

        };

      });


    /* =================================================
       AVISOS
    ================================================= */

    const noticeForm =
      document.getElementById(
        'noticeForm'
      );


    if (noticeForm) {

      noticeForm.onsubmit =
        function (event) {

          event.preventDefault();


          const type =
            document
              .getElementById('noticeType')
              .value ||
            'Outro';


          const text =
            document
              .getElementById('noticeText')
              .value
              .trim();


          const address =
            document
              .getElementById('noticeAddress')
              .value
              .trim();


          if (!text) {

            alert(
              'Descreva o problema.'
            );

            return;

          }


          state.notices.push({

            id: Date.now(),

            type: type,

            text: text,

            address: address,

            status: 'Aberto',

            date:
              new Date()
                .toLocaleDateString(
                  'pt-BR'
                )

          });


          save();


          alert(
            'Aviso enviado com sucesso!'
          );


          renderScreen();

        };

    }


    document
      .querySelectorAll(
        '[data-notice-delete]'
      )
      .forEach(function (button) {

        button.onclick =
          function () {

            state.notices =
              state.notices.filter(
                function (notice) {

                  return notice.id !==
                    Number(
                      button.dataset
                        .noticeDelete
                    );

                }
              );


            save();

            renderScreen();

          };

      });


    /* =================================================
       EXPORTAR
    ================================================= */

    const exportBtn =
      document.getElementById(
        'exportBtn'
      );


    if (exportBtn) {

      exportBtn.onclick =
        function () {

          const blob =
            new Blob(
              [
                JSON.stringify(
                  state,
                  null,
                  2
                )
              ],
              {
                type:
                  'application/json'
              }
            );


          const url =
            URL.createObjectURL(
              blob
            );


          const link =
            document.createElement(
              'a'
            );


          link.href = url;

          link.download =
            'civis-dados.json';

          link.click();


          URL.revokeObjectURL(
            url
          );

        };

    }


    /* =================================================
       LIMPAR DADOS
    ================================================= */

    const clearBtn =
      document.getElementById(
        'clearBtn'
      );


    if (clearBtn) {

      clearBtn.onclick =
        function () {

          if (
            confirm(
              'Apagar todos os dados locais?'
            )
          ) {

            localStorage.removeItem(
              KEY
            );

            state =
              load();

            state.logged = false;

            state.user = null;

            state.screen =
              'dashboard';

            render();

          }

        };

    }


    /* =================================================
       EMERGÊNCIA
    ================================================= */

    document
      .querySelectorAll(
        '[data-emergency]'
      )
      .forEach(function (button) {

        button.onclick =
          function () {

            const number =
              button.dataset.emergency;


            if (
              confirm(
                'Deseja iniciar uma chamada para ' +
                number +
                '?'
              )
            ) {

              window.location.href =
                'tel:' + number;

            }

          };

      });


    const sosBtn =
      document.getElementById(
        'sosBtn'
      );


    if (sosBtn) {

      sosBtn.onclick =
        function () {

          state.notices.push({

            id: Date.now(),

            type: 'SOS',

            address:
              'Localização atual',

            text:
              'Solicitação de emergência registrada pelo usuário.',

            status: 'Aberto',

            date:
              new Date()
                .toLocaleDateString(
                  'pt-BR'
                )

          });


          save();


          alert(
            'SOS registrado no CIVIS.'
          );


          state.screen =
            'notices';

          renderScreen();

        };

    }

  }


  /* =====================================================
     LOGOUT
  ===================================================== */

  function logout() {

    state.logged = false;

    state.user = null;

    state.screen = 'dashboard';

    save();

    render();

  }


  /* =====================================================
     RENDER PRINCIPAL
  ===================================================== */

  function render() {

    if (state.logged) {

      shell();

    }

    else {

      login();

    }

  }


  render();


})();