import { DB, prisma } from "@/lib/database";
import { createMaterialRequestAction } from "./action";
import { auth } from "@/lib/auth";
import { gotError } from "@/lib/redirects";
import { MaterialRequestTable } from "@/components/ MaterialRequestTable";

export default async function page() {
  const [user, error] = await auth();
  if (error) return gotError("Authentication Error", error);

  // Get user's companies
  const userCompanies = await prisma.userCompanyRole.findMany({
    where: { userId: user.id },
    select: { companyId: true, role: true },
  });

  // Use first company as active (you can modify this logic based on your needs)
  const activeCompanyId = userCompanies[0]?.companyId;

  if (!activeCompanyId && user.role !== "Admin") {
    throw new Error("No active company found for the user.");
  }

  // Fetch material requests with all required includes
  const materialRequests = await DB.GetAllMaterialRequests();

  // Fetch cost centers (Account records with EXPENSE or INCOME type)
  const costCenters = await prisma.account.findMany({
    where: {
      companyId: user.role !== "Admin" ? activeCompanyId : undefined,
      type: user.role !== "Admin" ? { in: ["Expense", "Income"] } : undefined,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  // Fetch departments for the company
  const departments = await prisma.department.findMany({
    where: { companyId: activeCompanyId },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <MaterialRequestTable
      materialRequests={materialRequests}
      fetchMaterialRequestsAction={async () => {
        "use server";
        return await DB.GetAllMaterialRequests();
      }}
      createMaterialRequestAction={createMaterialRequestAction}
      costCenters={costCenters}
      departments={departments}
    />
  );
}
