import { Loader } from "lucide-react";

export default function TransactionLoading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <Loader className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );
}
