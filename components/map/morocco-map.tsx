'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getCityImage } from '@/lib/placeholder-images'

// Dynamically import the map to avoid SSR issues
const DynamicMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[600px] items-center justify-center rounded-lg bg-muted">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
})

export interface MoroccoCityData {
  id: string
  name: string
  nameAr: string
  coordinates: [number, number]
  region: string
  population: number
  description: string
  descriptionAr: string
  attractions: string[]
  attractionsAr: string[]
  image: string
}

// Morocco cities data with coordinates and information
export const moroccoCities: MoroccoCityData[] = [
  {
    id: 'casablanca',
    name: 'Casablanca',
    nameAr: 'الدار البيضاء',
    coordinates: [33.5731, -7.5898],
    region: 'Casablanca-Settat',
    population: 3359818,
    description: 'The economic capital of Morocco, famous for its modern architecture and the Hassan II Mosque.',
    descriptionAr: 'العاصمة الاقتصادية للمغرب، مشهورة بعمارتها الحديثة ومسجد الحسن الثاني.',
    attractions: ['Hassan II Mosque', 'Corniche Ain Diab', 'Morocco Mall', 'Old Medina'],
    attractionsAr: ['مسجد الحسن الثاني', 'كورنيش عين الذياب', 'مول المغرب', 'المدينة القديمة'],
    image: getCityImage('casablanca')
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    nameAr: 'مراكش',
    coordinates: [31.6295, -7.9811],
    region: 'Marrakech-Safi',
    population: 928850,
    description: 'The Red City, known for its vibrant souks, palaces, and the famous Jemaa el-Fnaa square.',
    descriptionAr: 'المدينة الحمراء، معروفة بأسواقها النابضة بالحياة وقصورها وساحة جامع الفنا الشهيرة.',
    attractions: ['Jemaa el-Fnaa', 'Bahia Palace', 'Saadian Tombs', 'Majorelle Garden'],
    attractionsAr: ['ساحة جامع الفنا', 'قصر الباهية', 'قبور السعديين', 'حديقة ماجوريل'],
    image: getCityImage('marrakech')
  },
  {
    id: 'fes',
    name: 'Fes',
    nameAr: 'فاس',
    coordinates: [34.0181, -5.0078],
    region: 'Fès-Meknès',
    population: 1112072,
    description: 'The spiritual and cultural capital, home to the world\'s oldest university and a UNESCO World Heritage medina.',
    descriptionAr: 'العاصمة الروحية والثقافية، موطن أقدم جامعة في العالم ومدينة قديمة مدرجة في التراث العالمي لليونسكو.',
    attractions: ['Fes el-Bali', 'University of Al Quaraouiyine', 'Bou Inania Madrasa', 'Chouara Tannery'],
    attractionsAr: ['فاس البالي', 'جامعة القرويين', 'مدرسة بو عنانية', 'دباغة الشوارة'],
    image: getCityImage('fes')
  },
  {
    id: 'rabat',
    name: 'Rabat',
    nameAr: 'الرباط',
    coordinates: [34.0209, -6.8416],
    region: 'Rabat-Salé-Kénitra',
    population: 577827,
    description: 'The capital city of Morocco, featuring royal palaces, government buildings, and historical sites.',
    descriptionAr: 'عاصمة المغرب، تضم القصور الملكية والمباني الحكومية والمواقع التاريخية.',
    attractions: ['Hassan Tower', 'Kasbah of the Udayas', 'Royal Palace', 'Chellah'],
    attractionsAr: ['صومعة حسان', 'قصبة الأوداية', 'القصر الملكي', 'شالة'],
    image: getCityImage('rabat')
  },
  {
    id: 'tangier',
    name: 'Tangier',
    nameAr: 'طنجة',
    coordinates: [35.7595, -5.8340],
    region: 'Tanger-Tétouan-Al Hoceïma',
    population: 947952,
    description: 'The gateway to Africa, where the Mediterranean meets the Atlantic, rich in history and culture.',
    descriptionAr: 'بوابة أفريقيا، حيث يلتقي البحر الأبيض المتوسط بالمحيط الأطلسي، غنية بالتاريخ والثقافة.',
    attractions: ['Cape Spartel', 'Hercules Caves', 'Kasbah Museum', 'Grand Socco'],
    attractionsAr: ['رأس سبارطيل', 'مغارة هرقل', 'متحف القصبة', 'السوق الكبير'],
    image: getCityImage('tangier')
  },
  {
    id: 'agadir',
    name: 'Agadir',
    nameAr: 'أكادير',
    coordinates: [30.4278, -9.5981],
    region: 'Souss-Massa',
    population: 421844,
    description: 'A modern beach resort city on the Atlantic coast, known for its beautiful beaches and golf courses.',
    descriptionAr: 'مدينة منتجع شاطئية حديثة على ساحل المحيط الأطلسي، معروفة بشواطئها الجميلة وملاعب الغولف.',
    attractions: ['Agadir Beach', 'Souk El Had', 'Agadir Kasbah', 'Valley of the Birds'],
    attractionsAr: ['شاطئ أكادير', 'سوق الأحد', 'قصبة أكادير', 'وادي الطيور'],
    image: getCityImage('agadir')
  },
  {
    id: 'meknes',
    name: 'Meknes',
    nameAr: 'مكناس',
    coordinates: [33.8935, -5.5473],
    region: 'Fès-Meknès',
    population: 632079,
    description: 'The Imperial City, known for its grand architecture and historical significance during the Alaouite dynasty.',
    descriptionAr: 'المدينة الإمبراطورية، معروفة بعمارتها الفخمة وأهميتها التاريخية خلال الدولة العلوية.',
    attractions: ['Bab Mansour', 'Mausoleum of Moulay Ismail', 'Heri es-Souani', 'Place El Hedim'],
    attractionsAr: ['باب منصور', 'ضريح مولاي إسماعيل', 'هري السواني', 'ساحة الهديم'],
    image: getCityImage('meknes')
  },
  {
    id: 'ouarzazate',
    name: 'Ouarzazate',
    nameAr: 'ورزازات',
    coordinates: [30.9335, -6.9370],
    region: 'Drâa-Tafilalet',
    population: 71067,
    description: 'The gateway to the Sahara Desert, famous as a filming location for many Hollywood movies.',
    descriptionAr: 'بوابة الصحراء الكبرى، مشهورة كموقع تصوير للعديد من أفلام هوليوود.',
    attractions: ['Ait Benhaddou', 'Atlas Film Studios', 'Taourirt Kasbah', 'Fint Oasis'],
    attractionsAr: ['آيت بن حدو', 'استوديوهات أطلس للسينما', 'قصبة تاوريرت', 'واحة فينت'],
    image: getCityImage('ouarzazate')
  },
  {
    id: 'chefchaouen',
    name: 'Chefchaouen',
    nameAr: 'شفشاون',
    coordinates: [35.1689, -5.2636],
    region: 'Tanger-Tétouan-Al Hoceïma',
    population: 42786,
    description: 'The Blue Pearl of Morocco, a picturesque mountain town painted in shades of blue.',
    descriptionAr: 'اللؤلؤة الزرقاء للمغرب، مدينة جبلية خلابة مطلية بدرجات اللون الأزرق.',
    attractions: ['Blue Streets', 'Kasbah Museum', 'Ras El Maa Waterfall', 'Spanish Mosque'],
    attractionsAr: ['الشوارع الزرقاء', 'متحف القصبة', 'شلال رأس الماء', 'المسجد الإسباني'],
    image: getCityImage('chefchaouen')
  },
  {
    id: 'essaouira',
    name: 'Essaouira',
    nameAr: 'الصويرة',
    coordinates: [31.5085, -9.7595],
    region: 'Marrakech-Safi',
    population: 77966,
    description: 'A charming coastal city known for its Portuguese-influenced architecture and vibrant arts scene.',
    descriptionAr: 'مدينة ساحلية ساحرة معروفة بعمارتها المتأثرة بالطراز البرتغالي ومشهدها الفني النابض بالحياة.',
    attractions: ['Essaouira Medina', 'Skala de la Ville', 'Essaouira Beach', 'Port of Essaouira'],
    attractionsAr: ['مدينة الصويرة القديمة', 'صقالة المدينة', 'شاطئ الصويرة', 'ميناء الصويرة'],
    image: getCityImage('essaouira')
  }
]

export function MoroccoMap() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCityClick = (cityId: string) => {
    router.push(`/discovery/cities/${cityId}`)
  }

  if (!mounted) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-lg bg-muted">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[600px] w-full overflow-hidden rounded-lg border shadow-lg">
      <DynamicMap cities={moroccoCities} onCityClick={handleCityClick} />
    </div>
  )
}