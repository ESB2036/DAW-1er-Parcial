USE bd_taller_mecanico;

DELIMITER //
CREATE FUNCTION ValidarCedulaEcuatoriana(cedula VARCHAR(10)) RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE total INT;
    DECLARE digito INT;
    DECLARE coeficiente INT DEFAULT 2;
    DECLARE suma INT DEFAULT 0;
    DECLARE residuo INT;
    DECLARE verificador INT;
    DECLARE i INT;
    
    -- Verificar longitud
    IF LENGTH(cedula) != 10 THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar que sean solo dígitos
    IF cedula REGEXP '[^0-9]' THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar primeros dos dígitos (provincia)
    SET digito = CAST(SUBSTRING(cedula, 1, 2) AS UNSIGNED);
    IF digito < 1 OR digito > 24 THEN
        RETURN FALSE;
    END IF;
    
    -- Algoritmo de validación
    SET i = 9;
    WHILE i >= 1 DO
        SET digito = CAST(SUBSTRING(cedula, i, 1) AS UNSIGNED);
        SET total = digito * coeficiente;
        IF total >= 10 THEN
            SET total = total - 9;
        END IF;
        SET suma = suma + total;
        
        -- Alternar coeficiente entre 1 y 2
        IF coeficiente = 2 THEN
            SET coeficiente = 1;
        ELSE
            SET coeficiente = 2;
        END IF;
        
        SET i = i - 1;
    END WHILE;
    
    SET residuo = suma % 10;
    IF residuo = 0 THEN
        SET verificador = 0;
    ELSE
        SET verificador = 10 - residuo;
    END IF;
    
    RETURN CAST(SUBSTRING(cedula, 10, 1) AS UNSIGNED) = verificador;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE CrearPersona(
    IN p_Cedula VARCHAR(10),
    IN p_Nombre VARCHAR(100),
    IN p_Apellido VARCHAR(100),
    IN p_Telefono VARCHAR(10),
    IN p_Email VARCHAR(100),
    IN p_TipoPersona ENUM('Administrador', 'Tecnico', 'Cliente'),
    IN p_Username VARCHAR(30), -- Solo para administrador.
    IN p_Contrasena VARCHAR(255), -- Solo para administrador.
    IN p_Especialidad ENUM('Mecanico', 'Electricista', 'Pintor', 'Llantas'), -- Solo para técnico.
    IN p_Direccion VARCHAR(250) -- Solo para cliente.
)
BEGIN
    DECLARE v_ID_Persona INT;
    
    -- Validar cédula ecuatoriana:
    IF NOT ValidarCedulaEcuatoriana(p_Cedula) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cédula no válida';
    END IF;
    
    -- Insertar en tabla Persona:
    INSERT INTO Persona (Cedula, Nombre, Apellido, Telefono, Email, TipoPersona)
    VALUES (p_Cedula, p_Nombre, p_Apellido, p_Telefono, p_Email, p_TipoPersona);
    
    SET v_ID_Persona = LAST_INSERT_ID();
    
    -- Insertar en la tabla correspondiente según el tipo:
    CASE p_TipoPersona
        WHEN 'Administrador' THEN
            INSERT INTO Administrador (ID_Administrador, Username, Contrasena)
            VALUES (v_ID_Persona, p_Username, p_Contrasena);
        WHEN 'Tecnico' THEN
            INSERT INTO Tecnico (ID_Tecnico, Especialidad)
            VALUES (v_ID_Persona, p_Especialidad);
        WHEN 'Cliente' THEN
            INSERT INTO Cliente (ID_Cliente, Direccion)
            VALUES (v_ID_Persona, p_Direccion);
    END CASE;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ObtenerAdministradores()
BEGIN
    SELECT
        a.ID_Administrador AS ID,
        pa.Cedula AS "Cédula",
        pa.Nombre,
        pa.Apellido,
        pa.Telefono AS "Teléfono",
        pa.Email,
        a.Username,
        a.Contrasena AS "Contraseña",
        pa.Estado
    FROM 
        Administrador a
    JOIN 
        Persona pa ON a.ID_Administrador = pa.ID_Persona;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ActualizarAdministrador(
    IN p_ID_Administrador INT,
    IN p_Cedula VARCHAR(10),
    IN p_Nombre VARCHAR(100),
    IN p_Apellido VARCHAR(100),
    IN p_Telefono VARCHAR(10),
    IN p_Email VARCHAR(100),
    IN p_Username VARCHAR(30),
    IN p_Contrasena VARCHAR(255),
    IN p_Estado ENUM('Activo', 'Inactivo')
)
BEGIN
    DECLARE v_TipoPersonaActual ENUM('Administrador', 'Tecnico', 'Cliente');
    
    -- Validar que el administrador existe:
    IF NOT EXISTS (SELECT 1 FROM Administrador WHERE ID_Administrador = p_ID_Administrador) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Administrador no encontrado';
    END IF;
    
    -- Validar cédula ecuatoriana:
    IF NOT ValidarCedulaEcuatoriana(p_Cedula) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cédula no válida';
    END IF;
    
    -- Obtener el tipo de persona actual para verificar que no se está cambiando:
    SELECT TipoPersona INTO v_TipoPersonaActual FROM Persona WHERE ID_Persona = p_ID_Administrador;
    
    IF v_TipoPersonaActual != 'Administrador' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se puede cambiar el tipo de persona de un administrador';
    END IF;
    
    -- Actualizar datos en la tabla Persona:
    UPDATE Persona 
    SET 
        Cedula = p_Cedula,
        Nombre = p_Nombre,
        Apellido = p_Apellido,
        Telefono = p_Telefono,
        Email = p_Email,
        Estado = p_Estado
    WHERE 
        ID_Persona = p_ID_Administrador;
    
    -- Actualizar datos en la tabla Administrador:
    UPDATE Administrador
    SET 
        Username = p_Username,
        Contrasena = p_Contrasena
    WHERE 
        ID_Administrador = p_ID_Administrador;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE CrearVehiculo(
    IN p_ID_Cliente INT,
    IN p_Placa VARCHAR(10),
    IN p_Marca VARCHAR(50),
    IN p_Modelo VARCHAR(50),
    IN p_Anio YEAR,
    IN p_Color VARCHAR(30),
    IN p_Kilometraje INT
)
BEGIN
    -- Validar que el cliente existe y está activo
    IF NOT EXISTS (SELECT 1 FROM Cliente c JOIN Persona p ON c.ID_Cliente = p.ID_Persona 
                  WHERE c.ID_Cliente = p_ID_Cliente AND p.Estado = 'Activo') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cliente no existe o está inactivo';
    END IF;
    
    -- Validar año del vehículo
    IF p_Anio < 1900 OR p_Anio > YEAR(CURRENT_DATE) + 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Año del vehículo no válido';
    END IF;
    
    -- Validar kilometraje
    IF p_Kilometraje < 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Kilometraje no puede ser negativo';
    END IF;
    
    -- Insertar vehículo
    INSERT INTO Vehiculo (ID_Cliente, Placa, Marca, Modelo, Anio, Color, Kilometraje)
    VALUES (p_ID_Cliente, p_Placa, p_Marca, p_Modelo, p_Anio, p_Color, p_Kilometraje);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE CrearReparacion(
    IN p_ID_Vehiculo INT,
    IN p_ID_Tecnico INT,
    IN p_Descripcion TEXT,
    IN p_Diagnostico TEXT,
    IN p_Costo DECIMAL(10,2),
    IN p_TipoReparacion ENUM('Mecanico', 'Electricista', 'Pintor', 'Llantas')
)
BEGIN
    DECLARE v_EspecialidadTecnico ENUM('Mecanico', 'Electricista', 'Pintor', 'Llantas');
    
    -- Validar que el vehículo existe y está activo
    IF NOT EXISTS (SELECT 1 FROM Vehiculo WHERE ID_Vehiculo = p_ID_Vehiculo AND Estado = 'Activo') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vehículo no existe o está inactivo';
    END IF;
    
    -- Validar que el técnico existe y está activo
    IF NOT EXISTS (SELECT 1 FROM Tecnico t JOIN Persona p ON t.ID_Tecnico = p.ID_Persona 
                  WHERE t.ID_Tecnico = p_ID_Tecnico AND p.Estado = 'Activo') THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Técnico no existe o está inactivo';
    END IF;
    
    -- Validar que el tipo de reparación coincide con la especialidad del técnico
    SELECT Especialidad INTO v_EspecialidadTecnico FROM Tecnico WHERE ID_Tecnico = p_ID_Tecnico;
    
    IF v_EspecialidadTecnico != p_TipoReparacion THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El técnico no tiene la especialidad requerida para esta reparación';
    END IF;
    
    -- Validar costo positivo
    IF p_Costo <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El costo debe ser mayor a cero';
    END IF;
    
    -- Insertar reparación
    INSERT INTO Reparacion (ID_Vehiculo, ID_Tecnico, Descripcion, Diagnostico, Costo, TipoReparacion)
    VALUES (p_ID_Vehiculo, p_ID_Tecnico, p_Descripcion, p_Diagnostico, p_Costo, p_TipoReparacion);
END //
DELIMITER ;

CREATE VIEW VistaEstadoReparacionesActivas AS
SELECT 
    p.Cedula AS 'Cédula',
    CONCAT(p.Nombre, ' ', p.Apellido) AS Cliente,
    v.Placa,
    v.Marca,
    v.Modelo,
    r.Descripcion AS 'Descripción',
    r.EstadoReparacion AS Estado,
    r.Diagnostico AS 'Diagnóstico',
    r.FechaEntrada AS 'Fecha de entrada',
    CONCAT(tp.Nombre, ' ', tp.Apellido, ' - ', t.Especialidad) AS 'Técnico encargado'
FROM 
    Reparacion r
JOIN 
    Vehiculo v ON r.ID_Vehiculo = v.ID_Vehiculo
JOIN 
    Cliente c ON v.ID_Cliente = c.ID_Cliente
JOIN 
    Persona p ON c.ID_Cliente = p.ID_Persona
JOIN 
    Tecnico t ON r.ID_Tecnico = t.ID_Tecnico
JOIN 
    Persona tp ON t.ID_Tecnico = tp.ID_Persona
WHERE 
    r.Estado = 'Activo' AND v.Estado = 'Activo' AND r.EstadoReparacion != 'Facturada';

DELIMITER //
CREATE PROCEDURE CrearFactura(
    IN p_ID_Reparacion INT,
    IN p_MetodoPago ENUM('Efectivo', 'Tarjeta de Crédito', 'Transferencia')
)
BEGIN
    DECLARE v_Costo DECIMAL(10,2);
    DECLARE v_EstadoReparacion ENUM('Pendiente', 'En Proceso', 'Completada', 'Facturada');
    DECLARE v_Subtotal DECIMAL(10,2);
    DECLARE v_IVA DECIMAL(10,2);
    DECLARE v_MontoTotal DECIMAL(10,2);
    
    -- Validar que la reparación existe y está completada
    SELECT Costo, EstadoReparacion INTO v_Costo, v_EstadoReparacion
    FROM Reparacion
    WHERE ID_Reparacion = p_ID_Reparacion;
    
    IF v_Costo IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Reparación no encontrada';
    END IF;
    
    IF v_EstadoReparacion != 'Completada' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solo se pueden facturar reparaciones completadas';
    END IF;
    
    -- Calcular valores exactamente como en las restricciones CHECK
    SET v_Subtotal = v_Costo;
    SET v_IVA = ROUND(v_Subtotal * 0.15, 2);
    SET v_MontoTotal = ROUND(v_Subtotal + v_IVA, 2);
    
    -- Insertar factura
    INSERT INTO Factura (ID_Reparacion, Subtotal, IVA, MontoTotal, MetodoPago)
    VALUES (
        p_ID_Reparacion,
        v_Subtotal,
        v_IVA,
        v_MontoTotal,
        p_MetodoPago
    );
    
    -- Actualizar estado de la reparación a Facturada:
    UPDATE Reparacion 
    SET EstadoReparacion = 'Facturada'
    WHERE ID_Reparacion = p_ID_Reparacion;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ObtenerFacturas()
BEGIN
    SELECT 
        f.ID_Factura AS 'N° Factura',
        DATE_FORMAT(f.FechaHora, '%d/%m/%Y %H:%i') AS 'Fecha y Hora',
        CONCAT('$', FORMAT(f.Subtotal, 2)) AS Subtotal,
        CONCAT('$', FORMAT(f.IVA, 2)) AS "IVA (15%)",
        CONCAT('$', FORMAT(f.MontoTotal, 2)) AS 'Total',
        f.MetodoPago AS 'Método de Pago',
        f.Estado,
        
        -- Datos de la reparación
        r.ID_Reparacion AS 'N° Reparación',
        r.TipoReparacion AS 'Tipo',
        r.Descripcion AS 'Descripción',
        r.Diagnostico AS 'Diagnóstico',
        
        -- Datos del técnico
        CONCAT(pt.Nombre, ' ', pt.Apellido) AS 'Técnico',
        t.Especialidad AS 'Especialidad',
        
        -- Datos del vehículo
        CONCAT(v.Placa, ' - ', v.Marca, ' ', v.Modelo) AS 'Vehículo',
        
        -- Datos del cliente
        CONCAT(pc.Nombre, ' ', pc.Apellido) AS 'Cliente',
        pc.Cedula AS 'Cédula'
    FROM 
        Factura f
    JOIN Reparacion r ON f.ID_Reparacion = r.ID_Reparacion
    JOIN Tecnico t ON r.ID_Tecnico = t.ID_Tecnico
    JOIN Persona pt ON t.ID_Tecnico = pt.ID_Persona
    JOIN Vehiculo v ON r.ID_Vehiculo = v.ID_Vehiculo
    JOIN Cliente c ON v.ID_Cliente = c.ID_Cliente
    JOIN Persona pc ON c.ID_Cliente = pc.ID_Persona
    ORDER BY f.FechaHora DESC;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE ActualizarFactura(
    IN p_ID_Factura INT,
    IN p_MetodoPago ENUM('Efectivo', 'Tarjeta de Crédito', 'Transferencia'),
    IN p_Estado ENUM('Activo', 'Inactivo')
)
BEGIN
    DECLARE v_ID_Reparacion INT;
    DECLARE v_Subtotal DECIMAL(10,2);
    DECLARE v_IVA DECIMAL(10,2);
    DECLARE v_MontoTotal DECIMAL(10,2);
    
    -- Validar que la factura existe:
    IF NOT EXISTS (SELECT 1 FROM Factura WHERE ID_Factura = p_ID_Factura) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Factura no encontrada';
    END IF;
    
    -- Obtener el ID de la reparación asociada:
    SELECT ID_Reparacion INTO v_ID_Reparacion FROM Factura WHERE ID_Factura = p_ID_Factura;
    
    -- Validar que la reparación existe:
    IF v_ID_Reparacion IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Reparación asociada no encontrada';
    END IF;
    
    -- Obtener el subtotal de la reparación (no se permite modificar el costro desde la factura):
    SELECT Costo INTO v_Subtotal FROM Reparacion WHERE ID_Reparacion = v_ID_Reparacion;
    
    -- Recalcular IVA y MontoTotal según las reglas de negocio:
    SET v_IVA = ROUND(v_Subtotal * 0.15, 2);
    SET v_MontoTotal = ROUND(v_Subtotal + v_IVA, 2);
    
    -- Actualizar la factura:
    UPDATE Factura
    SET 
        MetodoPago = p_MetodoPago,
        Estado = p_Estado,
        -- Se asegura que los valores calculados se mantienen consistentes:
        Subtotal = v_Subtotal,
        IVA = v_IVA,
        MontoTotal = v_MontoTotal
    WHERE 
        ID_Factura = p_ID_Factura;
END //
DELIMITER ;