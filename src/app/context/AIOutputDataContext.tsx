"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface BioInfo {
  bio: string;
}

const test = {
  responseData: [
    {
      bio: "God is good, This I have found to be good always. 😊",
    },
  ],
};

interface OutputData {
  output: BioInfo[];
  loadingData: boolean;
  setLoadingData: Dispatch<SetStateAction<boolean>>;
  setOutput: Dispatch<SetStateAction<BioInfo[]>>;
}

const defaultValue: OutputData = {
  output: [],
  loadingData: false,
  setLoadingData: () => {},
  setOutput: () => {},
};

// create context here
const AIOutputContext = createContext<OutputData>(defaultValue);

// Make hook to make context available to all wrapped components
export const useAIContext = (): OutputData => {
  return useContext(AIOutputContext);
};

// Make provider wrapper component to provide context value to any component nested in it.
export function AIOutputProvider({ children }: { children: ReactNode[] }) {
  const [output, setOutput] = useState<BioInfo[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  return (
    <AIOutputContext.Provider
      value={{
        output,
        loadingData,
        setLoadingData,
        setOutput,
      }}
    >
      {children}
    </AIOutputContext.Provider>
  );
}
