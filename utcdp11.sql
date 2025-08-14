-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-08-2025 a las 03:19:47
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `utcdp1`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `categoria_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `activa` tinyint(1) DEFAULT 1,
  `fecha_creacion` date NOT NULL,
  `orden` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`categoria_id`, `nombre`, `descripcion`, `activa`, `fecha_creacion`, `orden`) VALUES
(1, 'categoria 1', 'cualquier cosa', 1, '2025-07-11', 3),
(3, 'categoria 3', 'prueba 6', 0, '2025-07-14', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudad`
--

CREATE TABLE `ciudad` (
  `id_ciudad` int(11) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `id_departamento` int(11) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciudad`
--

INSERT INTO `ciudad` (`id_ciudad`, `descripcion`, `id_departamento`, `estado`) VALUES
(6, 'Capiatá', 2, 'ACTIVO'),
(7, 'Concepción', 4, 'ACTIVO'),
(8, 'San Pedro', 5, 'ACTIVO'),
(9, 'Villarrica', 6, 'ACTIVO'),
(10, 'Coronel Oviedo', 7, 'ACTIVO'),
(11, 'Caazapá', 8, 'ACTIVO'),
(12, 'Encarnación', 9, 'ACTIVO'),
(13, 'San Juan Bautista', 10, 'ACTIVO'),
(14, 'Paraguarí', 11, 'ACTIVO'),
(15, 'Ciudad del Este', 12, 'ACTIVO'),
(16, 'Pilar', 13, 'ACTIVO'),
(17, 'Pedro Juan Caballero', 14, 'ACTIVO'),
(18, 'Salto del Guairá', 15, 'ACTIVO'),
(19, 'Villa Hayes', 16, 'ACTIVO'),
(20, 'Filadelfia', 17, 'ACTIVO'),
(21, 'Fuerte Olimpo', 18, 'ACTIVO'),
(22, 'Itauguá', 2, 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre_apellido` varchar(100) NOT NULL,
  `ruc` varchar(20) NOT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `id_ciudad` int(11) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `estado` varchar(10) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre_apellido`, `ruc`, `direccion`, `id_ciudad`, `telefono`, `estado`) VALUES
(1, 'Diego Salinas', '8584584-5', 'San Pablo', 22, '0982473273', 'ACTIVO'),
(2, 'Luis Guzman', '4844848', 'Sajonia', 8, '0985224322', 'INACTIVO'),
(3, 'Ana Gómez', '5823451-7', 'Recoleta ', 13, '0981123456', 'ACTIVO'),
(4, 'Carlos Pereira', '4567890-2', 'Barrio Hipódromo ', 14, '0974555123', 'ACTIVO'),
(5, 'Sofía Fernández', '7896541-9', 'Mburicaó', 7, '0981998877', 'INACTIVO'),
(6, 'Ricardo López', '3214568-6', 'Madame Lynch ', 9, '0983456789', 'ACTIVO'),
(7, 'María Duarte', '6547891-3', 'San Pablo', 15, '0985123678', 'ACTIVO'),
(8, 'Juan Benítez', '1122334-5', 'Villamorra', 16, '0987654321', 'ACTIVO'),
(9, 'Lucía Martínez', '9988776-2', 'General Díaz', 6, '0984223355', 'INACTIVO'),
(11, 'Laura Rivas', '5544332-4', 'Nazareth', 10, '0971777888', 'ACTIVO'),
(12, 'Miguel Vera', '7788990-8', 'Barrio San Blas', 12, '0986111222', 'ACTIVO'),
(21, 'Mario Espinola', '4865734-8', 'calle san alberto', 16, '0985734832', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `compra_id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `metodo_pago` enum('Tarjeta','PayPal','Transferencia') NOT NULL,
  `estado` enum('pendiente','pagado','cancelado') DEFAULT 'pendiente',
  `referencia` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`compra_id`, `usuario_id`, `fecha`, `total`, `metodo_pago`, `estado`, `referencia`) VALUES
(1, 1, '2025-07-10 20:54:00', 122222.00, 'PayPal', 'pendiente', 'alguna referencia'),
(6, 1, '2025-07-04 19:46:00', 433.00, 'Tarjeta', 'cancelado', 'cancelado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conductor`
--

CREATE TABLE `conductor` (
  `id_conductor` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `licencia_conduccion` varchar(50) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `conductor`
--

INSERT INTO `conductor` (`id_conductor`, `nombre`, `cedula`, `telefono`, `licencia_conduccion`, `estado`) VALUES
(1, 'Juan Perez', '34332344', '4444334', 'B superior', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamentos`
--

CREATE TABLE `departamentos` (
  `id_departamento` int(11) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `departamentos`
--

INSERT INTO `departamentos` (`id_departamento`, `descripcion`, `estado`) VALUES
(2, 'Central', 'ACTIVO'),
(3, 'Cordillera', 'ACTIVO'),
(4, 'Concepción', 'ACTIVO'),
(5, 'San Pedro', 'ACTIVO'),
(6, 'Guairá', 'ACTIVO'),
(7, 'Caaguazú', 'ACTIVO'),
(8, 'Caazapá', 'ACTIVO'),
(9, 'Itapúa', 'ACTIVO'),
(10, 'Misiones', 'ACTIVO'),
(11, 'Paraguarí', 'ACTIVO'),
(12, 'Alto Paraná', 'ACTIVO'),
(13, 'Ñeembucú', 'ACTIVO'),
(14, 'Amambay', 'ACTIVO'),
(15, 'Canindeyú', 'ACTIVO'),
(16, 'Presidente Hayes', 'ACTIVO'),
(17, 'Boquerón', 'ACTIVO'),
(18, 'Alto Paraguay', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_nota_credito`
--

CREATE TABLE `detalle_nota_credito` (
  `id_detalle` int(11) NOT NULL,
  `id_nota_credito` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `total_linea` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_nota_credito`
--

INSERT INTO `detalle_nota_credito` (`id_detalle`, `id_nota_credito`, `id_producto`, `descripcion`, `cantidad`, `precio_unitario`, `subtotal`, `total_linea`) VALUES
(12, 10, 13, 'Actualización de Drivers', 4, 44444.00, 177776.00, 177776.00),
(13, 11, 13, 'Actualización de Drivers', 55, 676777.00, 37222735.00, 37222735.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_orden_compra`
--

CREATE TABLE `detalle_orden_compra` (
  `id_orden_detalle` int(11) NOT NULL,
  `id_orden` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_orden_compra`
--

INSERT INTO `detalle_orden_compra` (`id_orden_detalle`, `id_orden`, `id_producto`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(40, 19, 13, 129, 12200.00, 1573800.00),
(41, 20, 12, 2, 12222.00, 24444.00),
(42, 20, 20, 2, 33.00, 66.00),
(45, 21, 12, 2, 222200.00, 444400.00),
(46, 21, 17, 2, 99999999.99, 99999999.99);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_presupuesto`
--

CREATE TABLE `detalle_presupuesto` (
  `id_detalle` int(11) NOT NULL,
  `id_presupuesto` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_presupuesto`
--

INSERT INTO `detalle_presupuesto` (`id_detalle`, `id_presupuesto`, `id_producto`, `cantidad`, `precio_unitario`, `subtotal`) VALUES
(58, 38, 13, 129, 122.00, 15738.00),
(59, 39, 12, 2, 122.22, 244.44),
(60, 40, 12, 2, 22.22, 44.44),
(61, 41, 13, 11, 2323223.00, 25555453.00),
(62, 42, 10, 2, 33333333.00, 66666666.00),
(63, 43, 10, 2, 125000.00, 250000.00),
(64, 43, 13, 2, 33333.00, 66666.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_remision`
--

CREATE TABLE `detalle_remision` (
  `id_detalle_remision` int(11) NOT NULL,
  `id_remision` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` decimal(12,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_remision`
--

INSERT INTO `detalle_remision` (`id_detalle_remision`, `id_remision`, `id_producto`, `cantidad`) VALUES
(1, 1, 11, 4.00),
(2, 2, 17, 5.00),
(3, 3, 8, 3.00),
(4, 4, 6, 5.00),
(5, 5, 9, 1.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diagnostico`
--

CREATE TABLE `diagnostico` (
  `id_diagnostico` int(11) NOT NULL,
  `id_recepcion` int(11) NOT NULL,
  `id_detalle_recepcion` int(11) DEFAULT NULL,
  `nro_diagnostico` varchar(30) DEFAULT NULL,
  `fecha_inicio` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_fin` datetime DEFAULT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'PENDIENTE',
  `tecnico_asignado` int(11) DEFAULT NULL,
  `prioridad` varchar(10) NOT NULL DEFAULT 'MEDIA',
  `severidad` varchar(10) NOT NULL DEFAULT 'MEDIA',
  `descripcion_falla` text NOT NULL,
  `causa_probable` text DEFAULT NULL,
  `pruebas_realizadas` text DEFAULT NULL,
  `resultado_pruebas` text DEFAULT NULL,
  `tiempo_estimado_horas` decimal(10,2) NOT NULL DEFAULT 0.00,
  `costo_mano_obra_estimado` decimal(14,2) NOT NULL DEFAULT 0.00,
  `costo_repuestos_estimado` decimal(14,2) NOT NULL DEFAULT 0.00,
  `costo_total_estimado` decimal(14,2) NOT NULL DEFAULT 0.00,
  `aplica_garantia` tinyint(1) NOT NULL DEFAULT 0,
  `observaciones` text DEFAULT NULL,
  `creado_por` int(11) NOT NULL,
  `creado_en` datetime NOT NULL DEFAULT current_timestamp(),
  `modificado_por` int(11) DEFAULT NULL,
  `modificado_en` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `diagnostico`
--

INSERT INTO `diagnostico` (`id_diagnostico`, `id_recepcion`, `id_detalle_recepcion`, `nro_diagnostico`, `fecha_inicio`, `fecha_fin`, `estado`, `tecnico_asignado`, `prioridad`, `severidad`, `descripcion_falla`, `causa_probable`, `pruebas_realizadas`, `resultado_pruebas`, `tiempo_estimado_horas`, `costo_mano_obra_estimado`, `costo_repuestos_estimado`, `costo_total_estimado`, `aplica_garantia`, `observaciones`, `creado_por`, `creado_en`, `modificado_por`, `modificado_en`) VALUES
(1, 14, 17, NULL, '2025-08-13 16:32:45', NULL, 'APROBADO', NULL, 'MEDIA', 'MEDIA', '44', NULL, NULL, NULL, 44.00, 444.00, 444.00, 888.00, 1, '444', 1, '2025-08-13 16:32:45', 1, '2025-08-13 16:34:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diagnostico_detalle`
--

CREATE TABLE `diagnostico_detalle` (
  `id_detalle_diag` int(11) NOT NULL,
  `id_diagnostico` int(11) NOT NULL,
  `componente` varchar(120) NOT NULL,
  `estado_componente` varchar(20) NOT NULL DEFAULT 'OK',
  `hallazgo` text NOT NULL,
  `accion_recomendada` text NOT NULL,
  `id_repuesto` int(11) DEFAULT NULL,
  `cantidad_repuesto` decimal(12,2) NOT NULL DEFAULT 0.00,
  `costo_unitario_estimado` decimal(14,2) NOT NULL DEFAULT 0.00,
  `costo_linea_estimado` decimal(14,2) NOT NULL DEFAULT 0.00,
  `nota_adicional` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `diagnostico_detalle`
--

INSERT INTO `diagnostico_detalle` (`id_detalle_diag`, `id_diagnostico`, `componente`, `estado_componente`, `hallazgo`, `accion_recomendada`, `id_repuesto`, `cantidad_repuesto`, `costo_unitario_estimado`, `costo_linea_estimado`, `nota_adicional`) VALUES
(5, 1, 'FFF', 'FALLA', 'FFF', 'FFF', NULL, 0.00, 0.00, 0.00, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ebooks`
--

CREATE TABLE `ebooks` (
  `ebook_id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `autor` varchar(150) NOT NULL,
  `isbn` varchar(20) DEFAULT NULL,
  `formato` enum('PDF','EPUB','MOBI') NOT NULL,
  `precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ebooks`
--

INSERT INTO `ebooks` (`ebook_id`, `titulo`, `autor`, `isbn`, `formato`, `precio`) VALUES
(1, 'LIBRO 1', 'AAAAA', '1213232', 'PDF', 120000.00),
(6, 'Libro 2', 'autor1', '1222332', 'PDF', 8766.00),
(7, 'libro 3', 'DDDD', '2342443', 'EPUB', 99999999.99);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `motivo_item_nota_credito`
--

CREATE TABLE `motivo_item_nota_credito` (
  `id_motivo_item` int(11) NOT NULL,
  `id_detalle` int(11) NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `observacion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `motivo_item_nota_credito`
--

INSERT INTO `motivo_item_nota_credito` (`id_motivo_item`, `id_detalle`, `motivo`, `observacion`) VALUES
(12, 12, '444', ''),
(13, 13, 'lkjlk', 'uyu');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nota_credito`
--

CREATE TABLE `nota_credito` (
  `id_nota_credito` int(11) NOT NULL,
  `fecha_emision` date NOT NULL,
  `numero_nota` varchar(20) NOT NULL,
  `motivo_general` varchar(255) DEFAULT NULL,
  `referencia_tipo` varchar(50) DEFAULT NULL,
  `referencia_id` int(11) DEFAULT NULL,
  `id_cliente` int(11) NOT NULL,
  `ruc_cliente` varchar(20) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'ACTIVO',
  `total` decimal(12,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `nota_credito`
--

INSERT INTO `nota_credito` (`id_nota_credito`, `fecha_emision`, `numero_nota`, `motivo_general`, `referencia_tipo`, `referencia_id`, `id_cliente`, `ruc_cliente`, `estado`, `total`) VALUES
(10, '2025-08-11', 'NC-0010', 'ggg', NULL, NULL, 5, '7896541-9', 'ANULADO', 177776.00),
(11, '2025-08-12', 'NC-0011', 'loco', NULL, NULL, 3, '5823451-7', 'ACTIVO', 37222735.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_compra`
--

CREATE TABLE `orden_compra` (
  `id_orden` int(11) NOT NULL,
  `fecha_emision` date NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'EMITIDO',
  `id_presupuesto` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `orden_compra`
--

INSERT INTO `orden_compra` (`id_orden`, `fecha_emision`, `estado`, `id_presupuesto`, `id_proveedor`) VALUES
(19, '2025-08-10', 'ANULADO', 38, 2),
(20, '2025-08-11', 'EMITIDO', 39, 3),
(21, '2025-08-11', 'EMITIDO', 40, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `id_persona` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cedula` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `ciudad` varchar(50) NOT NULL,
  `color` varchar(50) NOT NULL,
  `foto` varchar(100) NOT NULL,
  `contrasena` varchar(20) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`id_persona`, `nombre`, `cedula`, `fecha`, `ciudad`, `color`, `foto`, `contrasena`, `estado`) VALUES
(7, 'diego salinas', 12334, '2025-06-24', 'itaugua', '#d71d1d', 'C:\\fakepath\\Clase 2 - Sistemas y OODA.docx', '12344444', 'ACTIVO'),
(8, 'luis', 123454, '2025-07-08', 'capiata', '#000000', 'C:\\fakepath\\Clase 2 - Origen Concepto Diego Cantero.docx', '123', 'ACTIVO'),
(9, 'marcos', 123, '2025-07-03', 'asuncion', '#d95e5e', 'C:\\fakepath\\Clase 2 - Origen Concepto Diego Cantero.docx', '123', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `presupuestos_compra`
--

CREATE TABLE `presupuestos_compra` (
  `id_presupuesto` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `total_estimado` decimal(10,2) NOT NULL,
  `validez` int(11) NOT NULL,
  `estado` varchar(20) NOT NULL COMMENT '''PENDIENTE'''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `presupuestos_compra`
--

INSERT INTO `presupuestos_compra` (`id_presupuesto`, `fecha`, `id_proveedor`, `total_estimado`, `validez`, `estado`) VALUES
(38, '2025-08-10', 2, 15738.00, 0, 'APROBADO'),
(39, '2025-08-11', 3, 244.44, 0, 'APROBADO'),
(40, '2025-08-11', 3, 44.44, 0, 'APROBADO'),
(41, '2025-08-12', 4, 25555453.00, 0, 'PENDIENTE'),
(42, '2025-08-12', 4, 66666666.00, 0, 'PENDIENTE'),
(43, '2025-08-13', 3, 316666.00, 30, 'PENDIENTE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `codigo_barra` varchar(30) NOT NULL,
  `fecha_alta` date NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_producto`, `nombre`, `descripcion`, `precio`, `stock`, `categoria`, `marca`, `codigo_barra`, `fecha_alta`, `estado`) VALUES
(1, 'AURICULAR', 'AURICULAR CON CABLE', 2212.00, 15, 'AURICULAR', 'JBL', '232', '2025-07-09', 'ACTIVO'),
(3, 'notebook', 'hdshh', 21212.00, 11, 'nose', 'note', '122', '2025-07-01', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `producto_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` int(11) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`producto_id`, `nombre`, `descripcion`, `precio`, `tipo`, `estado`) VALUES
(4, 'Mouse Logitech M280', 'Mouse inalámbrico ergonómico', 120000, 'PRODUCTO', 'ACTIVO'),
(5, 'Teclado Redragon', 'Teclado mecánico retroiluminado', 250000, 'PRODUCTO', 'ACTIVO'),
(6, 'SSD Kingston 480GB', 'Disco sólido SATA 3.0', 350000, 'PRODUCTO', 'ACTIVO'),
(8, 'Instalación de SO', 'Formateo e instalación de sistema', 150000, 'SERVICIO', 'INACTIVO'),
(9, 'Monitor Samsung 24\"', 'Monitor LED Full HD 24\"', 850000, 'PRODUCTO', 'ACTIVO'),
(10, 'Limpieza de Notebook', 'Limpieza profunda de notebook', 120000, 'SERVICIO', 'INACTIVO'),
(11, 'RAM 8GB DDR4', 'Memoria DDR4 2666MHz', 230000, 'PRODUCTO', 'INACTIVO'),
(12, 'Fuente EVGA 500W', 'Fuente de poder certificada', 300000, 'PRODUCTO', 'ACTIVO'),
(13, 'Actualización de Drivers', 'Instalación de drivers actualizados', 80000, 'SERVICIO', 'INACTIVO'),
(14, 'Gabinete Gamer Aerocool', 'Gabinete con luces RGB y buen flujo de aire', 400000, 'PRODUCTO', 'ACTIVO'),
(15, 'Disco Duro WD 1TB', 'Disco duro mecánico SATA 1TB', 280000, 'PRODUCTO', 'ACTIVO'),
(16, 'Placa Madre ASUS B450', 'Motherboard compatible con Ryzen', 550000, 'PRODUCTO', 'ACTIVO'),
(17, 'Mousepad Redragon XL', 'Alfombrilla gamer tamaño extendido', 70000, 'PRODUCTO', 'ACTIVO'),
(18, 'Auriculares Logitech G432', 'Auriculares con sonido envolvente 7.1', 480000, 'PRODUCTO', 'ACTIVO'),
(19, 'Webcam Logitech C920', 'Cámara HD para videollamadas', 420000, 'PRODUCTO', 'ACTIVO'),
(20, 'Armado de PC', 'Ensamblaje completo de componentes de PC', 100000, 'SERVICIO', 'INACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` int(11) NOT NULL,
  `razon_social` varchar(100) NOT NULL,
  `ruc` varchar(50) NOT NULL,
  `direccion` varchar(150) NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `id_ciudad` int(11) NOT NULL,
  `estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`id_proveedor`, `razon_social`, `ruc`, `direccion`, `telefono`, `id_ciudad`, `estado`) VALUES
(2, 'Carlos Galeano', '4949444-6', 'Barrio Villa Aurelia', '0983245633', 12, 'ACTIVO'),
(3, 'Luis Guzman', '494944-5', 'barrio Santa Ana', '0984327549', 6, 'ACTIVO'),
(4, 'Marcos Gonzalez', '7655434-4', 'Barrio Las Mercedes', '0982674854', 7, 'ACTIVO'),
(5, 'Diego Salinas', '4384328-2', 'Barrio 6 de enero', '0982483292', 22, 'INACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntos`
--

CREATE TABLE `puntos` (
  `id_punto` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `direccion` varchar(200) NOT NULL,
  `id_ciudad` int(11) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `puntos`
--

INSERT INTO `puntos` (`id_punto`, `nombre`, `direccion`, `id_ciudad`, `estado`) VALUES
(1, 'punto artigas', 'calle artigas 123', 12, 'INACTIVO'),
(2, 'punto avelino', 'avelino martinez 123', 14, 'ACTIVO'),
(3, 'loma pyta', 'loma pyta 1234', 11, 'ACTIVO'),
(4, 'coronel martinez', 'bernardino caballero y loma plata', 20, 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recepcion`
--

CREATE TABLE `recepcion` (
  `id_recepcion` int(11) NOT NULL,
  `fecha_recepcion` date NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `nombre_cliente` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `estado` varchar(20) NOT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recepcion`
--

INSERT INTO `recepcion` (`id_recepcion`, `fecha_recepcion`, `id_cliente`, `nombre_cliente`, `telefono`, `direccion`, `estado`, `observaciones`) VALUES
(5, '2025-08-11', 9, 'Lucía Martínez', '0984223355', 'General Díaz', 'CERRADA', 'fdf'),
(6, '2025-08-11', 4, 'Carlos Pereira', '0974555123', 'Barrio Hipódromo ', 'CERRADA', 'fd'),
(7, '2025-08-11', 7, 'María Duarte', '0985123678', 'San Pablo', 'CERRADA', 'fff'),
(8, '2025-08-11', 1, 'Diego Salinas', '0982473273', 'San Pablo', 'CERRADA', 'jjjj'),
(9, '2025-08-11', 8, 'Juan Benítez', '0987654321', 'Villamorra', 'DIAGNOSTICADO', ''),
(10, '2025-08-12', 9, 'Lucía Martínez', '0984223355', 'General Díaz', 'CERRADA', 'tttt'),
(11, '2025-08-13', 8, 'Juan Benítez', '0987654321', 'Villamorra', 'PENDIENTE', ''),
(12, '2025-08-13', 7, 'María Duarte', '0985123678', 'San Pablo', 'PENDIENTE', 'vfdf'),
(13, '2025-08-13', 11, 'Laura Rivas', '0971777888', 'Nazareth', 'PENDIENTE', ''),
(14, '2025-08-13', 9, 'Lucía Martínez', '0984223355', 'General Díaz', 'DIAGNOSTICADO', 'dd');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recepcion_detalle`
--

CREATE TABLE `recepcion_detalle` (
  `id_detalle` int(11) NOT NULL,
  `id_recepcion` int(11) NOT NULL,
  `nombre_equipo` varchar(100) NOT NULL,
  `marca` varchar(50) DEFAULT NULL,
  `modelo` varchar(50) DEFAULT NULL,
  `numero_serie` varchar(100) DEFAULT NULL,
  `falla_reportada` text DEFAULT NULL,
  `accesorios_entregados` text DEFAULT NULL,
  `diagnostico_preliminar` text DEFAULT NULL,
  `estado_equipo` varchar(20) DEFAULT NULL,
  `observaciones_detalle` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `recepcion_detalle`
--

INSERT INTO `recepcion_detalle` (`id_detalle`, `id_recepcion`, `nombre_equipo`, `marca`, `modelo`, `numero_serie`, `falla_reportada`, `accesorios_entregados`, `diagnostico_preliminar`, `estado_equipo`, `observaciones_detalle`) VALUES
(7, 6, 'equipo 1', 'ffdf', 'ffff', '222', 'ffff', 'fff', 'fff', NULL, 'gg'),
(8, 6, 'equipo 2', 'ssa', 'fff', '233', 'ddd', 'ggg', 'ggg', NULL, 'gg'),
(9, 7, 'fff', 'ffff', 'fff', 'fff', 'ff', 'ff', 'ff', NULL, 'rr'),
(10, 8, 'fff', 'ddd', 'ddd', 'ffffq', 'fff', '', 'gg', NULL, 'ffff'),
(11, 9, 'ddd', 'ddd', 'ddd', 'ddd', 'ddd', 'ddd', 'ddd', NULL, 'ddd'),
(12, 10, 'ttt', 'ttt', 'ttt', 'ttt', 'ttt', '', 'ttt', NULL, 'ttt'),
(13, 11, '333333', 'eerr', 'rrr', 'tttt', 'ttt', '', 'dfff', NULL, 'ggg'),
(14, 12, 'sdf', 'sd', 'v', '465757', 'gbfb', 'vbdb', 'sdfsdf', NULL, 'bbd'),
(15, 13, 'sss', 'sdddd', 'dddd', 'ddd', 'www', 'ddd, fff', 'ddd', NULL, 'dfd'),
(16, 13, 'edds', 'ddd', 'sddd', 'ddd', 'www', '', 'fff', NULL, 'ddd'),
(17, 14, 'ddd', 'dd', 'ddd', 'dd', 'dd', 'dd, ddddd', 'ddd', NULL, 'dddd');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `remision`
--

CREATE TABLE `remision` (
  `id_remision` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `fecha_remision` date NOT NULL,
  `observacion` text DEFAULT NULL,
  `estado` varchar(20) NOT NULL,
  `id_conductor` int(11) NOT NULL,
  `movil` varchar(50) NOT NULL,
  `id_punto_salida` int(11) NOT NULL,
  `id_punto_llegada` int(11) NOT NULL,
  `tipo_transporte` enum('TERRESTRE','AEREO','MARITIMO') NOT NULL DEFAULT 'TERRESTRE',
  `factura_relacionada` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `remision`
--

INSERT INTO `remision` (`id_remision`, `id_cliente`, `fecha_remision`, `observacion`, `estado`, `id_conductor`, `movil`, `id_punto_salida`, `id_punto_llegada`, `tipo_transporte`, `factura_relacionada`) VALUES
(1, 8, '2025-08-13', '', 'EMITIDO', 1, 'eee', 1, 2, 'TERRESTRE', '3334'),
(2, 8, '2025-08-13', '', 'ANULADO', 1, 'dds', 1, 3, 'AEREO', '232'),
(3, 9, '2025-08-13', '', 'EMITIDO', 1, '323', 2, 3, 'AEREO', '3233'),
(4, 2, '2025-08-13', '', 'EMITIDO', 1, '34', 2, 3, 'AEREO', '344'),
(5, 8, '2025-08-14', '', 'EMITIDO', 1, 'dddd', 2, 4, 'TERRESTRE', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resenas`
--

CREATE TABLE `resenas` (
  `resena_id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `ebook_id` int(11) DEFAULT NULL,
  `puntuacion` int(11) DEFAULT NULL CHECK (`puntuacion` between 1 and 5),
  `comentario` text DEFAULT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resenas`
--

INSERT INTO `resenas` (`resena_id`, `usuario_id`, `ebook_id`, `puntuacion`, `comentario`, `fecha`) VALUES
(5, 4, 1, 3, 'Prueba', '2025-07-11'),
(6, 1, 1, 5, 'sin comentarios', '2025-07-11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `pass` varchar(100) NOT NULL,
  `nombre_apellido` varchar(100) NOT NULL,
  `rol` varchar(20) NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `usuario`, `pass`, `nombre_apellido`, `rol`, `estado`) VALUES
(1, 'diego', '202cb962ac59075b964b07152d234b70', 'Diego Salinas', 'comerciante', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarioss`
--

CREATE TABLE `usuarioss` (
  `usuario_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `fecha_registro` date NOT NULL,
  `tipo_usuario` enum('admin','empleado','cliente') DEFAULT 'cliente',
  `estado` enum('activo','inactivo') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarioss`
--

INSERT INTO `usuarioss` (`usuario_id`, `nombre`, `email`, `fecha_registro`, `tipo_usuario`, `estado`) VALUES
(1, 'Luis Guzman', 'LuisGuzman@gmail.com', '2025-07-11', 'cliente', 'inactivo'),
(4, 'Diego Salinas', 'diegosalinas@gmail.com', '2025-07-11', 'admin', 'activo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`categoria_id`);

--
-- Indices de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD PRIMARY KEY (`id_ciudad`),
  ADD KEY `id_departamento` (`id_departamento`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `ruc_unico` (`ruc`),
  ADD KEY `id_ciudad` (`id_ciudad`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`compra_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `conductor`
--
ALTER TABLE `conductor`
  ADD PRIMARY KEY (`id_conductor`);

--
-- Indices de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id_departamento`);

--
-- Indices de la tabla `detalle_nota_credito`
--
ALTER TABLE `detalle_nota_credito`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_nota_credito` (`id_nota_credito`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `detalle_orden_compra`
--
ALTER TABLE `detalle_orden_compra`
  ADD PRIMARY KEY (`id_orden_detalle`),
  ADD KEY `id_orden` (`id_orden`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `detalle_presupuesto`
--
ALTER TABLE `detalle_presupuesto`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_presupuesto` (`id_presupuesto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `detalle_remision`
--
ALTER TABLE `detalle_remision`
  ADD PRIMARY KEY (`id_detalle_remision`),
  ADD KEY `idx_det_remision` (`id_remision`),
  ADD KEY `idx_det_producto` (`id_producto`);

--
-- Indices de la tabla `diagnostico`
--
ALTER TABLE `diagnostico`
  ADD PRIMARY KEY (`id_diagnostico`),
  ADD UNIQUE KEY `nro_diagnostico` (`nro_diagnostico`),
  ADD KEY `idx_diag_recepcion` (`id_recepcion`),
  ADD KEY `idx_diag_detalle` (`id_detalle_recepcion`),
  ADD KEY `idx_diag_estado` (`estado`,`prioridad`,`severidad`);

--
-- Indices de la tabla `diagnostico_detalle`
--
ALTER TABLE `diagnostico_detalle`
  ADD PRIMARY KEY (`id_detalle_diag`),
  ADD KEY `idx_det_diag` (`id_diagnostico`);

--
-- Indices de la tabla `ebooks`
--
ALTER TABLE `ebooks`
  ADD PRIMARY KEY (`ebook_id`),
  ADD UNIQUE KEY `isbn` (`isbn`);

--
-- Indices de la tabla `motivo_item_nota_credito`
--
ALTER TABLE `motivo_item_nota_credito`
  ADD PRIMARY KEY (`id_motivo_item`),
  ADD KEY `id_detalle` (`id_detalle`);

--
-- Indices de la tabla `nota_credito`
--
ALTER TABLE `nota_credito`
  ADD PRIMARY KEY (`id_nota_credito`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `orden_compra`
--
ALTER TABLE `orden_compra`
  ADD PRIMARY KEY (`id_orden`),
  ADD KEY `id_presupuesto` (`id_presupuesto`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`id_persona`);

--
-- Indices de la tabla `presupuestos_compra`
--
ALTER TABLE `presupuestos_compra`
  ADD PRIMARY KEY (`id_presupuesto`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`producto_id`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_proveedor`),
  ADD UNIQUE KEY `ruc` (`ruc`);

--
-- Indices de la tabla `puntos`
--
ALTER TABLE `puntos`
  ADD PRIMARY KEY (`id_punto`),
  ADD KEY `id_ciudad` (`id_ciudad`);

--
-- Indices de la tabla `recepcion`
--
ALTER TABLE `recepcion`
  ADD PRIMARY KEY (`id_recepcion`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `recepcion_detalle`
--
ALTER TABLE `recepcion_detalle`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_recepcion` (`id_recepcion`);

--
-- Indices de la tabla `remision`
--
ALTER TABLE `remision`
  ADD PRIMARY KEY (`id_remision`),
  ADD KEY `idx_remision_cliente` (`id_cliente`),
  ADD KEY `idx_remision_conductor` (`id_conductor`),
  ADD KEY `idx_remision_salida` (`id_punto_salida`),
  ADD KEY `idx_remision_llegada` (`id_punto_llegada`);

--
-- Indices de la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD PRIMARY KEY (`resena_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `ebook_id` (`ebook_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `usuarioss`
--
ALTER TABLE `usuarioss`
  ADD PRIMARY KEY (`usuario_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `categoria_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  MODIFY `id_ciudad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `compra_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `conductor`
--
ALTER TABLE `conductor`
  MODIFY `id_conductor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id_departamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `detalle_nota_credito`
--
ALTER TABLE `detalle_nota_credito`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `detalle_orden_compra`
--
ALTER TABLE `detalle_orden_compra`
  MODIFY `id_orden_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `detalle_presupuesto`
--
ALTER TABLE `detalle_presupuesto`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT de la tabla `detalle_remision`
--
ALTER TABLE `detalle_remision`
  MODIFY `id_detalle_remision` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `diagnostico`
--
ALTER TABLE `diagnostico`
  MODIFY `id_diagnostico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `diagnostico_detalle`
--
ALTER TABLE `diagnostico_detalle`
  MODIFY `id_detalle_diag` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ebooks`
--
ALTER TABLE `ebooks`
  MODIFY `ebook_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `motivo_item_nota_credito`
--
ALTER TABLE `motivo_item_nota_credito`
  MODIFY `id_motivo_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `nota_credito`
--
ALTER TABLE `nota_credito`
  MODIFY `id_nota_credito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `orden_compra`
--
ALTER TABLE `orden_compra`
  MODIFY `id_orden` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id_persona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `presupuestos_compra`
--
ALTER TABLE `presupuestos_compra`
  MODIFY `id_presupuesto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `producto_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `puntos`
--
ALTER TABLE `puntos`
  MODIFY `id_punto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `recepcion`
--
ALTER TABLE `recepcion`
  MODIFY `id_recepcion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `recepcion_detalle`
--
ALTER TABLE `recepcion_detalle`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `remision`
--
ALTER TABLE `remision`
  MODIFY `id_remision` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `resenas`
--
ALTER TABLE `resenas`
  MODIFY `resena_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarioss`
--
ALTER TABLE `usuarioss`
  MODIFY `usuario_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD CONSTRAINT `ciudad_ibfk_1` FOREIGN KEY (`id_departamento`) REFERENCES `departamentos` (`id_departamento`);

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudad` (`id_ciudad`);

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarioss` (`usuario_id`);

--
-- Filtros para la tabla `detalle_nota_credito`
--
ALTER TABLE `detalle_nota_credito`
  ADD CONSTRAINT `detalle_nota_credito_ibfk_1` FOREIGN KEY (`id_nota_credito`) REFERENCES `nota_credito` (`id_nota_credito`),
  ADD CONSTRAINT `detalle_nota_credito_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`producto_id`);

--
-- Filtros para la tabla `detalle_orden_compra`
--
ALTER TABLE `detalle_orden_compra`
  ADD CONSTRAINT `detalle_orden_compra_ibfk_1` FOREIGN KEY (`id_orden`) REFERENCES `orden_compra` (`id_orden`),
  ADD CONSTRAINT `detalle_orden_compra_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`producto_id`);

--
-- Filtros para la tabla `detalle_presupuesto`
--
ALTER TABLE `detalle_presupuesto`
  ADD CONSTRAINT `detalle_presupuesto_ibfk_1` FOREIGN KEY (`id_presupuesto`) REFERENCES `presupuestos_compra` (`id_presupuesto`),
  ADD CONSTRAINT `detalle_presupuesto_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`producto_id`);

--
-- Filtros para la tabla `detalle_remision`
--
ALTER TABLE `detalle_remision`
  ADD CONSTRAINT `fk_det_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`producto_id`),
  ADD CONSTRAINT `fk_det_remision` FOREIGN KEY (`id_remision`) REFERENCES `remision` (`id_remision`) ON DELETE CASCADE;

--
-- Filtros para la tabla `diagnostico`
--
ALTER TABLE `diagnostico`
  ADD CONSTRAINT `fk_diag_detalle_recepcion` FOREIGN KEY (`id_detalle_recepcion`) REFERENCES `recepcion_detalle` (`id_detalle`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_diag_recepcion` FOREIGN KEY (`id_recepcion`) REFERENCES `recepcion` (`id_recepcion`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `diagnostico_detalle`
--
ALTER TABLE `diagnostico_detalle`
  ADD CONSTRAINT `fk_det_diag` FOREIGN KEY (`id_diagnostico`) REFERENCES `diagnostico` (`id_diagnostico`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `motivo_item_nota_credito`
--
ALTER TABLE `motivo_item_nota_credito`
  ADD CONSTRAINT `motivo_item_nota_credito_ibfk_1` FOREIGN KEY (`id_detalle`) REFERENCES `detalle_nota_credito` (`id_detalle`);

--
-- Filtros para la tabla `nota_credito`
--
ALTER TABLE `nota_credito`
  ADD CONSTRAINT `nota_credito_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`);

--
-- Filtros para la tabla `orden_compra`
--
ALTER TABLE `orden_compra`
  ADD CONSTRAINT `orden_compra_ibfk_1` FOREIGN KEY (`id_presupuesto`) REFERENCES `presupuestos_compra` (`id_presupuesto`),
  ADD CONSTRAINT `orden_compra_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`);

--
-- Filtros para la tabla `presupuestos_compra`
--
ALTER TABLE `presupuestos_compra`
  ADD CONSTRAINT `presupuestos_compra_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`);

--
-- Filtros para la tabla `puntos`
--
ALTER TABLE `puntos`
  ADD CONSTRAINT `puntos_ibfk_1` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudad` (`id_ciudad`);

--
-- Filtros para la tabla `recepcion`
--
ALTER TABLE `recepcion`
  ADD CONSTRAINT `recepcion_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`);

--
-- Filtros para la tabla `recepcion_detalle`
--
ALTER TABLE `recepcion_detalle`
  ADD CONSTRAINT `recepcion_detalle_ibfk_1` FOREIGN KEY (`id_recepcion`) REFERENCES `recepcion` (`id_recepcion`);

--
-- Filtros para la tabla `resenas`
--
ALTER TABLE `resenas`
  ADD CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarioss` (`usuario_id`),
  ADD CONSTRAINT `resenas_ibfk_2` FOREIGN KEY (`ebook_id`) REFERENCES `ebooks` (`ebook_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
