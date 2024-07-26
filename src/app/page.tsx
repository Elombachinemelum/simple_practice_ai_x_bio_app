import Output from "@/components/home/Output";
import UserInput from "@/components/home/UserInput";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-2 relative gap-12 p-4 sm:p-8 xl:p-24 border-[1px]">
      <div className="group col-span-1 lg:col-span-2 text-center border-[1px]">
        <Link href={"https://github.com"} target="_blank" className="mb-4">
          <AnimatedGradientText className="px-6 py-2 rounded-full">
            <Star className="w-6 h-6 fill-yellow-300 text-yellow-400" />
            <hr className="mx-2 h-4 w-[1px] bg-gray-300" />
            Star on Github
            <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
          </AnimatedGradientText>
        </Link>
        <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-7xl text-center w-full lg:w-[90%] uppercase mx-auto py-6">
          craft the perfect X bio in seconds!
        </h1>
        <p className="text-lg text-accent">
          {
            "Just answer a few questions, and we'll generate a bio that captures who you are"
          }
        </p>
      </div>

      <UserInput />
      <Output />
    </main>
  );
}
