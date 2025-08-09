function mostrarListarReportes(){
    let contenido = dameContenido("paginas/referenciales/reportes/listar.php");
    $("#contenido-principal").html(contenido);
    cargarMovimientos();
}
window.mostrarListarReportes = mostrarListarReportes;

function cargarMovimientos(){
    let datos = ejecutarAjax("controladores/reportes.php","movimientos=1");
    if(datos === "0"){
        $("#movimientos_tb").html("<tr><td colspan='6'>NO HAY REGISTROS</td></tr>");
    }else{
        let json = JSON.parse(datos);
        $("#movimientos_tb").html("");
        json.forEach(function(it){
            $("#movimientos_tb").append(`
                <tr>
                    <td>${it.modulo}</td>
                    <td>${it.id}</td>
                    <td>${it.fecha}</td>
                    <td>${it.persona}</td>
                    <td>${formatearPY(it.total)}</td>
                    <td>${badgeEstado(it.estado)}</td>
                </tr>`);
        });
    }
}
