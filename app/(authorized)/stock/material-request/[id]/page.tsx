import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  User,
  Building2,
  DollarSign,
  Package,
  FileText,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import { prisma } from "@/lib/database";
import { MaterialRequestStatus, Priority } from "@/generated/prisma";

async function getMaterialRequest(id: string) {
  const materialRequest = await prisma.materialRequest.findUnique({
    where: { id },
    include: {
      company: true,
      requester: true,
      department: true,
      costCenter: true,
      items: {
        include: {
          item: true,
        },
      },
      workOrders: true,
      purchaseOrders: true,
    },
  });

  if (!materialRequest) {
    notFound();
  }

  return materialRequest;
}

async function updateMaterialRequestStatus(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  await prisma.materialRequest.update({
    where: { id },
    data: { status: status as any },
  });
}

function getStatusColor(status: MaterialRequestStatus) {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-800";
    case "SUBMITTED":
      return "bg-blue-100 text-blue-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "ORDERED":
      return "bg-purple-100 text-purple-800";
    case "RECEIVED":
      return "bg-emerald-100 text-emerald-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getPriorityColor(priority: Priority) {
  switch (priority) {
    case "LOW":
      return "bg-green-100 text-green-800";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800";
    case "HIGH":
      return "bg-orange-100 text-orange-800";
    case "URGENT":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default async function page({ params }: { params: { id: string } }) {
  const materialRequest = await getMaterialRequest(params.id);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Material Request #{materialRequest.requestNumber}</h1>
          <p className="text-muted-foreground">
            Created on {new Date(materialRequest.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(materialRequest.status)}>{materialRequest.status}</Badge>
          <Badge className={getPriorityColor(materialRequest.priority)}>
            {materialRequest.priority}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Required Date</p>
                    <p className="font-medium">
                      {new Date(materialRequest.requiredDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Requester</p>
                    <p className="font-medium">{materialRequest.requester.name}</p>
                  </div>
                </div>
                {materialRequest.department && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-medium">{materialRequest.department.name}</p>
                    </div>
                  </div>
                )}
                {materialRequest.costCenter && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Cost Center</p>
                      <p className="font-medium">{materialRequest.costCenter.name}</p>
                    </div>
                  </div>
                )}
              </div>
              {materialRequest.purpose && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Purpose</p>
                    <p className="text-sm">{materialRequest.purpose}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Material Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Requested Items ({materialRequest.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {materialRequest.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">SKU</th>
                        <th className="text-left py-3 px-4">Item Name</th>
                        <th className="text-left py-3 px-4">Quantity</th>
                        <th className="text-left py-3 px-4">UOM</th>
                        <th className="text-left py-3 px-4">Unit Price</th>
                        <th className="text-left py-3 px-4">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materialRequest.items.map(requestItem => (
                        <tr key={requestItem.id} className="border-b">
                          <td className="py-3 px-4 font-mono text-sm">
                            {requestItem.item?.sku || "N/A"}
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {requestItem.item?.name || "N/A"}
                          </td>
                          <td className="py-3 px-4">{requestItem.quantity}</td>
                          <td className="py-3 px-4">{requestItem.uom}</td>
                          <td className="py-3 px-4">
                            ${requestItem.item?.price?.toFixed(2) || "0.00"}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {requestItem.description ||
                              requestItem.item?.description ||
                              "No description"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No items added to this request
                </p>
              )}
            </CardContent>
          </Card>

          {/* Related Documents */}
          {(materialRequest.purchaseOrders.length > 0 || materialRequest.workOrders.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Related Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {materialRequest.purchaseOrders.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-medium mb-3">
                      <ShoppingCart className="h-4 w-4" />
                      Purchase Orders ({materialRequest.purchaseOrders.length})
                    </h4>
                    <div className="grid gap-2">
                      {materialRequest.purchaseOrders.map(po => (
                        <div
                          key={po.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">PO #{po.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(po.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline">{po.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {materialRequest.workOrders.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-medium mb-3">
                      <Wrench className="h-4 w-4" />
                      Work Orders ({materialRequest.workOrders.length})
                    </h4>
                    <div className="grid gap-2">
                      {materialRequest.workOrders.map(wo => (
                        <div
                          key={wo.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">WO #{wo.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(wo.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline">{wo.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <form action={updateMaterialRequestStatus}>
                <input type="hidden" name="id" value={materialRequest.id} />

                {materialRequest.status === "DRAFT" && (
                  <Button name="status" value="SUBMITTED" className="w-full">
                    Submit Request
                  </Button>
                )}

                {materialRequest.status === "SUBMITTED" && (
                  <>
                    <Button name="status" value="APPROVED" className="w-full mb-2">
                      Approve Request
                    </Button>
                    <Button
                      name="status"
                      value="CANCELLED"
                      variant="destructive"
                      className="w-full"
                    >
                      Cancel Request
                    </Button>
                  </>
                )}

                {materialRequest.status === "APPROVED" && (
                  <Button name="status" value="ORDERED" className="w-full">
                    Mark as Ordered
                  </Button>
                )}

                {materialRequest.status === "ORDERED" && (
                  <Button name="status" value="RECEIVED" className="w-full">
                    Mark as Received
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Request Info */}
          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{materialRequest.company.name}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">
                  {new Date(materialRequest.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {new Date(materialRequest.updatedAt).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
