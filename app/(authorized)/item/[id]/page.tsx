import { DB } from "@/lib/database"

interface Params {
  params: {
    id: string
  }
}

export default async function page(params: Promise<Params>) {
  const parameters = await params
  const itemId = parameters.params.id

  const item = await DB.GetItemById(itemId)


  return <h1>
    THis is item page
  </h1>
}
