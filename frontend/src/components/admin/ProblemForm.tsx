import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Problem } from '@/types/problem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Plus, Trash2 } from 'lucide-react';

const exampleSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  output: z.string().min(1, 'Output is required'),
  explanation: z.string().optional(),
});

const testCaseSchema = z.object({
  input: z.string().min(1, 'Input is required'),
  output: z.string().min(1, 'Output is required'),
  isHidden: z.boolean(),
});

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  constraints: z.string().optional(),
  inputFormat: z.string().optional(),
  outputFormat: z.string().optional(),
  examples: z.array(exampleSchema).min(1, 'At least one example is required'),
  testCases: z.array(testCaseSchema).optional(),
  hints: z.string().optional(), // We'll manage as comma-separated string for simplicity in UI, then split
  editorial: z.string().optional(),
  tags: z.string().optional(), // Comma-separated
  companyTags: z.string().optional(), // Comma-separated
});

export type ProblemFormValues = z.infer<typeof formSchema>;

interface ProblemFormProps {
  initialData?: Problem;
  onSubmit: (data: Partial<Problem>) => void;
  isLoading: boolean;
}

export default function ProblemForm({ initialData, onSubmit, isLoading }: ProblemFormProps) {
  const form = useForm<ProblemFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      difficulty: initialData?.difficulty || 'Easy',
      description: initialData?.description || '',
      constraints: initialData?.constraints || '',
      inputFormat: initialData?.inputFormat || '',
      outputFormat: initialData?.outputFormat || '',
      examples: initialData?.examples || [{ input: '', output: '', explanation: '' }],
      testCases: initialData?.testCases || [],
      hints: initialData?.hints?.join(', ') || '',
      editorial: initialData?.editorial || '',
      tags: initialData?.tags?.join(', ') || '',
      companyTags: initialData?.companyTags?.join(', ') || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'examples',
  });

  const { fields: testCaseFields, append: appendTestCase, remove: removeTestCase } = useFieldArray({
    control: form.control,
    name: 'testCases',
  });

  const handleSubmit = (values: ProblemFormValues) => {
    const formattedData: Partial<Problem> = {
      ...values,
      hints: values.hints ? values.hints.split(',').map((s) => s.trim()).filter(Boolean) : [],
      tags: values.tags ? values.tags.split(',').map((s) => s.trim()).filter(Boolean) : [],
      companyTags: values.companyTags ? values.companyTags.split(',').map((s) => s.trim()).filter(Boolean) : [],
    };
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Two Sum" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Markdown supported)</FormLabel>
              <FormControl>
                <Textarea placeholder="Problem description..." className="h-40 font-mono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="inputFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input Format</FormLabel>
                <FormControl>
                  <Textarea placeholder="Input format description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="outputFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Output Format</FormLabel>
                <FormControl>
                  <Textarea placeholder="Output format description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="constraints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Constraints</FormLabel>
              <FormControl>
                <Textarea placeholder="- 10^4 <= nums.length <= 10^4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-lg font-medium">Examples</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ input: '', output: '', explanation: '' })}>
              <Plus className="h-4 w-4 mr-2" /> Add Example
            </Button>
          </div>
          
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-border rounded-lg relative space-y-4 bg-muted/20">
              {index > 0 && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`examples.${index}.input`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Input</FormLabel>
                      <FormControl>
                        <Textarea className="h-20 font-mono text-sm" placeholder="nums = [2,7,11,15], target = 9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`examples.${index}.output`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Output</FormLabel>
                      <FormControl>
                        <Textarea className="h-20 font-mono text-sm" placeholder="[0,1]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`examples.${index}.explanation`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Explanation (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Because nums[0] + nums[1] == 9, we return [0, 1]." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-lg font-medium">Test Cases (For Execution)</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => appendTestCase({ input: '', output: '', isHidden: false })}>
              <Plus className="h-4 w-4 mr-2" /> Add Test Case
            </Button>
          </div>
          
          {testCaseFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-border rounded-lg relative space-y-4 bg-muted/20">
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeTestCase(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`testCases.${index}.input`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Input</FormLabel>
                      <FormControl>
                        <Textarea className="h-20 font-mono text-sm" placeholder="2\n2 7\n9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`testCases.${index}.output`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Output</FormLabel>
                      <FormControl>
                        <Textarea className="h-20 font-mono text-sm" placeholder="[0,1]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`testCases.${index}.isHidden`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4 shadow-sm bg-background">
                    <FormControl>
                      <input 
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Hidden Test Case
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        If checked, this test case will be executed during submission but hidden from the user.
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (Comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="Array, Hash Table" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyTags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Tags (Comma separated)</FormLabel>
                <FormControl>
                  <Input placeholder="Amazon, Google, Microsoft" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="hints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hints (Comma separated)</FormLabel>
              <FormControl>
                <Textarea placeholder="A really brute force way would be to search for all possible pairs of numbers..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="editorial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Editorial (Markdown supported)</FormLabel>
              <FormControl>
                <Textarea className="h-40 font-mono" placeholder="Detailed solution explanation..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? 'Saving...' : 'Save Problem'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
