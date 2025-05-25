CREATE DATABASE bd_taller_mecanico;
USE bd_taller_mecanico;

-- SE ELIMINARON LOS ACENTOS PARA EVITAR PROBLEMAS DE ENVÍO DE ESTADOS.

-- Tabla base para todas las personas:
CREATE TABLE Persona(
    ID_Persona INT AUTO_INCREMENT PRIMARY KEY,
    Cedula VARCHAR(10) NOT NULL UNIQUE,
    Nombre VARCHAR(100) NOT NULL,
    Apellido VARCHAR(100) NOT NULL,
    Telefono VARCHAR(10) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    TipoPersona ENUM('Administrador', 'Tecnico', 'Cliente') NOT NULL,
    Estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo' NOT NULL
);

-- Tabla para administradores (empleados que gestionan el sistema web):
CREATE TABLE Administrador(
    ID_Administrador INT PRIMARY KEY,
    Username VARCHAR(30) NOT NULL UNIQUE,
    Contrasena VARCHAR(255) NOT NULL, -- Almacenará hash de contraseña
    FOREIGN KEY (ID_Administrador) REFERENCES Persona(ID_Persona)
);

-- Tabla para técnicos:
CREATE TABLE Tecnico(
    ID_Tecnico INT PRIMARY KEY,
    Especialidad ENUM('Mecanico', 'Electricista', 'Pintor', 'Llantas') NOT NULL,
    FOREIGN KEY (ID_Tecnico) REFERENCES Persona(ID_Persona)
);

-- Tabla para clientes:
CREATE TABLE Cliente(
    ID_Cliente INT PRIMARY KEY,
    Direccion VARCHAR(250) NOT NULL,
    FOREIGN KEY (ID_Cliente) REFERENCES Persona(ID_Persona)
);

-- Tabla para vehículos:
CREATE TABLE Vehiculo(
    ID_Vehiculo INT AUTO_INCREMENT PRIMARY KEY,
    ID_Cliente INT NOT NULL,
    Placa VARCHAR(10) NOT NULL UNIQUE,
    Marca VARCHAR(50) NOT NULL,
    Modelo VARCHAR(50) NOT NULL,
    Anio YEAR,
    Color VARCHAR(30),
    Kilometraje INT,
    Estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo' NOT NULL,
    FOREIGN KEY (ID_Cliente) REFERENCES Cliente(ID_Cliente)
);

-- Tabla para las reparaciones:
CREATE TABLE Reparacion(
    ID_Reparacion INT AUTO_INCREMENT PRIMARY KEY,
    ID_Vehiculo INT NOT NULL,
    ID_Tecnico INT NOT NULL,
    FechaEntrada DATETIME DEFAULT CURRENT_TIMESTAMP,
    Descripcion TEXT NOT NULL, -- Almacena los detalles que el cliente describe sobre su vehículo.
    Diagnostico TEXT DEFAULT '-', -- Almancena los cambios que pueden surgir durante la reparación.
    Costo DECIMAL(10,2) NOT NULL CHECK (Costo > 0),
    TipoReparacion ENUM('Mecanico', 'Electricista', 'Pintor', 'Llantas') NOT NULL,
    EstadoReparacion ENUM('Pendiente', 'En Proceso', 'Completada', 'Facturada') DEFAULT 'Pendiente' NOT NULL,
    Estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo' NOT NULL,
    FOREIGN KEY (ID_Vehiculo) REFERENCES Vehiculo(ID_Vehiculo),
    FOREIGN KEY (ID_Tecnico) REFERENCES Tecnico(ID_Tecnico)
);

-- Tabla para facturas:
CREATE TABLE Factura(
    ID_Factura INT AUTO_INCREMENT PRIMARY KEY,
    ID_Reparacion INT NOT NULL UNIQUE,
    FechaHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    Subtotal DECIMAL(10,2) NOT NULL CHECK (Subtotal > 0), -- Toma su valor del campo Costo de la reparación a la que está vinculada.
    IVA DECIMAL(10,2) NOT NULL CHECK (IVA >= 0),
    MontoTotal DECIMAL(10,2) NOT NULL CHECK (MontoTotal > 0),
    MetodoPago ENUM('Efectivo', 'Tarjeta de Crédito', 'Transferencia') NOT NULL,
    Estado ENUM('Activo', 'Inactivo') DEFAULT 'Activo' NOT NULL,
    FOREIGN KEY (ID_Reparacion) REFERENCES Reparacion(ID_Reparacion),
    CONSTRAINT chk_iva CHECK (ABS(IVA - (Subtotal * 0.15)) < 0.01),
    CONSTRAINT chk_montos CHECK (ABS(MontoTotal - (Subtotal + IVA)) < 0.01)
);