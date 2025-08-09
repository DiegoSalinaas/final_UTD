<?php
require_once '../conexion/db.php';
$db=new DB();$cn=$db->conectar();
if(isset($_POST['guardar'])){
 $d=json_decode($_POST['guardar'],true);
 $d['costo_total_estimado']=$d['costo_mano_obra_estimado']+$d['costo_repuestos_estimado'];
 $q=$cn->prepare("INSERT INTO diagnostico (id_recepcion,id_detalle_recepcion,nro_diagnostico,fecha_inicio,fecha_fin,estado,tecnico_asignado,prioridad,severidad,descripcion_falla,causa_probable,pruebas_realizadas,resultado_pruebas,tiempo_estimado_horas,costo_mano_obra_estimado,costo_repuestos_estimado,costo_total_estimado,aplica_garantia,observaciones,creado_por) VALUES (:id_recepcion,:id_detalle_recepcion,:nro_diagnostico,:fecha_inicio,:fecha_fin,:estado,:tecnico_asignado,:prioridad,:severidad,:descripcion_falla,:causa_probable,:pruebas_realizadas,:resultado_pruebas,:tiempo_estimado_horas,:costo_mano_obra_estimado,:costo_repuestos_estimado,:costo_total_estimado,:aplica_garantia,:observaciones,:creado_por)");
 $q->execute($d);echo $cn->lastInsertId();
}
if(isset($_POST['actualizar'])){
 $d=json_decode($_POST['actualizar'],true);
 $d['costo_total_estimado']=$d['costo_mano_obra_estimado']+$d['costo_repuestos_estimado'];
 $q=$cn->prepare("UPDATE diagnostico SET id_recepcion=:id_recepcion,id_detalle_recepcion=:id_detalle_recepcion,nro_diagnostico=:nro_diagnostico,fecha_inicio=:fecha_inicio,fecha_fin=:fecha_fin,estado=:estado,tecnico_asignado=:tecnico_asignado,prioridad=:prioridad,severidad=:severidad,descripcion_falla=:descripcion_falla,causa_probable=:causa_probable,pruebas_realizadas=:pruebas_realizadas,resultado_pruebas=:resultado_pruebas,tiempo_estimado_horas=:tiempo_estimado_horas,costo_mano_obra_estimado=:costo_mano_obra_estimado,costo_repuestos_estimado=:costo_repuestos_estimado,costo_total_estimado=:costo_total_estimado,aplica_garantia=:aplica_garantia,observaciones=:observaciones,modificado_por=:modificado_por,modificado_en=NOW() WHERE id_diagnostico=:id_diagnostico");
 $q->execute($d);
}
if(isset($_POST['eliminar'])){$q=$cn->prepare("DELETE FROM diagnostico WHERE id_diagnostico=:id");$q->execute(['id'=>$_POST['eliminar']]);}
if(isset($_POST['leer'])){
 $q=$cn->prepare("SELECT d.id_diagnostico,d.id_recepcion,d.nro_diagnostico,d.fecha_inicio,d.estado FROM diagnostico d ORDER BY d.id_diagnostico DESC");
 $q->execute();echo $q->rowCount()?json_encode($q->fetchAll(PDO::FETCH_OBJ)):'0';
}
if(isset($_POST['leer_id'])){
 $q=$cn->prepare("SELECT id_diagnostico,id_recepcion,id_detalle_recepcion,nro_diagnostico,fecha_inicio,fecha_fin,estado,tecnico_asignado,prioridad,severidad,descripcion_falla,causa_probable,pruebas_realizadas,resultado_pruebas,tiempo_estimado_horas,costo_mano_obra_estimado,costo_repuestos_estimado,costo_total_estimado,aplica_garantia,observaciones FROM diagnostico WHERE id_diagnostico=:id");
 $q->execute(['id'=>$_POST['leer_id']]);echo $q->rowCount()?json_encode($q->fetch(PDO::FETCH_OBJ)):'0';
}
?>
