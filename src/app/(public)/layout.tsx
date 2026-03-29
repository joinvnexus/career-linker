import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      <div className="ambient-orb left-[-8rem] top-24 h-72 w-72 bg-sky-300/35" />
      <div className="ambient-orb right-[-8rem] top-80 h-80 w-80 bg-emerald-300/30" />
      <Navbar />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
