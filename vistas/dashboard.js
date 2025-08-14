function mostrarDashboard(){
    const contenido = dameContenido("paginas/dashboard.php");
    $("#contenido-principal").html(contenido);
    cargarDatosDashboard();
}

function cargarDatosDashboard(){
    $.post("controladores/dashboard.php", {dashboard: true}, function(resp){
        const data = JSON.parse(resp);

        $("#total_proveedores").text(data.totales.proveedores);
        $("#total_clientes").text(data.totales.clientes);
        $("#total_presupuestos").text(data.totales.presupuestos);
        $("#total_ordenes").text(data.totales.ordenes);
        $("#total_remisiones").text(data.totales.remisiones);
        $("#total_notas").text(data.totales.notas);

        var opcionesBarra = {
            chart: {type: 'bar', height: 300},
            series: [
                {name: 'Compras', data: data.compras_ventas.compras},
                {name: 'Ventas', data: data.compras_ventas.ventas}
            ],
            xaxis: {categories: data.compras_ventas.meses}
        };
        var chart1 = new ApexCharts(document.querySelector('#chart-compras-ventas'), opcionesBarra);
        chart1.render();

        var opcionesPie = {
            chart: {type: 'pie', height: 300},
            series: data.ordenes_estado.series,
            labels: data.ordenes_estado.labels
        };
        var chart2 = new ApexCharts(document.querySelector('#chart-ordenes-estado'), opcionesPie);
        chart2.render();

        rellenarTabla('#tbody_presupuestos', data.ultimos_presupuestos, ['fecha','proveedor','monto','estado']);
        rellenarTabla('#tbody_ordenes', data.ultimas_ordenes, ['fecha','id_orden','proveedor','estado']);
        rellenarTabla('#tbody_recepciones', data.ultimas_recepciones, ['fecha','cliente','equipos','estado']);
    });
}

function rellenarTabla(selector, datos, campos){
    const tbody = $(selector).empty();
    if (datos.length){
        datos.forEach(d => {
            const cols = campos.map(c => `<td>${d[c] ?? ''}</td>`).join('');
            tbody.append(`<tr>${cols}</tr>`);
        });
    } else {
        tbody.append(`<tr><td colspan="${campos.length}">-</td></tr>`);
    }
}
