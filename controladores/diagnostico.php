<?php
require_once '../conexion/db.php';
$db=new DB();$cn=$db->conectar();

function actualizarEstadoRecepcion($cn,$id){
 $q=$cn->prepare("SELECT COUNT(*) FROM recepcion_detalle WHERE id_recepcion=:id");
 $q->execute(['id'=>$id]);$total=$q->fetchColumn();
 $q=$cn->prepare("SELECT COUNT(*) FROM diagnostico WHERE id_recepcion=:id");
 $q->execute(['id'=>$id]);$diag=$q->fetchColumn();
 $estado=($total>0 && $total==$diag)?'DIAGNOSTICADO':'PENDIENTE';
 $q=$cn->prepare("UPDATE recepcion SET estado=:e WHERE id_recepcion=:id");
 $q->execute(['e'=>$estado,'id'=>$id]);
}

if(isset($_POST['guardar'])){
 $d=json_decode($_POST['guardar'],true);
 $d['costo_total_estimado']=$d['costo_mano_obra_estimado']+$d['costo_repuestos_estimado'];
 $q=$cn->prepare("INSERT INTO diagnostico (id_recepcion,id_detalle_recepcion,estado,descripcion_falla,tiempo_estimado_horas,costo_mano_obra_estimado,costo_repuestos_estimado,costo_total_estimado,aplica_garantia,observaciones,creado_por) VALUES (:id_recepcion,:id_detalle_recepcion,:estado,:descripcion_falla,:tiempo_estimado_horas,:costo_mano_obra_estimado,:costo_repuestos_estimado,:costo_total_estimado,:aplica_garantia,:observaciones,:creado_por)");
 $q->execute($d);$id=$cn->lastInsertId();actualizarEstadoRecepcion($cn,$d['id_recepcion']);echo $id;
}
if(isset($_POST['actualizar'])){
 $d=json_decode($_POST['actualizar'],true);
 $d['costo_total_estimado']=$d['costo_mano_obra_estimado']+$d['costo_repuestos_estimado'];
 $q=$cn->prepare("UPDATE diagnostico SET id_recepcion=:id_recepcion,id_detalle_recepcion=:id_detalle_recepcion,estado=:estado,descripcion_falla=:descripcion_falla,tiempo_estimado_horas=:tiempo_estimado_horas,costo_mano_obra_estimado=:costo_mano_obra_estimado,costo_repuestos_estimado=:costo_repuestos_estimado,costo_total_estimado=:costo_total_estimado,aplica_garantia=:aplica_garantia,observaciones=:observaciones,modificado_por=:modificado_por,modificado_en=NOW() WHERE id_diagnostico=:id_diagnostico");
 $q->execute($d);actualizarEstadoRecepcion($cn,$d['id_recepcion']);
}
if(isset($_POST['eliminar'])){
 $q=$cn->prepare("SELECT id_recepcion FROM diagnostico WHERE id_diagnostico=:id");
 $q->execute(['id'=>$_POST['eliminar']]);$r=$q->fetch(PDO::FETCH_ASSOC);
 $q=$cn->prepare("DELETE FROM diagnostico WHERE id_diagnostico=:id");
 $q->execute(['id'=>$_POST['eliminar']]);if($r)actualizarEstadoRecepcion($cn,$r['id_recepcion']);
}
if(isset($_POST['leer'])){
 $sql="SELECT d.id_diagnostico,d.id_recepcion,r.nombre_cliente,d.fecha_inicio,d.estado FROM diagnostico d JOIN recepcion r ON d.id_recepcion=r.id_recepcion WHERE 1=1";
 $p=[];
 if(!empty($_POST['buscar'])){$sql.=" AND CONCAT(d.id_diagnostico,d.id_recepcion,r.nombre_cliente,d.fecha_inicio,d.estado) LIKE :buscar";$p['buscar']='%'.$_POST['buscar'].'%';}
 if(!empty($_POST['estado'])){$sql.=" AND d.estado=:estado";$p['estado']=$_POST['estado'];}
 if(!empty($_POST['desde'])){$sql.=" AND DATE(d.fecha_inicio)>=:desde";$p['desde']=$_POST['desde'];}
 if(!empty($_POST['hasta'])){$sql.=" AND DATE(d.fecha_inicio)<=:hasta";$p['hasta']=$_POST['hasta'];}
 $sql.=" ORDER BY d.id_diagnostico DESC";
 $q=$cn->prepare($sql);
 $q->execute($p);echo $q->rowCount()?json_encode($q->fetchAll(PDO::FETCH_OBJ)):'0';
}
if(isset($_POST['leer_id'])){
 $q=$cn->prepare("SELECT id_diagnostico,id_recepcion,id_detalle_recepcion,fecha_inicio,fecha_fin,estado,tecnico_asignado,prioridad,severidad,descripcion_falla,causa_probable,pruebas_realizadas,resultado_pruebas,tiempo_estimado_horas,costo_mano_obra_estimado,costo_repuestos_estimado,costo_total_estimado,aplica_garantia,observaciones FROM diagnostico WHERE id_diagnostico=:id");
 $q->execute(['id'=>$_POST['leer_id']]);echo $q->rowCount()?json_encode($q->fetch(PDO::FETCH_OBJ)):'0';
}
?>
