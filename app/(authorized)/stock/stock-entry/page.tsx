import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { auth } from "@/lib/auth"
import { DB } from "@/lib/database"

export default async function page() {
  const [user, error] = await auth()
  if (error) throw new Error(error)
  console.log(user)
  const companies = user.companies.map(x => x.companyId)
  console.log(companies)
  const stockEntries =
    await DB.GetAllStockEntry(companies)
  console.log(stockEntries)
  return (
    <div>
      <Table className="w-full text-sm">
        <TableHeader className="bg-muted text-muted-foreground">
          <TableRow className="text-left">
            <TableHead>Item name</TableHead>
            <TableHead>Werehouse</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>
              Related Reference
            </TableHead>
            <TableHead>Created at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stockEntries.map((se, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell>
                  {se.item.name}
                </TableCell>
                <TableCell>
                  {se.warehouse.name}
                </TableCell>
                <TableCell>
                  {se.quantity}
                </TableCell>
                <TableCell>
                  {se.entryType}
                </TableCell>
                <TableCell>
                  {se.relatedReference}
                </TableCell>
                <TableCell>{`${se.createdAt}`}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
