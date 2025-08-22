-- CreateTable
CREATE TABLE "public"."Message" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "reciverId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_reciverId_fkey" FOREIGN KEY ("reciverId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
