
CREATE TABLE rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(150),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE modulo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    ruta VARCHAR(150),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE role_module_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL,
    id_modulo INT NOT NULL,
    has_access BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES rol(id),
    FOREIGN KEY (id_modulo) REFERENCES modulo(id),
    UNIQUE KEY (id_rol, id_modulo)
);


CREATE TABLE departamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(150),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE persona (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_documento ENUM('DNI','RUC','PASAPORTE','OTRO') NOT NULL,
    numero_documento VARCHAR(40) NOT NULL UNIQUE,
    nombres VARCHAR(80) NOT NULL,
    apellido_paterno VARCHAR(80),
    apellido_materno VARCHAR(80),
    correo VARCHAR(120),
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    direccion VARCHAR(150),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    id_rol INT NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_persona) REFERENCES persona(id) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES rol(id)
);


CREATE TABLE logs_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    accion TEXT,
    modulo VARCHAR(100),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);f


CREATE TABLE empleado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    departamento_id INT,
    puesto VARCHAR(100),
    sueldo DECIMAL(10,2),
    fecha_contratacion DATE,
    foto VARCHAR(255),
    cv VARCHAR(255),
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_persona) REFERENCES persona(id),
    FOREIGN KEY (departamento_id) REFERENCES departamento(id)
);


CREATE TABLE cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    tipo ENUM('NATURAL','JURIDICA') DEFAULT 'NATURAL',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_persona) REFERENCES persona(id)
);


CREATE TABLE proveedor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ruc VARCHAR(20) NOT NULL UNIQUE,
    razon_social VARCHAR(150) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(120),
    direccion VARCHAR(150),
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE categoria_producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    sku VARCHAR(50) UNIQUE,
    precio_venta DECIMAL(10,2) NOT NULL,
    precio_compra DECIMAL(10,2),
    stock INT DEFAULT 0,
    stock_minimo INT DEFAULT 10,
    stock_maximo INT DEFAULT 1000,
    unidad_medida ENUM('UNIDAD','CAJA','PAQUETE','KG','LITRO') DEFAULT 'UNIDAD',
    peso_kg DECIMAL(10,3),
    imagen VARCHAR(255),
    categoria_id INT,
    requiere_codigo_barras BOOLEAN DEFAULT TRUE,
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categoria_producto(id),
    INDEX idx_nombre (nombre),
    INDEX idx_sku (sku)
);


CREATE TABLE proveedor_producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_proveedor INT NOT NULL,
    id_producto INT NOT NULL,
    precio_compra DECIMAL(10,2),
    tiempo_entrega_dias INT,
    es_principal BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id),
    UNIQUE KEY (id_proveedor, id_producto)
);

CREATE TABLE codigo_barras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    id_producto INT NOT NULL,
    id_proveedor INT,
    tipo_codigo ENUM('EAN13','EAN8','UPC','CODE128','CODE39','QR','INTERNO') DEFAULT 'EAN13',
    descripcion VARCHAR(200),
    es_principal BOOLEAN DEFAULT FALSE,
    unidades_por_codigo INT DEFAULT 1,
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES producto(id),
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id),
    INDEX idx_codigo (codigo),
    INDEX idx_producto (id_producto),
    INDEX idx_proveedor (id_proveedor)
);


CREATE TABLE almacen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) UNIQUE,
    direccion VARCHAR(200),
    capacidad_m3 DECIMAL(10,2),
    responsable VARCHAR(100),
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    id_almacen INT NOT NULL,
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    stock_maximo INT,
    ubicacion VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES producto(id),
    FOREIGN KEY (id_almacen) REFERENCES almacen(id),
    UNIQUE KEY (id_producto, id_almacen),
    INDEX idx_producto (id_producto),
    INDEX idx_almacen (id_almacen)
);


---falta---
CREATE TABLE movimiento_inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_inventario INT NOT NULL,
    id_producto INT NOT NULL,
    id_almacen INT NOT NULL,
    id_codigo_barras INT,
    tipo_movimiento ENUM('ENTRADA','SALIDA','AJUSTE','DEVOLUCION') NOT NULL,
    cantidad INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    motivo VARCHAR(200),
    metodo_registro ENUM('ESCANER','MANUAL','AUTOMATICO') DEFAULT 'MANUAL',
    id_usuario INT,
    id_compra INT,
    id_venta INT,
    id_devolucion INT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_inventario) REFERENCES inventario(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id),
    FOREIGN KEY (id_almacen) REFERENCES almacen(id),
    FOREIGN KEY (id_codigo_barras) REFERENCES codigo_barras(id),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_compra) REFERENCES compra(id),
    FOREIGN KEY (id_venta) REFERENCES venta(id),
    FOREIGN KEY (id_devolucion) REFERENCES devolucion(id),
    INDEX idx_codigo_barras (id_codigo_barras),
    INDEX idx_fecha (fecha_movimiento),
    INDEX idx_tipo (tipo_movimiento)
);


CREATE TABLE metodo_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(150),
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_usuario INT NOT NULL,
    id_almacen INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2),
    descuento_total DECIMAL(10,2) DEFAULT 0.00,
    igv DECIMAL(10,2),
    total DECIMAL(10,2),
    estado ENUM('PENDIENTE','COMPLETADA','ANULADA') DEFAULT 'PENDIENTE',
    usa_codigo_barras BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_almacen) REFERENCES almacen(id),
    INDEX idx_cliente_fecha (id_cliente, fecha)
);


CREATE TABLE detalle_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    id_codigo_barras INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0.00,
    subtotal DECIMAL(10,2),
    registrado_con_escaner BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_venta) REFERENCES venta(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id),
    FOREIGN KEY (id_codigo_barras) REFERENCES codigo_barras(id)
);


CREATE TABLE compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_proveedor INT NOT NULL,
    id_almacen INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_comprobante ENUM('FACTURA','BOLETA','ORDEN_COMPRA') DEFAULT 'ORDEN_COMPRA',
    numero_comprobante VARCHAR(50),
    subtotal DECIMAL(10,2),
    igv DECIMAL(10,2),
    total DECIMAL(10,2),
    estado ENUM('PENDIENTE','COMPLETADA','ANULADA') DEFAULT 'PENDIENTE',
    usa_codigo_barras BOOLEAN DEFAULT FALSE,
    ruta_documento VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id),
    FOREIGN KEY (id_almacen) REFERENCES almacen(id),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    INDEX idx_proveedor_fecha (id_proveedor, fecha)
);


CREATE TABLE detalle_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT NOT NULL,
    id_producto INT NOT NULL,
    id_codigo_barras INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    registrado_con_escaner BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_compra) REFERENCES compra(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id),
    FOREIGN KEY (id_codigo_barras) REFERENCES codigo_barras(id)
);

CREATE TABLE pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT,
    id_compra INT,
    monto_total DECIMAL(10,2) NOT NULL,
    estado ENUM('PENDIENTE','PROCESANDO','COMPLETADO','FALLIDO','REEMBOLSADO') DEFAULT 'PENDIENTE',
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_venta) REFERENCES venta(id),
    FOREIGN KEY (id_compra) REFERENCES compra(id)
);


CREATE TABLE detalle_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pago INT NOT NULL,
    id_metodo_pago INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    referencia VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pago) REFERENCES pago(id),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago(id)
);


CREATE TABLE comprobante (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    tipo ENUM('BOLETA','FACTURA','NOTA_CREDITO','NOTA_DEBITO') NOT NULL,
    serie VARCHAR(10) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2),
    igv DECIMAL(10,2),
    total DECIMAL(10,2),
    estado ENUM('EMITIDO','ANULADO') DEFAULT 'EMITIDO',
    ruta_pdf VARCHAR(255),
    ruta_xml VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_venta) REFERENCES venta(id),
    UNIQUE KEY (serie, numero)
);


CREATE TABLE pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('PENDIENTE','EN_PROCESO','EN_CAMINO','ENTREGADO','CANCELADO') DEFAULT 'PENDIENTE',
    total DECIMAL(10,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    INDEX idx_cliente_fecha (id_cliente, fecha_pedido)
);


CREATE TABLE detalle_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id)
);


CREATE TABLE devolucion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('VENTA','COMPRA') NOT NULL,
    id_venta INT,
    id_compra INT,
    id_almacen INT NOT NULL,
    fecha_devolucion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    motivo TEXT NOT NULL,
    estado ENUM('SOLICITADA','APROBADA','RECHAZADA','PROCESADA') DEFAULT 'SOLICITADA',
    total_devolucion DECIMAL(10,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_venta) REFERENCES venta(id),
    FOREIGN KEY (id_compra) REFERENCES compra(id),
    FOREIGN KEY (id_almacen) REFERENCES almacen(id)
);


CREATE TABLE detalle_devolucion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_devolucion INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_devolucion) REFERENCES devolucion(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id)
);


CREATE TABLE vehiculo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(20) NOT NULL UNIQUE,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    capacidad_kg DECIMAL(10,2),
    estado ENUM('DISPONIBLE','EN_RUTA','MANTENIMIENTO','INACTIVO') DEFAULT 'DISPONIBLE',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE conductor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_persona INT NOT NULL,
    licencia VARCHAR(20) NOT NULL UNIQUE,
    categoria_licencia VARCHAR(10),
    estado ENUM('ACTIVO','INACTIVO') DEFAULT 'ACTIVO',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_persona) REFERENCES persona(id)
);


CREATE TABLE ruta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    origen VARCHAR(150),
    destino VARCHAR(150),
    distancia_km DECIMAL(10,2),
    tiempo_estimado_horas DECIMAL(5,2),
    costo_base DECIMAL(10,2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE envio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_vehiculo INT,
    id_conductor INT,
    id_ruta INT,
    direccion_envio VARCHAR(200),
    fecha_envio DATE,
    fecha_entrega DATE,
    costo_transporte DECIMAL(10,2),
    estado ENUM('PENDIENTE','EN_RUTA','ENTREGADO','CANCELADO') DEFAULT 'PENDIENTE',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES pedido(id),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id),
    FOREIGN KEY (id_conductor) REFERENCES conductor(id),
    FOREIGN KEY (id_ruta) REFERENCES ruta(id)
);


CREATE TABLE historial_escaneo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_codigo_barras INT,
    codigo_escaneado VARCHAR(50) NOT NULL,
    id_producto INT,
    id_usuario INT NOT NULL,
    tipo_operacion ENUM('ENTRADA','SALIDA','CONSULTA','GENERACION') NOT NULL,
    id_compra INT,
    id_venta INT,
    cantidad INT,
    exitoso BOOLEAN DEFAULT TRUE,
    mensaje VARCHAR(255),
    fecha_escaneo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_codigo_barras) REFERENCES codigo_barras(id),
    FOREIGN KEY (id_producto) REFERENCES producto(id),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id),
    FOREIGN KEY (id_compra) REFERENCES compra(id),
    FOREIGN KEY (id_venta) REFERENCES venta(id),
    INDEX idx_codigo_barras (id_codigo_barras),
    INDEX idx_codigo_escaneado (codigo_escaneado),
    INDEX idx_fecha (fecha_escaneo),
    INDEX idx_usuario (id_usuario)
);


CREATE INDEX idx_venta_cliente_fecha ON venta(id_cliente, fecha);
CREATE INDEX idx_pedido_cliente_fecha ON pedido(id_cliente, fecha_pedido);
CREATE INDEX idx_producto_nombre ON producto(nombre);
CREATE INDEX idx_producto_categoria ON producto(categoria_id);
CREATE INDEX idx_compra_proveedor_fecha ON compra(id_proveedor, fecha);
CREATE INDEX idx_logs_usuario_fecha ON logs_sistema(id_usuario, fecha);
CREATE INDEX idx_movimiento_inventario_fecha ON movimiento_inventario(fecha_movimiento);
CREATE INDEX idx_inventario_producto ON inventario(id_producto);
CREATE INDEX idx_inventario_almacen ON inventario(id_almacen);



-- Insertar datos en la tabla rol
INSERT INTO rol (nombre, descripcion) VALUES
('Administrador', 'Acceso total al sistema'),
('Vendedor', 'Acceso a módulos de ventas y clientes'),
('Almacenero', 'Acceso a gestión de inventario');

-- Insertar datos en la tabla modulo
INSERT INTO modulo (nombre, descripcion, ruta) VALUES
('Dashboard', 'Panel principal del sistema', '/dashboard'),
('Accesos', 'Gestión de usuarios y permisos', '/accesos'),
('Ventas', 'Gestión de ventas y facturación', '/ventas'),
('Inventario', 'Control de stock y productos', '/inventario'),
('Compras', 'Gestión de compras y proveedores', '/compras'),
('Clientes', 'Gestión de clientes', '/clientes'),
('Reportes', 'Reportes y estadísticas', '/reportes'),
('Envios', 'Gestión de envíos y logística', '/envios'),
('Empleados', 'Gestión de empleados', '/empleados'),
('Proveedores', 'Gestión de proveedores', '/proveedores');

-- Insertar datos en la tabla persona
INSERT INTO persona (tipo_documento, numero_documento, nombres, apellido_paterno, apellido_materno, correo, telefono, fecha_nacimiento, direccion) VALUES
('DNI', '12345678', 'Jean', 'Perez', 'Gomez', 'jean@perumarket.com', '999888777', '1990-05-15', 'Av. Lima 123'),
('DNI', '87654321', 'Maria', 'Lopez', 'Sanchez', 'maria@perumarket.com', '999777666', '1992-08-20', 'Av. Arequipa 456'),
('DNI', '11223344', 'Carlos', 'Rodriguez', 'Mendoza', 'carlos@perumarket.com', '999666555', '1988-12-10', 'Av. Tacna 789');

-- Insertar datos en la tabla usuario
INSERT INTO usuario (id_persona, id_rol, username, password, estado) VALUES
(1, 1, 'jean', '12345678', 'ACTIVO'),  -- Administrador
(2, 2, 'maria', '12345678', 'ACTIVO'),  -- Vendedor
(3, 3, 'carlos', '12345678', 'ACTIVO'); -- Almacenero

-- Insertar permisos para el rol Administrador (acceso a todo)
INSERT INTO role_module_permissions (id_rol, id_modulo, has_access) VALUES
(1, 1, TRUE), (1, 2, TRUE), (1, 3, TRUE), (1, 4, TRUE), (1, 5, TRUE),
(1, 6, TRUE), (1, 7, TRUE), (1, 8, TRUE), (1, 9, TRUE), (1, 10, TRUE);

-- Insertar permisos para el rol Vendedor
INSERT INTO role_module_permissions (id_rol, id_modulo, has_access) VALUES
(2, 1, TRUE), (2, 3, TRUE), (2, 6, TRUE), (2, 7, TRUE);

-- Insertar permisos para el rol Almacenero
INSERT INTO role_module_permissions (id_rol, id_modulo, has_access) VALUES
(3, 1, TRUE), (3, 4, TRUE), (3, 5, TRUE), (3, 7, TRUE);

-- Insertar departamentos
INSERT INTO departamento (nombre, descripcion) VALUES
('Ventas', 'Departamento de ventas y atención al cliente'),
('Almacén', 'Departamento de gestión de inventario'),
('Administración', 'Departamento administrativo y financiero'),
('Logística', 'Departamento de envíos y distribución');