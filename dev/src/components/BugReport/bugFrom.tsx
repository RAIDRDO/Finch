import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { BugFrom } from "@/shared/types"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "../ui/use-toast"





export function BugForm({handleSubmitBugReport}: {handleSubmitBugReport: (surveyData:BugFrom) => Promise<void>}) {
    const {toast} = useToast()
    const formSchema = z.object({
  App: z.string().nonempty({ message: "Please enter your app name" }),
  Issue: z.string().nonempty({ message: "Please enter your issue" }),
 
}) 

    
 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      App: "Finch",
    },
  })
  // ...

  return (
    <Form {...form} >
      <form className="space-y-8" onSubmit={form.handleSubmit(
        e=>{
        
        
        handleSubmitBugReport(form.getValues()).then(()=>{
            toast({title:"Bug Report Submitted",description:"Thank you for your report",})

        })
      })}>
        <FormField
          control={form.control}
          name="App"
          render={({ field }) => (
            <FormItem>
              <FormLabel>App Name</FormLabel>
              <FormControl>
                <Input disabled placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         
        
       
      
       
        <FormField
          control={form.control}
          name="Issue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What Bug/Issue did you encounter?
              </FormLabel>
              <FormControl>
                <Textarea placeholder=""  {...field} />
              </FormControl>
              <FormDescription>
                Please be as specific as possible and please describe the steps you took and data you entered before encountering the issue/bug
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex flex-row justify-end">
                    <Button  type="submit">Submit</Button>

            
        </div>
      </form>
    </Form>
  )
}
