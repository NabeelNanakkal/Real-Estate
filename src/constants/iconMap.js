import { FiHome, FiShoppingBag, FiTrendingUp, FiLayers, FiChevronRight, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { FaBuilding, FaBath, FaBed, FaSwimmingPool, FaDumbbell, FaSchool, FaParking } from 'react-icons/fa';

// Icon map for property amenities / nearby places
export const FEATURE_ICON_MAP = {
  elevator:  FiChevronRight,
  garden:    FaBed,
  wine:      FiCheckCircle,
  smart:     FiCheckCircle,
  pool:      FaSwimmingPool,
  dock:      FiCheckCircle,
  theater:   FiCheckCircle,
  gym:       FaDumbbell,
  fire:      FiCheckCircle,
  art:       FiCheckCircle,
  spa:       FiCheckCircle,
  kitchen:   FiCheckCircle,
  school:    FaSchool,
  hospital:  FiCheckCircle,
  shopping:  FiShoppingBag,
  transport: FiTruck,
  park:      FiCheckCircle,
  other:     FiCheckCircle,
};

// Icon map for property category keys (from DB iconKey field)
export const CATEGORY_ICON_MAP = {
  FiHome:       FiHome,
  FaBuilding:   FaBuilding,
  FiShoppingBag: FiShoppingBag,
  FiTrendingUp: FiTrendingUp,
  FiLayers:     FiLayers,
};

export { FaBath, FaBed, FaParking };
