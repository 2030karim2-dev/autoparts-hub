import sparkPlug from "@/assets/spark-plug.png";
import brakePads from "@/assets/brake-pads.png";
import headlight from "@/assets/headlight.png";
import controlArm from "@/assets/control-arm.png";
import engineMount from "@/assets/engine-mount.png";
import airFilter from "@/assets/air-filter.png";
import oilFilter from "@/assets/oil-filter.png";
import shockAbsorbers from "@/assets/shock-absorbers.png";

export interface Product {
  id: string;
  name: string;
  oem: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  compat: string[];
  inStock: boolean;
  isFavorite?: boolean;
}

export const products: Product[] = [
  {
    id: "shock-1",
    name: "ممتصات صدمات أمامية",
    oem: "54660-D3100",
    sku: "SA-SH-001",
    brand: "Days Automotive",
    category: "ممتصات صدمات",
    price: 220,
    oldPrice: 340,
    discount: 35,
    rating: 4.7,
    reviews: 312,
    image: shockAbsorbers,
    compat: ["Hyundai Tucson 2016-2020", "Kia Sportage 2017-2021"],
    inStock: true,
  },
  {
    id: "filter-1",
    name: "فلتر هواء المقصورة",
    oem: "97133-D3000",
    sku: "SA-AF-002",
    brand: "Mann Filter",
    category: "فلتر هواء",
    price: 55.5,
    oldPrice: 79.3,
    discount: 30,
    rating: 5,
    reviews: 189,
    image: airFilter,
    compat: ["Hyundai Tucson 2016-2021"],
    inStock: true,
  },
  {
    id: "control-1",
    name: "ذراع تحكم أمامي يسار",
    oem: "54500-D3100",
    sku: "SA-CA-003",
    brand: "Days Automotive",
    category: "ذراع تحكم",
    price: 132,
    oldPrice: 165,
    discount: 20,
    rating: 4.8,
    reviews: 715,
    image: controlArm,
    compat: ["Hyundai Tucson 2016-2021", "Kia Sportage 2017-2021"],
    inStock: true,
  },
  {
    id: "oil-1",
    name: "فلتر زيت",
    oem: "26300-35504",
    sku: "SA-OF-004",
    brand: "Hyundai Genuine",
    category: "فلتر زيت",
    price: 24.75,
    oldPrice: 32,
    discount: 23,
    rating: 4.9,
    reviews: 1024,
    image: oilFilter,
    compat: ["Hyundai Tucson 2016-2021", "Hyundai Sonata 2015-2020"],
    inStock: true,
  },
  {
    id: "spark-1",
    name: "شمعة إشعال إيريديوم",
    oem: "18846-11070",
    sku: "SA-SP-005",
    brand: "NGK",
    category: "شمعات إشعال",
    price: 35,
    oldPrice: 48,
    discount: 27,
    rating: 4.6,
    reviews: 543,
    image: sparkPlug,
    compat: ["Hyundai Tucson 2016-2021", "Kia Sportage 2017-2021"],
    inStock: true,
  },
  {
    id: "brake-1",
    name: "فحمات فرامل أمامية سيراميك",
    oem: "58101-D3A70",
    sku: "SA-BP-006",
    brand: "Brembo",
    category: "فحمات فرامل",
    price: 185,
    oldPrice: 240,
    discount: 23,
    rating: 4.9,
    reviews: 876,
    image: brakePads,
    compat: ["Hyundai Tucson 2016-2021"],
    inStock: true,
  },
  {
    id: "head-1",
    name: "مصباح أمامي LED يسار",
    oem: "92101-D3100",
    sku: "SA-HL-007",
    brand: "Depo",
    category: "إضاءة",
    price: 450,
    oldPrice: 580,
    discount: 22,
    rating: 4.5,
    reviews: 234,
    image: headlight,
    compat: ["Hyundai Tucson 2016-2018"],
    inStock: false,
  },
  {
    id: "mount-1",
    name: "قاعدة محرك أمامية",
    oem: "21810-D3100",
    sku: "SA-EM-008",
    brand: "Lemforder",
    category: "قاعدة محرك",
    price: 175,
    oldPrice: 220,
    discount: 20,
    rating: 4.4,
    reviews: 156,
    image: engineMount,
    compat: ["Hyundai Tucson 2016-2021"],
    inStock: true,
  },
];

export const categories = [
  { id: "spark-plugs", name: "شمعات إشعال", image: sparkPlug, count: 24 },
  { id: "brake-pads", name: "فحمات فرامل", image: brakePads, count: 18 },
  { id: "lighting", name: "إضاءة", image: headlight, count: 32 },
  { id: "control-arms", name: "ذراع تحكم", image: controlArm, count: 15 },
  { id: "engine-mounts", name: "قاعدة محرك", image: engineMount, count: 12 },
  { id: "air-filters", name: "فلتر هواء", image: airFilter, count: 28 },
  { id: "oil-filters", name: "فلتر زيت", image: oilFilter, count: 22 },
  { id: "shock-absorbers", name: "ممتصات صدمات", image: shockAbsorbers, count: 16 },
];

export const vehicleMakes = [
  { id: "hyundai", name: "هيونداي", nameEn: "Hyundai", models: ["توسان", "سوناتا", "إلنترا", "أكسنت", "كريتا", "سانتافي"] },
  { id: "toyota", name: "تويوتا", nameEn: "Toyota", models: ["كامري", "كورولا", "هايلكس", "لاندكروزر", "راف فور", "يارس"] },
  { id: "kia", name: "كيا", nameEn: "Kia", models: ["سبورتاج", "سيراتو", "أوبتيما", "بيكانتو", "سورينتو", "سيلتوس"] },
  { id: "nissan", name: "نيسان", nameEn: "Nissan", models: ["صني", "باثفايندر", "إكستيرا", "نافارا", "سنترا", "التيما"] },
  { id: "honda", name: "هوندا", nameEn: "Honda", models: ["سيفيك", "أكورد", "CR-V", "سيتي", "HR-V"] },
  { id: "mitsubishi", name: "ميتسوبيشي", nameEn: "Mitsubishi", models: ["باجيرو", "لانسر", "آوتلاندر", "L200"] },
  { id: "suzuki", name: "سوزوكي", nameEn: "Suzuki", models: ["سويفت", "فيتارا", "جيمني", "سياز", "ألتو"] },
];

export const years = Array.from({ length: 15 }, (_, i) => (2026 - i).toString());
