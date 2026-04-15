// DADES GLOBALS
let consumptionData = {
    electricity: [],
    water: [],
    officeSupplies: [],
    cleaningProducts: []
};

const seasonalFactors = {
    electricity: [1.25, 1.25, 0.95, 0.85, 0.80, 0.90, 1.00, 1.10, 0.95, 0.85, 0.95, 1.20],
    water: [0.85, 0.80, 0.95, 1.05, 1.15, 1.40, 1.50, 1.45, 1.10, 0.95, 0.85, 0.80],
    officeSupplies: [0.70, 0.75, 0.80, 0.85, 0.80, 0.60, 0.20, 0.15, 1.50, 1.40, 0.85, 0.75],
    cleaningProducts: [1.10, 1.10, 1.15, 1.10, 1.10, 1.00, 0.50, 0.55, 1.40, 1.35, 1.15, 1.10]
};

const yearGrowthFactors = {
    2026: 1.00,
    2027: 0.95,
    2028: 0.90
};

// ESTRATÈGIES
const strategies = {
    electricity: [
        { id: 'elec-led', name: '🔦 LED Lighting', reduction: 0.10, description: 'Canviar a LED totes les bombetes', fullDescription: '<h3>LED Lighting</h3><p>Substituir bombetes incandescents per LED</p>' },
        { id: 'elec-sensors', name: '🚨 Sensors Moviment', reduction: 0.08, description: 'Instal·lar sensors de moviment', fullDescription: '<h3>Sensors</h3><p>Instal·lació de sensors PIR</p>' },
        { id: 'elec-ac', name: '❄️ Manteniment AC', reduction: 0.07, description: 'Fer manteniment mensual', fullDescription: '<h3>Manteniment AC</h3><p>Programa de manteniment preventiu</p>' },
        { id: 'elec-solar', name: '☀️ Panells Solars', reduction: 0.12, description: 'Instal·lar panells solars', fullDescription: '<h3>Panells Solars</h3><p>Instal·lació de panells fotovoltaics</p>' }
    ],
    water: [
        { id: 'water-sensors', name: '🚰 Grifos Sensor', reduction: 0.12, description: 'Instal·lar grifos amb sensor', fullDescription: '<h3>Grifos Sensor</h3><p>Grifos automàtics</p>' },
        { id: 'water-repairs', name: '🔧 Reparació Fuites', reduction: 0.05, description: 'Revisar i reparar fuites', fullDescription: '<h3>Reparació Fuites</h3><p>Detecció i reparació setmanal</p>' },
        { id: 'water-toilets', name: '🚽 Inodors Doble Flux', reduction: 0.09, description: 'Instal·lar inodors de doble flux', fullDescription: '<h3>Inodors Doble Flux</h3><p>Doble descàrrega</p>' },
        { id: 'water-rain', name: '🌧️ Recollida Pluja', reduction: 0.15, description: 'Crear sistema de recollida pluja', fullDescription: '<h3>Recollida Pluja</h3><p>Sistema de recollida</p>' }
    ],
    officeSupplies: [
        { id: 'supplies-paperless', name: '📱 Paperless', reduction: 0.20, description: 'Implementar política paperless', fullDescription: '<h3>Paperless</h3><p>Zero paper</p>' },
        { id: 'supplies-doubleside', name: '📄 Doble Cara', reduction: 0.15, description: 'Imprimir en doble cara per defecte', fullDescription: '<h3>Doble Cara</h3><p>Imprimir ambdós costats</p>' },
        { id: 'supplies-recycled', name: '♻️ Paper Reciclat', reduction: 0.10, description: 'Usar paper reciclat', fullDescription: '<h3>Paper Reciclat</h3><p>100% reciclat</p>' },
        { id: 'supplies-toner', name: '🖨️ Tòners Reutilitzables', reduction: 0.20, description: 'Crear biblioteca tòners', fullDescription: '<h3>Tòners Reutilitzables</h3><p>10+ recarregues</p>' }
    ],
    cleaningProducts: [
        { id: 'cleaning-eco', name: '🌿 Productes Ecològics', reduction: 0.15, description: 'Cambiar a productes ecológicos', fullDescription: '<h3>Ecològics</h3><p>100% biodegradables</p>' },
        { id: 'cleaning-microfiber', name: '🧵 Microfiber Cloths', reduction: 0.20, description: 'Usar microfiber cloths', fullDescription: '<h3>Microfiber</h3><p>500+ usos</p>' },
        { id: 'cleaning-natural', name: '🍋 Solucions Naturals', reduction: 0.25, description: 'Preparar soluciones naturals', fullDescription: '<h3>Naturals</h3><p>Vinagre + aigua</p>' },
        { id: 'cleaning-protocol', name: '⏱️ Protocol Eficient', reduction: 0.12, description: 'Implementar protocolos', fullDescription: '<h3>Protocol</h3><p>Optimitzat</p>' }
    ]
};

const prices = {
    electricity: 0.15,
    water: 2.00,
    officeSupplies: 2.50,
    cleaningProducts: 8.00
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
});

// TABS
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    if (tabName === 'forecast') setTimeout(() => updateForecast(), 100);
    if (tabName === 'planning') setTimeout(() => updatePlanningDisplay(), 100);
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
    strategyInfo.innerHTML = `<h4>${strategy.name}</h4><p>${strategy.description}</p><div class="reduction-percent">Reducció esperada: ${(strategy.reduction * 100).toFixed(0)}%</div><button class="btn btn-secondary" onclick="showStrategyModal('${consumptionType}', '${selectedId}')" style="margin-top: 12px;">Més informació →</button>`;
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
    document.getElementById('consumptionValue').value = '';
    alert('✅ Dada afegida correctament!');
}

function deleteConsumption(type, index) {
    consumptionData[type].splice(index, 1);
    saveToLocalStorage();
    updateDataDisplay();
}

function clearAllData() {
    if (confirm('Estàs segur?')) {
        consumptionData = { electricity: [], water: [], officeSupplies: [], cleaningProducts: [] };
        saveToLocalStorage();
        updateDataDisplay();
        alert('✅ Dades eliminades');
    }
}

function updateDataDisplay() {
    updateTable('electricity', 'electricityTableBody', 'kWh');
    updateTable('water', 'waterTableBody', 'm³');
    updateTable('officeSupplies', 'suppliesTableBody', 'kg');
    updateTable('cleaningProducts', 'cleaningTableBody', 'litres');
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
                strategyDisplay = `<a href="#" onclick="showStrategyModal('${type}', '${item.strategy}'); return false;" style="color: #667eea; text-decoration: none; cursor: pointer;">${strategyObj.name} ℹ️</a>`;
            }
        }
        row.innerHTML = `<td>${formatDate(item.date)}</td><td>${item.consumption} ${unit}</td><td>${strategyDisplay}</td><td><button class="btn-delete" onclick="deleteConsumption('${type}', ${index})">X</button></td>`;
        table.appendChild(row);
    });
}

// PLA MENSUAL
function updatePlanningDisplay() {
    const year = document.getElementById('planningYear').value;
    console.log('Updating planning for year:', year);
    console.log('Strategies:', strategies);
    generatePlanningCard('electricity', year);
    generatePlanningCard('water', year);
    generatePlanningCard('officeSupplies', year);
    generatePlanningCard('cleaningProducts', year);
    updatePlanningSummary(year);
}

function generatePlanningCard(type, year) {
    const container = document.getElementById(type + 'Planning');
    const typeStrategies = strategies[type] || [];
    console.log(`Generating ${type} planning with ${typeStrategies.length} strategies`);
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
    const baseConsumption = 1500;
    const growthFactor = yearGrowthFactors[year] || 1.00;
    const months_labels = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

    const data = seasonalFactors.electricity.map((factor, index) => {
        const monthlyReduction = getMonthlyStrategyReduction('electricity', index, year);
        const baseValue = baseConsumption * factor * growthFactor;
        const reducedValue = baseValue * (1 - monthlyReduction);
        return Math.round(reducedValue);
    });

    const avgConsumption = Math.round(data.reduce((a, b) => a + b) / data.length);
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
    const baseConsumption = 50;
    const growthFactor = yearGrowthFactors[year] || 1.00;
    const months_labels = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

    const data = seasonalFactors.water.map((factor, index) => {
        const monthlyReduction = getMonthlyStrategyReduction('water', index, year);
        const baseValue = baseConsumption * factor * growthFactor;
        const reducedValue = baseValue * (1 - monthlyReduction);
        return Math.round(reducedValue * 10) / 10;
    });

    const avgConsumption = Math.round(data.reduce((a, b) => a + b) / data.length * 10) / 10;
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
    const baseConsumption = 120;
    const growthFactor = yearGrowthFactors[year] || 1.00;
    const months_labels = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

    const data = seasonalFactors.officeSupplies.map((factor, index) => {
        const monthlyReduction = getMonthlyStrategyReduction('officeSupplies', index, year);
        const baseValue = baseConsumption * factor * growthFactor;
        const reducedValue = baseValue * (1 - monthlyReduction);
        return Math.round(reducedValue);
    });

    const avgConsumption = Math.round(data.reduce((a, b) => a + b) / data.length);
    document.getElementById('suppliesAvg').textContent = avgConsumption;

    const ctx = document.getElementById('suppliesChart').getContext('2d');
    if (window.suppliesChartInstance) window.suppliesChartInstance.destroy();

    window.suppliesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months_labels,
            datasets: [{
                label: `Consum (kg) - ${year}`,
                data: data,
                backgroundColor: ['#fa709a', '#fa709a', '#fa709a', '#fa709a', '#fa709a', '#fee140', '#fee140', '#fee140', '#fa709a', '#fa709a', '#fa709a', '#fa709a'],
                borderColor: '#fa709a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true, ticks: { callback: function(value) { return value + ' kg'; } } } }
        }
    });
}

function generateCleaningForecast(year) {
    const baseConsumption = 26;
    const growthFactor = yearGrowthFactors[year] || 1.00;
    const months_labels = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

    const data = seasonalFactors.cleaningProducts.map((factor, index) => {
        const monthlyReduction = getMonthlyStrategyReduction('cleaningProducts', index, year);
        const baseValue = baseConsumption * factor * growthFactor;
        const reducedValue = baseValue * (1 - monthlyReduction);
        return Math.round(reducedValue * 10) / 10;
    });

    const avgConsumption = Math.round(data.reduce((a, b) => a + b) / data.length * 10) / 10;
    document.getElementById('cleaningAvg').textContent = avgConsumption;

    const ctx = document.getElementById('cleaningChart').getContext('2d');
    if (window.cleaningChartInstance) window.cleaningChartInstance.destroy();

    window.cleaningChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months_labels,
            datasets: [{
                label: `Consum (litres) - ${year}`,
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
            scales: { y: { beginAtZero: false, ticks: { callback: function(value) { return value + ' L'; } } } }
        }
    });
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
    showResult('⚡ Electricitat - Any', `<div class="result-item"><strong>Promig actual:</strong> ${avg.toFixed(2)} kWh/mes</div><div class="result-item"><strong>Promig optimitzat:</strong> ${avgOptimized.toFixed(2)} kWh/mes</div><div class="result-item"><strong>Reducció aplicada:</strong> ${(reduction * 100).toFixed(1)}%</div><div class="result-item"><strong>Estratègies aplicades:</strong> <ul style="margin: 10px 0;">${strategiesUsed || '<li>Cap</li>'}</ul></div><div class="result-item"><strong>Cost actual:</strong> ${cost.toFixed(2)}€/any</div><div class="result-item"><strong>Cost optimitzat:</strong> ${costOptimized.toFixed(2)}€/any</div><div class="result-item" style="background: #e8f5e9; border-left-color: #11998e;"><strong style="color: #11998e;">Estalvi anual:</strong> ${savings.toFixed(2)}€</div>`);
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
    showResult('⚡ Electricitat Set-Juny', `<div class="result-item"><strong>Total actual:</strong> ${total.toFixed(2)} kWh</div><div class="result-item"><strong>Total optimitzat:</strong> ${totalOptimized.toFixed(2)} kWh</div><div class="result-item"><strong>Reducció aplicada:</strong> ${(reduction * 100).toFixed(1)}%</div><div class="result-item"><strong>Cost actual:</strong> ${cost.toFixed(2)}€</div><div class="result-item"><strong>Cost optimitzat:</strong> ${costOptimized.toFixed(2)}€</div><div class="result-item" style="background: #e8f5e9; border-left-color: #11998e;"><strong style="color: #11998e;">Estalvi:</strong> ${(cost - costOptimized).toFixed(2)}€</div>`);
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
    showResult('💧 Aigua - Any', `<div class="result-item"><strong>Promig actual:</strong> ${avg.toFixed(2)} m³/mes</div><div class="result-item"><strong>Promig optimitzat:</strong> ${avgOptimized.toFixed(2)} m³/mes</div><div class="result-item"><strong>Reducció aplicada:</strong> ${(reduction * 100).toFixed(1)}%</div><div class="result-item"><strong>Estratègies aplicades:</strong> <ul style="margin: 10px 0;">${strategiesUsed || '<li>Cap</li>'}</ul></div><div class="result-item"><strong>Cost actual:</strong> ${cost.toFixed(2)}€/any</div><div class="result-item"><strong>Cost optimitzat:</strong> ${costOptimized.toFixed(2)}€/any</div><div class="result-item" style="background: #e8f5e9; border-left-color: #11998e;"><strong style="color: #11998e;">Estalvi anual:</strong> ${savings.toFixed(2)}€</div>`);
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
    showResult('💧 Aigua Set-Juny', `<div class="result-item"><strong>Total actual:</strong> ${total.toFixed(2)} m³</div><div class="result-item"><strong>Total optimitzat:</strong> ${totalOptimized.toFixed(2)} m³</div><div class="result-item"><strong>Reducció aplicada:</strong> ${(reduction * 100).toFixed(1)}%</div><div class="result-item"><strong>Cost actual:</strong> ${cost.toFixed(2)}€</div><div class="result-item"><strong>Cost optimitzat:</strong> ${costOptimized.toFixed(2)}€</div><div class="result-item" style="background: #e8f5e9; border-left-color: #11998e;"><strong style="color: #11998e;">Estalvi:</strong> ${(cost - costOptimized).toFixed(2)}€</div>`);
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
    showResult('📎 Consumibles - Any', `<div class="result-item"><strong>Promig actual:</strong> ${avg.toFixed(2)} kg/mes</div><div class="result-item"><strong>Promig optimitzat:</strong> ${avgOptimized.toFixed(2)} kg/mes</div><div class="result-item"><strong>Reducció aplicada:</strong> ${(reduction * 100).toFixed(1)}%</div><div class="result-item"><strong>Estratègies aplicades:</strong> <ul style="margin: 10px 0;">${strategiesUsed || '<li>Cap</li>'}</ul></div><div class="result-item"><strong>Cost actual:</strong> ${cost.toFixed(2)}€/any</div><div class="result-item"><strong>Cost optimitzat:</strong> ${costOptimized.toFixed(2)}€/any</div><div class="result-item" style="background: #e8f5e9; border-left-color: #11998e;"><strong style="color: #11998e;">Estalvi anual:</strong> ${savings.toFixed(2)}€</div>`);
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
    showResult('📎 Consumibles Set-Juny', `<div class="result-item"><strong>Total actual:</strong> ${total.toFixed(2)} kg</div><div class="result-item"><strong>Total optimitzat:</strong> ${totalOptimized.toFixed(2)} kg</div><div class="result-item"><strong>Reducció aplicada:</strong> ${(reduction * 100).toFixed(1)}%</div><div class="result-item"><strong>Cost actual:</strong> ${cost.toFixed(2)}€</div><div class="result-item"><strong>Cost optimitzat:</strong> ${costOptimized.toFixed(2)}€</div><div class="result-item" style="background: #e8f5e9; border-left-color: #11998e;"><strong style="color: #11998e;">Estalvi:</strong> ${(cost - costOptimized).toFixed(2)}€</div>`);
}

function calculateCleaningYear() {
    const data = consumptionData.cleaningProducts;
    if (data.length === 0) { showResult('🧹 Neteja', 'No hi ha dades'); return; }
    const avg = data.reduce((a, b) => a + b.consumption, 0) / data.length;
    const reduction = getAverageReduction('cleaningProducts', data);
    const avgOptimized = avg * (1 - reduction);
    const cost = avg * 12 * prices.cleaningProducts;
    const costOptimized = avgOptimized * 12 * prices.cleaningProducts;
    const savings = cost - costOptimized;
    let strategiesUsed = '';
    data.forEach(item => {
        if (item.strategy) {
            const strategy = strategies.cleaningProducts.find(s => s.id === item.strategy);
            if (strategy) strategiesUsed += `<li>${strategy.name} (${(strategy.reduction*100).toFixed(0)}%)</li>`;
        }
    });
    showResult('🧹 Neteja - Any', `<div class="result-item"><strong>Promig actual:</strong> ${avg.toFixed(2)} L/mes</div><div class="result-item"><strong>Promig optimitzat:</strong> ${avgOptimized.toFixed(2)} L/mes</div><div class="result-item"><strong>Reducció aplicada:</strong> ${(reduction * 100).toFixed(1)}%</div><div class="result-item"><strong>Estratègies aplicades:</strong> <ul style="margin: 10px 0;">${strategiesUsed || '<li>Cap</li>'}</ul></div><div class="result-item"><strong>Cost actual:</strong> ${cost.toFixed(2)}€/any</div><div class="result-item"><strong>Cost optimitzat:</strong> ${costOptimized.toFixed(2)}€/any</div><div class="result-item" style="background: #e8f5e9; border-left-color: #11998e;"><strong style="color: #11998e;">Estalvi anual:</strong> ${savings.toFixed(2)}€</div>`);
}

function calculateCleaningSchoolYear() {
    const schoolMonths = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
    const filtered = consumptionData.cleaningProducts.filter(d => schoolMonths.includes(new Date(d.date).getMonth() + 1));
    if (filtered.length === 0) { showResult('🧹 Neteja', 'No hi ha dades'); return; }
    const total = filtered.reduce((a, b) => a + b.consumption, 0);
    const reduction = getAverageReduction('cleaningProducts', filtered);
    const totalOptimized = total * (1 - reduction);
    const cost = total * prices.cleaningProducts;
    const costOptimized = totalOptimized * prices.cleaningProducts;
    showResult('🧹 Neteja Set-Juny', `<div class="result-item"><strong>Total actual:</strong> ${total.toFixed(2)} L</div><div class="result-item"><strong>Total optimitzat:</strong> ${totalOptimized.toFixed(2)} L</div><div class="result-item"><strong>Reducció aplicada:</strong> ${(reduction * 100).toFixed(1)}%</div><div class="result-item"><strong>Cost actual:</strong> ${cost.toFixed(2)}€</div><div class="result-item"><strong>Cost optimitzat:</strong> ${costOptimized.toFixed(2)}€</div><div class="result-item" style="background: #e8f5e9; border-left-color: #11998e;"><strong style="color: #11998e;">Estalvi:</strong> ${(cost - costOptimized).toFixed(2)}€</div>`);
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
        html += `<div class="result-item"><strong>⚡ Electricitat</strong><br>Actual: ${elecAvg.toFixed(2)} kWh/mes | Optimitzat: ${elecOptimized.toFixed(2)} kWh/mes<br>Reducció: ${(elecReduction * 100).toFixed(1)}%<br>Cost actual: ${(elecAvg * 12 * 0.15).toFixed(2)}€ | Cost optimitzat: ${(elecOptimized * 12 * 0.15).toFixed(2)}€<br>Estalvi: ${((elecAvg - elecOptimized) * 12 * 0.15).toFixed(2)}€/any</div>`;
    }
    const waterData = consumptionData.water;
    if (waterData.length > 0) {
        const waterAvg = waterData.reduce((a, b) => a + b.consumption, 0) / waterData.length;
        const waterReduction = getAverageReduction('water', waterData);
        const waterOptimized = waterAvg * (1 - waterReduction);
        html += `<div class="result-item"><strong>💧 Aigua</strong><br>Actual: ${waterAvg.toFixed(2)} m³/mes | Optimitzat: ${waterOptimized.toFixed(2)} m³/mes<br>Reducció: ${(waterReduction * 100).toFixed(1)}%<br>Cost actual: ${(waterAvg * 12 * 2.00).toFixed(2)}€ | Cost optimitzat: ${(waterOptimized * 12 * 2.00).toFixed(2)}€<br>Estalvi: ${((waterAvg - waterOptimized) * 12 * 2.00).toFixed(2)}€/any</div>`;
    }
    const suppliesData = consumptionData.officeSupplies;
    if (suppliesData.length > 0) {
        const suppliesAvg = suppliesData.reduce((a, b) => a + b.consumption, 0) / suppliesData.length;
        const suppliesReduction = getAverageReduction('officeSupplies', suppliesData);
        const suppliesOptimized = suppliesAvg * (1 - suppliesReduction);
        html += `<div class="result-item"><strong>📎 Consumibles</strong><br>Actual: ${suppliesAvg.toFixed(2)} kg/mes | Optimitzat: ${suppliesOptimized.toFixed(2)} kg/mes<br>Reducció: ${(suppliesReduction * 100).toFixed(1)}%<br>Cost actual: ${(suppliesAvg * 12 * 2.50).toFixed(2)}€ | Cost optimitzat: ${(suppliesOptimized * 12 * 2.50).toFixed(2)}€<br>Estalvi: ${((suppliesAvg - suppliesOptimized) * 12 * 2.50).toFixed(2)}€/any</div>`;
    }
    const cleaningData = consumptionData.cleaningProducts;
    if (cleaningData.length > 0) {
        const cleaningAvg = cleaningData.reduce((a, b) => a + b.consumption, 0) / cleaningData.length;
        const cleaningReduction = getAverageReduction('cleaningProducts', cleaningData);
        const cleaningOptimized = cleaningAvg * (1 - cleaningReduction);
        html += `<div class="result-item"><strong>🧹 Neteja</strong><br>Actual: ${cleaningAvg.toFixed(2)} L/mes | Optimitzat: ${cleaningOptimized.toFixed(2)} L/mes<br>Reducció: ${(cleaningReduction * 100).toFixed(1)}%<br>Cost actual: ${(cleaningAvg * 12 * 8.00).toFixed(2)}€ | Cost optimitzat: ${(cleaningOptimized * 12 * 8.00).toFixed(2)}€<br>Estalvi: ${((cleaningAvg - cleaningOptimized) * 12 * 8.00).toFixed(2)}€/any</div>`;
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
