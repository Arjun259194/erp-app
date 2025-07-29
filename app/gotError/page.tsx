import Link from "next/link";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ShowMessagePage({ searchParams }: Props) {
  const title = typeof searchParams.title === "string" ? searchParams.title : "Oops!";
  const message =
    typeof searchParams.message === "string" ? searchParams.message : "Something went wrong.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-md w-full text-center space-y-4">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-600">{message}</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
