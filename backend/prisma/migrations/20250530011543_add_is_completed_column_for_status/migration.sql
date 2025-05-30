/*
  Warnings:

  - Added the required column `isCompleted` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN "isCompleted" BOOLEAN;
UPDATE "Task" SET "isCompleted"=false WHERE "id">0;
ALTER TABLE "Task" ALTER COLUMN "isCompleted" SET NOT NULL;
