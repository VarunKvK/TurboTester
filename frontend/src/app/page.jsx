"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, RefreshCcwDotIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  input: z.string(),
});

export default function Home() {
  const [text, setText] = useState();
  const [startTime, setStartTime] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(null);
  const [error, setError] = useState(null); // State to track errors
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: "",
    },
  });

  // Fetching the generated paragraph on component mount
  useEffect(() => {
    const get_paragraph = async () => {
      setLoading(true); // Set loading to true when fetching
      setError(null); // Reset error state
      const response = await fetch("http://localhost:5000/get_generated_para");
      const data = await response.json();
      setLoading(false); // Set loading to false after fetching

      if (!response.ok) {
        setError("There was an error retrieving your writing content."); // Set error message
        return;
      }
      setText(data.generated_text);
    };
    get_paragraph();
  }, []);

  // Function to reload the generated paragraph
  async function onReload() {
    setText(" ");
    setLoading(true); // Set loading to true when fetching
    setError(null); // Reset error state
    const response = await fetch("http://localhost:5000/get_generated_para");
    const data = await response.json();
    setLoading(false); // Set loading to false after fetching

    if (!response.ok) {
      setError("There was an error retrieving your writing content."); // Set error message
      return;
    }
    setText(data.generated_text);
  }

  // Function to handle form submission
  async function onSubmit(values) {
    setLoading(true); // Set loading to true when calculating speed
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds
    const wordsTyped = values.input.trim().split(" ").length; // Count words
    const wpm = Math.round((wordsTyped / timeTaken) * 60); // Calculate WPM
    setTypingSpeed(wpm);
    setLoading(false); // Set loading to false after calculation
  }

  // Function to handle input change
  const handleChange = (e) => {
    if (!isTesting) {
      setStartTime(new Date()); // Start the timer
      setIsTesting(true);
    }
    form.setValue("input", e.target.value); // Update input value
  };

  return (
    <div className="bg-black text-white max-4xl mx-auto p-10 h-screen">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col leading-[1rem]">
          <h1 className="text-8xl font-semibold">Turbo</h1>
          <p className="text-sm opacity-50 px-4">
            A place where you test your speed
          </p>
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex flex-col px-4 gap-2">
            <h1 className="text-4xl font-semibold">Generated Text</h1>
            {loading ? (
              <Skeleton className="h-4 w-full rounded" />
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <p>{text}</p>
            )}
            <div className="w-full flex items-center justify-end">
              <Button onClick={onReload} className="bg-white text-blue-500">
                <RefreshCcwDotIcon className="w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-1 px-4 mt-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="input"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Place for you to type and practice</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Start typing"
                          {...field}
                          onChange={handleChange}
                          className="border border-blue-500 outline-blue-500 text-white bg-transparent"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="mt-4 text-blue-500"
                >
                  Let's get the score!
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="w-full px-6">
          {!loading ? typingSpeed !== null && (
            <div className="flex flex-col gap-6 p-4 mt-[2rem] rounded-lg bg-white text-black">
              <h1 className="text-4xl font-semibold">
                Typing speed <span className="text-2xl opacity-80">is</span>
              </h1>
              <p className="px-2 text-6xl font-semibold text-blue-500">
                {typingSpeed} WPM
              </p>
            </div>
          ):(
            <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}