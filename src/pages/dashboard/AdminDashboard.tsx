import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '@/lib/auth/api';
import { EnhancedAuthAPI } from '@/lib/auth/enhanced-api';
import { useAuth } from '@/contexts/AuthContext';
import { AuditLogger } from '@/lib/admin/audit-logger';
// import EnhancedUserTable from '@/components/admin/EnhancedUserTable';
import AuditLogViewer from '@/components/admin/AuditLogViewer';
import {
  LayoutDashboard, Users, FileText, User, Clock, Filter, RefreshCcw, Search, ChevronLeft, ChevronRight,
  Check, X, Trash2, UserCheck, UserX, MoreHorizontal, MapPin, Landmark, Calendar, Utensils, Star, Shirt, Eye, Plus, Pencil
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
    setAttractionForm({ name_en: '', category_en: '', regionId: '' });
    setEditingAttraction(null);
    setShowAttractionForm(true);
  };

  const handleEditAttraction = (attraction) => {
    setAttractionForm({ name_en: attraction.name_en, category_en: attraction.category_en, regionId: attraction.regionId });
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
    setFestivalForm({ name: '', description: '', type: '', location: '', regionId: '', timeOfYear: '', duration: '', images: [], videoUrl: '', established: '', historicalSignificance: '' });
    setEditingFestival(null);
    setShowFestivalForm(true);
  };

  const handleEditFestival = (festival) => {
    setFestivalForm({
      name: festival.name,
      description: festival.description,
      type: festival.type,
      location: festival.location,
      regionId: festival.regionId,
      timeOfYear: festival.timeOfYear,
      duration: festival.duration,
      images: festival.images,
      videoUrl: festival.videoUrl,
      established: festival.established,
      historicalSignificance: festival.historicalSignificance
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
    setCuisineForm({ name: '', description: '', type: '', regionIds: [], ingredients: [], spiceLevel: '', images: [], videoUrl: '', popularVariants: [] });
    setEditingCuisine(null);
    setShowCuisineForm(true);
  };

  const handleEditCuisine = (cuisine) => {
    setCuisineForm({
      name: cuisine.name,
      description: cuisine.description,
      type: cuisine.type,
      regionIds: cuisine.regionIds,
      ingredients: cuisine.ingredients,
      spiceLevel: cuisine.spiceLevel,
      images: cuisine.images,
      videoUrl: cuisine.videoUrl,
      popularVariants: cuisine.popularVariants
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
    setHeritageForm({ name: '', description: '', type: '', regionIds: [], images: [], videoUrl: '', importance: '' });
    setEditingHeritage(null);
    setShowHeritageForm(true);
  };

  const handleEditHeritage = (item) => {
    setHeritageForm({
      name: item.name,
      description: item.description,
      type: item.type,
      regionIds: item.regionIds,
      images: item.images,
      videoUrl: item.videoUrl,
      importance: item.importance
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
    setClothingForm({ name: '', description: '', gender: '', regionIds: [], materials: [], occasions: [], images: [], historicalNotes: '' });
    setEditingClothing(null);
    setShowClothingForm(true);
  };

  const handleEditClothing = (item) => {
    setClothingForm({
      name: item.name,
      description: item.description,
      gender: item.gender,
      regionIds: item.regionIds,
      materials: item.materials,
      occasions: item.occasions,
      images: item.images,
      historicalNotes: item.historicalNotes
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

  // Fetch attractions when modal opens or after CRUD
  useEffect(() => {
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

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const response = await AuthAPI.getUsers({
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
    fetchUsers();
  };

  const handleUpdateUserStatus = async (userId: string, status: string) => {
    setActionInProgress(userId);
    try {
      const response = await AuthAPI.updateUserStatus(userId, status);
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
      const response = await AuthAPI.deleteUser(userId);
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
      const response = await apiService.getRegions();
      if (Array.isArray(response)) {
        const transformed = response.map(region => transformApiData.region(region, language));
        setRegions(transformed);
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
      name_en: region.name_en,
      name_ar: region.name_ar,
      name_fr: region.name_fr,
      name_it: region.name_it,
      name_es: region.name_es,
      description_en: region.description_en,
      description_ar: region.description_ar,
      description_fr: region.description_fr,
      description_it: region.description_it,
      description_es: region.description_es,
      climate_en: region.climate_en,
      climate_ar: region.climate_ar,
      climate_fr: region.climate_fr,
      climate_it: region.climate_it,
      climate_es: region.climate_es,
      bestTimeToVisit_en: region.bestTimeToVisit_en,
      bestTimeToVisit_ar: region.bestTimeToVisit_ar,
      bestTimeToVisit_fr: region.bestTimeToVisit_fr,
      bestTimeToVisit_it: region.bestTimeToVisit_it,
      bestTimeToVisit_es: region.bestTimeToVisit_es,
      keyFacts_en: region.keyFacts_en,
      keyFacts_ar: region.keyFacts_ar,
      keyFacts_fr: region.keyFacts_fr,
      keyFacts_it: region.keyFacts_it,
      keyFacts_es: region.keyFacts_es,
      capital: region.capital,
      population: region.population,
      latitude: region.latitude,
      longitude: region.longitude,
      images: region.images
    });
    setShowRegionModal(true);
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
      if (editingRegion) {
        await EnhancedAuthAPI.updateRegion(editingRegion.id, regionForm);
      } else {
        await EnhancedAuthAPI.createRegion(regionForm);
      }
      setShowRegionModal(false);
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
      toast({ title: 'Success', description: 'Region added successfully!', variant: 'default' });
    } catch (err) {
      setError('An error occurred while saving region');
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
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by name or email..."
                      className="pl-9"
                      value={searchParams.search}
                      onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value }))}
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </form>

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
                                <DropdownMenuItem onClick={() => navigate(`/dashboard/users/${user.id}`)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Discover Management</DialogTitle>
            <DialogDescription>
              Manage all Discover entities in one place. Select an entity to view and manage its data.
            </DialogDescription>
          </DialogHeader>
          {!selectedEntity ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelectedEntity('regions')}>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-lg">Regions</span>
                </div>
                <div className="flex gap-2">
                  <Eye className="w-4 h-4 text-gray-500" title="View" />
                  <Plus className="w-4 h-4 text-emerald-500" title="Add" />
                  <Pencil className="w-4 h-4 text-blue-500" title="Edit" />
                  <Trash2 className="w-4 h-4 text-red-500" title="Delete" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelectedEntity('attractions')}>
                <div className="flex items-center gap-3">
                  <Landmark className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-lg">Attractions</span>
                </div>
                <div className="flex gap-2">
                  <Eye className="w-4 h-4 text-gray-500" title="View" />
                  <Plus className="w-4 h-4 text-emerald-500" title="Add" />
                  <Pencil className="w-4 h-4 text-blue-500" title="Edit" />
                  <Trash2 className="w-4 h-4 text-red-500" title="Delete" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelectedEntity('festivals')}>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-pink-600" />
                  <span className="font-medium text-lg">Festivals</span>
                </div>
                <div className="flex gap-2">
                  <Eye className="w-4 h-4 text-gray-500" title="View" />
                  <Plus className="w-4 h-4 text-emerald-500" title="Add" />
                  <Pencil className="w-4 h-4 text-blue-500" title="Edit" />
                  <Trash2 className="w-4 h-4 text-red-500" title="Delete" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelectedEntity('cuisines')}>
                <div className="flex items-center gap-3">
                  <Utensils className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-lg">Cuisines</span>
                </div>
                <div className="flex gap-2">
                  <Eye className="w-4 h-4 text-gray-500" title="View" />
                  <Plus className="w-4 h-4 text-emerald-500" title="Add" />
                  <Pencil className="w-4 h-4 text-blue-500" title="Edit" />
                  <Trash2 className="w-4 h-4 text-red-500" title="Delete" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelectedEntity('heritage')}>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-lg">Heritage</span>
                </div>
                <div className="flex gap-2">
                  <Eye className="w-4 h-4 text-gray-500" title="View" />
                  <Plus className="w-4 h-4 text-emerald-500" title="Add" />
                  <Pencil className="w-4 h-4 text-blue-500" title="Edit" />
                  <Trash2 className="w-4 h-4 text-red-500" title="Delete" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded hover:bg-slate-50 transition cursor-pointer" onClick={() => setSelectedEntity('clothing')}>
                <div className="flex items-center gap-3">
                  <Shirt className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-lg">Clothing</span>
                </div>
                <div className="flex gap-2">
                  <Eye className="w-4 h-4 text-gray-500" title="View" />
                  <Plus className="w-4 h-4 text-emerald-500" title="Add" />
                  <Pencil className="w-4 h-4 text-blue-500" title="Edit" />
                  <Trash2 className="w-4 h-4 text-red-500" title="Delete" />
                </div>
              </div>
              {/* Add other entities here after Regions */}
            </div>
          ) : selectedEntity === 'regions' ? (
            <div>
              <Button variant="outline" size="sm" onClick={() => setSelectedEntity(null)} className="mb-4">Back to Entities</Button>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Regions</h3>
                <Button size="sm" className="flex items-center gap-2" onClick={handleAddRegion}><Plus className="w-4 h-4" /> Add New</Button>
              </div>
              {loadingRegions ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="overflow-x-auto rounded shadow bg-white mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Capital</TableHead>
                    <TableHead>Population</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                      {regions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-400">No data yet</TableCell>
                        </TableRow>
                      ) : regions.map(region => (
                    <TableRow key={region.id}>
                      <TableCell>{region.name}</TableCell>
                      <TableCell>{region.capital}</TableCell>
                      <TableCell>{region.population}</TableCell>
                      <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleEditRegion(region)}><Pencil className="w-4 h-4" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteRegion(region.id)} className="ml-2"><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </div>
              )}
              {/* Add/Edit Form Modal */}
              {showRegionForm && (
                <Dialog open={showRegionForm} onOpenChange={setShowRegionForm}>
                  <DialogContent className="max-w-6xl">
                    <DialogHeader>
                      <DialogTitle>{editingRegion ? 'Edit Region' : 'Add Region'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleRegionFormSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          {/* Multilingual Names */}
                          <Input name="name_en" value={regionForm.name_en} onChange={handleRegionFormChange} placeholder="Name (EN)" required />
                          <Input name="name_ar" value={regionForm.name_ar || ''} onChange={handleRegionFormChange} placeholder="Name (AR)" />
                          <Input name="name_fr" value={regionForm.name_fr || ''} onChange={handleRegionFormChange} placeholder="Name (FR)" />
                          <Input name="name_it" value={regionForm.name_it || ''} onChange={handleRegionFormChange} placeholder="Name (IT)" />
                          <Input name="name_es" value={regionForm.name_es || ''} onChange={handleRegionFormChange} placeholder="Name (ES)" />
                        </div>
                        <div className="space-y-2">
                          {/* Multilingual Descriptions */}
                          <Input name="description_en" value={regionForm.description_en || ''} onChange={handleRegionFormChange} placeholder="Description (EN)" />
                          <Input name="description_ar" value={regionForm.description_ar || ''} onChange={handleRegionFormChange} placeholder="Description (AR)" />
                          <Input name="description_fr" value={regionForm.description_fr || ''} onChange={handleRegionFormChange} placeholder="Description (FR)" />
                          <Input name="description_it" value={regionForm.description_it || ''} onChange={handleRegionFormChange} placeholder="Description (IT)" />
                          <Input name="description_es" value={regionForm.description_es || ''} onChange={handleRegionFormChange} placeholder="Description (ES)" />
                        </div>
                        <div className="space-y-2">
                          {/* Climate & Best Time to Visit */}
                          <Input name="climate_en" value={regionForm.climate_en || ''} onChange={handleRegionFormChange} placeholder="Climate (EN)" />
                          <Input name="climate_ar" value={regionForm.climate_ar || ''} onChange={handleRegionFormChange} placeholder="Climate (AR)" />
                          <Input name="climate_fr" value={regionForm.climate_fr || ''} onChange={handleRegionFormChange} placeholder="Climate (FR)" />
                          <Input name="climate_it" value={regionForm.climate_it || ''} onChange={handleRegionFormChange} placeholder="Climate (IT)" />
                          <Input name="climate_es" value={regionForm.climate_es || ''} onChange={handleRegionFormChange} placeholder="Climate (ES)" />
                          <Input name="bestTimeToVisit_en" value={regionForm.bestTimeToVisit_en || ''} onChange={handleRegionFormChange} placeholder="Best Time to Visit (EN)" />
                          <Input name="bestTimeToVisit_ar" value={regionForm.bestTimeToVisit_ar || ''} onChange={handleRegionFormChange} placeholder="Best Time to Visit (AR)" />
                          <Input name="bestTimeToVisit_fr" value={regionForm.bestTimeToVisit_fr || ''} onChange={handleRegionFormChange} placeholder="Best Time to Visit (FR)" />
                          <Input name="bestTimeToVisit_it" value={regionForm.bestTimeToVisit_it || ''} onChange={handleRegionFormChange} placeholder="Best Time to Visit (IT)" />
                          <Input name="bestTimeToVisit_es" value={regionForm.bestTimeToVisit_es || ''} onChange={handleRegionFormChange} placeholder="Best Time to Visit (ES)" />
                        </div>
                        <div className="space-y-2">
                          {/* Key Facts, Capital, Population, Lat/Lng, Images */}
                          <Input name="keyFacts_en" value={regionForm.keyFacts_en || ''} onChange={handleRegionFormChange} placeholder="Key Facts (EN)" />
                          <Input name="keyFacts_ar" value={regionForm.keyFacts_ar || ''} onChange={handleRegionFormChange} placeholder="Key Facts (AR)" />
                          <Input name="keyFacts_fr" value={regionForm.keyFacts_fr || ''} onChange={handleRegionFormChange} placeholder="Key Facts (FR)" />
                          <Input name="keyFacts_it" value={regionForm.keyFacts_it || ''} onChange={handleRegionFormChange} placeholder="Key Facts (IT)" />
                          <Input name="keyFacts_es" value={regionForm.keyFacts_es || ''} onChange={handleRegionFormChange} placeholder="Key Facts (ES)" />
                          <Input name="capital" value={regionForm.capital || ''} onChange={handleRegionFormChange} placeholder="Capital" />
                          <Input name="population" value={regionForm.population || ''} onChange={handleRegionFormChange} placeholder="Population" />
                          <Input name="latitude" value={regionForm.latitude || ''} onChange={handleRegionFormChange} placeholder="Latitude" type="number" />
                          <Input name="longitude" value={regionForm.longitude || ''} onChange={handleRegionFormChange} placeholder="Longitude" type="number" />
                          <input type="file" name="images" multiple accept="image/*" onChange={handleRegionFormChange} />
                          {/* TODO: Show previews and handle upload logic */}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">{editingRegion ? 'Update' : 'Create'}</Button>
                        <Button type="button" variant="outline" onClick={() => setShowRegionForm(false)}>Cancel</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : selectedEntity === 'attractions' ? (
            <div>
              <Button variant="outline" size="sm" onClick={() => setSelectedEntity(null)} className="mb-4">Back to Entities</Button>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Attractions</h3>
                <Button size="sm" className="flex items-center gap-2" onClick={handleAddAttraction}><Plus className="w-4 h-4" /> Add New</Button>
              </div>
              {loadingAttractions ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="overflow-x-auto rounded shadow bg-white mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Region ID</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attractions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-400">No data yet</TableCell>
                        </TableRow>
                      ) : attractions.map(attraction => (
                        <TableRow key={attraction.id}>
                          <TableCell>{attraction.name}</TableCell>
                          <TableCell>{attraction.type}</TableCell>
                          <TableCell>{attraction.regionId}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleEditAttraction(attraction)}><Pencil className="w-4 h-4" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteAttraction(attraction.id)} className="ml-2"><Trash2 className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {/* Add/Edit Form Modal */}
              {showAttractionForm && (
                <Dialog open={showAttractionForm} onOpenChange={setShowAttractionForm}>
                  <DialogContent className="max-w-6xl">
                    <DialogHeader>
                      <DialogTitle>{editingAttraction ? 'Edit Attraction' : 'Add Attraction'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAttractionFormSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          {/* Multilingual Names */}
                          <Input name="name_en" value={attractionForm.name_en} onChange={handleAttractionFormChange} placeholder="Name (EN)" required />
                          <Input name="name_ar" value={attractionForm.name_ar || ''} onChange={handleAttractionFormChange} placeholder="Name (AR)" />
                          <Input name="name_fr" value={attractionForm.name_fr || ''} onChange={handleAttractionFormChange} placeholder="Name (FR)" />
                          <Input name="name_it" value={attractionForm.name_it || ''} onChange={handleAttractionFormChange} placeholder="Name (IT)" />
                          <Input name="name_es" value={attractionForm.name_es || ''} onChange={handleAttractionFormChange} placeholder="Name (ES)" />
                        </div>
                        <div className="space-y-2">
                          {/* Multilingual Descriptions */}
                          <Input name="description_en" value={attractionForm.description_en || ''} onChange={handleAttractionFormChange} placeholder="Description (EN)" />
                          <Input name="description_ar" value={attractionForm.description_ar || ''} onChange={handleAttractionFormChange} placeholder="Description (AR)" />
                          <Input name="description_fr" value={attractionForm.description_fr || ''} onChange={handleAttractionFormChange} placeholder="Description (FR)" />
                          <Input name="description_it" value={attractionForm.description_it || ''} onChange={handleAttractionFormChange} placeholder="Description (IT)" />
                          <Input name="description_es" value={attractionForm.description_es || ''} onChange={handleAttractionFormChange} placeholder="Description (ES)" />
                        </div>
                        <div className="space-y-2">
                          {/* Multilingual Categories */}
                          <Input name="category_en" value={attractionForm.category_en || ''} onChange={handleAttractionFormChange} placeholder="Category (EN)" />
                          <Input name="category_ar" value={attractionForm.category_ar || ''} onChange={handleAttractionFormChange} placeholder="Category (AR)" />
                          <Input name="category_fr" value={attractionForm.category_fr || ''} onChange={handleAttractionFormChange} placeholder="Category (FR)" />
                          <Input name="category_it" value={attractionForm.category_it || ''} onChange={handleAttractionFormChange} placeholder="Category (IT)" />
                          <Input name="category_es" value={attractionForm.category_es || ''} onChange={handleAttractionFormChange} placeholder="Category (ES)" />
                          <Input name="regionId" value={attractionForm.regionId || ''} onChange={handleAttractionFormChange} placeholder="Region ID" />
                          <Input name="latitude" value={attractionForm.latitude || ''} onChange={handleAttractionFormChange} placeholder="Latitude" type="number" />
                          <Input name="longitude" value={attractionForm.longitude || ''} onChange={handleAttractionFormChange} placeholder="Longitude" type="number" />
                        </div>
                        <div className="space-y-2">
                          {/* Images, Rating, Tags, Entry Fee, Currency, Opening Hours */}
                          <input type="file" name="imageUrls" multiple accept="image/*" onChange={handleAttractionFormChange} />
                          <Input name="rating" value={attractionForm.rating || ''} onChange={handleAttractionFormChange} placeholder="Rating" type="number" />
                          <Input name="tags" value={Array.isArray(attractionForm.tags) ? attractionForm.tags.join(',') : ''} onChange={e => setAttractionForm({ ...attractionForm, tags: e.target.value.split(',') })} placeholder="Tags (comma separated)" />
                          <Input name="entryFee" value={attractionForm.entryFee || ''} onChange={handleAttractionFormChange} placeholder="Entry Fee" type="number" />
                          <Input name="currency" value={attractionForm.currency || ''} onChange={handleAttractionFormChange} placeholder="Currency" />
                          <Input name="openingHours" value={attractionForm.openingHours || ''} onChange={handleAttractionFormChange} placeholder="Opening Hours (JSON)" />
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
            <div>
              <Button variant="outline" size="sm" onClick={() => setSelectedEntity(null)} className="mb-4">Back to Entities</Button>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Festivals</h3>
                <Button size="sm" className="flex items-center gap-2" onClick={handleAddFestival}><Plus className="w-4 h-4" /> Add New</Button>
              </div>
              {loadingFestivals ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="overflow-x-auto rounded shadow bg-white mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Region ID</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {festivals.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-400">No data yet</TableCell>
                        </TableRow>
                      ) : festivals.map(festival => (
                        <TableRow key={festival.id}>
                          <TableCell>{festival.name}</TableCell>
                          <TableCell>{festival.type}</TableCell>
                          <TableCell>{festival.regionId}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleEditFestival(festival)}><Pencil className="w-4 h-4" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteFestival(festival.id)} className="ml-2"><Trash2 className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {/* Add/Edit Form Modal */}
              {showFestivalForm && (
                <Dialog open={showFestivalForm} onOpenChange={setShowFestivalForm}>
                  <DialogContent className="max-w-6xl">
                    <DialogHeader>
                      <DialogTitle>{editingFestival ? 'Edit Festival' : 'Add Festival'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFestivalFormSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          {/* Multilingual Names */}
                          <Input name="name_en" value={festivalForm.name_en} onChange={handleFestivalFormChange} placeholder="Name (EN)" required />
                          <Input name="name_ar" value={festivalForm.name_ar || ''} onChange={handleFestivalFormChange} placeholder="Name (AR)" />
                          <Input name="name_fr" value={festivalForm.name_fr || ''} onChange={handleFestivalFormChange} placeholder="Name (FR)" />
                          <Input name="name_it" value={festivalForm.name_it || ''} onChange={handleFestivalFormChange} placeholder="Name (IT)" />
                          <Input name="name_es" value={festivalForm.name_es || ''} onChange={handleFestivalFormChange} placeholder="Name (ES)" />
                        </div>
                        <div className="space-y-2">
                          {/* Multilingual Descriptions */}
                          <Input name="description_en" value={festivalForm.description_en || ''} onChange={handleFestivalFormChange} placeholder="Description (EN)" />
                          <Input name="description_ar" value={festivalForm.description_ar || ''} onChange={handleFestivalFormChange} placeholder="Description (AR)" />
                          <Input name="description_fr" value={festivalForm.description_fr || ''} onChange={handleFestivalFormChange} placeholder="Description (FR)" />
                          <Input name="description_it" value={festivalForm.description_it || ''} onChange={handleFestivalFormChange} placeholder="Description (IT)" />
                          <Input name="description_es" value={festivalForm.description_es || ''} onChange={handleFestivalFormChange} placeholder="Description (ES)" />
                        </div>
                        <div className="space-y-2">
                          <Input name="type" value={festivalForm.type || ''} onChange={handleFestivalFormChange} placeholder="Type" />
                        </div>
                        <div className="space-y-2">
                          <Input name="location" value={festivalForm.location || ''} onChange={handleFestivalFormChange} placeholder="Location" />
                          <Input name="regionId" value={festivalForm.regionId || ''} onChange={handleFestivalFormChange} placeholder="Region ID" />
                          <Input name="timeOfYear" value={festivalForm.timeOfYear || ''} onChange={handleFestivalFormChange} placeholder="Time of Year" />
                        </div>
                        <div className="space-y-2">
                          <Input name="duration" value={festivalForm.duration || ''} onChange={handleFestivalFormChange} placeholder="Duration (days)" type="number" />
                          <input type="file" name="images" multiple accept="image/*" onChange={handleFestivalFormChange} />
                          <Input name="videoUrl" value={festivalForm.videoUrl || ''} onChange={handleFestivalFormChange} placeholder="Video URL" />
                        </div>
                        <div className="space-y-2">
                          <Input name="established" value={festivalForm.established || ''} onChange={handleFestivalFormChange} placeholder="Established" />
                          <Input name="historicalSignificance" value={festivalForm.historicalSignificance || ''} onChange={handleFestivalFormChange} placeholder="Historical Significance" />
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
            <div>
              <Button variant="outline" size="sm" onClick={() => setSelectedEntity(null)} className="mb-4">Back to Entities</Button>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Cuisines</h3>
                <Button size="sm" className="flex items-center gap-2" onClick={handleAddCuisine}><Plus className="w-4 h-4" /> Add New</Button>
              </div>
              {loadingCuisines ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="overflow-x-auto rounded shadow bg-white mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Region IDs</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cuisines.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-400">No data yet</TableCell>
                        </TableRow>
                      ) : cuisines.map(cuisine => (
                        <TableRow key={cuisine.id}>
                          <TableCell>{cuisine.name}</TableCell>
                          <TableCell>{cuisine.type}</TableCell>
                          <TableCell>{Array.isArray(cuisine.regionIds) ? cuisine.regionIds.join(', ') : ''}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleEditCuisine(cuisine)}><Pencil className="w-4 h-4" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteCuisine(cuisine.id)} className="ml-2"><Trash2 className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {/* Add/Edit Form Modal */}
              {showCuisineForm && (
                <Dialog open={showCuisineForm} onOpenChange={setShowCuisineForm}>
                  <DialogContent className="max-w-6xl">
                    <DialogHeader>
                      <DialogTitle>{editingCuisine ? 'Edit Cuisine' : 'Add Cuisine'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCuisineFormSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          {/* Multilingual Names */}
                          <Input name="name_en" value={cuisineForm.name_en} onChange={handleCuisineFormChange} placeholder="Name (EN)" required />
                          <Input name="name_ar" value={cuisineForm.name_ar || ''} onChange={handleCuisineFormChange} placeholder="Name (AR)" />
                          <Input name="name_fr" value={cuisineForm.name_fr || ''} onChange={handleCuisineFormChange} placeholder="Name (FR)" />
                          <Input name="name_it" value={cuisineForm.name_it || ''} onChange={handleCuisineFormChange} placeholder="Name (IT)" />
                          <Input name="name_es" value={cuisineForm.name_es || ''} onChange={handleCuisineFormChange} placeholder="Name (ES)" />
                        </div>
                        <div className="space-y-2">
                          {/* Multilingual Descriptions */}
                          <Input name="description_en" value={cuisineForm.description_en || ''} onChange={handleCuisineFormChange} placeholder="Description (EN)" />
                          <Input name="description_ar" value={cuisineForm.description_ar || ''} onChange={handleCuisineFormChange} placeholder="Description (AR)" />
                          <Input name="description_fr" value={cuisineForm.description_fr || ''} onChange={handleCuisineFormChange} placeholder="Description (FR)" />
                          <Input name="description_it" value={cuisineForm.description_it || ''} onChange={handleCuisineFormChange} placeholder="Description (IT)" />
                          <Input name="description_es" value={cuisineForm.description_es || ''} onChange={handleCuisineFormChange} placeholder="Description (ES)" />
                        </div>
                        <div className="space-y-2">
                          <Input name="type" value={cuisineForm.type || ''} onChange={handleCuisineFormChange} placeholder="Type" />
                        </div>
                        <div className="space-y-2">
                          <Input name="regionIds" value={Array.isArray(cuisineForm.regionIds) ? cuisineForm.regionIds.join(',') : ''} onChange={e => setCuisineForm({ ...cuisineForm, regionIds: e.target.value.split(',') })} placeholder="Region IDs (comma separated)" />
                          <Input name="ingredients" value={Array.isArray(cuisineForm.ingredients) ? cuisineForm.ingredients.join(',') : ''} onChange={e => setCuisineForm({ ...cuisineForm, ingredients: e.target.value.split(',') })} placeholder="Ingredients (comma separated)" />
                          <Input name="spiceLevel" value={cuisineForm.spiceLevel || ''} onChange={handleCuisineFormChange} placeholder="Spice Level" />
                        </div>
                        <div className="space-y-2">
                          <input type="file" name="images" multiple accept="image/*" onChange={handleCuisineFormChange} />
                          <Input name="videoUrl" value={cuisineForm.videoUrl || ''} onChange={handleCuisineFormChange} placeholder="Video URL" />
                          <Input name="popularVariants" value={Array.isArray(cuisineForm.popularVariants) ? cuisineForm.popularVariants.join(',') : ''} onChange={e => setCuisineForm({ ...cuisineForm, popularVariants: e.target.value.split(',') })} placeholder="Popular Variants (comma separated)" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">{editingCuisine ? 'Update' : 'Create'}</Button>
                        <Button type="button" variant="outline" onClick={() => setShowCuisineForm(false)}>Cancel</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : selectedEntity === 'heritage' ? (
            <div>
              <Button variant="outline" size="sm" onClick={() => setSelectedEntity(null)} className="mb-4">Back to Entities</Button>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Heritage</h3>
                <Button size="sm" className="flex items-center gap-2" onClick={handleAddHeritage}><Plus className="w-4 h-4" /> Add New</Button>
              </div>
              {loadingHeritage ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="overflow-x-auto rounded shadow bg-white mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Region ID</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {heritage.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-400">No data yet</TableCell>
                        </TableRow>
                      ) : heritage.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{Array.isArray(item.regionIds) ? item.regionIds.join(', ') : ''}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleEditHeritage(item)}><Pencil className="w-4 h-4" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteHeritage(item.id)} className="ml-2"><Trash2 className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {/* Add/Edit Form Modal */}
              {showHeritageForm && (
                <Dialog open={showHeritageForm} onOpenChange={setShowHeritageForm}>
                  <DialogContent className="max-w-6xl">
                    <DialogHeader>
                      <DialogTitle>{editingHeritage ? 'Edit Heritage' : 'Add Heritage'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleHeritageFormSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          {/* Multilingual Names */}
                          <Input name="name_en" value={heritageForm.name_en} onChange={handleHeritageFormChange} placeholder="Name (EN)" required />
                          <Input name="name_ar" value={heritageForm.name_ar || ''} onChange={handleHeritageFormChange} placeholder="Name (AR)" />
                          <Input name="name_fr" value={heritageForm.name_fr || ''} onChange={handleHeritageFormChange} placeholder="Name (FR)" />
                          <Input name="name_it" value={heritageForm.name_it || ''} onChange={handleHeritageFormChange} placeholder="Name (IT)" />
                          <Input name="name_es" value={heritageForm.name_es || ''} onChange={handleHeritageFormChange} placeholder="Name (ES)" />
                        </div>
                        <div className="space-y-2">
                          {/* Multilingual Descriptions */}
                          <Input name="description_en" value={heritageForm.description_en || ''} onChange={handleHeritageFormChange} placeholder="Description (EN)" />
                          <Input name="description_ar" value={heritageForm.description_ar || ''} onChange={handleHeritageFormChange} placeholder="Description (AR)" />
                          <Input name="description_fr" value={heritageForm.description_fr || ''} onChange={handleHeritageFormChange} placeholder="Description (FR)" />
                          <Input name="description_it" value={heritageForm.description_it || ''} onChange={handleHeritageFormChange} placeholder="Description (IT)" />
                          <Input name="description_es" value={heritageForm.description_es || ''} onChange={handleHeritageFormChange} placeholder="Description (ES)" />
                        </div>
                        <div className="space-y-2">
                          <Input name="type" value={heritageForm.type || ''} onChange={handleHeritageFormChange} placeholder="Type" />
                        </div>
                        <div className="space-y-2">
                          <Input name="regionIds" value={Array.isArray(heritageForm.regionIds) ? heritageForm.regionIds.join(',') : ''} onChange={e => setHeritageForm({ ...heritageForm, regionIds: e.target.value.split(',') })} placeholder="Region IDs (comma separated)" />
                          <input type="file" name="images" multiple accept="image/*" onChange={handleHeritageFormChange} />
                          <Input name="videoUrl" value={heritageForm.videoUrl || ''} onChange={handleHeritageFormChange} placeholder="Video URL" />
                        </div>
                        <div className="space-y-2">
                          <Input name="importance" value={heritageForm.importance || ''} onChange={handleHeritageFormChange} placeholder="Importance" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">{editingHeritage ? 'Update' : 'Create'}</Button>
                        <Button type="button" variant="outline" onClick={() => setShowHeritageForm(false)}>Cancel</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : selectedEntity === 'clothing' ? (
            <div>
              <Button variant="outline" size="sm" onClick={() => setSelectedEntity(null)} className="mb-4">Back to Entities</Button>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Clothing</h3>
                <Button size="sm" className="flex items-center gap-2" onClick={handleAddClothing}><Plus className="w-4 h-4" /> Add New</Button>
              </div>
              {loadingClothing ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="overflow-x-auto rounded shadow bg-white mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Region ID</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clothing.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-400">No data yet</TableCell>
                        </TableRow>
                      ) : clothing.map(item => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.gender}</TableCell>
                          <TableCell>{Array.isArray(item.regionIds) ? item.regionIds.join(', ') : ''}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => handleEditClothing(item)}><Pencil className="w-4 h-4" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteClothing(item.id)} className="ml-2"><Trash2 className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {/* Add/Edit Form Modal */}
              {showClothingForm && (
                <Dialog open={showClothingForm} onOpenChange={setShowClothingForm}>
                  <DialogContent className="max-w-6xl">
                    <DialogHeader>
                      <DialogTitle>{editingClothing ? 'Edit Clothing' : 'Add Clothing'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleClothingFormSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          {/* Multilingual Names */}
                          <Input name="name_en" value={clothingForm.name_en} onChange={handleClothingFormChange} placeholder="Name (EN)" required />
                          <Input name="name_ar" value={clothingForm.name_ar || ''} onChange={handleClothingFormChange} placeholder="Name (AR)" />
                          <Input name="name_fr" value={clothingForm.name_fr || ''} onChange={handleClothingFormChange} placeholder="Name (FR)" />
                          <Input name="name_it" value={clothingForm.name_it || ''} onChange={handleClothingFormChange} placeholder="Name (IT)" />
                          <Input name="name_es" value={clothingForm.name_es || ''} onChange={handleClothingFormChange} placeholder="Name (ES)" />
                        </div>
                        <div className="space-y-2">
                          {/* Multilingual Descriptions */}
                          <Input name="description_en" value={clothingForm.description_en || ''} onChange={handleClothingFormChange} placeholder="Description (EN)" />
                          <Input name="description_ar" value={clothingForm.description_ar || ''} onChange={handleClothingFormChange} placeholder="Description (AR)" />
                          <Input name="description_fr" value={clothingForm.description_fr || ''} onChange={handleClothingFormChange} placeholder="Description (FR)" />
                          <Input name="description_it" value={clothingForm.description_it || ''} onChange={handleClothingFormChange} placeholder="Description (IT)" />
                          <Input name="description_es" value={clothingForm.description_es || ''} onChange={handleClothingFormChange} placeholder="Description (ES)" />
                        </div>
                        <div className="space-y-2">
                          <Input name="gender" value={clothingForm.gender || ''} onChange={handleClothingFormChange} placeholder="Gender (male, female, unisex)" />
                        </div>
                        <div className="space-y-2">
                          <Input name="regionIds" value={Array.isArray(clothingForm.regionIds) ? clothingForm.regionIds.join(',') : ''} onChange={e => setClothingForm({ ...clothingForm, regionIds: e.target.value.split(',') })} placeholder="Region IDs (comma separated)" />
                          <Input name="materials" value={Array.isArray(clothingForm.materials) ? clothingForm.materials.join(',') : ''} onChange={e => setClothingForm({ ...clothingForm, materials: e.target.value.split(',') })} placeholder="Materials (comma separated)" />
                          <Input name="occasions" value={Array.isArray(clothingForm.occasions) ? clothingForm.occasions.join(',') : ''} onChange={e => setClothingForm({ ...clothingForm, occasions: e.target.value.split(',') })} placeholder="Occasions (comma separated)" />
                        </div>
                        <div className="space-y-2">
                          <input type="file" name="images" multiple accept="image/*" onChange={handleClothingFormChange} />
                          <Input name="historicalNotes" value={clothingForm.historicalNotes || ''} onChange={handleClothingFormChange} placeholder="Historical Notes" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">{editingClothing ? 'Update' : 'Create'}</Button>
                        <Button type="button" variant="outline" onClick={() => setShowClothingForm(false)}>Cancel</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;