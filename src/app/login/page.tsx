import Image from "next/image";
import AuthImg from "@/public/Abstract.jpeg";
import { Logo } from "@/components/Logo";

export default function AuthenticationPage() {
  return (
    <main className="h-screen grid grid-cols-2 relative">
      <div className="relative w-full flex flex-col bg-muted p-10 text-primary-foreground">
        <Image
          src={AuthImg}
          alt="login image"
          fill
          className="w-full h-full object-cover"
        />
        <div className="z-20 relative flex items-center">
          <Logo />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              “Pictoria AI is a game changer for me. I have been able to
              generate high quality professional headshots within minutes. It
              has saved me countless hours of work and cost as well.”
            </p>
            <footer className="text-sm">David S.</footer>
          </blockquote>
        </div>
      </div>
      <div>Form</div>
    </main>
  );
}
