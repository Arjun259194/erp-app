import {
  ItemStock,
  Warehouse,
} from "@/generated/prisma"

type Props = {
  stocks: (ItemStock & { warehouse: Warehouse })[]
}

export default function WareHouse({
  stocks,
}: Props) {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No warehouse stock data available.
      </div>
    )
  }
  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr>
          <th className="text-left px-2 py-1 font-semibold">
            Warehouse
          </th>
          <th className="text-left px-2 py-1 font-semibold">
            Quantity
          </th>
        </tr>
      </thead>
      <tbody>
        {stocks.map(row => (
          <tr key={row.id}>
            <td className="px-2 py-1">
              {row.warehouse.name}
            </td>
            <td className="px-2 py-1">
              {row.quantity}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
