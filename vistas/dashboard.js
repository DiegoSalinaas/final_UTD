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
    });
}
