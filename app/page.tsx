import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./lib/authOptions";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Optional role-based redirect from "/"
  switch (session.user.role) {
    case "admin":
      redirect("/admin/dashboard");
    case "staff":
      redirect("/staff/dashboard");
    default:
      redirect("/merchant//dashboard");
  }
}
