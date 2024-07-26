"use client";
import { revalidatePath } from "next/cache";
import { BorderBeam } from "../magicui/border-beam";
import { Badge } from "../ui/badge";
import { useAIContext } from "@/app/context/AIOutputDataContext";
import CopyBioButton from "./CopyBioButton";

const Output = () => {
  const { loadingData, output } = useAIContext();
  return (
    <div className="relative flex border flex-col mt-2 rounded-xl bg-muted/50 backdrop-blur-sm overflow-hidden border-primary/5">
      {loadingData && <BorderBeam size={1200} duration={5} />}
      <div className="text-right mt-1 mr-1">
        <Badge variant="outline" className="w-[fit-content] px-2 py-1 border">
          Output
        </Badge>

        {/* we can do an added Skeleton from the shadcn library but we already have a loading state */}
        <ul className="flex flex-col justify-start items-center space-y-12 p-5 xl:p-16 mt-2">
          {output?.map((bio, index) => (
            <li
              key={index}
              className="text-base w-full border border-primary/20 rounded-md p-4 pt-[50px] relative bg-background "
            >
              {bio.bio}
              <CopyBioButton bio={bio.bio} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Output;
