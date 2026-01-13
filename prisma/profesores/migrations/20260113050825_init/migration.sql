/*
  Warnings:

  - You are about to drop the column `createdAt` on the `titulos` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `titulos` table. All the data in the column will be lost.
  - Made the column `titulo` on table `profesores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `profesores` required. This step will fail if there are existing NULL values in that column.
  - Made the column `institucion` on table `titulos` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fecha` on table `titulos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "titulos" DROP CONSTRAINT "titulos_profesorId_fkey";

-- AlterTable
ALTER TABLE "profesores" ALTER COLUMN "titulo" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "titulos" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "institucion" SET NOT NULL,
ALTER COLUMN "fecha" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "titulos" ADD CONSTRAINT "titulos_profesorId_fkey" FOREIGN KEY ("profesorId") REFERENCES "profesores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
