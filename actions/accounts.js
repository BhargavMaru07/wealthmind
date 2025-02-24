"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Select } from "@radix-ui/react-select";
import { revalidatePath } from "next/cache";
import { date } from "zod";

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

    if(!account) return null;

    return{
      ...serilizeTransaction(account),
      transactions:account.transactions.map(serilizeTransaction)
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
