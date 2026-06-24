import {
  FileText,
  Plane,
  Stamp,
  Languages,
  Users,
  ShieldCheck,
  Heart,
  Target,
  Globe,
  User,
  Briefcase,
  Shield,
  FileCheck,
} from "lucide-react";

export const ICON_MAP = {
  FileText,
  Plane,
  Stamp,
  Languages,
  Users,
  ShieldCheck,
  Heart,
  Target,
  Globe,
  User,
  Briefcase,
  Shield,
  FileCheck,
};

export function getIcon(name) {
  return ICON_MAP[name] || FileText;
}
