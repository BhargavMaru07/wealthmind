"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { err } from "inngest/types";
import { revalidatePath } from "next/cache";

const serilizeTransaction = (obj)=>{
  let serilized = {...obj}

  if(obj.balance){
    serilized.balance = obj.balance.toNumber();
  }
}

export async function createAccount(data) {

  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not Found");
    }

    //convert balance in float before saving
    const balanceFloaat = parseFloat(data.balance);
    if (isNaN(balanceFloaat)) throw new Error("Invalid Balance Amount");

    //check this is the user's first account

    const existingAccounts = await db.account.findMany({
      where: {
        userId: user.id,
      },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : user.isDefault;

    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.ud, isDefault: true },
        data: { isDefault: false },
      });
    }

    const account = await db.account.create({
      data:{
        ...data,
        balance:balanceFloaat,
        isDefault:shouldBeDefault,
        userId:user.id
      }
    })

    const serilizedAccount = serilizeTransaction(account);

    revalidatePath("/dashboard")
    return {success:true,data:serilizedAccount}

  } catch (error) {
    throw new Error(error.message)
  }
}
