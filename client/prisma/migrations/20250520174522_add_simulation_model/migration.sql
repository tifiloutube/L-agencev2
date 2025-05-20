/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Simulation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Simulation_userId_key" ON "Simulation"("userId");
