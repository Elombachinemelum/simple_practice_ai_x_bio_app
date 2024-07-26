import React, { useState } from "react";
import { Button } from "../ui/button";

const CopyBioButton = ({ bio }: { bio: string }) => {
  const [label, setLabel] = useState<string>("Copy");
  const handleCopyBio = async (bioText: string) => {
    try {
      await navigator.clipboard.writeText(bioText);
      setLabel("Copied");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button
      onClick={async () => await handleCopyBio(bio)}
      className="text-sm text-muted-foreground bg-background my-0 h-auto  border border-primary/20 rounded
       hover:bg-primary hover:text-primary-foreground pt-0 pb-0.5 absolute top-3 right-3"
      variant={"outline"}
    >
      {label}
    </Button>
  );
};

export default CopyBioButton;
