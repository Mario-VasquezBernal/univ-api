/*
  Warnings:

  - You are about to drop the `Permiso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rol` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PermisoToRol` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "usuarios"."Usuario" DROP CONSTRAINT "Usuario_rolId_fkey";

-- DropForeignKey
ALTER TABLE "usuarios"."_PermisoToRol" DROP CONSTRAINT "_PermisoToRol_A_fkey";

-- DropForeignKey
ALTER TABLE "usuarios"."_PermisoToRol" DROP CONSTRAINT "_PermisoToRol_B_fkey";

-- DropTable
DROP TABLE "usuarios"."Permiso";

-- DropTable
DROP TABLE "usuarios"."Rol";

-- DropTable
DROP TABLE "usuarios"."Usuario";

-- DropTable
DROP TABLE "usuarios"."_PermisoToRol";

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'USUARIO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
