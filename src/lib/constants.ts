export const BANGLADESH_DISTRICTS = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura", "Brahmanbaria",
  "Chandpur", "Chattogram", "Chuadanga", "Cox's Bazar", "Cumilla", "Dhaka",
  "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj", "Habiganj",
  "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachhari",
  "Khulna", "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat",
  "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj",
  "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore",
  "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali",
  "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur", "Satkhira",
  "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon"
] as const;

export type District = typeof BANGLADESH_DISTRICTS[number];

export const PET_TYPES = ["DOG", "CAT", "BIRD", "RABBIT", "FISH", "OTHER"] as const;
export type PetType = typeof PET_TYPES[number];

export const SERVICE_CATEGORIES = [
  "VETERINARY",
  "GROOMING",
  "BOARDING",
  "TRAINING",
  "VACCINATION",
  "SURGERY",
  "DENTAL",
  "DIAGNOSTICS"
] as const;
export type ServiceCategory = typeof SERVICE_CATEGORIES[number];

export const DEFAULT_PAGE_LIMIT = 12;
