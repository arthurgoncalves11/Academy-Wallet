import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
 
interface LoadingWrapperProps {
  loading: boolean;
  skeletonWidth?: string;
  skeletonHeight?: string;
  mdSkeletonWidth?: string;
  mdSkeletonHeight?: string;
  children: React.ReactNode;
}
 
const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  skeletonWidth = "",
  skeletonHeight = "",
  mdSkeletonWidth = "",
  mdSkeletonHeight = "",
  children,
}) => {
  return loading ? (
    <Skeleton
      className={`md:mb-[0.563rem] mb-[0.75rem] lg:mb-[0.75rem] rounded-md bg-gradient-to-r from-[#E2E8F0] to-[#E6ECF4] ${mdSkeletonWidth} ${mdSkeletonHeight} ${skeletonWidth} ${skeletonHeight}`}
    />
  ) : (
    <>{children}</>
  );
};
 
export default LoadingWrapper;