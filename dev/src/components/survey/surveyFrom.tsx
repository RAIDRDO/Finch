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
import { SurveyFrom } from "@/shared/types"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "../ui/use-toast"





export function SurveyForm({handleSubmitFeedBack}: {handleSubmitFeedBack: (surveyData:SurveyFrom) => Promise<void>}) {
    const {toast} = useToast()
    const formSchema = z.object({
  App: z.string().nonempty({ message: "Please enter your app name" }),
  lookAndFeel: z.enum(["1","2","3","4","5"]),
  easeOfUse:z.enum(["1","2","3","4","5"]),
  meetNeeds:z.enum(["1","2","3","4","5"]),
  likeMost:z.string().nonempty({ message: "Please enter what you like most about the app" }),
  likeLeast:z.string().nonempty({ message: "Please enter what you like least about the app" }),
  suggestions:z.string().nonempty({ message: "Please enter your suggestions" }),
  overall:z.enum(["1","2","3","4","5"])
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
        
        
        handleSubmitFeedBack(form.getValues()).then(()=>{
            toast({title:"Feedback Submitted",description:"Thank you for your feedback",})

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
          name="lookAndFeel"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>On a scale of 1-5 rate the look and feel of the app </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row items-center  space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormLabel className="font-bold">
                        1
                    </FormLabel>
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                   
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                   
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="4" />
                    </FormControl>
                   
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="5" />
                    </FormControl>
                    <FormLabel className="font-bold">5</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 
        
        
        <FormField
          control={form.control}
          name="easeOfUse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                On a scale of 1-5 rate the ease of use of the app
              </FormLabel>
               <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row items-center  space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormLabel className="font-bold">
                        1
                    </FormLabel>
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                   
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                   
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="4" />
                    </FormControl>
                   
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="5" />
                    </FormControl>
                    <FormLabel className="font-bold">5</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="meetNeeds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                On a scale of 1-5 rate how well the app meets your needs
              </FormLabel>
                <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row items-center  space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormLabel className="font-bold">
                        1
                    </FormLabel>
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                   
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                   
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="4" />
                    </FormControl>
                   
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="5" />
                    </FormControl>
                    <FormLabel className="font-bold">5</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="likeMost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What do you like most about the app?
              </FormLabel>
              <FormControl>
                <Textarea placeholder="" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                Please be as specific as possible
              </FormDescription>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="likeLeast"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What do you like least about the app?
              </FormLabel>
              <FormControl>
                <Textarea placeholder="" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                Please be as specific as possible
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="suggestions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Do you have any suggestions for improving the app?
              </FormLabel>
              <FormControl>
                <Textarea placeholder="" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                Please be as specific as possible
              </FormDescription>
              
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="overall"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                On a scale of 1-5 rate the overall experience of the app
              </FormLabel>
                <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row items-center  space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormLabel className="font-bold">
                        1
                    </FormLabel>
                    <FormControl>
                      <RadioGroupItem value="1" />
                    </FormControl>
                    
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                   
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                   
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 ">
                    <FormControl>
                      <RadioGroupItem value="4" />
                    </FormControl>
                   
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="5" />
                    </FormControl>
                    <FormLabel className="font-bold">5</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
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
