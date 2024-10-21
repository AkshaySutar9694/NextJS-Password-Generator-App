"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const checkBoxItems = [
  {
    id: "upperCaseLettersRequired",
    label: "Have uppercase letters in password",
  },
  {
    id: "lowerCaseLettersRequired",
    label: "Have lowercase letters in password",
  },
  {
    id: "numbersRequired",
    label: "Have numbers in password",
  },
  {
    id: "symbolsRequired",
    label: "Have symbols/speacial characters in password",
  },
];

const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numericLetters = "0123456789";
const symobolicLetters = "!@#$%^&*()_+";

const formSchema = z.object({
  passwordLength: z
    .string()
    .min(1, { message: "Password length value is required" }),
  constraints: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one constraint!",
    }),
});

export default function Home() {
  const [passwordGenerted, setPasswordGenerted] = React.useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passwordLength: "",
      constraints: ["upperCaseLettersRequired", "lowerCaseLettersRequired"],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const passwordLength = values.passwordLength;
    let passwordStringValue = "";
    let createdPassword = "";
    values.constraints.forEach((element) => {
      if (element === "upperCaseLettersRequired") {
        passwordStringValue = passwordStringValue + uppercaseLetters;
      }
      if (element === "lowerCaseLettersRequired") {
        passwordStringValue = passwordStringValue + lowercaseLetters;
      }
      if (element === "numbersRequired") {
        passwordStringValue = passwordStringValue + numericLetters;
      }
      if (element === "symbolsRequired") {
        passwordStringValue = passwordStringValue + symobolicLetters;
      }
    });
    for (let index = 0; index < Number(passwordLength); index++) {
      const randomIndex = Math.floor(
        Math.random() * passwordStringValue.length
      );
      createdPassword = createdPassword + passwordStringValue[randomIndex];
    }
    setPasswordGenerted(createdPassword);
  }

  return (
    <div className="flex flex-col p-6 min-h-screen items-center justify-center">
      <Card className="max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle>Password Generator</CardTitle>
          <CardDescription>
            Generate rondom passaords based on your priority!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="passwordLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter legth of password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter length of password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="constraints"
                render={({ field }) => (
                  <FormItem>
                    {checkBoxItems.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="constraints"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col ">
          <div className="text-sm">Generated password</div>
          <div className="text-lg font-semibold">{passwordGenerted}</div>
        </CardFooter>
      </Card>
    </div>
  );
}
