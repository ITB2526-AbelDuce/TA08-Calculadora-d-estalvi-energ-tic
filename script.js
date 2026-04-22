// DADES GLOBALS
let consumptionData = {
    electricity: [],
    water: [],
    officeSupplies: [],
    cleaningProducts: []
};

// ✅ DADES DEL ITB (JSON + FACTURES NETEJA)
const itbData = {
    electricity: {
        base_monthly: 419.79,
        solar_generation: 1419.86,
        autoconsum_percentage: 94.2,
        co2_saved: 0.69
    },
    water: {
        annual_total: 110,
        monthly_average: 9.17,
        per_capita: 0.1,
        cost_annual: 597.54,
        price_per_m3: 5.43
    },
    officeSupplies: {
        paper_a4_monthly: 10,
        toner_monthly: 2,
        providers: ['Lyreco', 'Amazon']
    },
    cleaningProducts: {
        monthly_cost: 996,
        products_cost: 620,
        services_cost: 376,
        annual_cost: 11952,
        per_capita_monthly: 10.87,
        currency: '€'
    }
};

const seasonalFactors = {
    electricity: [1.15, 1.10, 0.95, 0.85, 0.75, 0.85, 0.95, 1.05, 0.95, 0.90, 1.00, 1.20],
    water: [0.95, 0.90, 0.95, 1.05, 1.10, 1.20, 1.30, 1.25, 1.10, 1.00, 0.95, 0.95],
    officeSupplies: [0.80, 0.75, 0.85, 0.90, 0.85, 0.60, 0.20, 0.15, 1.50, 1.40, 0.90, 0.85],
    cleaningProducts: [1.05, 1.00, 1.05, 1.10, 1.10, 1.00, 0.90, 0.95, 1.20, 1.15, 1.05, 1.00]
};

const yearGrowthFactors = {
    2026: 1.00,
    2027: 0.95,
    2028: 0.90
};

// ESTRATÈGIES
const strategies = {
    electricity: [
        { id: 'elec-led', name: '🔦 LED Lighting', reduction: 0.10, description: 'Canviar a LED totes les bombetes', fullDescription: '<h3>LED Lighting</h3><p>Substituir bombetes incandescents per LED genera estalvi del 75-80%. Els LED consumeixen 80% menys energia i duren 25 vegades més.</p>' },
        { id: 'elec-sensors', name: '🚨 Sensors Moviment', reduction: 0.08, description: 'Instal·lar sensors de moviment', fullDescription: '<h3>Sensors de Moviment</h3><p>Instal·lació de sensors PIR als passadissos i espais comuns. Els llums s\'apaguen automàticament quan no hi ha activitat.</p>' },
        { id: 'elec-ac', name: '❄️ Manteniment AC', reduction: 0.07, description: 'Fer manteniment mensual', fullDescription: '<h3>Manteniment AC</h3><p>Programa de manteniment preventiu de sistemes de climatització per millorar eficiència energètica.</p>' },
        { id: 'elec-solar', name: '☀️ Optimitzar Panells', reduction: 0.12, description: 'Optimitzar panells solars existents', fullDescription: '<h3>Optimitzar Panells Solars</h3><p>Millorar manutenció i posicionament dels panells existents per augmentar generació fins al 100% de necessitats.</p>' }
    ],
    water: [
        { id: 'water-sensors', name: '🚰 Grifos Sensor', reduction: 0.12, description: 'Instal·lar grifos amb sensor', fullDescription: '<h3>Grifos Sensor</h3><p>Grifos automàtics que detecten la presència i limiten el cabal d\'aigua. Estalvi 30-40%.</p>' },
        { id: 'water-repairs', name: '🔧 Reparació Fuites', reduction: 0.05, description: 'Revisar i reparar fuites', fullDescription: '<h3>Reparació de Fuites</h3><p>Detecció i reparació setmanal de fuites. Una fuga pot gastar fins a 900 litres per any.</p>' },
        { id: 'water-toilets', name: '🚽 Inodors Doble Flux', reduction: 0.09, description: 'Instal·lar inodors de doble flux', fullDescription: '<h3>Inodors Doble Flux</h3><p>Doble descàrrega (4.5L per necessitats menors, 9L per majors). Estalvi d\'aigua del 50%.</p>' },
        { id: 'water-rain', name: '🌧️ Recollida Pluja', reduction: 0.15, description: 'Crear sistema de recollida pluja', fullDescription: '<h3>Recollida d\'Aigua de Pluja</h3><p>Sistema de cisternes per reutilitzar l\'aigua de pluja en regadius i neteja. Estalvi fins al 50%.</p>' }
    ],
    officeSupplies: [
        { id: 'supplies-paperless', name: '📱 Paperless', reduction: 0.20, description: 'Implementar política paperless', fullDescription: '<h3>Política Paperless</h3><p>Transició a documentació digital. Estalvi del 60% en consumibles.</p>' },
        { id: 'supplies-doubleside', name: '📄 Doble Cara', reduction: 0.15, description: 'Imprimir en doble cara per defecte', fullDescription: '<h3>Impressió a Doble Cara</h3><p>Configurar les impressores per imprimir per ambdós costats per defecte. Estalvi del 50% de paper.</p>' },
        { id: 'supplies-recycled', name: '♻️ Paper Reciclat', reduction: 0.10, description: 'Usar paper reciclat', fullDescription: '<h3>Paper 100% Reciclat</h3><p>Usar paper reciclat certificat. 30% més econòmic i més sostenible.</p>' },
        { id: 'supplies-toner', name: '🖨️ Tòners Reutilitzables', reduction: 0.20, description: 'Crear biblioteca tòners', fullDescription: '<h3>Tòners Reutilitzables</h3><p>Crear biblioteca de tòners reutilitzables. Estalvi econòmic de més del 70%.</p>' }
    ],
    cleaningProducts: [
        { id: 'cleaning-eco', name: '🌿 Productes Ecològics', reduction: 0.15, description: 'Cambiar a productes ecológicos', fullDescription: '<h3>Productes Ecològics Concentrats</h3><p>100% biodegradables. Menys residus químics i més sostenibilitat ambiental. Estalvi 15%.</p>' },
        { id: 'cleaning-microfiber', name: '🧵 Microfiber Cloths', reduction: 0.20, description: 'Usar microfiber cloths', fullDescription: '<h3>Roba de Microfibra</h3><p>Els teixits de microfibra duren més de 500 usos. Estalvi del 20% en productes de neteja.</p>' },
        { id: 'cleaning-natural', name: '🍋 Solucions Naturals', reduction: 0.25, description: 'Preparar soluciones naturals', fullDescription: '<h3>Netejadors Naturals</h3><p>Preparacions naturals amb vinagre i aigua. Estalvi del 25% en productes químics.</p>' },
        { id: 'cleaning-protocol', name: '⏱️ Protocol Eficient', reduction: 0.12, description: 'Implementar protocolos', fullDescription: '<h3>Protocol de Neteja Eficient</h3><p>Optimització de temps i quantitat de producte. Formació del personal en dosificació correcta. Estalvi 10%.</p>' }
    ]
};

const prices = {
    electricity: 0.20,
    water: itbData.water.price_per_m3,
    officeSupplies: 7.50,
    cleaningProducts: 1
};

let monthlyStrategies = {
    2026: { electricity: {}, water: {}, officeSupplies: {}, cleaningProducts: {} },
    2027: { electricity: {}, water: {}, officeSupplies: {}, cleaningProducts: {} },
    2028: { electricity: {}, water: {}, officeSupplies: {}, cleaningProducts: {} }
};

const months = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

// INICIALITZACIÓ
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    document.getElementById('consumptionDate').valueAsDate = new Date();
    updateDataDisplay();
    updateForecast();
    loadMonthlyStrategies();
    generateActionPlan();
});

// TABS
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    if (tabName === 'forecast') setTimeout(() => { updatePlanningDisplay(); updateForecast(); }, 100);
    if (tabName === 'actionplan') setTimeout(() => generateActionPlan(), 100);
}

// ESTRATÈGIES
function updateStrategiesSelect() {
    const consumptionType = document.getElementById('consumptionType').value;
    const strategiesContainer = document.getElementById('strategiesContainer');
    const appliedStrategySelect = document.getElementById('appliedStrategy');
    if (!consumptionType) {
        strategiesContainer.style.display = 'none';
        return;
    }
    strategiesContainer.style.display = 'block';
    appliedStrategySelect.innerHTML = '<option value="">-- Cap estratègia --</option>';
    const typeStrategies = strategies[consumptionType] || [];
    typeStrategies.forEach(strategy => {
        const option = document.createElement('option');
        option.value = strategy.id;
        option.textContent = strategy.name;
        appliedStrategySelect.appendChild(option);
    });
    appliedStrategySelect.value = '';
    displayStrategyInfo();
}

function displayStrategyInfo() {
    const consumptionType = document.getElementById('consumptionType').value;
    const selectedId = document.getElementById('appliedStrategy').value;
    const strategyInfo = document.getElementById('strategyInfo');
    if (!consumptionType || !selectedId) {
        strategyInfo.innerHTML = '<p style="color: #999;">Selecciona una estratègia per veure els detalls</p>';
        return;
    }
    const typeStrategies = strategies[consumptionType] || [];
    const strategy = typeStrategies.find(s => s.id === selectedId);
    if (!strategy || !strategy.description) {
        strategyInfo.innerHTML = '';
        return;
    }
    strategyInfo.innerHTML = `<h4>${strategy.name}</h4><p>${strategy.description}</p><div class="reduction-percent">Reducció esperada: ${(strategy.reduction * 100).toFixed(0)}%</div><button class="btn btn-secondary" onclick="showStrategyModal('${consumptionType}', '${strategy.id}')">Més informació</button>`;
}

function showStrategyModal(type, strategyId) {
    const strategy = strategies[type]?.find(s => s.id === strategyId);
    if (!strategy) return;
    document.getElementById('strategyModalTitle').textContent = strategy.name;
    document.getElementById('strategyModalBody').innerHTML = strategy.fullDescription;
    document.getElementById('strategyModal').style.display = 'block';
}

function closeStrategyModal() {
    document.getElementById('strategyModal').style.display = 'none';
}

// DADES
function addConsumption() {
    const type = document.getElementById('consumptionType').value;
    const value = parseFloat(document.getElementById('consumptionValue').value);
    const date = document.getElementById('consumptionDate').value;
    const strategy = document.getElementById('appliedStrategy').value || '';
    if (!type || !value || value <= 0) {
        alert('Si us plau, completa els camps correctament');
        return;
    }
    consumptionData[type].push({ date, consumption: value, strategy: strategy });
    saveToLocalStorage();
    updateDataDisplay();
    generateActionPlan();
    document.getElementById('consumptionValue').value = '';
    alert('✅ Dada afegida correctament!');
}

function deleteConsumption(type, index) {
    consumptionData[type].splice(index, 1);
    saveToLocalStorage();
    updateDataDisplay();
    generateActionPlan();
}

function clearAllData() {
    if (confirm('Estàs segur?')) {
        consumptionData = { electricity: [], water: [], officeSupplies: [], cleaningProducts: [] };
        saveToLocalStorage();
        updateDataDisplay();
        generateActionPlan();
        alert('✅ Dades eliminades');
    }
}

function updateDataDisplay() {
    updateTable('electricity', 'electricityTableBody', 'kWh');
    updateTable('water', 'waterTableBody', 'm³');
    updateTable('officeSupplies', 'suppliesTableBody', 'kg');
    updateTable('cleaningProducts', 'cleaningTableBody', '€');
}

function updateTable(type, tableId, unit) {
    const table = document.querySelector(`#${tableId}`);
    table.innerHTML = '';
    if (consumptionData[type].length === 0) {
        table.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999;">Cap dada registrada</td></tr>';
        return;
    }
    consumptionData[type].forEach((item, index) => {
        const row = document.createElement('tr');
        let strategyDisplay = '-';
        if (item.strategy) {
            const strategyObj = strategies[type]?.find(s => s.id === item.strategy);
            if (strategyObj) {
                strategyDisplay = `<a href="#" onclick="showStrategyModal('${type}', '${item.strategy}'); return false;" style="color: #667eea; text-decoration: none; cursor: pointer;">${strategyObj.name}</a>`;
            }
        }
        row.innerHTML = `<td>${formatDate(item.date)}</td><td>${item.consumption} ${unit}</td><td>${strategyDisplay}</td><td><button class="btn-delete" onclick="deleteConsumption('${type}', ${index})">❌</button></td>`;
        table.appendChild(row);
    });
}

// PLA MENSUAL
function updatePlanningDisplay() {
    const year = document.getElementById('planningYear').value;
    generatePlanningCard('electricity', year);
    generatePlanningCard('water', year);
    generatePlanningCard('officeSupplies', year);
    generatePlanningCard('cleaningProducts', year);
    updatePlanningSummary(year);
}

function generatePlanningCard(type, year) {
    const idMap = {
        'electricity': 'electricityPlanning',
        'water': 'waterPlanning',
        'officeSupplies': 'suppliesPlanning',
        'cleaningProducts': 'cleaningPlanning'
    };

    const container = document.getElementById(idMap[type]);
    const typeStrategies = strategies[type] || [];
    let html = '';

    months.forEach((month, index) => {
        const monthKey = index + 1;
        const currentStrategy = monthlyStrategies[year][type][monthKey] || '';
        const strategyObj = typeStrategies.find(s => s.id === currentStrategy);
        const reduction = strategyObj ? strategyObj.reduction : 0;

        let optionsHtml = '<option value="">-- Cap --</option>';
        typeStrategies.forEach(strategy => {
            const selected = currentStrategy === strategy.id ? 'selected' : '';
            optionsHtml += `<option value="${strategy.id}" ${selected}>${strategy.name}</option>`;
        });

        html += `
            <div class="month-row">
                <label>${month}</label>
                <select onchange="setMonthlyStrategy('${type}', ${monthKey}, '${year}', this.value)">
                    ${optionsHtml}
                </select>
                <div class="reduction-info">${(reduction * 100).toFixed(0)}%</div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function setMonthlyStrategy(type, month, year, strategyId) {
    if (!monthlyStrategies[year]) {
        monthlyStrategies[year] = { electricity: {}, water: {}, officeSupplies: {}, cleaningProducts: {} };
    }
    monthlyStrategies[year][type][month] = strategyId;
    saveMonthlyStrategies();
    updatePlanningSummary(year);
}

function updatePlanningSummary(year) {
    const summary = document.getElementById('planningSummary');
    let html = '';
    const types = ['electricity', 'water', 'officeSupplies', 'cleaningProducts'];
    const icons = { electricity: '⚡', water: '💧', officeSupplies: '📎', cleaningProducts: '🧹' };
    const names = { electricity: 'Electricitat', water: 'Aigua', officeSupplies: 'Consumibles', cleaningProducts: 'Neteja' };

    types.forEach(type => {
        const typeStrategies = strategies[type] || [];
        let totalReduction = 0;
        let strategiesCount = 0;

        months.forEach((month, index) => {
            const monthKey = index + 1;
            const strategyId = monthlyStrategies[year][type][monthKey];
            if (strategyId) {
                const strategy = typeStrategies.find(s => s.id === strategyId);
                if (strategy) {
                    totalReduction += strategy.reduction;
                    strategiesCount++;
                }
            }
        });

        const avgReduction = strategiesCount > 0 ? totalReduction / strategiesCount : 0;
        html += `<div class="summary-item"><strong>${icons[type]} ${names[type]}</strong>Estratègies: ${strategiesCount}/12<div class="value">${(avgReduction * 100).toFixed(1)}%</div></div>`;
    });

    summary.innerHTML = html;
}

function savePlanningAndUpdateForecast() {
    saveMonthlyStrategies();
    const year = document.getElementById('planningYear').value;
    recalculateGrowthFactors(year);
    updateForecast();
    showResult('✅ Pla guardat', 'Les teves estratègies s\'han desat i les prediccions s\'han actualitzat correctament!');
}

function recalculateGrowthFactors(year) {
    const types = ['electricity', 'water', 'officeSupplies', 'cleaningProducts'];
    let totalReductionPercentage = 0;

    types.forEach(type => {
        const typeStrategies = strategies[type] || [];
        let totalReduction = 0;
        let strategiesCount = 0;

        months.forEach((month, index) => {
            const monthKey = index + 1;
            const strategyId = monthlyStrategies[year][type][monthKey];
            if (strategyId) {
                const strategy = typeStrategies.find(s => s.id === strategyId);
                if (strategy) {
                    totalReduction += strategy.reduction;
                    strategiesCount++;
                }
            }
        });

        const avgReduction = strategiesCount > 0 ? totalReduction / strategiesCount : 0;
        totalReductionPercentage += avgReduction;
    });

    const avgReduction = totalReductionPercentage / types.length;
    yearGrowthFactors[year] = 1 - avgReduction;
}

function saveMonthlyStrategies() {
    localStorage.setItem('monthlyStrategies', JSON.stringify(monthlyStrategies));
}

function loadMonthlyStrategies() {
    const saved = localStorage.getItem('monthlyStrategies');
    if (saved) {
        monthlyStrategies = JSON.parse(saved);
    }
}

// PREDICCIÓ
function getYearForecastDescription(year) {
    const descriptions = {
        2026: '📊 Predicció 2026 (Any base - sense canvis)',
        2027: '📊 Predicció 2027 (Amb implementació inicial -5%)',
        2028: '📊 Predicció 2028 (Amb estratègies consolidades -10%)'
    };
    return descriptions[year] || descriptions[2026];
}

function getMonthlyStrategyReduction(type, monthIndex, year) {
    const monthKey = monthIndex + 1;
    const strategyId = monthlyStrategies[year] && monthlyStrategies[year][type] ? monthlyStrategies[year][type][monthKey] : '';
    if (!strategyId) return 0;
    const strategy = strategies[type]?.find(s => s.id === strategyId);
    return strategy ? strategy.reduction : 0;
}

function updateForecast() {
    const year = document.getElementById('forecastYear').value;
    document.getElementById('forecastInfo').innerHTML = getYearForecastDescription(year);
    generateElectricityForecast(year);
    generateWaterForecast(year);
    generateSuppliesForecast(year);
    generateCleaningForecast(year);
}

function generateElectricityForecast(year) {
    const baseConsumption = itbData.electricity.base_monthly;
    const growthFactor = yearGrowthFactors[year] || 1.00;
    const months_labels = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

    const data = seasonalFactors.electricity.map((factor, index) => {
        const monthlyReduction = getMonthlyStrategyReduction('electricity', index, year);
        const baseValue = baseConsumption * factor * growthFactor;
        const reducedValue = baseValue * (1 - monthlyReduction);
        return Math.round(reducedValue * 100) / 100;
    });

    const avgConsumption = Math.round(data.reduce((a, b) => a + b) / data.length * 100) / 100;
    document.getElementById('elecAvg').textContent = avgConsumption;

    const ctx = document.getElementById('electricityChart').getContext('2d');
    if (window.electricityChartInstance) window.electricityChartInstance.destroy();

    window.electricityChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months_labels,
            datasets: [{
                label: `Consum (kWh) - ${year}`,
                data: data,
                borderColor: '#f093fb',
                backgroundColor: 'rgba(240, 147, 251, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: '#f093fb',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: false, ticks: { callback: function(value) { return value + ' kWh'; } } } }
        }
    });
}

function generateWaterForecast(year) {
    const baseConsumption = itbData.water.monthly_average;
    const growthFactor = yearGrowthFactors[year] || 1.00;
    const months_labels = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

    const data = seasonalFactors.water.map((factor, index) => {
        const monthlyReduction = getMonthlyStrategyReduction('water', index, year);
        const baseValue = baseConsumption * factor * growthFactor;
        const reducedValue = baseValue * (1 - monthlyReduction);
        return Math.round(reducedValue * 100) / 100;
    });

    const avgConsumption = Math.round(data.reduce((a, b) => a + b) / data.length * 100) / 100;
    document.getElementById('waterAvg').textContent = avgConsumption;

    const ctx = document.getElementById('waterChart').getContext('2d');
    if (window.waterChartInstance) window.waterChartInstance.destroy();

    window.waterChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months_labels,
            datasets: [{
                label: `Consum (m³) - ${year}`,
                data: data,
                borderColor: '#4facfe',
                backgroundColor: 'rgba(79, 172, 254, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: '#4facfe',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: false, ticks: { callback: function(value) { return value + ' m³'; } } } }
        }
    });
}

function generateSuppliesForecast(year) {
    const baseConsumption = itbData.officeSupplies.paper_a4_monthly;
    const growthFactor = yearGrowthFactors[year] || 1.00;
    const months_labels = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

    const data = seasonalFactors.officeSupplies.map((factor, index) => {
        const monthlyReduction = getMonthlyStrategyReduction('officeSupplies', index, year);
        const baseValue = baseConsumption * factor * growthFactor;
        const reducedValue = baseValue * (1 - monthlyReduction);
        return Math.round(reducedValue * 10) / 10;
    });

    const avgConsumption = Math.round(data.reduce((a, b) => a + b) / data.length * 10) / 10;
    document.getElementById('suppliesAvg').textContent = avgConsumption;

    const ctx = document.getElementById('suppliesChart').getContext('2d');
    if (window.suppliesChartInstance) window.suppliesChartInstance.destroy();

    window.suppliesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months_labels,
            datasets: [{
                label: `Consum (paquets) - ${year}`,
                data: data,
                backgroundColor: ['#fa709a', '#fa709a', '#fa709a', '#fa709a', '#fa709a', '#fee140', '#fee140', '#fee140', '#fa709a', '#fa709a', '#fa709a', '#fa709a'],
                borderColor: '#fa709a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true, ticks: { callback: function(value) { return value + ' paq'; } } } }
        }
    });
}

function generateCleaningForecast(year) {
    const baseConsumption = itbData.cleaningProducts.monthly_cost;
    const growthFactor = yearGrowthFactors[year] || 1.00;
    const months_labels = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

    const data = seasonalFactors.cleaningProducts.map((factor, index) => {
        const monthlyReduction = getMonthlyStrategyReduction('cleaningProducts', index, year);
        const baseValue = baseConsumption * factor * growthFactor;
        const reducedValue = baseValue * (1 - monthlyReduction);
        return Math.round(reducedValue * 100) / 100;
    });

    const avgConsumption = Math.round(data.reduce((a, b) => a + b) / data.length * 100) / 100;
    document.getElementById('cleaningAvg').textContent = avgConsumption;

    const ctx = document.getElementById('cleaningChart').getContext('2d');
    if (window.cleaningChartInstance) window.cleaningChartInstance.destroy();

    window.cleaningChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months_labels,
            datasets: [{
                label: `Cost (€) - ${year}`,
                data: data,
                borderColor: '#30cfd0',
                backgroundColor: 'rgba(48, 207, 208, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5,
                pointBackgroundColor: '#30cfd0',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: false, ticks: { callback: function(value) { return value + '€'; } } } }
        }
    });
}

// PLA 3 ANYS
function generateActionPlan() {
    const container = document.getElementById('actionPlanContent');

    if (!hasConsumptionData()) {
        container.innerHTML = `<div class="no-data-message">
            <p>❌ No hi ha dades registrades.</p>
            <p>Registra dades de consum al tab "Calculadora" per veure el pla d'accions.</p>
        </div>`;
        return;
    }

    let html = '';
    const types = ['electricity', 'water', 'officeSupplies', 'cleaningProducts'];
    const icons = { electricity: '⚡', water: '💧', officeSupplies: '📎', cleaningProducts: '🧹' };
    const names = { electricity: 'Electricitat', water: 'Aigua', officeSupplies: 'Consumibles', cleaningProducts: 'Neteja' };
    const units = { electricity: 'kWh', water: 'm³', officeSupplies: 'kg', cleaningProducts: '€' };

    html += `<div class="actionplan-summary-box">
        <h3>📊 Consum Actual (Mitjana Registrada)</h3>
        <div class="actionplan-grid">`;

    types.forEach(type => {
        const data = consumptionData[type];
        if (data.length > 0) {
            const avg = data.reduce((a, b) => a + b.consumption, 0) / data.length;
            const target = avg * 0.70;
            const saving = avg - target;

            html += `
                <div class="actionplan-card">
                    <div class="actionplan-card-header">
                        <h4>${icons[type]} ${names[type]}</h4>
                    </div>
                    <div class="actionplan-card-body">
                        <div class="actionplan-metric">
                            <span class="label">Actual:</span>
                            <span class="value">${avg.toFixed(2)} ${units[type]}</span>
                        </div>
                        <div class="actionplan-metric">
                            <span class="label">Objectiu (30% ↓):</span>
                            <span class="value target">${target.toFixed(2)} ${units[type]}</span>
                        </div>
                        <div class="actionplan-metric">
                            <span class="label">Estalvi necessari:</span>
                            <span class="value saving">${saving.toFixed(2)} ${units[type]}</span>
                        </div>
                        <div class="actionplan-metric">
                            <span class="label">Estalvi anual:</span>
                            <span class="value savings-money">${(saving * 12 * prices[type]).toFixed(2)}€</span>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    html += `</div></div>`;

    html += `<div class="actionplan-timeline">
        <h3>📅 Timeline d'Implementació (3 Anys)</h3>
        <div class="timeline">`;

    const years = [
        {
            year: 2026,
            title: 'ANY 1: Planificació i Primeres Accions',
            reduction: 0.10,
            actions: [
                '🔦 Canviar a LED (10% estalvi electricitat)',
                '🚰 Instal·lar grifos sensor (12% estalvi aigua)',
                '📱 Iniciar política paperless (20% estalvi consumibles)',
                '🌿 Productos ecológicos de neteja (15% estalvi)'
            ]
        },
        {
            year: 2027,
            title: 'ANY 2: Expansió de Mesures',
            reduction: 0.20,
            actions: [
                '🚨 Instal·lar sensors de moviment (8% estalvi electricitat)',
                '🚽 Instal·lar inodors doble flux (9% estalvi aigua)',
                '📄 Imprimir doble cara per defecte (15% estalvi consumibles)',
                '🧵 Microfiber cloths per neteja (20% estalvi)'
            ]
        },
        {
            year: 2028,
            title: 'ANY 3: Consolidació i Objectius Finals',
            reduction: 0.30,
            actions: [
                '☀️ Optimitzar panells solars (12% estalvi electricitat)',
                '🌧️ Sistema recollida aigua de pluja (15% estalvi aigua)',
                '🖨️ Biblioteca tòners reutilitzables (20% estalvi consumibles)',
                '🍋 Solucions naturals de neteja consolidat (25% estalvi)'
            ]
        }
    ];

    years.forEach((yearPlan, index) => {
        html += `
            <div class="timeline-item">
                <div class="timeline-marker">
                    <span class="timeline-year">${yearPlan.year}</span>
                    <span class="timeline-reduction">${(yearPlan.reduction * 100).toFixed(0)}% ↓</span>
                </div>
                <div class="timeline-content">
                    <h4>${yearPlan.title}</h4>
                    <ul class="actions-list">
                        ${yearPlan.actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });

    html += `</div></div>`;

    html += `<div class="actionplan-savings-box">
        <h3>💰 Estimació d'Estalvi Total a 3 Anys</h3>
        <div class="savings-grid">`;

    let totalSavingsYear1 = 0, totalSavingsYear2 = 0, totalSavingsYear3 = 0;

    types.forEach(type => {
        const data = consumptionData[type];
        if (data.length > 0) {
            const avg = data.reduce((a, b) => a + b.consumption, 0) / data.length;
            const price = prices[type];

            const year1 = (avg * 0.10) * 12 * price;
            const year2 = (avg * 0.20) * 12 * price;
            const year3 = (avg * 0.30) * 12 * price;

            totalSavingsYear1 += year1;
            totalSavingsYear2 += year2;
            totalSavingsYear3 += year3;

            html += `
                <div class="savings-card">
                    <h4>${icons[type]} ${names[type]}</h4>
                    <div class="savings-item">
                        <span class="year-label">2026:</span>
                        <span class="savings-amount">${year1.toFixed(2)}€</span>
                    </div>
                    <div class="savings-item">
                        <span class="year-label">2027:</span>
                        <span class="savings-amount">${year2.toFixed(2)}€</span>
                    </div>
                    <div class="savings-item">
                        <span class="year-label">2028:</span>
                        <span class="savings-amount">${year3.toFixed(2)}€</span>
                    </div>
                    <div class="savings-item total">
                        <span class="year-label"><strong>TOTAL:</strong></span>
                        <span class="savings-amount"><strong>${(year1 + year2 + year3).toFixed(2)}€</strong></span>
                    </div>
                </div>
            `;
        }
    });

    html += `
        </div>
        <div class="total-savings-summary">
            <h3>🎉 Estalvi Total Acumulat a 3 Anys</h3>
            <div class="big-number">${(totalSavingsYear1 + totalSavingsYear2 + totalSavingsYear3).toFixed(2)}€</div>
            <p>Invertint en aquestes estratègies, estalviaràs aquest import en 3 anys.</p>
        </div>
    </div>`;

    container.innerHTML = html;
}

function hasConsumptionData() {
    return consumptionData.electricity.length > 0 ||
           consumptionData.water.length > 0 ||
           consumptionData.officeSupplies.length > 0 ||
           consumptionData.cleaningProducts.length > 0;
}

// CÀLCULS
function calculateElectricityYear() {
    const data = consumptionData.electricity;
    if (data.length === 0) { showResult('⚡ Electricitat', 'No hi ha dades'); return; }
    const avg = data.reduce((a, b) => a + b.consumption, 0) / data.length;
    const reduction = getAverageReduction('electricity', data);
    const avgOptimized = avg * (1 - reduction);
    const cost = avg * 12 * prices.electricity;
    const costOptimized = avgOptimized * 12 * prices.electricity;
    const savings = cost - costOptimized;
    let strategiesUsed = '';
    data.forEach(item => {
        if (item.strategy) {
            const strategy = strategies.electricity.find(s => s.id === item.strategy);
            if (strategy) strategiesUsed += `<li>${strategy.name} (${(strategy.reduction*100).toFixed(0)}%)</li>`;
        }
    });
    showResult('⚡ Electricitat - Any', `<div class="result-item"><strong>Promig actual:</strong> ${avg.toFixed(2)} kWh/mes</div><div class="result-item"><strong>Promig optimitzat:</strong> ${avgOptimized.toFixed(2)} kWh/mes</div><div class="result-item"><strong>Reducció mitjana:</strong> ${(reduction*100).toFixed(1)}%</div><div class="result-item"><strong>Cost anual actual:</strong> ${cost.toFixed(2)}€</div><div class="result-item"><strong>Cost anual optimitzat:</strong> ${costOptimized.toFixed(2)}€</div><div class="result-item"><strong>💰 Estalvi anual:</strong> ${savings.toFixed(2)}€</div>${strategiesUsed ? `<div class="result-item"><strong>Estratègies aplicades:</strong><ul>${strategiesUsed}</ul></div>` : ''}`);
}

function calculateElectricitySchoolYear() {
    const schoolMonths = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
    const filtered = consumptionData.electricity.filter(d => schoolMonths.includes(new Date(d.date).getMonth() + 1));
    if (filtered.length === 0) { showResult('⚡ Electricitat', 'No hi ha dades'); return; }
    const total = filtered.reduce((a, b) => a + b.consumption, 0);
    const reduction = getAverageReduction('electricity', filtered);
    const totalOptimized = total * (1 - reduction);
    const cost = total * prices.electricity;
    const costOptimized = totalOptimized * prices.electricity;
    showResult('⚡ Electricitat Set-Juny', `<div class="result-item"><strong>Total actual:</strong> ${total.toFixed(2)} kWh</div><div class="result-item"><strong>Total optimitzat:</strong> ${totalOptimized.toFixed(2)} kWh</div><div class="result-item"><strong>Reducció:</strong> ${(reduction*100).toFixed(1)}%</div><div class="result-item"><strong>Cost actual:</strong> ${cost.toFixed(2)}€</div><div class="result-item"><strong>Cost optimitzat:</strong> ${costOptimized.toFixed(2)}€</div><div class="result-item"><strong>💰 Estalvi:</strong> ${(cost - costOptimized).toFixed(2)}€</div>`);
}

function calculateWaterYear() {
    const data = consumptionData.water;
    if (data.length === 0) { showResult('💧 Aigua', 'No hi ha dades'); return; }
    const avg = data.reduce((a, b) => a + b.consumption, 0) / data.length;
    const reduction = getAverageReduction('water', data);
    const avgOptimized = avg * (1 - reduction);
    const cost = avg * 12 * prices.water;
    const costOptimized = avgOptimized * 12 * prices.water;
    const savings = cost - costOptimized;
    let strategiesUsed = '';
    data.forEach(item => {
        if (item.strategy) {
            const strategy = strategies.water.find(s => s.id === item.strategy);
            if (strategy) strategiesUsed += `<li>${strategy.name} (${(strategy.reduction*100).toFixed(0)}%)</li>`;
        }
    });
    showResult('💧 Aigua - Any', `<div class="result-item"><strong>Promig actual:</strong> ${avg.toFixed(2)} m³/mes</div><div class="result-item"><strong>Promig optimitzat:</strong> ${avgOptimized.toFixed(2)} m³/mes</div><div class="result-item"><strong>Reducció mitjana:</strong> ${(reduction*100).toFixed(1)}%</div><div class="result-item"><strong>Cost anual actual:</strong> ${cost.toFixed(2)}€</div><div class="result-item"><strong>Cost anual optimitzat:</strong> ${costOptimized.toFixed(2)}€</div><div class="result-item"><strong>💰 Estalvi anual:</strong> ${savings.toFixed(2)}€</div>${strategiesUsed ? `<div class="result-item"><strong>Estratègies aplicades:</strong><ul>${strategiesUsed}</ul></div>` : ''}`);
}

function calculateWaterSchoolYear() {
    const schoolMonths = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
    const filtered = consumptionData.water.filter(d => schoolMonths.includes(new Date(d.date).getMonth() + 1));
    if (filtered.length === 0) { showResult('💧 Aigua', 'No hi ha dades'); return; }
    const total = filtered.reduce((a, b) => a + b.consumption, 0);
    const reduction = getAverageReduction('water', filtered);
    const totalOptimized = total * (1 - reduction);
    const cost = total * prices.water;
    const costOptimized = totalOptimized * prices.water;
    showResult('💧 Aigua Set-Juny', `<div class="result-item"><strong>Total actual:</strong> ${total.toFixed(2)} m³</div><div class="result-item"><strong>Total optimitzat:</strong> ${totalOptimized.toFixed(2)} m³</div><div class="result-item"><strong>Reducció:</strong> ${(reduction*100).toFixed(1)}%</div><div class="result-item"><strong>Cost actual:</strong> ${cost.toFixed(2)}€</div><div class="result-item"><strong>Cost optimitzat:</strong> ${costOptimized.toFixed(2)}€</div><div class="result-item"><strong>💰 Estalvi:</strong> ${(cost - costOptimized).toFixed(2)}€</div>`);
}

function calculateSuppliesYear() {
    const data = consumptionData.officeSupplies;
    if (data.length === 0) { showResult('📎 Consumibles', 'No hi ha dades'); return; }
    const avg = data.reduce((a, b) => a + b.consumption, 0) / data.length;
    const reduction = getAverageReduction('officeSupplies', data);
    const avgOptimized = avg * (1 - reduction);
    const cost = avg * 12 * prices.officeSupplies;
    const costOptimized = avgOptimized * 12 * prices.officeSupplies;
    const savings = cost - costOptimized;
    let strategiesUsed = '';
    data.forEach(item => {
        if (item.strategy) {
            const strategy = strategies.officeSupplies.find(s => s.id === item.strategy);
            if (strategy) strategiesUsed += `<li>${strategy.name} (${(strategy.reduction*100).toFixed(0)}%)</li>`;
        }
    });
    showResult('📎 Consumibles - Any', `<div class="result-item"><strong>Promig actual:</strong> ${avg.toFixed(2)} kg/mes</div><div class="result-item"><strong>Promig optimitzat:</strong> ${avgOptimized.toFixed(2)} kg/mes</div><div class="result-item"><strong>Reducció mitjana:</strong> ${(reduction*100).toFixed(1)}%</div><div class="result-item"><strong>Cost anual actual:</strong> ${cost.toFixed(2)}€</div><div class="result-item"><strong>Cost anual optimitzat:</strong> ${costOptimized.toFixed(2)}€</div><div class="result-item"><strong>💰 Estalvi anual:</strong> ${savings.toFixed(2)}€</div>${strategiesUsed ? `<div class="result-item"><strong>Estratègies aplicades:</strong><ul>${strategiesUsed}</ul></div>` : ''}`);
}

function calculateSuppliesSchoolYear() {
    const schoolMonths = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
    const filtered = consumptionData.officeSupplies.filter(d => schoolMonths.includes(new Date(d.date).getMonth() + 1));
    if (filtered.length === 0) { showResult('📎 Consumibles', 'No hi ha dades'); return; }
    const total = filtered.reduce((a, b) => a + b.consumption, 0);
    const reduction = getAverageReduction('officeSupplies', filtered);
    const totalOptimized = total * (1 - reduction);
    const cost = total * prices.officeSupplies;
    const costOptimized = totalOptimized * prices.officeSupplies;
    showResult('📎 Consumibles Set-Juny', `<div class="result-item"><strong>Total actual:</strong> ${total.toFixed(2)} kg</div><div class="result-item"><strong>Total optimitzat:</strong> ${totalOptimized.toFixed(2)} kg</div><div class="result-item"><strong>Reducció:</strong> ${(reduction*100).toFixed(1)}%</div><div class="result-item"><strong>Cost actual:</strong> ${cost.toFixed(2)}€</div><div class="result-item"><strong>Cost optimitzat:</strong> ${costOptimized.toFixed(2)}€</div><div class="result-item"><strong>💰 Estalvi:</strong> ${(cost - costOptimized).toFixed(2)}€</div>`);
}

function calculateCleaningYear() {
    const data = consumptionData.cleaningProducts;
    if (data.length === 0) { showResult('🧹 Neteja', 'No hi ha dades'); return; }
    const avg = data.reduce((a, b) => a + b.consumption, 0) / data.length;
    const reduction = getAverageReduction('cleaningProducts', data);
    const avgOptimized = avg * (1 - reduction);
    const cost = avg * 12;
    const costOptimized = avgOptimized * 12;
    const savings = cost - costOptimized;
    let strategiesUsed = '';
    data.forEach(item => {
        if (item.strategy) {
            const strategy = strategies.cleaningProducts.find(s => s.id === item.strategy);
            if (strategy) strategiesUsed += `<li>${strategy.name} (${(strategy.reduction*100).toFixed(0)}%)</li>`;
        }
    });
    showResult('🧹 Neteja - Any', `<div class="result-item"><strong>Cost mensual actual:</strong> ${avg.toFixed(2)}€/mes</div><div class="result-item"><strong>Cost mensual optimitzat:</strong> ${avgOptimized.toFixed(2)}€/mes</div><div class="result-item"><strong>Reducció mitjana:</strong> ${(reduction*100).toFixed(1)}%</div><div class="result-item"><strong>Cost anual actual:</strong> ${cost.toFixed(2)}€</div><div class="result-item"><strong>Cost anual optimitzat:</strong> ${costOptimized.toFixed(2)}€</div><div class="result-item"><strong>💰 Estalvi anual:</strong> ${savings.toFixed(2)}€</div>${strategiesUsed ? `<div class="result-item"><strong>Estratègies aplicades:</strong><ul>${strategiesUsed}</ul></div>` : ''}`);
}

function calculateCleaningSchoolYear() {
    const schoolMonths = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
    const filtered = consumptionData.cleaningProducts.filter(d => schoolMonths.includes(new Date(d.date).getMonth() + 1));
    if (filtered.length === 0) { showResult('🧹 Neteja', 'No hi ha dades'); return; }
    const total = filtered.reduce((a, b) => a + b.consumption, 0);
    const reduction = getAverageReduction('cleaningProducts', filtered);
    const totalOptimized = total * (1 - reduction);
    showResult('🧹 Neteja Set-Juny', `<div class="result-item"><strong>Cost total actual:</strong> ${total.toFixed(2)}€</div><div class="result-item"><strong>Cost total optimitzat:</strong> ${totalOptimized.toFixed(2)}€</div><div class="result-item"><strong>Reducció:</strong> ${(reduction*100).toFixed(1)}%</div><div class="result-item"><strong>💰 Estalvi:</strong> ${(total - totalOptimized).toFixed(2)}€</div>`);
}

function getAverageReduction(type, data) {
    if (data.length === 0) return 0;
    let totalReduction = 0;
    data.forEach(item => {
        if (item.strategy) {
            const strategy = strategies[type]?.find(s => s.id === item.strategy);
            if (strategy) totalReduction += strategy.reduction;
        }
    });
    return totalReduction / data.length;
}

function generateFullReport() {
    let html = '<div style="max-height: 500px; overflow-y: auto;">';
    const elecData = consumptionData.electricity;
    if (elecData.length > 0) {
        const elecAvg = elecData.reduce((a, b) => a + b.consumption, 0) / elecData.length;
        const elecReduction = getAverageReduction('electricity', elecData);
        const elecOptimized = elecAvg * (1 - elecReduction);
        html += `<div class="result-item"><strong>⚡ Electricitat</strong><br>Actual: ${elecAvg.toFixed(2)} kWh/mes | Optimitzat: ${elecOptimized.toFixed(2)} kWh/mes<br>Reducció: ${(elecReduction*100).toFixed(1)}%</div>`;
    }
    const waterData = consumptionData.water;
    if (waterData.length > 0) {
        const waterAvg = waterData.reduce((a, b) => a + b.consumption, 0) / waterData.length;
        const waterReduction = getAverageReduction('water', waterData);
        const waterOptimized = waterAvg * (1 - waterReduction);
        html += `<div class="result-item"><strong>💧 Aigua</strong><br>Actual: ${waterAvg.toFixed(2)} m³/mes | Optimitzat: ${waterOptimized.toFixed(2)} m³/mes<br>Reducció: ${(waterReduction*100).toFixed(1)}%</div>`;
    }
    const suppliesData = consumptionData.officeSupplies;
    if (suppliesData.length > 0) {
        const suppliesAvg = suppliesData.reduce((a, b) => a + b.consumption, 0) / suppliesData.length;
        const suppliesReduction = getAverageReduction('officeSupplies', suppliesData);
        const suppliesOptimized = suppliesAvg * (1 - suppliesReduction);
        html += `<div class="result-item"><strong>📎 Consumibles</strong><br>Actual: ${suppliesAvg.toFixed(2)} kg/mes | Optimitzat: ${suppliesOptimized.toFixed(2)} kg/mes<br>Reducció: ${(suppliesReduction*100).toFixed(1)}%</div>`;
    }
    const cleaningData = consumptionData.cleaningProducts;
    if (cleaningData.length > 0) {
        const cleaningAvg = cleaningData.reduce((a, b) => a + b.consumption, 0) / cleaningData.length;
        const cleaningReduction = getAverageReduction('cleaningProducts', cleaningData);
        const cleaningOptimized = cleaningAvg * (1 - cleaningReduction);
        html += `<div class="result-item"><strong>🧹 Neteja</strong><br>Actual: ${cleaningAvg.toFixed(2)}€/mes | Optimitzat: ${cleaningOptimized.toFixed(2)}€/mes<br>Reducció: ${(cleaningReduction*100).toFixed(1)}%</div>`;
    }
    html += '</div>';
    if (html === '<div style="max-height: 500px; overflow-y: auto;"></div>') {
        showResult('📄 Informe', 'No hi ha dades');
    } else {
        showResult('📄 Informe Complet', html);
    }
}

// UTILITATS
function showResult(title, content) {
    document.getElementById('resultTitle').textContent = title;
    document.getElementById('resultBody').innerHTML = content;
    document.getElementById('resultModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ca-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function saveToLocalStorage() {
    localStorage.setItem('consumptionData', JSON.stringify(consumptionData));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('consumptionData');
    if (saved) {
        consumptionData = JSON.parse(saved);
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('resultModal');
    const strategyModal = document.getElementById('strategyModal');
    if (event.target === modal) modal.style.display = 'none';
    if (event.target === strategyModal) strategyModal.style.display = 'none';
}
