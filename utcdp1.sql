-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 31-07-2025 a las 03:18:17
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
(3, 'Areguá ', 2, 'ACTIVO'),
(5, 'Itauguá ', 2, 'ACTIVO'),
(6, 'Capiata', 2, 'ACTIVO'),
(7, 'Caacupe', 3, 'ACTIVO');

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
(3, 'Cordillera', 'ACTIVO');

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
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` int(11) NOT NULL,
  `razon_social` varchar(100) NOT NULL,
  `ruc` varchar(50) NOT NULL,
  `direccion` varchar(150) NOT NULL,
  `id_ciudad` int(11) NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL,
  `nombre_apellido` varchar(100) NOT NULL,
  `ruc` varchar(50) NOT NULL,
  `direccion` varchar(150) NOT NULL,
  `id_ciudad` int(11) NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `estado` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `producto_id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `tipo` enum('PRODUCTO','SERVICIO') NOT NULL,
  `estado` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`producto_id`, `nombre`, `descripcion`, `precio`, `tipo`, `estado`) VALUES
(1, 'Producto Demo', 'Registro inicial', 0.00, 'PRODUCTO', 'ACTIVO');

-- --------------------------------------------------------

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `presupuestos_compra`
--
CREATE TABLE `presupuestos_compra` (
  `id_presupuesto` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `total_estimado` decimal(10,2) NOT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'REALIZADO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`compra_id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  ADD PRIMARY KEY (`id_departamento`);

--
-- Indices de la tabla `ebooks`
--
ALTER TABLE `ebooks`
  ADD PRIMARY KEY (`ebook_id`),
  ADD UNIQUE KEY `isbn` (`isbn`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`id_persona`);

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

-- Indices de la tabla `presupuestos_compra`
ALTER TABLE `presupuestos_compra`
  ADD PRIMARY KEY (`id_presupuesto`),
  ADD KEY `id_proveedor` (`id_proveedor`);

-- Indices de la tabla `detalle_presupuesto`
ALTER TABLE `detalle_presupuesto`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_presupuesto` (`id_presupuesto`),
  ADD KEY `id_producto` (`id_producto`);

-- Indices de la tabla `orden_compra`
ALTER TABLE `orden_compra`
  ADD PRIMARY KEY (`id_orden`),
  ADD KEY `id_presupuesto` (`id_presupuesto`),
  ADD KEY `id_proveedor` (`id_proveedor`);

-- Indices de la tabla `detalle_orden_compra`
ALTER TABLE `detalle_orden_compra`
  ADD PRIMARY KEY (`id_orden_detalle`),
  ADD KEY `id_orden` (`id_orden`),
  ADD KEY `id_producto` (`id_producto`);
--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_cliente`);

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
  MODIFY `id_ciudad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `compra_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `departamentos`
--
ALTER TABLE `departamentos`
  MODIFY `id_departamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ebooks`
--
ALTER TABLE `ebooks`
  MODIFY `ebook_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id_persona` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `producto_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT de la tabla `presupuestos_compra`
ALTER TABLE `presupuestos_compra`
  MODIFY `id_presupuesto` int(11) NOT NULL AUTO_INCREMENT;

-- AUTO_INCREMENT de la tabla `detalle_presupuesto`
ALTER TABLE `detalle_presupuesto`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT;
-- AUTO_INCREMENT de la tabla `orden_compra`
ALTER TABLE `orden_compra`
  MODIFY `id_orden` int(11) NOT NULL AUTO_INCREMENT;
-- AUTO_INCREMENT de la tabla `detalle_orden_compra`
ALTER TABLE `detalle_orden_compra`
  MODIFY `id_orden_detalle` int(11) NOT NULL AUTO_INCREMENT;
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
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarioss` (`usuario_id`);

-- Filtros para la tabla `presupuestos_compra`
ALTER TABLE `presupuestos_compra`
  ADD CONSTRAINT `presupuestos_compra_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`);

-- Filtros para la tabla `detalle_presupuesto`
ALTER TABLE `detalle_presupuesto`
  ADD CONSTRAINT `detalle_presupuesto_ibfk_1` FOREIGN KEY (`id_presupuesto`) REFERENCES `presupuestos_compra` (`id_presupuesto`),
  ADD CONSTRAINT `detalle_presupuesto_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`producto_id`);

-- Filtros para la tabla `orden_compra`
ALTER TABLE `orden_compra`
  ADD CONSTRAINT `orden_compra_ibfk_1` FOREIGN KEY (`id_presupuesto`) REFERENCES `presupuestos_compra` (`id_presupuesto`),
  ADD CONSTRAINT `orden_compra_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`);

-- Filtros para la tabla `detalle_orden_compra`
ALTER TABLE `detalle_orden_compra`
  ADD CONSTRAINT `detalle_orden_compra_ibfk_1` FOREIGN KEY (`id_orden`) REFERENCES `orden_compra` (`id_orden`),
  ADD CONSTRAINT `detalle_orden_compra_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`producto_id`);
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
