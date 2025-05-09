import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from '@/components/ui/avatar';
import { User, Edit2, Save, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserData {
  name: string;
  email: string;
  gender: string;
  age: string;
  bodyShape: string;
  height: string;
  weight: string;
  colorAnalysis: {
    skinTone: string;
    undertone: string;
    season: string;
  };
}

interface PersonalInfoCardProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  isNewUser?: boolean;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ userData, updateUserData, isNewUser = false }) => {
  const [isEditing, setIsEditing] = useState(isNewUser);
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [gender, setGender] = useState(userData.gender);
  const [age, setAge] = useState(userData.age);
  const [isBodyShapeDialogOpen, setIsBodyShapeDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const bodyShapeForm = useForm({
    defaultValues: {
      bodyShape: userData.bodyShape || ""
    }
  });
  
  const handleSaveProfile = () => {
    const updatedData = {
      name,
      email,
      gender,
      age
    };
    
    updateUserData(updatedData);
    setIsEditing(false);
    
    // Update localStorage
    localStorage.setItem('userName', name);
    
    toast({
      title: isNewUser ? "Profile Created" : "Profile Updated",
      description: isNewUser 
        ? "Your profile has been created successfully!" 
        : "Your profile information has been saved.",
    });
    
    if (isNewUser) {
      navigate('/');
    }
  };
  
  const handleBodyShapeSubmit = (data: { bodyShape: string }) => {
    updateUserData({ bodyShape: data.bodyShape });
    
    // Update localStorage
    const onboardingData = JSON.parse(localStorage.getItem('onboardingData') || '{}');
    onboardingData.bodyShape = data.bodyShape;
    localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    
    setIsBodyShapeDialogOpen(false);
    
    toast({
      title: "Body Shape Updated",
      description: "Your body shape has been updated successfully.",
    });
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{isNewUser ? "Complete Your Profile" : "Personal Information"}</CardTitle>
          <CardDescription>
            {isNewUser 
              ? "Please provide your personal details to enhance your styling experience." 
              : "Update your account details and personal information."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <User className="h-12 w-12" />
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                {isEditing ? (
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your full name"
                    required={isNewUser}
                  />
                ) : (
                  <div className="text-lg">{userData.name}</div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                {isEditing ? (
                  <Input 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required={isNewUser}
                  />
                ) : (
                  <div className="text-lg">{userData.email}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium mb-1 block">Gender</label>
              {isEditing ? (
                <Select 
                  value={gender} 
                  onValueChange={setGender}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Non-binary">Non-binary</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-lg">{userData.gender || "Not specified"}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium mb-1 block">Age</label>
              {isEditing ? (
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                />
              ) : (
                <div className="text-lg">{userData.age || "Not specified"}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium mb-1 block">Body Shape</label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsBodyShapeDialogOpen(true)}
                  className="text-xs h-7"
                >
                  {userData.bodyShape ? "Change" : "Add"}
                </Button>
              </div>
              <div className="text-lg">
                {userData.bodyShape || "Not specified"}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium mb-1 block">Height & Weight</label>
              <div className="text-lg">
                {userData.height && userData.weight 
                  ? `${userData.height} cm, ${userData.weight} kg` 
                  : "Not specified"}
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Color Analysis Results</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-secondary rounded-lg p-4 text-center">
                <div className="font-medium text-sm mb-1">Skin Tone</div>
                <div className="text-lg">{userData.colorAnalysis.skinTone}</div>
              </div>
              <div className="bg-secondary rounded-lg p-4 text-center">
                <div className="font-medium text-sm mb-1">Undertone</div>
                <div className="text-lg">{userData.colorAnalysis.undertone}</div>
              </div>
              <div className="bg-secondary rounded-lg p-4 text-center">
                <div className="font-medium text-sm mb-1">Season</div>
                <div className="text-lg">{userData.colorAnalysis.season}</div>
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <Link to="/color-analysis" className="underline">Re-analyze your colors</Link>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {isEditing ? (
            <div className="space-x-2">
              <Button onClick={handleSaveProfile}>
                {isNewUser ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Profile
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              {!isNewUser && (
                <Button variant="ghost" onClick={() => {
                  setIsEditing(false);
                  setName(userData.name);
                  setEmail(userData.email);
                  setGender(userData.gender);
                  setAge(userData.age);
                }}>
                  Cancel
                </Button>
              )}
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Body Shape Dialog */}
      <Dialog open={isBodyShapeDialogOpen} onOpenChange={setIsBodyShapeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Body Shape</DialogTitle>
            <DialogDescription>
              Select the body shape that best represents you to get better style recommendations.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...bodyShapeForm}>
            <form onSubmit={bodyShapeForm.handleSubmit(handleBodyShapeSubmit)} className="space-y-6">
              <FormField
                control={bodyShapeForm.control}
                name="bodyShape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Shape</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a body shape" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pear">Pear</SelectItem>
                        <SelectItem value="Apple">Apple</SelectItem>
                        <SelectItem value="Rectangle">Rectangle</SelectItem>
                        <SelectItem value="Hourglass">Hourglass</SelectItem>
                        <SelectItem value="Inverted Triangle">Inverted Triangle</SelectItem>
                        <SelectItem value="Athletic">Athletic</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps us recommend clothing that flatters your body type.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PersonalInfoCard;
