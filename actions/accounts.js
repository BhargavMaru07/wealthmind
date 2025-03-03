"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serilizeTransaction = (obj) => {
  let serilized = { ...obj };

  if (obj.balance) {
    serilized.balance = obj.balance.toNumber();
  }

  if (obj.amount) {
    serilized.amount = obj.amount.toNumber();
  }

  return serilized;
};

export async function updateDefaultAccount(accountId) {
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

    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: {
        isDefault: true,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: serilizeTransaction(account) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getAccountWithTransaction(accountId) {
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

    const account = await db.account.findUnique({
      where: { id: accountId, userId: user.id },
      include: {
        transactions: {
          orderBy: {
            date: "desc",
          },
        },
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    if (!account) return null;

    return {
      ...serilizeTransaction(account),
      transactions: account.transactions.map(serilizeTransaction),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function bulkDeleteTransaction(transactionIds) {
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

    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });

    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      const change =
        transaction.type === "EXPENSE"
          ? transaction.amount
          : -transaction.amount;

          acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
          return acc;
    },{});


    //delete transactions and update account balance in a transaction
    //we use $transaction of prisma

    await db.$transaction(async (tx)=>{
      //delete transactions

      await tx.transaction.deleteMany({
        where:{
          id:{in:transactionIds},
          userId: user.id,
        }
      });

      for(const[accountId,balanceChange] of Object.entries(accountBalanceChanges)){
        await tx.account.update({
          where:{id:accountId},
          data:{
            balance:{
              increment:balanceChange
            }
          }
        })
      }
    })

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]")

    return {success:true}
  } catch (error) {
    return { success:false,error:error.message}
  }
}
