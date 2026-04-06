const dados = [
  { setor: "Central", lat: -16.680, lng: -49.255, casos: 150 },
  { setor: "Campinas", lat: -16.675, lng: -49.300, casos: 120 },
  { setor: "Bueno", lat: -16.700, lng: -49.270, casos: 95 },
  { setor: "Pedro Ludovico", lat: -16.735, lng: -49.265, casos: 80 },
  { setor: "Jardim América", lat: -16.720, lng: -49.290, casos: 60 }
];

let map;

// INICIAR
document.addEventListener("DOMContentLoaded", () => {
  atualizarDashboard();
  criarFiltro();
  gerarRanking();
  criarGrafico();
});

// MAPA
function init() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: -16.68, lng: -49.25 }
  });

  dados.forEach(d => {
    new google.maps.Marker({
      position: { lat: d.lat, lng: d.lng },
      map,
      title: `${d.setor} - ${d.casos} casos`
    });
  });
}

// DASHBOARD
function atualizarDashboard() {
  let total = dados.reduce((soma, d) => soma + d.casos, 0);
  let maior = dados[0];

  dados.forEach(d => {
    if (d.casos > maior.casos) maior = d;
  });

  document.getElementById("total").innerText = total;
  document.getElementById("critico").innerText = maior.setor;
  document.getElementById("vacina").innerText = maior.setor;
}

// FILTRO
function criarFiltro() {
  const select = document.getElementById("filtro");

  dados.forEach(d => {
    let opt = document.createElement("option");
    opt.value = d.setor;
    opt.innerText = d.setor;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    let local = dados.find(d => d.setor === select.value);
    if (local && map) {
      map.setCenter({ lat: local.lat, lng: local.lng });
      map.setZoom(14);
    }
  });
}

// RANKING
function gerarRanking() {
  let tbody = document.querySelector("#ranking tbody");
  tbody.innerHTML = "";

  dados.forEach((d, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${d.setor}</td>
        <td>${d.casos}</td>
      </tr>
    `;
  });
}

// GRÁFICO
function criarGrafico() {
  const ctx = document.getElementById("grafico");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: dados.map(d => d.setor),
      datasets: [{
        label: "Casos de Dengue",
        data: dados.map(d => d.casos)
      }]
    }
  });
}
