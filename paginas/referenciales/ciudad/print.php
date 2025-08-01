<?php
require_once '../conexion/db.php'; // Ajusta según tu estructura

$base_datos = new DB();
$db = $base_datos->conectar();

$query = $db->prepare("
    SELECT
        c.id_ciudad,
        c.descripcion,
        d.descripcion AS departamentos,
        c.estado
    FROM ciudad c
    JOIN departamentos d ON d.id_departamento = c.id_departamento
");
$query->execute();
$ciudades = $query->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Ciudades</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="p-4">
    <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="mb-0">📄 Reporte de Ciudades</h3>
            <button class="btn btn-outline-primary" onclick="window.print()">
                🖨️ Imprimir
            </button>
        </div>

        <table class="table table-bordered table-hover table-striped">
            <thead class="table-dark">
                <tr>
                    <th>ID Ciudad</th>
                    <th>Descripción</th>
                    <th>Departamento</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($ciudades as $ciudad): ?>
                <tr>
                    <td><?= htmlspecialchars($ciudad['id_ciudad']) ?></td>
                    <td><?= htmlspecialchars($ciudad['descripcion']) ?></td>
                    <td><?= htmlspecialchars($ciudad['departamentos']) ?></td>
                    <td>
                        <?php
                            $est = strtoupper($ciudad['estado']);
                            $class = 'secondary';
                            if ($est === 'ACTIVO' || $est === 'APROBADO') {
                                $class = 'success';
                            } elseif ($est === 'PENDIENTE') {
                                $class = 'warning text-dark';
                            } elseif ($est === 'INACTIVO' || $est === 'ANULADO') {
                                $class = 'danger';
                            }
                        ?>
                        <span class="badge bg-<?= $class ?>"><?= htmlspecialchars($ciudad['estado']) ?></span>
                    </td>
                </tr>
                <?php endforeach; ?>
                <?php if (count($ciudades) === 0): ?>
                <tr>
                    <td colspan="4" class="text-center text-muted">No se encontraron ciudades.</td>
                </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
