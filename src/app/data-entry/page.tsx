'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DataField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'boolean';
  required: boolean;
  options?: string[];
  placeholder?: string;
  value: any;
}

export default function DataEntryPage() {
  const [currentCategory, setCurrentCategory] = useState('customer');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Mock data categories and schemas
  const categories = {
    customer: {
      name: 'Customer Data',
      icon: '👥',
      description: 'Customer information and contact details',
      fields: [
        { id: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'Enter first name', value: '' },
        { id: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Enter last name', value: '' },
        { id: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'customer@example.com', value: '' },
        { id: 'phone', label: 'Phone Number', type: 'text', required: false, placeholder: '+1 (555) 123-4567', value: '' },
        { id: 'company', label: 'Company', type: 'text', required: false, placeholder: 'Company name', value: '' },
        { id: 'customerType', label: 'Customer Type', type: 'select', required: true, options: ['Individual', 'Business', 'Enterprise'], value: '' },
        { id: 'notes', label: 'Notes', type: 'textarea', required: false, placeholder: 'Additional notes...', value: '' },
        { id: 'isActive', label: 'Active Customer', type: 'boolean', required: false, value: true },
      ] as DataField[],
    },
    product: {
      name: 'Product Data',
      icon: '📦',
      description: 'Product information and inventory details',
      fields: [
        { id: 'productName', label: 'Product Name', type: 'text', required: true, placeholder: 'Enter product name', value: '' },
        { id: 'sku', label: 'SKU', type: 'text', required: true, placeholder: 'PROD-001', value: '' },
        { id: 'category', label: 'Category', type: 'select', required: true, options: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'], value: '' },
        { id: 'price', label: 'Price', type: 'number', required: true, placeholder: '0.00', value: 0 },
        { id: 'quantity', label: 'Quantity', type: 'number', required: true, placeholder: '0', value: 0 },
        { id: 'description', label: 'Description', type: 'textarea', required: false, placeholder: 'Product description...', value: '' },
        { id: 'isAvailable', label: 'Available for Sale', type: 'boolean', required: false, value: true },
      ] as DataField[],
    },
    inventory: {
      name: 'Inventory Data',
      icon: '📊',
      description: 'Stock levels and warehouse information',
      fields: [
        { id: 'itemCode', label: 'Item Code', type: 'text', required: true, placeholder: 'ITEM-001', value: '' },
        { id: 'itemName', label: 'Item Name', type: 'text', required: true, placeholder: 'Enter item name', value: '' },
        { id: 'warehouse', label: 'Warehouse', type: 'select', required: true, options: ['Warehouse A', 'Warehouse B', 'Warehouse C'], value: '' },
        { id: 'currentStock', label: 'Current Stock', type: 'number', required: true, placeholder: '0', value: 0 },
        { id: 'minStock', label: 'Minimum Stock Level', type: 'number', required: true, placeholder: '0', value: 0 },
        { id: 'maxStock', label: 'Maximum Stock Level', type: 'number', required: false, placeholder: '0', value: 0 },
        { id: 'lastRestocked', label: 'Last Restocked', type: 'date', required: false, value: '' },
        { id: 'needsReorder', label: 'Needs Reorder', type: 'boolean', required: false, value: false },
      ] as DataField[],
    },
  };

  const getCurrentFields = (): DataField[] => {
    return categories[currentCategory as keyof typeof categories]?.fields || [];
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSave = async (isDraft: boolean = false) => {
    setIsSaving(true);
    
    // Mock save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLastSaved(new Date());
    setIsSaving(false);
    
    if (!isDraft) {
      // Clear form after save
      setFormData({});
    }
  };

  const handleReset = () => {
    setFormData({});
  };

  const isFormValid = () => {
    const fields = getCurrentFields();
    return fields.filter(field => field.required).every(field => {
      const value = formData[field.id] !== undefined ? formData[field.id] : field.value;
      return value !== '' && value !== null && value !== undefined;
    });
  };

  const renderField = (field: DataField) => {
    const value = formData[field.id] !== undefined ? formData[field.id] : field.value;

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || 0)}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            rows={3}
          />
        );

      case 'select':
        return (
          <Select value={value} onValueChange={(newValue) => handleFieldChange(field.id, newValue)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={field.id}
              checked={value}
              onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
            />
            <Label htmlFor={field.id} className="text-sm font-normal">
              Yes
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Entry</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage data entries across different categories.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {lastSaved && (
              <p className="text-sm text-muted-foreground">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            )}
            <Badge variant="secondary">
              Auto-save: ON
            </Badge>
          </div>
        </div>

        {/* Category Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Data Category</CardTitle>
            <CardDescription>
              Choose the type of data you want to enter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentCategory} onValueChange={setCurrentCategory}>
              <TabsList className="grid w-full grid-cols-3">
                {Object.entries(categories).map(([key, category]) => (
                  <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                    <span>{category.icon}</span>
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Data Entry Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {categories[currentCategory as keyof typeof categories]?.icon}
              </span>
              <div>
                <CardTitle>
                  {categories[currentCategory as keyof typeof categories]?.name}
                </CardTitle>
                <CardDescription>
                  {categories[currentCategory as keyof typeof categories]?.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getCurrentFields().map((field) => (
                  <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <Label htmlFor={field.id} className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    <div className="mt-2">
                      {renderField(field)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                <div className="flex items-center space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={isSaving}
                  >
                    Reset Form
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleSave(true)}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save as Draft'}
                  </Button>
                </div>

                <div className="flex items-center space-x-3">
                  {!isFormValid() && (
                    <Alert className="w-auto">
                      <AlertDescription className="text-sm">
                        Please fill in all required fields
                      </AlertDescription>
                    </Alert>
                  )}
                  <Button
                    type="button"
                    onClick={() => handleSave(false)}
                    disabled={!isFormValid() || isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save & Submit'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>
              Your recently created data entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              <span className="text-4xl mb-4 block">📝</span>
              <p>No recent entries to display</p>
              <p className="text-sm mt-2">Start creating data entries to see them here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}