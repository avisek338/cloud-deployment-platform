-- AlterEnum
ALTER TYPE "DeployementStatus" ADD VALUE 'SUCCESS';

-- AlterTable
ALTER TABLE "Deployement" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "id" DROP DEFAULT;
