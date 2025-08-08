import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'delete';
  entityType: 'attraction' | 'festival' | 'cuisine' | 'heritage' | 'clothing';
  entity?: any;
  onSuccess: () => void;
  regions?: any[];
}

export function GenericModal({ isOpen, onClose, mode, entityType, entity, onSuccess, regions }: GenericModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (entity && mode === 'edit') {
      setFormData({ ...entity });
    } else if (mode === 'create') {
      setFormData(getDefaultFormData());
    }
  }, [entity, mode, entityType]);

  const getDefaultFormData = () => {
    switch (entityType) {
      case 'attraction':
        return {
          name_en: '',
          name_ar: '',
          name_fr: '',
          name_it: '',
          name_es: '',
          description_en: '',
          description_ar: '',
          description_fr: '',
          description_it: '',
          description_es: '',
          category_en: '',
          category_ar: '',
          category_fr: '',
          category_it: '',
          category_es: '',
          regionId: regions && regions.length > 0 ? regions[0].id : '',
          latitude: 0,
          longitude: 0,
          imageUrls: [],
          rating: 0,
          tags: [],
          entryFee: 0,
          currency: 'MAD',
        };
      case 'festival':
        return {
          name: '',
          description: '',
          type: '',
          location: '',
          regionId: '',
          timeOfYear: '',
          duration: 1,
          images: [],
          videoUrl: '',
          established: '',
          historicalSignificance: '',
        };
      case 'cuisine':
        return {
          name: '',
          description: '',
          type: '',
          regionIds: [],
          ingredients: [],
          spiceLevel: 'mild',
          images: [],
          videoUrl: '',
          popularVariants: [],
        };
      case 'heritage':
        return {
          name: '',
          description: '',
          type: '',
          regionIds: [],
          images: [],
          videoUrl: '',
          importance: '',
        };
      case 'clothing':
        return {
          name: '',
          description: '',
          gender: 'unisex',
          regionIds: [],
          materials: [],
          occasions: [],
          images: [],
          historicalNotes: '',
        };
      default:
        return {};
    }
  };

  const getApiMethod = (operation: 'create' | 'update' | 'delete') => {
    const methods = {
      attraction: {
        create: apiService.createAttraction,
        update: apiService.updateAttraction,
        delete: apiService.deleteAttraction,
      },
      festival: {
        create: apiService.createFestival,
        update: apiService.updateFestival,
        delete: apiService.deleteFestival,
      },
      cuisine: {
        create: apiService.createCuisine,
        update: apiService.updateCuisine,
        delete: apiService.deleteCuisine,
      },
      heritage: {
        create: apiService.createHeritage,
        update: apiService.updateHeritage,
        delete: apiService.deleteHeritage,
      },
      clothing: {
        create: apiService.createClothing,
        update: apiService.updateClothing,
        delete: apiService.deleteClothing,
      },
    };
    return methods[entityType][operation];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Submitting form data:', formData);
      console.log('Entity type:', entityType);
      console.log('Mode:', mode);
      
      // Ensure arrays are properly formatted
      const processedFormData = { ...formData };
      
      // Handle image files conversion
      if (formData.images && formData.images.length > 0 && formData.images[0] instanceof File) {
        const imageUrls = [];
        for (const file of formData.images) {
          const reader = new FileReader();
          const url = await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
          imageUrls.push(url);
        }
        processedFormData.images = imageUrls;
      }
      
      // Handle arrays for different entity types
      if (entityType === 'cuisine') {
        processedFormData.regionIds = Array.isArray(formData.regionIds) ? formData.regionIds : [];
        processedFormData.ingredients = Array.isArray(formData.ingredients) ? formData.ingredients : [];
        processedFormData.popularVariants = Array.isArray(formData.popularVariants) ? formData.popularVariants : [];
        processedFormData.images = Array.isArray(processedFormData.images) ? processedFormData.images : [];
      } else if (entityType === 'heritage') {
        processedFormData.regionIds = Array.isArray(formData.regionIds) ? formData.regionIds : [];
        processedFormData.images = Array.isArray(processedFormData.images) ? processedFormData.images : [];
      } else if (entityType === 'clothing') {
        processedFormData.regionIds = Array.isArray(formData.regionIds) ? formData.regionIds : [];
        processedFormData.materials = Array.isArray(formData.materials) ? formData.materials : [];
        processedFormData.occasions = Array.isArray(formData.occasions) ? formData.occasions : [];
        processedFormData.images = Array.isArray(processedFormData.images) ? processedFormData.images : [];
      } else if (entityType === 'festival') {
        processedFormData.images = Array.isArray(processedFormData.images) ? processedFormData.images : [];
      }
      
      console.log('Processed form data:', processedFormData);
      
      if (mode === 'create') {
        const createMethod = getApiMethod('create');
        console.log('Create method:', createMethod);
        const result = await createMethod(processedFormData);
        console.log('Create result:', result);
        toast({
          title: t('crud.success'),
          description: t(`crud.${entityType}Created`),
        });
      } else if (mode === 'edit' && entity) {
        const updateMethod = getApiMethod('update');
        console.log('Update method:', updateMethod);
        const result = await updateMethod(entity.id, processedFormData);
        console.log('Update result:', result);
        toast({
          title: t('crud.success'),
          description: t(`crud.${entityType}Updated`),
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast({
        title: t('crud.error'),
        description: t('crud.operationFailed'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!entity) return;
    
    setIsLoading(true);
    try {
      const deleteMethod = getApiMethod('delete');
      await deleteMethod(entity.id);
      toast({
        title: t('crud.success'),
        description: t(`crud.${entityType}Deleted`),
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: t('crud.error'),
        description: t('crud.operationFailed'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (entityType) {
             case 'attraction':
         return (
           <>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="name_en">Name (English)</Label>
                 <Input
                   id="name_en"
                   value={formData.name_en || ''}
                   onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                   required
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="category_en">Category (English)</Label>
                 <Input
                   id="category_en"
                   value={formData.category_en || ''}
                   onChange={(e) => setFormData({ ...formData, category_en: e.target.value })}
                 />
               </div>
             </div>
             <div className="space-y-2">
               <Label htmlFor="description_en">Description (English)</Label>
               <Textarea
                 id="description_en"
                 value={formData.description_en || ''}
                 onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                 rows={3}
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="regionId">Region</Label>
               <select
                 id="regionId"
                 value={formData.regionId || ''}
                 onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                 required
               >
                 <option value="">Select a region</option>
                 {regions?.map((region) => (
                   <option key={region.id} value={region.id}>
                     {region.name_en || region.name}
                   </option>
                 ))}
               </select>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="latitude">Latitude</Label>
                 <Input
                   id="latitude"
                   type="number"
                   step="any"
                   value={formData.latitude || 0}
                   onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="longitude">Longitude</Label>
                 <Input
                   id="longitude"
                   type="number"
                   step="any"
                   value={formData.longitude || 0}
                   onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                 />
               </div>
             </div>
           </>
         );
      case 'festival':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={formData.type || ''}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeOfYear">Time of Year</Label>
                <Input
                  id="timeOfYear"
                  value={formData.timeOfYear || ''}
                  onChange={(e) => setFormData({ ...formData, timeOfYear: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration || 1}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="regionId">Region ID</Label>
              <Input
                id="regionId"
                value={formData.regionId || ''}
                onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                placeholder="Enter region ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="established">Established</Label>
              <Input
                id="established"
                value={formData.established || ''}
                onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                placeholder="e.g., 1960s"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="historicalSignificance">Historical Significance</Label>
              <Textarea
                id="historicalSignificance"
                value={formData.historicalSignificance || ''}
                onChange={(e) => setFormData({ ...formData, historicalSignificance: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl || ''}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="YouTube or other video URL"
              />
            </div>
          </>
        );
      case 'cuisine':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={formData.type || ''}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spiceLevel">Spice Level</Label>
                <select
                  id="spiceLevel"
                  value={formData.spiceLevel || 'mild'}
                  onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="none">None</option>
                  <option value="mild">Mild</option>
                  <option value="medium">Medium</option>
                  <option value="hot">Hot</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
              <Input
                id="ingredients"
                value={Array.isArray(formData.ingredients) ? formData.ingredients.join(', ') : ''}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value.split(',').map(item => item.trim()).filter(item => item) })}
                placeholder="e.g., lamb, couscous, vegetables"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="popularVariants">Popular Variants (comma-separated)</Label>
              <Input
                id="popularVariants"
                value={Array.isArray(formData.popularVariants) ? formData.popularVariants.join(', ') : ''}
                onChange={(e) => setFormData({ ...formData, popularVariants: e.target.value.split(',').map(item => item.trim()).filter(item => item) })}
                placeholder="e.g., spicy version, vegetarian version"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regionIds">Regions (comma-separated IDs)</Label>
              <Input
                id="regionIds"
                value={Array.isArray(formData.regionIds) ? formData.regionIds.join(', ') : ''}
                onChange={(e) => setFormData({ ...formData, regionIds: e.target.value.split(',').map(item => item.trim()).filter(item => item) })}
                placeholder="e.g., region1, region2"
              />
            </div>
          </>
        );
      case 'heritage':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regionIds">Regions (comma-separated IDs)</Label>
              <Input
                id="regionIds"
                value={Array.isArray(formData.regionIds) ? formData.regionIds.join(', ') : ''}
                onChange={(e) => setFormData({ ...formData, regionIds: e.target.value.split(',').map(item => item.trim()).filter(item => item) })}
                placeholder="e.g., region1, region2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="importance">Importance</Label>
              <Textarea
                id="importance"
                value={formData.importance || ''}
                onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
                rows={2}
              />
            </div>
          </>
        );
      case 'clothing':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender || 'unisex'}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="materials">Materials (comma-separated)</Label>
              <Input
                id="materials"
                value={Array.isArray(formData.materials) ? formData.materials.join(', ') : ''}
                onChange={(e) => setFormData({ ...formData, materials: e.target.value.split(',').map(item => item.trim()).filter(item => item) })}
                placeholder="e.g., cotton, silk, wool"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occasions">Occasions (comma-separated)</Label>
              <Input
                id="occasions"
                value={Array.isArray(formData.occasions) ? formData.occasions.join(', ') : ''}
                onChange={(e) => setFormData({ ...formData, occasions: e.target.value.split(',').map(item => item.trim()).filter(item => item) })}
                placeholder="e.g., weddings, daily wear, celebrations"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="regionIds">Regions (comma-separated IDs)</Label>
              <Input
                id="regionIds"
                value={Array.isArray(formData.regionIds) ? formData.regionIds.join(', ') : ''}
                onChange={(e) => setFormData({ ...formData, regionIds: e.target.value.split(',').map(item => item.trim()).filter(item => item) })}
                placeholder="e.g., region1, region2"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (mode === 'delete') {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t(`crud.delete${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`)}</AlertDialogTitle>
            <AlertDialogDescription>
              {t(`crud.delete${entityType.charAt(0).toUpperCase() + entityType.slice(1)}Confirm`, { name: entity?.name || entity?.name_en })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {t('crud.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? t('crud.deleting') : t('crud.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t(`crud.create${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`) : t(`crud.edit${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`)}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? t(`crud.create${entityType.charAt(0).toUpperCase() + entityType.slice(1)}Desc`) : t(`crud.edit${entityType.charAt(0).toUpperCase() + entityType.slice(1)}Desc`)}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="images">Images</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  setFormData({ ...formData, images: Array.from(files) });
                }
              }}
            />
            {formData.images && formData.images.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Selected images:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((file, index) => (
                    <div key={index} className="text-xs text-gray-500">
                      {file instanceof File ? file.name : 'Image ' + (index + 1)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {t('crud.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('crud.saving') : (mode === 'create' ? t('crud.create') : t('crud.update'))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
