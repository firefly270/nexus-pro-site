export type Vendor = 'nvidia' | 'amd' | 'intel'

export type CardVariant = 'gpu' | 'cpu'

export type Era = 'blueprint' | 'acceleration' | 'neural'

export interface Chapter {
  id: string;
  label: string;
  vendor: Vendor;
  era: Era;
}

export interface GPUCardData {
  name: string
  year: string
  codename: string
  transistors: string
  clock: string
  cudaCores: string
  memory: string
  highlight: string
  features: string[]
  transistorScale: number
  variant?: 'gpu'
}

export interface CPUCardData {
  name: string
  year: string
  codename: string
  transistors: string
  clock: string
  cores: string
  threads: string
  cache: string
  tdp: string
  highlight: string
  features: string[]
  transistorScale: number
  variant: 'cpu'
}

export type CardData = GPUCardData | CPUCardData

export interface TypefaceConfig {
  fontFamily: string
  displayWeight: string
  headingWeight: string
  tracking: string
}

export interface VendorConfig {
  label: string
  color: string
  accent: string
  bgFrom: string
  bgTo: string
  icon: string
  tagline: string
  description: string
  heroTitle: string
  heroSubtitle: string
  typeface: TypefaceConfig
}
