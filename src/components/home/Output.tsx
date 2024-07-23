import { revalidatePath } from "next/cache";
import { BorderBeam } from "../magicui/border-beam";
import { Badge } from "../ui/badge";
import { redirect } from "next/dist/server/api-utils";

const Output = () => {
  return (
    <div className="relative flex border flex-col mt-2 rounded-xl bg-muted/50 backdrop-blur-sm overflow-hidden border-primary/5">
      {<BorderBeam size={1200} duration={5} />}
      <div className="text-right mt-1 mr-1">
        <Badge variant="outline" className="w-[fit-content] px-2 py-1 border">
          Output
        </Badge>
      </div>
    </div>
  );
};

export default Output;
