"use client";

import createTransaction from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import UseFatch from "@/hooks/use-fatch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AddTransactionForm = ({ accounts, categories }) => {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    watch,
    reset,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      accountId: accounts.find((ac) => ac.isDefault)?.id,
      date: new Date(),
      isRecurring: false,
      category: "",
    },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = UseFatch(createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );
  
  const onSubmit = async(data)=>{
    console.log("onsubmit is call");
    const formData = {
      ...data,
      amount:parseFloat(data.amount)
    }
    console.log(formData);

    await transactionFn(formData)
  }

  useEffect(()=>{
    if(transactionResult?.success && !transactionLoading){
      toast.success("Transaction created successfully")
      reset()
      router.push(`/account/${transactionResult.data.accountId}`)
    }
  },[transactionResult,transactionLoading])

  return (
    <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}> 
      {/* AI Reciept Scanner */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          defaultValue={type}
          onValueChange={(value) => setValue("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>

        {errors.type && (
          <p className="text-red-500 text-sm">{errors.type.message}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
          />

          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>
        <div className="space-y-2 ">
          <label className="text-sm font-medium">Account</label>
          <Select
            defaultValue={getValues("accountId")}
            onValueChange={(value) => setValue("accountId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name}(${parseFloat(acc.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  variant="ghost"
                  className="w-full select-none items-center text-sm outline-none"
                >
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>

          {errors.accountId && (
            <p className="text-red-500 text-sm">{errors.accountId.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Categories</label>
        <Select
          defaultValue={getValues("category")}
          onValueChange={(value) => setValue("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full pl-3 text-left font-normal"
            >
              {date ? format(date, "PPP") : <span>Pick A Date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(value) => setValue("date", value)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {errors.date && (
          <p className="text-red-500 text-sm">{errors.date.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter description" {...register("description")} />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <label
            htmlFor="isDefault"
            className="text-sm font-medium cursor-pointer"
          >
            Set As Recurring
          </label>
          <p className="text-sm text-muted-foreground">
            This account will be selected by default for transaction
          </p>
        </div>
        <Switch
          id="isDefault"
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
          checked={watch("isRecurring")}
        />
      </div>
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">RecurringInterval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>

          {errors.recurringInterval && (
            <p className="text-red-500 text-sm">
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}
      <div className="flex gap-4">
        <Button
          className="w-full"
          variant="outline"
          type="button"
          onClick={() => router.back()}
        >
          Cancle
        </Button>
        <Button className="w-full" type="submit" disabled={transactionLoading}>
          Create Transaction
        </Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
