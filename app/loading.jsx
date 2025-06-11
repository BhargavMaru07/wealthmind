import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );
}
