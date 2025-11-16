import { NavLink as RouterNavLink, NavLinkProps, useLocation } from "react-router-dom";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Home, BarChart, Settings, FileText, Link2 } from "lucide-react";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  icon?: "home" | "analytics" | "settings" | "content" | "backlinks" | "none";
  label?: string;
}

// Icon mapping
const iconMap = {
  home: Home,
  analytics: BarChart,
  settings: Settings,
  content: FileText,
  backlinks: Link2,
  none: () => null
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, icon = "none", label, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();
    const isActive = location.pathname === to;
    const IconComponent = iconMap[icon];

    return (
      <div className="relative">
        {/* Active Indicator */}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"></div>
        )}
        
        <RouterNavLink
          ref={ref}
          to={to}
          className={({ isActive, isPending }) =>
            cn(
              "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group",
              isActive
                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-white shadow-lg shadow-purple-500/20 border border-purple-500/20"
                : "text-gray-300 hover:text-white hover:bg-white/5",
              isPending && "animate-pulse",
              className
            )
          }
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          {...props}
        >
          {/* Icon with Animation */}
          {IconComponent && (
            <div className="relative">
              <IconComponent 
                className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive ? "text-purple-400" : "text-gray-400 group-hover:text-purple-400"
                )}
              />
              {/* Icon Glow Effect */}
              {isActive && (
                <div className="absolute inset-0 blur-md bg-purple-400/30 rounded-full scale-150 -z-10"></div>
              )}
            </div>
          )}

          {/* Label */}
          {label && (
            <span className="font-medium">{label}</span>
          )}

          {/* Hover Arrow */}
          <ChevronRight 
            className={cn(
              "h-4 w-4 ml-auto transition-all duration-300",
              isActive ? "text-purple-400" : "text-gray-500 group-hover:text-purple-400",
              isHovered ? "translate-x-1" : "translate-x-0"
            )}
          />

          {/* Hover Effect Overlay */}
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-lg opacity-0 transition-opacity duration-300 pointer-events-none",
              isHovered && "opacity-100"
            )}
          ></div>
        </RouterNavLink>
      </div>
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };