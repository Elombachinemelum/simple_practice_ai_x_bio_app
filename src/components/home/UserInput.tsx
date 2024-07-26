"use client";
import { Form } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form as ShadCNForm,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactNode } from "react";
import { MetaIcon, MistralIcon } from "../icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Info, Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { generateBio } from "@/app/serverActions/actions";
import { useAIContext } from "@/app/context/AIOutputDataContext";

const tones = [
  "Professional",
  "Casual",
  "Sarcastic",
  "Funny",
  "Pationate",
  "Thoughtful",
];
const types = ["personal", "brand"];
const formSchema = z.object({
  model: z
    .string({ required_error: "Please select a model" })
    .min(2, { message: "Model is required" }),
  temperature: z
    .number()
    .gte(0, "Temperature min value is 1")
    .lte(2, "Temperature max value is 2"),
  content: z
    .string()
    .min(50, { message: "Content should be atleast 50 characters." })
    .max(500, {
      message: "Content should not exceed 500 characters.",
    }),
  type: z.enum(["personal", "brand"], {
    errorMap: (g) => {
      return { message: "value entered is not acceptable" };
    },
  }),
  tone: z.enum([
    "Professional",
    "Casual",
    "Sarcastic",
    "Funny",
    "Pationate",
    "Thoughtful",
  ]),
  emojis: z.boolean(),
});

const UserInput = () => {
  const { loadingData, setOutput, setLoadingData } = useAIContext();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model: "llama-3-8b-8192",
      temperature: 1,
      content: "",
      type: "personal",
      tone: "Professional",
      emojis: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingData(true);
    // clear previous data
    setOutput([]);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const inputs = `
    User Input: ${values.content},
    Bio Tone: ${values.tone},
    Bio Type: ${values.type},
    Add Emojis: ${values.emojis}
    `;
    try {
      const response = await generateBio(
        inputs,
        values.temperature,
        values.model
      );
      if (response.responseData?.length) {
        setOutput(response.responseData);
      }
      setLoadingData(false);
    } catch (error) {
      console.error(error);
      setLoadingData(false);
    }
  }

  interface ModelItem {
    displayName: string;
    modelId: string;
    icon?: unknown;
    version: string;
  }

  const modelList: ModelItem[] = [
    {
      displayName: "LLaMA3 8b",
      modelId: "llama3-8b-8192",
      icon: <MetaIcon className="size-5 fill-[blue]" />,
      version: "8b",
    },
    {
      displayName: "LLaMA3",
      modelId: "llama3-70b-8192",
      icon: <MetaIcon className="size-5" />,
      version: "70b",
    },
    {
      displayName: "Mixtral 8x7b",
      modelId: "mixtral-8x7b-32768",
      icon: <MistralIcon className="size-5" />,
      version: "8x7b",
    },
  ];

  return (
    <div className="relative flex flex-col items-start gap-8">
      <ShadCNForm {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col w-full"
        >
          <fieldset className="grid gap-6 rounded-[8px] border p-4 bg-background/10 backdrop-blur-sm -mb-[10px]">
            <legend className="text-sm font-medium">Settings</legend>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {modelList.map((model, idx) => (
                            <SelectItem key={idx} value={model.modelId}>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                {model.icon as ReactNode}
                                <p className="">
                                  <span className="text-foreground font-medium mr-2">
                                    {model.displayName}
                                  </span>
                                  {model.version}
                                </p>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                      {/* <FormDescription className="text-[red]">
                    This is your public display name.
                  </FormDescription> */}
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex justify-between w-full mb-4">
                      <span className="flex items-center">
                        Creativity
                        <Tooltip>
                          <TooltipTrigger className="ml-1">
                            <Info className="size-4" />
                          </TooltipTrigger>
                          {/* For TooltipContent we can simply just use classes to give it padding and margins as needed. Just wanted to highlight some props we can use */}
                          <TooltipContent
                            sideOffset={25}
                            collisionPadding={20}
                            className=""
                          >
                            <p className="max-w-[25ch]">
                              A higher setting produces more creative and
                              surprising bios. Lower settings produces more
                              predictable and conventional styles.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      {field.value}
                    </FormLabel>
                    <FormControl>
                      <Slider
                        onValueChange={(valuePercent) => {
                          field.onChange(valuePercent?.[0]);
                        }}
                        defaultValue={[field.value]}
                        max={2}
                        min={0}
                        step={0.1}
                      />
                    </FormControl>
                    <FormMessage />
                    {/* <FormDescription className="text-[red]">
                  This is your public display name.
                </FormDescription> */}
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          <fieldset className="grid gap-6 rounded-[8px] border p-4 bg-background/10 backdrop-blur-sm">
            <legend className="text-sm font-medium">User Input</legend>
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>About Yourself</FormLabel>
                      <FormControl>
                        <Textarea
                          cols={20}
                          placeholder="Tell us a little bit about yourself or write your old bio"
                          className="resize-none min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      {/* <FormDescription className="text-[red]">
                    This is your public display name.
                  </FormDescription> */}
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a valid type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {types.map((type, indx) => (
                          <SelectItem key={indx} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {/* <FormDescription className="text-[red]">
                  This is your public display name.
                </FormDescription> */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tones.map((type, indx) => (
                          <SelectItem key={indx} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                    {/* <FormDescription className="text-[red]">
                  This is your public display name.
                </FormDescription> */}
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="emojis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mb-0 text-sm">Emojis</FormLabel>
                    <div className="">
                      {/* <FormLabel className="text-base">
                        Marketing emails
                      </FormLabel> */}
                      <FormDescription>
                        Turning on this function will allow for a less
                        professional feel to bio.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </fieldset>
          <Button type="submit" className="rounded" disabled={loadingData}>
            {loadingData ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        </form>
      </ShadCNForm>
    </div>
  );
};

export default UserInput;
