<?php
require_once '../conexion/db.php';

$base_datos = new DB();
$db = $base_datos->conectar();

$query = $db->prepare("SELECT id_conductor, nombre, cedula, telefono, licencia_conduccion, estado FROM conductor");
$query->execute();
$conductores = $query->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Conductores</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="p-4">
    <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="mb-0">🚗 Reporte de Conductores</h3>
            <button class="btn btn-outline-primary" onclick="window.print()">🖨️ Imprimir</button>
        </div>
        <table class="table table-bordered table-hover table-striped">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Cédula</th>
                    <th>Teléfono</th>
                    <th>Licencia</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($conductores as $c): ?>
                <tr>
                    <td><?= htmlspecialchars($c['id_conductor']) ?></td>
                    <td><?= htmlspecialchars($c['nombre']) ?></td>
                    <td><?= htmlspecialchars($c['cedula']) ?></td>
                    <td><?= htmlspecialchars($c['telefono']) ?></td>
                    <td><?= htmlspecialchars($c['licencia_conduccion']) ?></td>
                    <td>
                        <?php
                            $est = strtoupper($c['estado']);
                            $class = 'secondary';
                            if ($est === 'ACTIVO' || $est === 'APROBADO') { $class = 'success'; }
                            elseif ($est === 'PENDIENTE') { $class = 'warning text-dark'; }
                            elseif ($est === 'INACTIVO' || $est === 'ANULADO') { $class = 'danger'; }
                        ?>
                        <span class="badge bg-<?= $class ?>"><?= htmlspecialchars($c['estado']) ?></span>
                    </td>
                </tr>
                <?php endforeach; ?>
                <?php if (count($conductores) === 0): ?>
                <tr>
                    <td colspan="6" class="text-center text-muted">No se encontraron conductores.</td>
                </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
