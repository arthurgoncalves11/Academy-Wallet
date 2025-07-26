import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
 
interface LoadingWrapperProps {
  loading: boolean;
  skeletonWidth?: string;
  skeletonHeight?: string;
  children: React.ReactNode;
  className?: string;
}
 
const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  skeletonWidth = "100px",
  skeletonHeight = "20px",
  className,
  children,
}) => {
    return (
      <div className={className}>
        {loading ? (
          <Skeleton
            style={{
              width: skeletonWidth,
              height: skeletonHeight,
            }}
            className="rounded-md bg-gradient-to-r from-[#E2E8F0] to-[#E6ECF4]"
          />
        ) : (
          <>{children}</>
        )}
      </div>
    );
  };
 
export default LoadingWrapper;