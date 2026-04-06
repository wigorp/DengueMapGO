const dados = [
  { setor: "Campinas", lat: -16.675, lng: -49.300, casos: 120 },
  { setor: "Bueno", lat: -16.700, lng: -49.270, casos: 95 },
  { setor: "Jardim América", lat: -16.720, lng: -49.290, casos: 60 },
  { setor: "Central", lat: -16.680, lng: -49.255, casos: 150 },
  { setor: "Pedro Ludovico", lat: -16.735, lng: -49.265, casos: 80 }
];

let map;
let heatmap;
let markers = [];

// FUNÇÃO PRINCIPAL (CHAMADA PELO GOOGLE)
function init() {

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: -16.68, lng: -49.25 }
  });

  atualizarDashboard();
  criarFiltro();
  criarMapa();
  gerarRanking();
}

// DASHBOARD
function atualizarDashboard() {
  let total = 0;
  let maior = dados[0];

  dados.forEach(d => {
    total += d.casos;
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
    let setor = select.value;
    let local = dados.find(d => d.setor === setor);

    if (local) {
      map.setCenter({ lat: local.lat, lng: local.lng });
      map.setZoom(14);
    }
  });
}

// MAPA + HEATMAP
function criarMapa() {

  let heatData = dados.map(d => ({
    location: new google.maps.LatLng(d.lat, d.lng),
    weight: d.casos
  }));

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatData
  });

  heatmap.setMap(map);

  dados.forEach(d => {
    let marker = new google.maps.Marker({
      position: { lat: d.lat, lng: d.lng },
      map,
      title: `${d.setor} - ${d.casos} casos`
    });

    markers.push(marker);
  });
}

// RANKING
function gerarRanking() {

  let ordenado = [...dados].sort((a, b) => b.casos - a.casos);

  let tbody = document.querySelector("#ranking tbody");
  tbody.innerHTML = "";

  ordenado.forEach((d, i) => {
    let row = `
      <tr>
        <td>${i + 1}</td>
        <td>${d.setor}</td>
        <td>${d.casos}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}