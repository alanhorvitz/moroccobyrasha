import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '@/lib/auth/api';
import { EnhancedAuthAPI } from '@/lib/auth/enhanced-api';
import { useAuth } from '@/contexts/AuthContext';
import { AuditLogger } from '@/lib/admin/audit-logger';
// import EnhancedUserTable from '@/components/admin/EnhancedUserTable';
import AuditLogViewer from '@/components/admin/AuditLogViewer';
import {
  LayoutDashboard, Users, FileText, User, Clock, Filter, RefreshCcw, Search, ChevronLeft, ChevronRight,
  Check, X, Trash2, UserCheck, UserX, MoreHorizontal, MapPin, Landmark, Calendar, Utensils, Star, Shirt, Eye, Plus, Pencil,
  Mail, Shield, Settings, MessageSquare, Bell, Phone, Globe, Activity, CalendarDays, AlertCircle, Info
} from 'lucide-react';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger, DialogClose
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';
import { toast } from '@/hooks/use-toast';

// Types
import { AdminDashboardData, UserProfile } from '@/lib/types/auth';
import { apiService, transformApiData } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'suspended':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'banned':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Badge variant="outline" className={getStatusColor()}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { language } = useLanguage();

  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [users, setUsers] = useState<{
    users: UserProfile[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
    filters: { roles: string[]; statuses: string[] };
  } | null>(null);
  const [loading, setLoading] = useState({
    dashboard: true,
    users: true
  });
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    search: '',
    role: 'all',
    status: 'all',
    page: 1,
    limit: 10
  });
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const [regions, setRegions] = useState([]);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [regionForm, setRegionForm] = useState({
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
    capital: '',
    population: '',
    latitude: '',
    longitude: '',
    images: []
  });

  const [showManagementModal, setShowManagementModal] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<'regions' | 'attractions' | 'festivals' | 'cuisines' | 'heritage' | 'clothing' | null>(null);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [showRegionForm, setShowRegionForm] = useState(false);
  const [attractions, setAttractions] = useState([]);
  const [attractionForm, setAttractionForm] = useState({
    name_en: '', name_ar: '', name_fr: '', name_it: '', name_es: '',
    description_en: '', description_ar: '', description_fr: '', description_it: '', description_es: '',
    category_en: '', category_ar: '', category_fr: '', category_it: '', category_es: '',
    regionId: '', latitude: '', longitude: '', imageUrls: [], rating: '', tags: [], entryFee: '', currency: 'MAD', openingHours: ''
  });
  const [editingAttraction, setEditingAttraction] = useState(null);
  const [loadingAttractions, setLoadingAttractions] = useState(false);
  const [showAttractionForm, setShowAttractionForm] = useState(false);
  const [festivals, setFestivals] = useState([]);
  const [festivalForm, setFestivalForm] = useState({
    name_en: '', name_ar: '', name_fr: '', name_it: '', name_es: '',
    description_en: '', description_ar: '', description_fr: '', description_it: '', description_es: '',
    type: '', location: '', regionId: '', timeOfYear: '', duration: '', images: [], videoUrl: '', established: '', historicalSignificance: ''
  });
  const [editingFestival, setEditingFestival] = useState(null);
  const [loadingFestivals, setLoadingFestivals] = useState(false);
  const [showFestivalForm, setShowFestivalForm] = useState(false);
  const [cuisines, setCuisines] = useState([]);
  const [cuisineForm, setCuisineForm] = useState({
    name_en: '', name_ar: '', name_fr: '', name_it: '', name_es: '',
    description_en: '', description_ar: '', description_fr: '', description_it: '', description_es: '',
    type: '', regionIds: [], ingredients: [], spiceLevel: '', images: [], videoUrl: '', popularVariants: []
  });
  const [editingCuisine, setEditingCuisine] = useState(null);
  const [loadingCuisines, setLoadingCuisines] = useState(false);
  const [showCuisineForm, setShowCuisineForm] = useState(false);
  const [heritage, setHeritage] = useState([]);
  const [heritageForm, setHeritageForm] = useState({
    name_en: '', name_ar: '', name_fr: '', name_it: '', name_es: '',
    description_en: '', description_ar: '', description_fr: '', description_it: '', description_es: '',
    type: '', regionIds: [], images: [], videoUrl: '', importance: ''
  });
  const [editingHeritage, setEditingHeritage] = useState(null);
  const [loadingHeritage, setLoadingHeritage] = useState(false);
  const [showHeritageForm, setShowHeritageForm] = useState(false);
  const [clothing, setClothing] = useState([]);
  const [clothingForm, setClothingForm] = useState({
    name_en: '', name_ar: '', name_fr: '', name_it: '', name_es: '',
    description_en: '', description_ar: '', description_fr: '', description_it: '', description_es: '',
    gender: '', regionIds: [], materials: [], occasions: [], images: [], historicalNotes: ''
  });
  const [editingClothing, setEditingClothing] = useState(null);
  const [loadingClothing, setLoadingClothing] = useState(false);
  const [showClothingForm, setShowClothingForm] = useState(false);

  const fetchAttractions = async () => {
    setLoadingAttractions(true);
    try {
      const response = await apiService.getAttractions();
      if (Array.isArray(response)) {
        const transformed = response.map(attraction => transformApiData.attraction(attraction, language));
        setAttractions(transformed);
      } else {
        toast({ title: 'Error', description: 'Failed to load attractions', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load attractions', variant: 'destructive' });
    } finally {
      setLoadingAttractions(false);
    }
  };

  const handleAddAttraction = () => {
    setAttractionForm({
      name_en: '', name_ar: '', name_fr: '', name_it: '', name_es: '',
      description_en: '', description_ar: '', description_fr: '', description_it: '', description_es: '',
      category_en: '', category_ar: '', category_fr: '', category_it: '', category_es: '',
      regionId: '', latitude: '', longitude: '', imageUrls: [], rating: '', tags: [], entryFee: '', currency: 'MAD', openingHours: ''
    });
    setEditingAttraction(null);
    setShowAttractionForm(true);
  };

  const handleEditAttraction = (attraction) => {
    setAttractionForm({
      name_en: attraction.name_en || attraction.name,
      name_ar: attraction.name_ar || '',
      name_fr: attraction.name_fr || '',
      name_it: attraction.name_it || '',
      name_es: attraction.name_es || '',
      description_en: attraction.description_en || '',
      description_ar: attraction.description_ar || '',
      description_fr: attraction.description_fr || '',
      description_it: attraction.description_it || '',
      description_es: attraction.description_es || '',
      category_en: attraction.category_en || attraction.category || '',
      category_ar: attraction.category_ar || '',
      category_fr: attraction.category_fr || '',
      category_it: attraction.category_it || '',
      category_es: attraction.category_es || '',
      regionId: attraction.regionId || '',
      latitude: attraction.latitude || '',
      longitude: attraction.longitude || '',
      imageUrls: attraction.imageUrls || [],
      rating: attraction.rating || '',
      tags: attraction.tags || [],
      entryFee: attraction.entryFee || '',
      currency: attraction.currency || 'MAD',
      openingHours: attraction.openingHours || ''
    });
    setEditingAttraction(attraction);
    setShowAttractionForm(true);
  };

  const handleDeleteAttraction = async (id) => {
    if (!window.confirm('Are you sure you want to delete this attraction?')) return;
    try {
      const res = await fetch(`/api/attractions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Success', description: 'Attraction deleted successfully!' });
        fetchAttractions();
      } else {
        toast({ title: 'Error', description: 'Failed to delete attraction', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete attraction', variant: 'destructive' });
    }
  };

  const handleAttractionFormChange = (e) => {
    setAttractionForm({ ...attractionForm, [e.target.name]: e.target.value });
  };

  const handleAttractionFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingAttraction) {
        res = await fetch(`/api/attractions/${editingAttraction.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(attractionForm),
        });
      } else {
        res = await fetch('/api/attractions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(attractionForm),
        });
      }
      if (res.ok) {
        toast({ title: 'Success', description: `Attraction ${editingAttraction ? 'updated' : 'added'} successfully!` });
        setShowAttractionForm(false);
        fetchAttractions();
      } else {
        toast({ title: 'Error', description: 'Failed to save attraction', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save attraction', variant: 'destructive' });
    }
  };

  const fetchFestivals = async () => {
    setLoadingFestivals(true);
    try {
      const response = await apiService.getFestivals();
      if (Array.isArray(response)) {
        const transformed = response.map(festival => transformApiData.festival(festival, language));
        setFestivals(transformed);
      } else {
        toast({ title: 'Error', description: 'Failed to load festivals', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load festivals', variant: 'destructive' });
    } finally {
      setLoadingFestivals(false);
    }
  };

  const handleAddFestival = () => {
    setFestivalForm({
      name_en: '', name_ar: '', name_fr: '', name_it: '', name_es: '',
      description_en: '', description_ar: '', description_fr: '', description_it: '', description_es: '',
      type: '', location: '', regionId: '', timeOfYear: '', duration: '', images: [], videoUrl: '', established: '', historicalSignificance: ''
    });
    setEditingFestival(null);
    setShowFestivalForm(true);
  };

  const handleEditFestival = (festival) => {
    setFestivalForm({
      name_en: festival.name_en || festival.name,
      name_ar: festival.name_ar || '',
      name_fr: festival.name_fr || '',
      name_it: festival.name_it || '',
      name_es: festival.name_es || '',
      description_en: festival.description_en || festival.description || '',
      description_ar: festival.description_ar || '',
      description_fr: festival.description_fr || '',
      description_it: festival.description_it || '',
      description_es: festival.description_es || '',
      type: festival.type || '',
      location: festival.location || '',
      regionId: festival.regionId || '',
      timeOfYear: festival.timeOfYear || '',
      duration: festival.duration || '',
      images: festival.images || [],
      videoUrl: festival.videoUrl || '',
      established: festival.established || '',
      historicalSignificance: festival.historicalSignificance || ''
    });
    setEditingFestival(festival);
    setShowFestivalForm(true);
  };

  const handleDeleteFestival = async (id) => {
    if (!window.confirm('Are you sure you want to delete this festival?')) return;
    try {
      const res = await fetch(`/api/festivals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Success', description: 'Festival deleted successfully!' });
        fetchFestivals();
      } else {
        toast({ title: 'Error', description: 'Failed to delete festival', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete festival', variant: 'destructive' });
    }
  };

  const handleFestivalFormChange = (e) => {
    setFestivalForm({ ...festivalForm, [e.target.name]: e.target.value });
  };

  const handleFestivalFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingFestival) {
        res = await fetch(`/api/festivals/${editingFestival.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(festivalForm),
        });
      } else {
        res = await fetch('/api/festivals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(festivalForm),
        });
      }
      if (res.ok) {
        toast({ title: 'Success', description: `Festival ${editingFestival ? 'updated' : 'added'} successfully!` });
        setShowFestivalForm(false);
        fetchFestivals();
      } else {
        toast({ title: 'Error', description: 'Failed to save festival', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save festival', variant: 'destructive' });
    }
  };

  const fetchCuisines = async () => {
    setLoadingCuisines(true);
    try {
      const response = await apiService.getCuisines();
      if (Array.isArray(response)) {
        const transformed = response.map(cuisine => transformApiData.cuisine(cuisine, language));
        setCuisines(transformed);
      } else {
        toast({ title: 'Error', description: 'Failed to load cuisines', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load cuisines', variant: 'destructive' });
    } finally {
      setLoadingCuisines(false);
    }
  };

  const handleAddCuisine = () => {
    setCuisineForm({
      name_en: '', name_ar: '', name_fr: '', name_it: '', name_es: '',
      description_en: '', description_ar: '', description_fr: '', description_it: '', description_es: '',
      type: '', regionIds: [], ingredients: [], spiceLevel: '', images: [], videoUrl: '', popularVariants: []
    });
    setEditingCuisine(null);
    setShowCuisineForm(true);
  };

  const handleEditCuisine = (cuisine) => {
    setCuisineForm({
      name_en: cuisine.name_en || cuisine.name,
      name_ar: cuisine.name_ar || '',
      name_fr: cuisine.name_fr || '',
      name_it: cuisine.name_it || '',
      name_es: cuisine.name_es || '',
      description_en: cuisine.description_en || cuisine.description || '',
      description_ar: cuisine.description_ar || '',
      description_fr: cuisine.description_fr || '',
      description_it: cuisine.description_it || '',
      description_es: cuisine.description_es || '',
      type: cuisine.type || '',
      regionIds: cuisine.regionIds || [],
      ingredients: cuisine.ingredients || [],
      spiceLevel: cuisine.spiceLevel || '',
      images: cuisine.images || [],
      videoUrl: cuisine.videoUrl || '',
      popularVariants: cuisine.popularVariants || []
    });
    setEditingCuisine(cuisine);
    setShowCuisineForm(true);
  };

  const handleDeleteCuisine = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cuisine?')) return;
    try {
      const res = await fetch(`/api/cuisines/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Success', description: 'Cuisine deleted successfully!' });
        fetchCuisines();
      } else {
        toast({ title: 'Error', description: 'Failed to delete cuisine', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete cuisine', variant: 'destructive' });
    }
  };

  const handleCuisineFormChange = (e) => {
    setCuisineForm({ ...cuisineForm, [e.target.name]: e.target.value });
  };

  const handleCuisineFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingCuisine) {
        res = await fetch(`/api/cuisines/${editingCuisine.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cuisineForm),
        });
      } else {
        res = await fetch('/api/cuisines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cuisineForm),
        });
      }
      if (res.ok) {
        toast({ title: 'Success', description: `Cuisine ${editingCuisine ? 'updated' : 'added'} successfully!` });
        setShowCuisineForm(false);
        fetchCuisines();
      } else {
        toast({ title: 'Error', description: 'Failed to save cuisine', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save cuisine', variant: 'destructive' });
    }
  };

  const fetchHeritage = async () => {
    setLoadingHeritage(true);
    try {
      const response = await apiService.getHeritages();
      if (Array.isArray(response)) {
        const transformed = response.map(item => transformApiData.heritage(item, language));
        setHeritage(transformed);
      } else {
        toast({ title: 'Error', description: 'Failed to load heritage', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load heritage', variant: 'destructive' });
    } finally {
      setLoadingHeritage(false);
    }
  };

  const handleAddHeritage = () => {
    setHeritageForm({
      name_en: '', name_ar: '', name_fr: '', name_it: '', name_es: '',
      description_en: '', description_ar: '', description_fr: '', description_it: '', description_es: '',
      type: '', regionIds: [], images: [], videoUrl: '', importance: ''
    });
    setEditingHeritage(null);
    setShowHeritageForm(true);
  };

  const handleEditHeritage = (item) => {
    setHeritageForm({
      name_en: item.name_en || item.name,
      name_ar: item.name_ar || '',
      name_fr: item.name_fr || '',
      name_it: item.name_it || '',
      name_es: item.name_es || '',
      description_en: item.description_en || item.description || '',
      description_ar: item.description_ar || '',
      description_fr: item.description_fr || '',
      description_it: item.description_it || '',
      description_es: item.description_es || '',
      type: item.type || '',
      regionIds: item.regionIds || [],
      images: item.images || [],
      videoUrl: item.videoUrl || '',
      importance: item.importance || ''
    });
    setEditingHeritage(item);
    setShowHeritageForm(true);
  };

  const handleDeleteHeritage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this heritage item?')) return;
    try {
      const res = await fetch(`/api/heritages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Success', description: 'Heritage item deleted successfully!' });
        fetchHeritage();
      } else {
        toast({ title: 'Error', description: 'Failed to delete heritage item', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete heritage item', variant: 'destructive' });
    }
  };

  const handleHeritageFormChange = (e) => {
    setHeritageForm({ ...heritageForm, [e.target.name]: e.target.value });
  };

  const handleHeritageFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingHeritage) {
        res = await fetch(`/api/heritages/${editingHeritage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(heritageForm),
        });
      } else {
        res = await fetch('/api/heritages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(heritageForm),
        });
      }
      if (res.ok) {
        toast({ title: 'Success', description: `Heritage item ${editingHeritage ? 'updated' : 'added'} successfully!` });
        setShowHeritageForm(false);
        fetchHeritage();
      } else {
        toast({ title: 'Error', description: 'Failed to save heritage item', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save heritage item', variant: 'destructive' });
    }
  };

  const fetchClothing = async () => {
    setLoadingClothing(true);
    try {
      const response = await apiService.getClothing();
      if (Array.isArray(response)) {
        const transformed = response.map(item => transformApiData.clothing(item, language));
        setClothing(transformed);
      } else {
        toast({ title: 'Error', description: 'Failed to load clothing', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load clothing', variant: 'destructive' });
    } finally {
      setLoadingClothing(false);
    }
  };

  const handleAddClothing = () => {
    setClothingForm({
      name_en: '', name_ar: '', name_fr: '', name_it: '', name_es: '',
      description_en: '', description_ar: '', description_fr: '', description_it: '', description_es: '',
      gender: '', regionIds: [], materials: [], occasions: [], images: [], historicalNotes: ''
    });
    setEditingClothing(null);
    setShowClothingForm(true);
  };

  const handleEditClothing = (item) => {
    setClothingForm({
      name_en: item.name_en || item.name,
      name_ar: item.name_ar || '',
      name_fr: item.name_fr || '',
      name_it: item.name_it || '',
      name_es: item.name_es || '',
      description_en: item.description_en || item.description || '',
      description_ar: item.description_ar || '',
      description_fr: item.description_fr || '',
      description_it: item.description_it || '',
      description_es: item.description_es || '',
      gender: item.gender || '',
      regionIds: item.regionIds || [],
      materials: item.materials || [],
      occasions: item.occasions || [],
      images: item.images || [],
      historicalNotes: item.historicalNotes || ''
    });
    setEditingClothing(item);
    setShowClothingForm(true);
  };

  const handleDeleteClothing = async (id) => {
    if (!window.confirm('Are you sure you want to delete this clothing item?')) return;
    try {
      const res = await fetch(`/api/clothing/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast({ title: 'Success', description: 'Clothing item deleted successfully!' });
        fetchClothing();
      } else {
        toast({ title: 'Error', description: 'Failed to delete clothing item', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete clothing item', variant: 'destructive' });
    }
  };

  const handleClothingFormChange = (e) => {
    setClothingForm({ ...clothingForm, [e.target.name]: e.target.value });
  };

  const handleClothingFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingClothing) {
        res = await fetch(`/api/clothing/${editingClothing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clothingForm),
        });
      } else {
        res = await fetch('/api/clothing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clothingForm),
        });
      }
      if (res.ok) {
        toast({ title: 'Success', description: `Clothing item ${editingClothing ? 'updated' : 'added'} successfully!` });
        setShowClothingForm(false);
        fetchClothing();
      } else {
        toast({ title: 'Error', description: 'Failed to save clothing item', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save clothing item', variant: 'destructive' });
    }
  };

  // Fetch data when modal opens or after CRUD
  useEffect(() => {
    if (showManagementModal && selectedEntity === 'regions') {
      fetchRegions();
    }
    if (showManagementModal && selectedEntity === 'attractions') {
      fetchAttractions();
    }
    if (showManagementModal && selectedEntity === 'festivals') {
      fetchFestivals();
    }
    if (showManagementModal && selectedEntity === 'cuisines') {
      fetchCuisines();
    }
    if (showManagementModal && selectedEntity === 'heritage') {
      fetchHeritage();
    }
    if (showManagementModal && selectedEntity === 'clothing') {
      fetchClothing();
    }
  }, [showManagementModal, selectedEntity]);

  useEffect(() => {
    // Check if user has admin permissions
    if (user && user.role !== 'admin' && user.role !== 'super_admin') {
      navigate('/dashboard');
    }

    // Seed demo audit logs
    AuditLogger.seedDemoLogs();

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(prev => ({ ...prev, dashboard: true }));
        const response = await EnhancedAuthAPI.getAdminDashboard();
        if (response.success && response.data) {
          setDashboardData(response.data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        setError('An error occurred while fetching dashboard data');
      } finally {
        setLoading(prev => ({ ...prev, dashboard: false }));
      }
    };

    fetchDashboardData();
    fetchUsers();
    fetchRegions();
  }, [user, navigate]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchParams(prev => ({ ...prev, page: 1 }));
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchParams.search, searchParams.role, searchParams.status]);

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await EnhancedAuthAPI.getUsers({
        page: searchParams.page,
        limit: searchParams.limit,
        search: searchParams.search || undefined,
        role: searchParams.role === 'all' ? undefined : searchParams.role,
        status: searchParams.status === 'all' ? undefined : searchParams.status
      });

      if (response.success && response.data) {
        setUsers(response.data);
        setError(null); // Clear error on success
      } else {
        setError('Failed to load users');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => ({ ...prev, page: 1 }));
    fetchUsers();
  };

  const handleSearchChange = (value: string) => {
    setSearchParams(prev => ({ ...prev, search: value }));
  };

  const handleViewUserProfile = (user: UserProfile) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleFilter = (key: string, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value === 'all' ? '' : value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => ({ ...prev, page: newPage }));
    fetchUsers();
  };

  const handleClearFilters = () => {
    setSearchParams({
      search: '',
      role: 'all',
      status: 'all',
      page: 1,
      limit: 10
    });
  };

  const handleUpdateUserStatus = async (userId: string, status: string) => {
    setActionInProgress(userId);
    try {
      const response = await EnhancedAuthAPI.updateUserStatus(userId, status);
      if (response.success) {
        // Update the local user list with the new status
        if (users) {
          setUsers({
            ...users,
            users: users.users.map(user => 
              user.id === userId ? { ...user, status } : user
            )
          });
        }
      } else {
        setError(`Failed to update user status: ${response.message}`);
      }
    } catch (err) {
      setError('An error occurred while updating user status');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setActionInProgress(userId);
    try {
      const response = await EnhancedAuthAPI.deleteUser(userId);
      if (response.success) {
        // Remove the user from the local list
        if (users) {
          setUsers({
            ...users,
            users: users.users.filter(user => user.id !== userId),
            pagination: {
              ...users.pagination,
              total: users.pagination.total - 1
            }
          });
        }
        setConfirmDelete(null);
      } else {
        setError(`Failed to delete user: ${response.message}`);
      }
    } catch (err) {
      setError('An error occurred while deleting user');
    } finally {
      setActionInProgress(null);
    }
  };

  const fetchRegions = async () => {
    setLoadingRegions(true);
    try {
      const response = await EnhancedAuthAPI.getRegions();
      if (response.success && response.data) {
        setRegions(response.data);
      } else {
        setError('Failed to load regions');
      }
    } catch (err) {
      setError('An error occurred while fetching regions');
    } finally {
      setLoadingRegions(false);
    }
  };

  const handleEditRegion = (region) => {
    setEditingRegion(region);
    setRegionForm({
      name_en: region.name_en || region.name || '',
      name_ar: region.name_ar || '',
      name_fr: region.name_fr || '',
      name_it: region.name_it || '',
      name_es: region.name_es || '',
      description_en: region.description_en || region.description || '',
      description_ar: region.description_ar || '',
      description_fr: region.description_fr || '',
      description_it: region.description_it || '',
      description_es: region.description_es || '',
      climate_en: region.climate_en || region.climate || '',
      climate_ar: region.climate_ar || '',
      climate_fr: region.climate_fr || '',
      climate_it: region.climate_it || '',
      climate_es: region.climate_es || '',
      bestTimeToVisit_en: region.bestTimeToVisit_en || region.bestTimeToVisit || '',
      bestTimeToVisit_ar: region.bestTimeToVisit_ar || '',
      bestTimeToVisit_fr: region.bestTimeToVisit_fr || '',
      bestTimeToVisit_it: region.bestTimeToVisit_it || '',
      bestTimeToVisit_es: region.bestTimeToVisit_es || '',
      keyFacts_en: region.keyFacts_en || region.keyFacts || '',
      keyFacts_ar: region.keyFacts_ar || '',
      keyFacts_fr: region.keyFacts_fr || '',
      keyFacts_it: region.keyFacts_it || '',
      keyFacts_es: region.keyFacts_es || '',
      capital: region.capital || '',
      population: region.population || '',
      latitude: region.latitude || '',
      longitude: region.longitude || '',
      images: region.images || []
    });
    setShowRegionForm(true);
  };

  const handleAddRegion = () => {
    setRegionForm({
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
      capital: '',
      population: '',
      latitude: '',
      longitude: '',
      images: []
    });
    setEditingRegion(null);
    setShowRegionForm(true);
  };

  const handleDeleteRegion = async (id) => {
    setActionInProgress(id);
    try {
      const response = await EnhancedAuthAPI.deleteRegion(id);
      if (response.success) {
        setRegions(regions.filter(region => region.id !== id));
        setEditingRegion(null);
        setRegionForm({
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
          capital: '',
          population: '',
          latitude: '',
          longitude: '',
          images: []
        });
      } else {
        setError(`Failed to delete region: ${response.message}`);
      }
    } catch (err) {
      setError('An error occurred while deleting region');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleRegionFormChange = (e) => {
    setRegionForm({ ...regionForm, [e.target.name]: e.target.value });
  };

  const handleRegionFormSubmit = async (e) => {
    e.preventDefault();
    setActionInProgress(editingRegion ? editingRegion.id : 'new');
    try {
      let response;
      if (editingRegion) {
        response = await EnhancedAuthAPI.updateRegion(editingRegion.id, regionForm);
      } else {
        response = await EnhancedAuthAPI.createRegion(regionForm);
      }
      
      if (response.success) {
        setShowRegionForm(false);
      setEditingRegion(null);
      setRegionForm({
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
        capital: '',
        population: '',
        latitude: '',
        longitude: '',
        images: []
      });
      fetchRegions();
        toast({ 
          title: 'Success', 
          description: `Region ${editingRegion ? 'updated' : 'created'} successfully!`, 
          variant: 'default' 
        });
      } else {
        toast({ 
          title: 'Error', 
          description: response.message || 'Failed to save region', 
          variant: 'destructive' 
        });
      }
    } catch (err) {
      console.error('Region save error:', err);
      toast({ 
        title: 'Error', 
        description: 'An error occurred while saving region', 
        variant: 'destructive' 
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Function to generate colors for charts
  const getChartColors = () => [
    '#10b981', '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b',
    '#14b8a6', '#06b6d4', '#6366f1', '#d946ef', '#f97316'
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage users and platform content</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowManagementModal(true)}
          className="mt-4 md:mt-0"
        >
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Management
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {loading.dashboard ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : dashboardData ? (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-emerald-600">{dashboardData.totalUsers}</div>
                    <p className="text-gray-500 text-sm mt-1">Registered accounts</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-emerald-600">{dashboardData.activeUsers}</div>
                    <p className="text-gray-500 text-sm mt-1">
                      {Math.round((dashboardData.activeUsers / dashboardData.totalUsers) * 100)}% of total users
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">New Registrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-emerald-600">{dashboardData.newRegistrations}</div>
                    <p className="text-gray-500 text-sm mt-1">Last 7 days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">User Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-emerald-600">{dashboardData.usersByRole.tourist}</div>
                      <div className="text-sm text-gray-600">Tourists</div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-2xl font-bold text-emerald-600">{dashboardData.usersByRole.guide}</div>
                      <div className="text-sm text-gray-600">Guides</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Login Activity</CardTitle>
                    <CardDescription>User logins over the past week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart
                        data={dashboardData.loginActivity}
                        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip
                          labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                          formatter={(value) => [`${value} logins`, 'Logins']}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorLogins)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Distribution by Role</CardTitle>
                    <CardDescription>Breakdown of user account types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={Object.entries(dashboardData.usersByRole).map(([key, value]) => ({
                            name: key.charAt(0).toUpperCase() + key.slice(1),
                            value
                          }))}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#10b981"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {Object.entries(dashboardData.usersByRole).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Regions</CardTitle>
                    <CardDescription>Popular regions by user count</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dashboardData.topRegions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} users`, 'Users']} />
                        <Bar dataKey="userCount" fill="#10b981">
                          {dashboardData.topRegions.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getChartColors()[index % getChartColors().length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 flex flex-col items-center">
                <p>No dashboard data available.</p>
                <Button
                  variant="outline"
                  onClick={() => fetchUsers()}
                  className="mt-4"
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                View and manage all users on the platform
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Search & Filters */}
              <div className="space-y-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by name or email..."
                      className="pl-9"
                      value={searchParams.search}
                      onChange={(e) => handleSearchChange(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Select
                      value={searchParams.role}
                      onValueChange={(value) => handleFilter('role', value)}
                    >
                      <SelectTrigger className="h-8 w-[150px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        {users?.filters.roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={searchParams.status}
                      onValueChange={(value) => handleFilter('status', value)}
                    >
                      <SelectTrigger className="h-8 w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {users?.filters.statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-8"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>

              {/* Users Table */}
              {loading.users ? (
                <div className="flex items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                </div>
              ) : users && users.users.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                                <p className="text-xs text-gray-500">ID: {user.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-800">
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={user.status} />
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={actionInProgress === user.id}
                                >
                                  {actionInProgress === user.id ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-emerald-600" />
                                  ) : (
                                    <MoreHorizontal className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewUserProfile(user)}>
                                  <User className="h-4 w-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>

                                {user.status !== 'active' && (
                                  <DropdownMenuItem onClick={() => handleUpdateUserStatus(user.id, 'active')}>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Activate User
                                  </DropdownMenuItem>
                                )}

                                {user.status !== 'suspended' && (
                                  <DropdownMenuItem onClick={() => handleUpdateUserStatus(user.id, 'suspended')}>
                                    <UserX className="h-4 w-4 mr-2" />
                                    Suspend User
                                  </DropdownMenuItem>
                                )}

                                <Dialog open={confirmDelete === user.id} onOpenChange={(open) => !open && setConfirmDelete(null)}>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem
                                      onSelect={(e) => {
                                        e.preventDefault();
                                        setConfirmDelete(user.id);
                                      }}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Delete User</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete the user account for {user.firstName} {user.lastName}?
                                        This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => setConfirmDelete(null)}
                                        disabled={actionInProgress === user.id}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteUser(user.id)}
                                        disabled={actionInProgress === user.id}
                                      >
                                        {actionInProgress === user.id ? (
                                          <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Deleting...
                                          </>
                                        ) : (
                                          <>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                          </>
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No users found matching your criteria.</p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="mt-4"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Reset Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {users && users.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-500">
                    Showing {((users.pagination.page - 1) * users.pagination.limit) + 1}-
                    {Math.min(users.pagination.page * users.pagination.limit, users.pagination.total)} of {users.pagination.total} users
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={users.pagination.page === 1}
                      onClick={() => handlePageChange(users.pagination.page - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: users.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === users.pagination.page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`${page === users.pagination.page ? 'bg-emerald-600 hover:bg-emerald-700' : ''} w-8 h-8 p-0`}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={users.pagination.page === users.pagination.totalPages}
                      onClick={() => handlePageChange(users.pagination.page + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Track user actions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData ? (
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 border rounded-md bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{activity.user}</p>
                            <p className="text-sm text-gray-600">{activity.action}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No activity data available.</p>
                  <Button
                    variant="outline"
                    onClick={() => fetchUsers()}
                    className="mt-4"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                <FileText className="w-4 h-4 mr-2" />
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Management Modal */}
      <Dialog open={showManagementModal} onOpenChange={setShowManagementModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6 text-emerald-600" />
              Content Management
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Manage all platform content and entities in one centralized location
            </DialogDescription>
          </DialogHeader>
          
          {!selectedEntity ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-lg cursor-pointer bg-gradient-to-br from-white to-gray-50"
                  onClick={() => setSelectedEntity('regions')}
                >
                  <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200">
                        <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">Regions</h3>
                        <p className="text-sm text-gray-500">Manage geographical regions</p>
                </div>
              </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Geographical areas and cities</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                  </div>
                </div>

                <div 
                  className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg cursor-pointer bg-gradient-to-br from-white to-gray-50"
                  onClick={() => setSelectedEntity('attractions')}
                >
                  <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                        <Landmark className="w-6 h-6 text-blue-600" />
                </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">Attractions</h3>
                        <p className="text-sm text-gray-500">Tourist destinations</p>
                </div>
              </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Places of interest</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                  </div>
                </div>

                <div 
                  className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:shadow-lg cursor-pointer bg-gradient-to-br from-white to-gray-50"
                  onClick={() => setSelectedEntity('festivals')}
                >
                  <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200">
                        <Calendar className="w-6 h-6 text-pink-600" />
                </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">Festivals</h3>
                        <p className="text-sm text-gray-500">Cultural events</p>
                </div>
              </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Cultural celebrations</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                  </div>
                </div>

                <div 
                  className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-lg cursor-pointer bg-gradient-to-br from-white to-gray-50"
                  onClick={() => setSelectedEntity('cuisines')}
                >
                  <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200">
                        <Utensils className="w-6 h-6 text-orange-600" />
                </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">Cuisines</h3>
                        <p className="text-sm text-gray-500">Local food culture</p>
                </div>
              </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Traditional dishes</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                  </div>
                </div>

                <div 
                  className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-300 hover:shadow-lg cursor-pointer bg-gradient-to-br from-white to-gray-50"
                  onClick={() => setSelectedEntity('heritage')}
                >
                  <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200">
                        <Star className="w-6 h-6 text-yellow-600" />
                </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">Heritage</h3>
                        <p className="text-sm text-gray-500">Cultural heritage</p>
                </div>
              </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Historical sites</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                  </div>
                </div>

                <div 
                  className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-lg cursor-pointer bg-gradient-to-br from-white to-gray-50"
                  onClick={() => setSelectedEntity('clothing')}
                >
                  <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
                        <Shirt className="w-6 h-6 text-purple-600" />
                </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">Clothing</h3>
                        <p className="text-sm text-gray-500">Traditional attire</p>
                </div>
              </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Traditional clothing</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          ) : selectedEntity === 'regions' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedEntity(null)}
                    className="hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Entities
                  </Button>
              </div>
                <Button 
                  size="sm" 
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleAddRegion}
                >
                  <Plus className="w-4 h-4" /> 
                  Add New Region
                </Button>
              </div>

              {loadingRegions ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                    <span className="text-gray-600">Loading regions...</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="p-6 border-b">
                    <h4 className="font-medium text-gray-900">Regions List</h4>
                    <p className="text-sm text-gray-500 mt-1">Manage geographical regions and their information</p>
                  </div>
                  <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Capital</TableHead>
                          <TableHead className="font-semibold">Population</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                      {regions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-12">
                              <div className="flex flex-col items-center gap-3">
                                <MapPin className="w-8 h-8 text-gray-300" />
                                <div>
                                  <p className="text-gray-500 font-medium">No regions found</p>
                                  <p className="text-sm text-gray-400">Get started by adding your first region</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={handleAddRegion}
                                  className="mt-2"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Region
                                </Button>
                              </div>
                            </TableCell>
                        </TableRow>
                      ) : regions.map(region => (
                          <TableRow key={region.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{region.name_en || region.name}</TableCell>
                            <TableCell>{region.capital || 'N/A'}</TableCell>
                            <TableCell>{region.population || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEditRegion(region)}
                                  className="hover:bg-blue-50 hover:border-blue-200"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete ${region.name_en || region.name}?`)) {
                                      handleDeleteRegion(region.id);
                                    }
                                  }}
                                  className="hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                  </div>
                </div>
              )}

              {/* Add/Edit Form Modal */}
              {showRegionForm && (
                <Dialog open={showRegionForm} onOpenChange={setShowRegionForm}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4">
                      <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-600" />
                        {editingRegion ? 'Edit Region' : 'Add New Region'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingRegion ? 'Update region information' : 'Create a new region with multilingual support'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleRegionFormSubmit} className="space-y-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (English) *</label>
                              <Input 
                                name="name_en" 
                                value={regionForm.name_en} 
                                onChange={handleRegionFormChange} 
                                placeholder="Region name in English" 
                                required 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (Arabic)</label>
                              <Input 
                                name="name_ar" 
                                value={regionForm.name_ar || ''} 
                                onChange={handleRegionFormChange} 
                                placeholder="اسم المنطقة" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (French)</label>
                              <Input 
                                name="name_fr" 
                                value={regionForm.name_fr || ''} 
                                onChange={handleRegionFormChange} 
                                placeholder="Nom de la région" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Capital</label>
                              <Input 
                                name="capital" 
                                value={regionForm.capital || ''} 
                                onChange={handleRegionFormChange} 
                                placeholder="Capital city" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Population</label>
                              <Input 
                                name="population" 
                                value={regionForm.population || ''} 
                                onChange={handleRegionFormChange} 
                                placeholder="Population count" 
                                type="number"
                                className="w-full"
                              />
                      </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Description</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (English)</label>
                              <textarea 
                                name="description_en" 
                                value={regionForm.description_en || ''} 
                                onChange={handleRegionFormChange} 
                                placeholder="Region description in English" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (Arabic)</label>
                              <textarea 
                                name="description_ar" 
                                value={regionForm.description_ar || ''} 
                                onChange={handleRegionFormChange} 
                                placeholder="وصف المنطقة" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (French)</label>
                              <textarea 
                                name="description_fr" 
                                value={regionForm.description_fr || ''} 
                                onChange={handleRegionFormChange} 
                                placeholder="Description de la région" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Climate & Location */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Climate & Location</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Climate (English)</label>
                              <Input 
                                name="climate_en" 
                                value={regionForm.climate_en || ''} 
                                onChange={handleRegionFormChange} 
                                placeholder="Climate description" 
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Best Time to Visit</label>
                              <Input 
                                name="bestTimeToVisit_en" 
                                value={regionForm.bestTimeToVisit_en || ''} 
                                onChange={handleRegionFormChange} 
                                placeholder="Best time to visit" 
                                className="w-full"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Latitude</label>
                                <Input 
                                  name="latitude" 
                                  value={regionForm.latitude || ''} 
                                  onChange={handleRegionFormChange} 
                                  placeholder="Latitude" 
                                  type="number" 
                                  step="any"
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Longitude</label>
                                <Input 
                                  name="longitude" 
                                  value={regionForm.longitude || ''} 
                                  onChange={handleRegionFormChange} 
                                  placeholder="Longitude" 
                                  type="number" 
                                  step="any"
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Key Facts</label>
                              <textarea 
                                name="keyFacts_en" 
                                value={regionForm.keyFacts_en || ''} 
                                onChange={handleRegionFormChange} 
                                placeholder="Key facts about the region" 
                                className="w-full h-16 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input 
                              type="file" 
                              name="images" 
                              multiple 
                              accept="image/*" 
                              onChange={handleRegionFormChange}
                              className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setShowRegionForm(false)}
                              className="hover:bg-gray-50"
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              disabled={actionInProgress === (editingRegion ? editingRegion.id : 'new')}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              {actionInProgress === (editingRegion ? editingRegion.id : 'new') ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  {editingRegion ? 'Updating...' : 'Creating...'}
                                </>
                              ) : (
                                editingRegion ? 'Update Region' : 'Create Region'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : selectedEntity === 'attractions' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedEntity(null)}
                    className="hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Entities
                  </Button>
              </div>
                <Button 
                  size="sm" 
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={handleAddAttraction}
                >
                  <Plus className="w-4 h-4" /> 
                  Add New Attraction
                </Button>
              </div>

              {loadingAttractions ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Loading attractions...</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="p-6 border-b">
                    <h4 className="font-medium text-gray-900">Attractions List</h4>
                    <p className="text-sm text-gray-500 mt-1">Manage tourist destinations and attractions</p>
                  </div>
                  <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Category</TableHead>
                          <TableHead className="font-semibold">Region</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attractions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-12">
                              <div className="flex flex-col items-center gap-3">
                                <Landmark className="w-8 h-8 text-gray-300" />
                                <div>
                                  <p className="text-gray-500 font-medium">No attractions found</p>
                                  <p className="text-sm text-gray-400">Get started by adding your first attraction</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={handleAddAttraction}
                                  className="mt-2"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Attraction
                                </Button>
                              </div>
                            </TableCell>
                        </TableRow>
                      ) : attractions.map(attraction => (
                          <TableRow key={attraction.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{attraction.name_en || attraction.name}</TableCell>
                            <TableCell>{attraction.category_en || attraction.category || attraction.type}</TableCell>
                            <TableCell>{attraction.regionId || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEditAttraction(attraction)}
                                  className="hover:bg-blue-50 hover:border-blue-200"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete ${attraction.name_en || attraction.name}?`)) {
                                      handleDeleteAttraction(attraction.id);
                                    }
                                  }}
                                  className="hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                </div>
              )}

              {/* Add/Edit Form Modal */}
              {showAttractionForm && (
                <Dialog open={showAttractionForm} onOpenChange={setShowAttractionForm}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4">
                      <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Landmark className="w-5 h-5 text-blue-600" />
                        {editingAttraction ? 'Edit Attraction' : 'Add New Attraction'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingAttraction ? 'Update attraction information' : 'Create a new attraction with multilingual support'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleAttractionFormSubmit} className="space-y-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (English) *</label>
                              <Input 
                                name="name_en" 
                                value={attractionForm.name_en} 
                                onChange={handleAttractionFormChange} 
                                placeholder="Attraction name in English" 
                                required 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (Arabic)</label>
                              <Input 
                                name="name_ar" 
                                value={attractionForm.name_ar || ''} 
                                onChange={handleAttractionFormChange} 
                                placeholder="اسم المعلم السياحي" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (French)</label>
                              <Input 
                                name="name_fr" 
                                value={attractionForm.name_fr || ''} 
                                onChange={handleAttractionFormChange} 
                                placeholder="Nom de l'attraction" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Category (English)</label>
                              <Input 
                                name="category_en" 
                                value={attractionForm.category_en || ''} 
                                onChange={handleAttractionFormChange} 
                                placeholder="Category (e.g., Historical, Natural)" 
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Region ID</label>
                              <Input 
                                name="regionId" 
                                value={attractionForm.regionId || ''} 
                                onChange={handleAttractionFormChange} 
                                placeholder="Region ID" 
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Description</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (English)</label>
                              <textarea 
                                name="description_en" 
                                value={attractionForm.description_en || ''} 
                                onChange={handleAttractionFormChange} 
                                placeholder="Attraction description in English" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (Arabic)</label>
                              <textarea 
                                name="description_ar" 
                                value={attractionForm.description_ar || ''} 
                                onChange={handleAttractionFormChange} 
                                placeholder="وصف المعلم السياحي" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (French)</label>
                              <textarea 
                                name="description_fr" 
                                value={attractionForm.description_fr || ''} 
                                onChange={handleAttractionFormChange} 
                                placeholder="Description de l'attraction" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Location & Details */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Location & Details</h4>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Latitude</label>
                                <Input 
                                  name="latitude" 
                                  value={attractionForm.latitude || ''} 
                                  onChange={handleAttractionFormChange} 
                                  placeholder="Latitude" 
                                  type="number" 
                                  step="any"
                                  className="w-full"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Longitude</label>
                                <Input 
                                  name="longitude" 
                                  value={attractionForm.longitude || ''} 
                                  onChange={handleAttractionFormChange} 
                                  placeholder="Longitude" 
                                  type="number" 
                                  step="any"
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Rating</label>
                              <Input 
                                name="rating" 
                                value={attractionForm.rating || ''} 
                                onChange={handleAttractionFormChange} 
                                placeholder="Rating (1-5)" 
                                type="number" 
                                min="1" 
                                max="5" 
                                step="0.1"
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Entry Fee</label>
                              <Input 
                                name="entryFee" 
                                value={attractionForm.entryFee || ''} 
                                onChange={handleAttractionFormChange} 
                                placeholder="Entry fee amount" 
                                type="number" 
                                step="0.01"
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Currency</label>
                              <Input 
                                name="currency" 
                                value={attractionForm.currency || 'MAD'} 
                                onChange={handleAttractionFormChange} 
                                placeholder="Currency code" 
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Tags</label>
                              <Input 
                                name="tags" 
                                value={Array.isArray(attractionForm.tags) ? attractionForm.tags.join(', ') : ''} 
                                onChange={e => setAttractionForm({ ...attractionForm, tags: e.target.value.split(',').map(tag => tag.trim()) })} 
                                placeholder="Tags (comma separated)" 
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">{editingAttraction ? 'Update' : 'Create'}</Button>
                        <Button type="button" variant="outline" onClick={() => setShowAttractionForm(false)}>Cancel</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : selectedEntity === 'festivals' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedEntity(null)}
                    className="hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Entities
                  </Button>
              </div>
                <Button 
                  size="sm" 
                  className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700"
                  onClick={handleAddFestival}
                >
                  <Plus className="w-4 h-4" /> 
                  Add New Festival
                </Button>
              </div>

              {loadingFestivals ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
                    <span className="text-gray-600">Loading festivals...</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="p-6 border-b">
                    <h4 className="font-medium text-gray-900">Festivals List</h4>
                    <p className="text-sm text-gray-500 mt-1">Manage cultural festivals and events</p>
                  </div>
                  <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Type</TableHead>
                          <TableHead className="font-semibold">Location</TableHead>
                          <TableHead className="font-semibold">Time of Year</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {festivals.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12">
                              <div className="flex flex-col items-center gap-3">
                                <Calendar className="w-8 h-8 text-gray-300" />
                                <div>
                                  <p className="text-gray-500 font-medium">No festivals found</p>
                                  <p className="text-sm text-gray-400">Get started by adding your first festival</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={handleAddFestival}
                                  className="mt-2"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Festival
                                </Button>
                              </div>
                            </TableCell>
                        </TableRow>
                      ) : festivals.map(festival => (
                          <TableRow key={festival.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{festival.name_en || festival.name}</TableCell>
                            <TableCell>{festival.type || 'N/A'}</TableCell>
                            <TableCell>{festival.location || 'N/A'}</TableCell>
                            <TableCell>{festival.timeOfYear || 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEditFestival(festival)}
                                  className="hover:bg-pink-50 hover:border-pink-200"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete ${festival.name_en || festival.name}?`)) {
                                      handleDeleteFestival(festival.id);
                                    }
                                  }}
                                  className="hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                </div>
              )}

              {/* Add/Edit Form Modal */}
              {showFestivalForm && (
                <Dialog open={showFestivalForm} onOpenChange={setShowFestivalForm}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4">
                      <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-pink-600" />
                        {editingFestival ? 'Edit Festival' : 'Add New Festival'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingFestival ? 'Update festival information' : 'Create a new festival with multilingual support'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleFestivalFormSubmit} className="space-y-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (English) *</label>
                              <Input 
                                name="name_en" 
                                value={festivalForm.name_en} 
                                onChange={handleFestivalFormChange} 
                                placeholder="Festival name in English" 
                                required 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (Arabic)</label>
                              <Input 
                                name="name_ar" 
                                value={festivalForm.name_ar || ''} 
                                onChange={handleFestivalFormChange} 
                                placeholder="اسم المهرجان" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (French)</label>
                              <Input 
                                name="name_fr" 
                                value={festivalForm.name_fr || ''} 
                                onChange={handleFestivalFormChange} 
                                placeholder="Nom du festival" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
                              <Input 
                                name="type" 
                                value={festivalForm.type || ''} 
                                onChange={handleFestivalFormChange} 
                                placeholder="Festival type" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                              <Input 
                                name="location" 
                                value={festivalForm.location || ''} 
                                onChange={handleFestivalFormChange} 
                                placeholder="Festival location" 
                                className="w-full"
                              />
                        </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Description</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (English)</label>
                              <textarea 
                                name="description_en" 
                                value={festivalForm.description_en || ''} 
                                onChange={handleFestivalFormChange} 
                                placeholder="Festival description in English" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (Arabic)</label>
                              <textarea 
                                name="description_ar" 
                                value={festivalForm.description_ar || ''} 
                                onChange={handleFestivalFormChange} 
                                placeholder="وصف المهرجان" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (French)</label>
                              <textarea 
                                name="description_fr" 
                                value={festivalForm.description_fr || ''} 
                                onChange={handleFestivalFormChange} 
                                placeholder="Description du festival" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Timing & Details */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Timing & Details</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Time of Year</label>
                              <Input 
                                name="timeOfYear" 
                                value={festivalForm.timeOfYear || ''} 
                                onChange={handleFestivalFormChange} 
                                placeholder="When the festival occurs" 
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Duration (days)</label>
                              <Input 
                                name="duration" 
                                value={festivalForm.duration || ''} 
                                onChange={handleFestivalFormChange} 
                                placeholder="Festival duration" 
                                type="number" 
                                min="1"
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Established</label>
                              <Input 
                                name="established" 
                                value={festivalForm.established || ''} 
                                onChange={handleFestivalFormChange} 
                                placeholder="When the festival was established" 
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Historical Significance</label>
                              <textarea 
                                name="historicalSignificance" 
                                value={festivalForm.historicalSignificance || ''} 
                                onChange={handleFestivalFormChange} 
                                placeholder="Historical significance of the festival" 
                                className="w-full h-16 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Video URL</label>
                              <Input 
                                name="videoUrl" 
                                value={festivalForm.videoUrl || ''} 
                                onChange={handleFestivalFormChange} 
                                placeholder="Video URL" 
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">{editingFestival ? 'Update' : 'Create'}</Button>
                        <Button type="button" variant="outline" onClick={() => setShowFestivalForm(false)}>Cancel</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : selectedEntity === 'cuisines' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedEntity(null)}
                    className="hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Entities
                  </Button>
              </div>
                <Button 
                  size="sm" 
                  className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
                  onClick={handleAddCuisine}
                >
                  <Plus className="w-4 h-4" /> 
                  Add New Cuisine
                </Button>
              </div>

              {loadingCuisines ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                    <span className="text-gray-600">Loading cuisines...</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="p-6 border-b">
                    <h4 className="font-medium text-gray-900">Cuisines List</h4>
                    <p className="text-sm text-gray-500 mt-1">Manage local food culture and traditional dishes</p>
                  </div>
                  <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Type</TableHead>
                          <TableHead className="font-semibold">Spice Level</TableHead>
                          <TableHead className="font-semibold">Regions</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cuisines.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12">
                              <div className="flex flex-col items-center gap-3">
                                <Utensils className="w-8 h-8 text-gray-300" />
                                <div>
                                  <p className="text-gray-500 font-medium">No cuisines found</p>
                                  <p className="text-sm text-gray-400">Get started by adding your first cuisine</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={handleAddCuisine}
                                  className="mt-2"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Cuisine
                                </Button>
                              </div>
                            </TableCell>
                        </TableRow>
                      ) : cuisines.map(cuisine => (
                          <TableRow key={cuisine.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{cuisine.name_en || cuisine.name}</TableCell>
                            <TableCell>{cuisine.type || 'N/A'}</TableCell>
                            <TableCell>{cuisine.spiceLevel || 'N/A'}</TableCell>
                            <TableCell>{Array.isArray(cuisine.regionIds) ? cuisine.regionIds.join(', ') : 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEditCuisine(cuisine)}
                                  className="hover:bg-orange-50 hover:border-orange-200"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete ${cuisine.name_en || cuisine.name}?`)) {
                                      handleDeleteCuisine(cuisine.id);
                                    }
                                  }}
                                  className="hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                </div>
              )}

              {/* Add/Edit Form Modal */}
              {showCuisineForm && (
                <Dialog open={showCuisineForm} onOpenChange={setShowCuisineForm}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4">
                      <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Utensils className="w-5 h-5 text-orange-600" />
                        {editingCuisine ? 'Edit Cuisine' : 'Add New Cuisine'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingCuisine ? 'Update cuisine information' : 'Create a new cuisine with multilingual support'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleCuisineFormSubmit} className="space-y-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (English) *</label>
                              <Input 
                                name="name_en" 
                                value={cuisineForm.name_en} 
                                onChange={handleCuisineFormChange} 
                                placeholder="Cuisine name in English" 
                                required 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (Arabic)</label>
                              <Input 
                                name="name_ar" 
                                value={cuisineForm.name_ar || ''} 
                                onChange={handleCuisineFormChange} 
                                placeholder="اسم المطبخ" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (French)</label>
                              <Input 
                                name="name_fr" 
                                value={cuisineForm.name_fr || ''} 
                                onChange={handleCuisineFormChange} 
                                placeholder="Nom de la cuisine" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
                              <Input 
                                name="type" 
                                value={cuisineForm.type || ''} 
                                onChange={handleCuisineFormChange} 
                                placeholder="Cuisine type" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Spice Level</label>
                              <Input 
                                name="spiceLevel" 
                                value={cuisineForm.spiceLevel || ''} 
                                onChange={handleCuisineFormChange} 
                                placeholder="Spice level (1-5)" 
                                type="number" 
                                min="1" 
                                max="5"
                                className="w-full"
                              />
                        </div>
                      </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Description</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (English)</label>
                              <textarea 
                                name="description_en" 
                                value={cuisineForm.description_en || ''} 
                                onChange={handleCuisineFormChange} 
                                placeholder="Cuisine description in English" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (Arabic)</label>
                              <textarea 
                                name="description_ar" 
                                value={cuisineForm.description_ar || ''} 
                                onChange={handleCuisineFormChange} 
                                placeholder="وصف المطبخ" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (French)</label>
                              <textarea 
                                name="description_fr" 
                                value={cuisineForm.description_fr || ''} 
                                onChange={handleCuisineFormChange} 
                                placeholder="Description de la cuisine" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Details</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Region IDs</label>
                              <Input 
                                name="regionIds" 
                                value={Array.isArray(cuisineForm.regionIds) ? cuisineForm.regionIds.join(', ') : ''} 
                                onChange={e => setCuisineForm({ ...cuisineForm, regionIds: e.target.value.split(',').map(id => id.trim()) })} 
                                placeholder="Region IDs (comma separated)" 
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Ingredients</label>
                              <Input 
                                name="ingredients" 
                                value={Array.isArray(cuisineForm.ingredients) ? cuisineForm.ingredients.join(', ') : ''} 
                                onChange={e => setCuisineForm({ ...cuisineForm, ingredients: e.target.value.split(',').map(ingredient => ingredient.trim()) })} 
                                placeholder="Ingredients (comma separated)" 
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Popular Variants</label>
                              <Input 
                                name="popularVariants" 
                                value={Array.isArray(cuisineForm.popularVariants) ? cuisineForm.popularVariants.join(', ') : ''} 
                                onChange={e => setCuisineForm({ ...cuisineForm, popularVariants: e.target.value.split(',').map(variant => variant.trim()) })} 
                                placeholder="Popular variants (comma separated)" 
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Video URL</label>
                              <Input 
                                name="videoUrl" 
                                value={cuisineForm.videoUrl || ''} 
                                onChange={handleCuisineFormChange} 
                                placeholder="Video URL" 
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input 
                              type="file" 
                              name="images" 
                              multiple 
                              accept="image/*" 
                              onChange={handleCuisineFormChange}
                              className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setShowCuisineForm(false)}
                              className="hover:bg-gray-50"
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              className="bg-orange-600 hover:bg-orange-700"
                            >
                              {editingCuisine ? 'Update Cuisine' : 'Create Cuisine'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : selectedEntity === 'heritage' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedEntity(null)}
                    className="hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Entities
                  </Button>
              </div>
                <Button 
                  size="sm" 
                  className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700"
                  onClick={handleAddHeritage}
                >
                  <Plus className="w-4 h-4" /> 
                  Add New Heritage
                </Button>
              </div>

              {loadingHeritage ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                    <span className="text-gray-600">Loading heritage items...</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="p-6 border-b">
                    <h4 className="font-medium text-gray-900">Heritage List</h4>
                    <p className="text-sm text-gray-500 mt-1">Manage cultural heritage and historical sites</p>
                  </div>
                  <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Type</TableHead>
                          <TableHead className="font-semibold">Importance</TableHead>
                          <TableHead className="font-semibold">Regions</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {heritage.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12">
                              <div className="flex flex-col items-center gap-3">
                                <Star className="w-8 h-8 text-gray-300" />
                                <div>
                                  <p className="text-gray-500 font-medium">No heritage items found</p>
                                  <p className="text-sm text-gray-400">Get started by adding your first heritage item</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={handleAddHeritage}
                                  className="mt-2"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Heritage
                                </Button>
                              </div>
                            </TableCell>
                        </TableRow>
                      ) : heritage.map(item => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{item.name_en || item.name}</TableCell>
                            <TableCell>{item.type || 'N/A'}</TableCell>
                            <TableCell>{item.importance || 'N/A'}</TableCell>
                            <TableCell>{Array.isArray(item.regionIds) ? item.regionIds.join(', ') : 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEditHeritage(item)}
                                  className="hover:bg-yellow-50 hover:border-yellow-200"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete ${item.name_en || item.name}?`)) {
                                      handleDeleteHeritage(item.id);
                                    }
                                  }}
                                  className="hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                </div>
              )}

              {/* Add/Edit Form Modal */}
              {showHeritageForm && (
                <Dialog open={showHeritageForm} onOpenChange={setShowHeritageForm}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4">
                      <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-600" />
                        {editingHeritage ? 'Edit Heritage' : 'Add New Heritage'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingHeritage ? 'Update heritage information' : 'Create a new heritage item with multilingual support'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleHeritageFormSubmit} className="space-y-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (English) *</label>
                              <Input 
                                name="name_en" 
                                value={heritageForm.name_en} 
                                onChange={handleHeritageFormChange} 
                                placeholder="Heritage name in English" 
                                required 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (Arabic)</label>
                              <Input 
                                name="name_ar" 
                                value={heritageForm.name_ar || ''} 
                                onChange={handleHeritageFormChange} 
                                placeholder="اسم التراث" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (French)</label>
                              <Input 
                                name="name_fr" 
                                value={heritageForm.name_fr || ''} 
                                onChange={handleHeritageFormChange} 
                                placeholder="Nom du patrimoine" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
                              <Input 
                                name="type" 
                                value={heritageForm.type || ''} 
                                onChange={handleHeritageFormChange} 
                                placeholder="Heritage type" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Importance</label>
                              <Input 
                                name="importance" 
                                value={heritageForm.importance || ''} 
                                onChange={handleHeritageFormChange} 
                                placeholder="Historical importance" 
                                className="w-full"
                              />
                        </div>
                      </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Description</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (English)</label>
                              <textarea 
                                name="description_en" 
                                value={heritageForm.description_en || ''} 
                                onChange={handleHeritageFormChange} 
                                placeholder="Heritage description in English" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (Arabic)</label>
                              <textarea 
                                name="description_ar" 
                                value={heritageForm.description_ar || ''} 
                                onChange={handleHeritageFormChange} 
                                placeholder="وصف التراث" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (French)</label>
                              <textarea 
                                name="description_fr" 
                                value={heritageForm.description_fr || ''} 
                                onChange={handleHeritageFormChange} 
                                placeholder="Description du patrimoine" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Details</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Region IDs</label>
                              <Input 
                                name="regionIds" 
                                value={Array.isArray(heritageForm.regionIds) ? heritageForm.regionIds.join(', ') : ''} 
                                onChange={e => setHeritageForm({ ...heritageForm, regionIds: e.target.value.split(',').map(id => id.trim()) })} 
                                placeholder="Region IDs (comma separated)" 
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Video URL</label>
                              <Input 
                                name="videoUrl" 
                                value={heritageForm.videoUrl || ''} 
                                onChange={handleHeritageFormChange} 
                                placeholder="Video URL" 
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input 
                              type="file" 
                              name="images" 
                              multiple 
                              accept="image/*" 
                              onChange={handleHeritageFormChange}
                              className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setShowHeritageForm(false)}
                              className="hover:bg-gray-50"
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              className="bg-yellow-600 hover:bg-yellow-700"
                            >
                              {editingHeritage ? 'Update Heritage' : 'Create Heritage'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : selectedEntity === 'clothing' ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedEntity(null)}
                    className="hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back to Entities
                  </Button>
              </div>
                <Button 
                  size="sm" 
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                  onClick={handleAddClothing}
                >
                  <Plus className="w-4 h-4" /> 
                  Add New Clothing
                </Button>
              </div>

              {loadingClothing ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <span className="text-gray-600">Loading clothing items...</span>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border shadow-sm">
                  <div className="p-6 border-b">
                    <h4 className="font-medium text-gray-900">Clothing List</h4>
                    <p className="text-sm text-gray-500 mt-1">Manage traditional clothing and attire</p>
                  </div>
                  <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Gender</TableHead>
                          <TableHead className="font-semibold">Materials</TableHead>
                          <TableHead className="font-semibold">Regions</TableHead>
                          <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clothing.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12">
                              <div className="flex flex-col items-center gap-3">
                                <Shirt className="w-8 h-8 text-gray-300" />
                                <div>
                                  <p className="text-gray-500 font-medium">No clothing items found</p>
                                  <p className="text-sm text-gray-400">Get started by adding your first clothing item</p>
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={handleAddClothing}
                                  className="mt-2"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Clothing
                                </Button>
                              </div>
                            </TableCell>
                        </TableRow>
                      ) : clothing.map(item => (
                          <TableRow key={item.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{item.name_en || item.name}</TableCell>
                            <TableCell>{item.gender || 'N/A'}</TableCell>
                            <TableCell>{Array.isArray(item.materials) ? item.materials.join(', ') : 'N/A'}</TableCell>
                            <TableCell>{Array.isArray(item.regionIds) ? item.regionIds.join(', ') : 'N/A'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleEditClothing(item)}
                                  className="hover:bg-purple-50 hover:border-purple-200"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete ${item.name_en || item.name}?`)) {
                                      handleDeleteClothing(item.id);
                                    }
                                  }}
                                  className="hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                </div>
              )}

              {/* Add/Edit Form Modal */}
              {showClothingForm && (
                <Dialog open={showClothingForm} onOpenChange={setShowClothingForm}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="border-b pb-4">
                      <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                        <Shirt className="w-5 h-5 text-purple-600" />
                        {editingClothing ? 'Edit Clothing' : 'Add New Clothing'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingClothing ? 'Update clothing information' : 'Create a new clothing item with multilingual support'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleClothingFormSubmit} className="space-y-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (English) *</label>
                              <Input 
                                name="name_en" 
                                value={clothingForm.name_en} 
                                onChange={handleClothingFormChange} 
                                placeholder="Clothing name in English" 
                                required 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (Arabic)</label>
                              <Input 
                                name="name_ar" 
                                value={clothingForm.name_ar || ''} 
                                onChange={handleClothingFormChange} 
                                placeholder="اسم الملابس" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Name (French)</label>
                              <Input 
                                name="name_fr" 
                                value={clothingForm.name_fr || ''} 
                                onChange={handleClothingFormChange} 
                                placeholder="Nom du vêtement" 
                                className="w-full"
                              />
                        </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Gender</label>
                              <Input 
                                name="gender" 
                                value={clothingForm.gender || ''} 
                                onChange={handleClothingFormChange} 
                                placeholder="Gender (Male/Female/Unisex)" 
                                className="w-full"
                              />
                        </div>
                        </div>
                      </div>

                        {/* Description */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Description</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (English)</label>
                              <textarea 
                                name="description_en" 
                                value={clothingForm.description_en || ''} 
                                onChange={handleClothingFormChange} 
                                placeholder="Clothing description in English" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (Arabic)</label>
                              <textarea 
                                name="description_ar" 
                                value={clothingForm.description_ar || ''} 
                                onChange={handleClothingFormChange} 
                                placeholder="وصف الملابس" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Description (French)</label>
                              <textarea 
                                name="description_fr" 
                                value={clothingForm.description_fr || ''} 
                                onChange={handleClothingFormChange} 
                                placeholder="Description du vêtement" 
                                className="w-full h-20 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900 border-b pb-2">Details</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Region IDs</label>
                              <Input 
                                name="regionIds" 
                                value={Array.isArray(clothingForm.regionIds) ? clothingForm.regionIds.join(', ') : ''} 
                                onChange={e => setClothingForm({ ...clothingForm, regionIds: e.target.value.split(',').map(id => id.trim()) })} 
                                placeholder="Region IDs (comma separated)" 
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Materials</label>
                              <Input 
                                name="materials" 
                                value={Array.isArray(clothingForm.materials) ? clothingForm.materials.join(', ') : ''} 
                                onChange={e => setClothingForm({ ...clothingForm, materials: e.target.value.split(',').map(material => material.trim()) })} 
                                placeholder="Materials (comma separated)" 
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Occasions</label>
                              <Input 
                                name="occasions" 
                                value={Array.isArray(clothingForm.occasions) ? clothingForm.occasions.join(', ') : ''} 
                                onChange={e => setClothingForm({ ...clothingForm, occasions: e.target.value.split(',').map(occasion => occasion.trim()) })} 
                                placeholder="Occasions (comma separated)" 
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-1 block">Historical Notes</label>
                              <textarea 
                                name="historicalNotes" 
                                value={clothingForm.historicalNotes || ''} 
                                onChange={handleClothingFormChange} 
                                placeholder="Historical notes about the clothing" 
                                className="w-full h-16 p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input 
                              type="file" 
                              name="images" 
                              multiple 
                              accept="image/*" 
                              onChange={handleClothingFormChange}
                              className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                            />
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setShowClothingForm(false)}
                              className="hover:bg-gray-50"
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit"
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              {editingClothing ? 'Update Clothing' : 'Create Clothing'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Premium User Profile Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-6xl h-[85vh] p-0 overflow-hidden">
          <div className="flex h-full">
            {/* Left Sidebar - User Info & Quick Actions */}
            <div className="w-80 bg-gradient-to-b from-emerald-50 to-emerald-100 border-r border-emerald-200 p-6 flex flex-col">
              {/* User Avatar & Basic Info */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-300 flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="h-12 w-12 text-emerald-700" />
                  </div>
                  <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-3 border-white flex items-center justify-center shadow-md ${
                    selectedUser?.status === 'active' ? 'bg-green-500' : 
                    selectedUser?.status === 'pending' ? 'bg-yellow-500' : 
                    selectedUser?.status === 'suspended' ? 'bg-orange-500' : 'bg-red-500'
                  }`}>
                    <div className="h-3 w-3 rounded-full bg-white"></div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-4">
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </h3>
                <p className="text-gray-600 text-sm flex items-center justify-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  {selectedUser?.email}
                </p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <StatusBadge status={selectedUser?.status || 'pending'} />
                  <Badge variant="outline" className="bg-white text-emerald-800 border-emerald-300">
                    {selectedUser?.role?.charAt(0).toUpperCase() + selectedUser?.role?.slice(1)}
                  </Badge>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 mb-6">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Account Age</span>
                    <span className="text-sm font-semibold">
                      {selectedUser ? Math.floor((Date.now() - new Date(selectedUser.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0} days
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Email Status</span>
                    <span className={`text-sm font-semibold ${selectedUser?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedUser?.emailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">2FA Status</span>
                    <span className={`text-sm font-semibold ${selectedUser?.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedUser?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h4>
                {selectedUser?.status !== 'active' && (
                  <Button 
                    size="sm" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      handleUpdateUserStatus(selectedUser.id, 'active');
                      setShowUserModal(false);
                    }}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate User
                  </Button>
                )}
                {selectedUser?.status !== 'suspended' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                    onClick={() => {
                      handleUpdateUserStatus(selectedUser.id, 'suspended');
                      setShowUserModal(false);
                    }}
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend User
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>

              {/* Account Timeline */}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Account Timeline</h4>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-gray-500">Created</div>
                    <div className="text-sm font-medium">
                      {selectedUser ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {selectedUser ? new Date(selectedUser.createdAt).toLocaleTimeString() : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-gray-500">Last Updated</div>
                    <div className="text-sm font-medium">
                      {selectedUser ? new Date(selectedUser.updatedAt).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {selectedUser ? new Date(selectedUser.updatedAt).toLocaleTimeString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">User Profile Details</h2>
                    <p className="text-gray-600">Comprehensive view of user information and account status</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setConfirmDelete(selectedUser?.id || null);
                      setShowUserModal(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete User
                  </Button>
                </div>

                {selectedUser && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <Card className="h-fit">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-emerald-600" />
                          Personal Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">First Name</label>
                            <p className="text-sm font-medium bg-gray-50 p-2 rounded">{selectedUser.firstName}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Last Name</label>
                            <p className="text-sm font-medium bg-gray-50 p-2 rounded">{selectedUser.lastName}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email Address</label>
                          <p className="text-sm font-medium bg-gray-50 p-2 rounded">{selectedUser.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Phone Number</label>
                          <p className="text-sm font-medium bg-gray-50 p-2 rounded">{selectedUser.phone || 'Not provided'}</p>
                        </div>
                        {selectedUser.bio && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Bio</label>
                            <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded-md">
                              {selectedUser.bio}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Account Security */}
                    <Card className="h-fit">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          Account Security
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">User ID</label>
                          <p className="text-sm font-mono bg-gray-100 p-2 rounded">{selectedUser.id}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Account Status</label>
                          <div className="mt-1">
                            <StatusBadge status={selectedUser.status} />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email Verification</label>
                          <div className="flex items-center gap-2 mt-1">
                            {selectedUser.emailVerified ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <Check className="h-4 w-4" />
                                <span className="text-sm">Verified</span>
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center gap-1">
                                <X className="h-4 w-4" />
                                <span className="text-sm">Not Verified</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Two-Factor Authentication</label>
                          <div className="flex items-center gap-2 mt-1">
                            {selectedUser.twoFactorEnabled ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <Check className="h-4 w-4" />
                                <span className="text-sm">Enabled</span>
                              </span>
                            ) : (
                              <span className="text-red-600 flex items-center gap-1">
                                <X className="h-4 w-4" />
                                <span className="text-sm">Disabled</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Preferences & Settings */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5 text-gray-600" />
                          Preferences & Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Notification Preferences */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <Bell className="h-4 w-4" />
                              Notification Preferences
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">Email Notifications</span>
                                </div>
                                <div className={`h-3 w-3 rounded-full ${selectedUser.preferences?.notifications?.email ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">SMS Notifications</span>
                                </div>
                                <div className={`h-3 w-3 rounded-full ${selectedUser.preferences?.notifications?.sms ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Bell className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">Push Notifications</span>
                                </div>
                                <div className={`h-3 w-3 rounded-full ${selectedUser.preferences?.notifications?.push ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              </div>
                            </div>
                          </div>

                          {/* Privacy Settings */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Privacy Settings
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Eye className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">Profile Visible</span>
                                </div>
                                <div className={`h-3 w-3 rounded-full ${selectedUser.preferences?.privacy?.profileVisible ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">Show Phone</span>
                                </div>
                                <div className={`h-3 w-3 rounded-full ${selectedUser.preferences?.privacy?.showPhone ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">Show Email</span>
                                </div>
                                <div className={`h-3 w-3 rounded-full ${selectedUser.preferences?.privacy?.showEmail ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-500">Language Preference:</span>
                            <Badge variant="outline" className="text-xs">
                              {selectedUser.preferences?.language?.toUpperCase() || 'EN'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;