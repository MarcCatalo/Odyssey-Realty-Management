import { RealtorShell } from "@/components/realtor-shell";

export default function RealtorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RealtorShell>{children}</RealtorShell>;
}
