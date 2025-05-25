USE bd_taller_mecanico;

-- Administradores (VÁLIDOS)
CALL CrearPersona('1101160032', 'Juan', 'Perez', '0987654321', 'juan.perez@email.com', 'Administrador', 'jperez', '12345678', NULL, NULL);
CALL CrearPersona('1719690487', 'Maria', 'Gomez', '0998765432', 'maria.gomez@email.com', 'Administrador', 'mgomez', '12345678', NULL, NULL);

-- Técnicos (VÁLIDOS)
CALL CrearPersona('1717430100', 'Carlos', 'Lopez', '0976543210', 'carlos.lopez@email.com', 'Tecnico', NULL, NULL, 'Mecanico', NULL);
CALL CrearPersona('1723077382', 'Ana', 'Martinez', '0965432109', 'ana.martinez@email.com', 'Tecnico', NULL, NULL, 'Electricista', NULL);
CALL CrearPersona('1724354459', 'Pedro', 'Ramirez', '0954321098', 'pedro.ramirez@email.com', 'Tecnico', NULL, NULL, 'Pintor', NULL);
CALL CrearPersona('1720800521', 'Luisa', 'Fernandez', '0943210987', 'luisa.fernandez@email.com', 'Tecnico', NULL, NULL, 'Llantas', NULL);

-- Clientes (VÁLIDOS)
CALL CrearPersona('1722599154', 'Roberto', 'Vargas', '0932109876', 'roberto.vargas@email.com', 'Cliente', NULL, NULL, NULL, 'Av. Amazonas N23-45, Quito');
CALL CrearPersona('1712030541', 'Sofia', 'Torres', '0921098765', 'sofia.torres@email.com', 'Cliente', NULL, NULL, NULL, 'Calle Guayaquil Oe4-89, Quito');
CALL CrearPersona('1723609085', 'Diego', 'Santander', '0910987654', 'diego.santander@email.com', 'Cliente', NULL, NULL, NULL, 'Av. 6 de Diciembre N34-56, Quito');




-- Vehículos para Roberto Vargas (ID_Cliente 7)
CALL CrearVehiculo(7, 'ABC1234', 'Toyota', 'Corolla', 2018, 'Blanco', 45000);
CALL CrearVehiculo(7, 'XYZ5678', 'Chevrolet', 'Spark', 2020, 'Rojo', 12000);

-- Vehículos para Sofia Torres (ID_Cliente 8)
CALL CrearVehiculo(8, 'DEF9012', 'Hyundai', 'Tucson', 2019, 'Negro', 30000);
CALL CrearVehiculo(8, 'GHI3456', 'Kia', 'Rio', 2021, 'Azul', 15000);

-- Vehículos para Diego Santander (ID_Cliente 9)
CALL CrearVehiculo(9, 'JKL7890', 'Volkswagen', 'Golf', 2017, 'Gris', 60000);
CALL CrearVehiculo(9, 'MNO1234', 'Ford', 'Ranger', 2022, 'Blanco', 5000);





-- Reparaciones para vehículo ABC1234 (Toyota Corolla)
CALL CrearReparacion(1, 3, 'El motor hace ruidos extraños al acelerar', 'Necesita cambio de bujías y ajuste de válvulas', 150.00, 'Mecanico');
CALL CrearReparacion(1, 4, 'Problemas con el sistema eléctrico de las luces', 'Cortocircuito en el cableado frontal, requiere reemplazo', 85.50, 'Electricista');

-- Reparaciones para vehículo XYZ5678 (Chevrolet Spark)
CALL CrearReparacion(2, 3, 'Fuga de aceite', 'Junta del cárter dañada, necesita reemplazo', 120.75, 'Mecanico');

-- Reparaciones para vehículo DEF9012 (Hyundai Tucson)
CALL CrearReparacion(3, 5, 'Rayones en la puerta del conductor', 'Pintura y pulido de la puerta delantera izquierda', 200.00, 'Pintor');
CALL CrearReparacion(3, 6, 'Desgaste irregular de las llantas', 'Rotación de llantas y alineación', 45.00, 'Llantas');

-- Reparaciones para vehículo GHI3456 (Kia Rio)
CALL CrearReparacion(4, 4, 'Fallo en el sistema de carga de la batería', 'Alternador defectuoso, requiere reemplazo', 180.25, 'Electricista');

-- Reparaciones para vehículo JKL7890 (Volkswagen Golf)
CALL CrearReparacion(5, 3, 'Problemas con la transmisión', 'Cambio de aceite de la caja y ajuste de embrague', 250.50, 'Mecanico');

-- Reparaciones para vehículo MNO1234 (Ford Ranger)
CALL CrearReparacion(6, 6, 'Cambio completo de llantas', 'Instalación de 4 llantas nuevas y balanceo', 420.00, 'Llantas');





-- Actualizar algunas reparaciones a estado "Completada" para poder facturarlas
UPDATE Reparacion SET EstadoReparacion = 'Completada' WHERE ID_Reparacion IN (1, 3, 5, 7);





-- Facturas para reparaciones completadas
CALL CrearFactura(1, 'Tarjeta de Crédito');
CALL CrearFactura(3, 'Efectivo');
CALL CrearFactura(5, 'Transferencia');
CALL CrearFactura(7, 'Tarjeta de Crédito');





-- Crear una persona cliente inactiva (para probar validaciones)
CALL CrearPersona('1717648651', 'Inactivo', 'Usuario', '0909876543', 'inactivo@email.com', 'Cliente', NULL, NULL, NULL, 'Av. Test 123');
UPDATE Persona SET Estado = 'Inactivo' WHERE ID_Persona = 10;

-- Crear un vehículo inactivo (para probar validaciones)
CALL CrearVehiculo(9, 'INACT001', 'Mazda', 'CX-5', 2019, 'Rojo', 35000);
UPDATE Vehiculo SET Estado = 'Inactivo' WHERE ID_Vehiculo = 7;

-- Crear una reparación con técnico incorrecto (para probar validación de especialidad)
-- Esto debería fallar según el procedimiento
-- CALL CrearReparacion(1, 4, 'Prueba de especialidad incorrecta', 'Descripción', 100.00, 'Mecanico');