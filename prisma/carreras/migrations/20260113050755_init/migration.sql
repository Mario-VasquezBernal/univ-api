/*
  Warnings:

  - You are about to drop the column `createdAt` on the `alumnos` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `alumnos` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `carreras` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `carreras` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ciclos` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ciclos` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `cursos` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `cursos` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `horarios` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `horarios` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `materias` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `materias` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `matriculas` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `matriculas` table. All the data in the column will be lost.
  - Changed the type of `turno` on the `cursos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `aula` on table `horarios` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "horarios" DROP CONSTRAINT "horarios_cursoId_fkey";

-- AlterTable
ALTER TABLE "alumnos" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "carreras" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "ciclos" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "cursos" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "turno",
ADD COLUMN     "turno" TEXT NOT NULL,
ALTER COLUMN "cupo" DROP DEFAULT;

-- AlterTable
ALTER TABLE "horarios" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "aula" SET NOT NULL;

-- AlterTable
ALTER TABLE "materias" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "creditos" DROP DEFAULT;

-- AlterTable
ALTER TABLE "matriculas" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- DropEnum
DROP TYPE "Turno";

-- AddForeignKey
ALTER TABLE "horarios" ADD CONSTRAINT "horarios_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
