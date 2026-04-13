let consumptionData = {
    electricity: [],
    water: [],
    officeSupplies: [],
    cleaningProducts: []
};

// FACTORS ESTACIONALS
const seasonalFactors = {
    electricity: [1.25, 1.25, 0.95, 0.85, 0.80, 0.90, 1.00, 1.10, 0.95, 0.85, 0.95, 1.20],
    water: [0.85, 0.80, 0.95, 1.05, 1.15, 1.40, 1.50, 1.45, 1.10, 0.95, 0.85, 0.80],
    officeSupplies: [0.70, 0.75, 0.80, 0.85, 0.80, 0.60, 0.20, 0.15, 1.50, 1.40, 0.85, 0.75],
    cleaningProducts: [1.10, 1.10, 1.15, 1.10, 1.10, 1.00, 0.50, 0.55, 1.40, 1.35, 1.15, 1.10]
};

document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    document.getElementById('consumptionDate').valueAsDate = new Date();
    updateDataDisplay();
    updateForecast();
});

// ===== GESTIÓ TABS =====
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'forecast') {
        setTimeout(() => updateForecast(), 100);
    }
}

// ===== GESTIÓ DADES =====
function addConsumption() {
    const type = document.getElementById('consumptionType').value;
    const value = parseFloat(document.getElementById('consumptionValue').value);
    const date = document.getElementById('consumptionDate').value;

    if (!value || value <= 0) {
        alert('Si us plau, introduïx un valor vàlid');
        return;
    }

    consumptionData[type].push({ date, consumption: value });
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
    updateTable('officeSupplies', 'suppliesTableBody', 'unitats');
    updateTable('cleaningProducts', 'cleaningTableBody', 'litres');
}

function updateTable(type, tableId, unit) {
    const table = document.querySelector(`#${tableId}`);
    table.innerHTML = '';

    if (consumptionData[type].length === 0) {
        table.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">Cap dada registrada</td></tr>';
        return;
    }

    consumptionData[type].forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(item.date)}</td>
            <td>${item.consumption} ${unit}</td>
            <td><button class="btn-delete" onclick="deleteConsumption('${type}', ${index})">Eliminar</button></td>
        `;
        table.appendChild(row);
    });
}

// ===== CÀLCULS =====
function calculateElectricityYear() {
    const data = consumptionData.electricity;
    if (data.length === 0) {
        showResult('⚡ Electricitat', 'No hi ha dades');
        return;
    }
    const avg = data.reduce((a, b) => a + b.consumption, 0) / data.length;
    showResult('⚡ Electricitat - Any', `
        <div class="result-item"><strong>Promig:</strong> ${avg.toFixed(2)} kWh/mes</div>
        <div class="result-item"><strong>Predicció anual:</strong> ${(avg * 12).toFixed(2)} kWh</div>
        <div class="result-item"><strong>Cost:</strong> ${(avg * 12 * 0.15).toFixed(2)}€</div>
    `);
}

function calculateElectricitySchoolYear() {
    const schoolMonths = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
    const filtered = consumptionData.electricity.filter(d => {
        const month = new Date(d.date).getMonth() + 1;
        return schoolMonths.includes(month);
    });
    if (filtered.length === 0) {
        showResult('⚡ Electricitat', 'No hi ha dades');
        return;
    }
    const total = filtered.reduce((a, b) => a + b.consumption, 0);
    showResult('⚡ Electricitat Set-Juny', `
        <div class="result-item"><strong>Períodes:</strong> ${filtered.length}</div>
        <div class="result-item"><strong>Total:</strong> ${total.toFixed(2)} kWh</div>
        <div class="result-item"><strong>Cost:</strong> ${(total * 0.15).toFixed(2)}€</div>
    `);
}

function calculateWaterYear() {
    const data = consumptionData.water;
    if (data.length === 0) {
        showResult('💧 Aigua', 'No hi ha dades');
        return;
    }
    const avg = data.reduce((a, b) => a + b.consumption, 0) / data.length;
    showResult('💧 Aigua - Any', `
        <div class="result-item"><strong>Promig:</strong> ${avg.toFixed(2)} m³/mes</div>
        <div class="result-item"><strong>Predicció anual:</strong> ${(avg * 12).toFixed(2)} m³</div>
        <div class="result-item"><strong>Cost:</strong> ${(avg * 12 * 2).toFixed(2)}€</div>
    `);
}

function calculateWaterSchoolYear() {
    const schoolMonths = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
    const filtered = consumptionData.water.filter(d => {
        const month = new Date(d.date).getMonth() + 1;
        return schoolMonths.includes(month);
    });
    if (filtered.length === 0) {
        showResult('💧 Aigua', 'No hi ha dades');
        return;
    }
    const total = filtered.reduce((a, b) => a + b.consumption, 0);
    showResult('💧 Aigua Set-Juny', `
        <div class="result-item"><strong>Períodes:</strong> ${filtered.length}</div>
        <div class="result-item"><strong>Total:</strong> ${total.toFixed(2)} m³</div>
        <div class="result-item"><strong>Cost:</strong> ${(total * 2).toFixed(2)}€</div>
    `);
}

function calculateSuppliesYear() {
    const data = consumptionData.officeSupplies;
    if (data.length === 0) {
        showResult('📎 Consumibles', 'No hi ha dades');
        return;
    }
    const avg = data.reduce((a, b) => a + b.consumption, 0) / data.length;
    showResult('���� Consumibles - Any', `
        <div class="result-item"><strong>Promig:</strong> ${avg.toFixed(2)} unitats/mes</div>
        <div class="result-item"><strong>Predicció anual:</strong> ${(avg * 12).toFixed(2)} unitats</div>
        <div class="result-item"><strong>Cost:</strong> ${(avg * 12 * 0.50).toFixed(2)}€</div>
    `);
}

function calculateSuppliesSchoolYear() {
    const schoolMonths = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
    const filtered = consumptionData.officeSupplies.filter(d => {
        const month = new Date(d.date).getMonth() + 1;
        return schoolMonths.includes(month);
    });
    if (filtered.length === 0) {
        showResult('📎 Consumibles', 'No hi ha dades');
        return;
    }
    const total = filtered.reduce((a, b) => a + b.consumption, 0);
    showResult('📎 Consumibles Set-Juny', `
        <div class="result-item"><strong>Períodes:</strong> ${filtered.length}</div>
        <div class="result-item"><strong>Total:</strong> ${total.toFixed(2)} unitats</div>
        <div class="result-item"><strong>Cost:</strong> ${(total * 0.50).toFixed(2)}€</div>
    `);
}

function calculateCleaningYear() {
    const data = consumptionData.cleaningProducts;
    if (data.length === 0) {
        showResult('🧹 Neteja', 'No hi ha dades');
        return;
    }
    const avg = data.reduce((a, b) => a + b.consumption, 0) / data.length;
    showResult('🧹 Neteja - Any', `
        <div class="result-item"><strong>Promig:</strong> ${avg.toFixed(2)} L/mes</div>
        <div class="result-item"><strong>Predicció anual:</strong> ${(avg * 12).toFixed(2)} L</div>
        <div class="result-item"><strong>Cost:</strong> ${(avg * 12 * 8).toFixed(2)}€</div>
    `);
}

function calculateCleaningSchoolYear() {
    const schoolMonths = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
    const filtered = consumptionData.cleaningProducts.filter(d => {
        const month = new Date(d.date).getMonth() + 1;
        return schoolMonths.includes(month);
    });
    if (filtered.length === 0) {
        showResult('🧹 Neteja', 'No hi ha dades');
        return;
    }
    const total = filtered.reduce((a, b) => a + b.consumption, 0);
    showResult('🧹 Neteja Set-Juny', `
        <div class="result-item"><strong>Períodes:</strong> ${filtered.length}</div>
        <div class="result-item"><strong>Total:</strong> ${total.toFixed(2)} L</div>
        <div class="result-item"><strong>Cost:</strong> ${(total * 8).toFixed(2)}€</div>
    `);
}

function generateFullReport() {
    let html = '<div style="max-height: 500px; overflow-y: auto;">';
   
    const elec = consumptionData.electricity;
    if (elec.length > 0) {
        const elecAvg = elec.reduce((a, b) => a + b.consumption, 0) / elec.length;
        html += `
            <div class="result-item">
                <strong>⚡ Electricitat</strong><br>
                Promig: ${elecAvg.toFixed(2)} kWh/mes<br>
                Anual: ${(elecAvg * 12).toFixed(2)} kWh<br>
                Cost: ${(elecAvg * 12 * 0.15).toFixed(2)}€
            </div>
        `;
    }

    const water = consumptionData.water;
    if (water.length > 0) {
        const waterAvg = water.reduce((a, b) => a + b.consumption, 0) / water.length;
        html += `
            <div class="result-item">
                <strong>💧 Aigua</strong><br>
                Promig: ${waterAvg.toFixed(2)} m³/mes<br>
                Anual: ${(waterAvg * 12).toFixed(2)} m³<br>
                Cost: ${(waterAvg * 12 * 2).toFixed(2)}€
            </div>
        `;
    }

    const supplies = consumptionData.officeSupplies;
    if (supplies.length > 0) {
        const suppliesAvg = supplies.reduce((a, b) => a + b.consumption, 0) / supplies.length;
        html += `
            <div class="result-item">
                <strong>📎 Consumibles</strong><br>
                Promig: ${suppliesAvg.toFixed(2)} unitats/mes<br>
                Anual: ${(suppliesAvg * 12).toFixed(2)} unitats<br>
                Cost: ${(suppliesAvg * 12 * 0.50).toFixed(2)}€
            </div>
        `;
    }

    const cleaning = consumptionData.cleaningProducts;
    if (cleaning.length > 0) {
        const cleaningAvg = cleaning.reduce((a, b) => a + b.consumption, 0) / cleaning.length;
        html += `
            <div class="result-item">
                <strong>🧹 Neteja</strong><br>
                Promig: ${cleaningAvg.toFixed(2)} L/mes<br>
                Anual: ${(cleaningAvg * 12).toFixed(2)} L<br>
                Cost: ${(cleaningAvg * 12 * 8).toFixed(2)}€
            </div>
        `;
    }

    html += '</div>';

    if (html === '<div style="max-height: 500px; overflow-y: auto;"></div>') {
        showResult('📄 Informe', 'No hi ha dades');
    } else {
        showResult('📄 Informe Complet', html);
    }
}

// ===== PREDICCIÓ ESTACIONAL =====
function updateForecast() {
    const year = document.getElementById('forecastYear').value;
    generateElectricityForecast(year);
    generateWaterForecast(year);
    generateSuppliesForecast(year);
    generateCleaningForecast(year);
}

function generateElectricityForecast(year) {
    const baseConsumption = 1500;
    const months = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
    const data = seasonalFactors.electricity.map(factor => Math.round(baseConsumption * factor));
    const avgConsumption = Math.round(data.reduce((a, b) => a + b) / data.length);
    document.getElementById('elecAvg').textContent = avgConsumption;

    const ctx = document.getElementById('electricityChart').getContext('2d');
    if (window.electricityChartInstance) window.electricityChartInstance.destroy();

    window.electricityChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Consum (kWh)',
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
    const months = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
    const data = seasonalFactors.water.map(factor => Math.round(baseConsumption * factor * 10) / 10);
    const avgConsumption = Math.round(data.reduce((a, b) => a + b) / data.length * 10) / 10;
    document.getElementById('waterAvg').textContent = avgConsumption;

    const ctx = document.getElementById('waterChart').getContext('2d');
    if (window.waterChartInstance) window.waterChartInstance.destroy();

    window.waterChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Consum (m³)',
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
    const months = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
    const data = seasonalFactors.officeSupplies.map(factor => Math.round(baseConsumption * factor));
    const avgConsumption = Math.round(data.reduce((a, b) => a + b) / data.length);
    document.getElementById('suppliesAvg').textContent = avgConsumption;

    const ctx = document.getElementById('suppliesChart').getContext('2d');
    if (window.suppliesChartInstance) window.suppliesChartInstance.destroy();

    window.suppliesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Consum (unitats)',
                data: data,
                backgroundColor: ['#fa709a', '#fa709a', '#fa709a', '#fa709a', '#fa709a', '#fee140', '#fee140', '#fee140', '#fa709a', '#fa709a', '#fa709a', '#fa709a'],
                borderColor: '#fa709a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true, ticks: { callback: function(value) { return value + ' unitats'; } } } }
        }
    });
}

function generateCleaningForecast(year) {
    const baseConsumption = 26;
    const months = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
    const data = seasonalFactors.cleaningProducts.map(factor => Math.round(baseConsumption * factor * 10) / 10);
    const avgConsumption = Math.round(data.reduce((a, b) => a + b) / data.length * 10) / 10;
    document.getElementById('cleaningAvg').textContent = avgConsumption;

    const ctx = document.getElementById('cleaningChart').getContext('2d');
    if (window.cleaningChartInstance) window.cleaningChartInstance.destroy();

    window.cleaningChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Consum (litres)',
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

// ===== CALCULADORA VISUAL =====
function recalculateVisual() {
    const currentElec = parseFloat(document.getElementById('recalcElecVisual').value) || 1500;
    const currentWater = parseFloat(document.getElementById('recalcWaterVisual').value) || 50;
    const currentSupplies = parseFloat(document.getElementById('recalcSuppliesVisual').value) || 180;
    const currentCleaning = parseFloat(document.getElementById('recalcCleaningVisual').value) || 32;

    const finalElec = Math.round(currentElec * 0.70 * 100) / 100;
    const finalWater = Math.round(currentWater * 0.42 * 100) / 100;
    const finalSupplies = Math.round(currentSupplies * 0.30 * 100) / 100;
    const finalCleaning = Math.round(currentCleaning * 0.25 * 100) / 100;

    document.getElementById('resultElecVisual').textContent = finalElec;
    document.getElementById('resultWaterVisual').textContent = finalWater;
    document.getElementById('resultSuppliesVisual').textContent = finalSupplies;
    document.getElementById('resultCleaningVisual').textContent = finalCleaning;

    const savingElecMonth = Math.round((currentElec - finalElec) * 100) / 100;
    const savingWaterMonth = Math.round((currentWater - finalWater) * 100) / 100;
    const savingSuppliesMonth = Math.round((currentSupplies - finalSupplies) * 100) / 100;
    const savingCleaningMonth = Math.round((currentCleaning - finalCleaning) * 100) / 100;

    const savingElecYear = Math.round(savingElecMonth * 12 * 100) / 100;
    const savingWaterYear = Math.round(savingWaterMonth * 12 * 100) / 100;
    const savingSuppliesYear = Math.round(savingSuppliesMonth * 12 * 100) / 100;
    const savingCleaningYear = Math.round(savingCleaningMonth * 12 * 100) / 100;

    const costElec = Math.round(savingElecYear * 0.15 * 100) / 100;
    const costWater = Math.round(savingWaterYear * 2.00 * 100) / 100;
    const costSupplies = Math.round(savingSuppliesYear * 0.50 * 100) / 100;
    const costCleaning = Math.round(savingCleaningYear * 8.00 * 100) / 100;
    const totalCost = Math.round((costElec + costWater + costSupplies + costCleaning) * 100) / 100;

    document.getElementById('savingElecMonthVisual').textContent = savingElecMonth.toFixed(0);
    document.getElementById('savingElecYearVisual').textContent = savingElecYear.toFixed(0);
    document.getElementById('costElecVisual').textContent = costElec.toFixed(2) + '€';

    document.getElementById('savingWaterMonthVisual').textContent = savingWaterMonth.toFixed(0);
    document.getElementById('savingWaterYearVisual').textContent = savingWaterYear.toFixed(0);
    document.getElementById('costWaterVisual').textContent = costWater.toFixed(2) + '€';

    document.getElementById('savingSuppliesMonthVisual').textContent = savingSuppliesMonth.toFixed(0);
    document.getElementById('savingSuppliesYearVisual').textContent = savingSuppliesYear.toFixed(0);
    document.getElementById('costSuppliesVisual').textContent = costSupplies.toFixed(2) + '€';

    document.getElementById('savingCleaningMonthVisual').textContent = savingCleaningMonth.toFixed(0);
    document.getElementById('savingCleaningYearVisual').textContent = savingCleaningYear.toFixed(0);
    document.getElementById('costCleaningVisual').textContent = costCleaning.toFixed(2) + '€';

    document.getElementById('totalCostVisual').textContent = totalCost.toFixed(2) + '€';
    document.getElementById('calcResultsVisual').style.display = 'block';
}

// ===== UTILITATS =====
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
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}