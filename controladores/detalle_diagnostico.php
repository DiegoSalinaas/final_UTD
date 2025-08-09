<?php
require_once '../conexion/db.php';
$db=new DB();$cn=$db->conectar();
if(isset($_POST['guardar'])){
 $d=json_decode($_POST['guardar'],true);
 $q=$cn->prepare("INSERT INTO diagnostico_detalle (id_diagnostico,componente,estado_componente,hallazgo,accion_recomendada,id_repuesto,cantidad_repuesto,costo_unitario_estimado,costo_linea_estimado,nota_adicional) VALUES (:id_diagnostico,:componente,:estado_componente,:hallazgo,:accion_recomendada,:id_repuesto,:cantidad_repuesto,:costo_unitario_estimado,:costo_linea_estimado,:nota_adicional)");
 $q->execute($d);echo 'OK';
}
if(isset($_POST['actualizar'])){
 $d=json_decode($_POST['actualizar'],true);
 $q=$cn->prepare("UPDATE diagnostico_detalle SET id_diagnostico=:id_diagnostico,componente=:componente,estado_componente=:estado_componente,hallazgo=:hallazgo,accion_recomendada=:accion_recomendada,id_repuesto=:id_repuesto,cantidad_repuesto=:cantidad_repuesto,costo_unitario_estimado=:costo_unitario_estimado,costo_linea_estimado=:costo_linea_estimado,nota_adicional=:nota_adicional WHERE id_detalle_diag=:id_detalle_diag");
 $q->execute($d);
}
if(isset($_POST['eliminar'])){$q=$cn->prepare("DELETE FROM diagnostico_detalle WHERE id_detalle_diag=:id");$q->execute(['id'=>$_POST['eliminar']]);}
if(isset($_POST['eliminar_por_diagnostico'])){$q=$cn->prepare("DELETE FROM diagnostico_detalle WHERE id_diagnostico=:id");$q->execute(['id'=>$_POST['eliminar_por_diagnostico']]);}
if(isset($_POST['leer'])){
 $sql="SELECT id_detalle_diag,id_diagnostico,componente,estado_componente,hallazgo,accion_recomendada,id_repuesto,cantidad_repuesto,costo_unitario_estimado,costo_linea_estimado,nota_adicional FROM diagnostico_detalle";
 $p=[];if(!empty($_POST['id_diagnostico'])){$sql.=" WHERE id_diagnostico=:id_diagnostico";$p['id_diagnostico']=$_POST['id_diagnostico'];}
 $sql.=" ORDER BY id_detalle_diag DESC";$q=$cn->prepare($sql);$q->execute($p);
 echo $q->rowCount()?json_encode($q->fetchAll(PDO::FETCH_OBJ)):'0';
}
if(isset($_POST['leer_id'])){
 $q=$cn->prepare("SELECT id_detalle_diag,id_diagnostico,componente,estado_componente,hallazgo,accion_recomendada,id_repuesto,cantidad_repuesto,costo_unitario_estimado,costo_linea_estimado,nota_adicional FROM diagnostico_detalle WHERE id_detalle_diag=:id");
 $q->execute(['id'=>$_POST['leer_id']]);echo $q->rowCount()?json_encode($q->fetch(PDO::FETCH_OBJ)):'0';
}
?>
