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
import { apiService, ApiRegion } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface RegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'delete';
  region?: ApiRegion;
  onSuccess: () => void;
}

export function RegionModal({ isOpen, onClose, mode, region, onSuccess }: RegionModalProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
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
    climate_en: '',
    climate_ar: '',
    climate_fr: '',
    climate_it: '',
    climate_es: '',
    bestTimeToVisit_en: '',
    bestTimeToVisit_ar: '',
    bestTimeToVisit_fr: '',
    bestTimeToVisit_it: '',
    bestTimeToVisit_es: '',
    keyFacts_en: '',
    keyFacts_ar: '',
    keyFacts_fr: '',
    keyFacts_it: '',
    keyFacts_es: '',
    latitude: 0,
    longitude: 0,
    imageUrls: [] as string[],
    images: [] as File[],
  });

  useEffect(() => {
    if (region && mode === 'edit') {
      setFormData({
        name_en: region.name_en || '',
        name_ar: region.name_ar || '',
        name_fr: region.name_fr || '',
        name_it: region.name_it || '',
        name_es: region.name_es || '',
        description_en: region.description_en || '',
        description_ar: region.description_ar || '',
        description_fr: region.description_fr || '',
        description_it: region.description_it || '',
        description_es: region.description_es || '',
        climate_en: region.climate_en || '',
        climate_ar: region.climate_ar || '',
        climate_fr: region.climate_fr || '',
        climate_it: region.climate_it || '',
        climate_es: region.climate_es || '',
        bestTimeToVisit_en: region.bestTimeToVisit_en || '',
        bestTimeToVisit_ar: region.bestTimeToVisit_ar || '',
        bestTimeToVisit_fr: region.bestTimeToVisit_fr || '',
        bestTimeToVisit_it: region.bestTimeToVisit_it || '',
        bestTimeToVisit_es: region.bestTimeToVisit_es || '',
        keyFacts_en: region.keyFacts_en || '',
        keyFacts_ar: region.keyFacts_ar || '',
        keyFacts_fr: region.keyFacts_fr || '',
        keyFacts_it: region.keyFacts_it || '',
        keyFacts_es: region.keyFacts_es || '',
        latitude: region.latitude || 0,
        longitude: region.longitude || 0,
        imageUrls: region.imageUrls || [],
        images: [],
      });
    } else if (mode === 'create') {
      setFormData({
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
        climate_en: '',
        climate_ar: '',
        climate_fr: '',
        climate_it: '',
        climate_es: '',
        bestTimeToVisit_en: '',
        bestTimeToVisit_ar: '',
        bestTimeToVisit_fr: '',
        bestTimeToVisit_it: '',
        bestTimeToVisit_es: '',
        keyFacts_en: '',
        keyFacts_ar: '',
        keyFacts_fr: '',
        keyFacts_it: '',
        keyFacts_es: '',
        latitude: 0,
        longitude: 0,
        imageUrls: [],
        images: [],
      });
    }
  }, [region, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Process image files if any are selected
      const processedFormData = { ...formData };
      
      if (formData.images && formData.images.length > 0 && formData.images[0] instanceof File) {
        // Upload images to server
        const formDataToUpload = new FormData();
        formData.images.forEach((file) => {
          formDataToUpload.append('images', file);
        });

        const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/upload`, {
          method: 'POST',
          body: formDataToUpload,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload images');
        }

        const uploadResult = await uploadResponse.json();
        const uploadedImageUrls = uploadResult.files.map((file: any) => file.path);
        
        // Combine existing imageUrls with new ones
        processedFormData.imageUrls = [...(formData.imageUrls || []), ...uploadedImageUrls];
      }

      if (mode === 'create') {
        await apiService.createRegion(processedFormData);
        toast({
          title: t('crud.success'),
          description: t('crud.regionCreated'),
        });
      } else if (mode === 'edit' && region) {
        await apiService.updateRegion(region.id, processedFormData);
        toast({
          title: t('crud.success'),
          description: t('crud.regionUpdated'),
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
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
    if (!region) return;
    
    setIsLoading(true);
    try {
      await apiService.deleteRegion(region.id);
      toast({
        title: t('crud.success'),
        description: t('crud.regionDeleted'),
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

  if (mode === 'delete') {
    return (
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('crud.deleteRegion')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('crud.deleteRegionConfirm', { name: region?.name_en })}
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
            {mode === 'create' ? t('crud.createRegion') : t('crud.editRegion')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? t('crud.createRegionDesc') : t('crud.editRegionDesc')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_en">Name (English)</Label>
              <Input
                id="name_en"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_ar">Name (Arabic)</Label>
              <Input
                id="name_ar"
                value={formData.name_ar}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_fr">Name (French)</Label>
              <Input
                id="name_fr"
                value={formData.name_fr}
                onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_it">Name (Italian)</Label>
              <Input
                id="name_it"
                value={formData.name_it}
                onChange={(e) => setFormData({ ...formData, name_it: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_es">Name (Spanish)</Label>
              <Input
                id="name_es"
                value={formData.name_es}
                onChange={(e) => setFormData({ ...formData, name_es: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_en">Description (English)</Label>
            <Textarea
              id="description_en"
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

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
            {/* Preview for new uploads */}
            {formData.images && formData.images.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Selected images:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((file, index) => (
                    <div key={index} className="text-xs text-gray-500 flex flex-col items-center">
                      {file instanceof File ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-20 h-20 object-cover rounded border mb-1"
                        />
                      ) : null}
                      <span>{file instanceof File ? file.name : `Image ${index + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Preview for existing images */}
            {formData.imageUrls && formData.imageUrls.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Existing images:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="text-xs text-gray-500 flex flex-col items-center">
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border mb-1"
                        onError={e => (e.currentTarget.src = '/images/morocco-default.jpg')}
                      />
                      <span>Image {index + 1}</span>
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
