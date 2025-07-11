import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./theme-provider";

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster position="bottom-center" />
      </ThemeProvider>
    </>
  );
}
