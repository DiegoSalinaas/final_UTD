alert("JS de prueba cargado correctamente");

function mostrarTest() {
    alert("¡Función mostrarTest ejecutada!");
}
window.mostrarTest = mostrarTest;

$(function(){
  $(document).on('click', '.test-boton', function(e){
      e.preventDefault();
      console.log("Click en botón de prueba");
      mostrarTest();
  });
});
